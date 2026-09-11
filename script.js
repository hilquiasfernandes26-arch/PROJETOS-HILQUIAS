document.addEventListener("DOMContentLoaded", () => {
  const board = document.getElementById("memory-game");
  const restartBtn = document.getElementById("restart-btn");

  // 8 pares de itens para preencher o tabuleiro 4x4
  const items = ["🚀", "🎨", "🎮", "🎵", "🦊", "🍕", "🌟", "👾"];
  let cardsData = [...items, ...items]; // Duplica para formar os pares (16 cartas)

  let hasFlippedCard = false;
  let lockBoard = false;
  let firstCard, secondCard;

  // Algoritmo de Embaralhamento (Fisher-Yates)
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Cria as cartas no DOM
  function createBoard() {
    board.innerHTML = "";
    const shuffledCards = shuffle([...cardsData]);

    shuffledCards.forEach((item) => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.dataset.framework = item;

      card.innerHTML = `
        <div class="card-front">${item}</div>
        <div class="card-back"></div>
      `;

      card.addEventListener("click", flipCard);
      board.appendChild(card);
    });
  }

  // Lógica para virar a carta
  function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add("flip");

    if (!hasFlippedCard) {
      // Primeiras carta virada
      hasFlippedCard = true;
      firstCard = this;
      return;
    }

    // Segunda carta virada
    secondCard = this;
    checkForMatch();
  }

  // Checa se as cartas combinam
  function checkForMatch() {
    const isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
    isMatch ? disableCards() : unflipCards();
  }

  // Cartas iguais: remove o evento de clique
  function disableCards() {
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);

    resetBoard();
  }

  // Cartas diferentes: desvira após 1 segundo
  function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
      firstCard.classList.remove("flip");
      secondCard.classList.remove("flip");
      resetBoard();
    }, 1000);
  }

  // Reseta o estado das variáveis de controle
  function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
  }

  // Reinicia o jogo
  restartBtn.addEventListener("click", () => {
    resetBoard();
    createBoard();
  });

  // Inicializa o jogo
  createBoard();
});