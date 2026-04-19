'use server';

import { z } from 'zod';
import { askGroqJson } from '@/lib/groq';

const AffordabilityAnalysisInputSchema = z.object({
  purchaseDescription: z.string(),
  purchaseCost: z.number(),
  annualIncome: z.number(),
  monthlyExpenses: z.number(),
  downPayment: z.number(),
  interestRate: z.number(),
  loanTerm: z.number(),
});
export type AffordabilityAnalysisInput = z.infer<typeof AffordabilityAnalysisInputSchema>;

export type AffordabilityAnalysisOutput = {
  summary: string;
  impactOnNetWorth: string;
  recommendation: string;
};

export async function analyzeAffordability(input: AffordabilityAnalysisInput): Promise<AffordabilityAnalysisOutput> {
  const systemPrompt = `You are a financial advisor helping users determine if they can afford a major purchase.
Analyze the information provided to determine the affordability of the purchase. Provide a summary of your analysis, the potential impact on the user's net worth, and a recommendation on whether to proceed with the purchase.
Be direct. Keep the summary, impact, and recommendation short and to the point.

Respond ONLY with a JSON object holding exactly these three string keys:
- summary
- impactOnNetWorth
- recommendation`;

  const userPrompt = `Purchase Description: ${input.purchaseDescription}
Purchase Cost: ${input.purchaseCost}
Annual Income: ${input.annualIncome}
Monthly Expenses: ${input.monthlyExpenses}
Down Payment: ${input.downPayment}
Interest Rate: ${input.interestRate}
Loan Term (months): ${input.loanTerm}`;

  return await askGroqJson<AffordabilityAnalysisOutput>(systemPrompt, userPrompt);
}
