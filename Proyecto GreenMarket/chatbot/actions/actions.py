# This files contains your custom actions which can be used to run
# custom Python code.
#
# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/custom-actions


# This is a simple example for a custom action which utters "Hello World!"

# from typing import Any, Text, Dict, List
#
# from rasa_sdk import Action, Tracker
# from rasa_sdk.executor import CollectingDispatcher
#
#
# class ActionHelloWorld(Action):
#
#     def name(self) -> Text:
#         return "action_hello_world"
#
#     def run(self, dispatcher: CollectingDispatcher,
#             tracker: Tracker,
#             domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
#
#         dispatcher.utter_message(text="Hello World!")
#
#         return []


#from backend.ModeloGreenMarket.models import Proveedor, Producto

from django.db import models
import json
from typing import Any, Dict, List, Text
from rasa_sdk import Action
from rasa_sdk.events import SlotSet
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk import Tracker
import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input, decode_predictions
from tensorflow.keras.preprocessing.image import load_img, img_to_array
import numpy as np
from PIL import Image
import os
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D
from tensorflow.keras.models import Model
from tensorflow.keras.optimizers import Adam
import requests








API_PRODUCTOS = "http://127.0.0.1:8000/modelo/producto/"
API_PROVEEDORES = "http://127.0.0.1:8000/modelo/provee/"




class ActionGetPlantInfo(Action):
    def name(self) -> Text:
        return "action_get_plant_info"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        plant_name = tracker.get_slot('plant_name')
        if not plant_name:
            dispatcher.utter_message(text="No mencionaste el nombre de la planta.")
            return [SlotSet("plant_name", None)]

        try:
            # Cargar datos del JSON
            with open('data/plantas.json', encoding="utf-8") as f:
                plantas_data = json.load(f)

            # Búsqueda exacta de la planta
            planta_encontrada = next(
                (plant for plant in plantas_data.get('plants', [])
                if plant['name'].strip().lower() == plant_name.strip().lower()),
                None
            )

            if planta_encontrada:
                details = planta_encontrada['details']
                
                # Formatear la respuesta
                response = self.format_plant_info(
                    plant_name,
                    details['description'],
                    details['care']['requirements'],
                    details['care']['water_frequency'],
                    details['special_needs'],
                    details['sunlight'],
                    details['climate']
                )
                
                dispatcher.utter_message(text=response)
            else:
                dispatcher.utter_message(text=f"No tengo información sobre la planta '{plant_name}'.")

        except Exception as e:
            dispatcher.utter_message(text=f"Ocurrió un error inesperado: {e}")

        # Reinicia el slot plant_name después de cada consulta
        return [SlotSet("plant_name", None)]

    def format_plant_info(self, plant_name: str, description: str, care: str, watering: str, special_needs: str, sun_exposure: str, climate: str) -> str:
        response = (
            f"🌿 **Información sobre {plant_name.capitalize()}** 🌿\n\n"
            f"🌱 **Descripción:** {description}\n\n"
            f"🛠️ **Cuidados básicos:**\n   - {care}\n"
            f"💧 **Riego:**\n   - {watering}\n"
            f"🌞 **Exposición al sol:**\n   - {sun_exposure}\n"
            f"🌡️ **Clima adecuado:**\n   - {climate}\n"
            f"✨ **Necesidades especiales:**\n   - {special_needs}\n\n"
            f"¡Espero que esta información te sea útil! 🌻"
        )
        return response
    

'''''''''''''''
num_classes = 5



# Cargar MobileNetV2 con pesos pre-entrenados, sin incluir la capa superior
base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=(224, 224, 3))

# Congelar capas base
for layer in base_model.layers:
    layer.trainable = False

# Añadir capas personalizadas
x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dense(1024, activation='relu')(x)
predictions = Dense(num_classes, activation='softmax')(x)

# Crear modelo final
model = Model(inputs=base_model.input, outputs=predictions)

# Compilar el modelo
model.compile(optimizer=Adam(lr=0.0001), loss='categorical_crossentropy', metrics=['accuracy'])

# Preparar generadores de datos
train_datagen = ImageDataGenerator(rescale=1./255)
train_generator = train_datagen.flow_from_directory('ruta/a/tu/dataset/train', target_size=(224, 224), batch_size=32, class_mode='categorical')

# Entrenar el modelo
model.fit(train_generator, epochs=10)
model.save('modelo_reconocimiento_plantas.h5')

class ActionListarProductos(Action):
    def name(self) -> str:
        return "action_listar_productos"

    def run(self, dispatcher: CollectingDispatcher, tracker, domain):
        try:
            response = requests.get(API_PRODUCTOS)
            productos = response.json()

            if productos:
                lista_productos = "\n".join([f"- {prod['nombre_producto']}" for prod in productos])
                mensaje = f"Estos son los productos disponibles:\n{lista_productos}"
            else:
                mensaje = "No hay productos disponibles en este momento."

        except Exception as e:
            mensaje = "Ocurrió un error al intentar obtener los productos."

        dispatcher.utter_message(text=mensaje)
        return []
'''''''''

class ActionProveedorProducto(Action):
    def name(self) -> str:
        return "action_proveedor_producto"

    def run(self, dispatcher: CollectingDispatcher, tracker, domain):
        producto_buscado = next(tracker.get_latest_entity_values("producto"), None)

        if not producto_buscado:
            dispatcher.utter_message(text="No entendí qué producto estás buscando. ¿Puedes repetirlo?")
            return []

        try:
            # Obtener productos
            response_productos = requests.get(API_PRODUCTOS)
            productos = response_productos.json()

            # Buscar producto
            producto = next((prod for prod in productos if prod["nombre_producto"].lower() == producto_buscado.lower()), None)

            if not producto:
                mensaje = f"No encontré información del producto {producto_buscado}."
            else:
                # Obtener proveedores
                response_proveedores = requests.get(API_PROVEEDORES)
                proveedores = response_proveedores.json()

                proveedor = next((prov for prov in proveedores if prov["id"] == producto["id_proveedor"]), None)

                if proveedor:
                    mensaje = f"El proveedor del producto {producto_buscado} es {proveedor['nombre']}."
                else:
                    mensaje = f"No encontré un proveedor para el producto {producto_buscado}."
        except Exception as e:
            mensaje = "Ocurrió un error al buscar la información. Inténtalo nuevamente más tarde."

        dispatcher.utter_message(text=mensaje)
        return []
    
class ActionListarProductos(Action):
    def name(self) -> str:
        return "action_listar_productos"

    def run(self, dispatcher: CollectingDispatcher, tracker, domain):
        # Llama a la API para obtener los productos
        response = requests.get("http://127.0.0.1:8000/modelo/producto/")

        if response.status_code == 200:
            productos = response.json()  # Suponiendo que la API devuelve una lista de productos
            lista_productos = "\n".join([f"🌱 **{producto['nombre_producto']}**" for producto in productos])
            dispatcher.utter_message(
                text=(
                    f"🌿 **Productos Disponibles** 🌿\n\n"
                    f"{lista_productos}\n\n"
                    f"¡Elige el que más te guste! 🌟"
                )
            )
        else:
            dispatcher.utter_message(text="Lo siento, no pude obtener la lista de productos.")
        
        return []

class ActionBuscarProveedor(Action):
    def name(self) -> str:
        return "action_buscar_proveedor"

    def run(self, dispatcher, tracker, domain):
         # Obtener el nombre del producto desde el slot
        plant_name = tracker.get_slot("plant_name_proveedor")
        
        if plant_name:
            # Consultar la API o base de datos
            proveedor_info = self.obtener_proveedor(plant_name)
            
            if proveedor_info:
                # Formatear la respuesta del proveedor
                respuesta = (
                    f"🏢 **Información del Proveedor** 🏢\n\n"
                    f"🆔 **RUT:** {proveedor_info.get('rut', 'No disponible')}-{proveedor_info.get('dv', 'No disponible')}\n"
                    f"📧 **Correo Electrónico:** {proveedor_info.get('correo_electronico', 'No disponible')}\n"
                    f"👤 **Nombre:** {proveedor_info.get('nombre', 'No disponible')} {proveedor_info.get('apellido', 'No disponible')}\n"
                    f"✨ Si necesitas más ayuda, no dudes en preguntar. 🌟"
                )
                dispatcher.utter_message(text=respuesta)
            else:
                dispatcher.utter_message(
                    text=f"No encontré un proveedor asociado al producto '{plant_name}'."
                )
        else:
            dispatcher.utter_message(
                text="No entendí el nombre del producto. ¿Puedes repetirlo?"
            )
        
        return []

    def obtener_proveedor(self, plant_name):
        try:
            # Reemplaza con la URL de tu API de proveedores
            url = f"http://127.0.0.1:8000/modelo/provee/?planta={plant_name}"
            response = requests.get(url)
            
            if response.status_code == 200:
                data = response.json()
                # Verifica que haya resultados y devuelve el primero
                if data:
                    return data[0]
            return None
        except Exception as e:
            print(f"Error al consultar la API: {e}")
            return None