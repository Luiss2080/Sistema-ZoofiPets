<?php
require_once "../conexion.php";
require_once "auth.php";
requireAuth();
header('Content-Type: application/json');

// Verificar si es una petición POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["exito" => false, "mensaje" => "Método no permitido"]);
    exit;
}

// Recibiendo y limpiando los valores del formulario
$Nombre = trim($_POST['Nombre'] ?? '');
$Apellido = trim($_POST['Apellido'] ?? '');
$Genero = trim($_POST['Genero'] ?? '');
$Fecha_Nacimiento = trim($_POST['Fecha_Nacimiento'] ?? '');
$Edad = trim($_POST['Edad'] ?? '');
$Direccion = trim($_POST['Direccion'] ?? '');
$CI = trim($_POST['CI'] ?? '');
$Fecha_Registro = trim($_POST['Fecha_Registro'] ?? '');
$Preferencias_Contactos = trim($_POST['Preferencias_Contactos'] ?? '');
$Telefonos = isset($_POST['Telefonos']) ? (array)$_POST['Telefonos'] : [];
$Emails = isset($_POST['Emails']) ? (array)$_POST['Emails'] : [];

// Array para almacenar errores
$errores = [];

// Validaciones básicas
if (empty($Nombre) || empty($Apellido) || empty($Genero) || empty($Fecha_Nacimiento) || 
    empty($Edad) || empty($Direccion) || empty($CI) || empty($Fecha_Registro) || 
    empty($Preferencias_Contactos)) {
    $errores[] = "Todos los campos obligatorios deben estar llenos.";
}

// Validación específica para cada campo
if (!preg_match("/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/u", $Nombre)) {
    $errores[] = "El nombre solo debe contener letras.";
}

if (!preg_match("/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/u", $Apellido)) {
    $errores[] = "El apellido solo debe contener letras.";
}

if (!is_numeric($Edad) || $Edad < 0 || $Edad > 120) {
    $errores[] = "La edad debe ser un número válido entre 0 y 120.";
}

if (!preg_match("/^[0-9]+$/", $CI)) {
    $errores[] = "El CI debe contener solo números.";
}

// Validar teléfonos y emails
foreach ($Telefonos as $Telefono) {
    if (!preg_match('/^[0-9]{7,10}$/', $Telefono)) {
        $errores[] = "El teléfono '$Telefono' no es válido. Debe tener entre 7 y 10 dígitos.";
    }
}

foreach ($Emails as $Email) {
    if (!filter_var($Email, FILTER_VALIDATE_EMAIL)) {
        $errores[] = "El email '$Email' no es válido.";
    }
}

// Si hay errores, devolverlos
if (!empty($errores)) {
    echo json_encode(["exito" => false, "errores" => $errores]);
    exit;
}

// Iniciar transacción
$conex->begin_transaction();

try {
    // Insertar cliente
    $sql_cliente = "INSERT INTO Clientes (Nombre, Apellido, Genero, Fecha_Nacimiento, Edad, 
                    Direccion, CI, Fecha_Registro, Preferencias_Contactos) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    $stmt = $conex->prepare($sql_cliente);
    if (!$stmt) {
        throw new Exception("Error en la preparación de la consulta: " . $conex->error);
    }

    $stmt->bind_param("ssssissss", 
        $Nombre, 
        $Apellido, 
        $Genero, 
        $Fecha_Nacimiento, 
        $Edad, 
        $Direccion, 
        $CI, 
        $Fecha_Registro, 
        $Preferencias_Contactos
    );
    
    if (!$stmt->execute()) {
        throw new Exception("Error al insertar cliente: " . $stmt->error);
    }
    
    $Cod_Clientes = $stmt->insert_id;
    
    // Insertar teléfonos
    if (!empty($Telefonos)) {
        $sql_telefono = "INSERT INTO Telefono_Clientes (Cod_Clientes, Telefono) VALUES (?, ?)";
        $stmt_telefono = $conex->prepare($sql_telefono);
        if (!$stmt_telefono) {
            throw new Exception("Error en la preparación de la consulta de teléfonos");
        }

        foreach ($Telefonos as $Telefono) {
            $stmt_telefono->bind_param("is", $Cod_Clientes, $Telefono);
            if (!$stmt_telefono->execute()) {
                throw new Exception("Error al insertar teléfono: " . $stmt_telefono->error);
            }
        }
    }
    
    // Insertar emails
    if (!empty($Emails)) {
        $sql_email = "INSERT INTO Email_Clientes (Cod_Clientes, Email) VALUES (?, ?)";
        $stmt_email = $conex->prepare($sql_email);
        if (!$stmt_email) {
            throw new Exception("Error en la preparación de la consulta de emails");
        }

        foreach ($Emails as $Email) {
            $stmt_email->bind_param("is", $Cod_Clientes, $Email);
            if (!$stmt_email->execute()) {
                throw new Exception("Error al insertar email: " . $stmt_email->error);
            }
        }
    }
    
    // Confirmar transacción
    $conex->commit();
    
    echo json_encode([
        'exito' => true,
        'mensaje' => "✅ Registro exitoso ✅",
        'trabajador' => [
            'id' => $Cod_Clientes,
        ]
    ]);
    
} catch (Exception $e) {
    // Revertir transacción en caso de error
    $conex->rollback();
    echo json_encode([
        "exito" => false, 
        "mensaje" => "Error en el servidor: " . $e->getMessage()
    ]);
}
?>