/**
 * Zen Code Example
 * 
 * This module demonstrates perfectly balanced, clean code.
 * Each function has a single responsibility and is well-documented.
 * 
 * @module zen-code
 * @author Code Mood Analyzer
 */

/**
 * Represents a meditation session.
 * @typedef {Object} MeditationSession
 * @property {number} duration - Duration in minutes
 * @property {string} type - Type of meditation
 * @property {Date} timestamp - When the session occurred
 */

/**
 * Creates a new meditation session.
 * 
 * @param {number} duration - The duration in minutes
 * @param {string} type - The type of meditation
 * @returns {MeditationSession} A new meditation session
 */
function createSession(duration, type) {
  return {
    duration,
    type,
    timestamp: new Date()
  };
}

/**
 * Calculates total meditation time.
 * 
 * @param {MeditationSession[]} sessions - Array of sessions
 * @returns {number} Total minutes meditated
 */
function getTotalTime(sessions) {
  return sessions.reduce((total, session) => {
    return total + session.duration;
  }, 0);
}

/**
 * Formats duration for display.
 * 
 * @param {number} minutes - Duration in minutes
 * @returns {string} Formatted duration string
 */
function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins} minutes`;
  }
  
  return `${hours} hours, ${mins} minutes`;
}

/**
 * Checks if a session is valid.
 * 
 * @param {MeditationSession} session - Session to validate
 * @returns {boolean} True if valid
 */
function isValidSession(session) {
  return (
    session !== null &&
    typeof session.duration === 'number' &&
    session.duration > 0 &&
    typeof session.type === 'string' &&
    session.type.length > 0
  );
}

module.exports = {
  createSession,
  getTotalTime,
  formatDuration,
  isValidSession
};
