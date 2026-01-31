
// Step 2: establish WebSocket connection

const socket = io();
window.socket=socket//exposing the socket for other modules

socket.on('connect', () => {
  console.log('Connected to server:', socket.id);
});
//handling incoming stroke drawing events from other clients
socket.on('stroke:draw', (stroke) => {
    //here we store the remote stroke in the history and render it on the canvas
    addStrokeToHistory(stroke)//this is used to keep the local stroke history updated with remote strokes
    //rendering the remote stroke on the canvas
  renderRemoteStroke(stroke);
});
// receive full canvas state from server so that it can  used after undo
socket.on('canvas:sync', (updatedHistory) => {
    console.log('Canvas sync received');// to check if sync is received
  updateStrokeHistory(updatedHistory);
});

document.addEventListener('DOMContentLoaded', () => {
  const undoButton = document.getElementById('undoBtn');

  if (!undoButton) return;

  undoButton.addEventListener('click', () => {
    console.log('Undo button clicked (websocket)');
    socket.emit('action:undo');
  });
});



socket.on('disconnect', () => {
  console.log('Disconnected from server');
});
7