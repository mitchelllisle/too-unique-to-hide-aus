/**
 * Demographic fingerprint visualization component
 * 
 * Creates a radial network chart showing how many people share each
 * individual demographic attribute (postcode, age, gender, occupation)
 */

import * as d3 from "d3";
import type { FingerprintData } from './types.js';

/**
 * Color thresholds for rarity visualization
 */
const RARITY_COLORS = {
  veryRare: { threshold: 1000, color: "#dc2626" },    // Red: < 1000 people
  rare: { threshold: 5000, color: "#ea580c" },        // Orange: 1000-5000
  uncommon: { threshold: 20000, color: "#ca8a04" },   // Yellow: 5000-20000
  common: { color: "#16a34a" }                        // Green: 20000+
};

/**
 * Get color based on attribute count (rarity)
 * 
 * @param count - Number of people with this attribute
 * @returns Hex color code
 */
function getColorByRarity(count: number): string {
  if (count < RARITY_COLORS.veryRare.threshold) return RARITY_COLORS.veryRare.color;
  if (count < RARITY_COLORS.rare.threshold) return RARITY_COLORS.rare.color;
  if (count < RARITY_COLORS.uncommon.threshold) return RARITY_COLORS.uncommon.color;
  return RARITY_COLORS.common.color;
}

/**
 * Create demographic fingerprint visualization
 * 
 * @param data - Fingerprint data with attributes and counts
 * @param width - SVG width in pixels
 * @returns SVG node
 */
export function createFingerprintChart(data: FingerprintData, width: number): SVGSVGElement {
  const height = 500;
  const radius = 180;
  const centerX = width / 2;
  const centerY = height / 2;
  
  const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto;");
  
  const attributes = data.attributes;
  
  // Draw connecting lines (spokes) - behind other elements
  attributes.forEach((attr, i) => {
    const angle = (i * 2 * Math.PI) / attributes.length - Math.PI / 2;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    const color = getColorByRarity(attr.count);
    
    svg.append("line")
      .attr("x1", centerX)
      .attr("y1", centerY)
      .attr("x2", x)
      .attr("y2", y)
      .attr("stroke", color)
      .attr("stroke-width", 3)
      .attr("opacity", 0.6)
      .attr("stroke-linecap", "round");
  });
  
  // Draw center "You" circle
  svg.append("circle")
    .attr("cx", centerX)
    .attr("cy", centerY)
    .attr("r", 35)
    .attr("fill", "#1e40af")
    .attr("opacity", 0.9)
    .attr("stroke", "#1e40af")
    .attr("stroke-width", 2);
  
  svg.append("text")
    .attr("x", centerX)
    .attr("y", centerY)
    .attr("text-anchor", "middle")
    .attr("dy", "0.35em")
    .attr("font-size", "16px")
    .attr("font-weight", "bold")
    .attr("fill", "#ffffff")
    .text("YOU");
  
  // Draw attribute nodes and labels
  attributes.forEach((attr, i) => {
    const angle = (i * 2 * Math.PI) / attributes.length - Math.PI / 2;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    const color = getColorByRarity(attr.count);
    
    // Attribute circle
    svg.append("circle")
      .attr("cx", x)
      .attr("cy", y)
      .attr("r", 14)
      .attr("fill", color)
      .attr("stroke", "white")
      .attr("stroke-width", 2);
    
    // Position text based on which side of circle
    const isRight = x > centerX;
    const textX = x + (isRight ? 20 : -20);
    const textAnchor = isRight ? "start" : "end";
    
    // Attribute name
    svg.append("text")
      .attr("x", textX)
      .attr("y", y - 8)
      .attr("text-anchor", textAnchor)
      .attr("font-size", "13px")
      .attr("font-weight", "600")
      .attr("fill", "var(--theme-foreground)")
      .text(attr.name);
    
    // Attribute value
    svg.append("text")
      .attr("x", textX)
      .attr("y", y + 6)
      .attr("text-anchor", textAnchor)
      .attr("font-size", "11px")
      .attr("font-weight", "500")
      .attr("fill", "var(--theme-foreground-muted)")
      .text(attr.value);
    
    // Count with colored text
    svg.append("text")
      .attr("x", textX)
      .attr("y", y + 20)
      .attr("text-anchor", textAnchor)
      .attr("font-size", "10px")
      .attr("font-weight", "600")
      .attr("fill", color)
      .text(`${attr.count.toLocaleString()} people`);
  });
  
  // Add legend
  const legendData = [
    { color: RARITY_COLORS.common.color, label: "Low Risk", range: "Common (20,000+)" },
    { color: RARITY_COLORS.uncommon.color, label: "Medium Risk", range: "Uncommon (5,000-20,000)" },
    { color: RARITY_COLORS.rare.color, label: "High Risk", range: "Rare (1,000-5,000)" },
    { color: RARITY_COLORS.veryRare.color, label: "Critical Risk", range: "Very Rare (<1,000)" }
  ];
  
  const legendGroup = svg.append("g")
    .attr("transform", `translate(20, 20)`);
  
  legendGroup.append("text")
    .attr("x", 0)
    .attr("y", 0)
    .attr("font-size", "12px")
    .attr("font-weight", "600")
    .attr("fill", "var(--theme-foreground-muted)")
    .text("Rarity & Risk:");
  
  legendData.forEach((item, i) => {
    const y = i * 18 + 15;
    
    legendGroup.append("circle")
      .attr("cx", 5)
      .attr("cy", y)
      .attr("r", 5)
      .attr("fill", item.color);
    
    legendGroup.append("text")
      .attr("x", 15)
      .attr("y", y)
      .attr("dy", "0.35em")
      .attr("font-size", "10px")
      .attr("fill", "var(--theme-foreground-muted)")
      .text(item.label);
  });
  
  return svg.node()!;
}
