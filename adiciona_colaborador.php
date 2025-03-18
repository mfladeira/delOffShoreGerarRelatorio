<?php
require_once 'includes/authenticate.php';
require_once 'includes/database.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nome = trim($_POST["nome"]);
    if (!empty($nome)) {
        $stmt = $conn->prepare("INSERT INTO colaboradores (nome) VALUES (?)");
        $stmt->bind_param("s", $nome);
        if ($stmt->execute()) {
            echo "Colaborador adicionado com sucesso!";
        } else {
            echo "Erro ao adicionar colaborador.";
        }
        $stmt->close();
    }
}

mysqli_close($conn);
