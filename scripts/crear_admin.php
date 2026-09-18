<?php
/**
 * Crea el primer usuario administrador desde la línea de comandos.
 *
 * Ahora que Logica_PHP/Usuario.php exige una sesión autenticada (ver
 * security/add-server-side-auth), el sistema necesita una forma de
 * crear el primer usuario sin depender de sí mismo. Este script se
 * ejecuta una sola vez, directamente en el servidor (nunca por HTTP),
 * para sembrar esa primera cuenta.
 *
 * Uso:
 *   php scripts/crear_admin.php "nombre.usuario" "correo@dominio.com" "ContraseñaSegura123"
 */

if (php_sapi_name() !== 'cli') {
    http_response_code(403);
    die("Este script solo puede ejecutarse desde la línea de comandos.\n");
}

require_once __DIR__ . '/../conexion.php';

[, $nombreUsuario, $correo, $password] = $argv + [null, null, null, null];

if (!$nombreUsuario || !$correo || !$password) {
    fwrite(STDERR, "Uso: php scripts/crear_admin.php <usuario> <correo> <password>\n");
    exit(1);
}

if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
    fwrite(STDERR, "El correo proporcionado no es válido.\n");
    exit(1);
}

if (strlen($password) < 8) {
    fwrite(STDERR, "La contraseña debe tener al menos 8 caracteres.\n");
    exit(1);
}

$hash = password_hash($password, PASSWORD_BCRYPT);
$fecha = date('Y-m-d');

$stmt = $conex->prepare(
    "INSERT INTO Usuario (Nombre_Usuario, Correo_Institucional, Contrasena_Institucional, Estado_Usuario, Fecha_Creacion)
     VALUES (?, ?, ?, 'Activo', ?)"
);
$stmt->bind_param("ssss", $nombreUsuario, $correo, $hash, $fecha);

if (!$stmt->execute()) {
    fwrite(STDERR, "Error al crear el usuario: " . $stmt->error . "\n");
    exit(1);
}

echo "Usuario administrador '{$nombreUsuario}' creado con Cod_Usuario={$stmt->insert_id}.\n";

$stmt->close();
$conex->close();
