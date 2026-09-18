<?php
// Habilitar reporte de errores para depuración
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Incluir conexión a la base de datos
require_once "../conexion.php";

// Array para almacenar errores
$errores = [];

// Validar que se recibieron los datos requeridos
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    $errores[] = "Método de solicitud no válido";
} else {
    // Validación de la Especialidad
    if (empty($_POST['Especialidades'])) {
        $errores[] = "La especialidad es obligatoria";
    }

    // Validación del Especialista
    if (empty($_POST['Especialista'])) {
        $errores[] = "El nombre del especialista es obligatorio";
    }

    // Validación del Precio
    if (empty($_POST['Precio'])) {
        $errores[] = "El precio es obligatorio";
    } elseif (!is_numeric($_POST['Precio']) || $_POST['Precio'] <= 0) {
        $errores[] = "El precio debe ser un número positivo";
    }

    // Validación de la Duración Estimada
    if (empty($_POST['Duracion_Estimada'])) {
        $errores[] = "La duración estimada es obligatoria";
    }

    // Validación de la Categoría
    if (empty($_POST['Categoria'])) {
        $errores[] = "La categoría es obligatoria";
    }

    // Validación del Turno
    if (empty($_POST['Turno'])) {
        $errores[] = "El turno es obligatorio";
    }

    // Validación del Código de Historial
    if (empty($_POST['Cod_Historial'])) {
        $errores[] = "El código de historial es obligatorio";
    } elseif (!is_numeric($_POST['Cod_Historial'])) {
        $errores[] = "El código de historial debe ser un número";
    }

    // Validación del Código de Mascota (si se proporciona)
    if (!empty($_POST['Cod_Mascotas']) && !is_numeric($_POST['Cod_Mascotas'])) {
        $errores[] = "El código de mascota debe ser un número";
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
    $Especialidades = $conex->real_escape_string($_POST['Especialidades']);
    $Especialista = $conex->real_escape_string($_POST['Especialista']);
    $Precio = $conex->real_escape_string($_POST['Precio']);
    $Duracion_Estimada = $conex->real_escape_string($_POST['Duracion_Estimada']);
    $Categoria = $conex->real_escape_string($_POST['Categoria']);
    $Turno = $conex->real_escape_string($_POST['Turno']);
    $Cod_Mascotas = !empty($_POST['Cod_Mascotas']) ? $conex->real_escape_string($_POST['Cod_Mascotas']) : null;
    $Cod_Historial = $conex->real_escape_string($_POST['Cod_Historial']);

    // Iniciar transacción
    $conex->begin_transaction();

    // Verificar si el Cod_Historial existe en la tabla Historial
    $sql_check_historial = "SELECT COUNT(*) AS count FROM Historial WHERE Cod_Historial = '$Cod_Historial'";
    $result_historial = $conex->query($sql_check_historial);
    $row_historial = $result_historial->fetch_assoc();

    if ($row_historial['count'] == 0) {
        throw new Exception("El historial proporcionado no existe.");
    }

    // Verificar si el Cod_Mascotas existe en la tabla Mascotas (si se proporciona)
    if ($Cod_Mascotas !== null) {
        $sql_check_mascotas = "SELECT COUNT(*) AS count FROM Mascotas WHERE Cod_Mascotas = '$Cod_Mascotas'";
        $result_mascotas = $conex->query($sql_check_mascotas);
        $row_mascotas = $result_mascotas->fetch_assoc();

        if ($row_mascotas['count'] == 0) {
            throw new Exception("La mascota proporcionada no existe.");
        }
    }

    // Insertar servicio
    $sql_servicios = "INSERT INTO Servicios 
        (Especialidades, Especialista, Precio, Duracion_Estimada, Categoria, Turno, Cod_Mascotas, Cod_Historial) 
        VALUES 
        ('$Especialidades', '$Especialista', '$Precio', '$Duracion_Estimada', '$Categoria', '$Turno', '$Cod_Mascotas', '$Cod_Historial')";

    if (!$conex->query($sql_servicios)) {
        throw new Exception("Error al insertar servicio: " . $conex->error);
    }

    // Confirmar transacción
    $conex->commit();

     // Preparar datos para mostrar
     $nuevoServicio = [
        'Cod_Servicios' => $conex->insert_id,
        'Especialidades' => $Especialidades,
        'Especialista' => $Especialista,
        'Precio' => $Precio,
        'Duracion_Estimada' => $Duracion_Estimada,
        'Categoria' => $Categoria,
        'Turno' => $Turno,
        'Cod_Mascotas' => $Cod_Mascotas,
        'Cod_Historial' => $Cod_Historial
    ];

    // Redirigir con parámetros
    header("Location: ../Formularios_HTML/FORM_Servicios.html?exito=1&nuevo_servicio=" . urlencode(json_encode($nuevoServicio)));
    exit;


    // Enviar respuesta de éxito
    header('Content-Type: application/json');
    echo json_encode([
        'exito' => true,
        'mensaje' => "✅ El servicio ha sido registrado exitosamente ✅ \n\n🐾 Cuidando con amor a tus mascotas, sanando con pasión 🏥"
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

// Cerrar conexión
if ($conex) {
    $conex->close();
}
?>