import { enableDebug } from '../logger';
import { getBasicEnvValue } from './basic';
import { SQAI_DEBUG_AI_PROFILE, SQAI_DEBUG_AI_RESPONSE } from './types';

export const initDebugConfig = () => {
  const shouldPrintTiming = getBasicEnvValue(SQAI_DEBUG_AI_PROFILE);
  let debugConfig = '';
  if (shouldPrintTiming) {
    console.warn(
      'SQAI_DEBUG_AI_PROFILE is deprecated, use DEBUG=midscene:ai:profile instead',
    );
    debugConfig = 'ai:profile';
  }
  const shouldPrintAIResponse = getBasicEnvValue(SQAI_DEBUG_AI_RESPONSE);

  if (shouldPrintAIResponse) {
    console.warn(
      'SQAI_DEBUG_AI_RESPONSE is deprecated, use DEBUG=midscene:ai:response instead',
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
