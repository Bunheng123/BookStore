@echo off
REM Start PHP built-in server bound to localhost:8000
REM Usage: serve-backend.bat
cd /d %~dp0\..\
php -S localhost:8000 index.php
