/**
 * Tests for the file utilities
 */

const { isSupportedFile, SUPPORTED_EXTENSIONS } = require('../lib/fileUtils');

describe('isSupportedFile', () => {
  test('should return true for JavaScript files', () => {
    expect(isSupportedFile('test.js')).toBe(true);
    expect(isSupportedFile('test.jsx')).toBe(true);
  });

  test('should return true for TypeScript files', () => {
    expect(isSupportedFile('test.ts')).toBe(true);
    expect(isSupportedFile('test.tsx')).toBe(true);
  });

  test('should return true for Python files', () => {
    expect(isSupportedFile('test.py')).toBe(true);
  });

  test('should return true for Java files', () => {
    expect(isSupportedFile('Test.java')).toBe(true);
  });

  test('should return true for C/C++ files', () => {
    expect(isSupportedFile('test.c')).toBe(true);
    expect(isSupportedFile('test.cpp')).toBe(true);
  });

  test('should return true for other supported languages', () => {
    expect(isSupportedFile('test.go')).toBe(true);
    expect(isSupportedFile('test.rb')).toBe(true);
    expect(isSupportedFile('test.rs')).toBe(true);
    expect(isSupportedFile('test.php')).toBe(true);
    expect(isSupportedFile('test.swift')).toBe(true);
    expect(isSupportedFile('test.cs')).toBe(true);
  });

  test('should return false for unsupported files', () => {
    expect(isSupportedFile('test.txt')).toBe(false);
    expect(isSupportedFile('test.md')).toBe(false);
    expect(isSupportedFile('test.json')).toBe(false);
    expect(isSupportedFile('test.yaml')).toBe(false);
    expect(isSupportedFile('README')).toBe(false);
  });

  test('should be case insensitive', () => {
    expect(isSupportedFile('test.JS')).toBe(true);
    expect(isSupportedFile('test.PY')).toBe(true);
  });
});

describe('SUPPORTED_EXTENSIONS', () => {
  test('should include common programming languages', () => {
    expect(SUPPORTED_EXTENSIONS).toContain('.js');
    expect(SUPPORTED_EXTENSIONS).toContain('.ts');
    expect(SUPPORTED_EXTENSIONS).toContain('.py');
    expect(SUPPORTED_EXTENSIONS).toContain('.java');
    expect(SUPPORTED_EXTENSIONS).toContain('.go');
  });

  test('should be an array', () => {
    expect(Array.isArray(SUPPORTED_EXTENSIONS)).toBe(true);
  });

  test('should have at least 10 supported extensions', () => {
    expect(SUPPORTED_EXTENSIONS.length).toBeGreaterThanOrEqual(10);
  });
});
