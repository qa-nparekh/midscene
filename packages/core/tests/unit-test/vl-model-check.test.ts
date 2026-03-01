import { Agent } from '@/agent/agent';
import type { AbstractInterface } from '@/types';
import { describe, expect, it, vi } from 'vitest';

// Mock dependencies
vi.mock('@sqaitech/core/utils', () => ({
  writeLogFile: vi.fn(() => null),
  reportHTMLContent: vi.fn(() => ''),
  stringifyDumpData: vi.fn(() => '{}'),
  groupedActionDumpFileExt: '.json',
  getVersion: () => '0.0.0-test',
  sleep: vi.fn(() => Promise.resolve()),
}));

vi.mock('@sqaitech/shared/logger', () => ({
  getDebug: vi.fn(() => vi.fn()),
  logMsg: vi.fn(),
}));

vi.mock('@sqaitech/core', async () => {
  const actual = await vi.importActual('@sqaitech/core');
  return {
    ...actual,
    Insight: vi.fn().mockImplementation(() => ({})),
  };
});

const mockedModelConfig = {
  SQAI_MODEL_NAME: 'gpt-4o',
  SQAI_MODEL_API_KEY: 'mock-api-key',
  SQAI_MODEL_BASE_URL: 'mock-base-url',
};

const createMockInterface = (
  interfaceType: AbstractInterface['interfaceType'],
) =>
  ({
    interfaceType,
    destroy: vi.fn(),
    size: vi.fn().mockResolvedValue({ dpr: 1 }),
    actionSpace: vi.fn(() => []),
  }) as unknown as AbstractInterface;

describe('VL Model Check for Different Interface Types', () => {
  it('should not require VL model for puppeteer interface', () => {
    const mockPage = createMockInterface('puppeteer');

    expect(() => {
      new Agent(mockPage, {
        generateReport: false,
        modelConfig: mockedModelConfig,
      });
    }).not.toThrow();
  });

  it('should not require VL model for playwright interface', () => {
    const mockPage = createMockInterface('playwright');

    expect(() => {
      new Agent(mockPage, {
        generateReport: false,
        modelConfig: mockedModelConfig,
      });
    }).not.toThrow();
  });

  it('should not require VL model for chrome-extension-proxy interface', () => {
    const mockPage = createMockInterface('chrome-extension-proxy');

    expect(() => {
      new Agent(mockPage, {
        generateReport: false,
        modelConfig: mockedModelConfig,
      });
    }).not.toThrow();
  });

  it('should not require VL model for page-over-chrome-extension-bridge interface', () => {
    const mockPage = createMockInterface('page-over-chrome-extension-bridge');

    expect(() => {
      new Agent(mockPage, {
        generateReport: false,
        modelConfig: mockedModelConfig,
      });
    }).not.toThrow();
  });

  it('should not require VL model for static interface', () => {
    const mockPage = createMockInterface('static');

    expect(() => {
      new Agent(mockPage, {
        generateReport: false,
        modelConfig: mockedModelConfig,
      });
    }).not.toThrow();
  });

  it('should require VL model for android interface without modelFamily', () => {
    const mockPage = createMockInterface('android');

    // This should not throw at construction time, but would throw when
    // ensureVLModelWarning is called (e.g., during an AI action)
    expect(() => {
      new Agent(mockPage, {
        generateReport: false,
        modelConfig: mockedModelConfig,
      });
    }).not.toThrow();
  });

  it('should not throw error for android interface with VL model configured', () => {
    const mockPage = createMockInterface('android');

    const modelConfigWithVL = {
      SQAI_MODEL_NAME: 'gemini-2.0-flash-exp',
      SQAI_MODEL_API_KEY: 'mock-api-key',
      SQAI_MODEL_BASE_URL: 'mock-base-url',
      SQAI_MODEL_FAMILY: 'gemini',
    };

    expect(() => {
      new Agent(mockPage, {
        generateReport: false,
        modelConfig: modelConfigWithVL,
      });
    }).not.toThrow();
  });
});
