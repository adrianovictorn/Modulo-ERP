document.getElementById("enderecoForm").addEventListener("submit", function(event) {
    event.preventDefault(); 
  
    const endereco = {
        logradouro: document.getElementById("logradouro").value,
        numero: document.getElementById("numero").value,
        complemento: document.getElementById("complemento").value,
        bairro: document.getElementById("bairro").value,
        cidade: document.getElementById("cidade").value,
        estado: document.getElementById("estado").value,
        cep: document.getElementById("cep").value,
        pais: document.getElementById("pais").value,
        tipoEndereco: document.getElementById("tipoEndereco").value,
    };

    fetch("/api/enderecos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(endereco)
    })
    .then(response => {
        if (response.ok) {
            alert("Endereço cadastrado com sucesso!");
            document.getElementById("enderecoForm").reset(); 
        } else {
            response.json().then(data => {
                document.getElementById("mensagem").innerText = data.message || "Erro ao cadastrar endereço!";
            });
        }
    })
    .catch(error => {
        document.getElementById("mensagem").innerText = "Erro ao se comunicar com o servidor.";
    });
});