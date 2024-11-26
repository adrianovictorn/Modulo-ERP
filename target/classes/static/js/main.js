const host = 'http://localhost';
const port = '8080';

let customersData = null;
let selectedCustomer = null;
let friendsData = null;
let selectedFriend= null;
let adressData = null;
let selectedAdress= null;
let documentData = null;
let selectedDocument= null;

async function getCustomers() {
    customersData = await getContent('clientes');
    if (!customersData) return;
    const search = document.getElementById('searchCustomer');
    buildCustomers(search? search.value : '');
}

async function getFriends(flow = null) {
    friendsData = await getContent('api/contatos');
    if (!friendsData) return;
    const search = document.getElementById('searchFriend');
    await getCustomers();
    if(!flow) buildFriends(search? search.value : '');
}

async function getAdress(flow = null) {
    adressData = await getContent('api/enderecos');
    if (!adressData) return;
    const search = document.getElementById('searchAdress');
    await getCustomers();
    if(!flow) buildAdress(search? search.value : '');
}

async function getDocument(flow = null) {
    documentData = await getContent('api/documentos');
    if (!documentData) return;
    const search = document.getElementById('searchDocument');
    await getCustomers();
    if(!flow) buildDocument(search? search.value : '');
}

function buildCustomers(value) {
    const element = document.getElementById('customer-area');
    if(!element) return;
    let html = '';
    for (let i = 0; i < customersData.length; i++) {
        if(String(customersData[i].id).includes(String(value)) || value == '') html += `<div id="customer-${customersData[i].id}" onclick="openModal('editCustomerModal', ${customersData[i].id})" class="screen selectable d-flex align-items-center justify-content-center mb-3 h-r5 px-2 ${customersData[i].status === false? "disabled" : ""}"><h5>(${customersData[i].id}) ${customersData[i].nome} - ${customersData[i].cpfCnpj}</h5></div>`
    }
    element.innerHTML = html;
    feather.replace();
}

function buildFriends(value) {
    const element = document.getElementById('friends-area');
    if(!element) return;
    const filteredFriends = customersData.find(customer => customer.id == selectedCustomer).contatos;
    if(!filteredFriends) return;
    let html = '';
    for (let i = 0; i < filteredFriends.length; i++) {
        if(String(filteredFriends[i].id).includes(String(value)) || value == '') html += `<div id="friend-${filteredFriends[i].id}" onclick="openModal('editFriendModal', ${filteredFriends[i].id}, 1)" class="screen selectable d-flex align-items-center justify-content-center mb-3 h-r5 px-2"><h5>(${filteredFriends[i].id}) ${filteredFriends[i].nome} - ${filteredFriends[i].cargo} - ${filteredFriends[i].telefone}</h5></div>`
    }
    element.innerHTML = html;
    feather.replace();
}

function buildAdress(value) {
    const element = document.getElementById('adress-area');
    if(!element) return;
    const customer = customersData.find(customer => customer.id == selectedCustomer);
    const filteredAdress = customer?.enderecos;
    if(!filteredAdress) return;
    let html = '';
    for (let i = 0; i < filteredAdress.length; i++) {
        if(String(filteredAdress[i].id).includes(String(value)) || value == '') html += `<div id="adress-${filteredAdress[i].id}" onclick="openModal('editAdressModal', ${filteredAdress[i].id}, 2)" class="screen selectable d-flex align-items-center justify-content-center mb-3 h-r5 px-2 }"><h5>(${filteredAdress[i].id}) ${filteredAdress[i].tipoEndereco}, ${filteredAdress[i].numero} - ${filteredAdress[i].cep}</h5></div>`
    }
    element.innerHTML = html;
    feather.replace();
}

function buildDocument(value) {
    const element = document.getElementById('document-area');
    if(!element) return;
    const filteredDocuments = customersData.find(customer => customer.id == selectedCustomer).documentos;
    if(!filteredDocuments) return;
    let html = '';
    for (let i = 0; i < filteredDocuments.length; i++) {
        if(String(filteredDocuments[i].id).includes(String(value)) || value == '') html += `<div id="document-${filteredDocuments[i].id}" onclick="openModal('editDocumentModal', ${filteredDocuments[i].id}, 3)" class="screen selectable d-flex align-items-center justify-content-center mb-3 h-r5 px-2"><h5>(${filteredDocuments[i].id}) ${filteredDocuments[i].tipoDocumento} - ${filteredDocuments[i].numero} - ${filteredDocuments[i].orgaoEmissor}</h5></div>`
    }
    element.innerHTML = html;
    feather.replace();
}

function createCustomer() {
    const inputName = document.getElementById('customer-register-name');
    const inputCpf = document.getElementById('customer-register-cpf');
    const inputEmail = document.getElementById('customer-register-email');
    const inputPhone = document.getElementById('customer-register-phone');

    if (!inputName || !inputCpf || !inputEmail || !inputPhone) return;

    const user = {
        nome: inputName.value,
        cpfCnpj: inputCpf.value,
        email: inputEmail.value,
        telefone: inputPhone.value,
        tipoCliente: checkCustomerType(inputCpf.value),
        dataCadastro: new Date(),
        status: true,
        documentos: [],
        enderecoPrincipal: null,
        enderecos: [],
        contatos: [],
    }

    postContent('clientes', user).then(async () => {
        await getCustomers();
        closeModal('createCustomerModal');
    });
}

async function createFriend() {
    const inputName = document.getElementById('friend-register-name');
    const inputEmail = document.getElementById('friend-register-email');
    const inputPhone = document.getElementById('friend-register-phone');
    const inputRole = document.getElementById('friend-register-role');
    let customer = await getContent(`clientes/${selectedCustomer}`);

    if (!inputName || !inputEmail || !inputPhone || !inputRole || !customer) return;

    const user = {
        cliente: customer,
        nome: inputName.value,
        email: inputEmail.value,
        telefone: inputPhone.value,
        cargo: inputRole.value
    }

    await postContent('api/contatos', user).then(async () => {
        await getCustomers();
        await getFriends();
        closeModal('createFriendModal');
    });
}

async function createAdress() {
    const inputCep = document.getElementById('adress-register-cep');
    const inputCountry = document.getElementById('adress-register-country');
    const inputState = document.getElementById('adress-register-state');
    const inputCity = document.getElementById('adress-register-city');
    const inputNeighborhood = document.getElementById('adress-register-neighborhood');
    const inputPlace = document.getElementById('adress-register-place');
    const inputNumber = document.getElementById('adress-register-number');
    const inputExtra = document.getElementById('adress-register-extra');
    const inputType = document.getElementById('adress-register-type');

    let customer = await getContent(`clientes/${selectedCustomer}`);

    const user = {
        cliente: customer,
        cep: inputCep.value,
        pais: inputCountry.value,
        estado: inputState.value,
        cidade: inputCity.value,
        bairro: inputNeighborhood.value,
        logradouro: inputPlace.value,
        numero: inputNumber.value,
        complemento: inputExtra.value,
        tipoEndereco: inputType.value
    }

    await postContent('api/enderecos', user).then(async () => {
        await getCustomers();
        await getAdress();
        closeModal('createAdressModal');
    });
}

async function createDocument() {
    const inputType = document.getElementById('document-register-type');
    const inputNumber = document.getElementById('document-register-number');
    const inputDate = document.getElementById('document-register-date');
    const inputSender = document.getElementById('document-register-sender');
    let customer = await getContent(`clientes/${selectedCustomer}`);

    const user = {
        cliente: customer,
        tipoDocumento: inputType.value,
        numero: inputNumber.value,
        dataEmissao: inputDate.value,
        orgaoEmissor: inputSender.value
    }

    await postContent('api/documentos', user).then(async () => {
        await getCustomers();
        await getDocument();
        closeModal('createDocumentModal');
    });
}

async function deleteCustomer() {
    if(!selectedCustomer) return;
    const worked = await deleteContent("clientes", selectedCustomer);
    if(!worked) return;
    document.getElementById(`customer-${selectedCustomer}`)?.remove();
    closeModal('editCustomerModal');
}

async function deleteFriend() {
    if(!selectedFriend) return;
    const worked = await deleteContent("api/contatos", selectedFriend);
    if(!worked) return;
    document.getElementById(`friend-${selectedFriend}`)?.remove();
    closeModal('editFriendModal');
    getCustomers();
}

async function deleteAdress() {
    if(!selectedAdress) return;
    const worked = await deleteContent("api/enderecos", selectedAdress);
    if(!worked) return;
    document.getElementById(`adress-${selectedAdress}`)?.remove();
    closeModal('editAdressModal');
    getCustomers();
}

async function deleteDocument() {
    if(!selectedDocument) return;
    const worked = await deleteContent("api/documentos", selectedDocument);
    if(!worked) return;
    document.getElementById(`document-${selectedDocument}`)?.remove();
    closeModal('editDocumentModal');
    getCustomers();
}

async function editCustomer() {
    const inputName = document.getElementById('customer-edit-name');
    const inputCpf = document.getElementById('customer-edit-cpf');
    const inputEmail = document.getElementById('customer-edit-email');
    const inputPhone = document.getElementById('customer-edit-phone');
    const inputStatus = document.getElementById('customer-edit-status');
    const inputAdress = document.getElementById('customer-edit-adress');
    
    const customer = customersData.find(customer => customer.id == selectedCustomer);
    const favorite = customer.enderecos.find(address => address.id == inputAdress.value);
    
    if (!inputName || !inputCpf || !inputEmail || !inputPhone || !customer) return;


    const user = {
        nome: inputName.value,
        cpfCnpj: inputCpf.value,
        email: inputEmail.value,
        telefone: inputPhone.value,
        status: inputStatus.value,
        enderecoPrincipal: favorite,
        tipoCliente: checkCustomerType(inputCpf.value),
    }

    await putContent(`clientes/${selectedCustomer}`, user).then(() => {
        getCustomers();
        closeModal('editCustomerModal');
    });
}

async function editFriend() {
    const inputName = document.getElementById('friend-edit-name');
    const inputEmail = document.getElementById('friend-edit-email');
    const inputPhone = document.getElementById('friend-edit-phone');
    const inputRole = document.getElementById('friend-edit-role');

    if (!inputName || !inputEmail || !inputPhone || !inputRole ) return;

    const user = {
        nome: inputName.value,
        email: inputEmail.value,
        telefone: inputPhone.value,
        cargo: inputRole.value,
    }

    await putContent(`api/contatos/${selectedFriend}`, user).then(async () => {
        await getFriends();
        closeModal('editFriendModal');
    });
}

async function editAdress() {
    const inputCep = document.getElementById('adress-edit-cep');
    const inputCountry = document.getElementById('adress-edit-country');
    const inputState = document.getElementById('adress-edit-state');
    const inputCity = document.getElementById('adress-edit-city');
    const inputNeighborhood = document.getElementById('adress-edit-neighborhood');
    const inputPlace = document.getElementById('adress-edit-place');
    const inputNumber = document.getElementById('adress-edit-number');
    const inputExtra = document.getElementById('adress-edit-extra');
    const inputType = document.getElementById('adress-edit-type');

    const user = {
        cep: inputCep.value,
        pais: inputCountry.value,
        estado: inputState.value,
        cidade: inputCity.value,
        bairro: inputNeighborhood.value,
        logradouro: inputPlace.value,
        numero: inputNumber.value,
        complemento: inputExtra.value,
        tipoEndereco: inputType.value
    }

    await putContent(`api/enderecos/${selectedAdress}`, user).then(() => {
        getAdress();
        closeModal('editAdressModal');
    });
}

async function editDocument() {
    const inputType = document.getElementById('document-edit-type');
    const inputNumber = document.getElementById('document-edit-number');
    const inputDate = document.getElementById('document-edit-date');
    const inputSender = document.getElementById('document-edit-sender');

    const user = {
        tipoDocumento: inputType.value,
        numero: inputNumber.value,
        dataEmissao: inputDate.value,
        orgaoEmissor: inputSender.value
    }

    await putContent(`api/documentos/${selectedDocument}`, user).then(async () => {
        await getDocument();
        closeModal('editDocumentModal');
    });
}

function help() {
    $(`#help`).modal('show');
}

async function listAll(type){
    const component = document.getElementById('listAllId');
    let target = [];
    let html = '<h4 class="mb-4">Pressione num elemento para editar</h4><table class="table table-bordered table-hover">';
    let keys = [];
    
    switch(type){
        case "customers": target = customersData; break;
        case "friends": target = friendsData; break;
        case "documents": target = documentData; break;
        case "adress": target = adressData; break;
    }
    
    html += '<thead><tr>';
    Object.keys(target[0]).forEach((key, i) => {
        keys[i] = key;
        html += `<th>${key.charAt(0).toUpperCase() + key.slice(1)}</th>`;
    });
    html += '</tr></thead><tbody>';

    target.forEach(targ => {
        html += `<tr onclick="openModal('${type == "customers"? 'editCustomerModal' : type == "friends"? 'editFriendModal' : type == "documents" ? 'editDocumentModal' : 'editAdressModal'}', ${targ.id}, ${type == "customers"? '0' : type == "friends"? '1' : type == "documents" ? '3' : '2'})">`;
        for(let i = 0; i < keys.length; i++) {
            html += `<td>${targ[keys[i]]}</td>`;
        }
        html += `</tr>`;
    });

    html += '</tbody></table>';

    component.innerHTML = html;
    $(`#listAll`).modal('show');
}

function checkCustomerType(value) {
    const string = value.replace(/\D/g, '');

    if (string.length === 11) {
        return checkCpf(string);
    }

    if (string.length === 14) {
        return checkCnpj(string);
    }

    return null;
}

function checkCpf(cpf) {
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    let sum = 0;
    let rest;

    for (let i = 1; i <= 9; i++) {
        sum += parseInt(cpf.charAt(i - 1)) * (11 - i);
    }

    rest = (sum * 10) % 11;
    if (rest === 10 || rest === 11) rest = 0;
    if (rest !== parseInt(cpf.charAt(9))) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) {
        sum += parseInt(cpf.charAt(i - 1)) * (12 - i);
    }

    rest = (sum * 10) % 11;
    if (rest === 10 || rest === 11) rest = 0;
    if (rest !== parseInt(cpf.charAt(10))) return false;

    return "PESSOA_FISICA";
}

function checkCnpj(cnpj) {
    if (/^(\d)\1{13}$/.test(cnpj)) return false;

    let sum = 0;
    let weight = 5;

    for (let i = 0; i < 12; i++) {
        sum += parseInt(cnpj.charAt(i)) * weight;
        weight = weight === 2 ? 9 : weight - 1;
    }

    let resto = sum % 11;
    let digito1 = resto < 2 ? 0 : 11 - resto;

    if (digito1 !== parseInt(cnpj.charAt(12))) return false;

    sum = 0;
    weight = 6;

    for (let i = 0; i < 13; i++) {
        sum += parseInt(cnpj.charAt(i)) * weight;
        weight = weight === 2 ? 9 : weight - 1;
    }

    resto = sum % 11;
    let digito2 = resto < 2 ? 0 : 11 - resto;

    if (digito2 !== parseInt(cnpj.charAt(13))) return false;

    return "PESSOA_JURIDICA";
}

async function openModal(id, target = null, scope = 0){
    $(`#listAll`).modal('hide');
    $(`#${id}`).modal('show');
    if(!target) return;
    switch(scope){
        case 0: {
            selectedCustomer = target;
            const customer = customersData.find(customer => customer.id === selectedCustomer);
            const inputName = document.getElementById('customer-edit-name');
            const inputCpf = document.getElementById('customer-edit-cpf');
            const inputEmail = document.getElementById('customer-edit-email');
            const inputPhone = document.getElementById('customer-edit-phone');
            const inputStatus = document.getElementById('customer-edit-status');
            const inputAdress = document.getElementById('customer-edit-adress');

            if (!customer || !inputName || !inputCpf || !inputEmail || !inputPhone) return;

            inputName.value = customer.nome;
            inputCpf.value = customer.cpfCnpj;
            inputEmail.value = customer.email;
            inputPhone.value = customer.telefone;
            inputStatus.value = customer.status;
            if(customer.enderecoPrincipal && customer.enderecoPrincipal.id) inputAdress.value = `${customer.enderecoPrincipal.id}`;
            else inputAdress.value = '';

            friendsData = await getContent('api/contatos').then(() => {
                getFriends();
            });

            adressData = await getContent('api/enderecos').then(async () => {
                await getAdress();
                const filteredAdress = customersData.find(customer => customer.id == selectedCustomer).enderecos;
                let html = '<option value="" disabled selected>Endereço Principal</option>';
                for(let i = 0; i < filteredAdress.length; i++) {
                    html += `<option value=${filteredAdress[i].id}>ID: ${filteredAdress[i].id}</option>`;
                }
                inputAdress.innerHTML = html;
            });

            documentData = await getContent('api/documentos').then(() => {
                getDocument();
            });

        }; break;

        case 1: {
            selectedFriend = target;
            const friend = friendsData.find(friend => friend.id === selectedFriend);
            const inputName = document.getElementById('friend-edit-name');
            const inputEmail = document.getElementById('friend-edit-email');
            const inputPhone = document.getElementById('friend-edit-phone');
            const inputRole = document.getElementById('friend-edit-role');
            if (!inputName || !inputEmail || !inputPhone || !inputRole) return;
            inputName.value = friend.nome;
            inputEmail.value = friend.email;
            inputPhone.value = friend.telefone;
            inputRole.value = friend.cargo;
        }; break;

        case 2: {
            selectedAdress = target;
            const adress = adressData.find(adress => adress.id === selectedAdress);
            const inputCep = document.getElementById('adress-edit-cep');
            const inputCountry = document.getElementById('adress-edit-country');
            const inputState = document.getElementById('adress-edit-state');
            const inputCity = document.getElementById('adress-edit-city');
            const inputNeighborhood = document.getElementById('adress-edit-neighborhood');
            const inputPlace = document.getElementById('adress-edit-place');
            const inputNumber = document.getElementById('adress-edit-number');
            const inputExtra = document.getElementById('adress-edit-extra');
            const inputType = document.getElementById('adress-edit-type');

            inputCep.value = adress.cep;
            inputCountry.value = adress.pais;
            inputState.value = adress.estado;
            inputCity.value = adress.cidade;
            inputNeighborhood.value = adress.bairro;
            inputPlace.value = adress.logradouro;
            inputNumber.value = adress.numero;
            inputExtra.value = adress.complemento;
            inputType.value = adress.tipoDocumento;
        }; break;

        case 3: {
            selectedDocument = target;
            const doc = documentData.find(doc => doc.id === selectedDocument);

            const inputType = document.getElementById('document-edit-type');
            const inputNumber = document.getElementById('document-edit-number');
            const inputDate = document.getElementById('document-edit-date');
            const inputSender = document.getElementById('document-edit-sender');

            inputType.value = doc.tipoDocumento;
            inputNumber.value = doc.numero;
            inputDate.value = doc.dataEmissao;
            inputSender.value = doc.orgaoEmissor;
        }; break;
    }
}

function closeModal(id){
    $(`#${id}`).modal('hide'); 
}

async function getContent(route) {
    let content = null;
    await fetch(`${host}:${port}/${route}`)
        .then(response => {
            if (!response.ok) return;
            return response.json();
        }).then(data => {
            content = data;
        }).catch(() => { });
    return content
}

async function postContent(route, content) {
    let message = '';
    await fetch(`${host}:${port}/${route}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(content)
    }).then(async response => {
        if (!response.ok) return;
        message = await response.json();
    }).catch(() => {});
    return message;
}

async function putContent(route, content) {
    await fetch(`${host}:${port}/${route}`, {
        method: 'PUT',  
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(content)
    })
    .then(response => {
        if (!response.ok) return; 
    })
    .catch(() => {});
}

async function deleteContent(route, id) {
    let gate = true;
    await fetch(`${host}:${port}/${route}/${id}`, {
        method: 'DELETE',
    }).then(response => {
        if (!response.ok) gate = false;
    }).catch(() => { gate = false });
    return gate;
}

async function getCep(value) {
    await fetch(`https://viacep.com.br/ws/${value}/json/`)
    .then(response => response.json())
    .then(data => {
        const inputState = document.getElementById('adress-register-state');
        const inputCity = document.getElementById('adress-register-city');
        const inputNeighborhood = document.getElementById('adress-register-neighborhood');
        const inputPlace = document.getElementById('adress-register-place');
        const inputExtra = document.getElementById('adress-register-extra');

        inputState.value = data.uf;
        inputCity.value = data.localidade;
        inputNeighborhood.value = data.bairro;
        inputPlace.value = data.logradouro;
        inputExtra.value = data.complemento;
    }).catch(() => {});
}

async function main() {
    await getCustomers().then(async () => {
        setTimeout(() => {document.getElementById('listall-customers').classList.remove("d-none")}, 2000);
        getFriends(1).then(() => setTimeout(() => { document.getElementById('listall-friends').classList.remove("d-none")}, 2000));
        getDocument(1).then(() => setTimeout(() => { document.getElementById('listall-documents').classList.remove("d-none")}, 2000));
        getAdress(1).then(() => setTimeout(() => {document.getElementById('listall-adress').classList.remove("d-none")}, 2000) );
    });
}

main();
