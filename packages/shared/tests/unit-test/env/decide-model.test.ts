import { describe, expect, it } from 'vitest';
import { decideModelConfigFromIntentConfig } from '../../../src/env/parse-model-config';

const baseConfig = {
  SQAI_MODEL_NAME: 'default-model',
  SQAI_MODEL_BASE_URL: 'https://api.example.com',
  SQAI_MODEL_API_KEY: 'base-key',
  SQAI_INSIGHT_MODEL_NAME: 'insight-model',
  SQAI_INSIGHT_MODEL_BASE_URL: 'https://insight.example.com',
  SQAI_INSIGHT_MODEL_API_KEY: 'insight-key',
};

describe('decideModelConfigFromIntentConfig', () => {
  it('returns undefined when model name missing', () => {
    expect(decideModelConfigFromIntentConfig('insight', {})).toBeUndefined();
  });

  it('parses intent specific config', () => {
    const result = decideModelConfigFromIntentConfig('insight', baseConfig)!;
    expect(result.intent).toBe('insight');
    expect(result.modelName).toBe('insight-model');
    expect(result.openaiApiKey).toBe('insight-key');
    expect(result.openaiBaseURL).toBe('https://insight.example.com');
  });

  it('falls back to default config when intent specific config missing', () => {
    const result = decideModelConfigFromIntentConfig('planning', baseConfig);
    expect(result).toBeUndefined();
  });
});


























































































































































