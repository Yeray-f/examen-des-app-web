# 📚 YS Books — Desarrollo de Aplicaciones Web

> Aplicación web académica desarrollada con **Vue.js 3**, **Vue Router**, **Bootstrap 5** y **Axios**, que integra la arquitectura modular del Segundo Parcial con la estética visual premium de YS Books Portada, incorporando autenticación, control de roles, CRUD de usuarios y productos, gestión de pedidos y catálogo de libros.

---

## 🎯 Descripción

**YS Books** es una plataforma de gestión de librería diseñada bajo una arquitectura modular basada en componentes reutilizables de Vue.js.

El proyecto combina la funcionalidad del Segundo Parcial con nuevas características orientadas a la administración y gestión de usuarios, productos y pedidos mediante MockAPI.

### Funcionalidades principales

* 🏠 Inicio con estadísticas y secciones destacadas
* 📖 Catálogo completo de libros
* 🔎 Búsqueda y filtros por categoría
* 🏷️ Ofertas especiales con descuentos destacados
* 🛒 Carrito de compras
* 📦 Gestión y seguimiento de pedidos
* 👥 Gestión de clientes
* 👤 Gestión de usuarios
* 📚 Gestión de productos
* 🔐 Sistema de autenticación con roles
* 🚪 Logout y persistencia de sesión
* 🛡️ Protección de rutas mediante Router Guards
* 📱 Diseño responsive con Bootstrap 5

---

## 👥 Desarrolladores

| Nombre         | Rol                          |
| -------------- | ---------------------------- |
| Yeray Álvarez  | Desarrollo Frontend / Vue.js |
| Skarik Barbosa | Diseño UI / Integración      |

---

## 🚀 Tecnologías utilizadas

* Vue 3
* Vue Router 4
* Bootstrap 5
* Bootstrap Icons
* Axios
* Vite
* MockAPI
* localStorage
* sessionStorage
* Web Crypto API (hashing de contraseñas)

---

## 🔐 Sistema de autenticación

La autenticación funciona exclusivamente mediante MockAPI.

Características:

* Login validado contra MockAPI
* Contraseñas almacenadas como hash
* Token de sesión simulado
* Persistencia de sesión
* Logout con limpieza de datos
* Protección de rutas
* Control de acceso basado en roles

---

## 👨‍💼 Roles del sistema

### Administrador

Accede a todas las funcionalidades del sistema:

* Inicio administrativo
* Gestión de usuarios
* CRUD completo de productos
* Gestión de clientes
* Gestión de autores
* Validación de pedidos
* Perfil de usuario

### Cliente

Accede únicamente a las funcionalidades de compra:

* Catálogo de libros
* Ofertas
* Carrito de compras
* Mis pedidos
* Perfil

El cliente no puede crear, editar ni eliminar usuarios o productos.

---

## 📋 Funcionalidades implementadas

### Gestión de usuarios

* CRUD completo de usuarios
* Control de roles
* Validaciones de formularios
* Alertas Bootstrap

### Gestión de productos

* CRUD completo de productos
* Administración de inventario
* Persistencia local
* Consumo de MockAPI

### Gestión de pedidos

* Registro de pedidos
* Seguimiento de estado
* Validación por administrador
* Visualización personalizada por usuario

### Catálogo y compras

* Catálogo completo de libros
* Búsqueda dinámica
* Filtros por categoría
* Ofertas especiales
* Carrito de compras

### Seguridad

* Contraseñas hashadas
* Rutas protegidas
* Validación de sesión
* Control de acceso por rol

---

## 🗂️ Estructura del Proyecto

```text
ysbooks/
├── node_modules/
├── public/
│   ├── assets/
│   ├── covers/
│   ├── pedidos.json
│   ├── products.json
│   └── usuarios.json
│
├── src/
│   ├── components/
│   │   ├── CartDrawer.vue
│   │   ├── FooterComponent.vue
│   │   ├── NavbarComponent.vue
│   │   ├── ProductCardComponent.vue
│   │   ├── ProductDeleteConfirm.vue
│   │   ├── ProductDetailModal.vue
│   │   ├── ProductForm.vue
│   │   ├── ProductList.vue
│   │   ├── SidebarComponent.vue
│   │   ├── UserDeleteConfirm.vue
│   │   ├── UserForm.vue
│   │   └── UserList.vue
│   │
│   ├── composables/
│   │   └── useAlert.js
│   │
│   ├── router/
│   │   └── index.js
│   │
│   ├── services/
│   │   ├── apiClient.js
│   │   ├── authService.js
│   │   ├── cartService.js
│   │   ├── orderService.js
│   │   ├── productService.js
│   │   └── userService.js
│   │
│   ├── utils/
│   │   ├── bookCover.js
│   │   ├── passwordHash.js
│   │   ├── roles.js
│   │   └── storage.js
│   │
│   └── views/
│       ├── AutoresView.vue
│       ├── CatalogoView.vue
│       ├── ClientesView.vue
│       ├── DashboardView.vue
│       ├── InicioView.vue
│       ├── LoginView.vue
│       ├── OfertasView.vue
│       ├── PedidosView.vue
│       ├── PerfilView.vue
│       ├── ProductView.vue
│       └── UsuariosView.vue
│
├── App.vue
├── main.js
├── .env
├── .env.example
├── .gitignore
├── index.html
├── package-lock.json
├── package.json
├── vite.config.js
└── README.md
```

---

## 🧩 Arquitectura Modular

### Componentes reutilizables

```vue
<NavbarComponent
  :nombreUsuario="nombreUsuario"
  @logout="cerrarSesion"
/>

<ProductCardComponent
  :producto="libro"
  @verDetalle="verDetalle"
  @agregar="agregarAlCarrito"
/>
```

### CRUD de productos

```js
obtenerProductos()
agregarProducto(producto)
editarProducto(productoEditado)
eliminarProducto(id)
```

### Servicios

Los servicios centralizan:

* Autenticación
* Gestión de usuarios
* Gestión de productos
* Gestión de pedidos
* Comunicación HTTP mediante Axios

---

## 🛣️ Rutas principales

```text
/login

/dashboard
/dashboard/catalogo
/dashboard/ofertas
/dashboard/productos
/dashboard/clientes
/dashboard/usuarios
/dashboard/pedidos
/dashboard/perfil
```

Las rutas están protegidas mediante Vue Router Guards y validación de sesión.

---

## ⚙️ Instalación

```bash
npm install
```

---

## ▶️ Ejecución local

```bash
npm run dev
```

---

## 🌐 Variables de entorno

Crear un archivo `.env` a partir de `.env.example`.

```env
VITE_API_URL=https://app-crud-api.mockapi.io/api/v1

VITE_MOCKAPI_USERS_PATH=usuarios

VITE_MOCKAPI_PRODUCTS_PATH=productos

VITE_MOCKAPI_ORDERS_PATH=pedidos
```

---

## 📦 Dependencias principales

```json
{
  "vue": "^3.x",
  "vue-router": "^4.x",
  "bootstrap": "^5.x",
  "bootstrap-icons": "^1.x",
  "axios": "^1.x"
}
```

---

## 🎨 Paleta de colores

| Variable     | Color         | Uso                  |
| ------------ | ------------- | -------------------- |
| --bg-darkest | #0b0f1a       | Fondo principal      |
| --violet     | #7c3aed       | Color primario       |
| --violet-lt  | #9d6ef5       | Acento violeta       |
| --accent     | #f59e0b       | Ofertas y destacados |
| --grad-main  | Violet → Blue | Gradiente principal  |

---

## 📝 Notas técnicas

* La autenticación depende exclusivamente de MockAPI.
* Si MockAPI no está disponible, el acceso al sistema queda bloqueado.
* La sesión se conserva mediante localStorage y sessionStorage.
* Las peticiones HTTP se centralizan con Axios.
* Los clientes únicamente pueden visualizar sus propios pedidos.
* Las contraseñas se almacenan mediante hashing utilizando Web Crypto API.

---

## ⚠️ Nota educativa

Este proyecto fue desarrollado con fines académicos para la asignatura de Desarrollo de Aplicaciones Web.

Aunque implementa autenticación, roles y protección de rutas, para un entorno de producción sería recomendable utilizar:

* Backend dedicado
* JWT reales
* Base de datos segura
* Hashing con bcrypt o Argon2
* HTTPS y políticas de seguridad adicionales

---

## 📂 Repositorio

Repositorio GitHub:

```text
https://github.com/Yeray-f/examen-des-app-web.git
```

> Verifica que ambos integrantes tengan commits visibles en el historial antes de realizar la entrega.

---

## © Licencia

YS Books © 2026

Desarrollado por Yeray Álvarez y Skarik Barbosa para fines académicos.