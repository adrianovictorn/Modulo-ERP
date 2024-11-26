document.getElementById('clienteForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    // Limpar mensagens de erro
    document.getElementById('nomeError').textContent = '';
    document.getElementById('emailError').textContent = '';
    document.getElementById('telefoneError').textContent = '';
    document.getElementById('cpfCnpjError').textContent = '';
    document.getElementById('successMessage').textContent = '';

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;
    const cpfCnpj = document.getElementById('cpfCnpj').value;
    const tipoCliente = document.querySelector('select[name="tipoCliente"]').value;

    let hasError = false;

    // Validação do nome
    if (nome.length < 3) {
        document.getElementById('nomeError').textContent = 'O nome deve ter pelo menos 3 caracteres';
        hasError = true;
    }

    // Validação do email
    if (!validateEmail(email)) {
        document.getElementById('emailError').textContent = 'Email inválido';
        hasError = true;
    }

    // Validação do telefone
    if (!validateTelefone(telefone)) {
        document.getElementById('telefoneError').textContent = 'Telefone inválido';
        hasError = true;
    }

    // Validação do CPF ou CNPJ
    if (tipoCliente === "PF" && !validateCPF(cpfCnpj)) {
        document.getElementById('cpfCnpjError').textContent = 'CPF inválido';
        hasError = true;
    } else if (tipoCliente === "PJ" && !validateCNPJ(cpfCnpj)) {
        document.getElementById('cpfCnpjError').textContent = 'CNPJ inválido';
        hasError = true;
    }

    // Se houver erros, interrompe a execução
    if (hasError) return;

    const clienteData = {
        nome: nome,
        email: email,
        telefone: telefone.replace(/[^\d]/g, ''), // Remove formatação
        cpfCnpj: cpfCnpj.replace(/[^\d]/g, ''), // Remove formatação
        dataCadastro: new Date().toISOString() // Adiciona a data de cadastro
    };

    // Envia os dados ao servidor via fetch
    fetch('/clientes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(clienteData)
    })
    .then(response => {
        if (response.status === 409) {  // Conflito, CPF já cadastrado
            document.getElementById('successMessage').textContent = 'Erro: CPF/CNPJ já cadastrado.';
        } else if (response.ok) {
            document.getElementById('successMessage').textContent = 'Cliente cadastrado com sucesso!';
            document.getElementById('clienteForm').reset(); // Limpa o formulário
        } else {
            document.getElementById('successMessage').textContent = 'Erro ao cadastrar cliente.';
        }
    })
    .catch(error => {
        document.getElementById('successMessage').textContent = 'Erro: ' + error.message;
    });
});

// Atualização do campo Telefone com formatação dinâmica
document.getElementById('telefone').addEventListener('input', function() {
    this.value = formatarTelefone(this.value);
});

function formatarTelefone(value) {
    return value.replace(/\D/g, '') // Remove caracteres não numéricos
                .replace(/^(\d{2})(\d)/, '($1) $2') // Formato (DD) D
                .replace(/(\d{4,5})(\d)/, '$1-$2'); // Formato XXXX-XXXX ou XXXXX-XXXX
}

// Atualização do campo CPF ou CNPJ com formatação dinâmica
document.getElementById('cpfCnpj').addEventListener('input', function() {
    this.value = formatarDocumento(this.value);
});

function formatarDocumento(value) {
    const tipoCliente = document.querySelector('select[name="tipoCliente"]').value;
    if (tipoCliente === "PF") {
        return value.replace(/(\d{3})(\d)/, '$1.$2')
                    .replace(/(\d{3})(\d)/, '$1.$2')
                    .replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // CPF: 000.000.000-00
    } else {
        return value.replace(/(\d{2})(\d)/, '$1.$2')
                    .replace(/(\d{3})(\d)/, '$1/$2')
                    .replace(/(\d{4})(\d{1,2})$/, '$1-$2'); // CNPJ: 00.000.000/0000-00
    }
}

// Função de validação de email
function validateEmail(email) {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(email);
}

// Função de validação de telefone (aceita formatos com ou sem o nono dígito)
function validateTelefone(telefone) {
    const re = /^\(\d{2}\) \d{4,5}-\d{4}$/; // Aceita (DD) XXXX-XXXX ou (DD) XXXXX-XXXX
    return re.test(telefone);
}

// Função de validação simplificada de CPF
function validateCPF(cpf) {
    const cleanedCPF = cpf.replace(/\D/g, ''); 
    return cleanedCPF.length === 11 && !isNaN(cleanedCPF); // CPF deve ter 11 dígitos
}

// Função de validação simplificada de CNPJ
function validateCNPJ(cnpj) {
    const cleanedCNPJ = cnpj.replace(/\D/g, ''); 
    return cleanedCNPJ.length === 14 && !isNaN(cleanedCNPJ); // CNPJ deve ter 14 dígitos
}
