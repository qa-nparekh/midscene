import type { PlayWrightAiFixtureType } from '@sqai/web';
import { PlaywrightAiFixture } from '@sqai/web/playwright';
import { test as base } from '@playwright/test';

export const test = base.extend<PlayWrightAiFixtureType>(PlaywrightAiFixture());
