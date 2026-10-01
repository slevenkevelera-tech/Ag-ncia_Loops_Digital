import OpenAI from '@openai/sdk';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
 * Generate code using OpenAI GPT-4 Turbo
 * Recommended over deprecated Codex API
 */
export async function generateCode(options: CodeGenerationOptions): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: options.model || 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'user',
          content: options.prompt,
        },
      ],
      max_tokens: options.maxTokens || 2048,
      temperature: options.temperature || 0.7,
    });

    return response.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Error generating code:', error);
    throw error;
  }
}

/**
 * Stream code generation for real-time updates
 */
export async function* streamCodeGeneration(
  options: CodeGenerationOptions
): AsyncGenerator<string, void, unknown> {
  try {
    const stream = await openai.chat.completions.create({
      model: options.model || 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'user',
          content: options.prompt,
        },
      ],
      max_tokens: options.maxTokens || 2048,
      temperature: options.temperature || 0.7,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        yield content;
      }
    }
  } catch (error) {
    console.error('Error streaming code generation:', error);
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
