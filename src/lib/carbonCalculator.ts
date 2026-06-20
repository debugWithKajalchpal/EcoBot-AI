import { QuizAnswers } from '../types';

// Official reputation database source emission factors (defined here for modularity)
export const GLOBAL_EMISSION_FACTORS = [
  { factor: "transport_car_petrol", value: 0.18, unit: "kg CO2e / km", region: "Global/US EPA", source: "US EPA Fleet Averages", year: 2024, confidence: "High", notes: "Averages direct fuel burn plus upstream refining." },
  { factor: "transport_car_diesel", value: 0.19, unit: "kg CO2e / km", region: "Global/EU EEA", source: "European Environment Agency", year: 2023, confidence: "High", notes: "Higher direct intensity, lower mileage standard." },
  { factor: "transport_electric", value: 0.05, unit: "kg CO2e / km", region: "US National Grid Avg", source: "IEA Grid Factors", year: 2024, confidence: "Medium", notes: "Dependent on local grid power fuel configuration." },
  { factor: "transport_public_transit", value: 0.04, unit: "kg CO2e / km", region: "Global/IEA", source: "International Energy Agency", year: 2024, confidence: "High", notes: "Assumes average load factor for regional bus/metro." },
  { factor: "flight_short_haul", value: 150.0, unit: "kg CO2e / flight", region: "Global/IPCC", source: "IPCC Emission Guidelines", year: 2023, confidence: "High", notes: "Includes high altitude radiative forcing factor." },
  { factor: "flight_long_haul", value: 850.0, unit: "kg CO2e / flight", region: "Global/IPCC", source: "IPCC Emission Guidelines", year: 2023, confidence: "High", notes: "Heavy long haul emissions per seat assignment." },
  { factor: "energy_grid_coal", value: 0.95, unit: "kg CO2e / kWh", region: "US/Global", source: "EIA Fuel Baseline", year: 2024, confidence: "High", notes: "High carbon intensity primary thermal coal." },
  { factor: "energy_grid_natural_gas", value: 0.42, unit: "kg CO2e / kWh", region: "US/Global", source: "EIA Fuel Baseline", year: 2024, confidence: "High", notes: "Combined cycle baseline gas turbines." },
  { factor: "energy_grid_nuclear", value: 0.012, unit: "kg CO2e / kWh", region: "Global Link", source: "World Nuclear Assoc", year: 2023, confidence: "High", notes: "Lifecycle calculations inclusive of concrete and mining." },
  { factor: "energy_grid_renewables", value: 0.005, unit: "kg CO2e / kWh", region: "Global Link", source: "NREL Lifecycle", year: 2024, confidence: "High", notes: "Mainly upfront physical solar panel fabrication and wind hubs." },
  { factor: "diet_vegan", value: 1.5, unit: "kg CO2e / day", region: "Global/Oxford University", source: "Poore & Nemecek Study", year: 2018, confidence: "High", notes: "100% plant protein baseline." },
  { factor: "diet_vegetarian", value: 2.5, unit: "kg CO2e / day", region: "Global/Oxford University", source: "Poore & Nemecek Study", year: 2018, confidence: "High", notes: "Includes localized cheese/butter/dairy impact." },
  { factor: "diet_low_meat", value: 4.0, unit: "kg CO2e / day", region: "Global/Oxford", source: "Poore & Nemecek Study", year: 2018, confidence: "High", notes: "Chicken, fish and grains." },
  { factor: "diet_heavy_meat", value: 7.5, unit: "kg CO2e / day", region: "Global/Oxford", source: "Poore & Nemecek Study", year: 2018, confidence: "High", notes: "Daily beef/pork pasture feeds." },
  { factor: "diet_beef_serving", value: 3.0, unit: "kg CO2e / serving", region: "Our World in Data", source: "Our World in Data", year: 2023, confidence: "High", notes: "High methane output from ruminant animal agriculture." },
  { factor: "purchases_fashion_item", value: 12.0, unit: "kg CO2e / item", region: "Global", source: "EDGAR / World Bank", year: 2024, confidence: "Medium", notes: "Includes synthetic fiber textile extrusion." },
  { factor: "waste_garbage_bag", value: 1.5, unit: "kg CO2e / bag", region: "EPA Landfill Factors", source: "US EPA WARM Engine", year: 2024, confidence: "High", notes: "Assumes standard organic rot without bio-methane recovery." }
];

// HIGHLY SOPHISTICATED SUSTAINABILITY CALCULATION CORE ENGINE
export function calculateCarbonFootprint(answers: QuizAnswers) {
  const period = answers.period || 'daily';
  let period_multiplier = 1.0;
  let year_fraction = 1 / 365;

  if (period === 'weekly') {
    period_multiplier = 7.0;
    year_fraction = 7 / 365;
  } else if (period === 'monthly') {
    period_multiplier = 30.0;
    year_fraction = 30 / 365;
  } else if (period === 'yearly') {
    period_multiplier = 365.0;
    year_fraction = 1.0;
  }

  // 1. Transport Calculations
  const transportFactors = {
    car_petrol: 0.18,
    car_diesel: 0.19,
    electric: 0.05,
    public_transit: 0.04,
    walk_bike: 0.00
  };
  let transportCo2 = (answers.transportDistance || 0) * (transportFactors[answers.transportType] || 0.18);

  // Flight Additions (Detailed Mode)
  if (answers.flightsShort && answers.flightsShort > 0) {
    // scale flights (assumed user entered count is per year) to current calculation period
    transportCo2 += (answers.flightsShort * 150) * year_fraction;
  }
  if (answers.flightsMediumLong && answers.flightsMediumLong > 0) {
    transportCo2 += (answers.flightsMediumLong * 850) * year_fraction;
  }

  // 2. Household Energy Calculations
  const energyFactors = {
    low: 3.0,
    medium: 8.0,
    high: 16.0
  };
  let dailyEnergyBase = energyFactors[answers.energyLevel] || 8.0;

  // Fuel heating additions
  if (answers.heatingFuel === 'gas') {
    dailyEnergyBase += 2.0;
  } else if (answers.heatingFuel === 'oil') {
    dailyEnergyBase += 4.0;
  } else if (answers.heatingFuel === 'solar') {
    dailyEnergyBase -= 1.0;
  }

  // AC levels
  if (answers.acUsage === 'heavy') {
    dailyEnergyBase += 3.0;
  } else if (answers.acUsage === 'none') {
    dailyEnergyBase -= 0.5;
  } else {
    dailyEnergyBase += 1.0; // moderate standard AC
  }

  // Upgrades subtractions
  if (answers.ledBulbs) dailyEnergyBase -= 0.5;
  if (answers.ecoLaundry) dailyEnergyBase -= 0.4;
  if (answers.standbyOff) dailyEnergyBase -= 0.3;

  // Clean energy contract modifier
  const energyCleanSourceModifier = {
    none: 1.0,
    partial: 0.5,
    full: 0.1
  };
  let energyCo2 = Math.max(0.6, dailyEnergyBase * (energyCleanSourceModifier[answers.cleanEnergySource] || 1.0)) * period_multiplier;

  // Household Share Allocation logic (If user reports basis as 'individual' and has roomies/family, we divide total home energy!)
  if (answers.basis === 'individual' && answers.householdSize && answers.householdSize > 1) {
    energyCo2 = energyCo2 / answers.householdSize;
  }

  // 3. Diet & Food Calculations
  const dietFactors = {
    vegan: 1.5,
    vegetarian: 2.5,
    low_meat: 4.0,
    heavy_meat: 7.5
  };
  let foodCo2 = (dietFactors[answers.dietType] || 4.0) * period_multiplier;

  // Red meat servings & Dairy adjustments (scaled from weekly values if detailed mode is on)
  if (answers.redMeatServings && answers.redMeatServings > 0) {
    const servesFactor = answers.redMeatServings * 3.0; // 3kg CO2e per beef meal
    const weeklyRatio = period === 'yearly' ? 52.1 : period === 'monthly' ? 4.3 : period === 'weekly' ? 1.0 : 1 / 7;
    foodCo2 += (servesFactor * weeklyRatio) * 0.5; // blending into baseline
  }
  if (answers.dairyServings && answers.dairyServings > 0) {
    const dairyFactor = answers.dairyServings * 0.8;
    const weeklyRatio = period === 'yearly' ? 52.1 : period === 'monthly' ? 4.3 : period === 'weekly' ? 1.0 : 1 / 7;
    foodCo2 += (dairyFactor * weeklyRatio) * 0.5;
  }

  // Organic and local food preferences reduction (up to 12% reduction)
  if (answers.localFoodRatio && answers.localFoodRatio > 0) {
    const localReduction = (answers.localFoodRatio / 100) * 0.12 * foodCo2;
    foodCo2 = Math.max(1.0, foodCo2 - localReduction);
  }

  // Food waste rotting penalty
  if (answers.foodWasteLevel === 'none') {
    foodCo2 -= 0.4 * period_multiplier;
  } else if (answers.foodWasteLevel === 'minimal') {
    foodCo2 -= 0.2 * period_multiplier;
  } else if (answers.foodWasteLevel === 'high') {
    foodCo2 += 1.5 * period_multiplier;
  }

  // 4. Purchases & Shopping Calculations
  const shoppingFactors = {
    minimal: 1.0,
    average: 4.0,
    heavy: 10.0
  };
  let shoppingCo2 = (shoppingFactors[answers.shoppingLevel] || 4.0) * period_multiplier;

  // Online packaging deliveries (entered count is per month)
  if (answers.onlineDeliveries && answers.onlineDeliveries > 0) {
    const deliveryCo2 = answers.onlineDeliveries * 1.25; // 1.25 kg CO2e per shipping box
    const monthlyRatio = period === 'yearly' ? 12 : period === 'monthly' ? 1.0 : period === 'weekly' ? 0.23 : 1 / 30;
    shoppingCo2 += deliveryCo2 * monthlyRatio;
  }

  // Fast-fashion clothes (annual count)
  if (answers.fastFashionPurchases && answers.fastFashionPurchases > 0) {
    const fashionCo2 = answers.fastFashionPurchases * 12.0; // 12kg CO2e per cotton/polyester item
    shoppingCo2 += fashionCo2 * year_fraction;
  }

  // Electronics upgrades
  if (answers.electronicsUpgrades === 'frequent') {
    shoppingCo2 += 2.5 * period_multiplier;
  } else if (answers.electronicsUpgrades === 'rare') {
    shoppingCo2 -= 0.3 * period_multiplier;
  }

  // Secondhand ratio mitigation (up to 40% reduction on the goods base!)
  if (answers.secondhandRatio && answers.secondhandRatio > 0) {
    const mitigation = (answers.secondhandRatio / 100) * 0.4 * shoppingCo2;
    shoppingCo2 = Math.max(0.5, shoppingCo2 - mitigation);
  }

  // 5. Waste Calculations
  let wasteCo2 = 2.0 * period_multiplier; // baseline

  if (answers.garbageBags && answers.garbageBags > 0) {
    const garbageBase = answers.garbageBags * 1.5;
    const weeklyRatio = period === 'yearly' ? 52.1 : period === 'monthly' ? 4.3 : period === 'weekly' ? 1.0 : 1 / 7;
    wasteCo2 = garbageBase * weeklyRatio;
  }

  // recycling checklist reductions
  const checkedRecyclingCount = (answers.recyclingPaper ? 1 : 0) + (answers.recyclingPlastic ? 1 : 0) + (answers.recyclingMetal ? 1 : 0) + (answers.recyclingOrganic ? 1 : 0) + (answers.wasteRecycling ? answers.wasteRecycling.length : 0);
  if (checkedRecyclingCount > 0) {
    wasteCo2 = Math.max(0.2 * period_multiplier, wasteCo2 - (checkedRecyclingCount * 0.32 * period_multiplier));
  }

  // Totals mapping
  const total = parseFloat((transportCo2 + energyCo2 + foodCo2 + shoppingCo2 + wasteCo2).toFixed(1));

  // Eco Score targeting
  // target carbon standards
  const targetEmmissions = {
    daily: 8.0,
    weekly: 56.0,
    monthly: 240.0,
    yearly: 2900.0
  };
  const standardLimit = targetEmmissions[answers.period || 'daily'] || 8.0;
  const rawDev = total / standardLimit;
  const baseScore = 100 - (rawDev * 20);
  const score = Math.max(10, Math.min(100, Math.round(baseScore)));

  // Top Drivers estimation
  const driverWeights = [
    { name: "Vehicle Transportation", value: transportCo2 },
    { name: "Household Power & HVAC", value: energyCo2 },
    { name: "Agricultural food choices", value: foodCo2 },
    { name: "New retail & Goods Purchases", value: shoppingCo2 },
    { name: "Landfill waste deposition", value: wasteCo2 }
  ];
  driverWeights.sort((a, b) => b.value - a.value);
  const top_drivers = driverWeights.slice(0, 2).map(dr => `${dr.name} (${Math.round((dr.value/total)*100)}%)`);

  const confidence = answers.mode === 'detailed' ? 'high' : 'medium';

  return {
    breakdown: {
      transport: parseFloat(transportCo2.toFixed(1)),
      energy: parseFloat(energyCo2.toFixed(1)),
      diet: parseFloat(foodCo2.toFixed(1)),
      shopping: parseFloat(shoppingCo2.toFixed(1)),
      waste: parseFloat(wasteCo2.toFixed(1))
    },
    total,
    score,
    confidence,
    top_drivers
  };
}
