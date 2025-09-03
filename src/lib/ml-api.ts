/**
 * FiSight ML API Client
 * Production-ready client for communicating with ML backend
 */

// API Configuration
const ML_API_BASE_URL = process.env.NEXT_PUBLIC_ML_API_URL || 'http://localhost:8000';

// Type definitions for API requests and responses
export interface FinancialProfile {
  age: number;
  income: number;
  expenses: number;
  savings: number;
  debt: number;
  employment_years: number;
  credit_score: number;
  num_dependents: number;
  investment_amount?: number;
  property_value?: number;
}

export interface InvestmentRiskResponse {
  risk_score: number;
  risk_category: 'conservative' | 'moderate' | 'aggressive';
  confidence: number;
}

export interface AffordabilityResponse {
  affordability_amount: number;
  monthly_payment_capacity: number;
  confidence: number;
}

export interface FinancialHealthResponse {
  health_score: number;
  health_category: 'excellent' | 'good' | 'fair' | 'needs_improvement';
  recommendations: string[];
  confidence: number;
}

export interface ScenarioResponse {
  recommended_scenario: string;
  scenario_confidence: number;
  alternative_scenarios: string[];
  rationale: string;
}

export interface MLApiError {
  detail: string;
  status_code: number;
}

// Generic API call wrapper
async function apiCall<T>(endpoint: string, data?: any): Promise<T> {
  try {
    const url = `${ML_API_BASE_URL}${endpoint}`;
    
    const options: RequestInit = {
      method: data ? 'POST' : 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        detail: `HTTP ${response.status}: ${response.statusText}` 
      }));
      throw new Error(errorData.detail || `API call failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`ML API Error (${endpoint}):`, error);
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('Unknown API error occurred');
  }
}

// Health check endpoint
export async function checkMLServerHealth(): Promise<{ status: string; models_loaded: number }> {
  return apiCall('/health');
}

// Investment risk prediction
export async function predictInvestmentRisk(profile: FinancialProfile): Promise<InvestmentRiskResponse> {
  return apiCall('/predict/investment-risk', profile);
}

// Affordability analysis
export async function predictAffordability(profile: FinancialProfile): Promise<AffordabilityResponse> {
  return apiCall('/predict/affordability', profile);
}

// Financial health scoring
export async function predictFinancialHealth(profile: FinancialProfile): Promise<FinancialHealthResponse> {
  return apiCall('/predict/financial-health', profile);
}

// Scenario planning
export async function predictScenario(profile: FinancialProfile): Promise<ScenarioResponse> {
  return apiCall('/predict/scenario', profile);
}

// Comprehensive analysis - calls all endpoints
export async function getComprehensiveAnalysis(profile: FinancialProfile) {
  try {
    const [riskResult, affordabilityResult, healthResult, scenarioResult] = await Promise.allSettled([
      predictInvestmentRisk(profile),
      predictAffordability(profile),
      predictFinancialHealth(profile),
      predictScenario(profile)
    ]);

    return {
      investmentRisk: riskResult.status === 'fulfilled' ? riskResult.value : null,
      affordability: affordabilityResult.status === 'fulfilled' ? affordabilityResult.value : null,
      financialHealth: healthResult.status === 'fulfilled' ? healthResult.value : null,
      scenario: scenarioResult.status === 'fulfilled' ? scenarioResult.value : null,
      errors: {
        investmentRisk: riskResult.status === 'rejected' ? riskResult.reason.message : null,
        affordability: affordabilityResult.status === 'rejected' ? affordabilityResult.reason.message : null,
        financialHealth: healthResult.status === 'rejected' ? healthResult.reason.message : null,
        scenario: scenarioResult.status === 'rejected' ? scenarioResult.reason.message : null,
      }
    };
  } catch (error) {
    console.error('Comprehensive analysis error:', error);
    throw error;
  }
}

// Utility function to convert user profile to ML API format
export function convertUserProfileToMLFormat(userProfile: any): FinancialProfile {
  return {
    age: userProfile.age || 30,
    income: userProfile.annual_income || userProfile.income || 50000,
    expenses: userProfile.monthly_expenses || userProfile.expenses || 3000,
    savings: userProfile.savings || 10000,
    debt: userProfile.debt || 0,
    employment_years: userProfile.employment_years || 5,
    credit_score: userProfile.credit_score || 700,
    num_dependents: userProfile.dependents || userProfile.num_dependents || 0,
    investment_amount: userProfile.investment_amount || 0,
    property_value: userProfile.property_value || 0,
  };
}

// Development utilities
export const mlApi = {
  health: checkMLServerHealth,
  investmentRisk: predictInvestmentRisk,
  affordability: predictAffordability,
  financialHealth: predictFinancialHealth,
  scenario: predictScenario,
  comprehensive: getComprehensiveAnalysis,
  convertProfile: convertUserProfileToMLFormat,
};

export default mlApi;
