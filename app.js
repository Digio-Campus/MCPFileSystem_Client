import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { ChatOpenAI } from "@langchain/openai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { loadMcpTools } from "@langchain/mcp-adapters";

// Initialize the model
const model = new ChatOpenAI({
  temperature: 0.7,
  configuration: {
    baseURL: "http://localhost:1337/v1", // Custom url
  },
});

// Connecting to an example mcp server
const transport = new StdioClientTransport({
  command: "npx",
  args: ["-y", "@modelcontextprotocol/server-math"],
});

const client = new Client({
  name: "math-client",
  version: "1.0.0",
});

try {
  await client.connect(transport);

  // Get tools with custom configuration
  const tools = await loadMcpTools("math", client, {
    throwOnLoadError: true,
    prefixToolNameWithServerName: false,
    additionalToolNamePrefix: "",
  });

  // Create and run the agent
  const agent = createReactAgent({ llm: model, tools });
  const agentResponse = await agent.invoke({
    messages: [{ role: "user", content: "what's (3 + 5) x 12?" }],
  });
  console.log(agentResponse);
} catch (e) {
  console.error(e);
} finally {
  // Clean up connection
  await client.close();
}