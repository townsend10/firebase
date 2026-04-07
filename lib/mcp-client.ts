// /**
//  * Cliente MCP para integração com Claude AI
//  * Este módulo fornece uma interface para comunicação com o servidor MCP local
//  */

// import { Client } from "@modelcontextprotocol/sdk/client/index.js";
// import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
// import { spawn } from "child_process";

// export type MCPTool =
//   | "get_user_info"
//   | "search_users"
//   | "list_appointments"
//   | "get_prescriptions"
//   | "get_medical_certificates"
//   | "list_documents";

// export interface MCPClientConfig {
//   serverPath?: string;
//   timeout?: number;
// }

// class MCPClient {
//   private client: Client | null = null;
//   private isConnected = false;

//   async connect(config: MCPClientConfig = {}) {
//     if (this.isConnected) {
//       return;
//     }

//     const serverPath = config.serverPath || "mcp-server/dist/index.js";

//     // Iniciar processo do servidor MCP
//     const serverProcess = spawn("node", [serverPath], {
//       stdio: ["pipe", "pipe", "pipe"],
//     });

//     const transport = new StdioClientTransport({
//       command: "node",
//       args: [serverPath],
//     });

//     this.client = new Client(
//       {
//         name: "firebase-nextjs-client",
//         version: "1.0.0",
//       },
//       {
//         capabilities: {},
//       },
//     );

//     await this.client.connect(transport);
//     this.isConnected = true;

//     console.log("Cliente MCP conectado com sucesso");
//   }

//   async disconnect() {
//     if (this.client && this.isConnected) {
//       await this.client.close();
//       this.isConnected = false;
//       this.client = null;
//     }
//   }

//   async callTool(name: MCPTool, args: Record<string, any>) {
//     if (!this.client || !this.isConnected) {
//       throw new Error(
//         "Cliente MCP não está conectado. Chame connect() primeiro.",
//       );
//     }

//     const response = await this.client.request(
//       {
//         method: "tools/call",
//         params: {
//           name,
//           arguments: args,
//         },
//       },
//       {},
//     );

//     return response;
//   }

//   async listTools() {
//     if (!this.client || !this.isConnected) {
//       throw new Error(
//         "Cliente MCP não está conectado. Chame connect() primeiro.",
//       );
//     }

//     const response = await this.client.request(
//       {
//         method: "tools/list",
//       },
//       {},
//     );

//     return response;
//   }

//   async readResource(uri: string) {
//     if (!this.client || !this.isConnected) {
//       throw new Error(
//         "Cliente MCP não está conectado. Chame connect() primeiro.",
//       );
//     }

//     const response = await this.client.request(
//       {
//         method: "resources/read",
//         params: {
//           uri,
//         },
//       },
//       {},
//     );

//     return response;
//   }

//   async listResources() {
//     if (!this.client || !this.isConnected) {
//       throw new Error(
//         "Cliente MCP não está conectado. Chame connect() primeiro.",
//       );
//     }

//     const response = await this.client.request(
//       {
//         method: "resources/list",
//       },
//       {},
//     );

//     return response;
//   }
// }

// // Singleton instance
// let mcpClientInstance: MCPClient | null = null;

// export function getMCPClient(): MCPClient {
//   if (!mcpClientInstance) {
//     mcpClientInstance = new MCPClient();
//   }
//   return mcpClientInstance;
// }

// export default MCPClient;
