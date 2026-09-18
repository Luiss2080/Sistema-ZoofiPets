# 🐾 VeterinariaDigital

> Sistema de gestión para clínicas veterinarias: citas, mascotas, clientes,
> historial clínico, ventas, compras, productos, proveedores y personal,
> con control de acceso por sesión, protección CSRF y consultas
> parametrizadas de extremo a extremo. Pensado para una clínica pequeña o
> mediana que hoy lleva estos registros en papel o en hojas de cálculo.

## Características

- **Citas y consultas**: registro de citas con motivo, diagnóstico,
  tratamiento, cobro y vínculo a mascota, cliente, trabajador, servicio e
  historial clínico (`Logica_PHP/Citas.php`).
- **Mascotas y clientes**: alta de mascotas y de clientes (con múltiples
  teléfonos y correos por cliente).
- **Historial clínico**: diagnóstico, tratamiento, especialidad y
  pronóstico por mascota.
- **Ventas y compras**: registro de ventas con control de stock (descuenta
  inventario automáticamente) y de compras a proveedores.
- **Catálogo**: productos, servicios y proveedores.
- **Personal y accesos**: trabajadores, usuarios, roles y permisos.
- **Autenticación real de servidor**: sesiones de PHP verificadas contra
  la base de datos (`Logica_PHP/Login.php`, `Logica_PHP/auth.php`) — no un
  simple flag en el navegador.
- **Protección CSRF** en todos los formularios que modifican datos
  (`Logica_PHP/csrf.php`).
- **Consultas parametrizadas** (mysqli prepared statements) en todos los
  endpoints, sin concatenar datos del usuario directamente en SQL.
- **Reportes visuales básicos**: tablas con búsqueda en vivo por
  formulario.

## Cómo usar

1. Cree la base de datos MySQL (ver "Instalación" abajo).
2. Cree el primer usuario administrador con `scripts/crear_admin.php`
   (no hay una pantalla de registro pública: crear usuarios requiere
   estar ya autenticado).
3. Abra `index.html` en el navegador, inicie sesión, y use el menú lateral
   del panel (`capa_proforma.html`) para navegar entre Citas, Mascotas,
   Clientes, Ventas, Compras, Productos, Proveedores, Personal e Historial.

## Instalación y uso local

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>
cd VeterinariaDigital

# 2. Configurar las credenciales de la base de datos
cp .env.example .env
# editar .env con el usuario/contraseña/host de su MySQL local

# 3. Crear la base de datos vacía
mysql -u root -p -e "CREATE DATABASE \`sistema-zoofipetss\` CHARACTER SET utf8mb4"

# 4. Crear las tablas
# Este repositorio todavía no incluye un archivo .sql con el esquema
# completo (ver "Cosas pendientes" abajo): cree las tablas Usuario,
# Clientes, Mascotas, Citas, Historial, Servicios, Trabajadores, Roles,
# Permisos, Productos, Proveedores, Compras y Ventas (y sus tablas de
# teléfonos/correos: Telefono_Clientes, Email_Clientes, etc.) según los
# campos usados en Logica_PHP/*.php antes del primer uso.

# 5. Crear el primer usuario administrador
php scripts/crear_admin.php "admin" "admin@clinica.com" "unaContraseñaSegura123"

# 6. Servir el proyecto con PHP embebido (o con Apache/Nginx + PHP-FPM)
php -S localhost:8000
# abrir http://localhost:8000/index.html
```

## Tecnologías

- **Backend**: PHP 8 + mysqli (prepared statements), sesiones nativas de
  PHP para autenticación.
- **Base de datos**: MySQL / MariaDB.
- **Frontend**: HTML5, CSS3, JavaScript (fetch/AJAX, sin framework),
  Bootstrap 5 en varias pantallas.
- **Pruebas**: harness propio sin dependencias (`tests/run.php`) — el
  proyecto no usa Composer, así que no se agregó PHPUnit solo para un
  puñado de pruebas.
- **CI**: GitHub Actions (`.github/workflows/ci.yml`) — lint de todos los
  `.php` con `php -l` y ejecución de `tests/run.php` en cada push/PR.

## Tests

```bash
php tests/run.php
```

Cubre la validación central de una cita (`validarDatosCita()` en
`Logica_PHP/ValidacionCitas.php`) y el control de acceso por sesión
(`usuarioAutenticado()` / `requireAuth()` en `Logica_PHP/auth.php`).

## Cosas pendientes (para no prometer de más)

- **No hay archivo `.sql` con el esquema de la base de datos** en el
  repositorio: las tablas y columnas se infieren de las consultas en
  `Logica_PHP/*.php`. Exportar el esquema real es la mejora más urgente
  para que alguien nuevo pueda levantar el proyecto sin adivinar.
- El endpoint de creación de trabajadores (`Logica_PHP/Trabajadores.php`)
  fue reescrito para funcionar de extremo a extremo (antes mezclaba
  código PDO y mysqli y nunca insertaba nada); no incluye edición ni
  eliminación todavía, solo alta y listado.
- Las páginas de formulario individuales todavía deciden qué mostrar en
  pantalla usando una bandera en `localStorage` (por compatibilidad con
  el código existente); la operación real contra la base de datos sí
  está protegida en el servidor con sesión + CSRF, así que ocultar/mostrar
  la interfaz ahí es solo una conveniencia visual, no un control de
  acceso.
- No hay recuperación de contraseña real (el enlace en la pantalla de
  login es solo un placeholder).

## Licencia

Este repositorio no incluye un archivo de licencia. Todos los derechos
reservados por el autor hasta que se agregue una.
