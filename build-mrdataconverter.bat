@echo off
:: Download AjaxMin.exe from http://ajaxmin.codeplex.com/releases
AjaxMin.exe -clobber css\cssreset.css css\converter.css -out css\styles.min.css
AjaxMin.exe -inline:no -clobber -term js\CSVParser.js js\DataGridRenderer.js js\Converter.js js\Controller.js -out js\app.js
echo Done!
pause