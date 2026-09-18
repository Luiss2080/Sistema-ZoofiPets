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
    // Validación de la Fecha de Compra
    if (empty($_POST['Fecha_Compra'])) {
        $errores[] = "La fecha de compra es requerida";
    } elseif (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $_POST['Fecha_Compra'])) {
        $errores[] = "➤ El formato de la fecha de compra no es válido (debe ser YYYY-MM-DD)";
    }

    // Validación de la Fecha de Ingreso
    if (empty($_POST['Fecha_Ingreso'])) {
        $errores[] = "La fecha de ingreso es requerida";
    } elseif (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $_POST['Fecha_Ingreso'])) {
        $errores[] = "➤ El formato de la fecha de ingreso no es válido (debe ser YYYY-MM-DD)";
    }

    // Validación de la Glosa
    if (empty($_POST['Glosa'])) {
        $errores[] = "La glosa es requerida";
    }

    // Validación del Descuento
    if (!isset($_POST['Descuento']) || !is_numeric($_POST['Descuento']) || $_POST['Descuento'] < 0) {
        $errores[] = "➤ El descuento debe ser un número no negativo";
    }

    // Validación del Estado
    if (empty($_POST['Estado'])) {
        $errores[] = "El estado es requerido";
    }

    // Validación del Código de Proveedor
    if (empty($_POST['Cod_Proveedores'])) {
        $errores[] = "El código del proveedor es requerido";
    } elseif (!is_numeric($_POST['Cod_Proveedores'])) {
        $errores[] = "➤ El código del proveedor debe ser un número";
    }

    // Validación del Código de Trabajador
    if (empty($_POST['Cod_Trabajador'])) {
        $errores[] = "El código del trabajador es requerido";
    } elseif (!is_numeric($_POST['Cod_Trabajador'])) {
        $errores[] = "➤ El código del trabajador debe ser un número";
    }

    // Validación del Producto
    if (empty($_POST['Productos'][0]['Cod_Productos']) || !is_numeric($_POST['Productos'][0]['Cod_Productos'])) {
        $errores[] = "➤ El código del producto es inválido";
    }
    if (empty($_POST['Productos'][0]['Cantidad']) || !is_numeric($_POST['Productos'][0]['Cantidad']) || $_POST['Productos'][0]['Cantidad'] <= 0) {
        $errores[] = "➤ La cantidad del producto debe ser un número positivo";
    }
    if (empty($_POST['Productos'][0]['Precio_Unitario']) || !is_numeric($_POST['Productos'][0]['Precio_Unitario']) || $_POST['Productos'][0]['Precio_Unitario'] <= 0) {
        $errores[] = "➤ El precio unitario del producto debe ser un número positivo";
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
    $Fecha_Compra = $conex->real_escape_string($_POST['Fecha_Compra']);
    $Fecha_Ingreso = $conex->real_escape_string($_POST['Fecha_Ingreso']);
    $Glosa = $conex->real_escape_string($_POST['Glosa']);
    $Descuento = $conex->real_escape_string($_POST['Descuento']);
    $Estado = $conex->real_escape_string($_POST['Estado']);
    $Cod_Proveedores = $conex->real_escape_string($_POST['Cod_Proveedores']);
    $Cod_Trabajador = $conex->real_escape_string($_POST['Cod_Trabajador']);
    $Cod_Productos = $conex->real_escape_string($_POST['Productos'][0]['Cod_Productos']);
    $Cantidad = $conex->real_escape_string($_POST['Productos'][0]['Cantidad']);
    $Precio_Unitario = $conex->real_escape_string($_POST['Productos'][0]['Precio_Unitario']);
    $Sub_Total = $Cantidad * $Precio_Unitario;
    $Monto_Total = max(0, $Sub_Total - $Descuento); // Aplicar descuento

    // Insertar en la tabla Compras (consulta parametrizada, una sola vez)
    $stmt_compra = $conex->prepare(
        "INSERT INTO Compras (Fecha_Compra, Fecha_Ingreso, Glosa, Monto_Total, Descuento, Estado, Cod_Proveedores, Cod_Trabajador, Cod_Productos, Cantidad, Precio_Unitario, Sub_Total)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    );
    $stmt_compra->bind_param(
        "ssssssssssss",
        $Fecha_Compra, $Fecha_Ingreso, $Glosa, $Monto_Total, $Descuento, $Estado,
        $Cod_Proveedores, $Cod_Trabajador, $Cod_Productos, $Cantidad, $Precio_Unitario, $Sub_Total
    );

    if (!$stmt_compra->execute()) {
        throw new Exception("Error al insertar compra: " . $stmt_compra->error);
    }
    $stmt_compra->close();

    $datosCompra = [
        'descuento' => $Descuento,
        'estado' => $Estado,
        'fechaCompra' => $Fecha_Compra,
        'fechaIngreso' => $Fecha_Ingreso,
        'glosa' => $Glosa,
        'monto' => number_format($Sub_Total, 2),
        'montoTotal' => number_format($Monto_Total, 2),
        'codProveedor' => $Cod_Proveedores,
        'codTrabajador' => $Cod_Trabajador
    ];

    $datosJson = urlencode(json_encode($datosCompra));
    header("Location: ../Formularios_HTML/FORM_Compras.html?nueva_compra=$datosJson");
    exit;

    // Enviar respuesta de éxito
    header('Content-Type: application/json');
    echo json_encode([
        'exito' => true,
        'mensaje' => "✅ La compra ha sido registrada exitosamente ✅ \n\n🐾 Cuidando con amor a tus mascotas, sanando con pasión 🏥"
    ]);

} catch (Exception $e) {
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