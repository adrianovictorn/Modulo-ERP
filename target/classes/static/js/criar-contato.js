document.getElementById("contatoForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const contato = {
        nome: document.getElementById("nome").value,
        email: document.getElementById("email").value,
        telefone: document.getElementById("telefone").value,
        cargo: document.getElementById("cargo").value
    };

 
    fetch("http://localhost:8080/api/contatos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(contato)
    })
    .then(response => {
        if (response.ok) {
            alert("Contato cadastrado com sucesso!");
            document.getElementById("contatoForm").reset(); 
        } else {
            response.json().then(data => {
                document.getElementById("mensagem").innerText = data.message || "Erro ao cadastrar contato!";
            });
        }
    })
    .catch(error => {
        document.getElementById("mensagem").innerText = "Erro ao se comunicar com o servidor.";
    });
});