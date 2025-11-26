/**
 * File utilities for the Code Mood Analyzer
 * Handles reading files and directories
 */

const fs = require('fs');
const path = require('path');

const SUPPORTED_EXTENSIONS = ['.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.c', '.cpp', '.cs', '.go', '.rb', '.rs', '.php', '.swift'];

/**
 * Checks if a file has a supported extension
 * @param {string} filename - The filename to check
 * @returns {boolean} True if supported
 */
function isSupportedFile(filename) {
  const ext = path.extname(filename).toLowerCase();
  return SUPPORTED_EXTENSIONS.includes(ext);
}

/**
 * Reads a file and returns its contents
 * @param {string} filePath - Path to the file
 * @returns {string|null} File contents or null if error
 */
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error(`Error reading file ${filePath}: ${error.message}`);
    return null;
  }
}

/**
 * Gets all code files from a directory recursively
 * @param {string} dirPath - Path to the directory
 * @param {number} depth - Current recursion depth
 * @param {number} maxDepth - Maximum recursion depth
 * @returns {string[]} Array of file paths
 */
function getCodeFiles(dirPath, depth = 0, maxDepth = 5) {
  const files = [];
  
  if (depth > maxDepth) return files;
  
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      
      // Skip node_modules, .git, and other common non-code directories
      if (entry.isDirectory()) {
        if (!['node_modules', '.git', 'dist', 'build', 'coverage', '__pycache__', '.next'].includes(entry.name)) {
          files.push(...getCodeFiles(fullPath, depth + 1, maxDepth));
        }
      } else if (entry.isFile() && isSupportedFile(entry.name)) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dirPath}: ${error.message}`);
  }
  
  return files;
}

/**
 * Checks if a path is a directory
 * @param {string} pathToCheck - Path to check
 * @returns {boolean} True if directory
 */
function isDirectory(pathToCheck) {
  try {
    return fs.statSync(pathToCheck).isDirectory();
  } catch {
    return false;
  }
}

/**
 * Checks if a path exists
 * @param {string} pathToCheck - Path to check
 * @returns {boolean} True if exists
 */
function pathExists(pathToCheck) {
  return fs.existsSync(pathToCheck);
}

module.exports = {
  isSupportedFile,
  readFile,
  getCodeFiles,
  isDirectory,
  pathExists,
  SUPPORTED_EXTENSIONS
};
