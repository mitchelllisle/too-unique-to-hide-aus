---
title: Privacy Risk Calculator
toc: false
theme: [dashboard]
sidebar: false
---

```js
import * as Plot from "npm:@observablehq/plot";
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
  "0-4 years", "5-9 years", "10-14 years", "15-19 years",
  "20-24 years", "25-29 years", "30-34 years", "35-39 years",
  "40-44 years", "45-49 years", "50-54 years", "55-59 years",
  "60-64 years", "65-69 years", "70-74 years", "75-79 years",
  "80-84 years", "85 years and over"
], {
  label: "Age Group",
  value: "25-29 years",
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
// Get unique occupations from census data
const allOccupations = [...new Set(censusData.map(d => d.occ))]
  .filter(occ => occ && occ !== 'OCCUPATION' && occ !== 'Not applicable' && occ !== 'Not stated' && occ !== 'Inadequately described')
  .sort();

const occupation = view(Inputs.select(["Any", ...allOccupations], {
  label: "Occupation (optional)",
  value: "Any",
  style: "height: 48px; padding: 12px 16px; font-size: 16px; width: 100%; max-width: 400px;"
}));
```

```js
// Process census data - filter and aggregate for the selected inputs
const filteredData = censusData.filter(d => {
  return d.poa === postcodeInput && 
         d.age === ageGroup && 
         d.sex === (gender.charAt(0).toUpperCase() + gender.slice(1));
});

// Calculate the total count for the specific demographic + occupation
const matchingCount = occupation === "Any" 
  ? filteredData.reduce((sum, d) => sum + d.count, 0)
  : filteredData
      .filter(d => d.occ === occupation)
      .reduce((sum, d) => sum + d.count, 0);

// Get total population for the postcode and age group (all occupations, both genders)
const totalForAgeGroup = censusData
  .filter(d => d.poa === postcodeInput && d.age === ageGroup)
  .reduce((sum, d) => sum + d.count, 0);

// Determine risk level based on anonymity set size (how many people share your characteristics)
// Smaller groups = higher re-identification risk
let riskLevel;
if (matchingCount === 0) riskLevel = 'none';
else if (matchingCount === 1) riskLevel = 'very-high';
else if (matchingCount < 10) riskLevel = 'very-high';
else if (matchingCount < 100) riskLevel = 'high';
else if (matchingCount < 1000) riskLevel = 'moderate';
else riskLevel = 'low';

const result = {
  count: matchingCount,
  riskLevel,
  postcode: postcodeInput,
  ageGroup,
  gender,
  occupation,
  totalPopulation: totalForAgeGroup
};
```

```js
// Prepare data for age distribution visualization
// Get all unique age groups from census data
const allAgeGroups = [...new Set(censusData.map(d => d.age))].sort();

// Calculate population for each age group in this postcode
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

```js
function getRiskExplanation(result) {
  const { count, postcode, ageGroup, gender, riskLevel } = result;
  
  const riskEmojis = {
    'none': 'ℹ️',
    'very-high': '🚨',
    'high': '⚠️',
    'moderate': '💭',
    'low': '✅'
  };
  
  const riskColors = {
    'none': '#6b7280',
    'very-high': '#dc2626',
    'high': '#ea580c',
    'moderate': '#ca8a04',
    'low': '#16a34a'
  };
  
  switch(riskLevel) {
    case 'none':
      return {
        emoji: riskEmojis[riskLevel],
        color: riskColors[riskLevel],
        title: 'No Match Found',
        explanation: html`No people in the census data match this exact combination of demographics. This could mean the combination is extremely rare, or the data was <a href="https://www.abs.gov.au/about/data-services/help/confidentiality" target="_blank" rel="noopener noreferrer">suppressed by the Australian Bureau of Statistics (ABS)</a> for privacy protection.`
      };
    case 'very-high':
      return {
        emoji: riskEmojis[riskLevel],
        color: riskColors[riskLevel],
        title: 'Very High Risk',
        explanation: `Only ${count} ${count === 1 ? 'person has' : 'people have'} your demographic profile in this area. You may be highly vulnerable to re-identification—even in "anonymous" datasets, these characteristics could potentially single you out.`
      };
    case 'high':
      return {
        emoji: riskEmojis[riskLevel],
        color: riskColors[riskLevel],
        title: 'High Risk',
        explanation: `Only ${count} people share your demographic profile. Your anonymity set is small—just one or two additional data points may be enough to uniquely identify you in linked datasets.`
      };
    case 'moderate':
      return {
        emoji: riskEmojis[riskLevel],
        color: riskColors[riskLevel],
        title: 'Moderate Risk',
        explanation: `About ${count.toLocaleString()} people share your demographic profile. You have some protection through anonymity, but linking with other datasets may still narrow down to identify you.`
      };
    case 'low':
      return {
        emoji: riskEmojis[riskLevel],
        color: riskColors[riskLevel],
        title: 'Lower Risk',
        explanation: `Over ${count.toLocaleString()} people share your demographic profile. This larger anonymity set offers better privacy protection, though combining multiple datasets could still potentially identify individuals.`
      };
  }
}
```

<div class="grid grid-cols-1">
  <div class="card" style="box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);">
    <h2 style="font-size: 1.5rem; margin-bottom: 1.5rem;">Your Risk Level</h2>
    ${result ? (() => {
      const riskData = getRiskExplanation(result);
      return html`
        <div style="text-align: center; padding: 1.5rem; background: ${riskData.color}15; border-radius: 8px; margin-bottom: 1rem;">
          <span class="big" style="color: ${riskData.color}; font-size: 3.5rem; font-weight: 700;">
            ${result.count === 0 ? 'No match' : `${result.count.toLocaleString()} ${result.count === 1 ? 'person' : 'people'}`} ${riskData.emoji}
          </span>
        </div>
        <span class="muted" style="font-size: 0.9375rem; line-height: 1.6;">
          <b style="color: ${riskData.color}; font-size: 1.125rem;">${riskData.title}</b>
          <br><br>
          ${riskData.explanation}
        </span>
      `;
    })() : html`<span class="muted">Please enter a valid 4-digit postcode</span>`}
  </div>
</div>

```js
// Prepare data for fingerprint visualization
// Calculate how many people share each individual attribute
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
      value: occupation.length > 30 ? occupation.substring(0, 30) + "..." : occupation,
      count: censusData
        .filter(d => d.poa === postcodeInput && d.occ === occupation)
        .reduce((sum, d) => sum + d.count, 0)
    }] : [])
  ],
  yourCount: result.count
} : null;
```

```js
const fingerprintViz = fingerprintData ? resize((width) => {
  const height = 500;
  const radius = 180;
  const centerX = width / 2;
  const centerY = height / 2;
  
  const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto;");
  
  const attributes = fingerprintData.attributes;
  
  // Draw spokes/lines first (so they're behind circles)
  attributes.forEach((attr, i) => {
    const angle = (i * 2 * Math.PI) / attributes.length - Math.PI / 2;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    
    // Determine color based on count (rarity)
    let color;
    if (attr.count < 1000) color = "#ef4444";
    else if (attr.count < 5000) color = "#f59e0b";
    else if (attr.count < 20000) color = "#fbbf24";
    else color = "#10b981";
    
    // Draw line
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
  
  // Draw center circle
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
  
  // Draw attribute nodes
  attributes.forEach((attr, i) => {
    const angle = (i * 2 * Math.PI) / attributes.length - Math.PI / 2;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    
    // Determine color based on count (rarity)
    let color;
    if (attr.count < 1000) color = "#ef4444";
    else if (attr.count < 5000) color = "#f59e0b";
    else if (attr.count < 20000) color = "#fbbf24";
    else color = "#10b981";
    
    // Draw circle
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
    
    // Count with colored background
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
    { color: "#10b981", label: "Common (20,000+)", range: "Low Risk" },
    { color: "#fbbf24", label: "Uncommon (5,000-20,000)", range: "Medium Risk" },
    { color: "#f59e0b", label: "Rare (1,000-5,000)", range: "High Risk" },
    { color: "#ef4444", label: "Very Rare (<1,000)", range: "Critical Risk" }
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
      .text(item.range);
  });
  
  return svg.node();
}) : html`<div style="text-align: center; padding: 2rem; color: var(--theme-foreground-muted);">No match found - try different demographic selections</div>`;
```

<div class="grid grid-cols-2">
  <div class="card">
    <h2>Your Demographic Fingerprint</h2>
    <p class="muted" style="margin-bottom: 1rem; font-size: 0.875rem;">The risk profile above combines <strong>all attributes together</strong> to show your overall re-identification risk, whereas this chart shows the totals per attribute in isolation within the postcode selected.</p>
    ${fingerprintViz}
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
