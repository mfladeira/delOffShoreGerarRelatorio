<?php
    require_once 'includes/database.php';
?>

<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
    <title>Gerenciar Relatorios</title>
    <script>
        let usuario = localStorage.getItem('usuario');

        if (!usuario) {
            window.location.href = 'login.php';
        }
    </script>
</head>

<body>
    <div class="container" style="max-width: 700px; padding-top: 30px;">
        <a href="relatorio.php">
            <img src="./assets/arrow-return-left.svg" alt="Ícone Seta para Esquerda" style="width: 30px; cursor: pointer">
        </a>
        <div class="row">
            <div class="col justify-content-center align-items-center d-flex flex-column">
                <div style="width: 100%;">
                    <h3 class="mt-3">Lista de Relatórios</h3>
                    <ul id="listaArquivos" class="list-group list-group-flush">
                        <?php
                          $diretorio = "uploads/";
                          $arquivos = [];

                          if (is_dir($diretorio)) {
                              $itens = scandir($diretorio);
                              foreach ($itens as $item) {
                                  if ($item !== '.' && $item !== '..' && is_file($diretorio . $item)) {
                                      echo "<li class='list-group-item'>
                                        <a href='uploads/$item' download='$item'>$item</a>
                                      </li>";
                                  }
                              }
                          }
                        ?>
                    </ul>
                </div>
            </div>
        </div>
    </div>

    <script>

    </script>
</body>

</html>