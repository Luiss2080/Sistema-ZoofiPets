<?php
/**
 * Guarda de autenticación basada en sesión de servidor.
 *
 * Antes de este archivo, NINGÚN endpoint de Logica_PHP verificaba quién
 * hacía la petición: el "login" de index.html solo escribía una bandera
 * en localStorage del navegador, así que cualquiera que supiera la URL
 * de, por ejemplo, Logica_PHP/Clientes.php podía crear, listar o borrar
 * datos sin autenticarse nunca contra el servidor.
 *
 * Este archivo debe incluirse (require_once) e invocarse (requireAuth())
 * al inicio de todo endpoint que lea o modifique datos sensibles, ANTES
 * de tocar $_POST o la base de datos.
 */

if (session_status() === PHP_SESSION_NONE) {
    session_set_cookie_params([
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    session_start();
}

/**
 * Corta la ejecución con 401 si no hay una sesión de usuario autenticada
 * válida. Debe ser la primera línea de lógica de cualquier endpoint
 * protegido.
 *
 * @return array{id:int,nombre:string} Datos del usuario autenticado.
 */
function requireAuth(): array
{
    if (empty($_SESSION['usuario_id'])) {
        http_response_code(401);
        header('Content-Type: application/json');
        echo json_encode([
            'exito' => false,
            'mensaje' => 'Debe iniciar sesión para realizar esta acción.'
        ]);
        exit;
    }

    return [
        'id' => (int) $_SESSION['usuario_id'],
        'nombre' => $_SESSION['usuario_nombre'] ?? '',
    ];
}
