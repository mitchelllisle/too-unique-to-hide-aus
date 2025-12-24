/**
 * Unit tests for fingerprint chart component
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { createFingerprintChart } from './fingerprintChart';
import type { FingerprintData } from './types';

describe('createFingerprintChart', () => {
  let mockData: FingerprintData;

  beforeEach(() => {
    mockData = {
      yourCount: 1000,
      attributes: [
        {
          name: 'Age: 25-34',
          value: '25-34',
          count: 50000,
        },
        {
          name: 'Gender: Female',
          value: 'Female',
          count: 30000,
        },
        {
          name: 'Postcode: 2000',
          value: '2000',
          count: 5000,
        },
        {
          name: 'Occupation: Manager',
          value: 'Manager',
          count: 20000,
        },
      ],
    };
  });

  it('should create an SVG element', () => {
    const chart = createFingerprintChart(mockData, 600);
    
    expect(chart).toBeInstanceOf(SVGSVGElement);
    expect(chart.tagName).toBe('svg');
  });

  it('should set correct width and height', () => {
    const width = 800;
    const chart = createFingerprintChart(mockData, width);
    
    expect(chart.getAttribute('width')).toBe(String(width));
    expect(chart.getAttribute('height')).toBe('500');
    // D3 uses commas in viewBox
    expect(chart.getAttribute('viewBox')).toContain(String(width));
  });

  it('should create nodes for center and all attributes', () => {
    const chart = createFingerprintChart(mockData, 600);
    const circles = chart.querySelectorAll('circle');
    
    // Should have 1 center node + 4 attribute nodes + legend circles
    expect(circles.length).toBeGreaterThanOrEqual(5);
  });

  it('should create lines connecting center to attributes', () => {
    const chart = createFingerprintChart(mockData, 600);
    const lines = chart.querySelectorAll('line');
    
    // Should have 4 lines (one for each attribute)
    expect(lines.length).toBe(4);
  });

  it('should create text labels for all nodes', () => {
    const chart = createFingerprintChart(mockData, 600);
    const texts = chart.querySelectorAll('text');
    
    // Should have labels for center + attributes + legend items
    expect(texts.length).toBeGreaterThanOrEqual(5);
  });

  it('should position center node in the middle', () => {
    const width = 600;
    const chart = createFingerprintChart(mockData, width);
    const circles = chart.querySelectorAll('circle');
    
    // First circle should be the center "You" node
    const centerCircle = circles[0];
    const cx = parseFloat(centerCircle.getAttribute('cx') || '0');
    const cy = parseFloat(centerCircle.getAttribute('cy') || '0');
    
    expect(cx).toBe(width / 2);
    expect(cy).toBe(250); // height / 2
  });

  it('should style center node differently', () => {
    const chart = createFingerprintChart(mockData, 600);
    const circles = chart.querySelectorAll('circle');
    
    const centerCircle = circles[0];
    expect(centerCircle.getAttribute('r')).toBe('35'); // Larger radius
    expect(centerCircle.getAttribute('fill')).toBe('#1e40af'); // Dark blue
  });

  it('should color code lines by rarity', () => {
    const chart = createFingerprintChart(mockData, 600);
    const lines = chart.querySelectorAll('line');
    
    // Each line should have a stroke color
    lines.forEach(line => {
      const stroke = line.getAttribute('stroke');
      expect(stroke).toBeTruthy();
      expect(stroke).toMatch(/^#[0-9a-f]{6}$/i);
    });
  });

  it('should create a legend', () => {
    const chart = createFingerprintChart(mockData, 600);
    const legendGroup = chart.querySelector('g[transform*="20, 20"]');
    
    expect(legendGroup).toBeTruthy();
  });

  it('should handle different widths responsively', () => {
    const widths = [400, 600, 800, 1000];
    
    widths.forEach(width => {
      const chart = createFingerprintChart(mockData, width);
      expect(chart.getAttribute('width')).toBe(String(width));
      
      const centerCircle = chart.querySelector('circle');
      const cx = parseFloat(centerCircle?.getAttribute('cx') || '0');
      expect(cx).toBe(width / 2);
    });
  });

  it('should position attribute nodes radially around center', () => {
    const chart = createFingerprintChart(mockData, 600);
    const circles = chart.querySelectorAll('circle');
    
    // Skip first circle (center node)
    const attributeNodes = Array.from(circles).slice(1, 5); // Just check first 4 attribute nodes
    
    attributeNodes.forEach((circle) => {
      const cx = parseFloat(circle.getAttribute('cx') || '0');
      const cy = parseFloat(circle.getAttribute('cy') || '0');
      
      // Should be within the chart bounds
      expect(cx).toBeGreaterThanOrEqual(0);
      expect(cx).toBeLessThanOrEqual(600);
      expect(cy).toBeGreaterThanOrEqual(0);
      expect(cy).toBeLessThanOrEqual(500);
    });
  });

  it('should include count information in attribute nodes', () => {
    const chart = createFingerprintChart(mockData, 600);
    const texts = chart.querySelectorAll('text');
    
    const textContent = Array.from(texts)
      .map(t => t.textContent)
      .join(' ');
    
    // Should include formatted counts
    expect(textContent).toContain('50,000');
    expect(textContent).toContain('30,000');
  });
});
