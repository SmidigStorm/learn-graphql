#!/usr/bin/env node

// Safe startup script that disables V8 optimizations causing crashes
// This works around the TurboFan compiler bug in certain Node.js versions

const { spawn } = require('child_process');
const path = require('path');

// V8 flags to disable problematic optimizations
const v8Flags = [
  '--no-turbofan',     // Disable TurboFan compiler
  '--no-maglev',       // Disable Maglev compiler
  '--no-opt'           // Disable general optimizations
];

// Start the server with safe flags
const serverProcess = spawn('node', [...v8Flags, 'index.js'], {
  stdio: 'inherit',
  cwd: __dirname
});

serverProcess.on('exit', (code) => {
  process.exit(code);
});

process.on('SIGINT', () => {
  serverProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  serverProcess.kill('SIGTERM');
});