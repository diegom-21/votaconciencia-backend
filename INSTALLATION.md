# 🚀 Guía de Instalación - VotaConCiencia Backend

Esta guía te ayudará a configurar el proyecto backend de VotaConCiencia desde cero.

## 📋 Índice
1. [Requisitos Previos](#requisitos-previos)
2. [Instalación Paso a Paso](#instalación-paso-a-paso)
3. [Inicialización Automática](#inicialización-automática)
4. [Verificación](#verificación)
5. [Solución de Problemas](#solución-de-problemas)

---

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

### 1. Node.js
- **Versión mínima:** v14.x (recomendado v18.x o superior)
- **Descargar:** https://nodejs.org/
- **Verificar instalación:**
  ```bash
  node --version
  npm --version
  ```

### 2. MySQL Server
- **Versión mínima:** v8.0
- **Descargar:** https://dev.mysql.com/downloads/mysql/
- **Verificar instalación:**
  ```bash
  mysql --version
  ```
- **Asegúrate de que el servicio MySQL esté ejecutándose**

### 3. Git (opcional, para clonar)
- **Descargar:** https://git-scm.com/

---

## 🔧 Instalación Paso a Paso

### Paso 1: Obtener el Proyecto

**Opción A - Clonar repositorio:**
```bash
git clone https://github.com/tu-usuario/votaconciencia.git
cd votaconciencia/backend
```

**Opción B - Descargar ZIP:**
1. Descarga el proyecto como ZIP
2. Extrae los archivos
3. Navega a la carpeta backend

### Paso 2: Instalar Dependencias

```bash
npm install
```

Este comando instalará todas las dependencias necesarias:
- express
- mysql2
- bcrypt
- jsonwebtoken
- cors
- dotenv
- multer
- openai
- Y más...

**Tiempo estimado:** 1-3 minutos dependiendo de tu conexión

### Paso 3: Configurar Variables de Entorno

1. **Copia el archivo de ejemplo:**
   ```bash
   cp .env.example .env
   ```

2. **Edita el archivo `.env`** con tus credenciales:

   ```env
   # Configuración de MySQL
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=tu_contraseña_mysql
   DB_DATABASE=votaconciencia_db

   # Puerto del servidor (puedes dejarlo en 3000)
   PORT=3000

   # JWT Secret - Clave secreta para autenticación
   JWT_SECRET=genera_una_clave_aleatoria_muy_larga_y_segura

   # OpenAI API (opcional - solo si usarás la IA)
   OPENAI_API_KEY=sk-tu-api-key-aqui
   ```

3. **Genera un JWT Secret seguro** (opcional pero recomendado):
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```
   Copia el resultado y úsalo como `JWT_SECRET`

### Paso 4: Verificar MySQL

Antes de continuar, asegúrate de que MySQL esté corriendo:

**En Windows:**
1. Abre "Servicios" (services.msc)
2. Busca "MySQL80" o similar
3. Asegúrate de que esté "En ejecución"

**En Linux/Mac:**
```bash
sudo service mysql status
# o
sudo systemctl status mysql
```

Si no está corriendo, inícialo:
```bash
sudo service mysql start
```

### Paso 5: Iniciar el Servidor

**¡Aquí es donde ocurre la magia! 🎉**

Simplemente ejecuta:

```bash
npm start
```

o para desarrollo con auto-reload:

```bash
npm run dev
```

---

## ✨ Inicialización Automática

Al ejecutar `npm start` por primera vez, el sistema automáticamente:

### 1️⃣ Crea la Base de Datos
```
📦 Creando base de datos 'votaconciencia_db'...
✅ Base de datos creada o ya existente
```

### 2️⃣ Crea Todas las Tablas
```
📋 Creando tablas...
✅ Tablas creadas exitosamente
```

El sistema crea estas 11 tablas:
- ✅ `administradores`
- ✅ `partidos`
- ✅ `candidatos`
- ✅ `historial_politico`
- ✅ `temas`
- ✅ `propuestas`
- ✅ `recursos_educativos`
- ✅ `eventos_cronograma`
- ✅ `trivia_temas`
- ✅ `trivia_preguntas`
- ✅ `trivia_opciones`

### 3️⃣ Inserta Usuarios Administradores
```
👥 Insertando usuarios administradores por defecto...
✅ Usuarios administradores creados
```

### 4️⃣ Muestra las Credenciales
```
📝 Credenciales de acceso:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SUPERADMINS:
  📧 Email: superadmin1@votaconciencia.pe
  🔑 Contraseña: superadmin123

EDITORES:
  📧 Email: editor1@votaconciencia.pe
  🔑 Contraseña: editor123
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 5️⃣ Inicia el Servidor
```
✅ Servidor corriendo en http://localhost:3000
```

**¡Y eso es todo!** 🎊

---

## ✅ Verificación

### 1. Verificar que el servidor esté corriendo

Abre tu navegador y ve a: http://localhost:3000

Deberías ver:
```json
{
  "message": "API de VotaConCiencia funcionando"
}
```

### 2. Verificar la base de datos

Conéctate a MySQL:
```bash
mysql -u root -p
```

Verifica las tablas:
```sql
USE votaconciencia_db;
SHOW TABLES;
```

Verifica los administradores:
```sql
SELECT nombre, email, rol FROM administradores;
```

### 3. Probar un endpoint

Usando Postman, curl o similar:

```bash
curl http://localhost:3000/api/candidatos
```

Debería devolver una lista (vacía si no hay candidatos):
```json
[]
```

---

## 🆘 Solución de Problemas

### ❌ Error: "ER_ACCESS_DENIED_ERROR"

**Problema:** Credenciales de MySQL incorrectas

**Solución:**
1. Verifica tu archivo `.env`
2. Asegúrate de que `DB_USER` y `DB_PASSWORD` sean correctos
3. Prueba conectarte manualmente:
   ```bash
   mysql -u root -p
   ```

---

### ❌ Error: "ECONNREFUSED"

**Problema:** MySQL no está ejecutándose

**Solución en Windows:**
1. Abre "Servicios" (Win + R → services.msc)
2. Busca "MySQL80"
3. Click derecho → Iniciar

**Solución en Linux/Mac:**
```bash
sudo service mysql start
# o
sudo systemctl start mysql
```

---

### ❌ Error: "Cannot find module..."

**Problema:** Dependencias no instaladas

**Solución:**
```bash
rm -rf node_modules package-lock.json
npm install
```

---

### ❌ Puerto 3000 ya en uso

**Problema:** Otro servicio usa el puerto 3000

**Solución:**
1. Cambia el puerto en `.env`:
   ```env
   PORT=3001
   ```
2. O detén el otro servicio

---

### ❌ Carpeta uploads no existe

**Problema:** Directorio de uploads faltante

**Solución:**
El servidor la crea automáticamente, pero si hay problemas:
```bash
mkdir -p public/uploads/images
```

---

### ⚠️ "Database already exists"

**Esto es NORMAL.** El sistema detecta si la BD ya existe y no la sobrescribe.

Si necesitas **resetear completamente**:
```bash
# ⚠️ ESTO BORRARÁ TODOS LOS DATOS
mysql -u root -p -e "DROP DATABASE votaconciencia_db;"
npm start
```

---

## 🔄 Reinstalación / Setup Manual

Si necesitas volver a ejecutar la inicialización:

```bash
npm run setup
```

Esto ejecuta el script de inicialización sin iniciar el servidor.

---

## 📊 Estructura Creada

```
votaconciencia_db/
├── administradores (6 usuarios predefinidos)
├── partidos (vacía - para llenar desde el admin)
├── candidatos (vacía)
├── historial_politico (vacía)
├── temas (vacía)
├── propuestas (vacía)
├── recursos_educativos (vacía)
├── eventos_cronograma (vacía)
├── trivia_temas (vacía)
├── trivia_preguntas (vacía)
└── trivia_opciones (vacía)
```

---

## 🔐 Seguridad

### Usuarios Predefinidos

El sistema crea 6 usuarios de prueba:

| Tipo | Email | Contraseña |
|------|-------|------------|
| Superadmin | superadmin1@votaconciencia.pe | superadmin123 |
| Superadmin | superadmin2@votaconciencia.pe | superadmin123 |
| Superadmin | superadmin3@votaconciencia.pe | superadmin123 |
| Editor | editor1@votaconciencia.pe | editor123 |
| Editor | editor2@votaconciencia.pe | editor123 |
| Editor | editor3@votaconciencia.pe | editor123 |

⚠️ **IMPORTANTE:**
- Estas son credenciales de DESARROLLO
- Cámbialas INMEDIATAMENTE en producción
- Borra o desactiva las cuentas que no uses

### Mejores Prácticas

1. **Nunca** subas tu archivo `.env` a Git
2. **Cambia** las contraseñas predefinidas
3. **Usa** JWT_SECRET único y aleatorio
4. **Haz** backups regulares de la base de datos
5. **Actualiza** las dependencias regularmente

---

## 📞 Soporte

Si encuentras problemas:

1. **Verifica** esta guía primero
2. **Revisa** los logs en la consola
3. **Consulta** el archivo README.MD principal
4. **Contacta** al equipo de desarrollo

---

## 🎉 ¡Listo!

Si llegaste hasta aquí sin errores, **¡felicidades!** 

Tu servidor VotaConCiencia está:
- ✅ Instalado
- ✅ Configurado
- ✅ Con base de datos inicializada
- ✅ Con usuarios de prueba
- ✅ Listo para usar

Ahora puedes:
1. Iniciar el frontend del administrador
2. Loguearte con las credenciales
3. Comenzar a agregar candidatos y contenido

**¡Buen desarrollo! 🚀**
