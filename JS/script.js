// Atualiza os badges de contagem de cada coluna
function atualizarBadges() {
  document.getElementById('countTodo').textContent  = document.getElementById('todo').querySelectorAll('.card').length;
  document.getElementById('countDoing').textContent = document.getElementById('doing').querySelectorAll('.card').length;
  document.getElementById('countDone').textContent  = document.getElementById('done').querySelectorAll('.card').length;
}

// Permite que a área receba um card arrastado
function allowDrop(event) {
  event.preventDefault();
  event.currentTarget.classList.add('drag-over');
}

function removeDragOver(event) {
  event.currentTarget.classList.remove('drag-over');
}

// Quando solta o card na coluna, move ele para lá
function drop(event) {
  event.preventDefault();
  event.currentTarget.classList.remove('drag-over');
  const cardId = event.dataTransfer.getData('cardId');
  const card = document.getElementById(cardId);
  if (card) {
    event.currentTarget.appendChild(card);
    atualizarBadges();
  }
}

// Configura drag and drop nas áreas de cards
document.querySelectorAll('.cards-area').forEach(area => {
  area.addEventListener('dragover', allowDrop);
  area.addEventListener('dragleave', removeDragOver);
  area.addEventListener('drop', drop);
});

// Cria e adiciona um novo card na coluna "A Fazer"
function adicionarTarefa() {
  const input = document.getElementById('taskInput');
  const texto = input.value.trim();

  if (texto === '') return;

  const novoCard = document.createElement('div');
  novoCard.classList.add('card');
  novoCard.id = 'card-' + Date.now();
  novoCard.draggable = true;

  const spanTexto = document.createElement('span');
  spanTexto.innerText = texto;

  const btnDeletar = document.createElement('button');
  btnDeletar.textContent = 'X';
  btnDeletar.classList.add('btn-deletar');
  btnDeletar.draggable = false;
  btnDeletar.onclick = () => {
    if (confirm('Deseja realmente excluir a tarefa?')) {
      novoCard.remove();
      atualizarBadges();
    }
  };

  novoCard.addEventListener('dragstart', (event) => {
    event.dataTransfer.setData('cardId', novoCard.id);
    novoCard.classList.add('dragging');
  });

  novoCard.addEventListener('dragend', () => {
    novoCard.classList.remove('dragging');
  });

  // Editar com duplo clique
  novoCard.addEventListener('dblclick', () => {
    novoCard.contentEditable = true;
    novoCard.focus();
    novoCard.classList.add('editando');
  });

  // Salva ao perder o foco
  novoCard.addEventListener('blur', () => {
    novoCard.contentEditable = false;
    novoCard.classList.remove('editando');
    if (spanTexto.innerText.trim() === '') {
      novoCard.remove();
      atualizarBadges();
    }
  });

  // Salva ao pressionar Enter
  novoCard.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      novoCard.blur();
    }
  });

  novoCard.appendChild(spanTexto);
  novoCard.appendChild(btnDeletar);

  document.getElementById('todo').appendChild(novoCard);
  input.value = '';
  atualizarBadges();
}

// Conecta o botão Adicionar
document.getElementById('addTaskBtn').addEventListener('click', adicionarTarefa);

// Permite adicionar com Enter no input
document.getElementById('taskInput').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') adicionarTarefa();
});
