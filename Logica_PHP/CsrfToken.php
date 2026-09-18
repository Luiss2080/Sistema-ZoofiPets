<?php
/**
 * Entrega el token CSRF de la sesión actual para que las páginas HTML lo
 * adjunten a sus formularios antes de enviarlos.
 */
require_once "csrf.php";

header('Content-Type: application/json');
echo json_encode(['csrf_token' => generarCsrfToken()]);
