'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useProfile } from '@/hooks/use-profile';
import { mlApi, type InvestmentRiskResponse } from '@/lib/ml-api';
import { 
  TrendingUp, 
  Shield, 
  Zap, 
  Target,
  BarChart3
} from 'lucide-react';

export function MLInvestmentRiskAnalyzer() {
  const [riskData, setRiskData] = useState<InvestmentRiskResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { profile } = useProfile();

  const analyzeRisk = async () => {
    if (!profile) {
      setError(new Error('Profile data not available'));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const mlProfile = mlApi.convertProfile(profile);
      const result = await mlApi.investmentRisk(mlProfile);
      setRiskData(result);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Failed to analyze risk tolerance'));
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskIcon = (category: string) => {
    switch (category) {
      case 'conservative': return Shield;
      case 'moderate': return Target;
      case 'aggressive': return Zap;
      default: return BarChart3;
    }
  };

  const getRiskColor = (category: string) => {
    switch (category) {
      case 'conservative': return 'text-green-600 bg-green-100 border-green-200';
      case 'moderate': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'aggressive': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-blue-600 bg-blue-100 border-blue-200';
    }
  };

  // Auto-analyze on component mount
  useEffect(() => {
    if (profile && !riskData && !isLoading) {
      analyzeRisk();
    }
  }, [profile]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-purple-600" />
          Investment Risk Analysis
        </CardTitle>
        <CardDescription>
          ML-powered assessment of your investment risk tolerance and preferences.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {riskData && !isLoading && !error && (
          <div className="space-y-4">
            {/* Risk Score Display */}
            <div className="text-center space-y-3">
              <div className="text-4xl font-bold text-slate-900 dark:text-white">
                {Math.round(riskData.risk_score)}
                <span className="text-lg text-muted-foreground">/100</span>
              </div>
              
              <div className="flex items-center justify-center gap-2">
                {(() => {
                  const Icon = getRiskIcon(riskData.risk_category);
                  return <Icon className="w-5 h-5" />;
                })()}
                <Badge className={getRiskColor(riskData.risk_category)}>
                  {riskData.risk_category.toUpperCase()} RISK
                </Badge>
              </div>
            </div>

            {/* Risk Score Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Risk Tolerance Score</span>
                <span>{Math.round(riskData.risk_score)}/100</span>
              </div>
              <Progress value={riskData.risk_score} className="h-3" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Conservative</span>
                <span>Moderate</span>
                <span>Aggressive</span>
              </div>
            </div>

            {/* Risk Category Details */}
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
              <h4 className="font-medium mb-2">Risk Profile Insights</h4>
              <div className="space-y-2 text-sm">
                {riskData.risk_category === 'conservative' && (
                  <div>
                    <p>• Preference for stable, low-risk investments</p>
                    <p>• Focus on capital preservation over growth</p>
                    <p>• Suitable for bonds, savings accounts, CDs</p>
                  </div>
                )}
                {riskData.risk_category === 'moderate' && (
                  <div>
                    <p>• Balanced approach to risk and return</p>
                    <p>• Mix of conservative and growth investments</p>
                    <p>• Suitable for diversified portfolios, mutual funds</p>
                  </div>
                )}
                {riskData.risk_category === 'aggressive' && (
                  <div>
                    <p>• High tolerance for volatility and risk</p>
                    <p>• Focus on maximum growth potential</p>
                    <p>• Suitable for stocks, growth funds, emerging markets</p>
                  </div>
                )}
              </div>
            </div>

            {/* Confidence Score */}
            <div className="bg-purple-50 dark:bg-purple-950/20 rounded-lg p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Analysis Confidence</span>
                <span className="font-medium text-purple-700 dark:text-purple-300">
                  {Math.round(riskData.confidence * 100)}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="text-sm text-muted-foreground mt-2">Analyzing risk profile...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center p-6 space-y-3">
            <BarChart3 className="w-12 h-12 text-red-500 mx-auto" />
            <div>
              <p className="font-medium text-red-600">Analysis Failed</p>
              <p className="text-sm text-muted-foreground">{error.message}</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!riskData && !isLoading && !error && (
          <div className="text-center text-muted-foreground p-8 space-y-3">
            <TrendingUp className="w-12 h-12 mx-auto opacity-50" />
            <div>
              <p className="font-medium">Investment Risk Analysis</p>
              <p className="text-sm">Discover your investment risk tolerance with ML analysis.</p>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="border-t px-6 py-4">
        <Button 
          onClick={analyzeRisk} 
          disabled={isLoading || !profile}
          className="w-full"
          variant="outline"
        >
          <BarChart3 className="mr-2 h-4 w-4" />
          {isLoading ? 'Analyzing...' : 'Analyze Risk Tolerance'}
        </Button>
      </CardFooter>
    </Card>
  );
}
