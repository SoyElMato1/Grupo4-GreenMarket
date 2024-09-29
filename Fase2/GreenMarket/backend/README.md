# Instalacion de Parte Backend
Para iniciar el proyectos, primero tenemos que instalar las dependencias del proyecto:

- Para instalar estas dependencias en la terminal ingresar:

        activate.bat

    Esto servira para instalar las dependencias e instalar y activar el entorno virtual.

# Instalar MariaDB Server
En el google buscar mariadb server, y ingresar en el primer link.

![Ingresar en el link](./img_readme/Captura%20de%20pantalla%202024-09-29%20121459.png)

- Descargar la version que nos acomode segun nuestro computador, esta nos detecta la version mas acomodada para nuestros PC.

- Una vez descargado, hacer doble click al archivo y ingresar next hasta el final.
    - Opcional, puedes eleguir la carpeta en donde quieres instalar el mariaDB

Una vez ya instalado, ejecutamos la aplicacion instalada llama HeidiSQL

![Ingresar en el link](./img_readme/Captura%20de%20pantalla%202024-09-29%20122146.png)

En esta ingresamos una nueva sesion:

![Ingresar en el link](./img_readme/Captura%20de%20pantalla%202024-09-29%20122343.png)

- Ponemos el nombre de la sesion 
- Nombre del host/ip 
- El usuario por defecto es root, a este ponemos poner una contraseña, la cual seria la que pusimos cuando instalamos mariaDB.
- El puerto por defecto es root, si guntan pueden cambiar el puerto, para que no les cause ningun problema, por si tienen instalado oracle en sus pc's.

Una vez realizado esto, presionamos en guardar y en abrir.

![Ingresar en el link](./img_readme/Captura%20de%20pantalla%202024-09-29%20123033.png)

En la ventada, hacemos click derecho al nombre de la sesión, para crear una nueva base de datos

![Ingresar en el link](./img_readme/Captura%20de%20pantalla%202024-09-29%20123142.png)

Ingresamos el Nombre de la base de datos y la collation.

![Ingresar en el link](./img_readme/Captura%20de%20pantalla%202024-09-29%20123208.png)

Luego de esto, solo faltaria vincularlo con el backend

![Ingresar en el link](./img_readme/Captura%20de%20pantalla%202024-09-29%20123356.png)

Para luego en la terminal poner lo siguiente:

## Migraciones
- Primero identificar si hay modelos creados, si hay modelos ingresar el siguiente comando:

        python manage.py makemigrations

- Para identificar los modelos creados. Despues de esto ingresar el siguiente comando:

        python manage.py migrate

- Para migrar los modelos a la base de datos.

## Ejecución
- Ya que el entorno virtual ya esta activado y las dependencias intaladas, ejecute el siguiente comando para iniciar el proyecto:

        python manage.py runserver (numero de puerto opcional)

- El numero de puerto es opcional. Si no ingresa ningun puerto, por defecto el proyecto se ejecutara en el puerto 8000 en el localhost.