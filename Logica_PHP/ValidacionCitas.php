<?php
/**
 * Validación de los datos de una cita, separada de Citas.php para poder
 * probarla con tests unitarios sin necesitar una conexión a base de
 * datos ni una petición HTTP real.
 */

/**
 * Valida los datos de una cita.
 *
 * @param array $datos Normalmente $_POST, pero puede ser cualquier array
 *                      asociativo con las mismas claves (Motivo_Consulta,
 *                      Cobro_Total, Metodo_Pago, Fecha_Cita, Tratamiento,
 *                      Diagnostico, Cod_Mascotas, Cod_Clientes,
 *                      Cod_Trabajador, Cod_Servicios, Cod_Historial).
 * @return string[] Lista de mensajes de error; vacía si los datos son válidos.
 */
function validarDatosCita(array $datos): array
{
    $errores = [];

    if (empty($datos['Motivo_Consulta'])) {
        $errores[] = "El motivo de consulta es obligatorio";
    }

    if (empty($datos['Cobro_Total'])) {
        $errores[] = "El cobro total es obligatorio";
    } elseif (!is_numeric($datos['Cobro_Total']) || $datos['Cobro_Total'] <= 0) {
        $errores[] = "➤ El cobro total debe ser un número positivo";
    }

    if (empty($datos['Metodo_Pago'])) {
        $errores[] = "El método de pago es obligatorio";
    }

    if (empty($datos['Fecha_Cita'])) {
        $errores[] = "La fecha de la cita es obligatoria";
    } elseif (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $datos['Fecha_Cita'])) {
        $errores[] = "➤ El formato de la fecha de cita no es válido (debe ser YYYY-MM-DD)";
    }

    if (empty($datos['Tratamiento'])) {
        $errores[] = "El tratamiento es obligatorio";
    }

    if (empty($datos['Diagnostico'])) {
        $errores[] = "El diagnóstico es obligatorio";
    }

    foreach (['Cod_Mascotas' => 'mascota', 'Cod_Clientes' => 'cliente', 'Cod_Trabajador' => 'trabajador',
              'Cod_Servicios' => 'servicio', 'Cod_Historial' => 'historial'] as $campo => $nombreLegible) {
        if (empty($datos[$campo])) {
            $errores[] = "El código de {$nombreLegible} es obligatorio";
        } elseif (!is_numeric($datos[$campo])) {
            $errores[] = "➤ El código de {$nombreLegible} debe ser un número";
        }
    }

    return $errores;
}
