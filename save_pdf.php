<?php
require_once 'includes/database.php';

if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_FILES["pdf"]) && isset($_FILES["pdf"]["tmp_name"])) {
    $uploadDir = "uploads/";
    $pdfData = file_get_contents($_FILES["pdf"]["tmp_name"]);

    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    $ultimoRelatorio = pegaUltimoRelatorio($conn);
    $novoId = $ultimoRelatorio['id'] + 1;
    $nomeArquivo = "Relatorio{$novoId}";
    $caminhoArquivo = $uploadDir . "Relatorio{$novoId}.pdf";

    if (file_put_contents($caminhoArquivo, $pdfData)) {
        $msg = salvarRelatorioBanco($conn, $nomeArquivo, $caminhoArquivo);
    } else {
        $msg = "Erro ao salvar relatório.";
    }

    echo json_encode([
        'success' => true,
        'mensagem' => $msg,
        'nomeArquivo' => $nomeArquivo
    ]);
} else {
    print_r($_FILES);
}

function salvarRelatorioBanco($conn, $nomeArquivo, $caminhoArquivo)
{
    $stmt = $conn->prepare("INSERT INTO arquivos_pdf (nome, caminho) VALUES (?, ?)");
    $stmt->bind_param("ss", $nomeArquivo, $caminhoArquivo);
    $mensagem = $stmt->execute()
        ? "Pdf foi salvo com sucesso."
        : "Erro ao salvar relatório.";
    $stmt->close();
    return $mensagem;
}

function pegaUltimoRelatorio($conn)
{
    $sql = "SELECT * FROM arquivos_pdf ORDER BY id DESC LIMIT 1";
    $result = mysqli_query($conn, $sql);

    if (mysqli_num_rows($result) > 0) {
        $row = mysqli_fetch_assoc($result);
        return $row;
    } else {
        return [
            'id' => 0
        ];
    }
}
