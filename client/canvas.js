

//here the canvas.js file handles local drawing functionality 
const canvas = document.getElementById('drawingCanvas'); //using the javaScript we are controlling and updating the canvas.
const ctx = canvas.getContext('2d');//this is the context which gives you the drawing tool for the canvas
let strokeHistory = [];



// this function is used to resize the canvas according to the window size
function resizeCanvas() {
  // Set canvas size to match window
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 60; // leaving space for control panel
  redrawCanvas();// this function is used to redraw stored strokes after resizing the canvas
}

// resizeing  canvas on initialization
resizeCanvas();

// resize again if window size changes
window.addEventListener('resize', resizeCanvas);

//this below array is used to store the strokes drawn on the canvas

//this function creates a new stroke object with given parameters
function createStroke(userId, color, width) {
  return {
    id: generateStrokeId(),
    userId: userId,
    color: color,
    width: width,
    points: [],
    timestamp: Date.now()
  };
}

//we will generate unique id for each stroke so that we can identify them later when we require
function generateStrokeId() {
  return `stroke_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

//this function adds a new point to the current stroke being drawn
function addPointToStroke(stroke, x, y) {
  stroke.points.push({ x, y });
}

//we will save completed strokes to the history for future reference
function addStrokeToHistory(stroke) {
  // Only add stroke if it has at least one point
  if (stroke.points.length > 0) {
    strokeHistory.push(stroke);
  }
}

// used to draw a single point on the canvas
function drawPoint(x, y, color, width) {
  ctx.beginPath();
  ctx.arc(x, y, width / 2, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

//this below function draws a line between two points with specified color and width
function drawLine(fromX, fromY, toX, toY, color, width) {
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round'; // Smooth line ends
  ctx.lineJoin = 'round'; // Smooth line corners
  ctx.stroke();
  ctx.closePath();
}

//this function redraws the entire canvas based on the stored stroke history
function redrawCanvas() {
  
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (let stroke of strokeHistory) {
    drawStroke(stroke);
  }
}

//this function draws a complete stroke on the canvas using the stored points
function drawStroke(stroke) {
  const { color, width, points } = stroke;

  if (points.length === 0) {
    return; 
  }

  if (points.length === 1) {
    drawPoint(points[0].x, points[0].y, color, width);
  } else {
    
    for (let i = 1; i < points.length; i++) {
      const from = points[i - 1];
      const to = points[i];
      drawLine(from.x, from.y, to.x, to.y, color, width);
    }
  }
}

//here the below function clears the entire canvas and resets the stroke history
function clearCanvasCompletely() {
  strokeHistory = [];
  redrawCanvas();
}


let currentStroke = null;//current storke being drawn by the user while mouse is pressed


function getMousePos(event) {//converting the mouse event coordinates to canvas coordinates
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
}


canvas.addEventListener('mousedown', (event) => {// we will start drawing here
  const color = document.getElementById('colorPicker').value;
  const width = parseInt(document.getElementById('brushWidth').value);

  currentStroke = createStroke('user1', color, width); // userid will come from the server later

  const pos = getMousePos(event);
  addPointToStroke(currentStroke, pos.x, pos.y);
  drawPoint(pos.x, pos.y, color, width);
});

//drawing continues as mouse moves
canvas.addEventListener('mousemove', (event) => {
  if (!currentStroke) {
    return;
  }

  const pos = getMousePos(event);
  const lastPoint = currentStroke.points[currentStroke.points.length - 1];

  // Add new point to stroke
  addPointToStroke(currentStroke, pos.x, pos.y);
  drawLine(
    lastPoint.x,
    lastPoint.y,
    pos.x,
    pos.y,
    currentStroke.color,
    currentStroke.width
  );
});

//drawing ends when mouse is released
canvas.addEventListener('mouseup', () => {
  if (!currentStroke)return;
    addStrokeToHistory(currentStroke);
    //here i am sending the stroke to the server
    if (window.socket) {
    window.socket.emit('stroke:draw', currentStroke);
  }
    currentStroke = null;
  
});

// also handle case when mouse leaves canvas while drawing
canvas.addEventListener('mouseleave', () => {
  if (!currentStroke) return;
    addStrokeToHistory(currentStroke);
    if (window.socket) {
    window.socket.emit('stroke:draw', currentStroke);
  }
    currentStroke = null;
  
});

//updating the brush width display when slider is moved
document.getElementById('brushWidth').addEventListener('input', (event) => {
  document.getElementById('widthDisplay').textContent = event.target.value;
});

//handling clear button click to clear the canvas
document.getElementById('clearBtn').addEventListener('click', () => {
  clearCanvasCompletely();
});

// used to render remote strokes received from server
function renderRemoteStroke(stroke) {
  drawStroke(stroke);
}

// used to update local stroke history with server data and sync it
function updateStrokeHistory(newHistory) {
  strokeHistory = newHistory;
  redrawCanvas();
}


function getStrokeHistory() {//this will help for debugging to view all stored strokes
  return strokeHistory;
}

//  handling undo button click to request global undo from server
const undoButton = document.getElementById('undoBtn');

if (undoButton) {
  undoButton.addEventListener('click', () => {
    console.log('Undo button clicked');
    console.log('Socket object:', window.socket);

    if (window.socket && window.socket.connected) {
      console.log('Emitting action:undo');
      window.socket.emit('action:undo');
    } else {
      console.log('Socket not connected');
    }
  });
}



