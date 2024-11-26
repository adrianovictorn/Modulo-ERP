document.getElementById("documentoForm").addEventListener("submit", function(event) {
    event.preventDefault(); 

    const documento = {
        tipoDocumento: document.getElementById("tipoDocumento").value,
        numero: document.getElementById("numero").value,
        dataEmissao: document.getElementById("dataEmissao").value,
        orgaoEmissor: document.getElementById("orgaoEmissor").value
    };

 
    fetch("/api/documentos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(documento)
    })
    .then(response => {
        if (response.ok) {
            alert("Documento cadastrado com sucesso!");
            document.getElementById("documentoForm").reset(); 
            response.json().then(data => {
                document.getElementById("mensagem").innerText = data.message || "Erro ao cadastrar documento!";
            });
        }
    })
    .catch(error => {
        document.getElementById("mensagem").innerText = "Erro ao se comunicar com o servidor.";
    });
});