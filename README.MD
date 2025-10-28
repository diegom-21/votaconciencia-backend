# VotaConCiencia - Backend

Sistema de gestión de información electoral para Perú.

## 🚀 Instalación Rápida

### Requisitos Previos
- Node.js (v14 o superior)
- MySQL Server (v8.0 o superior)
- npm o yarn

### Paso 1: Clonar el Repositorio
```bash
git clone <tu-repositorio>
cd votaconciencia/backend
```

### Paso 2: Instalar Dependencias
```bash
npm install
```

### Paso 3: Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto backend con el siguiente contenido:

```env
# Configuración de Base de Datos
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña_mysql
DB_DATABASE=votaconciencia_db

# Puerto del Servidor
PORT=3000

# JWT Secret (genera uno aleatorio para producción)
JWT_SECRET=tu_clave_secreta_jwt_muy_segura

# OpenAI API (opcional, para funcionalidad de IA)
OPENAI_API_KEY=tu_api_key_de_openai
```

### Paso 4: Inicializar Base de Datos

**OPCIÓN A - Automático (Recomendado):**

El servidor inicializará automáticamente la base de datos al ejecutarse por primera vez:

```bash
npm start
# o para desarrollo con auto-reload:
npm run dev
```

**OPCIÓN B - Manual:**

Si prefieres inicializar la base de datos manualmente antes de iniciar el servidor:

```bash
npm run setup
```

## ✨ ¿Qué se Crea Automáticamente?

Al ejecutar el proyecto por primera vez, se crearán:

### 📦 Base de Datos
- Nombre: `votaconciencia_db` (según tu `.env`)

### 📋 Tablas
1. `administradores` - Usuarios del panel administrativo
2. `partidos` - Partidos políticos
3. `candidatos` - Información de candidatos
4. `historial_politico` - Trayectoria política de candidatos
5. `temas` - Temas de propuestas (Salud, Educación, etc.)
6. `propuestas` - Propuestas de candidatos por tema
7. `recursos_educativos` - Contenido educativo
8. `eventos_cronograma` - Cronograma electoral
9. `trivia_temas` - Categorías de trivia
10. `trivia_preguntas` - Preguntas de trivia
11. `trivia_opciones` - Opciones de respuesta

### 👥 Usuarios Administradores por Defecto

**Superadministradores:**
- Email: `superadmin1@votaconciencia.pe`
- Email: `superadmin2@votaconciencia.pe`
- Email: `superadmin3@votaconciencia.pe`
- Contraseña: `superadmin123`

**Editores:**
- Email: `editor1@votaconciencia.pe`
- Email: `editor2@votaconciencia.pe`
- Email: `editor3@votaconciencia.pe`
- Contraseña: `editor123`

⚠️ **IMPORTANTE:** Cambia estas contraseñas inmediatamente en producción.

## 🛠️ Scripts Disponibles

```bash
# Desarrollo con auto-reload
npm run dev

# Producción
npm start

# Inicializar/Resetear base de datos manualmente
npm run setup
```

## 🔐 Credenciales de Acceso

Las credenciales se mostrarán en la consola al iniciar el servidor por primera vez.

## 📝 Notas Importantes

1. **Archivo `.env`**: NO subir a Git. Ya está en `.gitignore`
2. **Carpeta `uploads/`**: NO subir a Git. Contiene archivos de usuarios
3. **Contraseñas por defecto**: Cambiar inmediatamente en producción
4. **Base de datos**: Hacer backups regulares
 