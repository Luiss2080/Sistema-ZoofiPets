<?php
// Habilitar reporte de errores para depuración
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once "../conexion.php";
require_once "auth.php";

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['exito' => false, 'mensaje' => 'Método no permitido']);
    exit;
}

$usuarioIngresado = trim($_POST['usuario'] ?? '');
$passwordIngresado = (string) ($_POST['password'] ?? '');

if ($usuarioIngresado === '' || $passwordIngresado === '') {
    echo json_encode(['exito' => false, 'mensaje' => 'Usuario y contraseña son obligatorios']);
    exit;
}

// Límite simple de intentos por sesión para dificultar fuerza bruta
if (!isset($_SESSION['login_intentos'])) {
    $_SESSION['login_intentos'] = 0;
    $_SESSION['login_bloqueo_hasta'] = 0;
}

if (time() < $_SESSION['login_bloqueo_hasta']) {
    http_response_code(429);
    echo json_encode([
        'exito' => false,
        'mensaje' => 'Demasiados intentos fallidos. Intente nuevamente en unos minutos.'
    ]);
    exit;
}

$stmt = $conex->prepare(
    "SELECT Cod_Usuario, Nombre_Usuario, Contrasena_Institucional, Estado_Usuario
     FROM Usuario
     WHERE Nombre_Usuario = ? OR Correo_Institucional = ?
     LIMIT 1"
);
$stmt->bind_param("ss", $usuarioIngresado, $usuarioIngresado);
$stmt->execute();
$usuario = $stmt->get_result()->fetch_assoc();
$stmt->close();

$credencialesValidas = $usuario
    && strcasecmp((string) $usuario['Estado_Usuario'], 'Inactivo') !== 0
    && password_verify($passwordIngresado, $usuario['Contrasena_Institucional']);

if (!$credencialesValidas) {
    $_SESSION['login_intentos']++;
    if ($_SESSION['login_intentos'] >= 5) {
        $_SESSION['login_bloqueo_hasta'] = time() + 300; // 5 minutos
        $_SESSION['login_intentos'] = 0;
    }
    echo json_encode(['exito' => false, 'mensaje' => 'Usuario o contraseña incorrectos']);
    exit;
}

// Credenciales correctas: regenerar el id de sesión (previene "session fixation")
session_regenerate_id(true);
$_SESSION['usuario_id'] = (int) $usuario['Cod_Usuario'];
$_SESSION['usuario_nombre'] = $usuario['Nombre_Usuario'];
$_SESSION['login_intentos'] = 0;
$_SESSION['login_bloqueo_hasta'] = 0;

echo json_encode([
    'exito' => true,
    'usuario' => [
        'id' => (int) $usuario['Cod_Usuario'],
        'nombre' => $usuario['Nombre_Usuario'],
    ]
]);

$conex->close();
