<?php
// Habilitar reporte de errores para depuración
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Incluir conexión a la base de datos
require_once "../conexion.php";
require_once "csrf.php";
requireCsrf();
// Array para almacenar errores
$errores = [];

// Validar que se recibieron los datos requeridos
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    $errores[] = "Método de solicitud no válido";
} else {
    // Validación del Nombre de Usuario
    if (empty($_POST['Nombre_Usuario'])) {
        $errores[] = "El nombre de usuario es obligatorio";
    }

    // Validación del Correo Electrónico
    if (empty($_POST['Email'])) {
        $errores[] = "El correo electrónico es obligatorio";
    } elseif (!filter_var($_POST['Email'], FILTER_VALIDATE_EMAIL)) {
        $errores[] = "➤ El formato del correo electrónico no es válido";
    }

    // Validación de la Contraseña
    if (empty($_POST['Contraseña'])) {
        $errores[] = "La contraseña es obligatoria";
    } elseif (strlen($_POST['Contraseña']) < 8) {
        $errores[] = "➤ La contraseña debe tener al menos 8 caracteres";
    }

    // Validación de la Confirmación de Contraseña
    if (empty($_POST['Confirmar_Contraseña'])) {
        $errores[] = "La confirmación de contraseña es obligatoria";
    } elseif ($_POST['Contraseña'] !== $_POST['Confirmar_Contraseña']) {
        $errores[] = "➤ Las contraseñas no coinciden";
    }

    // Validación del Estado
    if (empty($_POST['Estado'])) {
        $errores[] = "El estado del usuario es obligatorio";
    }

    // Validación de la Fecha de Registro
    if (empty($_POST['Fecha_Registro'])) {
        $errores[] = "La fecha de registro es obligatoria";
    } elseif (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $_POST['Fecha_Registro'])) {
        $errores[] = "➤ El formato de la fecha de registro no es válido (debe ser YYYY-MM-DD)";
    }

    // Validación de Teléfonos
    if (!empty($_POST['Telefonos'])) {
        foreach ($_POST['Telefonos'] as $telefono) {
            if (!preg_match('/^\d{8,11}$/', $telefono)) {
                $errores[] = "➤ El número de teléfono '$telefono' no es válido (debe tener entre 8 y 11 dígitos)";
            }
        }
    }

    // Validación de Emails
    if (!empty($_POST['Emails'])) {
        foreach ($_POST['Emails'] as $email) {
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $errores[] = "➤ El correo electrónico '$email' no es válido";
            }
        }
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
    $Nombre_Usuario = $conex->real_escape_string($_POST['Nombre_Usuario']);
    $Email = $conex->real_escape_string($_POST['Email']);
    $Contraseña = password_hash($_POST['Contraseña'], PASSWORD_BCRYPT); // Hashear la contraseña
    $Estado = $conex->real_escape_string($_POST['Estado']);
    $Fecha_Registro = $conex->real_escape_string($_POST['Fecha_Registro']);

    // Iniciar transacción
    $conex->begin_transaction();

    // Insertar usuario
    $sql_usuario = "INSERT INTO Usuario 
        (Nombre_Usuario, Correo_Institucional, Contrasena_Institucional, Estado_Usuario, Fecha_Creacion) 
        VALUES 
        ('$Nombre_Usuario', '$Email', '$Contraseña', '$Estado', '$Fecha_Registro')";

    if (!$conex->query($sql_usuario)) {
        throw new Exception("Error al insertar usuario: " . $conex->error);
    }

    // Obtener el ID del usuario insertado
    $Cod_Usuario = $conex->insert_id;

    // Insertar teléfonos
    if (!empty($_POST['Telefonos'])) {
        foreach ($_POST['Telefonos'] as $Telefono) {
            $Telefono = $conex->real_escape_string($Telefono);
            $sql_telefono = "INSERT INTO Telefonos_Usuario (Cod_Usuario, Telefono) 
                             VALUES ('$Cod_Usuario', '$Telefono')";
            
            if (!$conex->query($sql_telefono)) {
                throw new Exception("Error al insertar teléfono: " . $conex->error);
            }
        }
    }

    // Insertar emails
    if (!empty($_POST['Emails'])) {
        foreach ($_POST['Emails'] as $Email) {
            $Email = $conex->real_escape_string($Email);
            $sql_email = "INSERT INTO Emails_Usuario (Cod_Usuario, Email) 
                          VALUES ('$Cod_Usuario', '$Email')";
            
            if (!$conex->query($sql_email)) {
                throw new Exception("Error al insertar email: " . $conex->error);
            }
        }
    }

    // Confirmar transacción
    $conex->commit();

    
    // Preparar los datos para la respuesta
    $nuevaUsuario = [
        'Codigo_Usuario' => $codUsuario,
        'Nombre_Usuario' => $nombreUsuario,
        'Correo_Institucional' => $correo,
        'Estado_Usuario' => $estado,
        'Fecha_Registro' => $fechaRegistro,
        'Telefonos' => $telefonos,
        'Emails' => $emails
    ];

    // Redirigir con los datos
    header("Location: ../Formularios_HTML/FORM_Usuario.html?exito=1&nuevo_usuario=" . urlencode(json_encode($nuevaUsuario)));
    exit;

    // Enviar respuesta de éxito
    header('Content-Type: application/json');
    echo json_encode([
        'exito' => true,
        'mensaje' => "✅ El usuario ha sido registrado exitosamente ✅ \n\n🐾 Cuidando con amor a tus mascotas, sanando con pasión 🏥"
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