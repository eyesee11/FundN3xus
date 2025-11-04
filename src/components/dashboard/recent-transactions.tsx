"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockTransactions } from "@/lib/mock-data";
import { ragAPI } from "@/lib/rag-api";
import { cn } from "@/lib/utils";
import { Brain, Search, Sparkles } from "lucide-react";

export function RecentTransactions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [ragInsights, setRagInsights] = useState<string | null>(null);
  const [isLoadingRag, setIsLoadingRag] = useState(false);

  const handleSmartSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoadingRag(true);
    try {
      // Calculate transaction stats
      const totalExpenses = mockTransactions
        .filter((t) => t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      const totalIncome = mockTransactions
        .filter((t) => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);

      const query = `Transaction query: "${searchQuery}". 
                     Recent transactions context: Total expenses: $${totalExpenses.toFixed(
                       2
                     )}, Total income: $${totalIncome.toFixed(2)}. 
                     Transactions: ${mockTransactions
                       .map((t) => `${t.description}: $${t.amount}`)
                       .join(", ")}. 
                     ${searchQuery}. Provide insights from similar spending patterns in the dataset.`;

      const response = await ragAPI.query(query);
      setRagInsights(response.answer);
    } catch (e) {
      console.error("Failed to fetch RAG insights:", e);
      setRagInsights("Unable to fetch insights at this time.");
    } finally {
      setIsLoadingRag(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Recent Transactions</CardTitle>
        <CardDescription>
          A log of your recent financial activities with AI-powered insights.
        </CardDescription>

        {/* Smart Search Bar */}
        <div className="flex gap-2 mt-4">
          <Input
            placeholder="Ask about your transactions (e.g., 'show large purchases', 'recurring payments')"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSmartSearch()}
            className="flex-1"
          />
          <Button
            onClick={handleSmartSearch}
            disabled={isLoadingRag || !searchQuery.trim()}
            size="sm"
          >
            <Search className="w-4 h-4 mr-2" />
            Analyze
          </Button>
        </div>

        {/* RAG Insights */}
        {(ragInsights || isLoadingRag) && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg space-y-2">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-sm">Transaction Insights</span>
            </div>
            {isLoadingRag ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span>Analyzing spending patterns...</span>
              </div>
            ) : (
              <p className="text-sm whitespace-pre-line">{ragInsights}</p>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[330px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <div className="font-medium">{transaction.description}</div>
                    <div className="text-sm text-muted-foreground">
                      {transaction.date}
                    </div>
                  </TableCell>
                  <TableCell
                    className={cn(
                      "text-right font-semibold",
                      transaction.amount > 0
                        ? "text-green-600"
                        : "text-foreground"
                    )}
                  >
                    {transaction.amount > 0 ? "+" : ""}$
                    {Math.abs(transaction.amount).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
