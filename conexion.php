<?php
$host = "localhost";
$usuario = "root";
$password = "";
$db = "sistema-zoofipetss";

// CREACIÓN DE LA CONEXIÓN A LA BASE DE DATOS
$conex = new mysqli($host, $usuario, $password, $db);

// VERIFICAR SI LA CONEXIÓN FUE EXITOSA
if ($conex->connect_error) {
    die("Error de Conexión: " . $conex->connect_error);
}
?>