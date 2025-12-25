---
title: Privacy Risk Calculator
toc: false
theme: [dashboard]
sidebar: false
---

```js
// Import dependencies
import * as Plot from "npm:@observablehq/plot";
import {html} from "npm:htl";

// Import custom components
import {calculateRiskLevel, getRiskExplanation} from "./components/riskCalculations.js";
import {createFingerprintChart} from "./components/fingerprintChart.js";
import {createUniquenessLadder} from "./components/uniquenessLadder.js";

// Load census data
const censusText = await FileAttachment("data/census.csv").text();
const censusData = censusText.trim().split('\n').map(line => JSON.parse(line));
```

# 👁️‍🗨️ How Unique Are You?

<div style="color: var(--theme-foreground-muted); max-width: 700px; margin-bottom: 1rem;">
Discover how easily you could be identified from supposedly "anonymous" data. Even after removing names and addresses, organisations can still re-identify individuals using just a few basic demographic characteristics.
</div>

<div class="note" style="max-width: 800px; margin-bottom: 2rem; font-size: 0.875rem;">
  <b>Understanding Your Risk:</b> We show how many people share your demographic profile. Smaller groups mean higher re-identification risk in "anonymous" datasets.<br>
  <span style="color: #dc2626;">●</span> <b>Very High Risk:</b> Less than 10 people<br>
  <span style="color: #ea580c;">●</span> <b>High Risk:</b> 10-99 people<br>
  <span style="color: #ca8a04;">●</span> <b>Moderate Risk:</b> 100-999 people<br>
  <span style="color: #16a34a;">●</span> <b>Lower Risk:</b> 1,000+ people
</div>

```js
// Input controls with reactive generators
const postcodeInputView = Inputs.text({
  label: "Postcode",
  placeholder: "e.g., 2000",
  pattern: "[0-9]{4}",
  required: true,
  value: "2000",
  style: "height: 40px !important; padding: 12px 16px; font-size: 16px; width: 100%;"
});
const postcodeInput = Generators.input(postcodeInputView);

const ageGroupView = Inputs.select([
  "0-4 years", "5-9 years", "10-14 years", "15-19 years",
  "20-24 years", "25-29 years", "30-34 years", "35-39 years",
  "40-44 years", "45-49 years", "50-54 years", "55-59 years",
  "60-64 years", "65-69 years", "70-74 years", "75-79 years",
  "80-84 years", "85 years and over"
], {
  label: "Age Group",
  value: "25-29 years",
  style: "height: 40px !important; padding: 12px 16px; font-size: 16px; width: 100%;"
});
const ageGroup = Generators.input(ageGroupView);

const genderView = Inputs.radio(["male", "female"], {
  label: "Gender",
  value: "female"
});
const gender = Generators.input(genderView);

const allOccupations = [...new Set(censusData.map(d => d.occ))]
  .filter(occ => occ && occ !== 'OCCUPATION' && occ !== 'Not applicable' && occ !== 'Not stated' && occ !== 'Inadequately described')
  .sort();

const occupationView = Inputs.select(["Any", ...allOccupations], {
  label: "Occupation (optional)",
  value: "Any",
  style: "height: 40px !important; padding: 12px 16px; font-size: 16px; width: 100%;"
});
const occupation = Generators.input(occupationView);
```

<div class="grid grid-cols-2">
  <div class="card">
    <h2 style="font-size: 1.25rem; margin-bottom: 1rem;">Your Demographics</h2>
    ${postcodeInputView}
    ${ageGroupView}
    ${genderView}
  </div>
  <div class="card">
    <h2 style="font-size: 1.25rem; margin-bottom: 1rem;">Additional Details</h2>
    ${occupationView}
  </div>
</div>

```js
/**
 * Calculate matching count from census data based on selected demographics
 */
const filteredData = censusData.filter(d => {
  return d.poa === postcodeInput && 
         d.age === ageGroup && 
         d.sex === (gender.charAt(0).toUpperCase() + gender.slice(1));
});

const matchingCount = occupation === "Any" 
  ? filteredData.reduce((sum, d) => sum + d.count, 0)
  : filteredData.filter(d => d.occ === occupation).reduce((sum, d) => sum + d.count, 0);

const riskLevel = calculateRiskLevel(matchingCount);

const result = {
  count: matchingCount,
  riskLevel
};
```

```js
/**
 * Prepare fingerprint data showing individual attribute counts
 */
const fingerprintData = result ? {
  attributes: [
    {
      name: "Postcode",
      value: postcodeInput,
      count: censusData
        .filter(d => d.poa === postcodeInput)
        .reduce((sum, d) => sum + d.count, 0)
    },
    {
      name: "Age Group",
      value: ageGroup,
      count: censusData
        .filter(d => d.poa === postcodeInput && d.age === ageGroup)
        .reduce((sum, d) => sum + d.count, 0)
    },
    {
      name: "Gender",
      value: gender.charAt(0).toUpperCase() + gender.slice(1),
      count: censusData
        .filter(d => d.poa === postcodeInput && d.sex === (gender.charAt(0).toUpperCase() + gender.slice(1)))
        .reduce((sum, d) => sum + d.count, 0)
    },
    ...(occupation !== "Any" ? [{
      name: "Occupation",
      value: occupation,
      count: censusData
        .filter(d => d.poa === postcodeInput && d.occ === occupation)
        .reduce((sum, d) => sum + d.count, 0)
    }] : [])
  ],
  yourCount: result.count
} : null;
```

```js
// Create uniqueness ladder visualization
const uniquenessLadder = createUniquenessLadder(fingerprintData);
```

<div class="grid grid-cols-1">
  <div class="card" style="box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);">
    <h2 style="font-size: 1.5rem; margin-bottom: 1.5rem;">Your Risk Level</h2>
    ${result ? (() => {
      const riskData = getRiskExplanation(result);
      return html`
        <div style="text-align: center; padding: 1.5rem; background: ${riskData.color}15; border-radius: 8px; margin-bottom: 1rem;">
          <span class="big" style="color: ${riskData.color}; font-size: 3.5rem; font-weight: 700;">
            ${result.count === 0 ? 'Possibly Unique' : `${result.count.toLocaleString()} ${result.count === 1 ? 'person' : 'people'}`} ${riskData.emoji}
          </span>
        </div>
        <div style="margin-bottom: 1rem;">
          <b style="color: ${riskData.color}; font-size: 1.125rem;">${riskData.title}</b>
          ${uniquenessLadder}
        </div>
        <span class="muted" style="font-size: 0.9375rem; line-height: 1.6;">
          ${riskData.explanation}
        </span>
      `;
    })() : html`<span class="muted">Please enter a valid 4-digit postcode</span>`}
  </div>
</div>

```js
/**
 * Prepare age distribution data for visualization
 */
const ageGroupOrder = [
  "0-4 years", "5-9 years", "10-14 years", "15-19 years",
  "20-24 years", "25-29 years", "30-34 years", "35-39 years",
  "40-44 years", "45-49 years", "50-54 years", "55-59 years",
  "60-64 years", "65-69 years", "70-74 years", "75-79 years",
  "80-84 years", "85 years and over"
];
const allAgeGroups = [...new Set(censusData.map(d => d.age))].sort((a, b) => {
  const indexA = ageGroupOrder.indexOf(a);
  const indexB = ageGroupOrder.indexOf(b);
  return indexA - indexB;
});
const ageDistributionData = allAgeGroups.map(group => {
  const populationForAge = censusData
    .filter(d => d.poa === postcodeInput && d.age === group)
    .reduce((sum, d) => sum + d.count, 0);
  
  return {
    ageGroup: group,
    population: populationForAge,
    isSelected: group === ageGroup
  };
}).filter(d => d.population > 0);
```

<div class="grid grid-cols-2">
  <div class="card">
    <h2>Your Demographic Fingerprint</h2>
    <p class="muted" style="margin-bottom: 1rem; font-size: 0.875rem;">The risk profile above combines <strong>all attributes together</strong> to show your overall re-identification risk, whereas this chart shows the totals per attribute in isolation within the postcode selected.</p>
    ${fingerprintData ? resize((width) => createFingerprintChart(fingerprintData, width)) : html`<div style="text-align: center; padding: 2rem; color: var(--theme-foreground-muted);">No match found - try different demographic selections</div>`}
  </div>

  <div class="card">
    <h2>Population Breakdown by Age Group</h2>
    <p class="muted" style="margin-bottom: 1rem; font-size: 0.875rem;">Understanding the age demographics in postcode ${postcodeInput}. Your selected age group is highlighted to show where you fit within the local population distribution.</p>
    ${ageDistributionData.length > 0 ? resize((width) => Plot.plot({
      width,
      marginLeft: 60,
      marginBottom: 65,
      height: 400,
      style: {
        fontSize: "11px",
        background: "transparent"
      },
      x: { 
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

<div class="grid grid-cols-2">
  <div class="card">
    <b>⚠️ Educational Purposes:</b> The risk calculations presented by this tool are estimates for educational purposes and should not be considered exact measurements. Real-world re-identification risk depends on many factors beyond basic demographics, including the specific datasets being linked, the sophistication of matching algorithms, and additional available information.
  </div>

  <div class="card">
    <b>About This Calculator:</b> This tool uses Australian Bureau of Statistics (ABS) census data to demonstrate re-identification risk in anonymous datasets. By analyzing how many people in your postcode share your age group and gender, it estimates how easily you could be singled out.
    <br><br>
    <b>Privacy:</b> All calculations happen locally in your browser. We never collect, transmit, or store any of your information. You can see the source code for this app here: <a href="https://github.com/mitchelllisle/too-unique-to-hide-aus" target="_blank" rel="noopener noreferrer">github.com/mitchelllisle/too-unique-to-hide-aus</a>
    <br><br>
    Learn more about data protection in Australia at the <a href="https://www.oaic.gov.au/">Office of the Australian Information Commissioner</a>.
  </div>
</div>

<footer style="margin-top: 3rem; padding-top: 2rem; border-top: 1px solid var(--theme-foreground-fainter); text-align: center; color: var(--theme-foreground-muted); font-size: 0.875rem;">
Inspired by <a href="https://aisp.doc.ic.ac.uk/individual-risk/" target="_blank" rel="noopener noreferrer">re-identification research from Imperial College London</a>. Adapted for Australian demographics using ABS census data.
</footer>
