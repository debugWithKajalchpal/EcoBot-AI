export interface QuizAnswers {
  // Mode selection
  mode?: 'quick' | 'detailed';
  basis?: 'individual' | 'household';
  period?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  
  // Location
  city?: string;
  state?: string;
  country?: string;
  householdSize?: number;

  // Transit fields (Quick & Detailed)
  transportType: 'car_petrol' | 'car_diesel' | 'electric' | 'public_transit' | 'walk_bike';
  transportDistance: number; // km per calculation period
  flightsShort?: number; // count
  flightsMediumLong?: number; // count

  // Power fields
  energyLevel: 'low' | 'medium' | 'high'; // low, medium, high usage
  cleanEnergySource: 'none' | 'partial' | 'full'; // none, partial, full renewables
  heatingFuel?: 'electricity' | 'gas' | 'oil' | 'solar';
  acUsage?: 'none' | 'moderate' | 'heavy';
  ledBulbs?: boolean;
  ecoLaundry?: boolean;
  standbyOff?: boolean;

  // Diet fields
  dietType: 'vegan' | 'vegetarian' | 'low_meat' | 'heavy_meat';
  redMeatServings?: number; // per week or period
  dairyServings?: number; // per week or period
  foodWasteLevel?: 'none' | 'minimal' | 'average' | 'high';
  localFoodRatio?: number; // 0 to 100

  // Goods fields
  shoppingLevel: 'minimal' | 'average' | 'heavy';
  onlineDeliveries?: number; // per month
  fastFashionPurchases?: number; // per year
  electronicsUpgrades?: 'rare' | 'moderate' | 'frequent';
  secondhandRatio?: number; // 0 to 100

  // Waste fields
  wasteRecycling: string[]; // ['paper', 'plastic', 'glass', 'organic']
  garbageBags?: number; // bags per week
  recyclingPaper?: boolean;
  recyclingPlastic?: boolean;
  recyclingMetal?: boolean;
  recyclingOrganic?: boolean;
}

export interface MetricBreakdown {
  transport: number; // kg CO2e
  diet: number; // kg CO2e
  energy: number; // kg CO2e
  waste: number; // kg CO2e
  shopping: number; // kg CO2e
}

export interface DailyLog {
  id: string;
  date: string; // YYYY-MM-DD
  answers: QuizAnswers;
  breakdown: MetricBreakdown;
  total: number; // total kg CO2e
  score: number; // 0 - 100 performance score
}

export interface GeoProfileInput {
  name: string;
  tier: 'city' | 'state' | 'country' | 'world';
  gridPowerType: 'coal' | 'gas' | 'nuclear' | 'renewables' | 'mixed';
  transitInfrastructure: 'poor' | 'average' | 'excellent';
  wastePrograms: 'none' | 'basic' | 'advanced_composting';
  industrialActivity: 'low' | 'moderate' | 'high';
}

export interface GeoTrackerResult {
  name: string;
  tier: 'city' | 'state' | 'country' | 'world';
  rating: 'A' | 'B' | 'C' | 'D' | 'F';
  perCapitaEmissionsTonnes: number;
  totalEmissionsMillionTonnes: number;
  gridCleanlinessPercent: number;
  overallCarbonIndex: number; // 0-100 (lower is better, lighter footprint)
  summaryText: string;
  breakdown: {
    category: string;
    value: number; // metric tonnes per capita or relative proportions
    baselineAverage: number;
  }[];
  localActions: {
    title: string;
    description: string;
    impactRating: 'High' | 'Medium' | 'Low';
    difficulty: 'Easy' | 'Medium' | 'Hard';
    annualSavingsKg: number;
  }[];
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface UserProgress {
  level: number;
  xp: number;
  nextLevelXp: number;
  completedActions: string[];
  totalSavedCo2Kg: number;
}
