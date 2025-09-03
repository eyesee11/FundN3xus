// File: src/lib/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI with API key validation
const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  throw new Error("GEMINI_API_KEY is missing from environment variables. Please add it to .env.local");
}

let genAI: GoogleGenerativeAI;
let model: any;

try {
  genAI = new GoogleGenerativeAI(API_KEY);
  model = genAI.getGenerativeModel({ model: "gemini-pro" });
} catch (error) {
  console.error("Failed to initialize Gemini AI:", error);
  throw new Error("Failed to initialize Gemini AI service");
}

/**
 * Ask Gemini AI for financial advice with optional context
 * @param prompt - User's question or prompt
 * @param context - Optional context from ML models or user data
 * @returns Promise<string> - AI generated response
 */
export async function askGemini(prompt: string, context?: string): Promise<string> {
  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    throw new Error("Prompt is required and must be a non-empty string");
  }

  try {
    // Construct the system prompt for FiSight financial advisor
    const systemPrompt = `You are FiSight AI - an expert financial advisor and personal finance assistant.

Your role:
- Provide helpful, accurate financial guidance based on the user's situation
- Be concise but thorough in your explanations (aim for 200-400 words)
- Ask clarifying questions when you need more information
- Always prioritize the user's financial wellbeing and long-term success
- Recommend consulting professionals for complex legal/tax matters
- Use the provided ML context to give personalized advice

Guidelines:
- Use simple, accessible language that anyone can understand
- Provide actionable advice with specific steps when possible
- Include relevant warnings about financial risks
- Be encouraging but realistic about financial goals
- Reference the ML analysis when provided to support your recommendations

Context: This is a conversation within the FiSight financial planning app where users can get personalized AI-powered financial advice.`;

    // Combine system prompt, context, and user prompt
    const fullPrompt = [
      systemPrompt,
      context ? `\nML Analysis Context:\n${context}` : "",
      `\nUser Question: ${prompt.trim()}`
    ].filter(Boolean).join("\n\n");

    console.log("🤖 Sending request to Gemini AI...");
    
    // Make the request to Gemini
    const result = await model.generateContent(fullPrompt);
    
    // Extract response text with multiple fallback methods
    let responseText: string;
    
    if (typeof result?.response?.text === "function") {
      responseText = result.response.text();
    } else if (result?.response?.text) {
      responseText = result.response.text;
    } else if (result?.candidates?.[0]?.content?.parts?.[0]?.text) {
      responseText = result.candidates[0].content.parts[0].text;
    } else if (result?.candidates?.[0]?.content) {
      responseText = result.candidates[0].content;
    } else if (result?.text) {
      responseText = result.text;
    } else {
      console.error("Unexpected Gemini response format:", result);
      throw new Error("Unable to extract response from Gemini API");
    }

    // Validate and clean response
    responseText = String(responseText).trim();
    
    if (!responseText || responseText.length === 0) {
      throw new Error("Gemini returned an empty response");
    }

    console.log("✅ Successfully received response from Gemini AI");
    return responseText;

  } catch (error: any) {
    console.error("❌ Gemini AI request failed:", error);
    
    // Handle specific Gemini API errors
    if (error.status === 400) {
      throw new Error("Invalid request to Gemini AI - the prompt may be inappropriate or too long");
    } else if (error.status === 401) {
      throw new Error("Gemini API authentication failed - check your API key");
    } else if (error.status === 429) {
      throw new Error("Gemini API rate limit exceeded - please try again later");
    } else if (error.status === 503) {
      throw new Error("Gemini AI service is temporarily unavailable");
    } else if (error.message) {
      throw new Error(`Gemini AI error: ${error.message}`);
    } else {
      throw new Error("Unknown error occurred while contacting Gemini AI");
    }
  }
}
