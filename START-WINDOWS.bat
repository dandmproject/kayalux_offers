@echo off
setlocal
chcp 65001 >nul
title KAYA LUX - oferta AVANTI
cd /d "%~dp0"

rem Proverka: ZIP-at trabva da e razarhiviran
if not exist "tools\serve.py" goto nozip

rem Tarsim istinski Python 3 (ne praznata vrazka kam Microsoft Store)
set "PY="
py -3 -c "import sys" >nul 2>nul && set "PY=py -3"
if not defined PY python -c "import sys; sys.exit(0 if sys.version_info[0]==3 else 1)" >nul 2>nul && set "PY=python"
if not defined PY python3 -c "import sys" >nul 2>nul && set "PY=python3"
if not defined PY goto nopython

echo Startirane na ofertata s %PY% ...
%PY% tools\serve.py
echo.
echo Sarvarat spria. Ako vijdate greshka po-gore, izpratete snimka na tozi prozorec.
pause
exit /b

:nopython
where php >nul 2>nul || goto noboth
echo Nyama Python, startiram s PHP na port 5340 ...
start "" http://localhost:5340/
php -S 0.0.0.0:5340 -t site
pause
exit /b

:noboth
echo Nuzhen e Python 3. Otvaryam python.org - pri instalaciyata otbelezhete "Add python.exe to PATH",
echo sled tova startirayte START-WINDOWS.bat otnovo.
start "" https://www.python.org/downloads/
pause
exit /b 1

:nozip
echo Tozi fail e startiran ot vatreshnostta na ZIP arhiva.
echo Izvadete arhiva: desen klik varhu ZIP faila - Extract All / Izvlichane na vsichko,
echo i startirayte START-WINDOWS.bat ot izvadenata papka.
pause
exit /b 1
