// src/data/solarPackages.js

export const ON_GRID_PACKAGES = {
    residential: [
        { capacity: 2, price: 173600, subsidy: 60000, units: 240 },
        { capacity: 3, price: 226400, subsidy: 78000, units: 360 },
        { capacity: 4, price: 282200, subsidy: 78000, units: 480 },
        { capacity: 5, price: 342000, subsidy: 78000, units: 600 },
        { capacity: 10, price: 616000, subsidy: 78000, units: 1200 },
        // ... add the rest from your table
    ],
    commercial: [
        { capacity: 2, price: 121600, rate: 60.80, units: 240 },
        { capacity: 3, price: 173400, rate: 57.80, units: 360 },
        // ... add the rest from your table
    ]
};

export const HYBRID_PACKAGES = {
    residential: [
        { capacity: 3, price: 434000, subsidy: 78000, units: 360, battery: "5.12 kWh" },
        { capacity: 5, price: 585600, subsidy: 78000, units: 600, battery: "5.12 kWh" },
        { capacity: 10, price: 1103200, subsidy: 78000, units: 1200, battery: "10.24 kWh" },
        // ... add the rest from your table
    ],
    // ... add commercial hybrid
};

export const ADD_ONS = [
    { id: 'height', label: 'Extra Structure Height', price: 1000, unit: 'per foot' },
    { id: 'wiring', label: 'Extended Wiring', price: 50, unit: 'per meter' },
    { id: 'footing', label: 'Concrete Footings', price: 1000, unit: 'per block' },
    { id: 'welding', label: 'On-Site Welding', price: 2000, unit: 'flat fee' },
];