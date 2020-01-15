del aoz-x86.exe
del aoz-x64.exe
REM del aoz-win-x86.exe
del aoz-macos
REM del aoz-linux

cd compiler
call pkg --out-path ./.. --targets win,x86 aoz.js
call pkg --out-path ./.. --targets linux,x86 aoz.js
call pkg --out-path ./.. --targets linux,x64 aoz.js
call pkg --out-path ./.. --targets macos aoz.js
cd ..

timeout 1
del aoz-win.exe
del aoz-win-x86.exe
ren aoz-linux aoz-linux-x86
ren aoz aoz-macos
