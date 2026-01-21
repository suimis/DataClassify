import { openai } from '@ai-sdk/openai';
import { streamText, generateText, LanguageModel } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

// AI模型配置接口
interface AIModelConfig {
  provider: string;
  modelName: string;
  apiKey: string;
  baseUrl: string;
  maxTokens: number;
  temperature: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
}

// 默认配置
const defaultConfig: AIModelConfig = {
  provider: process.env.AI_MODEL_PROVIDER || 'deepseek',
  modelName: process.env.AI_MODEL_NAME || 'deepseek-chat',
  apiKey: process.env.AI_API_KEY || '',
  baseUrl: process.env.AI_BASE_URL || 'https://api.deepseek.com/v1',
  maxTokens: parseInt(process.env.AI_MAX_TOKENS || '4000'),
  temperature: parseFloat(process.env.AI_TEMPERATURE || '0.7'),
  topP: parseFloat(process.env.AI_TOP_P || '0.9'),
  frequencyPenalty: parseFloat(process.env.AI_FREQUENCY_PENALTY || '0'),
  presencePenalty: parseFloat(process.env.AI_PRESENCE_PENALTY || '0'),
};

// 创建模型实例
function createModel(config: AIModelConfig): LanguageModel {
  if (config.provider === 'deepseek') {
    // 使用OpenAI兼容接口连接DeepSeek
    const deepseek = createOpenAI({
      apiKey: config.apiKey,
      baseURL: config.baseUrl,
    });

    return deepseek(config.modelName) as LanguageModel;
  } else if (config.provider === 'openai') {
    // 使用OpenAI
    return openai(config.modelName) as LanguageModel;
  } else {
    throw new Error(`Unsupported provider: ${config.provider}`);
  }
}

// 聊天消息接口
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// AI服务类
export class AIService {
  private config: AIModelConfig;

  constructor(config?: Partial<AIModelConfig>) {
    this.config = { ...defaultConfig, ...config };
  }

  // 流式生成文本
  async streamChat(
    messages: ChatMessage[],
    options?: {
      temperature?: number;
      maxTokens?: number;
      systemPrompt?: string;
    },
  ) {
    const model = createModel(this.config);

    // 添加系统提示
    const systemMessage: ChatMessage = {
      role: 'system',
      content:
        options?.systemPrompt ||
        `你是一个专业的AI数据治理助手。你的任务是帮助用户进行数据分析、分类和治理工作。请用中文回答，提供专业、准确、有用的建议。`,
    };

    const allMessages = [systemMessage, ...messages];

    try {
      const result = await streamText({
        model,
        messages: allMessages,
        temperature: options?.temperature ?? this.config.temperature,
      });

      return result;
    } catch (error) {
      console.error('AI服务错误:', error);
      throw new Error('AI服务暂时不可用，请稍后再试');
    }
  }

  // 生成文本（非流式）
  async generateChat(
    messages: ChatMessage[],
    options?: {
      temperature?: number;
      maxTokens?: number;
      systemPrompt?: string;
    },
  ) {
    const model = createModel(this.config);

    // 添加系统提示
    const systemMessage: ChatMessage = {
      role: 'system',
      content:
        options?.systemPrompt ||
        `你是一个专业的AI数据治理助手。你的任务是帮助用户进行数据分析、分类和治理工作。请用中文回答，提供专业、准确、有用的建议。`,
    };

    const allMessages = [systemMessage, ...messages];

    try {
      const result = await generateText({
        model,
        messages: allMessages,
        temperature: options?.temperature ?? this.config.temperature,
      });

      return result;
    } catch (error) {
      console.error('AI服务错误:', error);
      throw new Error('AI服务暂时不可用，请稍后再试');
    }
  }

  // 更新配置
  updateConfig(newConfig: Partial<AIModelConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  // 获取当前配置
  getConfig(): AIModelConfig {
    return { ...this.config };
  }

  // 验证配置
  validateConfig(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.config.apiKey) {
      errors.push('API密钥不能为空');
    }
    if (!this.config.modelName) {
      errors.push('模型名称不能为空');
    }
    if (!this.config.baseUrl) {
      errors.push('API基础URL不能为空');
    }
    if (this.config.temperature < 0 || this.config.temperature > 2) {
      errors.push('温度值必须在0-2之间');
    }
    if (this.config.maxTokens < 1 || this.config.maxTokens > 8000) {
      errors.push('最大令牌数必须在1-8000之间');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

// 创建默认AI服务实例
export const aiService = new AIService();

// 工具函数：转换聊天消息格式
export function formatChatMessages(
  messages: Array<{
    sender: 'user' | 'ai';
    content: string;
  }>,
): ChatMessage[] {
  return messages.map((msg) => ({
    role: msg.sender === 'user' ? 'user' : 'assistant',
    content: msg.content,
  }));
}
