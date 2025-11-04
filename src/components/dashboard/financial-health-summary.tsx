"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { AnalyzeFinancialTrendsOutput } from "@/ai/flows/analyze-financial-trends";
import { mockTransactions } from "@/lib/mock-data";
import { ragAPI } from "@/lib/rag-api";
import { AIResponseCard } from "../shared/ai-response-card";
import { Sparkles, Brain } from "lucide-react";

export function FinancialHealthSummary() {
  const [analysis, setAnalysis] = useState<AnalyzeFinancialTrendsOutput | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [ragInsights, setRagInsights] = useState<string | null>(null);
  const [isLoadingRag, setIsLoadingRag] = useState(false);

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    setRagInsights(null);

    try {
      // Dynamic import to avoid SSR issues
      const { analyzeFinancialTrends } = await import(
        "@/ai/flows/analyze-financial-trends"
      );
      const financialData = JSON.stringify(mockTransactions);
      const result = await analyzeFinancialTrends({ financialData });
      setAnalysis(result);

      // Fetch RAG insights after AI analysis
      await getRagInsights();
    } catch (e) {
      setError(e instanceof Error ? e : new Error("An unknown error occurred"));
    } finally {
      setIsLoading(false);
    }
  };

  const getRagInsights = async () => {
    setIsLoadingRag(true);
    try {
      const totalSpending = mockTransactions
        .filter((t) => t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      const totalIncome = mockTransactions
        .filter((t) => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);

      const query = `Financial health analysis based on transactions. Total income: $${totalIncome.toFixed(
        2
      )}, 
                     Total expenses: $${totalSpending.toFixed(
                       2
                     )}, Savings rate: ${(
        ((totalIncome - totalSpending) / totalIncome) *
        100
      ).toFixed(1)}%. 
                     Recent spending categories: ${mockTransactions
                       .map((t) => t.description)
                       .slice(0, 5)
                       .join(", ")}. 
                     How does this financial behavior compare to similar profiles in the dataset? 
                     What are the key improvement opportunities?`;

      const response = await ragAPI.query(query);
      setRagInsights(response.answer);
    } catch (e) {
      console.error("Failed to fetch RAG insights:", e);
      setRagInsights(null);
    } finally {
      setIsLoadingRag(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-headline">
          AI Financial Health Check
        </CardTitle>
        <CardDescription>
          Get instant AI-powered insights into your spending habits and
          financial health.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {analysis && !isLoading && !error && (
          <div className="space-y-4">
            <AIResponseCard
              title="Analysis Results"
              data={analysis}
              isLoading={isLoading}
              error={error}
              dataMap={[
                {
                  key: "summary",
                  label: "Summary",
                  type: "string",
                  icon: "summary",
                },
                {
                  key: "insights",
                  label: "Key Insights",
                  type: "list",
                  icon: "list",
                },
                {
                  key: "recommendations",
                  label: "Recommendations",
                  type: "list",
                  icon: "list",
                },
              ]}
            />

            {/* RAG Comparative Insights */}
            {(ragInsights || isLoadingRag) && (
              <div className="space-y-3 border-t pt-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Brain className="w-4 h-4 text-teal-600" />
                  Comparative Financial Insights
                </h4>
                {isLoadingRag ? (
                  <div className="p-4 bg-teal-50 dark:bg-teal-950/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-teal-600 animate-pulse" />
                      <p className="text-sm text-muted-foreground">
                        Comparing with 15,000 financial profiles...
                      </p>
                    </div>
                  </div>
                ) : ragInsights ? (
                  <div className="p-4 bg-teal-50 dark:bg-teal-950/20 rounded-lg space-y-2">
                    <p className="text-sm whitespace-pre-line">{ragInsights}</p>
                    <Badge variant="outline" className="text-xs">
                      <Brain className="w-3 h-3 mr-1" />
                      Behavioral Benchmarks
                    </Badge>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        )}
        {!analysis && !isLoading && (
          <div className="text-center text-muted-foreground p-8">
            <p>Click the button below to analyze your financial trends.</p>
          </div>
        )}
        {isLoading && (
          <AIResponseCard
            title="Analyzing..."
            data={null}
            isLoading={true}
            error={null}
            dataMap={[
              {
                key: "summary",
                label: "Summary",
                type: "string",
                icon: "summary",
              },
              {
                key: "insights",
                label: "Key Insights",
                type: "list",
                icon: "list",
              },
              {
                key: "recommendations",
                label: "Recommendations",
                type: "list",
                icon: "list",
              },
            ]}
          />
        )}
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <Button onClick={handleAnalyze} disabled={isLoading}>
          <Sparkles className="mr-2 h-4 w-4" />
          {isLoading ? "Analyzing..." : "Analyze My Financial Health"}
        </Button>
      </CardFooter>
    </Card>
  );
}
