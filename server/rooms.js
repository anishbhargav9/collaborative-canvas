/**
 * Rooms Module
 * 
 * Manages user presence and room associations.
 * Each room is a separate collaborative drawing space.
 * 
 * Responsibilities:
 * - Track which users are in which rooms
 * - Track which Socket.io clients are connected
 * - Provide user presence information
 * - Handle user join/leave events
 * 
 * TODO: Implement in Step 2
 */

/**
 * Room structure:
 * {
 *   roomId: {
 *     users: {
 *       userId: {
 *         socketId: string,
 *         joinedAt: timestamp
 *       }
 *     },
 *     createdAt: timestamp
 *   }
 * }
 */
let rooms = {};

/**
 * Create a new room
 * @param {string} roomId - Unique room identifier
 * @returns {Object} The created room
 */
function createRoom(roomId) {
  // TODO: Implement
}

/**
 * Add user to room
 * @param {string} roomId - Room identifier
 * @param {string} userId - User identifier
 * @param {string} socketId - Socket.io connection ID
 */
function addUserToRoom(roomId, userId, socketId) {
  // TODO: Implement
  // - Create room if not exists
  // - Add user to room.users
  // - Track socket connection
}

/**
 * Remove user from room
 * @param {string} roomId - Room identifier
 * @param {string} userId - User identifier
 * @returns {boolean} True if user was removed, false if not found
 */
function removeUserFromRoom(roomId, userId) {
  // TODO: Implement
  // - Remove user from room
  // - Delete room if empty
}

/**
 * Get all users in a room
 * @param {string} roomId - Room identifier
 * @returns {Array} Array of user IDs in the room
 */
function getRoomUsers(roomId) {
  // TODO: Implement
}

/**
 * Get user count in room
 * @param {string} roomId - Room identifier
 * @returns {number} Number of users in room
 */
function getRoomUserCount(roomId) {
  // TODO: Implement
}

/**
 * Get user's socket ID
 * @param {string} roomId - Room identifier
 * @param {string} userId - User identifier
 * @returns {string|null} Socket ID or null if not found
 */
function getUserSocket(roomId, userId) {
  // TODO: Implement
}

/**
 * Get all connected rooms
 * @returns {Array} Array of room IDs
 */
function getAllRooms() {
  // TODO: Implement
}

// ===========================
// Export for use in server.js
// ===========================

// TODO: Uncomment when implementing Step 2
// module.exports = {
//   createRoom,
//   addUserToRoom,
//   removeUserFromRoom,
//   getRoomUsers,
//   getRoomUserCount,
//   getUserSocket,
//   getAllRooms
// };

console.log('Rooms module loaded (TODO: implement in Step 2)');
