<?php
/**
 * Cargador mínimo de archivos .env, sin dependencias externas.
 *
 * No se usa una librería como vlucas/phpdotenv porque el proyecto no
 * tiene Composer configurado; esto alcanza para el formato simple
 * CLAVE=valor de un .env de desarrollo.
 */

/**
 * Lee un archivo .env (si existe) y define sus variables con putenv(),
 * sin sobreescribir las que ya estén definidas en el entorno real
 * (por ejemplo, las que ponga el hosting en producción).
 */
function cargarVariablesDeEntorno(string $rutaEnv): void
{
    if (!is_file($rutaEnv) || !is_readable($rutaEnv)) {
        return;
    }

    $lineas = file($rutaEnv, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if ($lineas === false) {
        return;
    }

    foreach ($lineas as $linea) {
        $linea = trim($linea);
        if ($linea === '' || $linea[0] === '#') {
            continue;
        }

        $partes = explode('=', $linea, 2);
        if (count($partes) !== 2) {
            continue;
        }

        [$clave, $valor] = $partes;
        $clave = trim($clave);
        $valor = trim($valor);

        // Quita comillas envolventes simples o dobles, si las hay
        if (strlen($valor) >= 2 && (
            ($valor[0] === '"' && substr($valor, -1) === '"') ||
            ($valor[0] === "'" && substr($valor, -1) === "'")
        )) {
            $valor = substr($valor, 1, -1);
        }

        if ($clave === '' || getenv($clave) !== false) {
            continue; // no pisa variables ya definidas en el entorno real
        }

        putenv("{$clave}={$valor}");
    }
}

/**
 * Devuelve una variable de entorno, o el valor por defecto si no existe.
 */
function obtenerVariableDeEntorno(string $clave, string $porDefecto = ''): string
{
    $valor = getenv($clave);
    return $valor === false ? $porDefecto : $valor;
}
