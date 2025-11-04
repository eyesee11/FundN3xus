"use client";

import { useState, useEffect } from "react";
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
import { Progress } from "@/components/ui/progress";
import { AIResponseCard } from "../shared/ai-response-card";
import { useProfile } from "@/hooks/use-profile";
import { mlApi, type FinancialHealthResponse } from "@/lib/ml-api";
import { ragAPI } from "@/lib/rag-api";
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Activity,
  Target,
  DollarSign,
  Brain,
} from "lucide-react";

export function MLFinancialHealthSummary() {
  const [healthData, setHealthData] = useState<FinancialHealthResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [ragInsights, setRagInsights] = useState<string | null>(null);
  const [isLoadingRag, setIsLoadingRag] = useState(false);
  const { profile } = useProfile();

  const analyzeFinancialHealth = async () => {
    if (!profile) {
      setError(new Error("Profile data not available"));
      return;
    }

    setIsLoading(true);
    setError(null);
    setHealthData(null);
    setRagInsights(null);

    try {
      const mlProfile = mlApi.convertProfile(profile);
      const result = await mlApi.financialHealth(mlProfile);
      setHealthData(result);

      // Get RAG insights after ML analysis
      await getRagInsights(result);
    } catch (e) {
      setError(
        e instanceof Error ? e : new Error("Failed to analyze financial health")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getRagInsights = async (healthData: FinancialHealthResponse) => {
    if (!profile) return;

    setIsLoadingRag(true);
    try {
      // Calculate derived values from UserProfile
      const monthlyIncome = profile.annualIncome / 12;
      const monthlySavings = monthlyIncome - profile.monthlyExpenses;
      const savingsRate = monthlySavings / monthlyIncome;

      // Estimate debt from liabilities string
      const debtMatch = profile.liabilities.match(/\$[\d,]+/g);
      const totalDebt = debtMatch
        ? debtMatch.reduce(
            (sum, val) => sum + parseFloat(val.replace(/[$,]/g, "")),
            0
          )
        : 0;
      const debtToIncome = totalDebt / profile.annualIncome;

      const response = await ragAPI.compareWithBenchmarks({
        age: 30, // Default age since not in profile
        income: profile.annualIncome,
        savingsRate: savingsRate,
        debtToIncome: debtToIncome,
        financialHealthScore: healthData.health_score,
      });
      setRagInsights(response.answer);
    } catch (e) {
      console.error("Failed to get RAG insights:", e);
      // Don't set error state, just fail silently for RAG insights
    } finally {
      setIsLoadingRag(false);
    }
  };

  const getHealthCategoryColor = (category: string) => {
    switch (category) {
      case "excellent":
        return "bg-green-500";
      case "good":
        return "bg-blue-500";
      case "fair":
        return "bg-yellow-500";
      case "needs_improvement":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getHealthCategoryIcon = (category: string) => {
    switch (category) {
      case "excellent":
        return CheckCircle;
      case "good":
        return TrendingUp;
      case "fair":
        return Activity;
      case "needs_improvement":
        return AlertTriangle;
      default:
        return Target;
    }
  };

  // Auto-analyze on component mount if profile is available
  useEffect(() => {
    if (profile && !healthData && !isLoading) {
      analyzeFinancialHealth();
    }
  }, [profile]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
          ML-Powered Financial Health
        </CardTitle>
        <CardDescription>
          Get AI-powered insights into your financial health using machine
          learning analysis.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Health Score Display */}
        {healthData && !isLoading && !error && (
          <div className="space-y-4">
            {/* Main Score */}
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-slate-900 dark:text-white">
                {Math.round(healthData.health_score)}
                <span className="text-lg text-muted-foreground">/100</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                {(() => {
                  const Icon = getHealthCategoryIcon(
                    healthData.health_category
                  );
                  return <Icon className="w-5 h-5" />;
                })()}
                <Badge
                  className={`${getHealthCategoryColor(
                    healthData.health_category
                  )} text-white`}
                >
                  {healthData.health_category.replace("_", " ").toUpperCase()}
                </Badge>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Financial Health Score</span>
                <span>{Math.round(healthData.health_score)}%</span>
              </div>
              <Progress value={healthData.health_score} className="h-3" />
            </div>

            {/* Confidence Score */}
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Prediction Confidence
                </span>
                <span className="font-medium">
                  {Math.round(healthData.confidence * 100)}%
                </span>
              </div>
            </div>

            {/* Recommendations */}
            {healthData.recommendations.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-600" />
                  Personalized Recommendations
                </h4>
                <div className="space-y-2">
                  {healthData.recommendations.map((rec, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg"
                    >
                      <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* RAG Insights */}
            {(ragInsights || isLoadingRag) && (
              <div className="space-y-3 border-t pt-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Brain className="w-4 h-4 text-purple-600" />
                  Dataset Benchmarks & Insights
                </h4>
                {isLoadingRag ? (
                  <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
                      <p className="text-sm text-muted-foreground">
                        Comparing with 15,000 financial profiles...
                      </p>
                    </div>
                  </div>
                ) : ragInsights ? (
                  <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg space-y-2">
                    <p className="text-sm whitespace-pre-line">{ragInsights}</p>
                    <Badge variant="outline" className="text-xs">
                      <Brain className="w-3 h-3 mr-1" />
                      RAG-Powered Insights
                    </Badge>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <AIResponseCard
            title="Analyzing Financial Health..."
            data={null}
            isLoading={true}
            error={null}
            dataMap={[
              {
                key: "health_score",
                label: "Health Score",
                type: "string",
                icon: "summary",
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

        {/* Error State */}
        {error && (
          <div className="text-center p-6 space-y-3">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
            <div>
              <p className="font-medium text-red-600">Analysis Failed</p>
              <p className="text-sm text-muted-foreground">{error.message}</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!healthData && !isLoading && !error && (
          <div className="text-center text-muted-foreground p-8 space-y-3">
            <DollarSign className="w-12 h-12 mx-auto opacity-50" />
            <div>
              <p className="font-medium">Ready for Analysis</p>
              <p className="text-sm">
                Click below to get your ML-powered financial health score.
              </p>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="border-t px-6 py-4">
        <div className="flex items-center justify-between w-full">
          <Button
            onClick={analyzeFinancialHealth}
            disabled={isLoading || !profile}
            className="flex-1"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            {isLoading ? "Analyzing..." : "Analyze Financial Health"}
          </Button>

          {healthData && (
            <Badge variant="outline" className="ml-2">
              ML Powered
            </Badge>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
