/**
 * Codex Service - Code Generation & Analysis
 * Note: OpenAI Codex is deprecated. Using GPT-4 Turbo via standard API.
 * For streaming in production, use WebSocket endpoints from server.ts
 */

export interface CodeGenerationOptions {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
  model?: string;
}

export interface CodeExplanationOptions {
  code: string;
  language?: string;
}

/**
 * Generate code using OpenAI (GPT-4 Turbo replacement for deprecated Codex)
 * Note: Actual implementation is handled by server.ts WebSocket for streaming
 */
export async function generateCode(options: CodeGenerationOptions): Promise<string> {
  try {
    // This is a client-side function that would typically call a server endpoint
    // The actual streaming implementation is handled via WebSocket at /codex-stream
    const response = await fetch('/api/codex/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(options),
    });

    if (!response.ok) {
      throw new Error(`Code generation failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.content || '';
  } catch (error) {
    console.error('Error generating code:', error);
    throw error;
  }
}

/**
 * Stream code generation for real-time updates (via WebSocket)
 */
export async function* streamCodeGeneration(
  options: CodeGenerationOptions
): AsyncGenerator<string, void, unknown> {
  try {
    // Server-side streaming implementation in server.ts
    // This generator is consumed by the WebSocket handler
    const { prompt, maxTokens = 2048, temperature = 0.7, model = 'gpt-4-turbo-preview' } = options;

    // Placeholder: actual streaming occurs on server via /codex-stream WebSocket
    yield `// Generated with ${model}\n`;
    yield `// Prompt: ${prompt.substring(0, 50)}...\n`;
    yield 'function generatedCode() {\n';
    yield '  // Implementation would stream here\n';
    yield '}';
  } catch (error) {
    console.error('Error in code generation stream:', error);
    throw error;
  }
}

/**
 * Explain existing code
 */
export async function explainCode(options: CodeExplanationOptions): Promise<string> {
  const prompt = `Explain this ${options.language || 'code'} in detail:\n\n${options.code}`;

  return generateCode({
    prompt,
    maxTokens: 2048,
    temperature: 0.5,
  });
}

/**
 * Stream code explanation for real-time updates
 */
export async function* streamExplainCode(
  options: CodeExplanationOptions
): AsyncGenerator<string, void, unknown> {
  const prompt = `Explain this ${options.language || 'code'} in detail:\n\n${options.code}`;

  yield* streamCodeGeneration({
    prompt,
    maxTokens: 2048,
    temperature: 0.5,
  });
}

/**
 * Optimize code for performance
 */
export async function optimizeCode(options: CodeExplanationOptions): Promise<string> {
  const prompt = `Optimize this ${options.language || 'code'} for performance and readability:\n\n${options.code}`;

  return generateCode({
    prompt,
    maxTokens: 2048,
    temperature: 0.7,
  });
}

/**
 * Stream code optimization for real-time updates
 */
export async function* streamOptimizeCode(
  options: CodeExplanationOptions
): AsyncGenerator<string, void, unknown> {
  const prompt = `Optimize this ${options.language || 'code'} for performance and readability:\n\n${options.code}`;

  yield* streamCodeGeneration({
    prompt,
    maxTokens: 2048,
    temperature: 0.7,
  });
}

/**
 * Debug code and suggest fixes
 */
export async function debugCode(code: string, error?: string): Promise<string> {
  const errorContext = error ? `\n\nError message: ${error}` : '';
  const prompt = `Debug this code and provide fixes:\n\n${code}${errorContext}`;

  return generateCode({
    prompt,
    maxTokens: 2048,
    temperature: 0.5,
  });
}

/**
 * Stream code debugging for real-time updates
 */
export async function* streamDebugCode(
  code: string,
  error?: string
): AsyncGenerator<string, void, unknown> {
  const errorContext = error ? `\n\nError message: ${error}` : '';
  const prompt = `Debug this code and provide fixes:\n\n${code}${errorContext}`;

  yield* streamCodeGeneration({
    prompt,
    maxTokens: 2048,
    temperature: 0.5,
  });
}
