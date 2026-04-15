let usuario 
let id

const inputUser = document.querySelector(".telaDeEntrada input")
inputUser.addEventListener("keypress", function (e) {
    if (e.key == "Enter") {
        validarUsuario()
    }
})

const inputMensagem = document.querySelector(".barraInferior input");
inputMensagem.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        validarMensagem();
    }
});

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

    setTimeout(scrollarParaBaixo, 1000);
}

function buscarMensagens() {
    const promessa = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages")
    promessa.then(processarResposta)
}

let batePapo = document.querySelector(".telaInicial .batePapo")

function processarResposta(resposta) {
    batePapo.innerHTML = "";
    let mensagens = resposta.data;

    for (let i = 0; i < mensagens.length; i++) {
        let msg = mensagens[i];
        
        if (msg.type === "status") {
            batePapo.innerHTML += ` 
            <div class="${msg.type}">
                <span class="hora">(${msg.time})</span> <b>${msg.from}</b> ${msg.text}
            </div>`;
        } else if (msg.type === "message") {
            batePapo.innerHTML += ` 
            <div class="${msg.type}" data-identifier="message">
                <span class="hora">(${msg.time})</span> <b>${msg.from}</b> para <b>${msg.to}</b>: ${msg.text}
            </div>`;
        } else if (msg.type === "private_message" && (msg.to === usuario || msg.from === usuario)) {
            batePapo.innerHTML += ` 
            <div class="${msg.type}" data-identifier="message">
                <span class="hora">(${msg.time})</span> <b>${msg.from}</b> reservadamente para <b>${msg.to}</b>: ${msg.text}
            </div>`;
        }
    }

    const distandoTopo = window.scrollY + window.innerHeight;
    const alturaTotal = document.documentElement.scrollHeight;
    const estaNoFinal = (alturaTotal - distandoTopo) < 50;


    if (estaNoFinal) {
        scrollarParaBaixo();
    }
    atualizarMensagens();
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
    document.querySelector(".barraInferior input").value = "";
    buscarMensagens()
    setTimeout(scrollarParaBaixo, 500);  
}
function atualizarPagina() {
    window.location.reload()
}

function scrollarParaBaixo() {
    const ultimaMensagem = document.querySelector(".batePapo div:last-child");
    if (ultimaMensagem) {
        ultimaMensagem.scrollIntoView();
    }
}