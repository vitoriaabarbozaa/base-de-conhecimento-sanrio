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
    container.innerHTML = ''; 

    personagens.forEach((personagem, index) => {
        const cardHTML = `
            <article class="card-personagem" onclick="abrirModal(${index})">
                <div class="flip-card-inner">
                    <div class="flip-card-front">
                        <img src="${personagem.imagem}" alt="${personagem.nome}">
                    </div>
                    <div class="flip-card-back">
                        <div class="card-content">
                            <h2>${personagem.nome}</h2>
                            <p><strong>Aniversário:</strong> ${personagem.aniversario}</p>
                            <span class="clique-aviso">Clique para ver detalhes</span>
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
// Altera o tema do site
function alternarTema() {
    const body = document.body;
    // Adiciona ou remove a classe 'kuromi-theme'
    body.classList.toggle("kuromi-theme");
    
    // (Opcional) Muda o ícone do botão
    const botao = document.getElementById("btn-tema");
    if (body.classList.contains("kuromi-theme")) {
        botao.innerText = "🎀"; // Volta pra Hello Kitty
    } else {
        botao.innerText = "🖤"; // Vai pra Kuromi
    }
}

// Funções do Modal

function abrirModal(index) {
    const personagem = listaPersonagens[index];

    // Preenche os textos e imagem
    document.getElementById("modal-titulo").innerText = personagem.nome;
    document.getElementById("modal-desc").innerText = personagem.descricao;
    document.getElementById("modal-img").src = personagem.imagem;
    document.getElementById("modal-link").href = personagem.link;

    // --- LÓGICA DO FAVORITO NO MODAL ---
    const btnFav = document.getElementById("btn-fav-modal");
    
    // 1. Verifica se já é favorito
    const favoritos = JSON.parse(localStorage.getItem('sanrioFavoritos')) || [];
    const ehFavorito = favoritos.includes(personagem.nome);

    // 2. Define o ícone inicial (Coração cheio ou vazio)
    btnFav.innerText = ehFavorito ? '❤️' : '🤍';
    
    // 3. Cria a função de clique ESPECÍFICA para este personagem
    btnFav.onclick = function() {
        toggleFavoritoModal(personagem.nome);
    };

    // Mostra o modal
    document.getElementById("modal").style.display = "flex";
}

function fecharModal(event) {
    // Só fecha se clicar no "X" ou no fundo preto (fora da caixinha)
    if (event.target.classList.contains("modal-container") || event.target.classList.contains("fechar")) {
        document.getElementById("modal").style.display = "none";
    }
}

function toggleFavorito(nome, event) {
    // Impede que o clique no coração abra o modal
    event.stopPropagation();

    // 1. Pega a lista atual
    let favoritos = JSON.parse(localStorage.getItem('sanrioFavoritos')) || [];

    // 2. Se já tiver, remove. Se não tiver, adiciona.
    if (favoritos.includes(nome)) {
        favoritos = favoritos.filter(fav => fav !== nome);
    } else {
        favoritos.push(nome);
    }

    // 3. Salva de volta no navegador
    localStorage.setItem('sanrioFavoritos', JSON.stringify(favoritos));

    // 4. Recarrega os cards para atualizar os corações
    // (Se estiveres a usar busca, idealmente refarias a busca, mas vamos simplificar recarregando a lista visual)
    if(document.getElementById('input-busca').value !== "") {
         iniciarBusca(); // Mantém a busca se houver texto
         // Nota: A função iniciarBusca apenas esconde cards, não redesenha. 
         // Para ver a cor mudar instantaneamente, o ideal é chamar gerarHTML novamente.
         gerarHTML(listaPersonagens); 
         iniciarBusca(); // Reaplica o filtro
    } else {
        gerarHTML(listaPersonagens);
    }
}

function toggleFavoritoModal(nome) {
    let favoritos = JSON.parse(localStorage.getItem('sanrioFavoritos')) || [];
    const btnFav = document.getElementById("btn-fav-modal");

    if (favoritos.includes(nome)) {
        // Se já tem, remove
        favoritos = favoritos.filter(fav => fav !== nome);
        btnFav.innerText = '🤍'; // Vira coração branco
    } else {
        // Se não tem, adiciona
        favoritos.push(nome);
        btnFav.innerText = '❤️'; // Vira coração vermelho
    }

    // Salva no navegador
    localStorage.setItem('sanrioFavoritos', JSON.stringify(favoritos));
}

// --- EASTER EGG ---
let codigoSecreto = '';
const segredo = 'sanrio';

document.addEventListener('keydown', (e) => {
    codigoSecreto += e.key.toLowerCase();

    if (codigoSecreto.length > segredo.length) {
        codigoSecreto = codigoSecreto.slice(-segredo.length);
    }

    if (codigoSecreto === segredo) {
        // Em vez de girar cards, chama a função da chuva
        iniciarChuvaLacos();
        codigoSecreto = ''; 
    }
});

// Função que cria os laços caindo
function iniciarChuvaLacos() {
    const quantidade = 30; // Quantos laços vão cair?

    for (let i = 0; i < quantidade; i++) {
        // Cria um elemento <span> na memória
        const laco = document.createElement('span');
        laco.innerText = '🎀';
        laco.classList.add('chuva-laco');

        // --- Posições Aleatórias para ficar natural ---
        // Posição horizontal aleatória (de 0% a 100% da largura da tela)
        laco.style.left = Math.random() * window.innerWidth + 'px';
        
        // Tamanho aleatório (entre 20px e 40px)
        const tamanho = (Math.random() * 20) + 20;
        laco.style.fontSize = tamanho + 'px';

        // Velocidade de queda aleatória (entre 6s e 9s)
        const duracao = (Math.random() * 4) + 2;
        laco.style.animationDuration = duracao + 's';
        
        // Atraso aleatório para não caírem todos juntos
        laco.style.animationDelay = Math.random() + 's';

        // Adiciona o laço na tela (no body)
        document.body.appendChild(laco);

        // Remove o laço da memória depois que a animação acaba (para não travar o site)
        setTimeout(() => {
            laco.remove();
        }, (duracao + 1) * 1000); // Espera a duração da animação + 1 segundo de folga
    }
}

// --- FILTRAR FAVORITOS ---
function filtrarFavoritos() {
    // 1. Pega a lista de nomes salvos
    const favoritos = JSON.parse(localStorage.getItem('sanrioFavoritos')) || [];
    const cards = document.getElementsByClassName('card-personagem');
    let encontrouAlgum = false;

    // 2. Se não tiver nenhum favorito, avisa logo
    if (favoritos.length === 0) {
        alert("Você ainda não tem favoritos! ❤️\nClique nos cards para adicionar.");
        return; // Para a função aqui
    }

    // 3. Percorre os cards
    for (let i = 0; i < cards.length; i++) {
        let card = cards[i];
        let nomePersonagem = card.querySelector('h2').innerText;

        // Verifica se o nome desse card está na lista de favoritos
        if (favoritos.includes(nomePersonagem)) {
            card.style.display = "block"; // Mostra
            encontrouAlgum = true;
        } else {
            card.style.display = "none"; // Esconde
        }
    }

    // 4. Lógica da mensagem de erro (caso algo dê errado)
    const msgErro = document.getElementById('mensagem-erro');
    if (encontrouAlgum) {
        msgErro.style.display = "none";
    } else {
        msgErro.style.display = "block";
    }
}