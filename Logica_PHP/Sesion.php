<?php
/**
 * Endpoint de solo lectura para que las páginas estáticas (HTML) sepan si
 * hay una sesión de servidor activa, en vez de confiar en localStorage
 * (que cualquier script en la página, o el propio usuario desde la
 * consola del navegador, puede escribir sin haber iniciado sesión nunca).
 */
require_once "auth.php";

header('Content-Type: application/json');

if (empty($_SESSION['usuario_id'])) {
    http_response_code(401);
    echo json_encode(['autenticado' => false]);
    exit;
}

echo json_encode([
    'autenticado' => true,
    'usuario' => $_SESSION['usuario_nombre'] ?? '',
]);
