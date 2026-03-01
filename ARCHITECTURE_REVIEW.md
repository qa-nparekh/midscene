# Midscene v1.4.6 - Complete Architecture Review for Rebranding

**Date:** February 24, 2026  
**Version:** 1.4.6  
**Purpose:** Deep architectural understanding before SQAI rebranding

---

## 📦 **Package Architecture**

### **Monorepo Structure**
- **Build System:** Nx 22.1.3
- **Package Manager:** pnpm@9.3.0 (workspace mode)
- **Build Tools:** rslib v0.18.3 (packages), rsbuild v1.6.15 (apps)
- **Total Packages:** 31 (increased from 24 in v1.2.1)

```
midscene/
├── packages/ (23 packages)
│   ├── Core Infrastructure
│   │   ├── shared/          - Common utilities, types, env config
│   │   └── core/            - Core Agent, AI model integration
│   │
│   ├── Platform Integrations
│   │   ├── web-integration/ - Puppeteer, Playwright, Chrome ext
│   │   ├── android/         - Android automation via ADB
│   │   ├── ios/             - iOS automation via WDA
│   │   ├── computer/        - Desktop automation (NEW in v1.4.6)
│   │   ├── computer-linux/  - Linux-specific (NEW)
│   │   ├── computer-mac/    - macOS-specific (NEW)
│   │   ├── computer-win/    - Windows-specific (NEW)
│   │   └── webdriver/       - Generic WebDriver client
│   │
│   ├── MCP Servers (Model Context Protocol)
│   │   ├── mcp/             - Web MCP server
│   │   ├── android-mcp/     - Android MCP server
│   │   ├── ios-mcp/         - iOS MCP server
│   │   ├── computer-mcp/    - Computer MCP server (NEW)
│   │   └── web-bridge-mcp/  - Web bridge MCP
│   │
│   ├── Development Tools
│   │   ├── cli/             - CLI tool for YAML script runner
│   │   ├── playground/      - Interactive testing environment
│   │   ├── android-playground/ - Android playground
│   │   ├── ios-playground/  - iOS playground
│   │   ├── computer-playground/ - Computer playground (NEW)
│   │   ├── visualizer/      - Report visualization UI
│   │   └── recorder/        - Chrome extension recorder
│   │
│   └── Support
│       └── evaluation/      - Testing and benchmarking
│
└── apps/ (7 applications)
    ├── chrome-extension/    - Chrome browser extension
    ├── playground/          - Web playground UI
    ├── android-playground/  - Android playground app
    ├── computer-playground/ - Computer playground app (NEW)
    ├── recorder-form/       - Recorder form UI
    ├── report/              - HTML report builder
    └── site/                - Documentation site (rspress)
```

---

## 🏗️ **Core Architecture Layers**

### **Layer 1: Foundation (`@midscene/shared`)**

**Purpose:** Cross-platform utilities, types, and configuration  
**Zero Dependencies:** True foundation layer  
**Key Exports:**

```typescript
// Environment Configuration (90+ env variables)
- SQAI_MODEL_NAME, SQAI_MODEL_API_KEY, etc.
- SQAI_ADB_PATH, SQAI_IOS_DEVICE_UDID
- SQAI_RUN_DIR, SQAI_CACHE
- MIDSCENE_MCP_*, MIDSCENE_DEBUG_*

// Common Utilities
- getMidsceneRunDir() → 'midscene_run'
- getMidsceneRunBaseDir()
- getMidsceneSubDir()

// Type System
- UI element types, action types
- Locator types, context types

// MCP (Model Context Protocol)
- BaseMidsceneTools
- tool-generator.ts
```

**User-Facing Strings:**
```typescript
// packages/shared/src/common.ts (line 10)
export const defaultRunDirName = 'midscene_run'; 
// ❌ REBRAND: Change to 'sqai_run'

// Environment variable names (90+ constants)
// ⚠️ KEEP: These are API contracts, breaking change
export const SQAI_MODEL_NAME = 'SQAI_MODEL_NAME';
export const SQAI_RUN_DIR = 'SQAI_RUN_DIR';
// etc...
```

---

### **Layer 2: Core Engine (`@midscene/core`)**

**Purpose:** AI-powered automation engine  
**Dependencies:** `@midscene/shared` only  
**Key Components:**

#### **Agent System**
```typescript
// packages/core/src/agent/agent.ts (1570 lines)
export class Agent<ElementType, PageType> {
  // Core functionality
  async aiAction(prompt: string): Promise<ActionReturn>
  async aiQuery(prompt: string): Promise<string>
  async aiAssert(assertion: string): Promise<void>
  async aiWaitFor(assertion: string): Promise<void>
  
  // Lifecycle
  constructor(interface, service, opts)
  async destroy()
  
  // Internal
  private taskExecutor: TaskExecutor
  private reportGenerator: IReportGenerator // NEW in v1.4.6
  private dumpUpdateListeners[]
}
```

**Critical Methods for Rebranding:**

1. **Report Writing (Line 404)**
```typescript
onTaskUpdate: (runner) => {
  const executionDump = runner.dump();
  this.appendExecutionDump(executionDump, runner);
  
  // Listeners notification
  const dumpString = this.dumpDataString();
  for (const listener of this.dumpUpdateListeners) {
    listener(dumpString, executionDump);
  }
  
  // ⚠️ I/O OPERATION: Writes on EVERY update
  this.writeOutActionDumps(); // Line 404
}
```

2. **Destroy Method (Lines 1335-1350)**
```typescript
async destroy() {
  if (this.destroyed) return;
  
  // ✅ FIXED in v1.4.6: Properly flushes reports
  await this.reportGenerator.flush();
  await this.reportGenerator.finalize(this.dump);
  this.reportFile = this.reportGenerator.getReportPath();
  
  await this.interface.destroy?.();
  this.resetDump();
  this.destroyed = true;
}
```

#### **AI Model Integration**
```typescript
// packages/core/src/ai-model/
├── index.ts              - Main AI planning logic
├── prompt/               - LLM prompt templates
│   ├── llm-planning.ts
│   └── playwright-generator.ts
├── service-caller/       - OpenAI/Anthropic API calls
└── auto-glm/             - UI-Tars integration
```

#### **Report System (NEW in v1.4.6)**
```typescript
// packages/core/src/report-generator.ts
export interface IReportGenerator {
  onDumpUpdate(dump: GroupedActionDump): void;
  flush(): Promise<void>;
  finalize(dump: GroupedActionDump): Promise<void>;
  getReportPath(): string | undefined;
}

export class ReportGenerator implements IReportGenerator {
  // Async queue-based writing
  private writeQueue: Promise<void> = Promise.resolve();
  
  // ✅ Handles batching internally
  onDumpUpdate(dump: GroupedActionDump) {
    this.writeQueue = this.writeQueue.then(() => this.doWrite(dump));
  }
}
```

**Key Insight:** The ReportGenerator already implements async queuing, so the old guide's I/O optimization might be redundant or conflicting.

---

### **Layer 3: Platform Integrations**

#### **Web Integration (`@midscene/web`)**
```typescript
// packages/web-integration/src/
├── puppeteer/
│   ├── index.ts          - PuppeteerAgent
│   ├── agent-launcher.ts - Browser lifecycle
│   └── base-page.ts      - Page abstraction
├── playwright/
│   ├── index.ts          - PlaywrightAgent
│   ├── ai-fixture.ts     - Test fixture integration
│   └── reporter/         - Playwright reporter
├── chrome-extension/
│   └── page.ts           - Extension integration
├── bridge-mode/          - Remote debugging
└── static/
    └── index.ts          - Static HTML testing
```

**Exports:**
```typescript
export { PuppeteerAgent } from './puppeteer';
export { PlaywrightAgent } from './playwright';
export { PlaywrightAiFixture } from './playwright';
export { StaticPageAgent, StaticPage } from './static';
```

#### **Android Integration (`@midscene/android`)**
```typescript
// packages/android/src/
├── agent.ts              - AndroidAgent class
├── device.ts             - ADB device control
├── index.ts              - Public API
└── utils.ts              - Android-specific utils

// Dependencies
- ADB (Android Debug Bridge)
- IME (Input Method Engine) for text input
- Screen mirroring (scrcpy)
```

#### **iOS Integration (`@midscene/ios`)**
```typescript
// packages/ios/src/
├── agent.ts              - IOSAgent class
├── device.ts             - WDA device control
├── index.ts              - Public API
└── bin.ts                - CLI launcher

// Dependencies
- WebDriverAgent (WDA)
- XCUITest framework
- iOS Simulator or physical device
```

#### **Computer Integration (`@midscene/computer`)** - NEW in v1.4.6
```typescript
// packages/computer/src/
├── index.ts              - ComputerAgent
├── computer-linux/       - Linux automation
├── computer-mac/         - macOS automation
└── computer-win/         - Windows automation

// Purpose: Desktop automation (screenshots, clicks, keyboard)
```

---

## 🔧 **Build System & Template Injection**

### **Critical Build Process**

#### **Template Injection Mechanism**
```typescript
// packages/core/rslib.config.ts (lines 6-50)
const injectReportTemplate = () => ({
  name: 'inject-report-template',
  setup: (api) => {
    api.onAfterBuild(() => {
      const reportTplPath = '../../apps/report/dist/index.html';
      const magicString = 'REPLACE_ME_WITH_REPORT_HTML';
      
      // Read report HTML
      const tplFileContent = fs.readFileSync(reportTplPath, 'utf-8')
        .replaceAll(magicString, '');
      
      const finalContent = `/*REPORT_HTML_REPLACED*/${JSON.stringify(tplFileContent)}`;
      
      // Inject into core package
      const files = ['dist/es/*.mjs', 'dist/lib/*.js'];
      for (const file of files) {
        // Replace placeholder with actual HTML
        content.replace(/REPLACE_ME_WITH_REPORT_HTML/, finalContent);
      }
      
      console.log('Template injected into:', filePath);
    });
  }
});
```

**Flow:**
```
1. apps/report builds → dist/index.html (3MB+ HTML)
2. packages/core builds → utils.mjs/utils.js contain placeholder
3. Report build post-hook reads index.html
4. Injects HTML into core's dist files
5. Core package now contains embedded report template
```

**Verification:**
```typescript
// packages/core/src/utils.ts (line 87)
const reportTpl = 'REPLACE_ME_WITH_REPORT_HTML';
// After build, this string is replaced with actual HTML
```

---

## 📊 **Data Flow Architecture**

### **Execution Flow**
```
User Code
  ↓
Agent.aiAction("click login")
  ↓
TaskExecutor
  ↓
TaskRunner (status: init → pending → running → completed/error)
  ↓
onTaskUpdate(runner) {  // Called on EVERY status change
  - appendExecutionDump()
  - notify listeners
  - writeOutActionDumps()  ← ⚠️ I/O happens here
}
  ↓
ReportGenerator.onDumpUpdate() {
  - Queue async write
  - Batch operations internally
}
  ↓
Agent.destroy() {
  - reportGenerator.flush()     ← Wait for queued writes
  - reportGenerator.finalize()  ← Final dump
  - resetDump()
}
```

### **Report Generation Timeline**
```
Action Start
  ↓
[Update 1] Status: init → writeOutActionDumps()
  ↓
[Update 2] Status: pending → writeOutActionDumps()
  ↓
[Update 3] Status: running → writeOutActionDumps()
  ↓
[Update 4] Status: completed → writeOutActionDumps()
  ↓
Action Complete (4 writes per action!)
```

**Old Guide's Optimization:**
```typescript
// Proposed: Only write on completion/error
if (runner.status === 'completed' || runner.status === 'error') {
  this.writeOutActionDumps();
}
// Reduces 4 writes → 1 write (75% reduction)
```

**But v1.4.6 Has:**
```typescript
// ReportGenerator queues writes asynchronously
onDumpUpdate(dump) {
  this.writeQueue = this.writeQueue.then(() => this.doWrite(dump));
}
// Writes may already be batched/optimized
```

---

## 🎨 **User-Facing Components**

### **1. localStorage Keys (Visualizer)**
```typescript
// packages/visualizer/src/store/store.tsx (lines 5-10)
const AUTO_ZOOM_KEY = 'midscene-auto-zoom';
const BACKGROUND_VISIBLE_KEY = 'midscene-background-visible';
const ELEMENTS_VISIBLE_KEY = 'midscene-elements-visible';
const MODEL_CALL_DETAILS_KEY = 'midscene-model-call-details';
const DARK_MODE_KEY = 'midscene-dark-mode';
const PLAYBACK_SPEED_KEY = 'midscene-playback-speed';

// ❌ REBRAND: Change all to 'sqai-*'
// ⚠️ KEEP in chrome-extension: Avoid breaking user data
```

### **2. Report Template**
```html
<!-- apps/report/template/index.html -->
<title>Report - Midscene.js</title>
<link rel="icon" href="https://...midscene-favicon.png" />

<!-- ❌ REBRAND -->
<title>Report - SQAI</title>
<link rel="icon" href="./sqai-icon.png" />
```

### **3. Run Directory**
```typescript
// packages/shared/src/common.ts (line 10)
export const defaultRunDirName = 'midscene_run';

// ❌ REBRAND to:
export const defaultRunDirName = 'sqai_run';

// Used in:
- .gitignore
- Test scripts
- Report output paths
- Dump file locations
```

### **4. Package Names**
```json
// All 31 package.json files
{
  "name": "@midscene/PACKAGE_NAME",  // ❌ REBRAND to @sqaitech/*
  "dependencies": {
    "@midscene/core": "workspace:*"  // ❌ Update all references
  }
}
```

---

## 🔐 **What Should NOT Change**

### **1. Environment Variable Names (API Contract)**
```typescript
// ✅ KEEP ALL OF THESE - Breaking change!
export const SQAI_MODEL_NAME = 'SQAI_MODEL_NAME';
export const SQAI_MODEL_API_KEY = 'SQAI_MODEL_API_KEY';
export const SQAI_RUN_DIR = 'SQAI_RUN_DIR';
export const SQAI_ADB_PATH = 'SQAI_ADB_PATH';
// ... 90+ more

// Reason: User scripts depend on these
// Example:
// process.env.SQAI_MODEL_NAME = 'gpt-4o'
// Changing breaks all existing users
```

### **2. Internal Type Names**
```typescript
// ✅ KEEP - Internal implementation details
export interface MidsceneYamlScript { }
export type MidsceneYamlTask = { };
export class MidsceneYamlConfigResult { }

// Used in code but not user-facing
```

### **3. Test Fixtures & Data**
```typescript
// ✅ KEEP - Test infrastructure
- test-data/
- fixtures/
- Midscene references in test files
```

### **4. MIT License Attribution**
```markdown
<!-- README.md -->
# SQAI
Forked from [Midscene.js](https://github.com/web-infra-dev/midscene)

<!-- ✅ MUST KEEP - MIT license requires attribution -->
```

---

## 📚 **Documentation Structure**

### **Documentation Site (apps/site/docs/)**
```
docs/
├── en/ (42 files)
│   ├── index.mdx
│   ├── introduction.mdx
│   ├── api.mdx
│   ├── integrate-with-puppeteer.mdx
│   ├── integrate-with-playwright.mdx
│   ├── android-*.mdx (4 files)
│   ├── ios-*.mdx (3 files)
│   ├── computer-*.mdx (3 files) ← NEW in v1.4.6
│   ├── mcp*.mdx (2 files)
│   ├── model-*.mdx (3 files)
│   └── showcases-*.mdx (5 files)
│
└── zh/ (42 files - Chinese translations)
    └── [same structure]

Total: 84 .mdx files (was 74 in v1.2.1)
```

**Rebrand Changes:**
```markdown
<!-- Before -->
npm install @midscene/web

<!-- After -->
npm install @sqaitech/web

<!-- PowerShell bulk update -->
Get-ChildItem -Path "apps/site/docs" -Filter "*.mdx" -Recurse | ForEach-Object {
    (Get-Content $_.FullName -Raw) -replace '@midscene/', '@sqaitech/' | 
    Set-Content $_.FullName -NoNewline
}
```

---

## 🧪 **Testing Infrastructure**

### **Test Categories**
```bash
# Unit tests
pnpm test  # All packages

# AI integration tests
pnpm test:ai  # @midscene/core, web, cli, computer

# End-to-end tests
pnpm e2e           # Web automation
pnpm e2e:cache     # Caching functionality
pnpm e2e:report    # Report generation
pnpm e2e:visualizer # Visualizer UI
```

### **Test Coverage**
```typescript
// packages/*/tests/
├── unit-test/        - Pure logic tests
├── ai/               - AI model integration tests
└── e2e/              - End-to-end scenarios

// After rebranding:
- Update import statements
- Keep test data unchanged
- Verify all tests pass
```

---

## 🚀 **Build Dependencies**

### **Dependency Graph**
```
shared (no deps)
  ↓
core (depends: shared)
  ↓
├── webdriver (depends: shared)
├── recorder (depends: shared)
├── web-integration (depends: core, shared)
├── android (depends: core, shared)
├── ios (depends: core, shared)
├── computer (depends: core, shared)
├── computer-linux (depends: computer)
├── computer-mac (depends: computer)
└── computer-win (depends: computer)
  ↓
├── playground (depends: core, shared)
├── visualizer (depends: core, shared)
├── cli (depends: core, web, android, ios, computer)
├── mcp (depends: core, web)
├── android-mcp (depends: android, mcp)
├── ios-mcp (depends: ios, mcp)
├── computer-mcp (depends: computer, mcp)
└── web-bridge-mcp (depends: web, mcp)
  ↓
report (depends: core, visualizer) ← MUST BUILD LAST
  ↓
apps/* (depend on various packages)
```

### **Critical Build Order**
```bash
# 1. Foundation
pnpm --filter @midscene/shared build

# 2. Core engine
pnpm --filter @midscene/core build

# 3. Platform integrations
pnpm --filter @midscene/web build
pnpm --filter @midscene/android build
pnpm --filter @midscene/ios build
pnpm --filter @midscene/computer build

# 4. Computer platforms (depend on computer)
pnpm --filter @midscene/computer-linux build
pnpm --filter @midscene/computer-mac build
pnpm --filter @midscene/computer-win build

# 5. Tools
pnpm --filter @midscene/cli build
pnpm --filter @midscene/visualizer build

# 6. MCP servers
pnpm --filter @midscene/mcp build
pnpm --filter @midscene/android-mcp build
pnpm --filter @midscene/ios-mcp build
pnpm --filter @midscene/computer-mcp build

# 7. CRITICAL: Report (for template injection)
pnpm --filter @midscene/report build
# ⚠️ This injects HTML into core/dist/

# 8. Apps
pnpm --filter chrome-extension build
pnpm --filter playground build
```

---

## 🎯 **Rebranding Impact Analysis**

### **High Impact (User-Facing)**
1. **Package names** - 31 files, affects all users
2. **Import statements** - ~300+ files, all user code breaks
3. **Documentation** - 84 files, user reference material
4. **Run directory** - File system structure change
5. **localStorage keys** - Visualizer settings lost
6. **Report branding** - Visual identity change

### **Medium Impact (Configuration)**
1. **Default directory name** - `midscene_run` → `sqai_run`
2. **HTML template** - Title, favicon
3. **Package metadata** - Description, homepage, repository

### **Low Impact (Internal)**
1. **Type names** - Internal, no user-facing API change
2. **Function names** - getMidsceneRunDir() etc. (keep for compatibility)
3. **Test files** - Internal testing only

### **Zero Impact (Must Not Change)**
1. **Environment variables** - MIDSCENE_* constants (API contract)
2. **Upstream attribution** - README.md MIT license requirement
3. **Test fixtures** - Internal test data

---

## 📝 **Rebranding Checklist Summary**

### **Phase 1: Package System (31 files)**
- [ ] Root package.json
- [ ] All 23 packages/*/package.json
- [ ] All 7 apps/*/package.json
- [ ] pnpm-lock.yaml update (pnpm install)

### **Phase 2: Source Code (~300 files)**
- [ ] Import statements: `@midscene/*` → `@sqaitech/*`
- [ ] Default run dir: `midscene_run` → `sqai_run`
- [ ] localStorage keys: `midscene-*` → `sqai-*` (visualizer only)

### **Phase 3: Documentation (84 files)**
- [ ] All .mdx files in apps/site/docs/en/
- [ ] All .mdx files in apps/site/docs/zh/
- [ ] Keep README.md attribution

### **Phase 4: Assets & UI**
- [ ] Report template title
- [ ] Report favicon
- [ ] Package descriptions

### **Phase 5: Build & Verify**
- [ ] Full build: `pnpm build`
- [ ] Report build: `cd apps/report && pnpm build`
- [ ] Verify template injection
- [ ] Run tests: `pnpm test`

---

## ⚠️ **Critical Decisions Required**

### **Decision 1: I/O Optimization**
**Question:** Apply the old guide's conditional dump writing?

**Current State (v1.4.6):**
```typescript
// Writes on EVERY status update (4 times per action)
onTaskUpdate: (runner) => {
  this.writeOutActionDumps(); // No condition
}
```

**Old Guide Proposes:**
```typescript
// Write only on completion/error
if (runner.status === 'completed' || runner.status === 'error') {
  this.writeOutActionDumps();
}
```

**But:**
- ReportGenerator already has async queue
- May already batch writes internally
- Needs performance testing to verify benefit

**Options:**
- **A:** Apply optimization (test first)
- **B:** Skip optimization (rely on ReportGenerator queue)
- **C:** Benchmark both approaches

### **Decision 2: Environment Variable Migration**
**Question:** Provide SQAI_* aliases for MIDSCENE_* env vars?

**Option A: Keep MIDSCENE_*** (Backward compatible)
```typescript
// Users continue using:
process.env.SQAI_MODEL_NAME = 'gpt-4o'
```

**Option B: Add SQAI_* Aliases**
```typescript
// Support both:
process.env.SQAI_MODEL_NAME = 'gpt-4o'  // New
process.env.SQAI_MODEL_NAME = 'gpt-4o'  // Legacy
```

**Option C: Migrate with Deprecation**
```typescript
// Phase 1: Add aliases with warning
// Phase 2: Deprecate MIDSCENE_*
// Phase 3: Remove in v2.0
```

**Recommendation:** Option A for now (no breaking changes)

### **Decision 3: Function Name Compatibility**
**Question:** Keep internal names like `getMidsceneRunDir()`?

**Option A: Keep Internal Names**
```typescript
// Keep function names unchanged
export const getMidsceneRunDir = () => {
  return 'sqai_run';  // Only change return value
}
```

**Option B: Rename with Aliases**
```typescript
// New names, old aliases
export const getSqaiRunDir = () => 'sqai_run';
export const getMidsceneRunDir = getSqaiRunDir; // Deprecated alias
```

**Recommendation:** Option A (less breaking changes)

---

## 🎓 **Key Insights for Rebranding**

### **1. New Computer Platform**
- 7 new packages added in v1.4.6
- Desktop automation across Windows/Mac/Linux
- Affects build order and testing

### **2. ReportGenerator Architecture**
- Complete rewrite in v1.4.6
- Async queue-based writing
- Empty report bug already fixed
- Old guide's optimization may conflict

### **3. Package Count Growth**
- v1.2.1: 24 packages
- v1.4.6: 31 packages (+29%)
- Computer platform adds most

### **4. Documentation Growth**
- v1.2.1: 74 .mdx files
- v1.4.6: 84 .mdx files (+13%)
- Computer docs added

### **5. Environment Variables**
- 90+ MIDSCENE_* constants
- Breaking change if renamed
- Keep as-is for compatibility

---

## 📊 **Estimated Effort**

### **File Count Summary**
| Category | Files | Effort |
|----------|-------|--------|
| package.json | 31 | 1 hour (automated) |
| Source code | ~300 | 2 hours (automated) |
| Documentation | 84 | 30 mins (automated) |
| Manual changes | ~10 | 2 hours |
| Build & verify | N/A | 3 hours |
| Testing | N/A | 4 hours |
| **TOTAL** | **~425** | **12-14 hours** |

### **Risk Areas**
1. **Template injection** - Must rebuild report last
2. **Import resolution** - All references must update
3. **localStorage migration** - User settings lost
4. **Build order** - Computer packages add complexity

---

## 🚦 **Next Steps Recommendation**

### **Before Proceeding:**
1. ✅ Review this architecture document
2. ✅ Make decisions on:
   - I/O optimization (apply or skip?)
   - Environment variable strategy
   - Function naming strategy
3. ✅ Create test branch
4. ✅ Backup current state

### **Execution Strategy:**
1. **Phase 1-4** (automated, low risk)
2. **Phase 5** (build, medium risk)
3. **Phase 6** (optional I/O optimization)
4. **Phase 7** (testing, validation)

---

**End of Architecture Review**

Ready to proceed? Please confirm your decisions on the critical questions above.
