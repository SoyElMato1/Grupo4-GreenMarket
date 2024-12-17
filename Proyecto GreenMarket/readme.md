# Parte backend y Frontend
Antes de subir todo lo desarrollado, tenemos que sacar la carpeta generada por el virtualenv, en el backend y en el Fronted sacar la carpeta node_modules.

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
* reemplazar <**rama**> con el Branch que actualmente estas trabajando, por defecto puede ser **master** o **main**.