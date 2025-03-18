<?php
// $servername = "localhost";
// $username = "deloffsh_colaborades";
// $password = "Nescaubola@1";
// $dbname = "deloffsh_colaboradores";
$servername = "127.0.0.1";
$username = "root";
$password = "246813579";
$dbname = "deloffsh_colaboradores";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
  die("Falha na conexão: " . $conn->connect_error);
}
