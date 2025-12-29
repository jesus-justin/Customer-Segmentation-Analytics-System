@echo off
echo ========================================
echo Customer Segmentation Analytics System
echo ========================================
echo.
echo Starting Flask Server...
echo.

cd /d "%~dp0"
python src\app.py

pause
