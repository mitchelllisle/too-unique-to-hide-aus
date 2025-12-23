---
title: About
---

# About This Calculator

This Privacy Risk Calculator demonstrates how easily individuals can be re-identified in "anonymous" datasets using just basic demographic information.

## How It Works

The calculator uses Australian Bureau of Statistics (ABS) census data to estimate how many people in a given postcode share a specific combination of:
- Age group
- Gender
- Geographic location (postcode)

The fewer people who share your characteristics, the higher your re-identification risk.

## Understanding Risk Levels

### Very High Risk (1-10 people)
You are **highly identifiable**. Anyone with access to the dataset could likely determine your identity with minimal additional information. Your demographic combination is so rare that you stand out significantly.

### High Risk (11-100 people)
You are **quite identifiable**. With just one or two additional pieces of information (like occupation, education level, or family status), someone could likely narrow down and identify you from this group.

### Moderate Risk (101-1,000 people)
You have **some privacy protection**, but you're not invisible. If someone were to combine this demographic data with other datasets (such as purchasing habits, location data, or online activity), they could potentially narrow down and identify you.

### Lower Risk (1,001+ people)
Your demographic profile is **relatively common**, providing better privacy protection for your basic demographics. However, remember that "anonymous" doesn't mean untraceable. The risk of re-identification increases when combined with other data sources.

## Why This Matters

Many organizations share "de-identified" data believing that removing names and addresses provides adequate privacy protection. However, research has shown that:

1. **Combinations are unique**: Even common attributes become identifying when combined
2. **Data linkage is easy**: Multiple datasets can be cross-referenced to narrow down individuals
3. **More data means more risk**: Each additional data point exponentially increases re-identification risk

## Privacy in Practice

This calculator uses data from major Australian postcodes. In reality:
- Smaller geographic areas (suburbs, towns) have fewer people and higher risk
- Additional demographics (occupation, income, education) dramatically increase uniqueness
- Behavioral data (shopping patterns, location history) can identify individuals even in large populations

## Data Sources

This tool uses representative demographic data based on:
- Australian Bureau of Statistics Census data
- Population distributions by age and gender
- Geographic population density

## Data Confidentiality Notice

**Important:** This calculator uses demographic data from the Australian Bureau of Statistics (ABS). The ABS applies perturbation techniques to Census and survey data to protect individual confidentiality. As stated in the [ABS TableBuilder documentation](https://www.abs.gov.au/statistics/microdata-tablebuilder/tablebuilder/confidentiality-and-relative-standard-error):

> "To minimise the risk of identifying individuals in aggregate statistics, a technique has been developed to randomly adjust cell values. Random adjustment of the data, known as perturbation, is considered to be the most satisfactory technique for avoiding the release of identifiable data while maximising the range of information that can be released."

This means:
- **Cell values are adjusted**: Small random adjustments are made to all non-zero cells, including totals
- **Small cells are less reliable**: Perturbation has the greatest relative impact on small population counts
- **Results may vary slightly**: The same query may produce slightly different results due to these confidentiality protections

The risk calculations presented by this tool are **estimates for educational purposes** and should not be considered exact measurements. Real-world re-identification risk depends on many factors beyond basic demographics, including the specific datasets being linked, the sophistication of matching algorithms, and additional available information.

## Built With

This calculator is built using:
- **Observable Framework** - Reactive data application framework
- **TypeScript** - Type-safe code
- **Australian Census Data** - Real demographic distributions

## Privacy Notice

Your information is processed **entirely in your browser** and is never sent to any server. We don't:
- Collect your inputs
- Store your data
- Track your usage
- Use cookies or analytics

## Learn More

For more information about privacy and data protection in Australia:

- [Office of the Australian Information Commissioner (OAIC)](https://www.oaic.gov.au/)
- [Australian Privacy Principles (APPs)](https://www.oaic.gov.au/privacy/australian-privacy-principles)
- [ABS Census Data](https://www.abs.gov.au/census)

## Acknowledgments

This project is inspired by the [Individual Risk Calculator](https://aisp.doc.ic.ac.uk/individual-risk/) created by Imperial College London's Applied and Interpretable Statistics research group.

---

[← Back to Calculator](/)
