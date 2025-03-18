<?php
require_once 'includes/authenticate.php';
require_once 'includes/database.php';
?>

<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
    <title>Gerenciar Colaboradores</title>
</head>

<body>
    <div class="container" style="max-width: 700px; padding-top: 30px;">
        <a href="relatorio2.php">
            <img src="./assets/arrow-return-left.svg" alt="Ícone Seta para Esquerda" style="width: 30px; cursor: pointer">
        </a>
        <div class="row">
            <div class="col justify-content-center align-items-center d-flex flex-column">
                <h2 class="text-center p-3">Adicionar Colaborador</h2>
                <input type="text" id="colaborador" placeholder="Nome do colaborador" class="form-control">
                <button onclick="adicionarColaborador()" class="btn btn-success mt-3">Adicionar</button>
                <hr style="width: 100%;">
                <div style="width: 100%;">
                    <h3 class="mt-3">Lista de Colaboradores</h3>
                    <ul id="listaColaboradores" class="list-group list-group-flush">
                        <?php
                        $sql = "SELECT id, nome FROM colaboradores";
                        $result = mysqli_query($conn, $sql);

                        // Verificando se há resultados
                        if (mysqli_num_rows($result) > 0) {
                            // Iterando sobre os resultados e criando itens na lista
                            while ($row = mysqli_fetch_assoc($result)) {
                                echo "<li class='list-group-item'>
                                    <div style='display: flex; justify-content: space-between'>
                                        <span>$row[nome]</span>
                                        <a onclick='removerColaborador($row[id])'>
                                            <img src='./assets/trash.svg' alt='Ícone de lixeira' style='width: 22px; cursor: pointer; color: red'>
                                        </a>
                                    </div>
                                </li>";
                            }
                        }
                        ?>
                    </ul>
                </div>
            </div>
        </div>
    </div>

    <script>
        function adicionarColaborador() {
            let nome = document.getElementById("colaborador").value;
            if (nome.trim() === "") return;

            let formData = new FormData();
            formData.append("nome", nome);

            fetch("adiciona_colaborador.php", {
                    method: "POST",
                    body: formData
                })
                .then(response => response.text())
                .then(data => {
                    alert(data);
                    location.reload();
                })
                .catch(error => console.error("Erro:", error));
        }

        function removerColaborador(colaboradorId) {
            let formData = new FormData();
            formData.append("id", colaboradorId);

            fetch("remove_colaborador.php", {
                    method: "POST",
                    body: formData
                })
                .then(response => response.text())
                .then(data => {
                    alert(data);
                    location.reload();
                })
                .catch(error => console.error("Erro:", error));
        }

    </script>
</body>

</html>