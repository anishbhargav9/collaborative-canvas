/**
 * State Manager Module
 * 
 * Manages the server-side stroke history and undo operations.
 * This is the single source of truth for all drawing state.
 * 
 * Responsibilities:
 * - Maintain authoritative stroke history
 * - Add new strokes in order
 * - Implement global undo (remove last stroke)
 * - Validate stroke data
 * 
 * TODO: Implement in Step 2/3
 */

/**
 * Stroke history - the authoritative source of truth
 * @type {Array}
 */
let strokeHistory = [];

/**
 * Add a new stroke to the history
 * @param {Object} stroke - The stroke to add
 * @returns {Object} The stroke with timestamp added by server
 */
function addStroke(stroke) {
  // TODO: Validate stroke data
  // - Ensure required fields exist
  // - Ensure color is valid hex
  // - Ensure width is reasonable
  // - Ensure points array is not empty

  // Add server timestamp if not present
  if (!stroke.timestamp) {
    stroke.timestamp = Date.now();
  }

  // Add to history
  strokeHistory.push(stroke);

  return stroke;
}

/**
 * Remove the last stroke from history (undo)
 * @returns {Object|null} The removed stroke, or null if history is empty
 */
function undoLastStroke() {
  if (strokeHistory.length === 0) {
    console.log('Cannot undo: history is empty');
    return null;
  }

  const removed = strokeHistory.pop();
  console.log('Undo: removed stroke', removed.id);

  return removed;
}

/**
 * Get the current stroke history
 * @returns {Array} Copy of stroke history
 */
function getStrokeHistory() {
  return [...strokeHistory];
}

/**
 * Clear all strokes
 */
function clearHistory() {
  const count = strokeHistory.length;
  strokeHistory = [];
  console.log(`Cleared ${count} strokes`);
}

/**
 * Get history size
 * @returns {number} Number of strokes in history
 */
function getHistorySize() {
  return strokeHistory.length;
}

/**
 * Replace entire history (for sync)
 * @param {Array} newHistory - New stroke history
 */
function setStrokeHistory(newHistory) {
  strokeHistory = newHistory;
}

// ===========================
// Export for use in server.js
// ===========================

// TODO: Uncomment when implementing Step 2
// module.exports = {
//   addStroke,
//   undoLastStroke,
//   getStrokeHistory,
//   clearHistory,
//   getHistorySize,
//   setStrokeHistory
// };

console.log('State Manager module loaded (TODO: implement in Step 2)');
