const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 3000;
//moiddleware to parse JSON objects
app.use(express.json());
//here we are using express.static to serve client files
app.use(express.static(path.join(__dirname, '../client')));
//establish socket connection
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  //it will listen for stroke drawing events from clients
  socket.on('stroke:draw', (stroke) => {
    console.log('Received stroke from', socket.id);

    // sending  the stroke to all other connected clients so that they can render it on their canvases
  socket.broadcast.emit('stroke:draw', stroke);
  });
  //handling client disconnection if disconnected it will log the socket id in the console
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
