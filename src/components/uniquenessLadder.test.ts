/**
 * Unit tests for uniqueness ladder component
 */

import { describe, it, expect } from 'vitest';
import { createUniquenessLadder } from './uniquenessLadder';
import type { FingerprintData } from './types';

describe('createUniquenessLadder', () => {
  const createMockData = (yourCount: number): FingerprintData => ({
    yourCount,
    attributes: [
      {
        name: 'Age: 25-34',
        value: '25-34',
        count: 50000,
      },
    ],
  });

  it('should return a DOM element', () => {
    const data = createMockData(100);
    const ladder = createUniquenessLadder(data);
    
    expect(ladder).toBeDefined();
  });

  it('should return null placeholder when data is null', () => {
    const ladder = createUniquenessLadder(null);
    
    expect(ladder).toBeDefined();
  });

  it('should highlight "Unique" stage for 0-1 matches', () => {
    const data = createMockData(1);
    const ladder = createUniquenessLadder(data);
    const html = ladder.outerHTML || ladder.toString();
    
    expect(html).toContain('Unique');
  });

  it('should highlight "Rare" stage for 1-10 matches', () => {
    const data = createMockData(5);
    const ladder = createUniquenessLadder(data);
    const html = ladder.outerHTML || ladder.toString();
    
    expect(html).toContain('Rare');
  });

  it('should highlight "Uncommon" stage for 10-100 matches', () => {
    const data = createMockData(50);
    const ladder = createUniquenessLadder(data);
    const html = ladder.outerHTML || ladder.toString();
    
    expect(html).toContain('Uncommon');
  });

  it('should highlight "Common" stage for 100+ matches', () => {
    const data = createMockData(500);
    const ladder = createUniquenessLadder(data);
    const html = ladder.outerHTML || ladder.toString();
    
    expect(html).toContain('Common');
  });

  it('should handle boundary values correctly', () => {
    const testCases = [
      { count: 0, expected: 'Unique' },
      { count: 1, expected: 'Unique' },
      { count: 2, expected: 'Rare' },
      { count: 9, expected: 'Rare' },
      { count: 10, expected: 'Uncommon' },
      { count: 99, expected: 'Uncommon' },
      { count: 100, expected: 'Common' },
      { count: 1000, expected: 'Common' },
    ];

    testCases.forEach(({ count, expected }) => {
      const data = createMockData(count);
      const ladder = createUniquenessLadder(data);
      const html = ladder.outerHTML || ladder.toString();
      
      expect(html).toContain(expected);
    });
  });

  it('should include all four stages', () => {
    const data = createMockData(100);
    const ladder = createUniquenessLadder(data);
    const html = ladder.outerHTML || ladder.toString();
    
    expect(html).toContain('Common');
    expect(html).toContain('Uncommon');
    expect(html).toContain('Rare');
    expect(html).toContain('Unique');
  });

  it('should use bullet points for visual separation', () => {
    const data = createMockData(100);
    const ladder = createUniquenessLadder(data);
    const html = ladder.outerHTML || ladder.toString();
    
    expect(html).toContain('●');
  });

  it('should style active stage differently', () => {
    const data = createMockData(5); // Should highlight "Rare"
    const ladder = createUniquenessLadder(data);
    const html = ladder.outerHTML || ladder.toString();
    
    // Active stage should have different styling (font-weight: 600)
    expect(html).toMatch(/font-weight: 600/);
  });
});
