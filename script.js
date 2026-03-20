const { createElement } = require("react");

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

//Fução para a adição, exclusão e edição de cards de tarefa
function adicionarTarefa(){
  const input = document.getElementById('input-tarefa');
  const texto = input.value;

  //Impede que um card vazio seja criado
  if (texto.trim() === ''){
    return;
  }

  // Criação do container do card e definição de ID único para o gerenciamento de estado
  const novoCard = document.createElement('div');
  novoCard.classList.add('card');
  novoCard.id = 'card-' + Date.now();

  const spanTexto = document.createElement('span');
  spanTexto.innerText = texto;
  
  //Cria o botão de deletar
  const btnDeletar = document.createElement('button');
  btnDeletar.textContent = 'X';
  btnDeletar.classList.add('btn-deletar');
  btnDeletar.draggable = false;
  
  //Confirma se o usuário realmente deseja deletar o card
  btnDeletar.onclick = () => {
    if(confirm("Deseja realmente excluir a tarefa?")){
      novoCard.remove();
    }
  };
  
  novoCard.draggable = true;
  novoCard.ondragstart = drag;
  novoCard.appendChild(spanTexto);
  novoCard.appendChild(btnDeletar);

  //Editar com clique duplo
  novoCard.addEventListener('dblclick', function() {
    novoCard.contentEditable = true;
    novoCard.focus();
    novoCard.classList.add('editando')
  });

  //Salva ao perder o foco
  novoCard.addEventListener('blur', () =>{
    novoCard.contentEditable = false;

    if(spanTexto.innerText.trim() === ""){
      novoCard.remove();
    }

  });

  //Também salva ao pressionar enter
  novoCard.addEventListener('keypress', (Event) => {
    if (Event.key === "Enter"){
      Event.preventDefault();
      novoCard.blur();
    }
  });

  //Por padrão, a tarefa é criada na coluna "A fazer". Depois o usuário pode mover para as outras colunas.
  const colunAfazer = document.getElementById('afazer');
  colunAfazer.appendChild(novoCard);

  input.value = "";
}