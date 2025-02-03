<?php
header('Content-Type: application/json');
// Incluir conexión a la base de datos
require_once "../conexion.php";


// Función para validar fecha
function validarFecha($fecha) {
    $d = DateTime::createFromFormat('Y-m-d', $fecha);
    return $d && $d->format('Y-m-d') === $fecha;
}

// Array para almacenar errores
$errores = [];

// Validar que se recibieron los datos requeridos
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    $errores[] = "Método de solicitud no válido";
} else {
    // Validación del Nombre
    if (empty($_POST['Nombre'])) {
        $errores[] = "El nombre es requerido";
    } elseif (!preg_match("/^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/", $_POST['Nombre'])) {
        $errores[] = "➤ El nombre solo debe contener letras";
    }

    // Validación del Apellido
    if (empty($_POST['Apellido'])) {
        $errores[] = "El apellido es requerido";
    } elseif (!preg_match("/^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/", $_POST['Apellido'])) {
        $errores[] = "➤ El apellido solo debe contener letras";
    }

    // Validación del Genero
    if (empty($_POST['Genero'])) {
        $errores[] = "➤ El Genero es requerido";
    }

    // Validación de la Fecha de Nacimiento
    if (empty($_POST['Fecha_Nacimiento'])) {
        $errores[] = "La fecha de nacimiento es requerida";
    } elseif (!validarFecha($_POST['Fecha_Nacimiento'])) {
        $errores[] = "➤ El formato de la fecha de nacimiento no es válido";
    }

    // Validación de la Edad
    if (empty($_POST['Edad'])) {
        $errores[] = "La edad es requerida";
    } elseif (!is_numeric($_POST['Edad']) || $_POST['Edad'] < 18 || $_POST['Edad'] > 100) {
        $errores[] = "➤ La edad debe ser un número entre 18 y 100 años";
    }

    // Validación de la Dirección
    if (empty($_POST['Direccion'])) {
        $errores[] = "➤ La dirección es requerida";
    }

    // Validación de la CI
    if (empty($_POST['CI'])) {
        $errores[] = "El CI es requerido";
    } elseif (!is_numeric($_POST['CI'])) {
        $errores[] = "➤ El C.I debe contener solo números";
    }

    // Validación de la Fecha de Ingreso
    if (empty($_POST['Fecha_Ingreso'])) {
        $errores[] = "La fecha de ingreso es requerida";
    } elseif (!validarFecha($_POST['Fecha_Ingreso'])) {
        $errores[] = "➤ El formato de la fecha de ingreso no es válido";
    }

    // Validación del Cargo
    if (empty($_POST['Cargo'])) {
        $errores[] = "➤ El cargo es requerido";
    }

    // Validación del Salario
    if (empty($_POST['Salario'])) {
        $errores[] = "El salario es requerido";
    } elseif (!is_numeric($_POST['Salario']) || $_POST['Salario'] <= 0) {
        $errores[] = "➤ El salario debe ser un número positivo";
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
        'exito' => true,
        'mensaje' => "✅ Registro exitoso ✅",
        'trabajador' => [
            'id' => $Cod_Trabajadores,
        ]
    ]);
    exit;
}

// Si no hay errores, proceder con la inserción
try {
    $busqueda = isset($_GET['busqueda']) ? $_GET['busqueda'] : '';
    
    $sql = "SELECT * FROM trabajadores WHERE 
            nombre LIKE :busqueda OR 
            apellido LIKE :busqueda OR 
            ci LIKE :busqueda OR 
            cargo LIKE :busqueda";
    
    $stmt = $conn->prepare($sql);
    $stmt->execute(['busqueda' => "%$busqueda%"]);
    $trabajadores = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'exito' => true,
        'trabajadores' => $trabajadores
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'exito' => false,
        'mensaje' => 'Error al buscar trabajadores: ' . $e->getMessage()
    ]);
}

// obtener_trabajador.php
header('Content-Type: application/json');
require_once 'conexion.php';

try {
    $id = $_GET['id'];
    
    $sql = "SELECT * FROM trabajadores WHERE id = :id";
    $stmt = $conn->prepare($sql);
    $stmt->execute(['id' => $id]);
    $trabajador = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($trabajador) {
        echo json_encode([
            'exito' => true,
            'trabajador' => $trabajador
        ]);
    } else {
        echo json_encode([
            'exito' => false,
            'mensaje' => 'Trabajador no encontrado'
        ]);
    }
} catch (PDOException $e) {
    echo json_encode([
        'exito' => false,
        'mensaje' => 'Error al obtener trabajador: ' . $e->getMessage()
    ]);
}

// eliminar_trabajador.php
header('Content-Type: application/json');
require_once 'conexion.php';

try {
    $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['id'];
    
    $sql = "DELETE FROM trabajadores WHERE id = :id";
    $stmt = $conn->prepare($sql);
    $stmt->execute(['id' => $id]);
    
    if ($stmt->rowCount() > 0) {
        echo json_encode([
            'exito' => true,
            'mensaje' => 'Trabajador eliminado correctamente'
        ]);
    } else {
        echo json_encode([
            'exito' => false,
            'mensaje' => 'No se pudo eliminar el trabajador'
        ]);
    }



    // Confirmar transacción

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