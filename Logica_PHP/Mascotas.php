<?php
// No debe haber espacios en blanco ni saltos de línea antes de <?php

// Habilitar reporte de errores para depuración (en producción, estos ajustes se deben desactivar)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Incluir conexión a la base de datos
require_once '../conexion.php';
require_once "csrf.php";
requireCsrf();
// Función para validar fecha con formato YYYY-MM-DD
function validarFecha($fecha) {
    $d = DateTime::createFromFormat('Y-m-d', $fecha);
    return $d && $d->format('Y-m-d') === $fecha;
}

// Array para almacenar errores
$errores = [];

// Verificar que el método de solicitud sea POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    $errores[] = "Método de solicitud no válido";
} else {
    // Validación del Nombre
    if (empty($_POST['Nombre'])) {
        $errores[] = "El nombre de la mascota es requerido";
    }

    // Validación de la Especie
    if (empty($_POST['Especie'])) {
        $errores[] = "La especie de la mascota es requerida";
    }

    // Validación de la Raza
    if (empty($_POST['Raza'])) {
        $errores[] = "La raza de la mascota es requerida";
    }

    // Validación de la Fecha de Nacimiento
    if (empty($_POST['Fecha_Nacimiento'])) {
        $errores[] = "La fecha de nacimiento es requerida";
    } elseif (!validarFecha($_POST['Fecha_Nacimiento'])) {
        $errores[] = "El formato de la fecha de nacimiento no es válido (debe ser YYYY-MM-DD)";
    }

    // Validación de la Edad
    if (empty($_POST['Edad'])) {
        $errores[] = "La edad de la mascota es requerida";
    } elseif (!is_numeric($_POST['Edad']) || $_POST['Edad'] < 0 || $_POST['Edad'] > 100) {
        $errores[] = "La edad debe ser un número entre 0 y 100 años";
    }

    // Validación del Código de Cliente
    if (empty($_POST['Cod_Clientes'])) {
        $errores[] = "El código del cliente es requerido";
    } elseif (!is_numeric($_POST['Cod_Clientes'])) {
        $errores[] = "El código del cliente debe ser un número";
    }
}

// Si existen errores de validación, enviar respuesta en JSON y finalizar
if (!empty($errores)) {
    header('Content-Type: application/json');
    echo json_encode([
        'exito'   => false,
        'mensaje' => 'Se encontraron los siguientes errores:',
        'errores' => $errores
    ]);
    exit;
}

try {
    // Verificar conexión a la base de datos
    if ($conex->connect_error) {
        throw new Exception("Error de conexión a la base de datos: " . $conex->connect_error);
    }

    // Sanitizar todos los datos recibidos
    $Nombre          = $conex->real_escape_string($_POST['Nombre']);
    $Especie         = $conex->real_escape_string($_POST['Especie']);
    $Raza            = $conex->real_escape_string($_POST['Raza']);
    $Fecha_Nacimiento= $conex->real_escape_string($_POST['Fecha_Nacimiento']);
    $Edad            = $conex->real_escape_string($_POST['Edad']);
    $Cod_Clientes    = $conex->real_escape_string($_POST['Cod_Clientes']);

    // Preparar los datos para devolverlos (se usan claves en minúscula para que coincidan con el JS)
    $datosMascota = [
        'nombre'          => $Nombre,
        'especie'         => $Especie,
        'raza'            => $Raza,
        'fechaNacimiento' => $Fecha_Nacimiento,
        'edad'            => $Edad,
        'codClientes'     => $Cod_Clientes
    ];

    

    // Validaciones adicionales (ya se verificó que los campos obligatorios existan)
    // Validación adicional de la fecha (usando strtotime)
    if (!strtotime($Fecha_Nacimiento)) {
        header('Content-Type: application/json');
        echo json_encode([
            'exito'   => false,
            'mensaje' => 'La fecha de nacimiento no es válida.',
            'datos'   => $datosMascota
        ]);
        exit;
    }

    // Validación adicional de la edad (asegurarse de que es numérica y positiva)
    if (!is_numeric($Edad) || $Edad < 0) {
        header('Content-Type: application/json');
        echo json_encode([
            'exito'   => false,
            'mensaje' => 'La edad debe ser un número válido y positivo.',
            'datos'   => $datosMascota
        ]);
        exit;
    }

    // Iniciar transacción
    $conex->begin_transaction();

    // Insertar mascota en la base de datos
    $sql_mascota = "INSERT INTO Mascotas 
        (Nombre, Especie, Raza, Fecha_Nacimiento, Edad, Cod_Clientes) 
        VALUES 
        ('$Nombre', '$Especie', '$Raza', '$Fecha_Nacimiento', '$Edad', '$Cod_Clientes')";

    if (!$conex->query($sql_mascota)) {
        throw new Exception("Error al insertar mascota: " . $conex->error);
    }

    // Confirmar transacción
    $conex->commit();

    // Enviar respuesta de éxito en JSON, incluyendo los datos de la mascota
    header('Content-Type: application/json');
    echo json_encode([
        'exito'   => true,
        'mensaje' => "✅ La mascota ha sido registrada exitosamente ✅ \n\n🐾 Cuidando con amor a tus mascotas, sanando con pasión 🏥",
        'datos'   => $datosMascota
    ]);
    exit;

} catch (Exception $e) {
    // Revertir transacción en caso de error
    if ($conex && !$conex->connect_error) {
        $conex->rollback();
    }
    // Enviar respuesta de error en JSON
    header('Content-Type: application/json');
    echo json_encode([
        'exito'   => false,
        'mensaje' => 'Error en el servidor',
        'errores' => [$e->getMessage()]
    ]);
    exit;
}

// Cerrar conexión
if ($conex) {
    $conex->close();
}
?>
