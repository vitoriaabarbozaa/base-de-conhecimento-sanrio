function iniciarBusca() {
    // 1. Pega o valor digitado e transforma em minúsculas
    const termoBusca = document.getElementById('input-busca').value.toLowerCase();
    
    // 2. Seleciona todos os cards (articles)
    const cards = document.getElementsByClassName('card-personagem');

    // 3. Percorre cada card para verificar se deve mostrar ou esconder
    for (let i = 0; i < cards.length; i++) {
        let card = cards[i];
        // Pega o texto do título (h2) dentro do card
        let titulo = card.querySelector('h2').innerText.toLowerCase();

        // Se o título conter o que foi digitado
        if (titulo.includes(termoBusca)) {
            card.style.display = "block"; // Mostra
        } else {
            card.style.display = "none"; // Esconde
        }
    }
}

// Função extra: Permite buscar apertando "Enter" no teclado
function checarEnter(event) {
    if (event.key === "Enter") {
        iniciarBusca();
    }
}