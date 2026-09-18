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
    // Validación de la Descripción del Permiso
    if (empty($_POST['Descripcion_Permiso'])) {
        $errores[] = "La descripción del permiso es obligatoria";
    }

    // Validación del Código de Usuario
    if (empty($_POST['Cod_Usuario'])) {
        $errores[] = "El código de usuario es obligatorio";
    } elseif (!is_numeric($_POST['Cod_Usuario'])) {
        $errores[] = "➤ El código de usuario debe ser un número";
    }

    // Validación del Código de Rol
    if (empty($_POST['Cod_Roles'])) {
        $errores[] = "El código de rol es obligatorio";
    } elseif (!is_numeric($_POST['Cod_Roles'])) {
        $errores[] = "➤ El código de rol debe ser un número";
    }

    // Validación del Estado
    if (empty($_POST['Estado'])) {
        $errores[] = "El estado es obligatorio";
    } elseif (!in_array($_POST['Estado'], ['Activo', 'Inactivo'])) {
        $errores[] = "➤ El estado debe ser 'Activo' o 'Inactivo'";
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
    $Visualizar = isset($_POST['Visualizar']) ? 1 : 0;
    $Modificar = isset($_POST['Modificar']) ? 1 : 0;
    $Eliminar = isset($_POST['Eliminar']) ? 1 : 0;
    $Agregar = isset($_POST['Agregar']) ? 1 : 0;
    $Descripcion_Permiso = $conex->real_escape_string($_POST['Descripcion_Permiso']);
    $Estado = $conex->real_escape_string($_POST['Estado']);
    $Cod_Usuario = $conex->real_escape_string($_POST['Cod_Usuario']);
    $Cod_Roles = $conex->real_escape_string($_POST['Cod_Roles']);

    // Iniciar transacción
    $conex->begin_transaction();

    // Validar si el Cod_Usuario existe en la tabla Usuario (consulta parametrizada)
    $stmt_check = $conex->prepare("SELECT COUNT(*) AS count FROM Usuario WHERE Cod_Usuario = ?");
    $stmt_check->bind_param("s", $Cod_Usuario);
    $stmt_check->execute();
    $row_user = $stmt_check->get_result()->fetch_assoc();
    $stmt_check->close();

    if ($row_user['count'] == 0) {
        throw new Exception("El usuario proporcionado no existe en la base de datos.");
    }

    // Validar si el Cod_Roles existe en la tabla Roles (consulta parametrizada)
    $stmt_check = $conex->prepare("SELECT COUNT(*) AS count FROM Roles WHERE Cod_Roles = ?");
    $stmt_check->bind_param("s", $Cod_Roles);
    $stmt_check->execute();
    $row_role = $stmt_check->get_result()->fetch_assoc();
    $stmt_check->close();

    if ($row_role['count'] == 0) {
        throw new Exception("El rol proporcionado no existe en la base de datos.");
    }

    // Insertar permiso (consulta parametrizada)
    $stmt_permisos = $conex->prepare(
        "INSERT INTO Permisos (Cod_Roles, Visualizar, Modificar, Eliminar, Agregar, Descripcion_Permiso, Estado, Cod_Usuario)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    );
    $stmt_permisos->bind_param(
        "siiiisss",
        $Cod_Roles, $Visualizar, $Modificar, $Eliminar, $Agregar, $Descripcion_Permiso, $Estado, $Cod_Usuario
    );

    if (!$stmt_permisos->execute()) {
        throw new Exception("Error al insertar permiso: " . $stmt_permisos->error);
    }
    $stmt_permisos->close();


        /* ----------- PREPARAR DATOS PARA MOSTRAR ---------- */
        $nuevoPermiso = [
            'Visualizar' => $Visualizar,
            'Modificar' => $Modificar,
            'Eliminar' => $Eliminar,
            'Agregar' => $Agregar,
            'Descripcion_Permiso' => $Descripcion_Permiso,
            'Estado' => $Estado,
            'Cod_Usuario' => $Cod_Usuario
        ];


    // Confirmar transacción
    $conex->commit();

    echo json_encode(['exito' => true, 'mensaje' => 'Permiso registrado exitosamente.', 'registro' => $nuevoPermiso]);

    // Enviar respuesta de éxito
    header('Content-Type: application/json');
    echo json_encode([
        'exito' => true,
        'mensaje' => "✅ El permiso ha sido registrado exitosamente ✅ \n\n🐾 Cuidando con amor a tus mascotas, sanando con pasión 🏥"
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