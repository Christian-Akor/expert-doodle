/**
 * Happy Code Example
 * This file demonstrates well-maintained, positive code
 * 
 * This is excellent code that follows best practices!
 */

/**
 * A beautiful function that greets users nicely
 * @param {string} name - The user's name
 * @returns {string} A wonderful greeting
 */
function greetUser(name) {
  // Great job on passing a name!
  const greeting = `Hello, ${name}! Welcome to our awesome application!`;
  return greeting;
}

/**
 * Calculates happiness score - a nice utility
 * @param {number} smiles - Number of smiles
 * @param {number} laughs - Number of laughs  
 * @returns {number} The happiness score
 */
function calculateHappiness(smiles, laughs) {
  // Perfect formula for happiness!
  const happiness = smiles * 10 + laughs * 20;
  return happiness;
}

/**
 * Checks if everything is going well
 * @returns {boolean} Always true because life is good!
 */
function isEverythingGreat() {
  // Life is wonderful!
  return true;
}

// Export our beautiful functions
module.exports = {
  greetUser,
  calculateHappiness,
  isEverythingGreat
};
