@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo.
echo  === 1/3  Procesando imagenes... ===
call npm run obras
if errorlevel 1 (
  echo.
  echo  Hubo un error procesando las imagenes. Revisa el mensaje de arriba.
  pause
  exit /b 1
)
echo.
echo  === 2/3  Preparando cambios... ===
git add -A
git commit -m "Actualizar obras y contenido"
echo.
echo  === 3/3  Subiendo a GitHub... ===
git push
echo.
echo  Listo. En ~1 minuto la web esta actualizada.
pause
