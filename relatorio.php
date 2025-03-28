<?php
    require_once 'includes/database.php';
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DelOffshore Caldeiraria</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script src="./generatePDF.js"></script>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
    <style>
        @import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap");

        body {
            font-family: "Roboto", sans-serif !important;
        }

        .logo {
            width: 50%;
        }
    </style>
    <script>
        let usuario = localStorage.getItem('usuario');

        if (!usuario) {
            window.location.href = 'login.php';
        }
    </script>
    <script>
        document.addEventListener('DOMContentLoaded', function () {
            let usuarioClasse = localStorage.getItem('classe');

            if (usuarioClasse === 'administrador' && usuario === 'deloffshore') {
                let navItem = document.createElement('li');
                navItem.classList.add('nav-item');

                let navLink = document.createElement('a');
                navLink.classList.add('nav-link');
                navLink.href = 'adicionar_remover_colaborador.php';
                navLink.textContent = 'Adicionar/Remover colaboradores';

                navItem.appendChild(navLink);

                // Adiciona o item ao menu
                document.getElementById('navbar-links').appendChild(navItem);
            }
        });
    </script>
</head>

<body>
    <nav class="navbar navbar-light bg-light">
        <div class="container">
            <ul class="navbar-nav" id="navbar-links" style="width: 100%">
                <li onclick="localStorage.clear();window.location.href = 'login.php';" style="text-align: end">Sair</li>
            </ul>
        </div>
    </nav>
    <main class="bg-light">
        <div class="container" style="max-width: 700px; padding-top: 30px;">
            <div class="row">
                <div class="col justify-content-center align-items-center d-flex flex-column">
                    <img src="./assets/delLogo.png" alt="logo" class="logo">
                    <h1 class="text-center p-3">Gerar PDF de serviço de caldeiraria</h1>
                </div>
            </div>

            <hr>
            <form action="post" id="forms">
                <div class="row">
                    <div class="col">
                        <label for="nomeCliente" class="form-label fw-bold">Nome do cliente</label>
                        <input type="text" class="form-control" id="nomeCliente" name="nomeCliente">
                    </div>
                </div>

                <div class="row mt-4">
                    <div class="col">
                        <label for="nomeEmbarcacao" class="form-label fw-bold">Nome da embarcação</label>
                        <input type="text" class="form-control" id="nomeEmbarcacao" name="nomeEmbarcacao">
                    </div>
                </div>

                <div class="row mt-4">
                    <div class="col">
                        <label for="emailResponsavelEmbarcacao" class="form-label fw-bold">Email do responsável da
                            embarcação</label>
                        <input type="text" class="form-control" id="emailResponsavelEmbarcacao"
                            name="emailResponsavelEmbarcacao">
                    </div>
                </div>

                <div class="row mt-4">
                    <div class="col">
                        <label for="localDoServico" class="form-label fw-bold">Escolha o local do serviço</label>
                        <select class="form-select" id="localDoServico">
                            <option value="Baía de Guanabara" selected>Baía de Guanabara</option>
                            <option value="Porto do Açu">Porto do Açu</option>
                            <option value="Macaé">Macaé</option>
                        </select>
                    </div>
                </div>

                <div class="row mt-4">
                    <div class="col">
                        <label for="dataInicio" class="form-label fw-bold">Data início do serviço:</label>
                        <br>
                        <input class="p-1" type="date" id="dataInicio" name="dataInicio">
                    </div>
                </div>

                <div class="row mt-4">
                    <div class="col">
                        <label for="dataTermino" class="form-label fw-bold">Data término do serviço:</label>
                        <br>
                        <input class="p-1" type="date" id="dataTermino" name="dataTermino">
                    </div>
                </div>

                <div class="row mt-4">
                    <div class="col">
                        <label for="horaInicio" class="form-label fw-bold">Hora do início do serviço:</label>
                        <br>
                        <input class="p-1" type="time" id="horaInicio" name="horaInicio">
                    </div>
                </div>

                <div class="row mt-4">
                    <div class="col">
                        <label for="horaTermino" class="form-label fw-bold">Hora do término do serviço:</label>
                        <br>
                        <input class="p-1" type="time" id="horaTermino" name="horaTermino">
                    </div>
                </div>

                <div class="row mt-4">
                    <div class="col">
                        <label for="material" class="form-label fw-bold">Material utilizado</label>
                        <textarea rows="4" class="form-control" id="material" name="material"></textarea>
                    </div>
                </div>

                <div class="row mt-4">
                    <div class="col form-check form-switch" style="padding-left: 3.5rem;">
                        <input class="form-check-input" type="checkbox" id="logisticaMaterial"
                            onchange="updateLogisticaOrPessoal(event, 'logisticaMaterial')">
                        <label for="logisticaMaterial" class="form-label me-2 fw-bold">Teve logística de
                            material?</label>
                        <span style="color: red; font-weight: bold;" id="teveLogisticaMaterial">NÃO</span>
                    </div>
                </div>

                <div class="row mt-4">
                    <div class="col form-check form-switch" style="padding-left: 3.5rem;">
                        <input class="form-check-input" type="checkbox" id="logisticaPessoal"
                            onchange="updateLogisticaOrPessoal(event,'logisticaPessoal')">
                        <label for="logisticaPessoal" class="me-2 form-label fw-bold">Teve logística de pessoal?</label>
                        <span style="color: red; font-weight: bold;" id="teveLogisticaPessoal">NÃO</span>
                    </div>
                </div>

                <div class="row mt-4">
                    <div class="col">
                        <label for="ordemDoServico" class="form-label fw-bold">Ordem do serviço</label>
                        <input type="text" class="form-control" id="ordemDoServico" name="ordemDoServico">
                    </div>
                </div>

                <div class="row mt-4">
                    <div class="col-3 d-flex justify-content-center">
                        <button type="button" class="btn btn-danger"
                            onclick="updateTeamProfissions(event, 'Soldador', -1)"><strong>-</strong></button>
                    </div>
                    <div class="col-6 align-items-center d-flex justify-content-center">
                        <p class="m-0 me-2">Soldador: </p><br><span id="Soldador">0</span>
                    </div>
                    <div class="col-3 d-flex justify-content-center">
                        <button class="btn btn-success"
                            onclick="updateTeamProfissions(event, 'Soldador', 1)"><strong>+</strong></button>
                    </div>
                </div>

                <hr>

                <div class="row mt-4">
                    <div class="col-3 d-flex justify-content-center">
                        <button type="button" class="btn btn-danger"
                            onclick="updateTeamProfissions(event, 'Caldeireiro', -1)"><strong>-</strong></button>
                    </div>
                    <div class="col-6 align-items-center d-flex justify-content-center">
                        <p class="m-0 me-2">Caldeireiro: </p><br><span id="Caldeireiro">0</span>
                    </div>
                    <div class="col-3 d-flex justify-content-center">
                        <button class="btn btn-success"
                            onclick="updateTeamProfissions(event, 'Caldeireiro', 1)"><strong>+</strong></button>
                    </div>
                </div>

                <hr>

                <div class="row mt-4">
                    <div class="col-3 d-flex justify-content-center">
                        <button type="button" class="btn btn-danger"
                            onclick="updateTeamProfissions(event, 'Pintor', -1)"><strong>-</strong></button>
                    </div>
                    <div class="col-6 align-items-center d-flex justify-content-center">
                        <p class="m-0 me-2">Pintor: </p><br><span id="Pintor">0</span>
                    </div>
                    <div class="col-3 d-flex justify-content-center">
                        <button class="btn btn-success"
                            onclick="updateTeamProfissions(event, 'Pintor', 1)"><strong>+</strong></button>
                    </div>
                </div>

                <hr>

                <div class="row mt-4">
                    <div class="col-3 d-flex justify-content-center">
                        <button type="button" class="btn btn-danger"
                            onclick="updateTeamProfissions(event, 'Ajudante', -1)"><strong>-</strong></button>
                    </div>
                    <div class="col-6 align-items-center d-flex justify-content-center">
                        <p class="m-0 me-2">Ajudante: </p><br><span id="Ajudante">0</span>
                    </div>
                    <div class="col-3 d-flex justify-content-center">
                        <button class="btn btn-success"
                            onclick="updateTeamProfissions(event, 'Ajudante', 1)"><strong>+</strong></button>
                    </div>
                </div>

                <hr>

                <div class="row mt-4">
                    <div class="col-3 d-flex justify-content-center">
                        <button type="button" class="btn btn-danger"
                            onclick="updateTeamProfissions(event, 'Supervisor', -1)"><strong>-</strong></button>
                    </div>
                    <div class="col-6 align-items-center d-flex justify-content-center">
                        <p class="m-0 me-2">Supervisor: </p><br><span id="Supervisor">0</span>
                    </div>
                    <div class="col-3 d-flex justify-content-center">
                        <button class="btn btn-success"
                            onclick="updateTeamProfissions(event, 'Supervisor', 1)"><strong>+</strong></button>
                    </div>
                </div>


                <hr>

                <div class="row mt-4">
                    <div class="col-3 d-flex justify-content-center">
                        <button type="button" class="btn btn-danger"
                            onclick="updateTeamProfissions(event, 'Montador De Andaime', -1)"><strong>-</strong></button>
                    </div>
                    <div class="col-6 align-items-center d-flex justify-content-center">
                        <p class="m-0 me-2">Montador De Andaime: </p><br><span id="Montador De Andaime">0</span>
                    </div>
                    <div class="col-3 d-flex justify-content-center">
                        <button class="btn btn-success"
                            onclick="updateTeamProfissions(event, 'Montador De Andaime', 1)"><strong>+</strong></button>
                    </div>
                </div>

                <hr>

                <div class="row mt-4">
                    <div class="col-3 d-flex justify-content-center">
                        <button type="button" class="btn btn-danger"
                            onclick="updateTeamProfissions(event, 'Soldador Irata', -1)"><strong>-</strong></button>
                    </div>
                    <div class="col-6 align-items-center d-flex justify-content-center">
                        <p class="m-0 me-2">Soldador Irata: </p><br><span id="Soldador Irata">0</span>
                    </div>
                    <div class="col-3 d-flex justify-content-center">
                        <button class="btn btn-success"
                            onclick="updateTeamProfissions(event, 'Soldador Irata', 1)"><strong>+</strong></button>
                    </div>
                </div>

                <hr>

                <div class="row mt-4">
                    <div class="col-3 d-flex justify-content-center">
                        <button type="button" class="btn btn-danger"
                            onclick="updateTeamProfissions(event, 'Ajudante Irata', -1)"><strong>-</strong></button>
                    </div>
                    <div class="col-6 align-items-center d-flex justify-content-center">
                        <p class="m-0 me-2">Ajudante Irata: </p><br><span id="Ajudante Irata">0</span>
                    </div>
                    <div class="col-3 d-flex justify-content-center">
                        <button class="btn btn-success"
                            onclick="updateTeamProfissions(event, 'Ajudante Irata', 1)"><strong>+</strong></button>
                    </div>
                </div>

                <hr>

                <div class="row mt-4">
                    <div class="col-3 d-flex justify-content-center">
                        <button type="button" class="btn btn-danger"
                            onclick="updateTeamProfissions(event, 'Caldeireiro Irata', -1)"><strong>-</strong></button>
                    </div>
                    <div class="col-6 align-items-center d-flex justify-content-center">
                        <p class="m-0 me-2">Caldeireiro Irata: </p><br><span id="Caldeireiro Irata">0</span>
                    </div>
                    <div class="col-3 d-flex justify-content-center">
                        <button class="btn btn-success"
                            onclick="updateTeamProfissions(event, 'Caldeireiro Irata', 1)"><strong>+</strong></button>
                    </div>
                </div>

                <div class="row mt-4">
                    <div class="col">
                        <label for="teamNames" class="form-label fw-bold">Selecione os nomes da equipe</label>
                        <select class="form-select" id="teamNames" onchange="updateTeamNames(event)">
                            <option value="" disabled selected>Selecione um colaborador</option>
                            <?php
                            $sql = "SELECT id, nome FROM colaboradores";
                            $result = mysqli_query($conn, $sql);

                            // Verificando se há resultados
                            if (mysqli_num_rows($result) > 0) {
                                // Iterando sobre os resultados e criando itens na lista
                                while ($row = mysqli_fetch_assoc($result)) {
                                    echo "<option value='$row[nome]'>$row[nome]</option>";
                                }
                            }
                            ?>
                        </select>

                    </div>
                </div>

                <div class="row">
                    <div class="col mt-3">
                        <p><strong>Equipe selecionada:</strong></p>
                        <ul id="teamNamesList">
                        </ul>
                    </div>
                </div>

                <div class="row mt-4">
                    <div class="col">
                        <label for="description" class="form-label fw-bold">Descrição do serviço</label>
                        <textarea rows="4" class="form-control" id="description" name="description"></textarea>
                    </div>
                </div>


                <div class="row mt-4">
                    <div class="col">
                        <label for="nomeResponsavelEmbarcacao" class="form-label fw-bold">Nome do responsável da
                            embarcação (*assinatura)</label>
                        <input type="text" class="form-control" id="nomeResponsavelEmbarcacao"
                            name="nomeResponsavelEmbarcacao">
                    </div>
                </div>

                <div class="row mt-4">
                    <div class="col">
                        <label for="fileInput" class="form-label fw-bold">Selecione as fotos de antes</label>
                        <br>
                        <input class="w-100" ref='file' id="fileInput" type="file"
                            onchange="fileSelectedHandler(event, 'before')" />
                    </div>
                </div>

                <div class="row">
                    <div class="col">
                        <div id="fileDisplayAreaBefore"></div>
                    </div>
                </div>

                <hr>

                <div class="row mt-4">
                    <div class="col">
                        <label for="fileInput2" class="form-label fw-bold">Selecione as fotos de depois</label>
                        <br>
                        <input class="w-100" ref='file' id="fileInput2" type="file"
                            onchange="fileSelectedHandler(event, 'after')" />
                    </div>
                </div>

                <div class="row">
                    <div class="col">
                        <div id="fileDisplayAreaAfter"></div>
                    </div>
                </div>

                <div class="row mt-4">
                    <div class="col">
                        <label for="observacao" class="form-label fw-bold">Observação</label>
                        <input type="text" class="form-control" id="observacao" name="observacao">
                    </div>
                </div>

                <div class="row justify-content-center">
                    <div class="col-6 justify-content-center d-flex">
                        <button type="button" id="buttonSend" class="btn btn-primary mt-4 mb-4 p-2"
                            onclick="printSome()">Gerar PDF</button>
                    </div>
                </div>

            </form>
        </div>
    </main>
</body>

</html>