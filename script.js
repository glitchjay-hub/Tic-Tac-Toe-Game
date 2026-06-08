// Two-player Tic-Tac-Toe (local, same device)
const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const restartBtn = document.getElementById('restartBtn');

let board = Array(9).fill(null); // null, 'X' or 'O'
let currentPlayer = 'X';
let gameActive = true;

// Winning combos
const wins = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function init(){
  board = Array(9).fill(null);
  currentPlayer = 'X';
  gameActive = true;
  renderBoard();
  updateStatus(`Turn: ${currentPlayer}`);
}

function renderBoard(){
  boardEl.innerHTML = '';
  for(let i=0;i<9;i++){
    const cell = document.createElement('button');
    cell.className = 'cell';
    cell.setAttribute('data-index', i);
    cell.setAttribute('aria-label', `Cell ${i+1}`);
    cell.textContent = board[i] ? board[i] : '';
    if(board[i]) cell.classList.add('taken');
    cell.addEventListener('click', onCellClick);
    boardEl.appendChild(cell);
  }
}

function onCellClick(e){
  if(!gameActive) return;
  const idx = Number(e.currentTarget.dataset.index);
  if(board[idx]) return; // already taken
  makeMove(idx, currentPlayer);
}

function makeMove(index, mark){
  if(board[index] || !gameActive) return;
  board[index] = mark;
  renderBoard();
  const winner = checkWinner(board);
  if(winner){
    endGame(winner);
    return;
  }
  currentPlayer = (currentPlayer === 'X') ? 'O' : 'X';
  updateStatus(`Turn: ${currentPlayer}`);
}

function checkWinner(b){
  for(const [a,bIdx,c] of wins){
    if(b[a] && b[a] === b[bIdx] && b[a] === b[c]) return b[a];
  }
  if(b.every(cell => cell)) return 'tie';
  return null;
}

function endGame(result){
  gameActive = false;
  if(result === 'tie'){
    updateStatus("It's a tie!");
    flashStatus('tie');
  } else {
    updateStatus(`${result} wins!`);
    flashStatus('win');
    highlightWinningCells(result);
  }
}

function updateStatus(text){
  statusEl.textContent = text;
}

function flashStatus(type){
  if(type === 'win'){
    statusEl.style.background = 'linear-gradient(90deg, rgba(16,185,129,0.12), transparent)';
  } else if(type === 'tie'){
    statusEl.style.background = 'rgba(255,255,255,0.02)';
  }
  setTimeout(()=> statusEl.style.background = 'rgba(255,255,255,0.02)', 1400);
}

function highlightWinningCells(winner){
  for(const combo of wins){
    const [a,b,c] = combo;
    if(board[a] === winner && board[b] === winner && board[c] === winner){
      // add a visual mark to those cells
      const nodes = boardEl.querySelectorAll('.cell');
      [a,b,c].forEach(i => nodes[i].style.background = 'linear-gradient(90deg, rgba(16,185,129,0.12), rgba(6,182,212,0.06))');
      break;
    }
  }
}

// UI wiring
restartBtn.addEventListener('click', init);

// Initialize on load
init();
