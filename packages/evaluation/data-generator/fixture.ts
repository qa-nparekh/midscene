import type { PlayWrightAiFixtureType } from '@sqaitech/web';
import { PlaywrightAiFixture } from '@sqaitech/web/playwright';
import { test as base } from '@playwright/test';

export const test = base.extend<PlayWrightAiFixtureType>(PlaywrightAiFixture());
