<?php
/**
 * Conexión a la base de datos.
 *
 * Las credenciales ya NO están escritas en este archivo (antes decía
 * literalmente root / contraseña vacía). Se leen de variables de entorno,
 * que a su vez pueden venir de un archivo .env en la raíz del proyecto
 * (ver .env.example) - ese archivo nunca se sube al repositorio
 * (ver .gitignore).
 *
 * Si no hay variables de entorno definidas, se usan los mismos valores
 * de desarrollo local que tenía el proyecto antes, para no romper el
 * flujo de quien ya lo tenía funcionando en su máquina.
 */

require_once __DIR__ . '/cargar_env.php';
cargarVariablesDeEntorno(__DIR__ . '/.env');

$host = obtenerVariableDeEntorno('DB_HOST', 'localhost');
$usuario = obtenerVariableDeEntorno('DB_USUARIO', 'root');
$password = obtenerVariableDeEntorno('DB_PASSWORD', '');
$db = obtenerVariableDeEntorno('DB_NOMBRE', 'sistema-zoofipetss');
$puerto = (int) obtenerVariableDeEntorno('DB_PUERTO', '3306');

// CREACIÓN DE LA CONEXIÓN A LA BASE DE DATOS
$conex = new mysqli($host, $usuario, $password, $db, $puerto);

// VERIFICAR SI LA CONEXIÓN FUE EXITOSA
if ($conex->connect_error) {
    die("Error de Conexión: " . $conex->connect_error);
}

// Charset explícito: real_escape_string() y las comparaciones de texto
// dependen de que el cliente y el servidor coincidan en el juego de
// caracteres.
$conex->set_charset('utf8mb4');
?>
