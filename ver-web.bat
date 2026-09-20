@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo Abriendo la web en http://localhost:3000  (cerra esta ventana para detenerla)
start "" http://localhost:3000
call npm run dev
