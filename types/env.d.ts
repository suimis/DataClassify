declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // AI模型配置
      AI_MODEL_PROVIDER: string;
      AI_MODEL_NAME: string;
      AI_API_KEY: string;
      AI_BASE_URL: string;
      AI_MAX_TOKENS: string;
      AI_TEMPERATURE: string;
      AI_TOP_P: string;
      AI_FREQUENCY_PENALTY: string;
      AI_PRESENCE_PENALTY: string;

      // 可选的备用模型配置
      OPENAI_API_KEY?: string;
      OPENAI_MODEL_NAME?: string;
      OPENAI_BASE_URL?: string;
    }
  }
}

export {};
