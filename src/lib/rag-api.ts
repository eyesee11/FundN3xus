/**
 * RAG API Client for FundN3xus
 *
 * This utility provides easy access to the RAG API from your Next.js frontend.
 * Use this to integrate intelligent financial insights powered by your dataset.
 */

const RAG_API_URL =
  process.env.NEXT_PUBLIC_RAG_API_URL || "http://localhost:8001";

export interface QueryRequest {
  question: string;
  return_sources?: boolean;
  max_sources?: number;
}

export interface SourceDocument {
  content: string;
  metadata: {
    record_id: number;
    age: number;
    income: number;
    credit_score: number;
    financial_health_score: number;
    scenario_category: string;
    debt_to_income: number;
    savings_rate: number;
  };
  relevance_score?: number;
}

export interface QueryResponse {
  answer: string;
  sources: SourceDocument[];
  query: string;
}

export interface SearchRequest {
  query: string;
  k?: number;
  filters?: Record<string, any>;
}

export interface SearchResult {
  content: string;
  metadata: Record<string, any>;
}

export interface StatsResponse {
  status: string;
  vector_db_path: string;
  embedding_model: string;
  total_documents: number | string;
  vector_store_initialized: boolean;
  llm_initialized: boolean;
  qa_chain_initialized: boolean;
}

/**
 * Query the RAG system with a natural language question
 */
export async function queryRAG(
  question: string,
  options: { returnSources?: boolean; maxSources?: number } = {}
): Promise<QueryResponse> {
  const response = await fetch(`${RAG_API_URL}/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question,
      return_sources: options.returnSources ?? true,
      max_sources: options.maxSources ?? 5,
    }),
  });

  if (!response.ok) {
    throw new Error(`RAG query failed: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Perform semantic search over financial profiles
 */
export async function semanticSearch(
  query: string,
  options: { k?: number; filters?: Record<string, any> } = {}
): Promise<SearchResult[]> {
  const response = await fetch(`${RAG_API_URL}/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      k: options.k ?? 5,
      filters: options.filters,
    }),
  });

  if (!response.ok) {
    throw new Error(`Semantic search failed: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Search by specific criteria
 */
export async function searchByCriteria(criteria: {
  minIncome?: number;
  maxAge?: number;
  minHealthScore?: number;
  scenario?: string;
  k?: number;
}): Promise<{
  query: string;
  filters: Record<string, any>;
  results: SearchResult[];
  count: number;
}> {
  const params = new URLSearchParams();

  if (criteria.minIncome !== undefined)
    params.append("min_income", criteria.minIncome.toString());
  if (criteria.maxAge !== undefined)
    params.append("max_age", criteria.maxAge.toString());
  if (criteria.minHealthScore !== undefined)
    params.append("min_health_score", criteria.minHealthScore.toString());
  if (criteria.scenario) params.append("scenario", criteria.scenario);
  if (criteria.k !== undefined) params.append("k", criteria.k.toString());

  const response = await fetch(
    `${RAG_API_URL}/search/by-criteria?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error(`Criteria search failed: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Get RAG pipeline statistics
 */
export async function getRAGStats(): Promise<StatsResponse> {
  const response = await fetch(`${RAG_API_URL}/stats`);

  if (!response.ok) {
    throw new Error(`Failed to get RAG stats: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Check if RAG service is healthy
 */
export async function checkRAGHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${RAG_API_URL}/health`);
    const data = await response.json();
    return data.status === "healthy" && data.rag_initialized;
  } catch (error) {
    console.error("RAG health check failed:", error);
    return false;
  }
}

/**
 * Rebuild the vector store (admin operation)
 */
export async function rebuildVectorStore(): Promise<{
  status: string;
  message: string;
}> {
  const response = await fetch(`${RAG_API_URL}/rebuild`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(`Vector store rebuild failed: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Get financial insights for a user profile using RAG
 */
export async function getFinancialInsights(profile: {
  age: number;
  income: number;
  savings: number;
  debt: number;
}): Promise<QueryResponse> {
  const question = `What financial insights and recommendations would you give to a ${profile.age}-year-old 
    with an annual income of $${profile.income}, savings of $${profile.savings}, and debt of $${profile.debt}? 
    Compare with similar profiles in the dataset and provide actionable advice.`;

  return queryRAG(question);
}

/**
 * Find similar financial profiles
 */
export async function findSimilarProfiles(profile: {
  age: number;
  income: number;
  creditScore?: number;
  scenario?: string;
}): Promise<SearchResult[]> {
  const query = `Financial profiles similar to a ${
    profile.age
  }-year-old with income $${profile.income}${
    profile.creditScore ? ` and credit score ${profile.creditScore}` : ""
  }`;

  const filters: Record<string, any> = {};

  // Age range: ±5 years
  // Note: Chroma filters work differently, this is a simplified example
  if (profile.scenario) {
    filters.scenario_category = profile.scenario;
  }

  return semanticSearch(query, { k: 10, filters });
}

/**
 * Get investment recommendations based on profile
 */
export async function getInvestmentRecommendations(profile: {
  age: number;
  income: number;
  riskTolerance: "conservative" | "moderate" | "aggressive";
}): Promise<QueryResponse> {
  const question = `What investment strategies and asset allocations would you recommend for a 
    ${profile.age}-year-old with $${profile.income} annual income and ${profile.riskTolerance} 
    risk tolerance? Show examples from similar profiles in the dataset.`;

  return queryRAG(question);
}

/**
 * Analyze financial health trends
 */
export async function analyzeFinancialTrends(criteria: {
  ageGroup?: string;
  incomeRange?: string;
  timeframe?: string;
}): Promise<QueryResponse> {
  let question = "What are the financial health trends";

  if (criteria.ageGroup) question += ` for ${criteria.ageGroup}`;
  if (criteria.incomeRange)
    question += ` in the ${criteria.incomeRange} income range`;
  if (criteria.timeframe) question += ` over ${criteria.timeframe}`;

  question += "? Provide statistics and insights from the dataset.";

  return queryRAG(question);
}

/**
 * Get debt management strategies
 */
export async function getDebtManagementStrategies(profile: {
  debt: number;
  income: number;
  debtToIncome: number;
}): Promise<QueryResponse> {
  const question = `What are effective debt management strategies for someone with $${
    profile.debt
  } 
    in debt, $${profile.income} annual income, and a debt-to-income ratio of ${(
    profile.debtToIncome * 100
  ).toFixed(1)}%? 
    Show successful examples from the dataset.`;

  return queryRAG(question);
}

/**
 * Compare user with dataset benchmarks
 */
export async function compareWithBenchmarks(profile: {
  age: number;
  income: number;
  savingsRate: number;
  debtToIncome: number;
  financialHealthScore: number;
}): Promise<QueryResponse> {
  const question = `How does a ${profile.age}-year-old with ${(
    profile.savingsRate * 100
  ).toFixed(1)}% 
    savings rate, ${(profile.debtToIncome * 100).toFixed(
      1
    )}% debt-to-income ratio, and financial health 
    score of ${profile.financialHealthScore.toFixed(
      1
    )} compare to others in the dataset? 
    Provide percentile rankings and actionable improvements.`;

  return queryRAG(question);
}

// Export all functions
export const ragAPI = {
  query: queryRAG,
  search: semanticSearch,
  searchByCriteria,
  getStats: getRAGStats,
  checkHealth: checkRAGHealth,
  rebuild: rebuildVectorStore,

  // High-level helpers
  getFinancialInsights,
  findSimilarProfiles,
  getInvestmentRecommendations,
  analyzeFinancialTrends,
  getDebtManagementStrategies,
  compareWithBenchmarks,
};

export default ragAPI;
