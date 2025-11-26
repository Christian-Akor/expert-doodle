/**
 * Code Mood Analyzer - Core Analysis Engine
 * Analyzes code files and determines their "mood" based on various metrics
 */

const MOOD_INDICATORS = {
  // Positive indicators
  positive: {
    words: ['success', 'happy', 'great', 'excellent', 'good', 'nice', 'awesome', 'perfect', 'wonderful', 'beautiful', 'clean', 'elegant'],
    patterns: [/\/\/\s*todo:\s*celebrate/i, /\/\/\s*nice!/i, /\/\/\s*well done/i]
  },
  // Negative indicators  
  negative: {
    words: ['hack', 'fixme', 'bug', 'ugly', 'terrible', 'bad', 'broken', 'deprecated', 'legacy', 'wtf', 'horrible', 'nightmare'],
    patterns: [/\/\/\s*todo:\s*fix/i, /\/\/\s*hack/i, /\/\/\s*wtf/i, /\/\/\s*why/i]
  },
  // Stress indicators
  stress: {
    words: ['urgent', 'asap', 'critical', 'emergency', 'deadline', 'hurry', 'rush'],
    patterns: [/!!+/, /\?\?\?+/, /TODO.*!/i]
  },
  // Zen indicators (well-organized code)
  zen: {
    patterns: [/\/\*\*[\s\S]*?\*\//, /^\s*\/\/.*$/m], // JSDoc and comments
    minCommentRatio: 0.15
  }
};

const MOOD_EMOJIS = {
  ecstatic: '🎉',
  happy: '😊',
  content: '🙂',
  neutral: '😐',
  stressed: '😰',
  frustrated: '😤',
  sad: '😢',
  zen: '🧘',
  chaotic: '🌪️',
  mysterious: '🔮'
};

const MOOD_DESCRIPTIONS = {
  ecstatic: 'This code is absolutely thriving! The developer was clearly in a great mood.',
  happy: 'Pleasant vibes here! The code seems well-maintained and loved.',
  content: 'Steady and stable. This code is doing its job without complaints.',
  neutral: 'Neither happy nor sad. Just code being code.',
  stressed: 'Uh oh! This code might be under some pressure. Watch out for deadlines!',
  frustrated: 'Someone was having a rough day. Consider some code therapy.',
  sad: 'This code needs a hug. Maybe some refactoring would help?',
  zen: 'Perfectly balanced, as all code should be. Clean, documented, harmonious.',
  chaotic: 'Wild and unpredictable! This code lives life on the edge.',
  mysterious: 'Enigmatic code that keeps its secrets close. What does it really do?'
};

/**
 * Analyzes a code string and returns mood metrics
 * @param {string} code - The source code to analyze
 * @param {string} filename - Optional filename for context
 * @returns {object} Analysis results
 */
function analyzeCode(code, filename = 'unknown') {
  const lines = code.split('\n');
  const metrics = {
    filename,
    totalLines: lines.length,
    codeLines: 0,
    commentLines: 0,
    blankLines: 0,
    avgLineLength: 0,
    longestLine: 0,
    shortestNonEmptyLine: Infinity,
    exclamationMarks: 0,
    questionMarks: 0,
    positiveWords: 0,
    negativeWords: 0,
    stressWords: 0,
    todoCount: 0,
    fixmeCount: 0,
    hackCount: 0,
    functionCount: 0,
    variableDeclarations: 0,
    nestingDepth: 0,
    hasTests: false
  };

  let currentDepth = 0;
  let maxDepth = 0;
  let totalLength = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    
    if (trimmed === '') {
      metrics.blankLines++;
    } else if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
      metrics.commentLines++;
    } else {
      metrics.codeLines++;
    }

    // Track line lengths
    if (trimmed.length > 0) {
      totalLength += trimmed.length;
      metrics.longestLine = Math.max(metrics.longestLine, trimmed.length);
      metrics.shortestNonEmptyLine = Math.min(metrics.shortestNonEmptyLine, trimmed.length);
    }

    // Count punctuation mood indicators
    metrics.exclamationMarks += (line.match(/!/g) || []).length;
    metrics.questionMarks += (line.match(/\?/g) || []).length;

    // Track nesting depth
    currentDepth += (line.match(/{/g) || []).length;
    currentDepth -= (line.match(/}/g) || []).length;
    maxDepth = Math.max(maxDepth, currentDepth);

    // Count functions: matches 'function name', arrow functions '=>', and function expressions
    if (/function\s+\w+|=>\s*{|\bconst\s+\w+\s*=\s*(?:async\s+)?(?:function|\()/.test(line)) {
      metrics.functionCount++;
    }
    if (/(?:const|let|var)\s+\w+/.test(line)) {
      metrics.variableDeclarations++;
    }
  }

  const nonBlankLines = metrics.totalLines - metrics.blankLines;
  metrics.avgLineLength = nonBlankLines > 0 ? Math.round(totalLength / nonBlankLines) : 0;
  metrics.nestingDepth = maxDepth;
  if (metrics.shortestNonEmptyLine === Infinity) metrics.shortestNonEmptyLine = 0;

  // Count mood words
  const lowerCode = code.toLowerCase();
  
  for (const word of MOOD_INDICATORS.positive.words) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    metrics.positiveWords += (code.match(regex) || []).length;
  }
  
  for (const word of MOOD_INDICATORS.negative.words) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    metrics.negativeWords += (code.match(regex) || []).length;
  }

  for (const word of MOOD_INDICATORS.stress.words) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    metrics.stressWords += (code.match(regex) || []).length;
  }

  // Count specific markers
  metrics.todoCount = (lowerCode.match(/todo/g) || []).length;
  metrics.fixmeCount = (lowerCode.match(/fixme/g) || []).length;
  metrics.hackCount = (lowerCode.match(/hack/g) || []).length;

  // Check for test patterns
  metrics.hasTests = /(?:describe|it|test|expect|assert)\s*\(/.test(code);

  return metrics;
}

/**
 * Determines the mood based on collected metrics
 * @param {object} metrics - The analysis metrics
 * @returns {object} Mood determination with score and description
 */
function determineMood(metrics) {
  let moodScore = 50; // Start neutral

  // Comment ratio affects zen
  const commentRatio = metrics.commentLines / (metrics.codeLines || 1);
  if (commentRatio >= 0.2) moodScore += 15;
  else if (commentRatio >= 0.1) moodScore += 5;
  else if (commentRatio < 0.05) moodScore -= 10;

  // Positive vs negative words
  moodScore += metrics.positiveWords * 5;
  moodScore -= metrics.negativeWords * 8;
  moodScore -= metrics.stressWords * 10;

  // TODOs and FIXMEs indicate work stress
  moodScore -= metrics.todoCount * 3;
  moodScore -= metrics.fixmeCount * 5;
  moodScore -= metrics.hackCount * 7;

  // Deep nesting is stressful
  if (metrics.nestingDepth > 5) moodScore -= 15;
  else if (metrics.nestingDepth > 3) moodScore -= 5;

  // Very long lines suggest frustration
  if (metrics.longestLine > 150) moodScore -= 10;
  else if (metrics.longestLine > 100) moodScore -= 5;

  // Excessive punctuation
  const punctuationDensity = (metrics.exclamationMarks + metrics.questionMarks) / (metrics.totalLines || 1);
  if (punctuationDensity > 0.5) moodScore -= 15;

  // Tests are positive!
  if (metrics.hasTests) moodScore += 10;

  // Determine mood category
  let mood;
  const isZen = commentRatio >= 0.15 && metrics.nestingDepth <= 3 && metrics.hackCount === 0;
  const isChaotic = metrics.nestingDepth > 5 || punctuationDensity > 0.3;
  const isMysterious = commentRatio < 0.02 && metrics.totalLines > 50;

  if (isZen && moodScore >= 60) {
    mood = 'zen';
  } else if (isChaotic && moodScore < 40) {
    mood = 'chaotic';
  } else if (isMysterious) {
    mood = 'mysterious';
  } else if (moodScore >= 80) {
    mood = 'ecstatic';
  } else if (moodScore >= 65) {
    mood = 'happy';
  } else if (moodScore >= 55) {
    mood = 'content';
  } else if (moodScore >= 45) {
    mood = 'neutral';
  } else if (moodScore >= 35) {
    mood = 'stressed';
  } else if (moodScore >= 25) {
    mood = 'frustrated';
  } else {
    mood = 'sad';
  }

  return {
    mood,
    score: Math.max(0, Math.min(100, moodScore)),
    emoji: MOOD_EMOJIS[mood],
    description: MOOD_DESCRIPTIONS[mood],
    isZen,
    isChaotic,
    isMysterious
  };
}

/**
 * Generates suggestions based on the mood analysis
 * @param {object} metrics - The analysis metrics
 * @param {object} moodResult - The mood determination result
 * @returns {string[]} Array of suggestions
 */
function generateSuggestions(metrics, moodResult) {
  const suggestions = [];

  if (metrics.commentLines / (metrics.codeLines || 1) < 0.1) {
    suggestions.push('💡 Consider adding more comments to explain your code\'s intent');
  }

  if (metrics.nestingDepth > 4) {
    suggestions.push('🔄 Deep nesting detected! Consider extracting some logic into separate functions');
  }

  if (metrics.hackCount > 0) {
    suggestions.push('🔧 You have ' + metrics.hackCount + ' hack(s) in your code. Time for some cleanup?');
  }

  if (metrics.todoCount > 3) {
    suggestions.push('📝 Lots of TODOs piling up! Maybe tackle a few today?');
  }

  if (metrics.longestLine > 120) {
    suggestions.push('📏 Some lines are quite long. Consider breaking them up for readability');
  }

  if (moodResult.mood === 'zen') {
    suggestions.push('✨ Your code is in a great state! Keep up the good work');
  }

  if (moodResult.mood === 'mysterious') {
    suggestions.push('🔮 Your code is shrouded in mystery. Future you will thank present you for comments!');
  }

  if (!metrics.hasTests && metrics.functionCount > 3) {
    suggestions.push('🧪 No tests detected! Consider adding some to ensure reliability');
  }

  return suggestions;
}

/**
 * Formats the analysis results for display
 * @param {object} metrics - The analysis metrics
 * @param {object} moodResult - The mood determination result
 * @param {string[]} suggestions - The generated suggestions
 * @returns {string} Formatted output string
 */
function formatResults(metrics, moodResult, suggestions) {
  const divider = '═'.repeat(50);
  const thinDivider = '─'.repeat(50);
  
  let output = `
${divider}
  📊 CODE MOOD ANALYZER RESULTS
${divider}

📁 File: ${metrics.filename}
${moodResult.emoji}  Mood: ${moodResult.mood.toUpperCase()} (Score: ${moodResult.score}/100)

"${moodResult.description}"

${thinDivider}
📈 STATISTICS
${thinDivider}
  Total Lines:     ${metrics.totalLines}
  Code Lines:      ${metrics.codeLines}
  Comment Lines:   ${metrics.commentLines}
  Blank Lines:     ${metrics.blankLines}
  Functions:       ${metrics.functionCount}
  Max Nesting:     ${metrics.nestingDepth} levels

${thinDivider}
🎯 MOOD INDICATORS
${thinDivider}
  Positive Words:  ${metrics.positiveWords} 😊
  Negative Words:  ${metrics.negativeWords} 😢
  Stress Words:    ${metrics.stressWords} 😰
  TODOs:           ${metrics.todoCount}
  FIXMEs:          ${metrics.fixmeCount}
  Hacks:           ${metrics.hackCount}
`;

  if (suggestions.length > 0) {
    output += `
${thinDivider}
💭 SUGGESTIONS
${thinDivider}
${suggestions.map(s => '  • ' + s).join('\n')}
`;
  }

  output += `
${divider}
`;

  return output;
}

module.exports = {
  analyzeCode,
  determineMood,
  generateSuggestions,
  formatResults,
  MOOD_EMOJIS,
  MOOD_DESCRIPTIONS
};
