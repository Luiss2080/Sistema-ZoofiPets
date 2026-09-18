<?php
/* ----------- CONFIGURAR LA VISUALIZACIÓN DE ERRORES PARA DEPURACIÓN ---------- */
error_reporting(E_ALL);
ini_set('display_errors', 1);

/* ----------- INCLUIR CONEXIÓN A LA BASE DE DATOS ---------- */
require_once "../conexion.php";
require_once "csrf.php";
requireCsrf();
/* ----------- VERIFICAR CONEXIÓN ---------- */
if ($conex->connect_error) {
    die(json_encode(['exito' => false, 'mensaje' => 'Error de conexión: ' . $conex->connect_error]));
}

/* ----------- RECIBIR Y SANITIZAR DATOS DEL FORMULARIO ---------- */
$Mascota_Cliente = isset($_POST['Mascota_Cliente']) ? trim($conex->real_escape_string($_POST['Mascota_Cliente'])) : '';
$Diagnostico = isset($_POST['Diagnostico']) ? trim($conex->real_escape_string($_POST['Diagnostico'])) : '';
$Tratamiento = isset($_POST['Tratamiento']) ? trim($conex->real_escape_string($_POST['Tratamiento'])) : '';
$Especialidades = isset($_POST['Especialidades']) ? trim($conex->real_escape_string($_POST['Especialidades'])) : '';
$Pronostico_Final = isset($_POST['Pronostico_Final']) ? trim($conex->real_escape_string($_POST['Pronostico_Final'])) : '';
$Cod_Mascotas = isset($_POST['Cod_Mascotas']) ? trim($conex->real_escape_string($_POST['Cod_Mascotas'])) : '';

/* ----------- VALIDAR CAMPOS OBLIGATORIOS ---------- */
$errores = [];

if (empty($Mascota_Cliente)) $errores[] = "El nombre de la mascota o cliente es obligatorio.";
if (empty($Diagnostico)) $errores[] = "El diagnóstico es obligatorio.";
if (empty($Tratamiento)) $errores[] = "El tratamiento es obligatorio.";
if (empty($Especialidades)) $errores[] = "Debe especificar una especialidad.";
if (empty($Pronostico_Final)) $errores[] = "El pronóstico final es obligatorio.";
if (empty($Cod_Mascotas)) {
    $errores[] = "El código de la mascota es obligatorio.";
} elseif (!is_numeric($Cod_Mascotas)) {
    $errores[] = "El código de la mascota debe ser un número.";
}

if (!empty($errores)) {
    echo json_encode(['exito' => false, 'mensaje' => 'Errores en los datos ingresados.', 'errores' => $errores]);
    exit;
}

/* ----------- INICIAR TRANSACCIÓN ---------- */
$conex->begin_transaction();

try {
    /* ----------- VALIDAR EXISTENCIA DE LA MASCOTA ---------- */
    $sql_check_mascota = "SELECT COUNT(*) AS count FROM Mascotas WHERE Cod_Mascotas = ?";
    $stmt_check = $conex->prepare($sql_check_mascota);
    $stmt_check->bind_param("i", $Cod_Mascotas);
    $stmt_check->execute();
    $result_check = $stmt_check->get_result();
    $row = $result_check->fetch_assoc();

    if ($row['count'] == 0) {
        throw new Exception("El código de mascota proporcionado no existe en la base de datos.");
    }

    /* ----------- INSERTAR EN LA TABLA HISTORIAL ---------- */
    $sql_historial = "INSERT INTO Historial (Mascota_Cliente, Diagnostico, Tratamiento, Especialidades, Pronostico_Final, Cod_Mascotas) 
                      VALUES (?, ?, ?, ?, ?, ?)";
    
    $stmt_historial = $conex->prepare($sql_historial);
    $stmt_historial->bind_param("sssssi", $Mascota_Cliente, $Diagnostico, $Tratamiento, $Especialidades, $Pronostico_Final, $Cod_Mascotas);

    if (!$stmt_historial->execute()) {
        throw new Exception("Error al registrar el historial: " . $stmt_historial->error);
    }

    /* ----------- PREPARAR DATOS PARA MOSTRAR ---------- */
    $nuevoHistorial = [
        'Mascota_Cliente' => $Mascota_Cliente,
        'Diagnostico' => $Diagnostico,
        'Tratamiento' => $Tratamiento,
        'Especialidades' => $Especialidades,
        'Pronostico_Final' => $Pronostico_Final,
        'Cod_Mascotas' => $Cod_Mascotas
    ];

    /* ----------- CONFIRMAR LA TRANSACCIÓN ---------- */
    $conex->commit();

    // Preparar los datos a pasar en la URL
    $historialData = urlencode(json_encode($nuevoHistorial));

    // Redirigir con los datos en la URL, como en el ejemplo
    header("Location: ../Formularios_HTML/FORM_Historial.html?exito=1&nuevo_historial=" . urlencode(json_encode($nuevoHistorial)));
    echo json_encode(['exito' => true, 'mensaje' => '✅ Historial registrado exitosamente ✅ \n\n🐾 Cuidando con amor a tus mascotas, sanando con pasión 🏥']);
} catch (Exception $e) {
    /* ----------- REVERSIÓN DE LA TRANSACCIÓN EN CASO DE ERROR ---------- */
    $conex->rollback();
    echo json_encode(['exito' => false, 'mensaje' => $e->getMessage()]);
}

/* ----------- CERRAR LA CONEXIÓN ---------- */
$stmt_check->close();
$stmt_historial->close();
$conex->close();
?>
