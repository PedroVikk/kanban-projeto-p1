//  BADGES 

function atualizarBadges() {
  document.getElementById('countTodo').textContent  = document.getElementById('todo').querySelectorAll('.card').length;
  document.getElementById('countDoing').textContent = document.getElementById('doing').querySelectorAll('.card').length;
  document.getElementById('countDone').textContent  = document.getElementById('done').querySelectorAll('.card').length;
}

//  DRAG AND DROP 
document.querySelectorAll('.cards-area').forEach(area => {
  area.addEventListener('dragover', (e) => {
    e.preventDefault();
    area.classList.add('drag-over');
  });

  area.addEventListener('dragleave', () => {
    area.classList.remove('drag-over');
  });

  area.addEventListener('drop', (e) => {
    e.preventDefault();
    area.classList.remove('drag-over');
    const cardId = e.dataTransfer.getData('cardId');
    const card = document.getElementById(cardId);
    if (card) {
      area.appendChild(card);
      atualizarBadges();
    }
  });
});

//  TOUCH DRAG AND DROP versão mobile

let touchGhost = null;
let touchCard  = null;
let ghostOffsetX = 0;
let ghostOffsetY = 0;

function getCardArea(x, y) {
  // Esconde o ghost temporariamente para pegar o elemento por baixo
  if (touchGhost) touchGhost.style.display = 'none';
  const el = document.elementFromPoint(x, y);
  if (touchGhost) touchGhost.style.display = '';
  if (!el) return null;
  return el.closest('.cards-area');
}

function ativarTouchDrag(card) {
  card.addEventListener('touchstart', (e) => {
    // Ignora se veio do botão deletar
    if (e.target.classList.contains('btn-deletar')) return;

    touchCard = card;
    const touch = e.touches[0];
    const rect  = card.getBoundingClientRect();

    ghostOffsetX = touch.clientX - rect.left;
    ghostOffsetY = touch.clientY - rect.top;

    // Cria clone ghost
    touchGhost = card.cloneNode(true);
    touchGhost.classList.add('touch-ghost');
    touchGhost.style.width  = rect.width  + 'px';
    touchGhost.style.left   = rect.left   + 'px';
    touchGhost.style.top    = rect.top    + 'px';
    document.body.appendChild(touchGhost);

    card.classList.add('dragging');
    e.preventDefault();
  }, { passive: false });

  card.addEventListener('touchmove', (e) => {
    if (!touchGhost) return;
    const touch = e.touches[0];
    touchGhost.style.left = (touch.clientX - ghostOffsetX) + 'px';
    touchGhost.style.top  = (touch.clientY - ghostOffsetY) + 'px';

    // Destaca a área que está sob o dedo
    document.querySelectorAll('.cards-area').forEach(a => a.classList.remove('drag-over'));
    const area = getCardArea(touch.clientX, touch.clientY);
    if (area) area.classList.add('drag-over');

    e.preventDefault();
  }, { passive: false });

  card.addEventListener('touchend', (e) => {
    if (!touchGhost || !touchCard) return;
    const touch = e.changedTouches[0];

    document.querySelectorAll('.cards-area').forEach(a => a.classList.remove('drag-over'));

    const area = getCardArea(touch.clientX, touch.clientY);
    if (area) {
      area.appendChild(touchCard);
      atualizarBadges();
    }

    touchGhost.remove();
    touchGhost = null;
    touchCard.classList.remove('dragging');
    touchCard = null;
  });
}

//  CRIAÇÃO DE CARD 

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
  btnDeletar.textContent = '✕';
  btnDeletar.classList.add('btn-deletar');
  btnDeletar.draggable = false;
  btnDeletar.onclick = () => {
    if (confirm('Deseja realmente excluir a tarefa?')) {
      novoCard.remove();
      atualizarBadges();
    }
  };

  // Drag mouse
  novoCard.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('cardId', novoCard.id);
    novoCard.classList.add('dragging');
  });
  novoCard.addEventListener('dragend', () => {
    novoCard.classList.remove('dragging');
  });

  // Editar com duplo clique / duplo toque
  novoCard.addEventListener('dblclick', () => {
    novoCard.contentEditable = true;
    novoCard.focus();
    novoCard.classList.add('editando');
  });

  novoCard.addEventListener('blur', () => {
    novoCard.contentEditable = false;
    novoCard.classList.remove('editando');
    if (spanTexto.innerText.trim() === '') {
      novoCard.remove();
      atualizarBadges();
    }
  });

  novoCard.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      novoCard.blur();
    }
  });

  novoCard.appendChild(spanTexto);
  novoCard.appendChild(btnDeletar);

  // Ativa touch drag no card recém-criado
  ativarTouchDrag(novoCard);

  document.getElementById('todo').appendChild(novoCard);
  input.value = '';
  input.focus();
  atualizarBadges();
}

//  EVENTOS GLOBAIS 

document.getElementById('addTaskBtn').addEventListener('click', adicionarTarefa);

document.getElementById('taskInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') adicionarTarefa();
});
