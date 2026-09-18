/**
 * Obtiene el token CSRF de la sesión actual y lo deja disponible en
 * window.CSRF_TOKEN para que los formularios lo adjunten a sus
 * peticiones antes de enviarlas a Logica_PHP/*.php.
 *
 * Sin esto, cualquier sitio externo podía enviar un formulario oculto
 * (o un fetch con credentials incluidas) contra estos mismos endpoints
 * y, aprovechando la cookie de sesión ya autenticada del usuario,
 * ejecutar acciones en su nombre sin que él lo supiera (CSRF).
 */
(function () {
    async function cargarCsrfToken() {
        try {
            const res = await fetch('../Logica_PHP/CsrfToken.php', { credentials: 'same-origin' });
            if (!res.ok) return;
            const data = await res.json();
            window.CSRF_TOKEN = data.csrf_token || '';
        } catch (e) {
            window.CSRF_TOKEN = '';
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', cargarCsrfToken);
    } else {
        cargarCsrfToken();
    }
})();
