/**
 * Unit tests for risk calculation utilities
 */

import { describe, it, expect } from 'vitest';
import { calculateRiskLevel, getRiskExplanation } from './riskCalculations';
import type { RiskResult } from './types';

describe('calculateRiskLevel', () => {
  it('should return "none" for 0 matches', () => {
    expect(calculateRiskLevel(0)).toBe('none');
  });

  it('should return "very-high" for 1-9 matches', () => {
    expect(calculateRiskLevel(1)).toBe('very-high');
    expect(calculateRiskLevel(5)).toBe('very-high');
    expect(calculateRiskLevel(9)).toBe('very-high');
  });

  it('should return "high" for 10-99 matches', () => {
    expect(calculateRiskLevel(10)).toBe('high');
    expect(calculateRiskLevel(50)).toBe('high');
    expect(calculateRiskLevel(99)).toBe('high');
  });

  it('should return "moderate" for 100-999 matches', () => {
    expect(calculateRiskLevel(100)).toBe('moderate');
    expect(calculateRiskLevel(500)).toBe('moderate');
    expect(calculateRiskLevel(999)).toBe('moderate');
  });

  it('should return "low" for 1000+ matches', () => {
    expect(calculateRiskLevel(1000)).toBe('low');
    expect(calculateRiskLevel(5000)).toBe('low');
    expect(calculateRiskLevel(100000)).toBe('low');
  });

  it('should handle boundary values correctly', () => {
    expect(calculateRiskLevel(0)).toBe('none');
    expect(calculateRiskLevel(1)).toBe('very-high');
    expect(calculateRiskLevel(9)).toBe('very-high');
    expect(calculateRiskLevel(10)).toBe('high');
    expect(calculateRiskLevel(99)).toBe('high');
    expect(calculateRiskLevel(100)).toBe('moderate');
    expect(calculateRiskLevel(999)).toBe('moderate');
    expect(calculateRiskLevel(1000)).toBe('low');
  });
});

describe('getRiskExplanation', () => {
  it('should return explanation for "none" risk level', () => {
    const result: RiskResult = {
      riskLevel: 'none',
      count: 0,
    };
    const explanation = getRiskExplanation(result);
    
    expect(explanation.title).toBe('No Match Found');
    expect(explanation.color).toBe('#64748b');
    expect(explanation.emoji).toBe('❓');
    expect(explanation.explanation).toBeDefined();
  });

  it('should return explanation for "very-high" risk level', () => {
    const result: RiskResult = {
      riskLevel: 'very-high',
      count: 5,
    };
    const explanation = getRiskExplanation(result);
    
    expect(explanation.title).toBe('Very High Risk');
    expect(explanation.color).toBe('#dc2626');
    expect(explanation.emoji).toBe('🚨');
    expect(explanation.explanation).toBeDefined();
  });

  it('should return explanation for "high" risk level', () => {
    const result: RiskResult = {
      riskLevel: 'high',
      count: 50,
    };
    const explanation = getRiskExplanation(result);
    
    expect(explanation.title).toBe('High Risk');
    expect(explanation.color).toBe('#ea580c');
    expect(explanation.emoji).toBe('⚠️');
    expect(explanation.explanation).toBeDefined();
  });

  it('should return explanation for "moderate" risk level', () => {
    const result: RiskResult = {
      riskLevel: 'moderate',
      count: 500,
    };
    const explanation = getRiskExplanation(result);
    
    expect(explanation.title).toBe('Moderate Risk');
    expect(explanation.color).toBe('#ca8a04');
    expect(explanation.emoji).toBe('⚡');
    expect(explanation.explanation).toBeDefined();
  });

  it('should return explanation for "low" risk level', () => {
    const result: RiskResult = {
      riskLevel: 'low',
      count: 5000,
    };
    const explanation = getRiskExplanation(result);
    
    expect(explanation.title).toBe('Lower Risk');
    expect(explanation.color).toBe('#16a34a');
    expect(explanation.emoji).toBe('✓');
    expect(explanation.explanation).toBeDefined();
  });

  it('should include count in explanation text for high risk', () => {
    const result: RiskResult = {
      riskLevel: 'high',
      count: 42,
    };
    const explanation = getRiskExplanation(result);
    
    // Check that the explanation contains the count
    const explanationText = explanation.explanation.outerHTML || explanation.explanation.textContent;
    expect(explanationText).toContain('42');
  });

  it('should include formatted count in explanation for moderate risk', () => {
    const result: RiskResult = {
      riskLevel: 'moderate',
      count: 1234,
    };
    const explanation = getRiskExplanation(result);
    
    // Check that the explanation contains the formatted count
    const explanationText = explanation.explanation.outerHTML || explanation.explanation.textContent;
    expect(explanationText).toContain('1,234');
  });

  it('should include formatted count in explanation for low risk', () => {
    const result: RiskResult = {
      riskLevel: 'low',
      count: 50000,
    };
    const explanation = getRiskExplanation(result);
    
    // Check that the explanation contains the formatted count
    const explanationText = explanation.explanation.outerHTML || explanation.explanation.textContent;
    expect(explanationText).toContain('50,000');
  });
});

describe('Integration: calculateRiskLevel with getRiskExplanation', () => {
  it('should provide consistent results across both functions', () => {
    const testCases = [
      { count: 0, expectedLevel: 'none' },
      { count: 5, expectedLevel: 'very-high' },
      { count: 50, expectedLevel: 'high' },
      { count: 500, expectedLevel: 'moderate' },
      { count: 5000, expectedLevel: 'low' },
    ];

    testCases.forEach(({ count, expectedLevel }) => {
      const riskLevel = calculateRiskLevel(count);
      expect(riskLevel).toBe(expectedLevel);

      const result: RiskResult = { riskLevel, count };
      const explanation = getRiskExplanation(result);
      
      expect(explanation).toBeDefined();
      expect(explanation.title).toBeDefined();
      expect(explanation.color).toBeDefined();
      expect(explanation.emoji).toBeDefined();
      expect(explanation.explanation).toBeDefined();
    });
  });
});
