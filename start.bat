@echo off
chcp 65001 >nul
title 润润的三年级闯关营

rem 双击这个文件启动。
rem 用它打开，学习记录才会存成 save\润润.json 这个真文件，
rem 才能通过云盘同步到别的电脑上。
rem （直接双击 index.html 也能玩，但记录只在这个浏览器里，换电脑带不走。）

cd /d "%~dp0"

where python >nul 2>nul
if errorlevel 1 goto NOPYTHON

start "" http://localhost:8899/index.html
python serve.py
goto END

:NOPYTHON
echo.
echo   这台电脑上没有找到 python。
echo.
echo   没有 python 也能用，只是记录只能存在浏览器里，换电脑带不走。
echo   想要跨电脑同步的话，去 python.org 装一个 Python 就行
echo   （安装时记得勾上 "Add Python to PATH"）。
echo.
echo   现在先用普通方式打开。
echo.
pause
start "" "index.html"

:END
