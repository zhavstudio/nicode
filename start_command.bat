@echo off
cd /d C:\xampp\htdocs\nicode

rem Start the Reverb service in a new background window
start "" /B cmd /c "php artisan reverb:start"

rem Start the Queue listener in a new background window
start "" /B cmd /c "php artisan queue:listen"
