// Australian demographic data for Observable Framework
// This module exports the postcode data and helper functions

export const australianData = {
  postcodes: {
    // New South Wales
    "2000": { population: 6301, ageDistribution: [145, 168, 201, 398, 789, 856, 745, 612, 498, 387, 298, 267, 189, 156, 123, 98, 78, 293], genderRatio: 0.51 },
    "2010": { population: 15234, ageDistribution: [456, 523, 601, 1123, 1987, 2145, 1876, 1534, 1245, 967, 789, 678, 456, 378, 298, 234, 189, 755], genderRatio: 0.49 },
    "2060": { population: 12876, ageDistribution: [389, 445, 512, 945, 1678, 1823, 1598, 1298, 1056, 823, 678, 589, 412, 334, 267, 212, 167, 650], genderRatio: 0.48 },
    "2150": { population: 28945, ageDistribution: [1023, 1178, 1345, 2456, 3789, 4123, 3567, 2901, 2345, 1823, 1456, 1267, 890, 723, 578, 456, 356, 1669], genderRatio: 0.49 },
    "2200": { population: 32156, ageDistribution: [1156, 1334, 1523, 2789, 4234, 4598, 3976, 3234, 2612, 2034, 1623, 1412, 989, 801, 634, 501, 389, 2317], genderRatio: 0.50 },
    
    // Victoria
    "3000": { population: 8934, ageDistribution: [234, 267, 312, 645, 1234, 1345, 1167, 945, 767, 598, 478, 412, 289, 234, 189, 145, 112, 561], genderRatio: 0.52 },
    "3056": { population: 19876, ageDistribution: [567, 656, 745, 1389, 2456, 2678, 2312, 1879, 1523, 1189, 945, 823, 578, 467, 378, 289, 223, 1779], genderRatio: 0.49 },
    "3121": { population: 14523, ageDistribution: [412, 478, 545, 1023, 1789, 1956, 1689, 1378, 1112, 867, 689, 601, 423, 334, 267, 212, 167, 1582], genderRatio: 0.48 },
    "3206": { population: 26789, ageDistribution: [956, 1101, 1267, 2312, 3567, 3901, 3378, 2745, 2223, 1734, 1378, 1198, 845, 678, 545, 423, 334, 2205], genderRatio: 0.49 },
    
    // Queensland
    "4000": { population: 7234, ageDistribution: [189, 223, 267, 512, 945, 1034, 901, 734, 589, 456, 367, 312, 223, 178, 145, 112, 89, 558], genderRatio: 0.51 },
    "4006": { population: 16543, ageDistribution: [478, 556, 634, 1189, 2034, 2234, 1934, 1578, 1278, 989, 789, 689, 478, 389, 312, 245, 189, 1548], genderRatio: 0.50 },
    "4101": { population: 21345, ageDistribution: [612, 701, 801, 1489, 2567, 2801, 2423, 1967, 1589, 1234, 978, 856, 601, 489, 389, 301, 234, 2313], genderRatio: 0.49 },
    "4305": { population: 29876, ageDistribution: [1089, 1256, 1434, 2678, 4123, 4512, 3901, 3167, 2567, 1989, 1589, 1378, 967, 778, 623, 489, 378, 1959], genderRatio: 0.50 },
    
    // South Australia
    "5000": { population: 5823, ageDistribution: [145, 167, 198, 378, 689, 756, 656, 534, 434, 334, 267, 234, 167, 134, 112, 89, 67, 462], genderRatio: 0.51 },
    "5006": { population: 13456, ageDistribution: [389, 445, 512, 967, 1678, 1834, 1589, 1289, 1045, 812, 645, 567, 401, 323, 256, 201, 156, 1347], genderRatio: 0.49 },
    "5095": { population: 24567, ageDistribution: [890, 1023, 1178, 2189, 3401, 3723, 3234, 2623, 2123, 1645, 1312, 1145, 801, 645, 512, 401, 312, 1411], genderRatio: 0.50 },
    
    // Western Australia
    "6000": { population: 4567, ageDistribution: [112, 134, 156, 301, 545, 601, 523, 423, 345, 267, 212, 189, 134, 109, 89, 67, 54, 306], genderRatio: 0.52 },
    "6050": { population: 15234, ageDistribution: [434, 501, 578, 1089, 1879, 2056, 1789, 1456, 1178, 912, 734, 634, 445, 367, 289, 223, 178, 1492], genderRatio: 0.49 },
    "6107": { population: 22345, ageDistribution: [645, 745, 856, 1589, 2734, 2989, 2589, 2101, 1701, 1323, 1056, 912, 645, 523, 412, 323, 256, 1946], genderRatio: 0.50 },
    
    // Tasmania
    "7000": { population: 8234, ageDistribution: [223, 256, 301, 567, 989, 1089, 945, 767, 623, 489, 389, 334, 245, 198, 156, 123, 98, 442], genderRatio: 0.49 },
    "7250": { population: 14567, ageDistribution: [423, 489, 556, 1034, 1789, 1956, 1701, 1389, 1123, 878, 701, 601, 423, 345, 278, 212, 167, 1502], genderRatio: 0.50 },
    
    // Australian Capital Territory
    "2600": { population: 12345, ageDistribution: [367, 423, 489, 912, 1589, 1734, 1501, 1223, 989, 767, 612, 534, 378, 301, 245, 189, 145, 947], genderRatio: 0.50 },
    "2605": { population: 16789, ageDistribution: [489, 567, 645, 1201, 2089, 2278, 1978, 1612, 1301, 1012, 801, 701, 489, 401, 312, 245, 189, 1479], genderRatio: 0.49 },
    
    // Northern Territory
    "0800": { population: 6789, ageDistribution: [198, 234, 267, 512, 912, 989, 856, 701, 567, 445, 356, 301, 223, 178, 145, 112, 89, 704], genderRatio: 0.51 }
  },
  
  ageGroups: [
    "0-4", "5-9", "10-14", "15-19", "20-24", "25-29", "30-34", 
    "35-39", "40-44", "45-49", "50-54", "55-59", "60-64", 
    "65-69", "70-74", "75-79", "80-84", "85+"
  ],
  
  // Based on ABS occupation categories (simplified)
  occupations: [
    "Managers",
    "Professionals", 
    "Technicians and Trades Workers",
    "Community and Personal Service Workers",
    "Clerical and Administrative Workers",
    "Sales Workers",
    "Machinery Operators and Drivers",
    "Labourers",
    "Not in workforce"
  ],
  
  // Distribution of occupations across working-age population (approximate percentages)
  occupationDistribution: {
    "Managers": 0.13,
    "Professionals": 0.24,
    "Technicians and Trades Workers": 0.14,
    "Community and Personal Service Workers": 0.10,
    "Clerical and Administrative Workers": 0.13,
    "Sales Workers": 0.09,
    "Machinery Operators and Drivers": 0.06,
    "Labourers": 0.09,
    "Not in workforce": 0.02
  }
};
