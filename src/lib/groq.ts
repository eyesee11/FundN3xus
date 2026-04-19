// File: src/lib/groq.ts

/**
 * Ask Groq LLM for JSON response
 */
export async function askGroqJson<T>(systemPrompt: string, userPrompt: string): Promise<T> {
  const API_KEY = process.env.GROQ_API_KEY;
  if (!API_KEY) throw new Error("GROQ_API_KEY is missing from environment variables");

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt + "\\n\\nIMPORTANT: You must return valid JSON ONLY matching the requested structure." },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.1
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Groq API error: ${response.status} ${errorData?.error?.message || response.statusText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("Groq returned an empty response");
  
  return JSON.parse(content) as T;
}

/**
 * Ask Groq LLM for financial advice with optional context
 * @param prompt - User's question or prompt
 * @param context - Optional context from ML models or user data
 * @returns Promise<string> - AI generated response
 */
export async function askGroq(prompt: string, context?: string): Promise<string> {
  const API_KEY = process.env.GROQ_API_KEY;
  if (!API_KEY) {
    throw new Error("GROQ_API_KEY is missing from environment variables. Please add it to .env.local");
  }

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    throw new Error("Prompt is required and must be a non-empty string");
  }

  try {
    // Construct the system prompt for FundN3xus financial advisor
    const systemPrompt = `You are FundN3xus AI - an expert financial advisor and personal finance assistant.

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

Context: This is a conversation within the FundN3xus financial planning app where users can get personalized AI-powered financial advice.`;

    const fullPrompt = [
      systemPrompt,
      context ? `\nML Analysis Context:\n${context}` : "",
      `\nUser Question: ${prompt.trim()}`
    ].filter(Boolean).join("\n\n");

    console.log("🤖 Sending request to Groq API...");
    
    // Make the request to Groq REST API (OpenAI compatible)
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile", // Currently active Groq model
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: context ? `Context:\n${context}\n\nQuestion: ${prompt.trim()}` : prompt.trim() }
        ],
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Groq API error: ${response.status} ${errorData?.error?.message || response.statusText}`);
    }

    const data = await response.json();
    let responseText = data.choices?.[0]?.message?.content;

    // Validate and clean response
    responseText = String(responseText || "").trim();
    
    if (!responseText || responseText.length === 0) {
      throw new Error("Groq returned an empty response");
    }

    console.log("✅ Successfully received response from Groq AI");
    return responseText;

  } catch (error: any) {
    console.error("❌ Groq AI request failed:", error);
    throw error;
  }
}
