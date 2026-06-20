import { describe, it, expect } from 'vitest';
import { calculateCarbonFootprint } from './lib/carbonCalculator';

describe('EcoBot AI Carbon Calculator Core Engine', () => {
  it('correctly calculates baseline emissions for quick mode', () => {
    const result = calculateCarbonFootprint({
      mode: 'quick',
      period: 'daily',
      basis: 'individual',
      transportType: 'car_petrol',
      transportDistance: 15,
      energyLevel: 'medium',
      cleanEnergySource: 'none',
      dietType: 'low_meat',
      shoppingLevel: 'average',
      wasteRecycling: ['paper', 'plastic'],
    });

    expect(result).toBeDefined();
    expect(result.total).toBeGreaterThan(0);
    expect(result.score).toBeGreaterThanOrEqual(10);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(result.breakdown).toHaveProperty('transport');
    expect(result.breakdown).toHaveProperty('energy');
    expect(result.breakdown).toHaveProperty('diet');
    expect(result.breakdown).toHaveProperty('shopping');
    expect(result.breakdown).toHaveProperty('waste');
  });

  it('correctly adjusts calculations for detailed parameters', () => {
    const result = calculateCarbonFootprint({
      mode: 'detailed',
      period: 'yearly',
      basis: 'individual',
      householdSize: 2,
      transportType: 'electric',
      transportDistance: 50,
      flightsShort: 4,
      flightsMediumLong: 2,
      energyLevel: 'high',
      cleanEnergySource: 'full',
      heatingFuel: 'solar',
      acUsage: 'none',
      ledBulbs: true,
      ecoLaundry: true,
      standbyOff: true,
      dietType: 'vegan',
      redMeatServings: 0,
      dairyServings: 1,
      localFoodRatio: 80,
      foodWasteLevel: 'none',
      shoppingLevel: 'minimal',
      onlineDeliveries: 2,
      fastFashionPurchases: 1,
      electronicsUpgrades: 'rare',
      secondhandRatio: 90,
      garbageBags: 1,
      wasteRecycling: ['paper', 'plastic', 'metal', 'organic'],
    });

    expect(result.confidence).toBe('high');
    // High renewable grid usage and vegetarian/vegan diet should lower emissions significantly per period compared to basic default
    expect(result.score).toBeGreaterThan(50);
  });

  it('correctly handles daily and household modifications', () => {
    const resultIndividual = calculateCarbonFootprint({
      mode: 'quick',
      period: 'daily',
      basis: 'individual',
      householdSize: 1,
      transportType: 'walk_bike',
      transportDistance: 0,
      energyLevel: 'low',
      cleanEnergySource: 'full',
      dietType: 'vegetarian',
      shoppingLevel: 'minimal',
      wasteRecycling: [],
    });

    const resultShared = calculateCarbonFootprint({
      mode: 'quick',
      period: 'daily',
      basis: 'individual',
      householdSize: 4, // 4 people, energy gets divided!
      transportType: 'walk_bike',
      transportDistance: 0,
      energyLevel: 'low',
      cleanEnergySource: 'full',
      dietType: 'vegetarian',
      shoppingLevel: 'minimal',
      wasteRecycling: [],
    });

    expect(resultShared.breakdown.energy).toBeLessThan(resultIndividual.breakdown.energy);
  });
});
