@echo off
chcp 65001 >nul
title KAYA LUX - oferta AVANTI
cd /d "%~dp0"
rem Parviyat svoboden port ot 5340 nagore. Brauzarat se otvarya sam.
where py >nul 2>nul && (py -3 tools\serve.py & goto :eof)
where python >nul 2>nul && (python tools\serve.py & goto :eof)
where php >nul 2>nul && (start "" http://localhost:5340/index.php & php -S 0.0.0.0:5340 -t site & goto :eof)
echo Nuzhen e Python 3 (python.org, otbelezhi "Add to PATH") ili PHP. Instalirai i startirai otnovo.
pause
