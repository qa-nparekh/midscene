import {
  SQAI_INSIGHT_MODEL_API_KEY,
  SQAI_INSIGHT_MODEL_BASE_URL,
  SQAI_INSIGHT_MODEL_FAMILY,
  SQAI_INSIGHT_MODEL_HTTP_PROXY,
  SQAI_INSIGHT_MODEL_INIT_CONFIG_JSON,
  SQAI_INSIGHT_MODEL_NAME,
  SQAI_INSIGHT_MODEL_RETRY_COUNT,
  SQAI_INSIGHT_MODEL_RETRY_INTERVAL,
  SQAI_INSIGHT_MODEL_SOCKS_PROXY,
  SQAI_INSIGHT_MODEL_TEMPERATURE,
  SQAI_INSIGHT_MODEL_TIMEOUT,
  SQAI_MODEL_API_KEY,
  SQAI_MODEL_BASE_URL,
  SQAI_MODEL_FAMILY,
  SQAI_MODEL_HTTP_PROXY,
  SQAI_MODEL_INIT_CONFIG_JSON,
  SQAI_MODEL_NAME,
  SQAI_MODEL_RETRY_COUNT,
  SQAI_MODEL_RETRY_INTERVAL,
  SQAI_MODEL_SOCKS_PROXY,
  SQAI_MODEL_TEMPERATURE,
  SQAI_MODEL_TIMEOUT,
  SQAI_OPENAI_HTTP_PROXY,
  SQAI_OPENAI_INIT_CONFIG_JSON,
  SQAI_OPENAI_SOCKS_PROXY,
  SQAI_PLANNING_MODEL_API_KEY,
  SQAI_PLANNING_MODEL_BASE_URL,
  SQAI_PLANNING_MODEL_FAMILY,
  SQAI_PLANNING_MODEL_HTTP_PROXY,
  SQAI_PLANNING_MODEL_INIT_CONFIG_JSON,
  SQAI_PLANNING_MODEL_NAME,
  SQAI_PLANNING_MODEL_RETRY_COUNT,
  SQAI_PLANNING_MODEL_RETRY_INTERVAL,
  SQAI_PLANNING_MODEL_SOCKS_PROXY,
  SQAI_PLANNING_MODEL_TEMPERATURE,
  SQAI_PLANNING_MODEL_TIMEOUT,
  OPENAI_API_KEY,
  OPENAI_BASE_URL,
} from './types';

interface IModelConfigKeys {
  modelName: string;
  /**
   * proxy
   */
  socksProxy: string;
  httpProxy: string;
  /**
   * OpenAI
   */
  openaiBaseURL: string;
  openaiApiKey: string;
  openaiExtraConfig: string;
  /**
   * Extra
   */
  modelFamily: string;
  /**
   * Timeout
   */
  timeout: string;
  /**
   * Temperature
   */
  temperature: string;
  /**
   * Retry
   */
  retryCount: string;
  retryInterval: string;
}

export const INSIGHT_MODEL_CONFIG_KEYS: IModelConfigKeys = {
  modelName: SQAI_INSIGHT_MODEL_NAME,
  /**
   * proxy
   */
  socksProxy: SQAI_INSIGHT_MODEL_SOCKS_PROXY,
  httpProxy: SQAI_INSIGHT_MODEL_HTTP_PROXY,
  /**
   * OpenAI
   */
  openaiBaseURL: SQAI_INSIGHT_MODEL_BASE_URL,
  openaiApiKey: SQAI_INSIGHT_MODEL_API_KEY,
  openaiExtraConfig: SQAI_INSIGHT_MODEL_INIT_CONFIG_JSON,
  /**
   * Extra
   */
  modelFamily: SQAI_INSIGHT_MODEL_FAMILY,
  /**
   * Timeout
   */
  timeout: SQAI_INSIGHT_MODEL_TIMEOUT,
  /**
   * Temperature
   */
  temperature: SQAI_INSIGHT_MODEL_TEMPERATURE,
  /**
   * Retry
   */
  retryCount: SQAI_INSIGHT_MODEL_RETRY_COUNT,
  retryInterval: SQAI_INSIGHT_MODEL_RETRY_INTERVAL,
} as const;

export const PLANNING_MODEL_CONFIG_KEYS: IModelConfigKeys = {
  modelName: SQAI_PLANNING_MODEL_NAME,
  /**
   * proxy
   */
  socksProxy: SQAI_PLANNING_MODEL_SOCKS_PROXY,
  httpProxy: SQAI_PLANNING_MODEL_HTTP_PROXY,
  /**
   * OpenAI
   */
  openaiBaseURL: SQAI_PLANNING_MODEL_BASE_URL,
  openaiApiKey: SQAI_PLANNING_MODEL_API_KEY,
  openaiExtraConfig: SQAI_PLANNING_MODEL_INIT_CONFIG_JSON,
  /**
   * Extra
   */
  modelFamily: SQAI_PLANNING_MODEL_FAMILY,
  /**
   * Timeout
   */
  timeout: SQAI_PLANNING_MODEL_TIMEOUT,
  /**
   * Temperature
   */
  temperature: SQAI_PLANNING_MODEL_TEMPERATURE,
  /**
   * Retry
   */
  retryCount: SQAI_PLANNING_MODEL_RETRY_COUNT,
  retryInterval: SQAI_PLANNING_MODEL_RETRY_INTERVAL,
} as const;

// modelConfig return default
export const DEFAULT_MODEL_CONFIG_KEYS: IModelConfigKeys = {
  modelName: SQAI_MODEL_NAME,
  /**
   * proxy
   */
  socksProxy: SQAI_MODEL_SOCKS_PROXY,
  httpProxy: SQAI_MODEL_HTTP_PROXY,
  /**
   * OpenAI
   */
  openaiBaseURL: SQAI_MODEL_BASE_URL,
  openaiApiKey: SQAI_MODEL_API_KEY,
  openaiExtraConfig: SQAI_MODEL_INIT_CONFIG_JSON,
  /**
   * Extra
   */
  modelFamily: SQAI_MODEL_FAMILY,
  /**
   * Timeout
   */
  timeout: SQAI_MODEL_TIMEOUT,
  /**
   * Temperature
   */
  temperature: SQAI_MODEL_TEMPERATURE,
  /**
   * Retry
   */
  retryCount: SQAI_MODEL_RETRY_COUNT,
  retryInterval: SQAI_MODEL_RETRY_INTERVAL,
} as const;

// read from process.env
export const DEFAULT_MODEL_CONFIG_KEYS_LEGACY: IModelConfigKeys = {
  modelName: SQAI_MODEL_NAME,
  /**
   * proxy - Uses legacy SQAI_OPENAI_* variables for backward compatibility
   */
  socksProxy: SQAI_OPENAI_SOCKS_PROXY,
  httpProxy: SQAI_OPENAI_HTTP_PROXY,
  /**
   * Model API - Uses legacy OPENAI_* variables for backward compatibility
   */
  openaiBaseURL: OPENAI_BASE_URL,
  openaiApiKey: OPENAI_API_KEY,
  openaiExtraConfig: SQAI_OPENAI_INIT_CONFIG_JSON,
  /**
   * Extra
   */
  modelFamily: 'DEFAULT_MODEL_CONFIG_KEYS has no modelFamily key',
  /**
   * Timeout - use the new key for legacy mode too
   */
  timeout: SQAI_MODEL_TIMEOUT,
  /**
   * Temperature - use the new key for legacy mode too
   */
  temperature: SQAI_MODEL_TEMPERATURE,
  /**
   * Retry - use the new key for legacy mode too
   */
  retryCount: SQAI_MODEL_RETRY_COUNT,
  retryInterval: SQAI_MODEL_RETRY_INTERVAL,
} as const;
