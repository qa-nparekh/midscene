import {
  SQAI_USE_DOUBAO_VISION,
  SQAI_USE_GEMINI,
  SQAI_USE_QWEN3_VL,
  SQAI_USE_QWEN_VL,
  SQAI_USE_VLM_UI_TARS,
  type TVlModeTypes,
  type TVlModeValues,
  UITarsModelVersion,
  VL_MODE_RAW_VALID_VALUES,
} from './types';

export const parseVlModeAndUiTarsModelVersionFromRawValue = (
  vlModeRaw?: string,
): {
  vlMode?: TVlModeTypes;
  uiTarsVersion?: UITarsModelVersion;
} => {
  if (!vlModeRaw) {
    return {
      vlMode: undefined,
      uiTarsVersion: undefined,
    };
  }

  if (!VL_MODE_RAW_VALID_VALUES.includes(vlModeRaw as never)) {
    throw new Error(
      `the value ${vlModeRaw} is not a valid VL_MODE value, must be one of ${VL_MODE_RAW_VALID_VALUES}`,
    );
  }
  const raw = vlModeRaw as TVlModeValues;

  if (raw === 'vlm-ui-tars') {
    return {
      vlMode: 'vlm-ui-tars',
      uiTarsVersion: UITarsModelVersion.V1_0,
    };
  } else if (raw === 'vlm-ui-tars-doubao' || raw === 'vlm-ui-tars-doubao-1.5') {
    return {
      vlMode: 'vlm-ui-tars',
      uiTarsVersion: UITarsModelVersion.DOUBAO_1_5_20B,
    };
  }

  return {
    vlMode: raw as TVlModeTypes,
    uiTarsVersion: undefined,
  };
};

/**
 * legacy logic of how to detect vlMode from process.env without intent
 */
export const parseVlModeAndUiTarsFromGlobalConfig = (
  provider: Record<string, string | undefined>,
): {
  vlMode?: TVlModeTypes;
  uiTarsVersion?: UITarsModelVersion;
} => {
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

  if (isQwen3) {
    return {
      vlMode: 'qwen3-vl',
      uiTarsVersion: undefined,
    };
  }

  if (isQwen) {
    return {
      vlMode: 'qwen-vl',
      uiTarsVersion: undefined,
    };
  }

  if (isDoubao) {
    return {
      vlMode: 'doubao-vision',
      uiTarsVersion: undefined,
    };
  }

  if (isGemini) {
    return {
      vlMode: 'gemini',
      uiTarsVersion: undefined,
    };
  }

  if (isUiTars) {
    if (isUiTars === '1') {
      return {
        vlMode: 'vlm-ui-tars',
        uiTarsVersion: UITarsModelVersion.V1_0,
      };
    } else if (isUiTars === 'DOUBAO' || isUiTars === 'DOUBAO-1.5') {
      return {
        vlMode: 'vlm-ui-tars',
        uiTarsVersion: UITarsModelVersion.DOUBAO_1_5_20B,
      };
    } else {
      return {
        vlMode: 'vlm-ui-tars',
        uiTarsVersion: `${isUiTars}` as UITarsModelVersion,
      };
    }
  }

  return {
    vlMode: undefined,
    uiTarsVersion: undefined,
  };
};
