const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const stateManager = require('./state-manager')

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

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
  console.log("Undo requested by", socket.id);

  stateManager.undoLastStroke();

  const updatedHistory = stateManager.getStrokeHistory();

  console.log("Broadcasting canvas sync. History size:", updatedHistory.length);

  io.emit('canvas:sync', updatedHistory);
});

socket.on('action:clear', () => {
  console.log('Clear canvas requested by', socket.id);

  stateManager.clearHistory();

  const updatedHistory = stateManager.getStrokeHistory();

  io.emit('canvas:sync', updatedHistory);
});

});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
