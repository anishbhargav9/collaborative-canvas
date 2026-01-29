/**
 * Main Application Module
 * 
 * Initializes the application and coordinates between modules:
 * - Canvas module (drawing)
 * - WebSocket module (communication)
 * 
 * This is intentionally minimal for Step 1.
 * More initialization will be added in Step 2.
 */

/**
 * Initialize application
 * Called when page finishes loading
 */
function initApp() {
  console.log('=== Collaborative Drawing Canvas ===');
  console.log('Step 1: Local Drawing (No Sync Yet)');
  console.log('');
  console.log('Available features:');
  console.log('- Draw on canvas with mouse');
  console.log('- Change brush color');
  console.log('- Adjust brush width');
  console.log('- Clear canvas');
  console.log('');
  console.log('Use console for debugging:');
  console.log('- getStrokeHistory() - View all strokes');
  console.log('');

  // TODO: Step 2 - Initialize WebSocket connection
  // This will connect to server and sync with other users

  // TODO: Step 3 - Add undo button and implement global undo

  console.log('Ready to draw!');
}

// Initialize app when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
