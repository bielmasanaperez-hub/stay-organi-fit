@echo off
title StayOrganiFit - Eurofitness Estacio del Nord & OutfitDiario
cd /d "%~dp0"
start "" "http://localhost:3001"
npm run dev
pause
