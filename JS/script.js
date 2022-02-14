let usuario 
let id

function validarUsuario() {
    usuario = document.querySelector(".telaDeEntrada input").value
    id = {name: usuario}
    const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants",id )
    promise.then(entrar).catch(tratarErro)
}
function tratarErro(erro) {
    let status = erro.response.status
    alert(`Erro ${status}! O nome de usuário ${usuario} já existe`)
    atualizarPagina()
}

function entrar() {
    setInterval(permanecerOnline, 5000)
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
    for(let i = 0; i < mensagens.length; i++) {
        if (mensagens[i].type == "status") {
            batePapo.innerHTML += ` 
            <div class="${mensagens[i].type}">
                <horaMensagem>(${mensagens[i].time}) <b>${mensagens[i].from}</b ${mensagens[i].text}
            </div>`
        } else if (mensagens[i].type == "message") {
            batePapo.innerHTML += ` 
            <div class="${mensagens[i].type}" data-identifier="message">
                <horaMensagem>(${mensagens[i].time}) <b>${mensagens[i].from}</b> para <b>${mensagens[i].to}</b> ${mensagens[i].text}
            </div>`
            
        } else if (mensagens[i].type == "private_message" && (mensagens[i].to == usuario)||(mensagens[i].from == usuario)) {
            batePapo.innerHTML += ` 
            <div class="${mensagens[i].type}" data-identifier="message">
                <horaMensagem>(${mensagens[i].time}) <b>${mensagens[i].from}</b> para <b>${mensagens[i].to}</b> ${mensagens[i].text}
            </div>`
        }
    } atualizarMensagens()
}

function atualizarMensagens() {
    setTimeout(buscarMensagens, 3000)
}

function permanecerOnline() {
    const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/status", id)
    promise.then()
}

let textoMensagen
let mensagem

function validarMensagem() {
    textoMensagen = document.querySelector(".barraInferior input").value
    mensagem = {from: usuario, to: "Todos", text: textoMensagen, type: "message"}
    
    const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/messages", mensagem)
    promise.then(enviarMensagem).catch(atualizarPagina)
}

function enviarMensagem() {
    buscarMensagens()   
}
function atualizarPagina() {
    window.location.reload()
}
