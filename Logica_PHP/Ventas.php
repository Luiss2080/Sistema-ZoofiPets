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
    // Validación del Número de Factura
    if (empty($_POST['Nro_Factura'])) {
        $errores[] = "El número de factura es obligatorio";
    }

    // Validación de la Fecha de Venta
    if (empty($_POST['Fecha_Venta'])) {
        $errores[] = "La fecha de venta es obligatoria";
    } elseif (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $_POST['Fecha_Venta'])) {
        $errores[] = "El formato de la fecha de venta no es válido (debe ser YYYY-MM-DD)";
    }

    // Validación del Nombre del Producto
    if (empty($_POST['Nombre_Producto'])) {
        $errores[] = "El nombre del producto es obligatorio";
    }

    // Validación del Método de Pago
    if (empty($_POST['Metodo_Pago'])) {
        $errores[] = "El método de pago es obligatorio";
    }

    // Validación del Monto Total
    if (empty($_POST['Monto_Total'])) {
        $errores[] = "El monto total es obligatorio";
    } elseif (!is_numeric($_POST['Monto_Total']) || $_POST['Monto_Total'] <= 0) {
        $errores[] = "El monto total debe ser un número positivo";
    }

    // Validación del Código de Cliente
    if (empty($_POST['Cod_Clientes'])) {
        $errores[] = "El código de cliente es obligatorio";
    } elseif (!is_numeric($_POST['Cod_Clientes'])) {
        $errores[] = "El código de cliente debe ser un número";
    }

    // Validación del Código de Trabajador
    if (empty($_POST['Cod_Trabajador'])) {
        $errores[] = "El código de trabajador es obligatorio";
    } elseif (!is_numeric($_POST['Cod_Trabajador'])) {
        $errores[] = "El código de trabajador debe ser un número";
    }

    // Validación del Código de Producto
    if (empty($_POST['Cod_Productos'])) {
        $errores[] = "El código de producto es obligatorio";
    } elseif (!is_numeric($_POST['Cod_Productos'])) {
        $errores[] = "El código de producto debe ser un número";
    }

    // Validación de la Cantidad
    if (empty($_POST['Cantidad'])) {
        $errores[] = "La cantidad es obligatoria";
    } elseif (!is_numeric($_POST['Cantidad']) || $_POST['Cantidad'] <= 0) {
        $errores[] = "La cantidad debe ser un número positivo";
    }

    // Validación del Subtotal
    if (empty($_POST['Sub_Total'])) {
        $errores[] = "El subtotal es obligatorio";
    } elseif (!is_numeric($_POST['Sub_Total']) || $_POST['Sub_Total'] <= 0) {
        $errores[] = "El subtotal debe ser un número positivo";
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
    $Nro_Factura = $conex->real_escape_string($_POST['Nro_Factura']);
    $Fecha_Venta = $conex->real_escape_string($_POST['Fecha_Venta']);
    $Nombre_Producto = $conex->real_escape_string($_POST['Nombre_Producto']);
    $Metodo_Pago = $conex->real_escape_string($_POST['Metodo_Pago']);
    $Monto_Total = $conex->real_escape_string($_POST['Monto_Total']);
    $Descuento = !empty($_POST['Descuento']) ? $conex->real_escape_string($_POST['Descuento']) : 0;
    $Cod_Clientes = $conex->real_escape_string($_POST['Cod_Clientes']);
    $Cod_Trabajador = $conex->real_escape_string($_POST['Cod_Trabajador']);
    $Cod_Productos = $conex->real_escape_string($_POST['Cod_Productos']);
    $Cantidad = $conex->real_escape_string($_POST['Cantidad']);
    $Sub_Total = $conex->real_escape_string($_POST['Sub_Total']);

    // Iniciar transacción
    $conex->begin_transaction();

    // Verificar si el Cod_Clientes existe en la tabla Clientes
    $sql_check_cliente = "SELECT COUNT(*) AS count FROM Clientes WHERE Cod_Clientes = '$Cod_Clientes'";
    $result_cliente = $conex->query($sql_check_cliente);
    $row_cliente = $result_cliente->fetch_assoc();

    if ($row_cliente['count'] == 0) {
        throw new Exception("El cliente proporcionado no existe.");
    }

    // Verificar si el Cod_Trabajador existe en la tabla Trabajadores
    $sql_check_trabajador = "SELECT COUNT(*) AS count FROM Trabajadores WHERE Cod_Trabajador = '$Cod_Trabajador'";
    $result_trabajador = $conex->query($sql_check_trabajador);
    $row_trabajador = $result_trabajador->fetch_assoc();

    if ($row_trabajador['count'] == 0) {
        throw new Exception("El trabajador proporcionado no existe.");
    }

    // Verificar si el Cod_Productos existe en la tabla Productos
    $sql_check_producto = "SELECT Stock FROM Productos WHERE Cod_Productos = '$Cod_Productos'";
    $result_producto = $conex->query($sql_check_producto);
    $row_producto = $result_producto->fetch_assoc();

    if (!$row_producto) {
        throw new Exception("El producto proporcionado no existe.");
    }

    if ($row_producto['Stock'] < $Cantidad) {
        throw new Exception("No hay suficiente stock para el producto.");
    }

    // Insertar en la tabla Ventas
    $sql_ventas = "INSERT INTO Ventas 
        (Nro_Factura, Fecha_Venta, Nombre_Producto, Metodo_Pago, Monto_Total, Descuento, Cod_Clientes, Cod_Trabajador, Cod_Productos, Cantidad, Sub_Total) 
        VALUES 
        ('$Nro_Factura', '$Fecha_Venta', '$Nombre_Producto', '$Metodo_Pago', '$Monto_Total', '$Descuento', '$Cod_Clientes', '$Cod_Trabajador', '$Cod_Productos', '$Cantidad', '$Sub_Total')";

    if (!$conex->query($sql_ventas)) {
        throw new Exception("Error al insertar venta: " . $conex->error);
    }

    // Actualizar el stock del producto
    $sql_update_stock = "UPDATE Productos SET Stock = Stock - $Cantidad WHERE Cod_Productos = '$Cod_Productos'";
    if (!$conex->query($sql_update_stock)) {
        throw new Exception("Error al actualizar el stock del producto: " . $conex->error);
    }

   // Preparar los datos para la respuesta
   $nuevaVenta = [
    'Codigo_Venta' => $Cod_Venta,
    'Nro_Factura' => $Nro_Factura,
    'Fecha_Venta' => $Fecha_Venta,
    'Monto' => $Monto,
    'Descuento' => $Descuento,
    'Monto_Total' => $Monto_Total,
    'Metodo_Pago' => $Metodo_Pago,
    'Codigo_Cliente' => $Cod_Clientes,
    'Codigo_Trabajador' => $Cod_Trabajador
];

// Confirmar la transacción
$conex->commit();

// Redirigir con los datos
header("Location: ../Formularios_HTML/FORM_Ventas.html?exito=1&nueva_venta=" . 
       urlencode(json_encode($nuevaVenta)));
exit;
    // Enviar respuesta de éxito
    header('Content-Type: application/json');
    echo json_encode([
        'exito' => true,
        'mensaje' => "✅ La venta ha sido registrada exitosamente ✅  \n\n🐾 Cuidando con amor a tus mascotas, sanando con pasión 🏥"
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