/**
 * Tests for the Code Mood Analyzer
 */

const { analyzeCode, determineMood, generateSuggestions, MOOD_EMOJIS } = require('../lib/analyzer');

describe('analyzeCode', () => {
  test('should count lines correctly', () => {
    const code = `// Comment
const x = 1;

const y = 2;`;
    
    const result = analyzeCode(code, 'test.js');
    
    expect(result.totalLines).toBe(4);
    expect(result.commentLines).toBe(1);
    expect(result.codeLines).toBe(2);
    expect(result.blankLines).toBe(1);
  });

  test('should count positive words', () => {
    const code = `// This is great code!
// Excellent work, beautiful solution
function awesome() { return 'nice'; }`;
    
    const result = analyzeCode(code, 'test.js');
    
    expect(result.positiveWords).toBeGreaterThan(0);
  });

  test('should count negative words', () => {
    const code = `// HACK: This is ugly code
// TODO: FIXME: broken legacy code
function terrible() { return 'bad'; }`;
    
    const result = analyzeCode(code, 'test.js');
    
    expect(result.negativeWords).toBeGreaterThan(0);
    expect(result.hackCount).toBe(1);
  });

  test('should count TODOs and FIXMEs', () => {
    const code = `// TODO: Fix this
// TODO: Another thing
// FIXME: Broken
// FIXME: Also broken`;
    
    const result = analyzeCode(code, 'test.js');
    
    expect(result.todoCount).toBe(2);
    expect(result.fixmeCount).toBe(2);
  });

  test('should detect stress words', () => {
    const code = `// URGENT: This is critical!
// Emergency deadline ASAP!!!`;
    
    const result = analyzeCode(code, 'test.js');
    
    expect(result.stressWords).toBeGreaterThan(0);
  });

  test('should count functions', () => {
    const code = `function one() {}
const two = function() {};
const three = () => {};
async function four() {}`;
    
    const result = analyzeCode(code, 'test.js');
    
    expect(result.functionCount).toBeGreaterThanOrEqual(2);
  });

  test('should calculate nesting depth', () => {
    const code = `function test() {
  if (true) {
    if (true) {
      if (true) {
        return 1;
      }
    }
  }
}`;
    
    const result = analyzeCode(code, 'test.js');
    
    expect(result.nestingDepth).toBe(4);
  });

  test('should detect test patterns', () => {
    const code = `describe('test', () => {
  it('should work', () => {
    expect(true).toBe(true);
  });
});`;
    
    const result = analyzeCode(code, 'test.js');
    
    expect(result.hasTests).toBe(true);
  });

  test('should handle empty code', () => {
    const code = '';
    const result = analyzeCode(code, 'empty.js');
    
    expect(result.totalLines).toBe(1);
    expect(result.codeLines).toBe(0);
  });
});

describe('determineMood', () => {
  test('should return happy mood for positive code', () => {
    const metrics = {
      totalLines: 50,
      codeLines: 40,
      commentLines: 10,
      positiveWords: 5,
      negativeWords: 0,
      stressWords: 0,
      todoCount: 0,
      fixmeCount: 0,
      hackCount: 0,
      nestingDepth: 2,
      longestLine: 80,
      exclamationMarks: 0,
      questionMarks: 0,
      hasTests: true
    };
    
    const result = determineMood(metrics);
    
    expect(['happy', 'ecstatic', 'content', 'zen']).toContain(result.mood);
    expect(result.score).toBeGreaterThan(50);
  });

  test('should return sad/frustrated mood for negative code', () => {
    const metrics = {
      totalLines: 50,
      codeLines: 48,
      commentLines: 2,
      positiveWords: 0,
      negativeWords: 10,
      stressWords: 5,
      todoCount: 5,
      fixmeCount: 3,
      hackCount: 3,
      nestingDepth: 6,
      longestLine: 200,
      exclamationMarks: 20,
      questionMarks: 10,
      hasTests: false
    };
    
    const result = determineMood(metrics);
    
    expect(['sad', 'frustrated', 'stressed', 'chaotic']).toContain(result.mood);
    expect(result.score).toBeLessThan(50);
  });

  test('should return zen mood for well-balanced code', () => {
    const metrics = {
      totalLines: 100,
      codeLines: 70,
      commentLines: 20,
      positiveWords: 2,
      negativeWords: 0,
      stressWords: 0,
      todoCount: 0,
      fixmeCount: 0,
      hackCount: 0,
      nestingDepth: 2,
      longestLine: 80,
      exclamationMarks: 0,
      questionMarks: 0,
      hasTests: true
    };
    
    const result = determineMood(metrics);
    
    expect(result.mood).toBe('zen');
    expect(result.isZen).toBe(true);
  });

  test('should return mysterious mood for uncommented code', () => {
    const metrics = {
      totalLines: 100,
      codeLines: 99,
      commentLines: 0,
      positiveWords: 0,
      negativeWords: 0,
      stressWords: 0,
      todoCount: 0,
      fixmeCount: 0,
      hackCount: 0,
      nestingDepth: 3,
      longestLine: 100,
      exclamationMarks: 0,
      questionMarks: 0,
      hasTests: false
    };
    
    const result = determineMood(metrics);
    
    expect(result.mood).toBe('mysterious');
    expect(result.isMysterious).toBe(true);
  });

  test('should have emoji for every mood', () => {
    expect(MOOD_EMOJIS.ecstatic).toBeDefined();
    expect(MOOD_EMOJIS.happy).toBeDefined();
    expect(MOOD_EMOJIS.content).toBeDefined();
    expect(MOOD_EMOJIS.neutral).toBeDefined();
    expect(MOOD_EMOJIS.stressed).toBeDefined();
    expect(MOOD_EMOJIS.frustrated).toBeDefined();
    expect(MOOD_EMOJIS.sad).toBeDefined();
    expect(MOOD_EMOJIS.zen).toBeDefined();
    expect(MOOD_EMOJIS.chaotic).toBeDefined();
    expect(MOOD_EMOJIS.mysterious).toBeDefined();
  });

  test('should cap score between 0 and 100', () => {
    const veryNegativeMetrics = {
      totalLines: 50,
      codeLines: 50,
      commentLines: 0,
      positiveWords: 0,
      negativeWords: 100,
      stressWords: 50,
      todoCount: 20,
      fixmeCount: 20,
      hackCount: 20,
      nestingDepth: 10,
      longestLine: 300,
      exclamationMarks: 100,
      questionMarks: 100,
      hasTests: false
    };
    
    const result = determineMood(veryNegativeMetrics);
    
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });
});

describe('generateSuggestions', () => {
  test('should suggest adding comments when comment ratio is low', () => {
    const metrics = {
      codeLines: 100,
      commentLines: 2,
      nestingDepth: 2,
      hackCount: 0,
      todoCount: 0,
      longestLine: 80,
      functionCount: 5,
      hasTests: true
    };
    
    const moodResult = { mood: 'neutral' };
    const suggestions = generateSuggestions(metrics, moodResult);
    
    expect(suggestions.some(s => s.toLowerCase().includes('comment'))).toBe(true);
  });

  test('should suggest refactoring for deep nesting', () => {
    const metrics = {
      codeLines: 100,
      commentLines: 20,
      nestingDepth: 6,
      hackCount: 0,
      todoCount: 0,
      longestLine: 80,
      functionCount: 5,
      hasTests: true
    };
    
    const moodResult = { mood: 'stressed' };
    const suggestions = generateSuggestions(metrics, moodResult);
    
    expect(suggestions.some(s => s.toLowerCase().includes('nesting'))).toBe(true);
  });

  test('should suggest fixing hacks', () => {
    const metrics = {
      codeLines: 100,
      commentLines: 20,
      nestingDepth: 2,
      hackCount: 3,
      todoCount: 0,
      longestLine: 80,
      functionCount: 5,
      hasTests: true
    };
    
    const moodResult = { mood: 'neutral' };
    const suggestions = generateSuggestions(metrics, moodResult);
    
    expect(suggestions.some(s => s.toLowerCase().includes('hack'))).toBe(true);
  });

  test('should suggest tackling TODOs', () => {
    const metrics = {
      codeLines: 100,
      commentLines: 20,
      nestingDepth: 2,
      hackCount: 0,
      todoCount: 5,
      longestLine: 80,
      functionCount: 5,
      hasTests: true
    };
    
    const moodResult = { mood: 'neutral' };
    const suggestions = generateSuggestions(metrics, moodResult);
    
    expect(suggestions.some(s => s.toLowerCase().includes('todo'))).toBe(true);
  });

  test('should suggest adding tests when none exist', () => {
    const metrics = {
      codeLines: 100,
      commentLines: 20,
      nestingDepth: 2,
      hackCount: 0,
      todoCount: 0,
      longestLine: 80,
      functionCount: 5,
      hasTests: false
    };
    
    const moodResult = { mood: 'neutral' };
    const suggestions = generateSuggestions(metrics, moodResult);
    
    expect(suggestions.some(s => s.toLowerCase().includes('test'))).toBe(true);
  });

  test('should praise zen code', () => {
    const metrics = {
      codeLines: 100,
      commentLines: 20,
      nestingDepth: 2,
      hackCount: 0,
      todoCount: 0,
      longestLine: 80,
      functionCount: 5,
      hasTests: true
    };
    
    const moodResult = { mood: 'zen' };
    const suggestions = generateSuggestions(metrics, moodResult);
    
    expect(suggestions.some(s => s.toLowerCase().includes('good work'))).toBe(true);
  });
});
