# Grupo4-GreenMarket

## Descripcion del proyecto
GreenMarket es una plataforma que busca ofrecer un espacio con herramientas para que los jardineros para que estos puedan vender sus productos, además de aprender gracias a el apoyo de jardenbot un chatbot potenciado con IA , todo esto con el fin de que los jardineros puedan aumentas sus guanacia, dar a concurse a mas publico y que esta profesión gane mas aficionados

## Tecnologias
- Python
- Django
- Rest Framework de django
- Base de datos relacional MariaDB y mysql
- Frontend con Angular-ionic.
- Rasa para la creacion del bot
- Base de datos en la nube: Railway

## Roles en la plataforma
- Usuarios: Este representa al cliente, el cual, puede interactuar con la plataforma de forma normal, accediendo a las funcionalidades de catalogo de proveedores y producto, ver su historial de compra, comprar en la tienda por medio del carrito de compra y tienen la opcion de pagar atravez de transbank.

- Proveedor: Este es el que ofrecerá sus productos a los clientes, ellos pueden agregar, eliminar, modificar sus productos, además de hacer lo mismo que el cliente, con la diferencia de que el, debera iniciar sesión para poder ofrecer sus productos.

- Administrador: Esta rol cumple la función de mantener la gestión y dar soporte en la plataforma, el no puede agregar productos ni nada, pero si puede eliminar proveedores, agregarlos y generar reportes.

![Pagina Inicio](./Proyecto%20GreenMarket/Frontend/img_readme/image.png)

## Apartados:

- Inicio Sesion: Una vez registrado el cliente presionando el botón de inicio de sesión aquí, se desplegara los campos en dónde al rellenarlos con su Rut y contraseña este accederá a su perfil.
- Registro de proveedores: Al presionar el apartado de inicio de sesión se desplegara el registro de usuario, en el cual al rellenar los campos y estar todo correctamente, se habilitara la cuenta de proveedor, para lo que el usuario tendrá que presionar el botón de inicio sesión aquí de color amarillo.
- Catalogo de Proveedores: Al presionar el apartado de proveedores se desplegara la lista de los proveedores, en la cual uno podrá ver los productos destacados del proveedor
- Catalogo de Productos: Al presionar el apartado de productos, se desplegara la lista de los productos que se encuentran disponibles en la plataforma, de forma que uno puede presionar el botón de agregar si es que lo desea comprar o ver el detalle del producto. si uno presiona el botón de agregar este se añadiera al carro mostrando un mensaje de confirmación que se añadió.
- Carrito de compras: Al presionar el icono que se encuentra en el menú de arriba, se desplegará el carrito, en el cual se observa junto a un formulario en que se ingresan los datos del cliente a la hora de queréis finalizar una compra la cual se hace cuándo el cliente presiona el botón de agregar de catálogo del producto los cuales se muestran en el carrito.
- Historial de compra: Al seleccionar el apartado de "Historial de Compras", se desplegará un formulario que solicita el RUT y contraseña del cliente. Este formulario se completará con los datos proporcionados durante la compra. Al enviar el formulario, aparecerá una tabla con los detalles de las compras realizadas, incluyendo:
    - Fecha de la compra
    - Estado de la transferencia (aceptada o rechazada)
    - Artículos comprados
    - Total, cantidad y precio de cada artículo
- Integración de sistema de pago: En el momento de que el carrito se encuentre con productos y el cliente desee comprarlos, se realizara el llenado del formulario que se encuentra al lado derecho del epatado del carrito de compras, al presionar pagar, Si los datos son correctos se realizara la confirmación y se desplegara la pantalla de pago de Transbank, la cual pedirá los datos correspondientes a la tarjeta del usuario, en lo que el tendrá que llenar para realizar para validar su compra.

- Funciones del Jardenbot: 

    JardenBot es una herramienta innovadora diseñada para facilitar la experiencia de los usuarios en el mundo de la jardinería. Su funcionalidad principal es ofrecer información detallada y precisa sobre plantas limitadas, proporcionando datos completos sobre cada especie de manera rápida y fácil de entender.
    Además, JardenBot permite consultar los productos disponibles en venta, brindando información sobre qué proveedor ofrece cada artículo y sus datos de contacto. La experiencia es aún más intuitiva, ya que los usuarios pueden agregar plantas fácilmente mencionando el nombre de la especie, y JardenBot calculará automáticamente la cantidad y el total de la compra.
    Por último, JardenBot cuenta con una característica única: puede analizar imágenes de plantas enviadas por los usuarios y proporcionar el nombre de la especie a la que corresponde. Todo esto hace de JardenBot una herramienta imprescindible para los amantes de la jardinería, combinando funcionalidad y facilidad de uso en un solo lugar.
    - Procesar fotos: Jardenbot puede procesar imagen de plantas, la cual se ejecuta presionando su botón al lado de donde se escribe lo cual dejará seleccionar la foto que se desee enviar para luego habilitar el botón de enviar.
    - Consultar proveedores: En este caso se le puede consultar por proveedores que están dentro de la pagina, como los proveedores, o casos mas especificas como que proveedor trae cierta planta.
    - Información extra de productos: La informacion extra, sera ofrecida por el bot, esta dara toda la informacion necesaria sobre la planta seleccionada mientras el usuario le indique.
    - Agregar productos al carrito: Jarden bot puede agregar productos al carrito directamente desde su interfaz el cual el usuario le indique.
    - Consulta productos existentes: Jarden bot puede indicar los productos disponibles para la compra desde su interfaz mientra el usuario lo indique.
