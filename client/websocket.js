
// Step 2: establish WebSocket connection

const socket = io();
window.socket=socket//exposing the socket for other modules

socket.on('connect', () => {
  console.log('Connected to server:', socket.id);
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});
