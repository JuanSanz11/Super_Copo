const pieces = document.querySelectorAll('.piece');
const dropzone = document.getElementById('cup-area');
const shuffleBtn = document.getElementById('shuffle');
const sticker = document.getElementById('flame-sticker');

// Posiciones fijas dentro del dropzone
const slotPositions = [
  { name: 'lid', top: 30 },
  { name: 'rim', top: 90 },
  { name: 'body', top: 150 },
  { name: 'base', top: 210 }
];

// Estado actual de las piezas
let placedPieces = {};

// Drag & Drop
pieces.forEach(piece => {
  piece.addEventListener('dragstart', e => {
    e.dataTransfer.setData('id', e.target.id);
  });
});

// Dropzone
dropzone.addEventListener('dragover', e => e.preventDefault());

dropzone.addEventListener('drop', e => {
  e.preventDefault();
  const id = e.dataTransfer.getData('id');
  const piece = document.getElementById(id);

  // Detecta posición vertical
  const y = e.offsetY;

  // Encuentra el slot más cercano
  let closest = slotPositions.reduce((prev, curr) => {
    return Math.abs(curr.top - y) < Math.abs(prev.top - y) ? curr : prev;
  });

  // Evita encimamiento
  if (placedPieces[closest.name]) {
    alert("Ya hay una pieza en esta posición. Retírala primero.");
    return;
  }

  // Posiciona la pieza
  piece.style.position = 'absolute';
  piece.style.top = `${closest.top}px`;
  const centerX = (dropzone.clientWidth - piece.clientWidth) / 2;
piece.style.left = `${centerX}px`;
  piece.style.transition = 'all 0.3s ease-in-out';
  dropzone.appendChild(piece);

  placedPieces[closest.name] = id;

  checkCompletion();
});

// Permite devolver piezas fuera del dropzone
pieces.forEach(piece => {
  piece.addEventListener('dblclick', () => {
    piece.style.position = 'static';
    document.querySelector('.pieces').appendChild(piece);

    // Elimina del estado
    for (let key in placedPieces) {
      if (placedPieces[key] === piece.id) {
        delete placedPieces[key];
      }
    }
  });
});

// Verifica si el vaso está completo y en orden
function checkCompletion() {
  const correctOrder = ['lid', 'rim', 'body', 'base'];
  for (let i = 0; i < correctOrder.length; i++) {
    if (placedPieces[correctOrder[i]] !== correctOrder[i]) {
      return;
    }
  }

  // Animación de encaje
  Object.values(placedPieces).forEach(id => {
    const piece = document.getElementById(id);
    piece.classList.add('assembled');
    setTimeout(() => {
      piece.classList.remove('assembled');
    }, 600);
  });

  // Mostrar sticker
  sticker.classList.remove('hidden');
  setTimeout(() => {
    sticker.classList.add('show');
  }, 100);

  // Efecto visual
  dropzone.style.borderColor = 'green';
  dropzone.style.boxShadow = '0 0 20px lime';

  // Sonido
  const audio = new Audio('../assets/success.mp3');
  audio.play();

  alert("¡Vaso completo! ☕🔥");
}

// Botón para revolver piezas
shuffleBtn.addEventListener('click', () => {
  const container = document.querySelector('.pieces');
  const shuffled = Array.from(pieces).sort(() => Math.random() - 0.5);
  shuffled.forEach(piece => {
    piece.style.position = 'static';
    container.appendChild(piece);
  });

  

  // Limpia estado
  placedPieces = {};
  dropzone.style.borderColor = '#aaa';
  dropzone.style.boxShadow = 'none';
  sticker.classList.remove('show');
  sticker.classList.add('hidden');
});


// Mezcla automática al cargar la app
window.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.pieces');
  const shuffled = Array.from(pieces).sort(() => Math.random() - 0.5);
  shuffled.forEach(piece => {
    piece.style.position = 'static';
    container.appendChild(piece);
  });
});