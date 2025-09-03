// File: src/app/api/ai/investments/route.ts
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface InvestmentRequest {
  age: number;
  income: number;
  savings: number;
  debt: number;
  investment_amount: number;
  employment_years: number;
  credit_score: number;
  savings_rate?: number;
  debt_to_income?: number;
}

export async function POST(req: NextRequest) {
  try {
    // 1. Parse request body
    let requestBody: InvestmentRequest;
    try {
      requestBody = await req.json();
    } catch (parseError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    // 2. Validate required fields
    const requiredFields = ['age', 'income', 'savings', 'debt', 'investment_amount', 'employment_years', 'credit_score'];
    const missingFields = requiredFields.filter(field => !(field in requestBody) || requestBody[field as keyof InvestmentRequest] == null);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // 3. Get FastAPI URL
    const fastApiUrl = process.env.FASTAPI_URL || "http://localhost:8000";

    // 4. Forward request to FastAPI
    try {
      console.log("📊 Forwarding investment prediction to FastAPI...");
      
      const response = await fetch(`${fastApiUrl}/predict/investments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
        console.error(`FastAPI returned ${response.status}:`, errorData);
        
        if (response.status === 500) {
          return NextResponse.json(
            { error: "ML model not available", details: errorData.detail || "Investment risk model may not be trained yet. Please run ml/train_model.py first." },
            { status: 500 }
          );
        }
        
        return NextResponse.json(
          { error: "ML prediction failed", details: errorData.detail },
          { status: response.status }
        );
      }

      const mlResult = await response.json();
      console.log("✅ Investment prediction successful");
      
      return NextResponse.json(mlResult, { status: 200 });

    } catch (fetchError: any) {
      console.error("❌ FastAPI connection failed:", fetchError);
      return NextResponse.json(
        { error: "ML service unavailable", details: "FastAPI server is not running. Start it with: cd ml && python inference_server.py" },
        { status: 502 }
      );
    }

  } catch (unexpectedError: any) {
    console.error("❌ Unexpected error in investments endpoint:", unexpectedError);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
