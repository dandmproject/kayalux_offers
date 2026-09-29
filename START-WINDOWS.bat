@echo off
chcp 65001 >nul
cd /d "%~dp0site"
echo KAYA LUX - oferta AVANTI: http://localhost:8080/index.php
start "" http://localhost:8080/index.php
where php >nul 2>nul && (php -S localhost:8080 & goto :eof)
where python >nul 2>nul && (python -m http.server 8080 & goto :eof)
where py >nul 2>nul && (py -m http.server 8080 & goto :eof)
echo Nuzhen e Python (python.org) ili PHP. Instalirai Python i startirai otnovo.
pause
