@REM Creacion del Proyecto
@echo off
@REM nombre del entorno virtual
set "nombre_entorno=InteriorG"

@REM Creacion del entorno virtual
python -m venv %nombre_entorno%

@REM Activar entorno virtual
call %nombre_entorno%\Scripts\activate.bat

@REM Instalar dependencias
pip install -r requirements.txt