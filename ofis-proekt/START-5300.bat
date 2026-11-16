@echo off
title Ofis 3D - port 5300
cd /d "%~dp0"
echo.
echo  Ofis 3D: http://localhost:5300/
echo  Za telefon v sashtata Wi-Fi mreja: http://IP:5300/  (IP = IPv4 po-dolu)
ipconfig | findstr /i "IPv4"
echo.
echo  NE ZATVARYAITE tozi prozorec - dokato e otvoren, servarat raboti.
echo.
start "" cmd /c "timeout /t 3 >nul & start http://localhost:5300/"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1" -Root "%~dp03d"
echo.
echo  Servarat sprya. Snimaite tozi ekran i go pratete na Claude.
pause
