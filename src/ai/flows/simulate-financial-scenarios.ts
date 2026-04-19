'use server';

import { z } from 'zod';
import { askGroqJson } from '@/lib/groq';

const SimulateFinancialScenarioInputSchema = z.object({
  scenarioDescription: z.string(),
  currentFinancialSituation: z.string(),
});
export type SimulateFinancialScenarioInput = z.infer<typeof SimulateFinancialScenarioInputSchema>;

export type SimulateFinancialScenarioOutput = {
  projectedNetWorthChange: string;
  riskAssessment: string;
  alternativeSuggestions: string;
};

export async function simulateFinancialScenario(input: SimulateFinancialScenarioInput): Promise<SimulateFinancialScenarioOutput> {
  const systemPrompt = `You are a financial advisor. The user will describe a financial scenario they are considering, along with their current financial situation. Your task is to:
1. Project how the scenario will impact the user's net worth over a specified time period.
2. Assess the risks associated with the scenario.
3. Suggest alternative actions or modifications to the scenario to improve the outcome.

Respond ONLY with a JSON object holding exactly these three string keys:
- projectedNetWorthChange
- riskAssessment
- alternativeSuggestions`;

  const userPrompt = `Current Financial Situation: ${input.currentFinancialSituation}
Scenario Description: ${input.scenarioDescription}`;

  return await askGroqJson<SimulateFinancialScenarioOutput>(systemPrompt, userPrompt);
}
