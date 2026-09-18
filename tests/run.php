<?php
/**
 * Harness de pruebas ligero, sin dependencias externas.
 *
 * El proyecto no tiene Composer configurado, así que en vez de traer
 * PHPUnit completo para un puñado de pruebas, este script implementa
 * lo mínimo necesario: assertTrue/assertFalse/assertEquals/assertNull y
 * un contador de aciertos/fallos. Se ejecuta con:
 *
 *   php tests/run.php
 *
 * y termina con código de salida 1 si alguna prueba falla (para poder
 * usarlo en CI).
 */

$GLOBALS['__pruebas_total'] = 0;
$GLOBALS['__pruebas_fallidas'] = 0;

function assertTrue($condicion, string $mensaje): void
{
    $GLOBALS['__pruebas_total']++;
    if ($condicion !== true) {
        $GLOBALS['__pruebas_fallidas']++;
        echo "  [FALLÓ] {$mensaje}\n";
        return;
    }
    echo "  [OK] {$mensaje}\n";
}

function assertFalse($condicion, string $mensaje): void
{
    assertTrue($condicion === false, $mensaje);
}

function assertNull($valor, string $mensaje): void
{
    assertTrue($valor === null, $mensaje);
}

function assertEquals($esperado, $real, string $mensaje): void
{
    $GLOBALS['__pruebas_total']++;
    if ($esperado !== $real) {
        $GLOBALS['__pruebas_fallidas']++;
        $esperadoStr = is_array($esperado) ? json_encode($esperado) : var_export($esperado, true);
        $realStr = is_array($real) ? json_encode($real) : var_export($real, true);
        echo "  [FALLÓ] {$mensaje} (esperado: {$esperadoStr}, obtenido: {$realStr})\n";
        return;
    }
    echo "  [OK] {$mensaje}\n";
}

function assertContains(string $aguja, array $pajar, string $mensaje): void
{
    assertTrue(in_array($aguja, $pajar, true), $mensaje);
}

$directorioBase = dirname(__DIR__);

require_once $directorioBase . '/Logica_PHP/ValidacionCitas.php';
require_once $directorioBase . '/Logica_PHP/auth.php';

echo "== validarDatosCita() (lógica central de registro de citas) ==\n";

$citaValida = [
    'Motivo_Consulta' => 'Chequeo anual',
    'Cobro_Total' => '150',
    'Metodo_Pago' => 'QR',
    'Fecha_Cita' => '2026-10-01',
    'Tratamiento' => 'Vacunación',
    'Diagnostico' => 'Sano',
    'Cod_Mascotas' => '1',
    'Cod_Clientes' => '2',
    'Cod_Trabajador' => '3',
    'Cod_Servicios' => '4',
    'Cod_Historial' => '5',
];

assertEquals([], validarDatosCita($citaValida), 'una cita con todos los datos correctos no genera errores');

$sinMotivo = $citaValida;
unset($sinMotivo['Motivo_Consulta']);
assertContains('El motivo de consulta es obligatorio', validarDatosCita($sinMotivo), 'falta Motivo_Consulta genera el error esperado');

$costoInvalido = $citaValida;
$costoInvalido['Cobro_Total'] = '-50';
assertContains('➤ El cobro total debe ser un número positivo', validarDatosCita($costoInvalido), 'Cobro_Total negativo es rechazado');

$costoTexto = $citaValida;
$costoTexto['Cobro_Total'] = 'gratis';
assertContains('➤ El cobro total debe ser un número positivo', validarDatosCita($costoTexto), 'Cobro_Total no numérico es rechazado');

$fechaInvalida = $citaValida;
$fechaInvalida['Fecha_Cita'] = '01/10/2026';
assertContains('➤ El formato de la fecha de cita no es válido (debe ser YYYY-MM-DD)', validarDatosCita($fechaInvalida), 'una fecha en formato incorrecto es rechazada');

$codigoNoNumerico = $citaValida;
$codigoNoNumerico['Cod_Mascotas'] = 'abc';
assertContains('➤ El código de mascota debe ser un número', validarDatosCita($codigoNoNumerico), 'Cod_Mascotas no numérico es rechazado');

$vacia = [];
assertTrue(count(validarDatosCita($vacia)) >= 8, 'un array vacío genera un error por cada campo obligatorio faltante');

echo "\n== Control de acceso (auth.php) ==\n";

// Simula una petición sin sesión iniciada
$_SESSION = [];
assertNull(usuarioAutenticado(), 'sin sesión activa, usuarioAutenticado() devuelve null');

// Simula una sesión válida tras un login exitoso
$_SESSION['usuario_id'] = 42;
$_SESSION['usuario_nombre'] = 'admin.demo';
$usuario = usuarioAutenticado();
assertEquals(['id' => 42, 'nombre' => 'admin.demo'], $usuario, 'con sesión activa, usuarioAutenticado() devuelve los datos del usuario');

// requireAuth() no debe cortar la ejecución si ya hay sesión válida
$resultado = requireAuth();
assertEquals(42, $resultado['id'], 'requireAuth() no interrumpe la ejecución cuando la sesión es válida');

// Una sesión vacía debe volver a fallar
$_SESSION = ['usuario_id' => 0];
assertNull(usuarioAutenticado(), 'un usuario_id vacío (0) se trata como no autenticado');

echo "\n----------------------------------------\n";
printf("Pruebas ejecutadas: %d, fallidas: %d\n", $GLOBALS['__pruebas_total'], $GLOBALS['__pruebas_fallidas']);

if ($GLOBALS['__pruebas_fallidas'] > 0) {
    exit(1);
}

echo "Todas las pruebas pasaron.\n";
exit(0);
