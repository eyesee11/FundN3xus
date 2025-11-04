/**
 * Test RAG API Connection
 * Run this with: node test-rag-connection.js
 *
 * Note: Requires Node.js 18+ for native fetch support
 * Or run with: node --experimental-fetch test-rag-connection.js
 */

const RAG_API_URL =
  process.env.NEXT_PUBLIC_RAG_API_URL || "http://localhost:8001";

// Polyfill fetch for older Node.js versions
if (typeof fetch === "undefined") {
  global.fetch = async (url, options = {}) => {
    const https = url.startsWith("https") ? require("https") : require("http");

    return new Promise((resolve, reject) => {
      const req = https.request(
        url,
        {
          method: options.method || "GET",
          headers: options.headers || {},
        },
        (res) => {
          let data = "";
          res.on("data", (chunk) => (data += chunk));
          res.on("end", () => {
            resolve({
              ok: res.statusCode >= 200 && res.statusCode < 300,
              status: res.statusCode,
              statusText: res.statusMessage,
              json: async () => JSON.parse(data),
              text: async () => data,
            });
          });
        }
      );

      req.on("error", reject);

      if (options.body) {
        req.write(options.body);
      }

      req.end();
    });
  };
}

async function testRAGConnection() {
  console.log("🔍 Testing RAG API Connection...\n");
  console.log(`API URL: ${RAG_API_URL}\n`);

  // Test 1: Health Check
  console.log("1️⃣ Testing Health Check...");
  try {
    const healthResponse = await fetch(`${RAG_API_URL}/health`);
    const healthData = await healthResponse.json();
    console.log("✅ Health Check:", JSON.stringify(healthData, null, 2));

    if (!healthData.rag_initialized) {
      console.log("⚠️  Warning: RAG pipeline not initialized");
      return;
    }
  } catch (error) {
    console.error("❌ Health Check Failed:", error.message);
    console.log("\n💡 Make sure the RAG server is running:");
    console.log("   cd ml");
    console.log("   python rag_server.py");
    return;
  }

  // Test 2: Get Stats
  console.log("\n2️⃣ Testing Stats Endpoint...");
  try {
    const statsResponse = await fetch(`${RAG_API_URL}/stats`);
    const statsData = await statsResponse.json();
    console.log("✅ Stats:", JSON.stringify(statsData, null, 2));
  } catch (error) {
    console.error("❌ Stats Failed:", error.message);
  }

  // Test 3: Simple Query
  console.log("\n3️⃣ Testing RAG Query...");
  try {
    const queryResponse = await fetch(`${RAG_API_URL}/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: "What is the average financial health score in the dataset?",
        return_sources: true,
        max_sources: 3,
      }),
    });

    if (!queryResponse.ok) {
      throw new Error(`Query failed: ${queryResponse.statusText}`);
    }

    const queryData = await queryResponse.json();
    console.log("✅ Query Response:");
    console.log("   Question:", queryData.query);
    console.log("   Answer:", queryData.answer.substring(0, 200) + "...");
    console.log("   Sources found:", queryData.sources.length);
  } catch (error) {
    console.error("❌ Query Failed:", error.message);
  }

  // Test 4: Semantic Search
  console.log("\n4️⃣ Testing Semantic Search...");
  try {
    const searchResponse = await fetch(`${RAG_API_URL}/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: "High income earners with good savings",
        k: 3,
      }),
    });

    const searchData = await searchResponse.json();
    console.log("✅ Search Results:", searchData.length, "profiles found");
    if (searchData.length > 0) {
      console.log("   Sample result:", {
        age: searchData[0].metadata.age,
        income: searchData[0].metadata.income,
        savings_rate: searchData[0].metadata.savings_rate,
      });
    }
  } catch (error) {
    console.error("❌ Search Failed:", error.message);
  }

  console.log("\n" + "=".repeat(60));
  console.log("✅ RAG API Connection Test Complete!");
  console.log("=".repeat(60));
  console.log("\n📝 Next Steps:");
  console.log("1. The RAG API is ready to use in your frontend");
  console.log("2. Import it in your components:");
  console.log('   import { ragAPI } from "@/lib/rag-api"');
  console.log("3. Use it to query financial insights:");
  console.log('   const result = await ragAPI.query("your question");');
}

// Run the test
testRAGConnection().catch(console.error);
