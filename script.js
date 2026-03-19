// Permite que a coluna receba um card
function allowDrop(event) {
  event.preventDefault();
}

// Quando começa a arrastar o card, salva o ID dele
function drag(event) {
  event.dataTransfer.setData("cardId", event.target.id);
}

// Quando solta o card na coluna, move ele pra lá
function drop(event) {
  event.preventDefault();
  const cardId = event.dataTransfer.getData("cardId");
  const card = document.getElementById(cardId);
  event.target.closest(".column").appendChild(card);
}