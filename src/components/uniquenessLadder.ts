/**
 * Uniqueness ladder visualization component
 * 
 * Displays a horizontal ladder showing risk progression from common to unique
 */

import {html} from "htl";
import type { FingerprintData } from './types.js';

/**
 * Risk stage definition
 */
interface RiskStage {
  threshold: number;
  label: string;
  color: string;
  icon: string;
}

/**
 * Risk stages for the uniqueness ladder
 */
const RISK_STAGES: RiskStage[] = [
  { 
    threshold: 100, 
    label: 'Common', 
    color: '#10b981', 
    icon: '●'
  },
  { 
    threshold: 10, 
    label: 'Uncommon', 
    color: '#f59e0b', 
    icon: '●'
  },
  { 
    threshold: 1, 
    label: 'Rare', 
    color: '#ef4444', 
    icon: '●'
  },
  { 
    threshold: 0, 
    label: 'Unique', 
    color: '#dc2626', 
    icon: '●'
  }
];

/**
 * Create uniqueness ladder visualization
 * 
 * @param data - Fingerprint data with yourCount
 * @returns HTML node with inline risk stage indicators
 */
export function createUniquenessLadder(data: FingerprintData | null): any {
  if (!data) return null;
  
  const matchingPeople = data.yourCount;
  const currentStage = RISK_STAGES.find(s => matchingPeople >= s.threshold) || RISK_STAGES[RISK_STAGES.length - 1];
  
  return html`<div style="display: flex; gap: 1rem; align-items: center; margin-top: 0.75rem;">
    ${RISK_STAGES.map(stage => {
      const isActive = currentStage.label === stage.label;
      return html`<div style="display: flex; align-items: center; gap: 0.35rem; opacity: ${isActive ? '1' : '0.3'};">
        <span style="font-size: 12px; color: ${isActive ? stage.color : '#999'};">${stage.icon}</span>
        <span style="font-size: 12px; color: ${isActive ? 'var(--theme-foreground)' : '#999'}; font-weight: ${isActive ? '600' : '400'};">${stage.label}</span>
      </div>`;
    })}
  </div>`;
}
