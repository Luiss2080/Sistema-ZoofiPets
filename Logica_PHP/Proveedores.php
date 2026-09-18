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
    // Validación del Nombre
    if (empty($_POST['Nombre'])) {
        $errores[] = "El nombre del proveedor es requerido";
    }

    // Validación del Rubro
    if (empty($_POST['Rubro'])) {
        $errores[] = "El rubro del proveedor es requerido";
    }

    // Validación de la Razón Social
    if (empty($_POST['Razon_Social'])) {
        $errores[] = "La razón social del proveedor es requerida";
    }

    // Validación de la Dirección
    if (empty($_POST['Direccion'])) {
        $errores[] = "La dirección del proveedor es requerida";
    }

    // Validación de la Fecha de Registro
    if (empty($_POST['Fecha_Registro'])) {
        $errores[] = "La fecha de registro es requerida";
    } elseif (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $_POST['Fecha_Registro'])) {
        $errores[] = "El formato de la fecha de registro no es válido (debe ser YYYY-MM-DD)";
    }

    // Validación de Teléfonos
    if (!empty($_POST['Telefonos'])) {
        foreach ($_POST['Telefonos'] as $telefono) {
            if (!preg_match('/^\d{8,11}$/', $telefono)) {
                $errores[] = "El número de teléfono '$telefono' no es válido (debe tener entre 8 y 11 dígitos)";
            }
        }
    }

    // Validación de Emails
    if (!empty($_POST['Emails'])) {
        foreach ($_POST['Emails'] as $email) {
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $errores[] = "El correo electrónico '$email' no es válido";
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
    $Nombre = $conex->real_escape_string($_POST['Nombre']);
    $Rubro = $conex->real_escape_string($_POST['Rubro']);
    $Razon_Social = $conex->real_escape_string($_POST['Razon_Social']);
    $Direccion = $conex->real_escape_string($_POST['Direccion']);
    $Fecha_Registro = $conex->real_escape_string($_POST['Fecha_Registro']);

    // Iniciar transacción
    $conex->begin_transaction();

    // Insertar proveedor (consulta parametrizada)
    $stmt_proveedor = $conex->prepare(
        "INSERT INTO Proveedores (Nombre, Rubro, Razon_Social, Direccion, Fecha_Registro) VALUES (?, ?, ?, ?, ?)"
    );
    $stmt_proveedor->bind_param("sssss", $Nombre, $Rubro, $Razon_Social, $Direccion, $Fecha_Registro);

    if (!$stmt_proveedor->execute()) {
        throw new Exception("Error al insertar proveedor: " . $stmt_proveedor->error);
    }

    // Obtener el ID del proveedor insertado
    $Cod_Proveedores = $stmt_proveedor->insert_id;
    $stmt_proveedor->close();

    // Insertar teléfonos (consulta parametrizada)
    if (!empty($_POST['Telefonos'])) {
        $stmt_telefono = $conex->prepare("INSERT INTO Telefono_Proveedores (Cod_Proveedores, Telefono) VALUES (?, ?)");
        foreach ($_POST['Telefonos'] as $Telefono) {
            $stmt_telefono->bind_param("is", $Cod_Proveedores, $Telefono);
            if (!$stmt_telefono->execute()) {
                throw new Exception("Error al insertar teléfono: " . $stmt_telefono->error);
            }
        }
        $stmt_telefono->close();
    }

    // Insertar emails (consulta parametrizada)
    if (!empty($_POST['Emails'])) {
        $stmt_email = $conex->prepare("INSERT INTO Email_Proveedores (Cod_Proveedores, Email) VALUES (?, ?)");
        foreach ($_POST['Emails'] as $Email) {
            $stmt_email->bind_param("is", $Cod_Proveedores, $Email);
            if (!$stmt_email->execute()) {
                throw new Exception("Error al insertar email: " . $stmt_email->error);
            }
        }
        $stmt_email->close();
    }

    // Confirmar transacción
    $conex->commit();
    
    $nuevoProducto = [
        'Nombre' => $nombre,
        'Stock' => $stock,
        'Proveedor' => $proveedor,
        'Categoria' => $categoria,
        'Tipo' => $tipo,
        'Cod_Proveedores' => $cod_proveedor
    ];
    
   // Redirigir correctamente:
   header("Location: ../Formularios_HTML/FORM_Productos.html?exito=1&nuevo_producto=" . urlencode(json_encode($nuevoProducto)));
exit;

    // Enviar respuesta de éxito
    header('Content-Type: application/json');
    echo json_encode([
        'exito' => true,
        'mensaje' => "✅ El proveedor ha sido registrado exitosamente ✅ \n\n🐾 Cuidando con amor a tus mascotas, sanando con pasión 🏥"
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