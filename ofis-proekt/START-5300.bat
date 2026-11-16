@echo off
cd /d "%~dp0\3d"
echo.
echo  Ofis 3D: http://localhost:5300/
echo  Za telefon v sashtata Wi-Fi mreja - http://IP:5300/ (IP e po-dolu, IPv4):
ipconfig | findstr /i "IPv4"
echo.
echo  Ne zatvaryaite tozi prozorec, dokato rabotite.
start "" http://localhost:5300/
where py >nul 2>nul && (py -m http.server 5300 & goto :eof)
where python >nul 2>nul && (python -m http.server 5300 & goto :eof)
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1" -Root "%~dp0\3d"
