import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { ChatOpenAI } from "@langchain/openai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { loadMcpTools } from "@langchain/mcp-adapters";
import dotenv from "dotenv";
dotenv.config();

// Initialize the model
const model = new ChatOpenAI({
  temperature: 0.7,
  model: process.env.MODEL_NAME,
  configuration: {
    baseURL: process.env.BASE_URL, // Custom url
    apiKey: "feliz jueves",
  },
});

// Connecting to an example mcp server
const transport = new StdioClientTransport({
  command: "npx",
  args: [
    "-y",
    "@modelcontextprotocol/server-filesystem",
    "./files",
    //"/path/to/other/allowed/dir",
  ],
});

const client = new Client({
  name: "fsClient",
  version: "1.0.0",
});

try {
  await client.connect(transport);

  // Get tools with custom configuration
  const tools = await loadMcpTools("fs", client, {
    throwOnLoadError: true,
    prefixToolNameWithServerName: false,
    additionalToolNamePrefix: "",
  });
  console.log("Tools loaded:", tools.map((tool) => tool.name).join(", "));

  // Create and run the agent
  const agent = await createReactAgent({ llm: model, tools });
  console.log("Agent created:", agent.name);

  const agentResponse = await agent.invoke({
    //messages: [{ role: "user", content: "por favor cuenta los archivos que hay en la ruta y dime el top 10 canciones" }],
    messages: [{ role: "user", content: process.env.PROMPT }],
  });
  console.log("Agent response:");
  console.log(agentResponse);
} catch (e) {
  console.error(e);
} finally {
  // Clean up connection
  await client.close();
}
