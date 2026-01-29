/**
 * Canvas Module
 * 
 * Handles all drawing operations on the HTML5 canvas.
 * This includes:
 * - Setting up the canvas context
 * - Capturing mouse events
 * - Drawing strokes
 * - Rendering the canvas from stroke history
 */

// Get canvas element and context
const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');

// ===========================
// Canvas Setup
// ===========================

/**
 * Resize canvas to fill window
 * This is called on initialization and whenever window resizes
 */
function resizeCanvas() {
  // Set canvas size to match window
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 60; // Subtract control panel height

  // Redraw all strokes after resize
  // (This ensures nothing is lost when canvas is resized)
  redrawCanvas();
}

// Resize canvas on initialization
resizeCanvas();

// Resize canvas when window is resized
window.addEventListener('resize', resizeCanvas);

// ===========================
// Stroke Management
// ===========================

/**
 * Local stroke history (Step 1 only)
 * In Step 2, this will be replaced with server-synced history
 * Each stroke object contains:
 * - userId: who drew it
 * - color: brush color (hex)
 * - width: brush width (pixels)
 * - points: array of {x, y} coordinates
 * - timestamp: when stroke was created
 */
let strokeHistory = [];

/**
 * Create a new stroke object
 * @param {string} userId - User identifier
 * @param {string} color - Hex color code
 * @param {number} width - Brush width in pixels
 * @returns {Object} Empty stroke object ready to receive points
 */
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

/**
 * Generate a unique stroke ID
 * @returns {string} Unique identifier
 */
function generateStrokeId() {
  return `stroke_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Add a point to the current stroke
 * @param {Object} stroke - The stroke to add to
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 */
function addPointToStroke(stroke, x, y) {
  stroke.points.push({ x, y });
}

/**
 * Add a completed stroke to history
 * @param {Object} stroke - Completed stroke
 */
function addStrokeToHistory(stroke) {
  // Only add stroke if it has at least one point
  if (stroke.points.length > 0) {
    strokeHistory.push(stroke);
  }
}

// ===========================
// Drawing Functions
// ===========================

/**
 * Draw a single point on the canvas
 * Used to draw individual dots if user clicks without dragging
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {string} color - Hex color
 * @param {number} width - Brush width
 */
function drawPoint(x, y, color, width) {
  ctx.beginPath();
  ctx.arc(x, y, width / 2, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

/**
 * Draw a line between two points
 * Used to draw smooth lines between consecutive points
 * @param {number} fromX - Start X coordinate
 * @param {number} fromY - Start Y coordinate
 * @param {number} toX - End X coordinate
 * @param {number} toY - End Y coordinate
 * @param {string} color - Hex color
 * @param {number} width - Brush width
 */
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

/**
 * Redraw entire canvas from stroke history
 * This is called when:
 * - Canvas is resized
 * - Undo is performed (when implemented)
 * - Canvas is cleared
 */
function redrawCanvas() {
  // Clear canvas (fill with white)
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Redraw all strokes in history order
  for (let stroke of strokeHistory) {
    drawStroke(stroke);
  }
}

/**
 * Draw a complete stroke on the canvas
 * @param {Object} stroke - The stroke to draw
 */
function drawStroke(stroke) {
  const { color, width, points } = stroke;

  if (points.length === 0) {
    return; // Nothing to draw
  }

  if (points.length === 1) {
    // Single point: just draw a dot
    drawPoint(points[0].x, points[0].y, color, width);
  } else {
    // Multiple points: draw lines between consecutive points
    for (let i = 1; i < points.length; i++) {
      const from = points[i - 1];
      const to = points[i];
      drawLine(from.x, from.y, to.x, to.y, color, width);
    }
  }
}

/**
 * Clear entire canvas
 * This removes all strokes and resets the history
 */
function clearCanvasCompletely() {
  strokeHistory = [];
  redrawCanvas();
}

// ===========================
// Mouse Event Handling
// ===========================

/**
 * Current stroke being drawn
 * This is null when no stroke is in progress
 */
let currentStroke = null;

/**
 * Get mouse position relative to canvas
 * @param {MouseEvent} event - The mouse event
 * @returns {Object} {x, y} coordinates
 */
function getMousePos(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
}

/**
 * Handle mouse down (start drawing)
 */
canvas.addEventListener('mousedown', (event) => {
  const color = document.getElementById('colorPicker').value;
  const width = parseInt(document.getElementById('brushWidth').value);

  // Create a new stroke
  currentStroke = createStroke('user1', color, width); // TODO: Replace 'user1' with actual userId

  // Get starting position
  const pos = getMousePos(event);
  addPointToStroke(currentStroke, pos.x, pos.y);

  // Draw initial point
  drawPoint(pos.x, pos.y, color, width);
});

/**
 * Handle mouse move (draw line)
 */
canvas.addEventListener('mousemove', (event) => {
  // Only draw if mouse button is pressed
  if (!currentStroke) {
    return;
  }

  const pos = getMousePos(event);
  const lastPoint = currentStroke.points[currentStroke.points.length - 1];

  // Add new point to stroke
  addPointToStroke(currentStroke, pos.x, pos.y);

  // Draw line from last point to new point
  drawLine(
    lastPoint.x,
    lastPoint.y,
    pos.x,
    pos.y,
    currentStroke.color,
    currentStroke.width
  );
});

/**
 * Handle mouse up (finish drawing)
 */
canvas.addEventListener('mouseup', () => {
  if (currentStroke) {
    // Add completed stroke to history
    addStrokeToHistory(currentStroke);

    // TODO: Emit stroke to server via WebSocket
    // websocket.emit('stroke:draw', currentStroke);

    // Clear current stroke
    currentStroke = null;
  }
});

/**
 * Handle mouse leaving canvas (stop drawing)
 */
canvas.addEventListener('mouseleave', () => {
  if (currentStroke) {
    // Add completed stroke to history
    addStrokeToHistory(currentStroke);

    // TODO: Emit stroke to server via WebSocket
    // websocket.emit('stroke:draw', currentStroke);

    // Clear current stroke
    currentStroke = null;
  }
});

// ===========================
// UI Control Handlers
// ===========================

/**
 * Update brush width display when slider changes
 */
document.getElementById('brushWidth').addEventListener('input', (event) => {
  document.getElementById('widthDisplay').textContent = event.target.value;
});

/**
 * Clear canvas button
 */
document.getElementById('clearBtn').addEventListener('click', () => {
  clearCanvasCompletely();

  // TODO: Emit clear action to server
  // websocket.emit('action:clear');
});

// ===========================
// Public API for other modules
// ===========================

/**
 * Render remote strokes from server
 * This will be used in Step 2 to draw strokes from other users
 * @param {Object} stroke - The stroke to draw
 */
function renderRemoteStroke(stroke) {
  drawStroke(stroke);
}

/**
 * Update stroke history (called by server in later steps)
 * @param {Array} newHistory - New stroke history from server
 */
function updateStrokeHistory(newHistory) {
  strokeHistory = newHistory;
  redrawCanvas();
}

/**
 * Get current stroke history (for debugging)
 * @returns {Array} Current stroke history
 */
function getStrokeHistory() {
  return strokeHistory;
}
