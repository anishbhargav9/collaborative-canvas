
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

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});
