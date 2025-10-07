# APIWeather+JWT

## Descripción del Proyecto

**APIWeather+JWT** es una aplicación desarrollada en **Node.js** y **Express** que implementa autenticación mediante **JSON Web Tokens (JWT)** y consumo de una **API externa de clima (OpenWeather API)**.  
El sistema permite a los usuarios autenticarse, obtener un token JWT válido por una hora y utilizarlo para acceder a rutas protegidas que consultan información meteorológica de diferentes ciudades.

Además, la API incluye un endpoint `/health` para verificar su estado y estadísticas básicas del servidor.

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

3. Crear un archivo `.env` con las siguientes variables:

   ```env
   PORT=3000
   JWT_SECRET=<YOUR_SECRET>
   OPENWEATHER_API_KEY=<YOUR_API_KEY>
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
├── utils/
│   └── users.js
│   └── client.html
│
├── config/
│   └── config.js
│
├── app.js
├── package.json
└── README.md
```

---

## Endpoints Disponibles

### 1. **GET /**

**Descripción:**  
Endpoint raíz de verificación.  
Devuelve un mensaje confirmando que la API está operativa.

**Ejemplo de respuesta (200):**
```json
{
  "message": "APIWeather+JWT is running correctly."
}
```

---

### 2. **GET /health**

**Descripción:**  
Devuelve estadísticas básicas del servidor (uptime, memoria utilizada y puerto activo).

**Ejemplo de respuesta (200):**
```json
{
  "status": "OK",
  "uptime": "123.45s",
  "memoryUsage": "32.5 MB",
  "port": 3000
}
```

---

### 3. **POST /auth/login**

**Descripción:**  
Autentica al usuario y devuelve un JWT válido por 1 hora.

**Credenciales válidas (por defecto):**
```json
{
  "username": "admin",
  "password": "secret"
}
```

> Las contraseñas se almacenan de forma segura utilizando **bcrypt** para hashing y comparación segura.

**Respuesta exitosa (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
}
```

**Errores posibles:**
- 400 - Usuario o contraseña no proporcionados
- 401 - Credenciales inválidas
- 500 - Error interno del servidor

---

### 4. **GET /auth/profile**

**Descripción:**  
Devuelve la información del usuario autenticado, validando el JWT recibido.

**Headers requeridos:**
```
Authorization: Bearer <token>
```

**Ejemplo de respuesta:**
```json
{
  "username": "admin",
  "role": "user"
}
```

---

### 5. **GET /weather/:city**

**Descripción:**  
Obtiene los datos del clima actual de una ciudad, consultando la API pública de **OpenWeather**.

**Headers requeridos:**
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
    if (err) return res.status(403).json({ message: 'Token inválido o expirado.' });
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
   Si el token expira, la ciudad no existe o falta el token, se mostrará un mensaje descriptivo en el panel “Detalle”.

---

## Manejo de Errores

El servidor devuelve mensajes claros y códigos HTTP adecuados:

| Código | Descripción |
|--------|--------------|
| 200 | Respuesta exitosa |
| 400 | Faltan datos obligatorios |
| 401 | Token requerido o credenciales incorrectas |
| 403 | Token inválido o expirado |
| 404 | Ciudad no encontrada |
| 500 | Error interno o conexión fallida con OpenWeather |

---

## Dependencias Principales

```json
"dependencies": {
  "axios": "^1.x",
  "bcryptjs": "^2.x",
  "dotenv": "^16.x",
  "express": "^4.x",
  "jsonwebtoken": "^9.x",
  "nodemon": "^3.x"
}
```

---

## Notas Adicionales

- El token JWT tiene una duración de **1 hora**.  
- Las contraseñas se gestionan mediante **bcrypt** para mayor seguridad.  
- Incluye un endpoint `/health` para verificar el estado del servidor.  
- Si la conexión con la API de OpenWeather falla, se devuelve un mensaje de error controlado.  
- Puede utilizarse desde **Postman** o el **Client.html** incluido.

---

## Autor

Proyecto desarrollado por **G. Mirarchi**  
© 2025 - APIWeather+JWT
