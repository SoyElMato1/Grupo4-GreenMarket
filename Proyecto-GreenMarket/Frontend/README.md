# Instalacion de Parte Frontend
## Preparación de ambiente de desarrollo
Para poder trabajar con **Angular** y **Ionic** es necesario instalar **Node**, el cual, es un entorno de desarrollo para javascripts fuera del navegador. 

Al momento de trabajar con **Nodejs** eventualmente necesitaremos trabajar con diversas versiones de este, y este proceso se puede volver muy tediosos cuando tenemos muchos proyectos que corren diferentes versiones de node, ya sea por las dependencias o restricciones del proyecto.

Para ello, instalaremos la herramienta Node Version Manager por sus sigas **NVM** el cual, nos permitirá gestionar las diversas versiones de Nodejs que tengamos, con un archivo llamado **“.nvmrc”** que crearemos junto a nuestro proyecto. El cual definirá la versión de Nodejs que requiere para funcionar.

Podemos instalar dicha herramienta siguiente los siguientes pasos:

### Instalar NVM Windows 

#### Paso 1

Descargar **NVM** para Windows del siguiente repositorio https://github.com/coreybutler/nvm-windows/releases procurar bajar la última versión disponible para Windows en el archivo llamado “nvm-setup.exe”

#### Paso 2

Una vez descargado, procederemos a instalarlo, acetando los acuerdos y condiciones para después darle siguiente, siguiente, hasta que termine el proceso.
En caso de abrir un recuadro emergente, darle aceptar, para proceder con la instalación.

#### Paso 3

Verificar la instalación usando el CMD nuevo, deberá ejecutar el siguiente comando:
```CMD
nvm version
```
con el comando deberá mostrar la versión de la herramienta por el CMD

![nvm version](./img_readme/Captura%20de%20pantalla%202024-09-29%20133733.png)

Con dicha herramienta instalada ya estamos listos para poder gestionar nuestras versiones de node.

### Instalar node

#### Windows

Para instalar node con nvm en Windows ejecutaremos el siguiente comando.

```bash
nvm install lts
```

Con esto instalaremos la última versión con soporte a largo plazo (LTS)

![Instalando Windows](./img_readme/Captura%20de%20pantalla%202024-09-29%20134025.png)

Una vez descargado, procederemos a ejecutar el comando que nos muestra en un nuevo CMD como administrador.
```bash
nvm use <version>
```
* Reemplazar <**version**> con la versión que nvm acaba de instalar.

![NVM use Windows](./img_readme/Captura%20de%20pantalla%202024-09-29%20134204.png)

Con esto, ya tenemos **node** instalado y podemos comprobarlo preguntando su versión, con el comando 
```bash
node --version
```
![Node version Windows](./img_readme/Captura%20de%20pantalla%202024-09-29%20134357.png)

### Instalar Angular

Al momento que se instala **node**, se instala una herramienta llamada **NPM** (Node Package Manager), el cual, nos sirve para instalar dependencias de forma global, para desarrollo o de nuestros proyectos, podemos comprobar la versión instalada, con el siguiente comando.

```bash
npm --version
```
![NPM version](./img_readme/Captura%20de%20pantalla%202024-09-29%20134520.png)

Se puede actualizar la herramienta, con el siguiente comando:

```bash
npm install -g npm@latest
```

Para instalar **Angular**, lo podemos hacer con el siguiente comando.

```bash
npm install -g  @angular/cli
```

Una vez finalizado, podemos comprobar la instalación con el siguiente comando.

```bash
ng version
```
![Angular CLI](./img_readme/Captura%20de%20pantalla%202024-09-29%20134650.png)

Se desplegará toda la información sobre el **Angular CLI** y dependencias que se instalaron en conjunto.

### Instalar extensiones necesarias en vscode

Para trabajar con angular, se recomienda instalar las siguientes extensiones en Visual Studio Code, el cuales son las siguientes:

1. Angular Language Service<br>
   ![Angular Language Service](./img_readme/Captura%20de%20pantalla%202024-09-29%20134736.png)
2. EditorConfig for VS Code<br>
   ![EditorConfig for VS Code](./img_readme/Captura%20de%20pantalla%202024-09-29%20134742.png)
   
El cual, el primero nos servirá para entregarnos autocorrección en nuestros componentes y ayudas útiles al momento de codificar, y el segundo nos obligará a mantener una sintaxis similar entre los integrantes del proyecto.

### Instalar Ionic
Con la misma herramienta con la cual instalamos angular, instalamos **Ionic**

```bash
npm install -g @ionic/cli
```
![Ionic CLI](./img_readme/Captura%20de%20pantalla%202024-09-29%20135701.png)

comprobar la version instalada de ionic

![Ionic version](./img_readme/Captura%20de%20pantalla%202024-09-29%20135904.png)

# Si ya tienes todo instalado, realiza esto:

Instala las dependencias: Ejecuta el siguiente comando para instalar todas las dependencias listadas en el archivo **package.json**. Esto generará la carpeta **node_modules**.

```bash
npm install
```
Verifica la instalación: Una vez que la instalación haya finalizado, puedes iniciar tu proyecto para asegurarte de que todo funcione correctamente:

```bash
ionic serve
```
