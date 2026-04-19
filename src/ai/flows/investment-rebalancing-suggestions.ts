'use server';

import { z } from 'zod';
import { askGroqJson } from '@/lib/groq';

const GetInvestmentRebalancingSuggestionsInputSchema = z.object({
  portfolioData: z.string(),
  riskTolerance: z.string(),
  investmentGoals: z.string(),
});
export type GetInvestmentRebalancingSuggestionsInput = z.infer<typeof GetInvestmentRebalancingSuggestionsInputSchema>;

export type GetInvestmentRebalancingSuggestionsOutput = {
  summary: string;
  underperformingAssets: string[];
  rebalancingSuggestions: string;
  rationale: string;
};

export async function getInvestmentRebalancingSuggestions(input: GetInvestmentRebalancingSuggestionsInput): Promise<GetInvestmentRebalancingSuggestionsOutput> {
  const systemPrompt = `You are an expert financial advisor specializing in investment portfolio optimization.
You will analyze the user's current investment portfolio, risk tolerance, and investment goals to provide personalized rebalancing suggestions.

Based on this information, provide the following:
- A summary of the current portfolio performance and potential issues.
- A list of specific assets that are underperforming relative to the user's goals and risk tolerance.
- Specific, actionable suggestions for rebalancing the portfolio, including which assets to buy, sell, or hold, and in what quantities or proportions.
- A detailed explanation of the rationale behind the rebalancing suggestions, taking into account the user's risk tolerance, investment goals, and current market conditions.

Ensure that the rebalancing suggestions are aligned with the user's risk tolerance and investment goals.

Output should ONLY be in valid JSON format with EXACTLY these keys:
- summary (string)
- underperformingAssets (array of strings)
- rebalancingSuggestions (string)
- rationale (string)`;

  const userPrompt = `Current Portfolio Data: ${input.portfolioData}
Risk Tolerance: ${input.riskTolerance}
Investment Goals: ${input.investmentGoals}`;

  return await askGroqJson<GetInvestmentRebalancingSuggestionsOutput>(systemPrompt, userPrompt);
}

