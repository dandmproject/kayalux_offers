@echo off
rem Installs the Ofis 3D server: always on, port 5300, starts with Windows.
net session >nul 2>&1 || (powershell -NoProfile -Command "Start-Process -Verb RunAs -FilePath '%~f0'" & exit /b)
set "DEST=%ProgramData%\Ofis3D"
robocopy "%~dp0." "%DEST%" /E /NFL /NDL /NJH /NJS >nul
schtasks /End /TN "Ofis3D-5300" >nul 2>&1
schtasks /Create /TN "Ofis3D-5300" /SC ONSTART /RU SYSTEM /RL HIGHEST /F /TR "powershell.exe -NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File \"%DEST%\server.ps1\" -Root \"%DEST%\3d\"" >nul
netsh advfirewall firewall delete rule name="Ofis3D 5300" >nul 2>&1
netsh advfirewall firewall add rule name="Ofis3D 5300" dir=in action=allow protocol=TCP localport=5300 >nul
schtasks /Run /TN "Ofis3D-5300" >nul
timeout /t 3 >nul
echo.
echo  GOTOVO. Servarat raboti postoyanno, i sled restart.
echo  Na tozi kompyutar:  http://localhost:5300/
echo  Za telefon v sashtata Wi-Fi:  http://IP:5300/   (IP = IPv4 po-dolu)
ipconfig | findstr /i "IPv4"
start "" http://localhost:5300/
echo.
pause
