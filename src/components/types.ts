/**
 * Type definitions for the Privacy Risk Calculator
 */

/**
 * Census data record structure
 */
export interface CensusRecord {
  /** Postal Area (postcode) */
  poa: string;
  /** Age bracket (e.g., "25-29 years") */
  age: string;
  /** Sex/Gender (Male or Female) */
  sex: string;
  /** Occupation category */
  occ: string;
  /** Number of people matching these demographics */
  count: number;
}

/**
 * Risk level categories based on anonymity set size
 */
export type RiskLevel = 'none' | 'very-high' | 'high' | 'moderate' | 'low';

/**
 * Risk analysis result
 */
export interface RiskResult {
  /** Number of people matching the demographic profile */
  count: number;
  /** Risk level classification */
  riskLevel: RiskLevel;
}

/**
 * Risk explanation data for display
 */
export interface RiskExplanation {
  /** Display title for the risk level */
  title: string;
  /** Color code for visual representation */
  color: string;
  /** Emoji icon for the risk level */
  emoji: string;
  /** Detailed explanation text (string or HTML node) */
  explanation: any;
}

/**
 * Demographic attribute for fingerprint visualization
 */
export interface DemographicAttribute {
  /** Attribute name (e.g., "Postcode", "Age Group") */
  name: string;
  /** Current value for this attribute */
  value: string;
  /** Number of people sharing this individual attribute */
  count: number;
}

/**
 * Fingerprint visualization data
 */
export interface FingerprintData {
  /** Array of demographic attributes */
  attributes: DemographicAttribute[];
  /** Total count of people matching all attributes combined */
  yourCount: number;
}

/**
 * Age distribution data for chart
 */
export interface AgeDistribution {
  /** Age group label */
  ageGroup: string;
  /** Population count for this age group */
  population: number;
  /** Whether this is the user's selected age group */
  isSelected: boolean;
}
