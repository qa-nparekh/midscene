import { enableDebug } from '../logger';
import { getBasicEnvValue } from './basic';
import {
  SQAI_DEBUG_MODEL_PROFILE,
  SQAI_DEBUG_MODEL_RESPONSE,
} from './types';

export const initDebugConfig = () => {
  const shouldPrintTiming = getBasicEnvValue(SQAI_DEBUG_MODEL_PROFILE);
  let debugConfig = '';
  if (shouldPrintTiming) {
    console.warn(
      'SQAI_DEBUG_MODEL_PROFILE is deprecated, use DEBUG=sqai:ai:profile instead',
    );
    debugConfig = 'ai:profile';
  }
  const shouldPrintModelResponse = getBasicEnvValue(
    SQAI_DEBUG_MODEL_RESPONSE,
  );

  if (shouldPrintModelResponse) {
    console.warn(
      'SQAI_DEBUG_MODEL_RESPONSE is deprecated, use DEBUG=sqai:ai:response instead',
    );
    if (debugConfig) {
      debugConfig = 'ai:*';
    } else {
      debugConfig = 'ai:call';
    }
  }
  if (debugConfig) {
    enableDebug(debugConfig);
  }
};
