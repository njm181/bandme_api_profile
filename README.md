# bandme_api_profile

Para levantar el proyecto de forma local se deben realizar los siguientes pasos:
1. Clonar el repositorio
2. Correr alguno de los siguientes comandos npm install o yarn install (Se debe contar con alguno de estos gestores de paquetes previamente instalados)
3. Generar un archivo .env en la raiz del proyecto (por fuera de cualquier carpeta) y dentro agregar dos variables en mayusculas
  a. PORT = 8081
  b. MONGO_URI = string de conexion se encuentra dentro de la documentacion entregada
4. (Opcional) Se puede descargar MongoDBCompass e iniciar sesion con el mismo string de conexion para poder verificar los datos almacenados
5. Finalmente se debe correr el comando node app para iniciar la api localmente
