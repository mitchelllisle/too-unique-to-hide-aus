import {readFile} from "node:fs/promises";
import {csvParse} from "d3-dsv";

// Read and parse the CSV
const text = await readFile("data/poa-age-sex-occ-filtered.csv", "utf-8");
const rows = csvParse(text);

// Create a compact lookup structure instead of sending all rows
// Extract just the postcode (without state) for easier matching
const data = rows.map(row => ({
  poa: row.POA?.split(',')[0]?.trim(),
  age: row.AGEBRACKETS,
  sex: row.SEX,
  occ: row.OCCUPATION,
  count: parseInt(row.COUNT || 0)
}));

// Output as newline-delimited JSON for efficient streaming
data.forEach(d => {
  process.stdout.write(JSON.stringify(d) + '\n');
});

