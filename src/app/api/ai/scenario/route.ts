// File: src/app/api/ai/scenario/route.ts
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ScenarioRequest {
  age: number;
  income: number;
  savings: number;
  debt: number;
  credit_score: number;
  savings_rate?: number;
  debt_to_income?: number;
  financial_health_score?: number;
}

export async function POST(req: NextRequest) {
  try {
    // 1. Parse request body
    let requestBody: ScenarioRequest;
    try {
      requestBody = await req.json();
    } catch (parseError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    // 2. Validate required fields
    const requiredFields = ['age', 'income', 'savings', 'debt', 'credit_score'];
    const missingFields = requiredFields.filter(field => !(field in requestBody) || requestBody[field as keyof ScenarioRequest] == null);
    
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
      console.log("🔮 Forwarding scenario prediction to FastAPI...");
      
      const response = await fetch(`${fastApiUrl}/predict/scenario`, {
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
            { error: "ML model not available", details: errorData.detail || "Scenario planner model may not be trained yet. Please run ml/train_model.py first." },
            { status: 500 }
          );
        }
        
        return NextResponse.json(
          { error: "ML prediction failed", details: errorData.detail },
          { status: response.status }
        );
      }

      const mlResult = await response.json();
      console.log("✅ Scenario prediction successful");
      
      return NextResponse.json(mlResult, { status: 200 });

    } catch (fetchError: any) {
      console.error("❌ FastAPI connection failed:", fetchError);
      return NextResponse.json(
        { error: "ML service unavailable", details: "FastAPI server is not running. Start it with: cd ml && python inference_server.py" },
        { status: 502 }
      );
    }

  } catch (unexpectedError: any) {
    console.error("❌ Unexpected error in scenario endpoint:", unexpectedError);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
