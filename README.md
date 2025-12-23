# Privacy Risk Calculator - Australian Edition

Calculate your re-identification risk from "anonymous" datasets using Australian demographics. Shows how unique you are based on postcode, age, gender, and occupation.

Built with [Observable Framework](https://observablehq.com/framework/).

## Quick Start

```bash
yarn install
yarn dev
```

Open http://localhost:3000

## Build

```bash
yarn build  # outputs to dist/
```

## How It Works

Uses ABS census data to estimate how many people share your demographic profile. The fewer matches, the easier you are to re-identify from supposedly anonymous data.

Risk levels:
- **Very High (≥10%)**: Highly identifiable
- **High (1-9.9%)**: Easy to identify with minimal extra data  
- **Moderate (0.1-0.99%)**: Some anonymity, vulnerable to dataset linking
- **Lower (<0.1%)**: Better protection, but still not untraceable

## Project Structure

```
docs/
  index.md           # Main calculator
  about.md           # About page
  data/postcodes.js  # Demographic data
  custom-theme.css   # Styling
```

## Privacy

Everything runs in your browser. No data is sent anywhere.

## Contributing

Add postcodes to `docs/data/postcodes.js` or improve the calculator in `docs/index.md`.

## Credits

Inspired by Imperial College London's [Individual Risk Calculator](https://aisp.doc.ic.ac.uk/individual-risk/).

