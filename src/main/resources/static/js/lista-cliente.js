document.addEventListener('DOMContentLoaded', function() {
    fetchUserData();
});

function fetchUserData() {
    fetch('http://localhost:8080/clientes') // Ajuste o endpoint conforme necessário
        .then(response => response.json())
        .then(data => renderUserData(data))
        .catch(error => console.error('Erro ao buscar dados do usuário:', error));
}

function renderUserData(users) {
    const userDetailsDiv = document.getElementById('user-details');
    userDetailsDiv.innerHTML = '';

    users.forEach(user => {
        // Card de dados do cliente
        const userCard = document.createElement('div');
        userCard.classList.add('data-card');

        const userHeader = document.createElement('h2');
        userHeader.textContent = `Cliente: ${user.nome} (CPF/CNPJ: ${user.cpfCnpj})`;
        userCard.appendChild(userHeader);

        const email = document.createElement('p');
        email.textContent = `Email: ${user.email}`;
        userCard.appendChild(email);

        const dataCadastro = document.createElement('p');
        dataCadastro.textContent = `Data de Cadastro: ${user.dataCadastro}`;
        userCard.appendChild(dataCadastro);

        // Sessão de Endereços
        if (user.enderecos && user.enderecos.length > 0) {
            const enderecoSection = document.createElement('div');
            enderecoSection.classList.add('sub-section');

            const enderecoHeader = document.createElement('h3');
            enderecoHeader.textContent = 'Endereços:';
            enderecoSection.appendChild(enderecoHeader);

            const enderecoList = document.createElement('ul');
            user.enderecos.forEach(endereco => {
                const enderecoItem = document.createElement('li');
                enderecoItem.innerHTML = `
                    <span>Logradouro:</span> ${endereco.logradouro}, 
                    <span>Número:</span> ${endereco.numero}, 
                    <span>Cidade:</span> ${endereco.cidade}, 
                    <span>Estado:</span> ${endereco.estado}, 
                    <span>CEP:</span> ${endereco.cep}`;
                enderecoList.appendChild(enderecoItem);
            });
            enderecoSection.appendChild(enderecoList);
            userCard.appendChild(enderecoSection);
        }

        // Sessão de Contatos
        if (user.contatos && user.contatos.length > 0) {
            const contatoSection = document.createElement('div');
            contatoSection.classList.add('sub-section');

            const contatoHeader = document.createElement('h3');
            contatoHeader.textContent = 'Contatos:';
            contatoSection.appendChild(contatoHeader);

            const contatoList = document.createElement('ul');
            user.contatos.forEach(contato => {
                const contatoItem = document.createElement('li');
                contatoItem.innerHTML = `<span>${contato.tipo}:</span> ${contato.valor}`;
                contatoList.appendChild(contatoItem);
            });
            contatoSection.appendChild(contatoList);
            userCard.appendChild(contatoSection);
        }

        // Sessão de Documentos
        if (user.documentos && user.documentos.length > 0) {
            const documentoSection = document.createElement('div');
            documentoSection.classList.add('sub-section');

            const documentoHeader = document.createElement('h3');
            documentoHeader.textContent = 'Documentos:';
            documentoSection.appendChild(documentoHeader);

            const documentoList = document.createElement('ul');
            user.documentos.forEach(documento => {
                const documentoItem = document.createElement('li');
                documentoItem.innerHTML = `<span>Tipo:</span> ${documento.tipo}, <span>Número:</span> ${documento.numero}`;
                documentoList.appendChild(documentoItem);
            });
            documentoSection.appendChild(documentoList);
            userCard.appendChild(documentoSection);
        }

        userDetailsDiv.appendChild(userCard);
    });
}
