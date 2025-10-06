# APIWeather+JWT

## Descripción del Proyecto

**APIWeather+JWT** es una aplicación desarrollada en **Node.js** y **Express** que implementa autenticación mediante **JSON Web Tokens (JWT)** y consumo de una **API externa de clima (OpenWeather API)**.  
El sistema permite a los usuarios autenticarse, obtener un token JWT válido por una hora y utilizarlo para acceder a rutas protegidas que consultan información meteorológica de diferentes ciudades.

Este proyecto cumple con los requisitos técnicos de autenticación, protección de rutas, integración con un servicio externo y manejo adecuado de errores.

---

## Requisitos Previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

- **Node.js** v16 o superior  
- **npm** (instalado junto con Node.js)
- **Conexión a internet** (para acceder a la API de OpenWeather)

---

## Instalación

1. Clonar el repositorio o copiar los archivos del proyecto:

   ```bash
   git clone https://github.com/usuario/APIWeather-JWT.git
   cd APIWeather-JWT
   ```

2. Instalar las dependencias necesarias:

   ```bash
   npm install
   ```

3. Crear un archivo `.env` o configurar un archivo `config/config.js` con las siguientes variables:

   ```javascript
   module.exports = {
     jwtSecret: 'clave_secreta',
     openWeatherKey: 'tu_api_key_aqui'
   };
   ```

4. Iniciar el servidor:

   ```bash
   npm start
   ```

   El servidor quedará disponible en:
   ```
   http://localhost:3000
   ```

---

## Estructura del Proyecto

```bash
APIWeather+JWT/
│
├── controllers/
│   ├── authController.js
│   └── weatherController.js
│
├── middleware/
│   └── authMiddleware.js
│
├── routes/
│   ├── authRoutes.js
│   └── weatherRoutes.js
│
├── config/
│   └── config.js
│
├── public/
│   └── client.html
│
├── app.js
├── package.json
└── README.md
```

---

## Endpoints Disponibles

### 1. **POST /auth/login**

**Descripción:**  
Autentica al usuario y devuelve un JWT válido por 1 hora.

**Credenciales válidas:**
```json
{
  "username": "admin",
  "password": "secret"
}
```

**Respuesta exitosa (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
}
```

**Errores posibles:**
- 401 - Credenciales inválidas
- 500 - Error interno del servidor

---

### 2. **GET /weather/:city**

**Descripción:**  
Obtiene los datos del clima actual de una ciudad, consultando la API pública de **OpenWeather**.

**Requiere token JWT en el encabezado Authorization:**
```
Authorization: Bearer <token>
```

**Ejemplo de solicitud:**
```
GET http://localhost:3000/weather/London
```

**Ejemplo de respuesta:**
```json
{
  "city": "London",
  "temperature": 15,
  "description": "Cloudy",
  "humidity": 78
}
```

**Errores posibles:**
- 401 - Token requerido
- 403 - Token inválido o expirado
- 404 - Ciudad no encontrada
- 500 - Error al consultar el servicio externo

---

## Middleware de Autenticación (JWT)

El middleware `authMiddleware.js` se encarga de validar el token JWT antes de permitir el acceso a rutas protegidas.

```javascript
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/config');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token requerido.' });
  }

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token invalido o inesperado.' });
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
```

Todas las rutas que consumen datos externos están protegidas con este middleware.

---

## Pruebas con Postman

### 1. Login
- **Método:** `POST`
- **URL:** `http://localhost:3000/auth/login`
- **Body (JSON):**
  ```json
  {
    "username": "admin",
    "password": "secret"
  }
  ```
- **Respuesta:** token JWT válido

---

### 2. Consultar clima
- **Método:** `GET`
- **URL:** `http://localhost:3000/weather/London`
- **Headers:**
  ```
  Authorization: Bearer <token>
  ```
- **Respuesta:** datos del clima en formato JSON

---

## Uso desde Client.html

El archivo `public/client.html` ofrece una interfaz web simple para interactuar con la API:

1. **Login:**  
   Ingresar usuario y contraseña (`admin` / `secret`) y presionar “Conectar”.  
   Si las credenciales son correctas, se almacena el token JWT.

2. **Consultar Clima:**  
   Ingresar el nombre de la ciudad y presionar “Consultar”.  
   El sistema enviará la solicitud con el token JWT en el encabezado y mostrará los datos del clima en pantalla.  

3. **Manejo de errores:**  
   Si el token expira o la ciudad no existe, se mostrará un mensaje descriptivo en el panel “Detalle”.

---

## Manejo de Errores

El servidor devuelve mensajes claros y códigos HTTP adecuados:

| Código | Descripción |
|--------|--------------|
| 200 | Respuesta exitosa |
| 401 | Token requerido o credenciales incorrectas |
| 403 | Token inválido o expirado |
| 404 | Ciudad no encontrada |
| 500 | Error interno o conexión fallida con OpenWeather |

---

## Dependencias Principales

```json
"dependencies": {
  "axios": "^1.x",
  "dotenv": "^16.x",
  "express": "^4.x",
  "jsonwebtoken": "^9.x",
  "nodemon": "^3.x"
}
```

---

## Notas Adicionales

- El token JWT tiene una duración de **1 hora**.  
- Todas las rutas relacionadas con datos externos están protegidas mediante el middleware JWT.  
- Si la conexión con la API de OpenWeather falla, se devuelve un mensaje de error controlado.  
- El proyecto puede ejecutarse tanto desde **Postman** como desde el **Client.html** incluido.

---

## Autor

Proyecto desarrollado por **G. Mirarchi**  
Examen Técnico: API JWT + OpenWeather (Node.js / Express)
