<?php
// Habilitar reporte de errores para depuración
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Incluir conexión a la base de datos
require_once "../conexion.php";
require_once "auth.php";
requireAuth();
require_once "csrf.php";
requireCsrf();
// Array para almacenar errores
$errores = [];

// Validar que se recibieron los datos requeridos
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    $errores[] = "Método de solicitud no válido";
} else {
    // Validación del Motivo de Consulta
    if (empty($_POST['Motivo_Consulta'])) {
        $errores[] = "El motivo de consulta es obligatorio";
    }

    // Validación del Cobro Total
    if (empty($_POST['Cobro_Total'])) {
        $errores[] = "El cobro total es obligatorio";
    } elseif (!is_numeric($_POST['Cobro_Total']) || $_POST['Cobro_Total'] <= 0) {
        $errores[] = "➤ El cobro total debe ser un número positivo";
    }

    // Validación del Método de Pago
    if (empty($_POST['Metodo_Pago'])) {
        $errores[] = "El método de pago es obligatorio";
    }

    // Validación de la Fecha de Cita
    if (empty($_POST['Fecha_Cita'])) {
        $errores[] = "La fecha de la cita es obligatoria";
    } elseif (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $_POST['Fecha_Cita'])) {
        $errores[] = "➤ El formato de la fecha de cita no es válido (debe ser YYYY-MM-DD)";
    }

    // Validación del Tratamiento
    if (empty($_POST['Tratamiento'])) {
        $errores[] = "El tratamiento es obligatorio";
    }

    // Validación del Diagnóstico
    if (empty($_POST['Diagnostico'])) {
        $errores[] = "El diagnóstico es obligatorio";
    }

    // Validación del Código de Mascota
    if (empty($_POST['Cod_Mascotas'])) {
        $errores[] = "El código de mascota es obligatorio";
    } elseif (!is_numeric($_POST['Cod_Mascotas'])) {
        $errores[] = "➤ El código de mascota debe ser un número";
    }

    // Validación del Código de Cliente
    if (empty($_POST['Cod_Clientes'])) {
        $errores[] = "El código de cliente es obligatorio";
    } elseif (!is_numeric($_POST['Cod_Clientes'])) {
        $errores[] = "➤ El código de cliente debe ser un número";
    }

    // Validación del Código de Trabajador
    if (empty($_POST['Cod_Trabajador'])) {
        $errores[] = "El código de trabajador es obligatorio";
    } elseif (!is_numeric($_POST['Cod_Trabajador'])) {
        $errores[] = "➤ El código de trabajador debe ser un número";
    }

    // Validación del Código de Servicio
    if (empty($_POST['Cod_Servicios'])) {
        $errores[] = "El código de servicio es obligatorio";
    } elseif (!is_numeric($_POST['Cod_Servicios'])) {
        $errores[] = "➤ El código de servicio debe ser un número";
    }

    // Validación del Código de Historial
    if (empty($_POST['Cod_Historial'])) {
        $errores[] = "El código de historial es obligatorio";
    } elseif (!is_numeric($_POST['Cod_Historial'])) {
        $errores[] = "➤ El código de historial debe ser un número";
    }
}

// Si hay errores, devolver respuesta temprana
if (!empty($errores)) {
    header('Content-Type: application/json');
    echo json_encode([
        'exito' => false,
        'mensaje' => 'Se encontraron los siguientes errores:',
        'errores' => $errores
    ]);
    exit;
}

// Si no hay errores, proceder con la inserción
try {
    // Verificar conexión
    if ($conex->connect_error) {
        throw new Exception("Error de conexión a la base de datos: " . $conex->connect_error);
    }

    // Sanitizar todos los datos
    $Motivo_Consulta = $conex->real_escape_string($_POST['Motivo_Consulta']);
    $Cobro_Total = $conex->real_escape_string($_POST['Cobro_Total']);
    $Metodo_Pago = $conex->real_escape_string($_POST['Metodo_Pago']);
    $Fecha_Cita = $conex->real_escape_string($_POST['Fecha_Cita']);
    $Tratamiento = $conex->real_escape_string($_POST['Tratamiento']);
    $Enfermedades_Base = !empty($_POST['Enfermedades_Base']) ? $conex->real_escape_string($_POST['Enfermedades_Base']) : null;
    $Alergias = !empty($_POST['Alergias']) ? $conex->real_escape_string($_POST['Alergias']) : null;
    $Diagnostico = $conex->real_escape_string($_POST['Diagnostico']);
    $Cod_Mascotas = $conex->real_escape_string($_POST['Cod_Mascotas']);
    $Cod_Clientes = $conex->real_escape_string($_POST['Cod_Clientes']);
    $Cod_Trabajador = $conex->real_escape_string($_POST['Cod_Trabajador']);
    $Cod_Servicios = $conex->real_escape_string($_POST['Cod_Servicios']);
    $Cod_Historial = $conex->real_escape_string($_POST['Cod_Historial']);

    // Iniciar transacción
    $conex->begin_transaction();

    // Verificar si el Cod_Mascotas existe en la tabla Mascotas (consulta parametrizada)
    $stmt_check = $conex->prepare("SELECT COUNT(*) AS count FROM Mascotas WHERE Cod_Mascotas = ?");
    $stmt_check->bind_param("s", $Cod_Mascotas);
    $stmt_check->execute();
    $row_mascotas = $stmt_check->get_result()->fetch_assoc();
    $stmt_check->close();

    if ($row_mascotas['count'] == 0) {
        throw new Exception("La mascota proporcionada no existe.");
    }

    // Verificar si el Cod_Clientes existe en la tabla Clientes (consulta parametrizada)
    $stmt_check = $conex->prepare("SELECT COUNT(*) AS count FROM Clientes WHERE Cod_Clientes = ?");
    $stmt_check->bind_param("s", $Cod_Clientes);
    $stmt_check->execute();
    $row_clientes = $stmt_check->get_result()->fetch_assoc();
    $stmt_check->close();

    if ($row_clientes['count'] == 0) {
        throw new Exception("El cliente proporcionado no existe.");
    }

    // Verificar si el Cod_Trabajador existe en la tabla Trabajadores (consulta parametrizada)
    $stmt_check = $conex->prepare("SELECT COUNT(*) AS count FROM Trabajadores WHERE Cod_Trabajador = ?");
    $stmt_check->bind_param("s", $Cod_Trabajador);
    $stmt_check->execute();
    $row_trabajador = $stmt_check->get_result()->fetch_assoc();
    $stmt_check->close();

    if ($row_trabajador['count'] == 0) {
        throw new Exception("El trabajador proporcionado no existe.");
    }

    // Verificar si el Cod_Servicios existe en la tabla Servicios (consulta parametrizada)
    $stmt_check = $conex->prepare("SELECT COUNT(*) AS count FROM Servicios WHERE Cod_Servicios = ?");
    $stmt_check->bind_param("s", $Cod_Servicios);
    $stmt_check->execute();
    $row_servicios = $stmt_check->get_result()->fetch_assoc();
    $stmt_check->close();

    if ($row_servicios['count'] == 0) {
        throw new Exception("El servicio proporcionado no existe.");
    }

    // Insertar cita usando prepared statement
    $sql_citas = "INSERT INTO Citas (
        Motivo_Consulta, Cobro_Total, Metodo_Pago, Fecha_Cita, Tratamiento, 
        Enfermedades_Base, Alergias, Diagnostico, Cod_Mascotas, Cod_Clientes, 
        Cod_Trabajador, Cod_Servicios, Cod_Historial
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    $stmt_citas = $conex->prepare($sql_citas);
    $stmt_citas->bind_param(
        "sdsssssssssss",
        $Motivo_Consulta,
        $Cobro_Total,
        $Metodo_Pago,
        $Fecha_Cita,
        $Tratamiento,
        $Enfermedades_Base,
        $Alergias,
        $Diagnostico,
        $Cod_Mascotas,
        $Cod_Clientes,
        $Cod_Trabajador,
        $Cod_Servicios,
        $Cod_Historial
    );

    if (!$stmt_citas->execute()) {
        throw new Exception("Error al registrar la cita: " . $stmt_citas->error);
    }

       // Obtener el ID de la cita insertada
       $Cod_Cita = $conex->insert_id;

       // Preparar los datos para la respuesta
       $nuevaCita = [
           'Codigo_Cita' => $Cod_Cita,
           'Motivo_Consulta' => $Motivo_Consulta,
           'Cobro_Total' => $Cobro_Total,
           'Metodo_Pago' => $Metodo_Pago,
           'Fecha_Cita' => $Fecha_Cita,
           'Tratamiento' => $Tratamiento,
           'Enfermedades_Base' => $Enfermedades_Base,
           'Alergias' => $Alergias,
           'Diagnostico' => $Diagnostico,
           'Codigo_Mascota' => $Cod_Mascotas,
           'Codigo_Cliente' => $Cod_Clientes,
           'Codigo_Trabajador' => $Cod_Trabajador,
           'Codigo_Servicio' => $Cod_Servicios,
           'Codigo_Historial' => $Cod_Historial
       ];

    // Confirmar transacción
    $conex->commit();

    // Enviar respuesta de éxito
    header('Content-Type: application/json');
    echo json_encode([
        'exito' => true,
        'mensaje' => "✅ La cita ha sido registrada exitosamente ✅ \n\n🐾 Cuidando con amor a tus mascotas, sanando con pasión 🏥"
    ]);

} catch (Exception $e) {
    // Revertir transacción en caso de error
    if ($conex && $conex->connect_error === false) {
        $conex->rollback();
    }

    // Enviar respuesta de error
    header('Content-Type: application/json');
    echo json_encode([
        'exito' => false,
        'mensaje' => 'Error en el servidor',
        'errores' => [$e->getMessage()]
    ]);

    
}
  // Cerrar los prepared statements
  if (isset($stmt_mascota)) $stmt_mascota->close();
  if (isset($stmt_cliente)) $stmt_cliente->close();
  if (isset($stmt_trabajador)) $stmt_trabajador->close();
  if (isset($stmt_cita)) $stmt_cita->close();

// Cerrar conexión
if ($conex) {
    $conex->close();
}
?>