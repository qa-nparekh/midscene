import fs from 'node:fs';
import path from 'node:path';
import { PLAYWRIGHT_EXAMPLE_CODE } from '@sqai/shared/constants';

const apiText = fs.readFileSync(path.join(__dirname, 'api.mdx'), 'utf-8');

export const PROMPTS = {
  PLAYWRIGHT_CODE_EXAMPLE: PLAYWRIGHT_EXAMPLE_CODE,
  SQAI_API_DOCS: apiText,
};
