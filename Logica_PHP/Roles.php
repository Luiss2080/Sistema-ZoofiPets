<?php
// Habilitar reporte de errores para depuración
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Incluir conexión a la base de datos
require_once "../conexion.php";
require_once "auth.php";
requireAuth();
// Array para almacenar errores
$errores = [];

// Validar que se recibieron los datos requeridos
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    $errores[] = "Método de solicitud no válido";
} else {
    // Validación del Nombre del Rol
    if (empty($_POST['nombre_rol'])) {
        $errores[] = "El nombre del rol es obligatorio";
    }

    // Validación de la Descripción del Rol
    if (empty($_POST['descripcion_rol'])) {
        $errores[] = "La descripción del rol es obligatoria";
    }

    // Validación del Estado
    if (empty($_POST['estado'])) {
        $errores[] = "El estado del rol es obligatorio";
    } elseif (!in_array($_POST['estado'], ['Activo', 'Inactivo', 'Suspendido'])) {
        $errores[] = "➤ El estado del rol no es válido";
    }

    // Validación del Código de Usuario
    if (empty($_POST['Cod_Usuario'])) {
        $errores[] = "El código de usuario es obligatorio";
    } elseif (!is_numeric($_POST['Cod_Usuario'])) {
        $errores[] = "➤ El código de usuario debe ser un número";
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
    $Nombre_Rol = $conex->real_escape_string($_POST['nombre_rol']);
    $Descripcion_Rol = $conex->real_escape_string($_POST['descripcion_rol']);
    $Estado = $conex->real_escape_string($_POST['estado']);
    $Cod_Usuario = $conex->real_escape_string($_POST['Cod_Usuario']);

    // Iniciar transacción
    $conex->begin_transaction();

    // Verificar si el usuario existe
    $sql_check_user = "SELECT COUNT(*) AS count FROM Usuario WHERE Cod_Usuario = '$Cod_Usuario'";
    $result = $conex->query($sql_check_user);
    $row = $result->fetch_assoc();

    if ($row['count'] == 0) {
        throw new Exception("El usuario proporcionado no existe en la base de datos.");
    }

    // Insertar rol
    $sql_roles = "INSERT INTO Roles 
        (Nombre_Rol, Descripcion_Rol, Estado, Cod_Usuario) 
        VALUES 
        ('$Nombre_Rol', '$Descripcion_Rol', '$Estado', '$Cod_Usuario')";

    if (!$conex->query($sql_roles)) {
        throw new Exception("Error al insertar rol: " . $conex->error);
    }

    // Confirmar transacción
    $conex->commit();

    // Enviar respuesta de éxito
    header('Content-Type: application/json');
    echo json_encode([
        'exito' => true,
        'mensaje' => "✅ El rol ha sido registrado exitosamente ✅ \n\n🐾 Cuidando con amor a tus mascotas, sanando con pasión 🏥"
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