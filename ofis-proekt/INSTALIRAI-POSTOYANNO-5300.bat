@echo off
title Ofis 3D - instalaciya
net session >nul 2>&1
if errorlevel 1 (
  echo  Shte se poyavi prozorec na Windows - natisnete YES / DA.
  powershell -NoProfile -Command "Start-Process -Verb RunAs -FilePath '%~f0'"
  if errorlevel 1 (echo  Ne beshe razresheno. Opitaite pak. & pause)
  exit /b
)
set "DEST=%ProgramData%\Ofis3D"
echo  Kopiram v %DEST% ...
robocopy "%~dp0." "%DEST%" /E /NFL /NDL /NJH /NJS >nul
schtasks /End /TN "Ofis3D-5300" >nul 2>&1
schtasks /Create /TN "Ofis3D-5300" /SC ONSTART /RU SYSTEM /RL HIGHEST /F /TR "powershell.exe -NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File \"%DEST%\server.ps1\" -Root \"%DEST%\3d\""
netsh advfirewall firewall delete rule name="Ofis3D 5300" >nul 2>&1
netsh advfirewall firewall add rule name="Ofis3D 5300" dir=in action=allow protocol=TCP localport=5300 >nul
schtasks /Run /TN "Ofis3D-5300"
echo  Proveryavam servara...
timeout /t 4 >nul
powershell -NoProfile -Command "try{$r=Invoke-WebRequest -UseBasicParsing http://localhost:5300/ -TimeoutSec 5; Write-Host \"  RABOTI (kod $($r.StatusCode))\" -Fore Green}catch{Write-Host \"  NE RABOTI: $($_.Exception.Message)\" -Fore Red; Get-Content \"%DEST%\server.log\" -Tail 15 -EA SilentlyContinue}"
echo.
echo  Na tozi kompyutar:  http://localhost:5300/
echo  Za telefon v sashtata Wi-Fi:  http://IP:5300/   (IP = IPv4 po-dolu)
ipconfig | findstr /i "IPv4"
start "" http://localhost:5300/
echo.
pause
