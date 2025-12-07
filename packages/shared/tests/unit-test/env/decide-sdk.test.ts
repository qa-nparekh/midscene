import { describe, expect, it } from 'vitest';
import {
  SQAI_ANTHROPIC_API_KEY,
  SQAI_AZURE_OPENAI_ENDPOINT,
  SQAI_AZURE_OPENAI_KEY,
  SQAI_OPENAI_API_KEY,
  SQAI_OPENAI_BASE_URL,
  SQAI_OPENAI_USE_AZURE,
  SQAI_USE_ANTHROPIC_SDK,
  SQAI_USE_AZURE_OPENAI,
} from '../../../src/env';
import { DEFAULT_MODEL_CONFIG_KEYS } from '../../../src/env/constants';
import { decideOpenaiSdkConfig } from '../../../src/env/decide-model-config';
import { createAssert } from '../../../src/env/helper';

describe('decideOpenaiSdkConfig', () => {
  it('openaiUseAzureDeprecated - fail', () => {
    expect(() =>
      decideOpenaiSdkConfig({
        keys: DEFAULT_MODEL_CONFIG_KEYS,
        provider: {
          [SQAI_OPENAI_USE_AZURE]: '1',
        },
        valueAssert: createAssert('', 'modelConfig'),
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      '[Error: The SQAI_OPENAI_API_KEY must be a non-empty string, but got: undefined. Please check your config.]',
    );
  });

  it('openaiUseAzureDeprecated', () => {
    const result = decideOpenaiSdkConfig({
      keys: DEFAULT_MODEL_CONFIG_KEYS,
      provider: {
        [SQAI_OPENAI_USE_AZURE]: '1',
        [SQAI_OPENAI_BASE_URL]: 'mock-url',
        [SQAI_OPENAI_API_KEY]: 'mock-key',
      },
      valueAssert: createAssert('', 'modelConfig'),
    });
    expect(result).toMatchInlineSnapshot(`
      {
        "httpProxy": undefined,
        "openaiApiKey": "mock-key",
        "openaiBaseURL": "mock-url",
        "openaiExtraConfig": undefined,
        "openaiUseAzureDeprecated": true,
        "socksProxy": undefined,
        "vlModeRaw": undefined,
      }
    `);
  });

  it('useAzureOpenai - fail', () => {
    expect(() =>
      decideOpenaiSdkConfig({
        keys: DEFAULT_MODEL_CONFIG_KEYS,
        provider: {
          [SQAI_USE_AZURE_OPENAI]: '1',
        },
        valueAssert: createAssert('', 'modelConfig'),
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      '[Error: The SQAI_AZURE_OPENAI_KEY must be a non-empty string, but got: undefined. Please check your config.]',
    );
  });
  it('useAzureOpenai', () => {
    const result = decideOpenaiSdkConfig({
      keys: DEFAULT_MODEL_CONFIG_KEYS,
      provider: {
        [SQAI_USE_AZURE_OPENAI]: '1',
        [SQAI_AZURE_OPENAI_ENDPOINT]: 'mock-url',
        [SQAI_AZURE_OPENAI_KEY]: 'mock-key',
      },
      valueAssert: createAssert('', 'modelConfig'),
    });
    expect(result).toMatchInlineSnapshot(`
      {
        "azureExtraConfig": undefined,
        "azureOpenaiApiVersion": undefined,
        "azureOpenaiDeployment": undefined,
        "azureOpenaiEndpoint": "mock-url",
        "azureOpenaiKey": "mock-key",
        "azureOpenaiScope": undefined,
        "httpProxy": undefined,
        "openaiExtraConfig": undefined,
        "socksProxy": undefined,
        "useAzureOpenai": true,
        "vlModeRaw": undefined,
      }
    `);
  });

  it('useAnthropicSdk - fail', () => {
    expect(() =>
      decideOpenaiSdkConfig({
        keys: DEFAULT_MODEL_CONFIG_KEYS,
        provider: {
          [SQAI_USE_ANTHROPIC_SDK]: '1',
        },
        valueAssert: createAssert('', 'modelConfig'),
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      '[Error: The SQAI_ANTHROPIC_API_KEY must be a non-empty string, but got: undefined. Please check your config.]',
    );
  });
  it('useAnthropicSdk', () => {
    const result = decideOpenaiSdkConfig({
      keys: DEFAULT_MODEL_CONFIG_KEYS,
      provider: {
        [SQAI_USE_ANTHROPIC_SDK]: '1',
        [SQAI_ANTHROPIC_API_KEY]: 'mock-key',
      },
      valueAssert: createAssert('', 'modelConfig'),
    });
    expect(result).toMatchInlineSnapshot(`
      {
        "anthropicApiKey": "mock-key",
        "httpProxy": undefined,
        "socksProxy": undefined,
        "useAnthropicSdk": true,
      }
    `);
  });

  it('default - fail', () => {
    expect(() =>
      decideOpenaiSdkConfig({
        keys: DEFAULT_MODEL_CONFIG_KEYS,
        provider: {},
        valueAssert: createAssert('', 'modelConfig'),
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      '[Error: The SQAI_OPENAI_API_KEY must be a non-empty string, but got: undefined. Please check your config.]',
    );
  });
  it('default', () => {
    const result = decideOpenaiSdkConfig({
      keys: DEFAULT_MODEL_CONFIG_KEYS,
      provider: {
        [SQAI_OPENAI_API_KEY]: 'mock-key',
        [SQAI_OPENAI_BASE_URL]: 'mock-url',
      },
      valueAssert: createAssert('', 'modelConfig'),
    });
    expect(result).toMatchInlineSnapshot(`
      {
        "httpProxy": undefined,
        "openaiApiKey": "mock-key",
        "openaiBaseURL": "mock-url",
        "openaiExtraConfig": undefined,
        "socksProxy": undefined,
        "vlModeRaw": undefined,
      }
    `);
  });
});
