# Ejecutar el chatbot.
primero es ir a la carpeta del chatbot:

- luego ingresar el siguiente comando:

        poner en la terminal activate.bat

- Este les instalara todo lo necesario para ejecutar el chatbot

- Deben hacer el rasa train

        rasa train

- Luego ejecutar el chatbot:

        rasa run --enable-api --cors "http://localhost:8100"

- y por último el raza run actions

        rasa run actions