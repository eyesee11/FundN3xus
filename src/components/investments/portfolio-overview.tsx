"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockPortfolio } from "@/lib/mock-data";
import { ragAPI } from "@/lib/rag-api";
import { Brain, Sparkles, TrendingUp } from "lucide-react";

export function PortfolioOverview() {
  const totalValue = mockPortfolio.reduce(
    (acc, investment) => acc + investment.currentValue,
    0
  );
  const [ragInsights, setRagInsights] = useState<string | null>(null);
  const [isLoadingRag, setIsLoadingRag] = useState(false);

  const getPortfolioInsights = async () => {
    setIsLoadingRag(true);
    try {
      const portfolioSummary = mockPortfolio
        .map(
          (p) =>
            `${p.name} (${p.symbol}): ${
              p.quantity
            } shares, $${p.currentValue.toLocaleString()}`
        )
        .join("; ");

      const query = `Portfolio analysis: Total value $${totalValue.toLocaleString()}, Holdings: ${portfolioSummary}. 
                     How does this portfolio diversification compare to similar portfolios in the dataset? 
                     What are the recommended improvements for better risk-adjusted returns?`;

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
        <CardTitle className="font-headline flex items-center justify-between">
          <span>Your Holdings</span>
          <Button
            variant="outline"
            size="sm"
            onClick={getPortfolioInsights}
            disabled={isLoadingRag}
          >
            <Brain className="w-4 h-4 mr-2" />
            Get Insights
          </Button>
        </CardTitle>
        <CardDescription>
          An overview of your current investments with AI-powered analysis.
        </CardDescription>

        {/* RAG Portfolio Insights */}
        {(ragInsights || isLoadingRag) && (
          <div className="mt-4 p-4 bg-violet-50 dark:bg-violet-950/20 rounded-lg space-y-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-violet-600" />
              <span className="font-medium text-sm">
                Portfolio Optimization Insights
              </span>
            </div>
            {isLoadingRag ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span>Analyzing portfolio against 15,000 benchmarks...</span>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm whitespace-pre-line">{ragInsights}</p>
                <Badge variant="outline" className="text-xs">
                  <Brain className="w-3 h-3 mr-1" />
                  Diversification Analysis
                </Badge>
              </div>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset</TableHead>
              <TableHead>Symbol</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockPortfolio.map((investment) => (
              <TableRow key={investment.id}>
                <TableCell className="font-medium">{investment.name}</TableCell>
                <TableCell>{investment.symbol}</TableCell>
                <TableCell className="text-right">
                  {investment.quantity}
                </TableCell>
                <TableCell className="text-right">
                  $
                  {investment.currentValue.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="font-bold text-lg justify-end">
        Total Value: $
        {totalValue.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </CardFooter>
    </Card>
  );
}
