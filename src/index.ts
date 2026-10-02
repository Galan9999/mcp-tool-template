#!/usr/bin/env node
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createServer } from './server.js';

// stdout es el canal JSON-RPC: cualquier console.log aqui corrompe el protocolo. Logs a stderr.
await createServer().connect(new StdioServerTransport());
