<?php
require_once 'includes/authenticate.php';
require_once 'includes/database.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $id = $_POST["id"];

    if (!empty($id)) {
        $stmt = $conn->prepare("DELETE FROM colaboradores WHERE id = ?");
        $stmt->bind_param("i", $id);
        if ($stmt->execute()) {
            echo "Colaborador deletado com sucesso!";
        } else {
            echo "Erro ao deletar colaborador.";
        }
        $stmt->close();
    }
}

mysqli_close($conn);
