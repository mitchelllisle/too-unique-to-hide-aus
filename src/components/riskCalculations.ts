/**
 * Risk calculation utilities for privacy re-identification analysis
 */

import type { RiskLevel, RiskResult, RiskExplanation } from './types.js';
import {html} from "htl";

/**
 * Calculate risk level based on anonymity set size
 * 
 * Smaller groups indicate higher re-identification risk:
 * - 0: Possible Unique (high risk)
 * - 1-9: Very high risk (easily identifiable)
 * - 10-99: High risk
 * - 100-999: Moderate risk
 * - 1000+: Lower risk
 * 
 * @param matchingCount - Number of people sharing the demographic profile
 * @returns Risk level classification
 */
export function calculateRiskLevel(matchingCount: number): RiskLevel {
  if (matchingCount === 0) return 'none';
  if (matchingCount < 10) return 'very-high';
  if (matchingCount < 100) return 'high';
  if (matchingCount < 1000) return 'moderate';
  return 'low';
}

/**
 * Get detailed risk explanation for display
 * 
 * @param result - Risk analysis result
 * @returns Risk explanation with title, color, emoji, and detailed text
 */
export function getRiskExplanation(result: RiskResult): RiskExplanation {
  const { riskLevel, count } = result;
  
  const explanations: Record<RiskLevel, RiskExplanation> = {
    'none': {
      title: 'Unique',
      color: '#dc2626',
      emoji: '🙈',
      explanation: html`<a href="https://www.abs.gov.au/about/data-services/data-confidentiality-guide/confidentiality-and-census" target="_blank" rel="noopener noreferrer" style="color: var(--theme-color);">High risk:</a> This combination either doesn't exist, or is unique. The ABS suppresses unique records to protect privacy.`
    },
    'very-high': {
      title: 'Very High Risk',
      color: '#dc2626',
      emoji: '🚨',
      explanation: html`You may be <b>extremely identifiable</b>. With fewer than 10 people sharing your profile, you could be singled out in supposedly anonymous datasets. Research from <a href="#" target="_blank">data privacy studies</a> supports this conclusion.`
    },
    'high': {
      title: 'High Risk',
      color: '#ea580c',
      emoji: '⚠️',
      explanation: html`You may be <b>highly identifiable</b>. With ${count.toLocaleString()} people sharing your profile, sophisticated data matching could still identify you. Organizations with access to additional datasets may link your records.`
    },
    'moderate': {
      title: 'Moderate Risk',
      color: '#ca8a04',
      emoji: '⚡',
      explanation: html`You may have <b>moderate privacy</b>. While ${count.toLocaleString()} people share your basic profile, combining this with just one or two additional data points (like suburb, job title, or education) could still pose risks.`
    },
    'low': {
      title: 'Lower Risk',
      color: '#16a34a',
      emoji: '✓',
      explanation: html`You may be in a <b>larger group</b> of ${count.toLocaleString()} people. However, "anonymous" data often includes additional attributes beyond these basics. Each extra field increases re-identification risk.`
    }
  };
  
  return explanations[riskLevel];
}