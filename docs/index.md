---
title: Privacy Risk Calculator
toc: false
theme: [dashboard]
sidebar: false
---

```js
import {australianData} from "./data/postcodes.js";
import * as Plot from "npm:@observablehq/plot";
```

# How Unique Are You?

<div style="color: var(--theme-foreground-muted); max-width: 700px; margin-bottom: 1rem;">
Discover how easily you could be identified from supposedly "anonymous" data. Even after removing names and addresses, organisations can still re-identify individuals using just a few basic demographic characteristics.
</div>

<div class="note" style="max-width: 800px; margin-bottom: 2rem; font-size: 0.875rem;">
  <b>Understanding Your Risk:</b> This shows your probability of being correctly re-identified if matched in any "anonymous" dataset containing these attributes.<br>
  <span style="color: #dc2626;">●</span> <b>Very High (≥10%)</b><br>
  <span style="color: #ea580c;">●</span> <b>High (1-9.9%)</b><br>
  <span style="color: #ca8a04;">●</span> <b>Moderate (0.1-0.99%)</b><br>
  <span style="color: #16a34a;">●</span> <b>Lower (<0.1%)</b>
</div>

```js
const postcodeInput = view(Inputs.text({
  label: "Postcode",
  placeholder: "e.g., 2000",
  pattern: "[0-9]{4}",
  required: true,
  value: "2000",
  style: "height: 48px; padding: 12px 16px; font-size: 16px; width: 100%; max-width: 400px;"
}));
```

```js
const ageGroup = view(Inputs.select([
  "0-4", "5-9", "10-14", "15-19", 
  "20-24", "25-29", "30-34", "35-39",
  "40-44", "45-49", "50-54", "55-59",
  "60-64", "65-69", "70-74", "75-79",
  "80-84", "85+"
], {
  label: "Age Group",
  value: "25-29",
  style: "height: 48px; padding: 12px 16px; font-size: 16px; width: 100%; max-width: 400px;"
}));
```

```js
const gender = view(Inputs.radio(["male", "female"], {
  label: "Gender",
  value: "female"
}));
```

```js
const occupation = view(Inputs.select(["Any", ...australianData.occupations], {
  label: "Occupation (optional)",
  value: "Any",
  style: "height: 48px; padding: 12px 16px; font-size: 16px; width: 100%; max-width: 400px;"
}));
```

```js
// Validate postcode
const isValidPostcode = /^[0-9]{4}$/.test(postcodeInput);
const postcodeData = isValidPostcode ? australianData.postcodes[postcodeInput] : null;
```

```js
// Calculate risk
function calculateRisk(postcodeData, ageGroup, gender, occupation) {
  if (!postcodeData) return null;
  
  const ageGroupIndex = australianData.ageGroups.indexOf(ageGroup);
  const agePopulation = postcodeData.ageDistribution[ageGroupIndex];
  const genderRatio = gender === 'male' ? postcodeData.genderRatio : (1 - postcodeData.genderRatio);
  const occupationRatio = occupation === "Any" ? 1 : australianData.occupationDistribution[occupation];
  
  // Calculate matching count with demographic factors
  const matchingCount = Math.round(agePopulation * genderRatio * occupationRatio);
  
  // Calculate probability of re-identification (1 in matchingCount)
  const probability = matchingCount > 0 ? (1 / matchingCount) * 100 : 100;
  
  let riskLevel;
  if (probability >= 10) riskLevel = 'very-high';
  else if (probability >= 1) riskLevel = 'high';
  else if (probability >= 0.1) riskLevel = 'moderate';
  else riskLevel = 'low';
  
  return {
    count: matchingCount,
    probability,
    riskLevel,
    postcode: postcodeInput,
    ageGroup,
    gender,
    occupation,
    totalPopulation: postcodeData.population
  };
}

const result = calculateRisk(postcodeData, ageGroup, gender, occupation);
```

```js
// Prepare data for visualizations
const ageDistributionData = postcodeData ? australianData.ageGroups.map((group, i) => ({
  ageGroup: group,
  population: postcodeData.ageDistribution[i],
  isSelected: group === ageGroup
})) : [];
```

```js
function getRiskExplanation(result) {
  const { count, probability, postcode, ageGroup, gender, riskLevel } = result;
  
  const riskEmojis = {
    'very-high': '🚨',
    'high': '⚠️',
    'moderate': '💭',
    'low': '✅'
  };
  
  const riskColors = {
    'very-high': '#dc2626',
    'high': '#ea580c',
    'moderate': '#ca8a04',
    'low': '#16a34a'
  };
  
  const probText = probability >= 1 ? probability.toFixed(1) : probability.toFixed(2);
  
  switch(riskLevel) {
    case 'very-high':
      return {
        emoji: riskEmojis[riskLevel],
        color: riskColors[riskLevel],
        title: 'Very High Risk',
        explanation: `With these attributes, you have a ${probText}% chance of being correctly re-identified if matched in any "anonymous" dataset containing age group, gender, postcode, and occupation. Only ${count} ${count === 1 ? 'person shares' : 'people share'} your profile in this area—you're highly vulnerable to re-identification.`
      };
    case 'high':
      return {
        emoji: riskEmojis[riskLevel],
        color: riskColors[riskLevel],
        title: 'High Risk',
        explanation: `With these attributes, you have a ${probText}% chance of being correctly re-identified if matched in any "anonymous" dataset containing age group, gender, postcode, and occupation. Approximately ${count} people share your profile—just one or two additional data points could single you out.`
      };
    case 'moderate':
      return {
        emoji: riskEmojis[riskLevel],
        color: riskColors[riskLevel],
        title: 'Moderate Risk',
        explanation: `With these attributes, you have a ${probText}% chance of being correctly re-identified if matched in any "anonymous" dataset containing age group, gender, postcode, and occupation. About ${count} people share your profile—you have some anonymity, but linking with other datasets increases your risk.`
      };
    case 'low':
      return {
        emoji: riskEmojis[riskLevel],
        color: riskColors[riskLevel],
        title: 'Lower Risk',
        explanation: `With these attributes, you have a ${probText}% chance of being correctly re-identified if matched in any "anonymous" dataset containing age group, gender, postcode, and occupation. Roughly ${count} people share your profile—this larger pool offers better privacy protection, though multiple datasets can still be combined to identify you.`
      };
  }
}
```

<div class="grid grid-cols-1">
  <div class="card" style="box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);">
    <h2 style="font-size: 1.5rem; margin-bottom: 1.5rem;">Your Risk Level</h2>
    ${result && postcodeData ? (() => {
      const riskData = getRiskExplanation(result);
      const agePercent = Math.round((postcodeData.ageDistribution[australianData.ageGroups.indexOf(ageGroup)] / postcodeData.population) * 100);
      const displayProb = result.probability >= 1 ? result.probability.toFixed(1) : result.probability.toFixed(2);
      return html`
        <div style="text-align: center; padding: 1.5rem; background: ${riskData.color}15; border-radius: 8px; margin-bottom: 1rem;">
          <span class="big" style="color: ${riskData.color}; font-size: 3.5rem; font-weight: 700;">
            ${displayProb}% ${riskData.emoji}
          </span>
        </div>
        <span class="muted" style="font-size: 0.9375rem; line-height: 1.6;">
          <b style="color: ${riskData.color}; font-size: 1.125rem;">${riskData.title}</b>
          <br><br>
          ${riskData.explanation}
          <br><br>
          In postcode <b>${postcodeInput}</b> with a total population of <b>${postcodeData.population.toLocaleString()}</b>, 
          your age group (${ageGroup}) represents approximately <b>${agePercent}%</b> of residents.
        </span>
      `;
    })() : !isValidPostcode ? html`<span class="muted">Please enter a valid 4-digit postcode</span>` : html`<span class="muted">Postcode not found. Try 2000, 3000, or 4000</span>`}
  </div>
</div>

<div class="grid grid-cols-1">
  <div class="card">
    <h2>Population Breakdown by Age Group</h2>
    <p class="muted" style="margin-bottom: 1rem; font-size: 0.875rem;">Understanding the age demographics in postcode ${postcodeInput}. Your selected age group is highlighted to show where you fit within the local population distribution.</p>
    ${postcodeData ? resize((width) => Plot.plot({
      width,
      marginLeft: 60,
      marginBottom: 65,
      height: 400,
      style: {
        fontSize: "11px",
        background: "transparent"
      },
      x: { 
        label: "Age Group",
        tickRotate: -45,
        labelAnchor: "center"
      },
      y: { 
        label: "Population",
        grid: true,
        nice: true
      },
      marks: [
        Plot.barY(ageDistributionData, {
          x: "ageGroup",
          y: "population",
          fill: d => d.isSelected ? "var(--theme-foreground-focus)" : "var(--theme-foreground-faint)",
          tip: true
        }),
        Plot.ruleY([0])
      ]
    })) : html`<span class="muted">Enter valid postcode to see distribution</span>`}
  </div>
</div>

---

<div class="note" style="max-width: 800px; margin-bottom: 1.5rem;">
  <b>⚠️ Educational Purposes:</b> The risk calculations presented by this tool are estimates for educational purposes and should not be considered exact measurements. Real-world re-identification risk depends on many factors beyond basic demographics, including the specific datasets being linked, the sophistication of matching algorithms, and additional available information.
</div>

<div class="note" style="max-width: 800px;">
  <b>About This Calculator:</b> This tool uses Australian Bureau of Statistics (ABS) census data to demonstrate re-identification risk in anonymous datasets. By analyzing how many people in your postcode share your age group and gender, it estimates how easily you could be singled out.
  <br><br>
  <b>Privacy:</b> All calculations happen locally in your browser. We never collect, transmit, or store any of your information. You can see the source code for this app here: https://github.com/mitchelllisle/too-unique-to-hide-aus
  <br><br>
  Learn more about data protection in Australia at the <a href="https://www.oaic.gov.au/">Office of the Australian Information Commissioner</a>.
</div>

<footer style="margin-top: 3rem; padding-top: 2rem; border-top: 1px solid var(--theme-foreground-fainter); text-align: center; color: var(--theme-foreground-muted); font-size: 0.875rem;">
Inspired by re-identification research from Imperial College London. Adapted for Australian demographics using ABS census data.
</footer>
