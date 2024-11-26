let enderecos = [];
let documentos = [];
let contatos = [];

function addEndereco() {
    const endereco = `
        <div class="endereco">
            <label for="tipoEndereco">Tipo de Endereço:</label>
            <select name="tipoEndereco">
                <option value="RESIDENCIAL">Residencial</option>
                <option value="COMERCIAL">Comercial</option>
                <option value="FATURAMENTO">Faturamento</option>
                <option value="ENTREGA">Entrega</option>
            </select><br>

            <label for="cep">CEP:</label>
            <input type="text" name="cep" onblur="buscarCep('outro')"><br>
            
            <label for="logradouro">Logradouro:</label>
            <input type="text" name="logradouro" required><br>

            <label for="numero">Número:</label>
            <input type="text" name="numero" required><br>

            <label for="complemento">Complemento:</label>
            <input type="text" name="complemento"><br>

            <label for="bairro">Bairro:</label>
            <input type="text" name="bairro" required><br>

            <label for="cidade">Cidade:</label>
            <input type="text" name="cidade" required><br>

            <label for="estado">Estado:</label>
            <input type="text" name="estado" required><br>

            

            <label for="pais">País:</label>
            <input type="text" name="pais" value="Brasil" required><br>
        </div>
    `;
    document.getElementById('enderecos').innerHTML += endereco;
}

function addDocumento() {
    const documento = `
        <div class="documento">
            <label for="tipoDocumento">Tipo de Documento:</label>
            <select name="tipoDocumento">
                <option value="RG">RG</option>
                <option value="CNH">CNH</option>
                <option value="INSCRICAO_ESTADUAL">Inscrição Estadual</option>
                <option value="PASSAPORTE">Passaporte</option>
            </select><br>

            <label for="numero">Número:</label>
            <input type="text" name="numero" required><br>

            <label for="dataEmissao">Data de Emissão:</label>
            <input type="date" name="dataEmissao" required><br>

            <label for="orgaoEmissor">Órgão Emissor:</label>
            <input type="text" name="orgaoEmissor" required><br>
        </div>
    `;
    document.getElementById('documentos').innerHTML += documento;
}

function addContato() {
    const contato = `
        <div class="contato">
            <label for="nome">Nome:</label>
            <input type="text" name="nome" required><br>

            <label for="email">Email:</label>
            <input type="email" name="email" required><br>

            <label for="telefone">Telefone:</label>
            <input type="text" name="telefone" required><br>

            <label for="cargo">Cargo:</label>
            <input type="text" name="cargo" required><br>
        </div>
    `;
    document.getElementById('contatos').innerHTML += contato;
}

function buscarCep(tipo) {
    const cep = tipo === 'principal' ? document.getElementById("cepPrincipal").value : document.querySelector('#enderecos .endereco:last-child input[name="cep"]').value;
    const url = `https://viacep.com.br/ws/${cep}/json/`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (!data.erro) {
                if (tipo === 'principal') {
                    document.getElementById("logradouroPrincipal").value = data.logradouro;
                    document.getElementById("bairroPrincipal").value = data.bairro;
                    document.getElementById("cidadePrincipal").value = data.localidade;
                    document.getElementById("estadoPrincipal").value = data.uf;
                } else {
                    const lastEndereco = document.querySelector('#enderecos .endereco:last-child');
                    lastEndereco.querySelector('input[name="logradouro"]').value = data.logradouro;
                    lastEndereco.querySelector('input[name="bairro"]').value = data.bairro;
                    lastEndereco.querySelector('input[name="cidade"]').value = data.localidade;
                    lastEndereco.querySelector('input[name="estado"]').value = data.uf;
                }
            } else {
                alert('CEP não encontrado.');
            }
        })
        .catch(error => {
            console.error('Erro ao buscar CEP:', error);
            alert('Erro ao buscar CEP.');
        });
}

document.getElementById('cpfCnpj').addEventListener('input', function (e) {
    const input = e.target;
    let value = input.value.replace(/\D/g, ''); // Remove caracteres não numéricos
    const length = value.length;

    if (length <= 11) {
        // CPF: XXX.XXX.XXX-XX
        value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, function (_, p1, p2, p3, p4) {
            return `${p1}.${p2}.${p3}${p4 ? '-' + p4 : ''}`;
        });
    } else {
        // CNPJ: XX.XXX.XXX/XXXX-XX
        value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/, function (_, p1, p2, p3, p4, p5) {
            return `${p1}.${p2}.${p3}/${p4}${p5 ? '-' + p5 : ''}`;
        });
    }

    input.value = value;

    // Evita disparar alertas até que todos os caracteres sejam preenchidos
    if ((length !== 11 && length !== 14) && e.inputType === 'insertText') {
        input.setCustomValidity('CPF deve ter 11 dígitos e CNPJ deve ter 14 dígitos.');
    } else {
        input.setCustomValidity('');
    }
});

function submitForm() {
    const cpfCnpj = document.getElementById("cpfCnpj").value.replace(/\D/g, ''); // Remove caracteres especiais

    if (cpfCnpj.length !== 11 && cpfCnpj.length !== 14) {
        alert("Por favor, preencha corretamente o CPF ou CNPJ.");
        return;
    }

    const cliente = {
        nome: document.getElementById("nome").value,
        tipoCliente: document.getElementById("tipoCliente").value,
        cpfCnpj: cpfCnpj,
        email: document.getElementById("email").value,
        telefone: document.getElementById("telefone").value,
        status: true,
        dataCadastro: new Date().toISOString(),
        enderecoPrincipal: {
            tipoEndereco: document.getElementById("tipoEnderecoPrincipal").value,
            logradouro: document.getElementById("logradouroPrincipal").value,
            numero: document.getElementById("numeroPrincipal").value,
            complemento: document.getElementById("complementoPrincipal").value,
            bairro: document.getElementById("bairroPrincipal").value,
            cidade: document.getElementById("cidadePrincipal").value,
            estado: document.getElementById("estadoPrincipal").value,
            cep: document.getElementById("cepPrincipal").value,
            pais: document.getElementById("paisPrincipal").value
        },
        enderecos: Array.from(document.querySelectorAll('#enderecos .endereco')).map(endereco => ({
            tipoEndereco: endereco.querySelector('select[name="tipoEndereco"]').value,
            logradouro: endereco.querySelector('input[name="logradouro"]').value,
            numero: endereco.querySelector('input[name="numero"]').value,
            complemento: endereco.querySelector('input[name="complemento"]').value,
            bairro: endereco.querySelector('input[name="bairro"]').value,
            cidade: endereco.querySelector('input[name="cidade"]').value,
            estado: endereco.querySelector('input[name="estado"]').value,
            cep: endereco.querySelector('input[name="cep"]').value,
            pais: 'Brasil'
        })),
        documentos: Array.from(document.querySelectorAll('#documentos .documento')).map(documento => ({
            tipoDocumento: documento.querySelector('select[name="tipoDocumento"]').value,
            numero: documento.querySelector('input[name="numero"]').value,
            dataEmissao: documento.querySelector('input[name="dataEmissao"]').value,
            orgaoEmissor: documento.querySelector('input[name="orgaoEmissor"]').value
        })),
        contatos: Array.from(document.querySelectorAll('#contatos .contato')).map(contato => ({
            nome: contato.querySelector('input[name="nome"]').value,
            email: contato.querySelector('input[name="email"]').value,
            telefone: contato.querySelector('input[name="telefone"]').value,
            cargo: contato.querySelector('input[name="cargo"]').value
        }))
    };

    fetch('/clientes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(cliente)
    })
        .then(response => {
            if (response.ok) {
                alert('Cliente cadastrado com sucesso!');
                document.getElementById("clienteForm").reset();
            } else {
                alert('Erro ao cadastrar cliente.');
            }
        })
        .catch(error => {
            console.error('Erro ao cadastrar cliente:', error);
            alert('Erro ao cadastrar cliente.');
        });
}
