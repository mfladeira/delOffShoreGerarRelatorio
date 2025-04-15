<?php
require_once 'includes/database.php';

$sql = "SELECT * FROM arquivos_pdf ORDER BY id DESC LIMIT 1";
$result = mysqli_query($conn, $sql);

if (mysqli_num_rows($result) > 0) {
  $row = mysqli_fetch_assoc($result);
  echo json_encode($row);
} else {
  echo json_encode(['id' => 0]);
}
