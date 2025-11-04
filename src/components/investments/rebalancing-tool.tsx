"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { GetInvestmentRebalancingSuggestionsOutput } from "@/ai/flows/investment-rebalancing-suggestions";
import { mockPortfolio } from "@/lib/mock-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AIResponseCard } from "../shared/ai-response-card";
import { ragAPI } from "@/lib/rag-api";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Brain } from "lucide-react";

const formSchema = z.object({
  riskTolerance: z.string().min(1, "Please select a risk tolerance level."),
  investmentGoals: z.string().min(10, "Please describe your investment goals."),
});

export function RebalancingTool() {
  const [result, setResult] =
    useState<GetInvestmentRebalancingSuggestionsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [ragInsights, setRagInsights] = useState<string | null>(null);
  const [isLoadingRag, setIsLoadingRag] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      riskTolerance: "",
      investmentGoals: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setRagInsights(null);

    try {
      // Dynamic import to avoid SSR issues
      const { getInvestmentRebalancingSuggestions } = await import(
        "@/ai/flows/investment-rebalancing-suggestions"
      );
      const portfolioData = JSON.stringify(mockPortfolio);
      const response = await getInvestmentRebalancingSuggestions({
        ...values,
        portfolioData,
      });
      setResult(response);

      // Fetch RAG insights after rebalancing analysis
      await getRagInsights(values);
    } catch (e) {
      setError(e instanceof Error ? e : new Error("An unknown error occurred"));
    } finally {
      setIsLoading(false);
    }
  }

  const getRagInsights = async (values: z.infer<typeof formSchema>) => {
    setIsLoadingRag(true);
    try {
      const totalValue = mockPortfolio.reduce(
        (acc, p) => acc + p.currentValue,
        0
      );
      const portfolioSummary = mockPortfolio
        .map((p) => `${p.symbol}: $${p.currentValue.toLocaleString()}`)
        .join(", ");

      const query = `Portfolio rebalancing for ${
        values.riskTolerance
      } risk tolerance. 
                     Current portfolio: ${portfolioSummary} (Total: $${totalValue.toLocaleString()}). 
                     Investment goals: ${values.investmentGoals}. 
                     What are the most effective rebalancing strategies used by similar investors in the dataset? 
                     What asset allocations have worked best for these goals?`;

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
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">AI Rebalancing Advisor</CardTitle>
        <CardDescription>
          Get personalized suggestions to optimize your portfolio.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="riskTolerance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Risk Tolerance</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your risk level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Conservative">Conservative</SelectItem>
                      <SelectItem value="Moderate">Moderate</SelectItem>
                      <SelectItem value="Aggressive">Aggressive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="investmentGoals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Investment Goals</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Retirement in 20 years, buy a house in 5 years..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              <Sparkles className="mr-2 h-4 w-4" />
              {isLoading ? "Analyzing..." : "Get Suggestions"}
            </Button>
          </form>
        </Form>

        {(isLoading || error || result) && (
          <div className="mt-6 space-y-4">
            <AIResponseCard
              title="Rebalancing Suggestions"
              data={result}
              isLoading={isLoading}
              error={error}
              dataMap={[
                {
                  key: "summary",
                  label: "Portfolio Summary",
                  type: "string",
                  icon: "summary",
                },
                {
                  key: "underperformingAssets",
                  label: "Underperforming Assets",
                  type: "list",
                  icon: "list",
                },
                {
                  key: "rebalancingSuggestions",
                  label: "Rebalancing Suggestions",
                  type: "string",
                  icon: "rationale",
                },
                {
                  key: "rationale",
                  label: "Rationale",
                  type: "string",
                  icon: "rationale",
                },
              ]}
            />

            {/* RAG Rebalancing Insights */}
            {(ragInsights || isLoadingRag) && (
              <div className="space-y-3 border-t pt-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Brain className="w-4 h-4 text-orange-600" />
                  Historical Rebalancing Patterns
                </h4>
                {isLoadingRag ? (
                  <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-orange-600 animate-pulse" />
                      <p className="text-sm text-muted-foreground">
                        Analyzing successful rebalancing strategies from
                        dataset...
                      </p>
                    </div>
                  </div>
                ) : ragInsights ? (
                  <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg space-y-2">
                    <p className="text-sm whitespace-pre-line">{ragInsights}</p>
                    <Badge variant="outline" className="text-xs">
                      <Brain className="w-3 h-3 mr-1" />
                      Strategy Benchmarks
                    </Badge>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
