// File: src/app/api/ai/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import { askGemini } from "@/lib/gemini";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// TypeScript interfaces
interface ChatRequest {
  prompt: string;
  userContext?: string;
}

interface MLPredictions {
  investment?: any;
  affordability?: any;
  score?: any;
  scenario?: any;
}

interface ChatResponse {
  answer: string;
  models: MLPredictions;
}

// Helper function to call FastAPI endpoints
async function callMLEndpoint(endpoint: string, data: any): Promise<any> {
  const fastApiUrl = process.env.FASTAPI_URL || "http://localhost:8000";
  
  try {
    const response = await fetch(`${fastApiUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.warn(`ML endpoint ${endpoint} returned ${response.status}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.warn(`ML endpoint ${endpoint} failed:`, error);
    return null;
  }
}

// Extract financial data from user context or use defaults
function extractFinancialData(userContext?: string) {
  // For demo purposes, use reasonable defaults
  // In production, this would parse user context or get from database
  return {
    age: 30,
    income: 75000,
    expenses: 50000,
    savings: 25000,
    debt: 15000,
    credit_score: 720,
    investment_amount: 10000,
    employment_years: 5,
    num_dependents: 0,
    property_value: 0
  };
}

export async function POST(req: NextRequest): Promise<NextResponse<ChatResponse | { error: string }>> {
  try {
    // 1. Validate environment variables
    if (!process.env.GEMINI_API_KEY) {
      console.error("❌ GEMINI_API_KEY is missing");
      return NextResponse.json(
        { error: "GEMINI_API_KEY missing" },
        { status: 500 }
      );
    }

    // 2. Parse and validate request body
    let requestBody: ChatRequest;
    try {
      requestBody = await req.json();
    } catch (parseError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const { prompt, userContext } = requestBody;

    // 3. Validate required fields
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: "Prompt is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    // 4. Extract financial data for ML predictions
    const financialData = extractFinancialData(userContext);

    // 5. Call ML endpoints to get predictions
    const mlPredictions: MLPredictions = {};

    console.log("📊 Fetching ML predictions...");

    // Get investment risk prediction
    mlPredictions.investment = await callMLEndpoint('/predict/investments', {
      age: financialData.age,
      income: financialData.income,
      savings: financialData.savings,
      debt: financialData.debt,
      investment_amount: financialData.investment_amount,
      employment_years: financialData.employment_years,
      credit_score: financialData.credit_score
    });

    // Get affordability prediction
    mlPredictions.affordability = await callMLEndpoint('/predict/affordability', {
      age: financialData.age,
      income: financialData.income,
      expenses: financialData.expenses,
      savings: financialData.savings,
      debt: financialData.debt,
      credit_score: financialData.credit_score,
      num_dependents: financialData.num_dependents,
      property_value: financialData.property_value
    });

    // Get financial health score
    mlPredictions.score = await callMLEndpoint('/predict/score', {
      age: financialData.age,
      income: financialData.income,
      expenses: financialData.expenses,
      savings: financialData.savings,
      debt: financialData.debt,
      credit_score: financialData.credit_score,
      investment_amount: financialData.investment_amount
    });

    // Get scenario planning
    mlPredictions.scenario = await callMLEndpoint('/predict/scenario', {
      age: financialData.age,
      income: financialData.income,
      savings: financialData.savings,
      debt: financialData.debt,
      credit_score: financialData.credit_score
    });

    // 6. Build context string from ML predictions
    const mlContext = [];

    if (mlPredictions.score?.prediction) {
      mlContext.push(`Financial Health Score: ${Math.round(mlPredictions.score.prediction)}/100 (${mlPredictions.score.details?.health_level})`);
    }

    if (mlPredictions.investment?.prediction) {
      mlContext.push(`Investment Risk Score: ${Math.round(mlPredictions.investment.prediction)}/100 (${mlPredictions.investment.details?.risk_level})`);
    }

    if (mlPredictions.affordability?.prediction) {
      const affordable = Math.round(mlPredictions.affordability.prediction);
      mlContext.push(`Maximum Affordable Purchase: $${affordable.toLocaleString()}`);
    }

    if (mlPredictions.scenario?.prediction) {
      mlContext.push(`Recommended Financial Strategy: ${mlPredictions.scenario.prediction} approach`);
    }

    const contextString = mlContext.length > 0 
      ? `Based on the user's financial profile analysis:\n${mlContext.join('\n')}`
      : userContext || "";

    // 7. Get AI response from Gemini
    console.log("🤖 Getting AI response with ML context...");
    let aiResponse: string;

    try {
      aiResponse = await askGemini(prompt, contextString);
    } catch (geminiError: any) {
      console.error("❌ Gemini AI failed:", geminiError);

      // Check if FastAPI is down
      const fastApiUrl = process.env.FASTAPI_URL || "http://localhost:8000";
      try {
        await fetch(`${fastApiUrl}/health`, { method: 'GET' });
      } catch (fastApiError) {
        return NextResponse.json(
          { error: "AI services temporarily unavailable" },
          { status: 502 }
        );
      }

      return NextResponse.json(
        { error: geminiError.message || "AI request failed" },
        { status: 500 }
      );
    }

    // 8. Return successful response
    console.log("✅ Successfully generated AI response with ML integration");
    
    return NextResponse.json({
      answer: aiResponse,
      models: mlPredictions
    }, { status: 200 });

  } catch (unexpectedError: any) {
    console.error("❌ Unexpected error in chat endpoint:", unexpectedError);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
