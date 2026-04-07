// import { useState, useCallback } from "react";
// import { MCPTool } from "@/lib/mcp-client";

// interface UseMCPOptions {
//   onSuccess?: (data: any) => void;
//   onError?: (error: Error) => void;
// }

// export function useMCP(options?: UseMCPOptions) {
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<Error | null>(null);
//   const [data, setData] = useState<any>(null);

//   const callTool = useCallback(
//     async (toolName: MCPTool, args: Record<string, any>) => {
//       setIsLoading(true);
//       setError(null);

//       try {
//         const response = await fetch("/api/mcp", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             action: "call_tool",
//             toolName,
//             args,
//           }),
//         });

//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(errorData.error || "Erro ao chamar ferramenta MCP");
//         }

//         const result = await response.json();
//         setData(result.data);

//         if (options?.onSuccess) {
//           options.onSuccess(result.data);
//         }

//         return result.data;
//       } catch (err) {
//         const error = err instanceof Error ? err : new Error(String(err));
//         setError(error);

//         if (options?.onError) {
//           options.onError(error);
//         }

//         throw error;
//       } finally {
//         setIsLoading(false);
//       }
//     },
//     [options],
//   );

//   const readResource = useCallback(
//     async (resourceUri: string) => {
//       setIsLoading(true);
//       setError(null);

//       try {
//         const response = await fetch("/api/mcp", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             action: "read_resource",
//             resourceUri,
//           }),
//         });

//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(errorData.error || "Erro ao ler recurso MCP");
//         }

//         const result = await response.json();
//         setData(result.data);

//         if (options?.onSuccess) {
//           options.onSuccess(result.data);
//         }

//         return result.data;
//       } catch (err) {
//         const error = err instanceof Error ? err : new Error(String(err));
//         setError(error);

//         if (options?.onError) {
//           options.onError(error);
//         }

//         throw error;
//       } finally {
//         setIsLoading(false);
//       }
//     },
//     [options],
//   );

//   const listTools = useCallback(async () => {
//     setIsLoading(true);
//     setError(null);

//     try {
//       const response = await fetch("/api/mcp", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           action: "list_tools",
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || "Erro ao listar ferramentas MCP");
//       }

//       const result = await response.json();
//       setData(result.data);

//       if (options?.onSuccess) {
//         options.onSuccess(result.data);
//       }

//       return result.data;
//     } catch (err) {
//       const error = err instanceof Error ? err : new Error(String(err));
//       setError(error);

//       if (options?.onError) {
//         options.onError(error);
//       }

//       throw error;
//     } finally {
//       setIsLoading(false);
//     }
//   }, [options]);

//   const listResources = useCallback(async () => {
//     setIsLoading(true);
//     setError(null);

//     try {
//       const response = await fetch("/api/mcp", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           action: "list_resources",
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || "Erro ao listar recursos MCP");
//       }

//       const result = await response.json();
//       setData(result.data);

//       if (options?.onSuccess) {
//         options.onSuccess(result.data);
//       }

//       return result.data;
//     } catch (err) {
//       const error = err instanceof Error ? err : new Error(String(err));
//       setError(error);

//       if (options?.onError) {
//         options.onError(error);
//       }

//       throw error;
//     } finally {
//       setIsLoading(false);
//     }
//   }, [options]);

//   return {
//     isLoading,
//     error,
//     data,
//     callTool,
//     readResource,
//     listTools,
//     listResources,
//   };
// }
