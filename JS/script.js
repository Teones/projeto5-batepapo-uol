function entrar() {
    buscarMensagens()

    let telaDeEntrada = document.querySelector(".telaDeEntrada")
    telaDeEntrada.classList.add("esconder")
    let telaInicial = document.querySelector(".telaInicial")
    telaInicial.classList.remove("esconder")
}

function buscarMensagens() {
    const promessa = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages")
    promessa.then(processarResposta)
}

let batePapo = document.querySelector(".telaInicial .batePapo")

function processarResposta(resposta) {
    batePapo.innerHTML = "";
    let mensagens = resposta.data
    console.log("atualizei")
    for(let i = 0; i < mensagens.length; i++) {
        if (mensagens[i].type == "status") {
            batePapo.innerHTML += ` 
            <div class="${mensagens[i].type}">
            <div class="horaMensagem">(${mensagens[i].time})</div>
            <div class="remetente">${mensagens[i].from}</div> 
            <div class="texto">${mensagens[i].text}</div> 
            </div>`
        } else if (mensagens[i].type == "message") {
            batePapo.innerHTML += ` 
            <div class="${mensagens[i].type}">
            <div class="horaMensagem">(${mensagens[i].time})</div>
            <div class="remetente">${mensagens[i].from}</div> 
            <div class="texto">para</div> 
            <div class="destinatario">${mensagens[i].to}</div> 
            <div class="texto">${mensagens[i].text}</div> 
            </div>`
        } else if (mensagens[i].type == "private_message") {
            batePapo.innerHTML += ` 
            <div class="${mensagens[i].type}">
            <div class="horaMensagem">(${mensagens[i].time})</div>
            <div class="remetente">${mensagens[i].from}</div>
            <div class="texto">para</div> 
            <div class="destinatario">${mensagens[i].to}</div>  
            <div class="texto">${mensagens[i].text}</div> 
            </div>`
        }
    } atualizarMensagens()
}

function atualizarMensagens() {
    setTimeout(buscarMensagens, 3000)
}

