@echo off
title StayOrganiFit - Eurofitness Estacio del Nord & OutfitDiario
cd /d "%~dp0"
start "" "http://localhost:3001"
npx next start -p 3001
pause
