#!/usr/bin/env node

/**
 * Code Mood Analyzer - CLI Interface
 * A fun tool that analyzes the "mood" of your code
 */

const path = require('path');
const { analyzeCode, determineMood, generateSuggestions, formatResults, MOOD_EMOJIS } = require('../lib/analyzer');
const { readFile, getCodeFiles, isDirectory, pathExists, isSupportedFile } = require('../lib/fileUtils');

const VERSION = '1.0.0';

/**
 * Prints the help message
 */
function printHelp() {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║            🎭 CODE MOOD ANALYZER v${VERSION}                    ║
╚═══════════════════════════════════════════════════════════════╝

Analyze the "mood" of your code based on comments, complexity,
naming patterns, and other fun metrics!

USAGE:
  code-mood <file|directory>     Analyze a file or directory
  code-mood --help               Show this help message
  code-mood --version            Show version number
  code-mood --moods              Show all possible moods

EXAMPLES:
  code-mood src/index.js         Analyze a single file
  code-mood ./src                Analyze all files in src/
  code-mood .                    Analyze current directory

SUPPORTED FILE TYPES:
  JavaScript (.js, .jsx)
  TypeScript (.ts, .tsx)
  Python (.py)
  Java (.java)
  C/C++ (.c, .cpp)
  C# (.cs)
  Go (.go)
  Ruby (.rb)
  Rust (.rs)
  PHP (.php)
  Swift (.swift)
  `);
}

/**
 * Prints all possible moods
 */
function printMoods() {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                   🎭 POSSIBLE MOODS                           ║
╚═══════════════════════════════════════════════════════════════╝
`);
  
  const moods = [
    { name: 'ECSTATIC', emoji: MOOD_EMOJIS.ecstatic, desc: 'Code is absolutely thriving!' },
    { name: 'HAPPY', emoji: MOOD_EMOJIS.happy, desc: 'Pleasant vibes, well-maintained' },
    { name: 'CONTENT', emoji: MOOD_EMOJIS.content, desc: 'Steady and stable' },
    { name: 'NEUTRAL', emoji: MOOD_EMOJIS.neutral, desc: 'Neither happy nor sad' },
    { name: 'STRESSED', emoji: MOOD_EMOJIS.stressed, desc: 'Under pressure!' },
    { name: 'FRUSTRATED', emoji: MOOD_EMOJIS.frustrated, desc: 'Someone had a rough day' },
    { name: 'SAD', emoji: MOOD_EMOJIS.sad, desc: 'Needs some love' },
    { name: 'ZEN', emoji: MOOD_EMOJIS.zen, desc: 'Perfectly balanced' },
    { name: 'CHAOTIC', emoji: MOOD_EMOJIS.chaotic, desc: 'Wild and unpredictable' },
    { name: 'MYSTERIOUS', emoji: MOOD_EMOJIS.mysterious, desc: 'Keeps its secrets' }
  ];

  for (const mood of moods) {
    console.log(`  ${mood.emoji}  ${mood.name.padEnd(12)} - ${mood.desc}`);
  }
  console.log();
}

/**
 * Prints the version
 */
function printVersion() {
  console.log(`Code Mood Analyzer v${VERSION}`);
}

/**
 * Analyzes a single file and returns the result
 * @param {string} filePath - Path to analyze
 * @returns {object|null} Analysis result or null
 */
function analyzeFile(filePath) {
  const code = readFile(filePath);
  if (!code) return null;
  
  const metrics = analyzeCode(code, path.basename(filePath));
  const moodResult = determineMood(metrics);
  const suggestions = generateSuggestions(metrics, moodResult);
  
  return { metrics, moodResult, suggestions };
}

/**
 * Calculates aggregate mood for multiple files
 * @param {object[]} results - Array of analysis results
 * @returns {object} Aggregate result
 */
function calculateAggregateMood(results) {
  const totals = {
    totalLines: 0,
    codeLines: 0,
    commentLines: 0,
    positiveWords: 0,
    negativeWords: 0,
    stressWords: 0,
    todoCount: 0,
    fixmeCount: 0,
    hackCount: 0,
    functionCount: 0
  };

  let totalScore = 0;
  const moodCounts = {};

  for (const result of results) {
    totals.totalLines += result.metrics.totalLines;
    totals.codeLines += result.metrics.codeLines;
    totals.commentLines += result.metrics.commentLines;
    totals.positiveWords += result.metrics.positiveWords;
    totals.negativeWords += result.metrics.negativeWords;
    totals.stressWords += result.metrics.stressWords;
    totals.todoCount += result.metrics.todoCount;
    totals.fixmeCount += result.metrics.fixmeCount;
    totals.hackCount += result.metrics.hackCount;
    totals.functionCount += result.metrics.functionCount;
    totalScore += result.moodResult.score;
    
    moodCounts[result.moodResult.mood] = (moodCounts[result.moodResult.mood] || 0) + 1;
  }

  const avgScore = Math.round(totalScore / results.length);
  const dominantMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0][0];

  return {
    fileCount: results.length,
    totals,
    avgScore,
    dominantMood,
    moodCounts
  };
}

/**
 * Prints aggregate results for a directory
 * @param {object} aggregate - Aggregate analysis data
 */
function printAggregateResults(aggregate) {
  const divider = '═'.repeat(50);
  const thinDivider = '─'.repeat(50);
  
  console.log(`
${divider}
  📊 CODEBASE MOOD SUMMARY
${divider}

  📁 Files Analyzed: ${aggregate.fileCount}
  📈 Average Mood Score: ${aggregate.avgScore}/100
  
  ${MOOD_EMOJIS[aggregate.dominantMood]}  Dominant Mood: ${aggregate.dominantMood.toUpperCase()}

${thinDivider}
📊 MOOD DISTRIBUTION
${thinDivider}`);

  for (const [mood, count] of Object.entries(aggregate.moodCounts).sort((a, b) => b[1] - a[1])) {
    const bar = '█'.repeat(Math.round((count / aggregate.fileCount) * 20));
    const percentage = Math.round((count / aggregate.fileCount) * 100);
    console.log(`  ${MOOD_EMOJIS[mood]} ${mood.padEnd(12)} ${bar} ${percentage}% (${count} files)`);
  }

  console.log(`
${thinDivider}
📈 AGGREGATE STATISTICS
${thinDivider}
  Total Lines:       ${aggregate.totals.totalLines}
  Code Lines:        ${aggregate.totals.codeLines}
  Comment Lines:     ${aggregate.totals.commentLines}
  Total Functions:   ${aggregate.totals.functionCount}
  
  Positive Words:    ${aggregate.totals.positiveWords} 😊
  Negative Words:    ${aggregate.totals.negativeWords} 😢
  Stress Words:      ${aggregate.totals.stressWords} 😰
  TODOs:             ${aggregate.totals.todoCount}
  FIXMEs:            ${aggregate.totals.fixmeCount}
  Hacks:             ${aggregate.totals.hackCount}
${divider}
`);
}

/**
 * Main CLI entry point
 */
function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    printHelp();
    return;
  }
  
  if (args.includes('--version') || args.includes('-v')) {
    printVersion();
    return;
  }
  
  if (args.includes('--moods')) {
    printMoods();
    return;
  }
  
  const target = args[0];
  const fullPath = path.resolve(target);
  
  if (!pathExists(fullPath)) {
    console.error(`Error: Path does not exist: ${target}`);
    process.exit(1);
  }
  
  if (isDirectory(fullPath)) {
    // Analyze directory
    const files = getCodeFiles(fullPath);
    
    if (files.length === 0) {
      console.log('No supported code files found in the directory.');
      return;
    }
    
    console.log(`\n🔍 Analyzing ${files.length} files...\n`);
    
    const results = [];
    for (const file of files) {
      const result = analyzeFile(file);
      if (result) {
        results.push(result);
        // Show individual file mood (compact)
        console.log(`  ${result.moodResult.emoji} ${path.relative(fullPath, file)} - ${result.moodResult.mood} (${result.moodResult.score})`);
      }
    }
    
    if (results.length > 0) {
      const aggregate = calculateAggregateMood(results);
      printAggregateResults(aggregate);
    }
  } else {
    // Analyze single file
    if (!isSupportedFile(fullPath)) {
      console.error('Error: Unsupported file type. Run --help to see supported types.');
      process.exit(1);
    }
    
    const result = analyzeFile(fullPath);
    if (result) {
      console.log(formatResults(result.metrics, result.moodResult, result.suggestions));
    }
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { main, analyzeFile, calculateAggregateMood };
