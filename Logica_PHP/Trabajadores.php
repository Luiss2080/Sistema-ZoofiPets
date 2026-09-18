<?php
// Habilitar reporte de errores para depuración
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');

// Incluir conexión a la base de datos
require_once "../conexion.php";
require_once "auth.php";
requireAuth();
require_once "csrf.php";
requireCsrf();

// Función para validar fecha
function validarFecha($fecha) {
    $d = DateTime::createFromFormat('Y-m-d', $fecha);
    return $d && $d->format('Y-m-d') === $fecha;
}

/* ------------------------------------------------------------------
 * LISTAR TRABAJADORES (GET)
 * ------------------------------------------------------------------ */
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $sql = "SELECT Cod_Trabajador, Nombre, Apellido, Genero, Fecha_Nacimiento, Edad,
                       Direccion, CI, Fecha_Ingreso, Cargo, Salario
                FROM Trabajadores
                ORDER BY Cod_Trabajador DESC";
        $result = $conex->query($sql);

        if (!$result) {
            throw new Exception("Error al obtener trabajadores: " . $conex->error);
        }

        $trabajadores = [];
        while ($fila = $result->fetch_assoc()) {
            $codTrabajador = $fila['Cod_Trabajador'];

            $telefonos = [];
            $stmtTel = $conex->prepare("SELECT Telefono FROM Telefono_Trabajador WHERE Cod_Trabajador = ?");
            $stmtTel->bind_param("i", $codTrabajador);
            $stmtTel->execute();
            $resTel = $stmtTel->get_result();
            while ($t = $resTel->fetch_assoc()) {
                $telefonos[] = $t['Telefono'];
            }
            $stmtTel->close();

            $emails = [];
            $stmtEmail = $conex->prepare("SELECT Email FROM Email_Trabajador WHERE Cod_Trabajador = ?");
            $stmtEmail->bind_param("i", $codTrabajador);
            $stmtEmail->execute();
            $resEmail = $stmtEmail->get_result();
            while ($e = $resEmail->fetch_assoc()) {
                $emails[] = $e['Email'];
            }
            $stmtEmail->close();

            $trabajadores[] = [
                'id' => $codTrabajador,
                'nombre' => $fila['Nombre'],
                'apellido' => $fila['Apellido'],
                'genero' => $fila['Genero'],
                'fecha_nacimiento' => $fila['Fecha_Nacimiento'],
                'edad' => $fila['Edad'],
                'direccion' => $fila['Direccion'],
                'ci' => $fila['CI'],
                'fecha_ingreso' => $fila['Fecha_Ingreso'],
                'cargo' => $fila['Cargo'],
                'salario' => $fila['Salario'],
                'telefonos' => implode(', ', $telefonos),
                'emails' => implode(', ', $emails),
            ];
        }

        echo json_encode(['exito' => true, 'trabajadores' => $trabajadores]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['exito' => false, 'mensaje' => 'Error al obtener trabajadores', 'errores' => [$e->getMessage()]]);
    }

    if ($conex) {
        $conex->close();
    }
    exit;
}

/* ------------------------------------------------------------------
 * REGISTRAR TRABAJADOR (POST)
 * ------------------------------------------------------------------ */
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['exito' => false, 'mensaje' => 'Método de solicitud no válido']);
    exit;
}

// Array para almacenar errores
$errores = [];

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

$Telefonos = isset($_POST['Telefonos']) ? (array)$_POST['Telefonos'] : [];
$Emails = isset($_POST['Emails']) ? (array)$_POST['Emails'] : [];

// Validación de Teléfonos
foreach ($Telefonos as $telefono) {
    if ($telefono !== '' && !preg_match('/^\d{8,11}$/', $telefono)) {
        $errores[] = "➤ El número de teléfono '$telefono' no es válido (debe tener entre 8 y 11 dígitos)";
    }
}

// Validación de Emails
foreach ($Emails as $email) {
    if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errores[] = "➤ El correo electrónico '$email' no es válido";
    }
}

// Si hay errores, devolver respuesta temprana (con el estado correcto)
if (!empty($errores)) {
    echo json_encode([
        'exito' => false,
        'mensaje' => 'Se encontraron los siguientes errores:',
        'errores' => $errores
    ]);
    exit;
}

// Si no hay errores, proceder con la inserción
try {
    if ($conex->connect_error) {
        throw new Exception("Error de conexión a la base de datos: " . $conex->connect_error);
    }

    $Nombre = trim($_POST['Nombre']);
    $Apellido = trim($_POST['Apellido']);
    $Genero = trim($_POST['Genero']);
    $Fecha_Nacimiento = trim($_POST['Fecha_Nacimiento']);
    $Edad = (int) $_POST['Edad'];
    $Direccion = trim($_POST['Direccion']);
    $CI = trim($_POST['CI']);
    $Fecha_Ingreso = trim($_POST['Fecha_Ingreso']);
    $Cargo = trim($_POST['Cargo']);
    $Salario = (float) $_POST['Salario'];

    $conex->begin_transaction();

    $sql_trabajador = "INSERT INTO Trabajadores
        (Nombre, Apellido, Genero, Fecha_Nacimiento, Edad, Direccion, CI, Fecha_Ingreso, Cargo, Salario)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    $stmt = $conex->prepare($sql_trabajador);
    if (!$stmt) {
        throw new Exception("Error en la preparación de la consulta: " . $conex->error);
    }

    $stmt->bind_param(
        "ssssissssd",
        $Nombre,
        $Apellido,
        $Genero,
        $Fecha_Nacimiento,
        $Edad,
        $Direccion,
        $CI,
        $Fecha_Ingreso,
        $Cargo,
        $Salario
    );

    if (!$stmt->execute()) {
        throw new Exception("Error al insertar trabajador: " . $stmt->error);
    }

    $Cod_Trabajador = $stmt->insert_id;
    $stmt->close();

    if (!empty($Telefonos)) {
        $sql_telefono = "INSERT INTO Telefono_Trabajador (Cod_Trabajador, Telefono) VALUES (?, ?)";
        $stmt_telefono = $conex->prepare($sql_telefono);
        foreach ($Telefonos as $Telefono) {
            if ($Telefono === '') continue;
            $stmt_telefono->bind_param("is", $Cod_Trabajador, $Telefono);
            if (!$stmt_telefono->execute()) {
                throw new Exception("Error al insertar teléfono: " . $stmt_telefono->error);
            }
        }
        $stmt_telefono->close();
    }

    if (!empty($Emails)) {
        $sql_email = "INSERT INTO Email_Trabajador (Cod_Trabajador, Email) VALUES (?, ?)";
        $stmt_email = $conex->prepare($sql_email);
        foreach ($Emails as $Email) {
            if ($Email === '') continue;
            $stmt_email->bind_param("is", $Cod_Trabajador, $Email);
            if (!$stmt_email->execute()) {
                throw new Exception("Error al insertar email: " . $stmt_email->error);
            }
        }
        $stmt_email->close();
    }

    $conex->commit();

    echo json_encode([
        'exito' => true,
        'mensaje' => "✅ El trabajador ha sido registrado exitosamente ✅ \n\n🐾 Cuidando con amor a tus mascotas, sanando con pasión 🏥",
        'trabajador' => ['id' => $Cod_Trabajador]
    ]);

} catch (Exception $e) {
    if ($conex && $conex->connect_error === false) {
        $conex->rollback();
    }
    http_response_code(500);
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
