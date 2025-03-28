<?php
require_once 'includes/database.php';

// Captura os dados do formulário
$usuario = $_POST['usuario'];
$senha = $_POST['senha'];

// Consulta ao banco de dados
$sql = "SELECT * FROM usuarios WHERE usuario = '$usuario' AND senha = '$senha'";
$result = mysqli_query($conn, $sql);

// Verifica se encontrou um usuário
if (mysqli_num_rows($result) > 0) {
  $row = mysqli_fetch_assoc($result);

  echo "
    <script>
      localStorage.setItem('usuario', '$usuario');
      localStorage.setItem('classe', '{$row['classe']}');
      window.location.href = 'relatorio.php';
    </script>
  ";
} else {
  echo "<script>alert('Usuário ou senha incorretos!'); window.location.href='login.php';</script>";
}

mysqli_close($conn);
