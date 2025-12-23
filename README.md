# Privacy Risk Calculator - Australian Edition

An interactive web tool that calculates re-identification risk for individuals in "anonymous" datasets using Australian demographics. This project demonstrates how easily people can be identified using just basic demographic information like postcode, age, and gender.

**Built with Observable Framework** - A modern, reactive framework for data applications.

## 🎯 Purpose

This calculator helps Australians understand:
- How unique they are based on basic demographics
- The limitations of data "anonymization"
- Privacy risks in the age of big data
- Why data protection matters

## 🌐 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd too-unique-to-hide-aus
```

2. Install dependencies:
```bash
yarn install
```

3. Start the development server:
```bash
yarn dev
```

4. Open your browser to the URL shown (typically `http://localhost:3000`)

### Build for Production

```bash
yarn build
```

The built site will be in the `dist` directory, ready to deploy to any static hosting service.

## 🚀 Features

- **Observable Framework** - Reactive, real-time updates as you change inputs
- **Markdown-based** - Content and code in one place with literate programming
- **Type-safe calculations** based on Australian census data
- **Clean, responsive design** that works on desktop and mobile devices
- **Privacy-focused**: All calculations happen in your browser - no data is sent to any server
- **Educational content** explaining different risk levels and what they mean
- **Accessible**: Built with semantic HTML
- **Fast development** with hot module reloading

## 📊 How It Works

The calculator uses demographic data based on Australian Bureau of Statistics (ABS) census information:

1. **User inputs** their postcode, age group, and gender
2. **Calculator determines** how many people in that postcode share those characteristics
3. **Risk assessment** categorizes the uniqueness:
   - **Very High Risk**: 1-10 people (highly identifiable)
   - **High Risk**: 11-100 people (quite identifiable)
   - **Moderate Risk**: 101-1,000 people (some anonymity)
   - **Lower Risk**: 1,001+ people (more common profile)

## 🏗️ Project Structure

```
too-unique-to-hide-aus/
├── docs/                    # Observable Framework content
│   ├── index.md            # Main calculator page (Markdown + JavaScript)
│   ├── about.md            # About page
│   ├── custom-theme.css    # Custom styling
│   └── data/
│       └── postcodes.js    # Australian demographic data
├── dist/                    # Built site (generated)
├── observablehq.config.ts  # Observable Framework configuration
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── README.md               # This file
```

## 💻 Technical Details

- **Observable Framework** - Modern reactive framework for data applications
- **Literate Programming** - Markdown files with embedded JavaScript code blocks
- **Reactive Computations** - Automatic updates when inputs change
- **Built-in Components** - `Inputs.text()`, `Inputs.select()`, `Inputs.radio()` for forms
- **No Build Step in Development** - Instant updates with hot module reloading
- **Static Site Generation** - Builds to optimized static HTML/JS/CSS
- **Responsive Design** - CSS with Observable's theming system
- **TypeScript Support** - Configuration ready for type-safe development

### Observable Framework Features

Observable Framework provides:
- **Reactive cells**: Code blocks that automatically re-run when dependencies change
- **Data loaders**: Efficient data loading and caching
- **File-based routing**: Pages are markdown files in the `docs/` directory
- **Built-in visualization**: D3, Plot, and other libraries available out of the box
- **Fast development**: Changes appear instantly in the browser

## 🗺️ Included Postcodes

The calculator includes demographic data for major postcodes across:
- New South Wales (Sydney and surrounds)
- Victoria (Melbourne and surrounds)
- Queensland (Brisbane and surrounds)
- South Australia (Adelaide and surrounds)
- Western Australia (Perth and surrounds)
- Tasmania (Hobart and Launceston)
- Australian Capital Territory (Canberra)
- Northern Territory (Darwin)

## 🔒 Privacy

This tool processes all data locally in your browser. We don't:
- Send your information to any server
- Store or track your data
- Use cookies or analytics
- Collect any personal information

## 📖 Usage

### Development

1. Install dependencies: `yarn install`
2. Start dev server: `yarn dev`
3. Open browser to local URL
4. Edit markdown files in `docs/` - changes appear instantly

### For Content Creators

Edit the calculator page at [docs/index.md](docs/index.md). Observable Framework uses **literate programming** - you write markdown with embedded JavaScript:

````markdown
## My Section

Regular markdown text here.

```js
// JavaScript code blocks are reactive
const myValue = 42;
```

```js
// This block can use myValue
display(myValue * 2); // Shows: 84
```
````

### For Developers

#### Adding New Postcodes

Edit [docs/data/postcodes.js](docs/data/postcodes.js):
```javascript
export const australianData = {
  postcodes: {
    "1234": {
      population: total_number,
      ageDistribution: [18 values for age groups],
      genderRatio: proportion_male
    }
  }
};
```

#### Modifying Risk Calculation

Edit the `calculateRisk()` function in [docs/index.md](docs/index.md):
```javascript
function calculateRisk(postcodeData, ageGroup, gender) {
  // Your logic here
  return { count, riskLevel, ... };
}
```

#### Available Scripts

- `yarn dev` - Start development server with hot reload
- `yarn build` - Build static site for production
- `yarn deploy` - Deploy to Observable hosting
- `yarn clean` - Clear build cache
- `yarn observable` - Run Observable CLI commands

### Observable Framework Concepts

**Reactive Cells**: Code blocks automatically re-run when their dependencies change:
```js
const postcode = view(Inputs.text()); // User input
const data = getPostcodeData(postcode); // Updates when postcode changes
```

**Inputs**: Built-in form components that work reactively:
- `Inputs.text()` - Text input
- `Inputs.select()` - Dropdown
- `Inputs.radio()` - Radio buttons
- And many more...

## 🎓 Educational Use

This tool is perfect for:
- Privacy awareness workshops
- Data ethics courses
- Information security training
- Public education campaigns
- Demonstrations of data privacy concepts

## 🔗 Resources

- [Office of the Australian Information Commissioner (OAIC)](https://www.oaic.gov.au/)
- [Australian Privacy Principles (APPs)](https://www.oaic.gov.au/privacy/australian-privacy-principles)
- [ABS Census Data](https://www.abs.gov.au/census)

## 🙏 Acknowledgments

This project is inspired by the [Individual Risk Calculator](https://aisp.doc.ic.ac.uk/individual-risk/) created by Imperial College London's Applied and Interpretable Statistics research group. We've adapted it for Australian demographics and privacy standards.

## 📝 License

This project is open source and available for educational and non-commercial use.

## 🤝 Contributing

Contributions are welcome! To add more postcodes or improve the calculator:

1. Fork the repository
2. Create a feature branch
3. Make your changes in the `docs/` directory
4. Test with `yarn dev`
5. Build with `yarn build`
6. Submit a pull request

### Ideas for Contributions

- Add more Australian postcodes to `docs/data/postcodes.js`
- Include rural and regional areas
- Create interactive visualizations with Observable Plot
- Add data export features
- Improve mobile responsiveness
- Add more educational content

## 📚 Learn More

- [Observable Framework Documentation](https://observablehq.com/framework/)
- [Observable Inputs](https://observablehq.com/framework/inputs)
- [Markdown Guide](https://observablehq.com/framework/markdown)
- [JavaScript in Markdown](https://observablehq.com/framework/javascript)

## ⚠️ Disclaimer

This calculator provides estimates based on census data and should be used for educational purposes only. Actual re-identification risk depends on many factors beyond basic demographics. The data is representative but simplified for demonstration purposes.

## 📧 Contact

For questions or feedback about this project, please open an issue on the repository.

---

**Remember**: Your privacy matters. Be cautious about what information you share, even when it seems "anonymous."
