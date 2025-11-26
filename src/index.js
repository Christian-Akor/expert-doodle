/**
 * Code Mood Analyzer - Main Entry Point
 * Re-exports all functionality for use as a library
 */

const { analyzeCode, determineMood, generateSuggestions, formatResults, MOOD_EMOJIS, MOOD_DESCRIPTIONS } = require('../lib/analyzer');
const { readFile, getCodeFiles, isDirectory, pathExists, isSupportedFile, SUPPORTED_EXTENSIONS } = require('../lib/fileUtils');
const { main, analyzeFile, calculateAggregateMood } = require('./cli');

module.exports = {
  // Analysis functions
  analyzeCode,
  determineMood,
  generateSuggestions,
  formatResults,
  
  // File utilities
  readFile,
  getCodeFiles,
  isDirectory,
  pathExists,
  isSupportedFile,
  
  // CLI functions
  main,
  analyzeFile,
  calculateAggregateMood,
  
  // Constants
  MOOD_EMOJIS,
  MOOD_DESCRIPTIONS,
  SUPPORTED_EXTENSIONS
};
