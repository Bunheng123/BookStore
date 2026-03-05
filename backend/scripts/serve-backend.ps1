# Start the PHP built-in server bound to localhost:8000
# Usage: .\serve-backend.ps1
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
Push-Location $scriptDir\..\
php -S localhost:8000 index.php
Pop-Location
