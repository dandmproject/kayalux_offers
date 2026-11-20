@echo off
net session >nul 2>&1 || (powershell -NoProfile -Command "Start-Process -Verb RunAs -FilePath '%~f0'" & exit /b)
schtasks /End /TN "Ofis3D-5300" >nul 2>&1
schtasks /Delete /TN "Ofis3D-5300" /F >nul 2>&1
netsh advfirewall firewall delete rule name="Ofis3D 5300" >nul 2>&1
echo Servarat na port 5300 e spryan i premahnat.
pause
