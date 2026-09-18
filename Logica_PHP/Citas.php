<?php
// Habilitar reporte de errores para depuración
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Incluir conexión a la base de datos
require_once "../conexion.php";
require_once "auth.php";
requireAuth();
require_once "ValidacionCitas.php";

// Array para almacenar errores
$errores = [];

// Validar que se recibieron los datos requeridos
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    $errores[] = "Método de solicitud no válido";
} else {
    // La validación de campos vive en ValidacionCitas.php (función pura,
    // cubierta por tests/run.php) para no duplicar estas reglas ni dejarlas
    // sin probar.
    $errores = validarDatosCita($_POST);
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

    // Verificar si el Cod_Mascotas existe en la tabla Mascotas
    $sql_check_mascotas = "SELECT COUNT(*) AS count FROM Mascotas WHERE Cod_Mascotas = '$Cod_Mascotas'";
    $result_mascotas = $conex->query($sql_check_mascotas);
    $row_mascotas = $result_mascotas->fetch_assoc();

    if ($row_mascotas['count'] == 0) {
        throw new Exception("La mascota proporcionada no existe.");
    }

    // Verificar si el Cod_Clientes existe en la tabla Clientes
    $sql_check_clientes = "SELECT COUNT(*) AS count FROM Clientes WHERE Cod_Clientes = '$Cod_Clientes'";
    $result_clientes = $conex->query($sql_check_clientes);
    $row_clientes = $result_clientes->fetch_assoc();

    if ($row_clientes['count'] == 0) {
        throw new Exception("El cliente proporcionado no existe.");
    }

    // Verificar si el Cod_Trabajador existe en la tabla Trabajadores
    $sql_check_trabajador = "SELECT COUNT(*) AS count FROM Trabajadores WHERE Cod_Trabajador = '$Cod_Trabajador'";
    $result_trabajador = $conex->query($sql_check_trabajador);
    $row_trabajador = $result_trabajador->fetch_assoc();

    if ($row_trabajador['count'] == 0) {
        throw new Exception("El trabajador proporcionado no existe.");
    }

    // Verificar si el Cod_Servicios existe en la tabla Servicios
    $sql_check_servicios = "SELECT COUNT(*) AS count FROM Servicios WHERE Cod_Servicios = '$Cod_Servicios'";
    $result_servicios = $conex->query($sql_check_servicios);
    $row_servicios = $result_servicios->fetch_assoc();

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