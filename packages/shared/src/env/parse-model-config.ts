import {
  DEFAULT_MODEL_CONFIG_KEYS,
  type DEFAULT_MODEL_CONFIG_KEYS_LEGACY,
  INSIGHT_MODEL_CONFIG_KEYS,
  PLANNING_MODEL_CONFIG_KEYS,
} from './constants';
import {
  type IModelConfig,
  SQAI_MODEL_FAMILY,
  SQAI_OPENAI_HTTP_PROXY,
  SQAI_OPENAI_INIT_CONFIG_JSON,
  SQAI_OPENAI_SOCKS_PROXY,
  SQAI_USE_DOUBAO_VISION,
  SQAI_USE_GEMINI,
  SQAI_USE_QWEN3_VL,
  SQAI_USE_QWEN_VL,
  SQAI_USE_VLM_UI_TARS,
  MODEL_FAMILY_VALUES,
  OPENAI_API_KEY,
  OPENAI_BASE_URL,
  type TIntent,
  type TModelFamily,
  UITarsModelVersion,
} from './types';

import { getDebug } from '../logger';
import { assert } from '../utils';
import { maskConfig, parseJson } from './helper';
import { initDebugConfig } from './init-debug';

type TModelConfigKeys =
  | typeof INSIGHT_MODEL_CONFIG_KEYS
  | typeof PLANNING_MODEL_CONFIG_KEYS
  | typeof DEFAULT_MODEL_CONFIG_KEYS
  | typeof DEFAULT_MODEL_CONFIG_KEYS_LEGACY;

const KEYS_MAP: Record<TIntent, TModelConfigKeys> = {
  insight: INSIGHT_MODEL_CONFIG_KEYS,
  planning: PLANNING_MODEL_CONFIG_KEYS,
  default: DEFAULT_MODEL_CONFIG_KEYS,
} as const;

/**
 * Get UI-TARS model version from model family
 * @param modelFamily - The model family value
 * @returns UITarsModelVersion if the model family is a UI-TARS variant, undefined otherwise
 */
export const getUITarsModelVersion = (
  modelFamily?: TModelFamily,
): UITarsModelVersion | undefined => {
  // UI-TARS variants with version handling
  if (modelFamily === 'vlm-ui-tars') {
    return UITarsModelVersion.V1_0;
  }

  if (
    modelFamily === 'vlm-ui-tars-doubao' ||
    modelFamily === 'vlm-ui-tars-doubao-1.5'
  ) {
    return UITarsModelVersion.DOUBAO_1_5_20B;
  }

  return undefined;
};

/**
 * Validate model family value
 * @param modelFamily - The model family value to validate
 * @throws Error if the model family is invalid
 */
export const validateModelFamily = (modelFamily?: TModelFamily): void => {
  if (modelFamily && !MODEL_FAMILY_VALUES.includes(modelFamily as any)) {
    throw new Error(`Invalid SQAI_MODEL_FAMILY value: ${modelFamily}`);
  }
};

/**
 * Convert legacy environment variables to model family
 * @param provider - Environment variable provider (e.g., process.env)
 * @returns The corresponding model family value, or undefined if no legacy config is found
 */
export const legacyConfigToModelFamily = (
  provider: Record<string, string | undefined>,
): TModelFamily | undefined => {
  const isDoubao = provider[SQAI_USE_DOUBAO_VISION];
  const isQwen = provider[SQAI_USE_QWEN_VL];
  const isQwen3 = provider[SQAI_USE_QWEN3_VL];
  const isUiTars = provider[SQAI_USE_VLM_UI_TARS];
  const isGemini = provider[SQAI_USE_GEMINI];

  const enabledModes = [
    isDoubao && SQAI_USE_DOUBAO_VISION,
    isQwen && SQAI_USE_QWEN_VL,
    isQwen3 && SQAI_USE_QWEN3_VL,
    isUiTars && SQAI_USE_VLM_UI_TARS,
    isGemini && SQAI_USE_GEMINI,
  ].filter(Boolean);

  if (enabledModes.length > 1) {
    throw new Error(
      `Only one vision mode can be enabled at a time. Currently enabled modes: ${enabledModes.join(', ')}. Please disable all but one mode.`,
    );
  }

  // Simple modes that directly map to model family
  if (isQwen3) return 'qwen3-vl';
  if (isQwen) return 'qwen2.5-vl';
  if (isDoubao) return 'doubao-vision';
  if (isGemini) return 'gemini';

  // UI-TARS with version detection
  if (isUiTars) {
    if (isUiTars === '1') {
      return 'vlm-ui-tars';
    } else if (isUiTars === 'DOUBAO' || isUiTars === 'DOUBAO-1.5') {
      return 'vlm-ui-tars-doubao-1.5';
    } else {
      // Handle other UI-TARS versions
      return 'vlm-ui-tars-doubao';
    }
  }

  return undefined;
};

const getModelDescription = (
  modelFamily: TModelFamily | undefined,
  uiTarsModelVersion: UITarsModelVersion | undefined,
) => {
  if (uiTarsModelVersion) {
    return `UI-TARS=${uiTarsModelVersion}`;
  }
  if (modelFamily) {
    return `${modelFamily} mode`;
  }
  return '';
};

/**
 * Parse OpenAI SDK config
 */
export const parseOpenaiSdkConfig = ({
  keys,
  provider,
  useLegacyLogic = false,
}: {
  keys: TModelConfigKeys;
  provider: Record<string, string | undefined>;
  useLegacyLogic?: boolean;
}): IModelConfig => {
  initDebugConfig();
  const debugLog = getDebug('ai:config');

  debugLog('enter parseOpenaiSdkConfig with keys:', keys);

  const legacyAPIKey = useLegacyLogic ? provider[OPENAI_API_KEY] : undefined;
  const legacyBaseURL = useLegacyLogic ? provider[OPENAI_BASE_URL] : undefined;
  const legacySocksProxy = useLegacyLogic
    ? provider[SQAI_OPENAI_SOCKS_PROXY]
    : undefined;
  const legacyHttpProxy = useLegacyLogic
    ? provider[SQAI_OPENAI_HTTP_PROXY]
    : undefined;
  const legacyOpenaiExtraConfig = useLegacyLogic
    ? provider[SQAI_OPENAI_INIT_CONFIG_JSON]
    : undefined;
  const legacyModelFamily = useLegacyLogic
    ? legacyConfigToModelFamily(provider)
    : undefined;

  const modelFamilyRaw = provider[keys.modelFamily] || legacyModelFamily;
  const openaiApiKey: string | undefined =
    provider[keys.openaiApiKey] || legacyAPIKey;
  const openaiBaseURL: string | undefined =
    provider[keys.openaiBaseURL] || legacyBaseURL;
  const socksProxy: string | undefined =
    provider[keys.socksProxy] || legacySocksProxy;
  const httpProxy: string | undefined =
    provider[keys.httpProxy] || legacyHttpProxy;
  const modelName: string | undefined = provider[keys.modelName];
  const openaiExtraConfigStr: string | undefined =
    provider[keys.openaiExtraConfig];
  const openaiExtraConfig = parseJson(
    keys.openaiExtraConfig,
    openaiExtraConfigStr || legacyOpenaiExtraConfig,
  );
  const temperature = provider[keys.temperature]
    ? Number(provider[keys.temperature])
    : 0;

  const modelFamily = modelFamilyRaw as unknown as TModelFamily;
  validateModelFamily(modelFamily);
  const uiTarsModelVersion = getUITarsModelVersion(modelFamily);

  const modelDescription = getModelDescription(modelFamily, uiTarsModelVersion);

  return {
    socksProxy,
    httpProxy,
    openaiBaseURL,
    openaiApiKey,
    openaiExtraConfig,
    modelFamily,
    uiTarsModelVersion,
    modelName: modelName!,
    modelDescription,
    intent: '-' as any,
    timeout: provider[keys.timeout]
      ? Number(provider[keys.timeout])
      : undefined,
    temperature,
    retryCount: (() => {
      if (!provider[keys.retryCount]) return 1;
      const val = Number(provider[keys.retryCount]);
      if (!Number.isFinite(val)) return 1;
      if (val < 0)
        throw new Error(`${keys.retryCount} must be non-negative, got ${val}`);
      return val;
    })(),
    retryInterval: (() => {
      if (!provider[keys.retryInterval]) return 2000;
      const val = Number(provider[keys.retryInterval]);
      if (!Number.isFinite(val)) return 2000;
      if (val < 0)
        throw new Error(
          `${keys.retryInterval} must be non-negative, got ${val}`,
        );
      return val;
    })(),
  };
};

export const decideModelConfigFromIntentConfig = (
  intent: TIntent,
  configMap: Record<string, string | undefined>,
): IModelConfig | undefined => {
  const debugLog = getDebug('ai:config');

  debugLog(
    'will decideModelConfig base on agent.modelConfig()',
    intent,
    maskConfig(configMap),
  );

  const keysForFn = KEYS_MAP[intent];
  const modelName = configMap[keysForFn.modelName];

  if (!modelName) {
    debugLog('no modelName found for intent', intent);
    return undefined;
  }

  const finalResult = parseOpenaiSdkConfig({
    keys: keysForFn,
    provider: configMap,
    useLegacyLogic: intent === 'default',
  });
  finalResult.intent = intent;

  debugLog(
    'decideModelConfig result by agent.modelConfig() with intent',
    intent,
    maskConfig({ ...finalResult }),
  );

  assert(
    finalResult.openaiBaseURL,
    `failed to get base URL of model (intent=${intent}). See https://sqai.tech/model-strategy`,
  );

  if (!finalResult.modelName) {
    console.warn(
      `modelName is not set for intent ${intent}, this may cause unexpected behavior. See https://sqai.tech/model-strategy`,
    );
  }

  return finalResult;
};
