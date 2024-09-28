# Grupo4-GreenMarket

# Descripcion
GreenMarket busca conectar a jardineros y vendedores locales con un mercado más amplio, abordando la falta de opciones en línea para la compra y venta de productos de jardinería. Actualmente, estos vendedores enfrentan dificultades debido a la falta de recursos tecnológicos y conocimiento técnico para manejar plataformas digitales, lo que limita su alcance de clientes y sus oportunidades de negocio. A su vez, los consumidores interesados en productos de jardinería no encuentran una oferta centralizada, lo que dificulta el acceso a una variedad de productos y proveedores. GreenMarket se presenta como una solución integral para facilitar esta conexión, optimizando la experiencia de compra y venta y apoyando la sostenibilidad de los pequeños negocios locales.

# Tecnologias
- Python
- Django
- Rest Framework de django
- Base de datos relacional MariaDB
- Frontend con Angular-ionic.

# Solo para colaboradores del proyecto, Parte Git

Con esto requerimientos cumplidos, procederemos a clonar el proyecto con el siguiente comando

```bash
git clone <enlace>
```
* reemplazar <**enlace**> con la URL del repositorio

al momento hacer un clone, están bajando el historial completo del repositorio, como también, las fuentes remotas configuradas el cual se llamará **origin** por defecto (pueden comprobarlo con el comando ```git remote -v```), por lo tanto, con esto ya configurador puedes hacer un **push** (empujes o subidas de tu historial) o **pull** (traer el historial de internet).

## Continuando con el trabajo colaborativo.

Ya implementado las fuentes remotas o clonado el proyecto, podemos acceder al ciclo de trabajo remoto, el cual continua con los siguientes pasos:

### Paso 1: Hacer un pull.

Este comando nos ayudará a traer todos los cambios que estén en la nube a nuestro repositorio local para implementar el trabajo del equipo, el comando:

```bash
git pull <alias> <rama>
```

* reemplazar <**alias**> con el sobrenombre que tiene tu enlace, los puedes ver con el comando ```git remote -v```.
* reemplazar <**rama**> con el Branch que actualmente estas trabajando, por defecto puede ser **master** o **main**

### Paso 2: implementar los pasos de Git local

Implementar los cambios de trabajo local, el cual el ciclo es el siguiente:

1. Hacer cambios
2. 
```bash
git add .
git add -A
git add <archivo>
``` 
3. 
```bash
git commit -m “mensaje”
```

### Paso 3: Una vez realizado el commit procedemos a subirlo a nuestra plataforma con el comando:

```bash
git push <alias> <rama>
```

* reemplazar <**alias**> con el sobrenombre que tiene tu enlace, los puedes ver con el comando ```git remote -v  ```.
* reemplazar <**rama**> con el Branch que actualmente estas trabajando, por defecto puede ser **master** o **main**

# Instalacion de Parte Backend
Para iniciar el proyectos, primero tenemos que instalar las dependencias del proyecto:

- Para instalar estas dependencias en la terminal ingresar:

        activate.bat

    Esto servira para instalar las dependencias e instalar y activar el entorno virtual.
