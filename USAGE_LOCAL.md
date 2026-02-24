# Using SQAI Packages Locally

## Available Packages

### Core Packages
- `@sqaitech/core` - Core AI agent functionality
- `@sqaitech/shared` - Shared utilities
- `@sqaitech/cli` - Command-line interface

### Platform Integrations
- `@sqaitech/web` - Web/browser integration (Puppeteer/Playwright)
- `@sqaitech/webdriver` - WebDriver integration
- `@sqaitech/android` - Android automation
- `@sqaitech/ios` - iOS automation

### Tools & UI
- `@sqaitech/playground` - Interactive playground
- `@sqaitech/visualizer` - UI components
- `@sqaitech/recorder` - Recording utilities
- `@sqaitech/mcp` - MCP server tools

## Method 1: Link Packages (Best for Active Development)

### Setup (in this workspace)
```bash
# Build all packages first
pnpm build

# Link the package you need
cd packages/core
pnpm link --global

cd ../web-integration
pnpm link --global
```

### Use in Your Project
```bash
cd /path/to/your-project
pnpm link --global @sqaitech/core @sqaitech/web

# Or with npm
npm link @sqaitech/core @sqaitech/web
```

### Unlink When Done
```bash
pnpm unlink --global @sqaitech/core @sqaitech/web
```

## Method 2: File References (Simplest)

In your project's `package.json`:
```json
{
  "dependencies": {
    "@sqaitech/core": "file:../midscene/packages/core",
    "@sqaitech/web": "file:../midscene/packages/web-integration"
  }
}
```

Then: `pnpm install`

**Note:** Adjust paths relative to your project location.

## Method 3: Direct Path Install

```bash
cd /path/to/your-project
pnpm add file:../midscene/packages/core
pnpm add file:../midscene/packages/web-integration
```

## Example Usage

After linking/installing:

```typescript
// For web automation
import { PuppeteerAgent } from '@sqaitech/web/puppeteer';
import puppeteer from 'puppeteer';

const browser = await puppeteer.launch();
const page = await browser.newPage();
const agent = new PuppeteerAgent(page);

await agent.aiAction('Search for "test automation"');
```

```typescript
// For Android
import { AndroidAgent, getConnectedDevices } from '@sqaitech/android';

const devices = await getConnectedDevices();
const agent = new AndroidAgent({ serial: devices[0].serial });

await agent.aiAction('Open settings');
```

## Important Notes

1. **Always build first**: Run `pnpm build` in this workspace before linking
2. **Rebuild when needed**: If you modify packages, rebuild them
3. **Watch mode**: Use `pnpm build --watch` for active development
4. **Dependencies**: Linked packages will use dependencies from this workspace

## Testing Your Setup

Create a test file in your project:

```typescript
// test-sqai.ts
import { getSqaiVersion } from '@sqaitech/core/agent/utils';

console.log('SQAI Version:', getSqaiVersion());
```

Run: `npx tsx test-sqai.ts`

If it works, your local setup is correct!
