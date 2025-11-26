/**
 * Tests for the CLI module
 */

const path = require('path');
const { analyzeFile, calculateAggregateMood } = require('../src/cli');

describe('analyzeFile', () => {
  const samplesDir = path.join(__dirname, '..', 'samples');

  test('should analyze happy code file', () => {
    const result = analyzeFile(path.join(samplesDir, 'happy-code.js'));
    
    expect(result).not.toBeNull();
    expect(result.metrics).toBeDefined();
    expect(result.moodResult).toBeDefined();
    expect(result.suggestions).toBeDefined();
    expect(result.moodResult.score).toBeGreaterThan(40);
  });

  test('should analyze stressed code file', () => {
    const result = analyzeFile(path.join(samplesDir, 'stressed-code.js'));
    
    expect(result).not.toBeNull();
    expect(result.metrics.hackCount).toBeGreaterThan(0);
    expect(result.metrics.todoCount).toBeGreaterThan(0);
    expect(result.moodResult.score).toBeLessThan(60);
  });

  test('should analyze zen code file', () => {
    const result = analyzeFile(path.join(samplesDir, 'zen-code.js'));
    
    expect(result).not.toBeNull();
    expect(result.metrics.commentLines).toBeGreaterThan(0);
    expect(result.moodResult.score).toBeGreaterThan(50);
  });

  test('should analyze mysterious code file', () => {
    const result = analyzeFile(path.join(samplesDir, 'mysterious-code.js'));
    
    expect(result).not.toBeNull();
    expect(result.metrics.commentLines).toBe(0);
  });

  test('should return null for non-existent file', () => {
    const result = analyzeFile('/non/existent/file.js');
    
    expect(result).toBeNull();
  });
});

describe('calculateAggregateMood', () => {
  test('should calculate aggregate for multiple results', () => {
    const results = [
      {
        metrics: {
          totalLines: 100,
          codeLines: 80,
          commentLines: 10,
          positiveWords: 5,
          negativeWords: 1,
          stressWords: 0,
          todoCount: 1,
          fixmeCount: 0,
          hackCount: 0,
          functionCount: 5
        },
        moodResult: { mood: 'happy', score: 70 }
      },
      {
        metrics: {
          totalLines: 50,
          codeLines: 40,
          commentLines: 5,
          positiveWords: 2,
          negativeWords: 3,
          stressWords: 2,
          todoCount: 3,
          fixmeCount: 2,
          hackCount: 1,
          functionCount: 3
        },
        moodResult: { mood: 'stressed', score: 35 }
      }
    ];

    const aggregate = calculateAggregateMood(results);

    expect(aggregate.fileCount).toBe(2);
    expect(aggregate.avgScore).toBe(53);
    expect(aggregate.totals.totalLines).toBe(150);
    expect(aggregate.totals.functionCount).toBe(8);
    expect(aggregate.moodCounts.happy).toBe(1);
    expect(aggregate.moodCounts.stressed).toBe(1);
  });

  test('should find dominant mood', () => {
    const results = [
      { metrics: { totalLines: 10, codeLines: 10, commentLines: 0, positiveWords: 0, negativeWords: 0, stressWords: 0, todoCount: 0, fixmeCount: 0, hackCount: 0, functionCount: 1 }, moodResult: { mood: 'happy', score: 60 } },
      { metrics: { totalLines: 10, codeLines: 10, commentLines: 0, positiveWords: 0, negativeWords: 0, stressWords: 0, todoCount: 0, fixmeCount: 0, hackCount: 0, functionCount: 1 }, moodResult: { mood: 'happy', score: 65 } },
      { metrics: { totalLines: 10, codeLines: 10, commentLines: 0, positiveWords: 0, negativeWords: 0, stressWords: 0, todoCount: 0, fixmeCount: 0, hackCount: 0, functionCount: 1 }, moodResult: { mood: 'sad', score: 30 } }
    ];

    const aggregate = calculateAggregateMood(results);

    expect(aggregate.dominantMood).toBe('happy');
  });
});
