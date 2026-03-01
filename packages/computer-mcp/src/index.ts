import { parseArgs } from 'node:util';
import { ComputerMCPServer } from '@sqaitech/computer/mcp-server';
import { type CLIArgs, CLI_ARGS_CONFIG } from '@sqaitech/shared/mcp';

const { values } = parseArgs({ options: CLI_ARGS_CONFIG });
const args = values as CLIArgs;

const server = new ComputerMCPServer();

if (args.mode === 'http') {
  server
    .launchHttp({
      port: Number.parseInt(args.port || '3000', 10),
      host: args.host || 'localhost',
    })
    .catch(console.error);
} else {
  server.launch().catch(console.error);
}
