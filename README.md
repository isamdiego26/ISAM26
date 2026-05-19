# ESEN — Sistema de Actividades Extracurriculares

Aplicativo web para el registro, gestión y consulta de actividades extracurriculares estudiantiles, desarrollado con metodología OOHDM.

## 🚀 Demo rápida

Abre `index.html` en tu navegador o despliégalo en cualquier servidor web estático.

## 👤 Credenciales de acceso

| Rol           | Usuario | Contraseña |
|---------------|---------|------------|
| Administrador | `admin` | `admin123` |
| Estudiante    | `EST001`| `123456`   |
| Estudiante    | `EST002`| `123456`   |
| Estudiante    | `EST003`| `123456`   |

## 📁 Estructura del proyecto

```
esen-app/
├── index.html              # Página principal
├── assets/
│   ├── css/
│   │   └── style.css       # Estilos del sistema
│   └── js/
│       ├── data.js         # Datos: usuarios, estudiantes y actividades
│       └── app.js          # Lógica principal de la aplicación
└── README.md
```

## ✅ Funcionalidades por rol

### Administrador (RF01–RF08)
- Login con autenticación por usuario y contraseña
- Dashboard con estadísticas en tiempo real
- **Registrar** nuevas actividades extracurriculares (categoría, fecha, resolución, horas, estudiantes)
- **Modificar** datos de actividades existentes
- **Eliminar** actividades con confirmación
- **Filtrar** por búsqueda, categoría y año
- Visualizar relación de estudiantes por actividad con horas acumuladas
- Generar reportes agrupados por categoría y fecha

### Estudiante (RF09–RF10)
- Visualizar actividades extracurriculares clasificadas por tipo, fecha y resolución
- Consultar historial de participación con horas acumuladas validadas

## 🎨 Tecnologías

- **HTML5** — Estructura semántica
- **CSS3** — Variables CSS, diseño responsive, animaciones
- **JavaScript ES6+** — Lógica de negocio sin dependencias externas
- **Google Fonts** — Plus Jakarta Sans + Fraunces

## 🌐 Despliegue

### GitHub Pages
1. Sube el repositorio a GitHub
2. Ve a **Settings → Pages**
3. En *Source*, selecciona la rama `main` y carpeta `/ (root)`
4. Guarda. En unos minutos tendrás una URL tipo `https://tuusuario.github.io/esen-app/`

### Netlify (drag & drop)
1. Entra a [netlify.com](https://netlify.com)
2. Arrastra la carpeta `esen-app/` al área de despliegue
3. ¡Listo! Netlify te da una URL pública al instante

### Servidor Apache / Nginx
Copia el contenido de `esen-app/` en la carpeta raíz del servidor:
```bash
# Apache
cp -r esen-app/* /var/www/html/

# Nginx
cp -r esen-app/* /usr/share/nginx/html/
```

### Vercel
```bash
npm install -g vercel
cd esen-app
vercel --prod
```

## 📋 Requerimientos no funcionales

| Código | Descripción | Estado |
|--------|-------------|--------|
| RNF01  | Interfaz visualmente agradable | ✅ |
| RNF02  | Interfaz intuitiva y fácil de usar | ✅ |
| RNF03  | Disponible 24/7 (sitio estático) | ✅ |

## 🔧 Extensión a backend real

Para conectar una base de datos real, modifica `assets/js/data.js` y `assets/js/app.js`:
- Reemplaza el array `activities` con llamadas `fetch()` a una API REST
- Endpoints sugeridos: `GET /api/actividades`, `POST /api/actividades`, `PUT /api/actividades/:id`, `DELETE /api/actividades/:id`

---
Desarrollado siguiendo metodología **OOHDM** · Diagramas de casos de uso, secuencia y clases incluidos en la documentación del proyecto.
