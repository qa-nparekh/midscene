import { BaseMCPServer } from '@sqaitech/shared/mcp';
import { DeprecationMidsceneTools } from './deprecation-tools.js';

declare const __VERSION__: string;

/**
 * Deprecated MCP Server class
 * This package is deprecated. Please use platform-specific packages instead:
 * - @sqaitech/web-bridge-mcp for web automation
 * - @sqaitech/android-mcp for Android automation
 * - @sqaitech/ios-mcp for iOS automation
 */
export class DeprecatedMCPServer extends BaseMCPServer {
  constructor() {
    super({
      name: '@sqaitech/mcp',
      version: __VERSION__,
      description:
        'Deprecated - Use @sqaitech/web-bridge-mcp, @sqaitech/android-mcp, or @sqaitech/ios-mcp',
    });
  }

  protected createToolsManager(): DeprecationMidsceneTools {
    return new DeprecationMidsceneTools();
  }
}
