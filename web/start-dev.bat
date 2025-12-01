@echo off
cd /d "%~dp0"
set NODE_ENV=development
node node_modules\tsx\dist\cli.mjs server\index-dev.ts

