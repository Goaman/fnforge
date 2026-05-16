/**
 * fnforge: A universal standard for functions.
 */

/**
 * The core definition of a forge function.
 * Every function must define its input (In) and output (Out) types.
 * Supports both unary and streaming (bidirectional) communication.
 */
export interface ForgeFunction<In = any, Out = any> {
  (input: In | AsyncIterable<In>): Promise<Out> | AsyncIterable<Out>;
}

/**
 * Metadata for a forge function.
 */
export interface ForgeMetadata {
  name: string;
  version: string;
  description?: string;
  inputSchema?: any; // e.g., JSON Schema or Zod
  outputSchema?: any;
}
