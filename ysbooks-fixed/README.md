# 📚 YS Books — Segundo Parcial · Desarrollo de Aplicaciones Web

> Aplicación web modularizada con **Vue.js 3** y **Bootstrap 5** — Fusión del proyecto base con la estética visual de YS Books Portada.

---

## 🎯 Descripción

**YS Books** es una plataforma de gestión de librería que combina la arquitectura modular del Segundo Parcial con la estética premium de la versión Portada. Incluye:

- 🏠 **Inicio** con estadísticas en tiempo real y secciones de nuevos libros y ofertas
- 📖 **Catálogo** completo con búsqueda y filtros por categoría
- 🏷️ **Ofertas especiales** con descuentos visuales
- 📋 **Gestión CRUD** de libros con LocalStorage
- 👥 **Clientes** con tabla de ejemplo
- 🔐 **Login** con validación desde JSON local

---

## 👥 Desarrolladores

| Nombre | Rol |
|---|---|
| Yeray Álvarez | Desarrollo Frontend / Vue.js |
| Skarik Barbosa | Diseño UI / Integración |

---

## 🗂️ Estructura del Proyecto

```
ysbooks-vue/
├── public/
│   ├── products.json       ← 12 productos de inventario
│   └── usuarios.json       ← Usuarios para login
├── src/
│   ├── App.vue             ← Punto de entrada + estilos globales
│   ├── main.js             ← Arranque de la app
│   ├── router/
│   │   └── index.js        ← Rutas: /login, /dashboard, /catalogo, /ofertas...
│   ├── services/
│   │   ├── authService.js  ← Validación de credenciales + sessionStorage
│   │   └── productService.js ← CRUD simulado con LocalStorage
│   ├── components/
│   │   ├── NavbarComponent.vue     ← Encabezado con búsqueda y nav horizontal
│   │   ├── SidebarComponent.vue    ← Menú lateral con iconos
│   │   ├── FooterComponent.vue     ← Pie de página completo
│   │   └── ProductCardComponent.vue ← Tarjeta reutilizable de libro
│   └── views/
│       ├── LoginView.vue           ← Login con validación JSON
│       ├── DashboardView.vue       ← Layout padre (navbar+sidebar+footer)
│       ├── InicioView.vue          ← Home con stats + nuevos libros + ofertas
│       ├── CatalogoView.vue        ← Catálogo con búsqueda y filtros
│       ├── OfertasView.vue         ← Vista dedicada a ofertas
│       ├── ProductView.vue         ← CRUD completo de libros
│       └── ClientesView.vue        ← Lista de clientes
```

---

## ⚙️ Instalación y ejecución

```bash
npm install
npm run dev
```

Credenciales de prueba (usuarios.json):
- **Usuario:** admin | **Password:** admin123

---

## 🔧 Modularización

### Componentes y props
```vue
<!-- NavbarComponent recibe el nombre del usuario -->
<NavbarComponent :nombreUsuario="nombreUsuario" @logout="cerrarSesion" />

<!-- ProductCardComponent recibe el producto por props -->
<ProductCardComponent :producto="libro" @verDetalle="verDetalle" @agregar="agregarAlCarrito" />
```

### CRUD con LocalStorage
```js
// productService.js — las 4 operaciones
obtenerProductos()           // READ
agregarProducto(producto)    // CREATE
editarProducto(productoEditado) // UPDATE
eliminarProducto(id)         // DELETE
```

### Rutas configuradas
```
/login
/dashboard                → InicioView
/dashboard/catalogo       → CatalogoView (con filtros)
/dashboard/ofertas        → OfertasView
/dashboard/productos      → ProductView (CRUD)
/dashboard/clientes       → ClientesView
```

---

## 🎨 Paleta de colores

| Variable | Color | Uso |
|---|---|---|
| `--bg-darkest` | `#0b0f1a` | Fondo principal |
| `--violet` | `#7c3aed` | Color primario |
| `--violet-lt` | `#9d6ef5` | Acento violeta |
| `--accent` | `#f59e0b` | Dorado (ofertas) |
| `--grad-main` | violet→blue | Gradiente principal |

---

## ⚠️ Nota educativa

La validación de login desde `usuarios.json` es **solo con fines académicos**. En una aplicación real se usaría un backend con contraseñas encriptadas (bcrypt) y tokens JWT.

---

*YS Books © 2026 — Desarrollado por Yeray Álvarez & Skarik Barbosa*
