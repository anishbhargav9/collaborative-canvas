const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const stateManager = require('./state-manager');

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
    //here we add the stroke to the server's authoritative history
  const savedStroke = stateManager.addStroke(stroke);
  if (!savedStroke) return;
    // sending  the stroke to all other connected clients so that they can render it on their canvases
  socket.broadcast.emit('stroke:draw', savedStroke);
});

  //handling client disconnection if disconnected it will log the socket id in the console
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });


  //adding a new functionality that is the global undo feature
  socket.on('action:undo', () => {
  stateManager.undoLastStroke();//removing the last stroke from the server's history
  const updatedHistory = stateManager.getStrokeHistory();//getting the updated history after undo
  io.emit('canvas:sync', updatedHistory);//sending the updated history to all clients to sync their canvases
});

});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
