// 1. Variável global para guardar os personagens
let listaPersonagens = [];

// 2. Função para carregar o JSON
async function carregarCards() {
    try {
        const resposta = await fetch('personagens.json');
        listaPersonagens = await resposta.json();
        gerarHTML(listaPersonagens);
    } catch (erro) {
        console.error("Erro ao carregar os personagens:", erro);
        alert("Erro! Se você estiver abrindo o arquivo direto no computador, use o 'Live Server' do VS Code ou suba para o GitHub.");
    }
}

// 3. Função que desenha o HTML na tela
function gerarHTML(personagens) {
    const container = document.getElementById('container-cards');
    container.innerHTML = ''; // Limpa antes de adicionar

    personagens.forEach(personagem => {
        const cardHTML = `
            <article class="card-personagem" onclick="window.open('${personagem.link}', '_blank')">
                <div class="flip-card-inner">
                    <div class="flip-card-front">
                        <img src="${personagem.imagem}" alt="${personagem.nome}">
                    </div>
                    <div class="flip-card-back">
                        <div class="card-content">
                            <h2>${personagem.nome}</h2>
                            <p><strong>Aniversário:</strong> ${personagem.aniversario}</p>
                            <p>${personagem.descricao}</p>
                            <span class="clique-aviso">Clique para saber mais</span>
                        </div>
                    </div>
                </div>
            </article>
        `;
        container.innerHTML += cardHTML;
    });
}

// 4. Função de Busca
function iniciarBusca() {
    const termoBusca = document.getElementById('input-busca').value.toLowerCase();
    const cards = document.getElementsByClassName('card-personagem');
    let encontrouAlgum = false;

    for (let i = 0; i < cards.length; i++) {
        let card = cards[i];
        let titulo = card.querySelector('h2').innerText.toLowerCase();

        if (titulo.includes(termoBusca)) {
            card.style.display = "block";
            encontrouAlgum = true;
        } else {
            card.style.display = "none";
        }
    }

    // Mostra ou esconde a mensagem de erro
    const msgErro = document.getElementById('mensagem-erro');
    if (encontrouAlgum) {
        msgErro.style.display = "none";
    } else {
        msgErro.style.display = "block";
    }
}

// Verifica se apertou Enter
function checarEnter(event) {
    if (event.key === "Enter") {
        iniciarBusca();
    }
}

// Inicia tudo quando a página carrega
window.onload = carregarCards;

function limparBusca() {
    // 1. Limpa o texto que está escrito no input
    document.getElementById('input-busca').value = '';

    // 2. Pega todos os cards e garante que eles apareçam
    const cards = document.getElementsByClassName('card-personagem');
    for (let i = 0; i < cards.length; i++) {
        cards[i].style.display = "block";
    }

    // 3. Esconde a mensagem de erro se ela estiver aparecendo
    document.getElementById('mensagem-erro').style.display = "none";
}