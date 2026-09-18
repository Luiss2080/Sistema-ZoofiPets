<?php
/**
 * Protección CSRF basada en un token de sesión.
 *
 * Ninguno de los formularios del panel llevaba token CSRF: al ser
 * peticiones POST comunes, cualquier página externa podía enviar un
 * <form> oculto (o hacer un fetch con credentials: 'include') al
 * dominio de la aplicación y, aprovechando la cookie de sesión ya
 * autenticada del usuario, ejecutar acciones en su nombre sin que él
 * lo supiera.
 *
 * requireCsrf() debe llamarse en todo endpoint que modifique datos. Si el
 * endpoint también usa auth.php (rama security/add-server-side-auth), este
 * archivo puede incluirse después sin problema: ambos comparten la misma
 * sesión de PHP.
 */

if (session_status() === PHP_SESSION_NONE) {
    session_set_cookie_params([
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    session_start();
}

/**
 * Devuelve el token CSRF de la sesión actual, generándolo si no existe.
 */
function generarCsrfToken(): string
{
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

/**
 * Corta la ejecución con 403 si la petición no trae un token CSRF válido.
 * Acepta el token en el campo de formulario csrf_token o en la cabecera
 * X-CSRF-Token (útil para peticiones fetch con JSON).
 */
function requireCsrf(): void
{
    $enviado = $_POST['csrf_token'] ?? $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';

    if (empty($_SESSION['csrf_token']) || !is_string($enviado) || $enviado === '' || !hash_equals($_SESSION['csrf_token'], $enviado)) {
        http_response_code(403);
        header('Content-Type: application/json');
        echo json_encode([
            'exito' => false,
            'mensaje' => 'Token de seguridad inválido o ausente. Recargue la página e intente nuevamente.'
        ]);
        exit;
    }
}
