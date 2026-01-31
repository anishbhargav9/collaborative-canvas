
// This state-manager.js file is responsible for managing the drawing state on the server side

let strokeHistory = [];

// add a new stroke to the history so that the server remembers that has been drawnand can rebuild the canvas for new clients at any time
function addStroke(stroke) {
  if (!stroke || !Array.isArray(stroke.points) || stroke.points.length === 0) {
    return null;
  }

  if (!stroke.timestamp) {
    stroke.timestamp = Date.now();
  }

  strokeHistory.push(stroke);
  return stroke;
}

// remove the most recent stroke this is know as the global undo operation
function undoLastStroke() {
  if (strokeHistory.length === 0) {
    return null;
  }
  return strokeHistory.pop();
}

// return a copy of the current history because we don't want external modules to modify our internal state directly
function getStrokeHistory() {
  return [...strokeHistory];
}

// clear entire history  so that the canvas can be reset and redrawn from scratch
function clearHistory() {
  strokeHistory = [];
}

// number of strokes stored in history for status reporting or validation
function getHistorySize() {
  return strokeHistory.length;
}

// replace history completely this is mainly used for the initial sync when a new client connects
function setStrokeHistory(newHistory) {
  strokeHistory = Array.isArray(newHistory) ? newHistory : [];
}

module.exports = {
  addStroke,
  undoLastStroke,
  getStrokeHistory,
  clearHistory,
  getHistorySize,
  setStrokeHistory
};
