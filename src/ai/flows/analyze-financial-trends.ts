'use server';

import { z } from 'zod';
import { askGroqJson } from '@/lib/groq';

const AnalyzeFinancialTrendsInputSchema = z.object({
  financialData: z.string(),
});
export type AnalyzeFinancialTrendsInput = z.infer<typeof AnalyzeFinancialTrendsInputSchema>;

export type AnalyzeFinancialTrendsOutput = {
  summary: string;
  insights: string[];
  recommendations: string[];
};

export async function analyzeFinancialTrends(input: AnalyzeFinancialTrendsInput): Promise<AnalyzeFinancialTrendsOutput> {
  const systemPrompt = `You are an expert financial analyst. Analyze financial data to identify trends, provide insights, and suggest recommendations.
Provide a concise summary of the key trends, specific insights into spending habits and financial health, and actionable recommendations.

Respond ONLY with a JSON object holding exactly these three keys:
- summary (string)
- insights (array of strings)
- recommendations (array of strings)

Be concise in your analysis.`;

  const userPrompt = `Financial Data: ${input.financialData}`;

  return await askGroqJson<AnalyzeFinancialTrendsOutput>(systemPrompt, userPrompt);
}
