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
        $errores[] = "El nombre del producto es obligatorio";
    }

    // Validación del Stock
    if (empty($_POST['Stock']) || !is_numeric($_POST['Stock']) || $_POST['Stock'] < 0) {
        $errores[] = "El stock debe ser un número válido y no negativo";
    }

    // Validación del Precio de Compra
    if (empty($_POST['Precio_Compra']) || !is_numeric($_POST['Precio_Compra']) || $_POST['Precio_Compra'] <= 0) {
        $errores[] = "El precio de compra debe ser un número positivo";
    }

    // Validación del Precio de Venta
    if (empty($_POST['Precio_Venta']) || !is_numeric($_POST['Precio_Venta']) || $_POST['Precio_Venta'] <= 0) {
        $errores[] = "El precio de venta debe ser un número positivo";
    }

    // Validación del Código de Proveedor
    if (empty($_POST['Cod_Proveedores']) || !is_numeric($_POST['Cod_Proveedores'])) {
        $errores[] = "El código de proveedor es obligatorio y debe ser un número";
    }

    // Validación de la Categoría
    if (empty($_POST['Categoria'])) {
        $errores[] = "La categoría del producto es obligatoria";
    }

    // Validación del Tipo
    if (empty($_POST['Tipo'])) {
        $errores[] = "El tipo del producto es obligatorio";
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

// Verificar conexión antes de proceder
if ($conex->connect_error) {
    header('Content-Type: application/json');
    echo json_encode([
        'exito' => false,
        'mensaje' => 'Error de conexión a la base de datos',
        'errores' => [$conex->connect_error]
    ]);
    exit;
}

try {
    // Sanitizar los datos
    $Nombre = $conex->real_escape_string($_POST['Nombre']);
    $Stock = (int) $_POST['Stock'];
    $Precio_Compra = (float) $_POST['Precio_Compra'];
    $Precio_Venta = (float) $_POST['Precio_Venta'];
    $Cod_Proveedores = (int) $_POST['Cod_Proveedores'];
    $Categoria = $conex->real_escape_string($_POST['Categoria']);
    $Tipo = $conex->real_escape_string($_POST['Tipo']);

    // Iniciar transacción
    $conex->begin_transaction();

    // Insertar en la tabla Productos (consulta parametrizada)
    $stmt_producto = $conex->prepare(
        "INSERT INTO Productos (Nombre, Stock, Precio_Compra, Precio_Venta, Cod_Proveedores, Categoria, Tipo) VALUES (?, ?, ?, ?, ?, ?, ?)"
    );
    $stmt_producto->bind_param(
        "siddiss",
        $Nombre, $Stock, $Precio_Compra, $Precio_Venta, $Cod_Proveedores, $Categoria, $Tipo
    );

    if (!$stmt_producto->execute()) {
        throw new Exception("Error al registrar el producto: " . $stmt_producto->error);
    }
    $stmt_producto->close();

    // Confirmar transacción
    $conex->commit();

    $nuevoProducto = [
        'Nombre' => $Nombre,
        'Stock' => $Stock,
        'Precio_Compra' => $Precio_Compra,
        'Precio_Venta' => $Precio_Venta,
        'Categoria' => $Categoria,
        'Tipo' => $Tipo,
        'Cod_Proveedores' => $Cod_Proveedores
    ];
    
   // Redirigir correctamente:
   header("Location: ../Formularios_HTML/FORM_Productos.html?exito=1&nuevo_producto=" . urlencode(json_encode($nuevoProducto)));
exit;

    // Enviar respuesta de éxito
    header('Content-Type: application/json');
    echo json_encode([
        'exito' => true,
        'mensaje' => "✅ El Producto fue registrado correctamente ✅ \n\n🐾 Cuidando con amor a tus mascotas, sanando con pasión 🏥"
    ]);

} catch (Exception $e) {
    // Revertir transacción en caso de error
    $conex->rollback();

    // Enviar respuesta de error
    header('Content-Type: application/json');
    echo json_encode([
        'exito' => false,
        'mensaje' => 'Error en el servidor',
        'errores' => [$e->getMessage()]
    ]);
}

// Cerrar conexión
$conex->close();
?>