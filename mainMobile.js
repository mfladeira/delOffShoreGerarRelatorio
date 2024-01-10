const { jsPDF } = window.jspdf;

let teamProfissions = {
	Soldador: 0,
	Caldeireiro: 0,
	Pintor: 0,
	Ajudante: 0,
	Supervisor: 0,
	"Montador De Andaime": 0,
	"Soldador Irata": 0,
	"Ajudante Irata": 0,
	"Caldeireiro Irata": 0,
};

let teamNames = [];
let imgsBefore = [];
let imgsAfter = [];

let doc = new jsPDF();

const finalLimitY = 265;
const initialYPage = 52;
const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
let finalY = 0;

function updateTeamProfissions(e, typeOfProfission, numberToAdd) {
	e.preventDefault();
	teamProfissions[typeOfProfission] = teamProfissions[typeOfProfission] + numberToAdd;
	document.getElementById(typeOfProfission).innerHTML = teamProfissions[typeOfProfission];
}

function updateTeamNames(e) {
	e.preventDefault();
	teamNames.push(e.target.value);
	const ulTeam = document.getElementById("teamNamesList");
	const li = document.createElement("li");
	li.textContent = e.target.value;
	ulTeam.appendChild(li);
}

function fileSelectedHandler(event, afterOrBefore) {
	let file = event.target.files[0];
	const imageType = /image.*/;

	if (file.type.match(imageType)) {
		var reader = new FileReader();

		reader.onload = function (e) {
			var img = new Image();
			img.src = reader.result;
			img.style = "width:100%; margin-top: 15px; max-height: 22rem;";
			if (afterOrBefore === "before") {
				imgsBefore.push(reader.result);
				fileDisplayAreaBefore.appendChild(img);
			} else if (afterOrBefore === "after") {
				imgsAfter.push(reader.result);
				fileDisplayAreaAfter.appendChild(img);
			}
		};

		reader.readAsDataURL(file);
	} else {
		if (afterOrBefore === "before") {
			fileDisplayAreaBefore.innerHTML = "Só aceita images";
		} else {
			fileDisplayAreaAfter.innerHTML = "Só aceita images";
		}
	}
}

function addFooter(doc) {
	doc.line(12, 275, 194, 275, "FD");
	doc.setFontSize(9);
	doc.text(
		"Rua Itacolomi, n° 247 - Cabiúnas - Macaé - RJ - Cep 279350-00 Telefones: (22) 998469474",
		pageWidth / 2,
		280,
		{ align: "center" }
	);
	doc.text("(22) 30513548 / (22) 998884700 Site. www.deloffshore.com", pageWidth / 2, 285, { align: "center" });
}

function printSome() {
	const nomeCliente = document.getElementById("nomeCliente").value;
	const nomeEmbarcacao = document.getElementById("nomeEmbarcacao").value;
	const emailResponsavelEmbarcacao = document.getElementById("emailResponsavelEmbarcacao").value;
	const localDoServico = document.getElementById("localDoServico").value;
	const dataInicio = new Date(document.getElementById("dataInicio").value);
	const dataInicioFormatoCorreto = new Date(
		dataInicio.getTime() + dataInicio.getTimezoneOffset() * 60000
	).toLocaleDateString("pt-br");
	const dataTermino = new Date(document.getElementById("dataTermino").value);
	const dataTerminoFormatoCorreto = new Date(
		dataTermino.getTime() + dataTermino.getTimezoneOffset() * 60000
	).toLocaleDateString("pt-br");
	const horaInicio = document.getElementById("horaInicio").value;
	const horaTermino = document.getElementById("horaTermino").value;
	const material = document.getElementById("material").value;
	const ordemDoServico = document.getElementById("ordemDoServico").value;
	const description = document.getElementById("description").value;
	const nomeResponsavelEmbarcacao = document.getElementById("nomeResponsavelEmbarcacao").value;
	const observacao = document.getElementById("observacao").value;

	doc.setFont(undefined, "bold");
	doc.setFontSize(13);
	doc.text("SERVIÇO DE CALDEIRARIA", 70, 23);
	doc.setFontSize(9);
	doc.text("CNPJ: 34.050.439/0001-40", 70, 30);
	doc.text("RUA ITACOLOMI 247-MACAÉ-RJ", 70, 37);
	doc.addImage("./assets/logo.jpg", "JPEG", 10, 13, 45, 25);
	doc.addImage("./assets/iso9001.png", "JPEG", 160, 18, 24, 22);
	doc.rect(13, 44, 180, 0.1, "F"); // Line

	// Rodapé
	addFooter(doc);

	// FONT BOLD
	doc.setFont(undefined, "bold");
	doc.setFillColor(222, 226, 230);
	doc.setFontSize(11);
	doc.text("Prestadora do Serviço:", 14, 52);
	doc.text("Email:", 14, 59);
	doc.text("Telefones:", 115, 59);
	doc.text("Cliente:", 14, 66);
	doc.text("Nome da embarcação:", 14, 73);
	doc.text("Email do responsável da embarcação:", 14, 80);
	doc.text("Local:", 14, 87);
	doc.text("Data início:", 14, 94);
	doc.text("Data término:", 130, 94);
	doc.text("Hora início:", 14, 101);
	doc.text("Hora início:", 130, 101);
	doc.text("Material utilizado:", 14, 108);

	// FONT NORMAl
	doc.setFont(undefined, "normal");
	doc.text("Del Offshore", 58, 52); // prestadora serviço
	doc.text("contato@deloffshore.com", 27, 59); // email
	doc.text("(22)998469474 / (22)998884700", 135, 59); // telefone
	doc.text(nomeCliente, 30, 66);
	doc.text(nomeEmbarcacao, 57, 73);
	doc.text(emailResponsavelEmbarcacao, 86, 80);
	doc.text(localDoServico, 27, 87);
	doc.text(dataInicioFormatoCorreto, 36, 94);
	doc.text(dataTerminoFormatoCorreto, 156, 94);
	doc.text(horaInicio, 36, 101);
	doc.text(horaTermino, 152, 101);

	doc.text(material, 14, 113, {
		align: "left",
		maxWidth: 180,
		lineHeightFactor: 1.3,
	});

	const materialHeight = doc.getTextDimensions(material, {
		align: "left",
		maxWidth: 180,
		lineHeightFactor: 1.3,
		fontSize: 12,
	}).h;
	finalY = 113 + materialHeight;

	//---------------------------------------------------------------------------------------
	// FONT BOLD
	doc.setFont(undefined, "bold");
	doc.text("Ordem do serviço:", 14, finalY + 5);
	doc.text("Equipe:", 14, finalY + 12);

	// FONT NORMAl
	doc.setFont(undefined, "normal");
	doc.text(ordemDoServico, 49, finalY + 5);

	// Tranformando array de profissoes em string
	let teamProfissionsString = "";
	Object.entries(teamProfissions)
		.filter((value) => value[1] !== 0)
		.forEach((obj) => {
			teamProfissionsString += `${obj[0]}(${obj[1]}) `;
		});

	doc.text(teamProfissionsString, 14, finalY + 17, {
		align: "left",
		maxWidth: 180,
		lineHeightFactor: 1.3,
	});

	const teamProfissionsHeight = doc.getTextDimensions(teamProfissionsString, {
		align: "left",
		maxWidth: 180,
		lineHeightFactor: 1.3,
		fontSize: 12,
	}).h;
	finalY = finalY + 19 + teamProfissionsHeight;

	// Tranformando array de nomes em string
	let teamNamesString = "";
	teamNames.forEach((obj, i) => {
		if (teamNames.length - 1 === i) {
			teamNamesString += `${obj}`;
		} else {
			teamNamesString += `${obj}, `;
		}
	});

	doc.text(teamNamesString, 14, finalY, {
		align: "left",
		maxWidth: 180,
		lineHeightFactor: 1.3,
	});

	const teamNamesHeight = doc.getTextDimensions(teamNamesString, {
		align: "left",
		maxWidth: 180,
		lineHeightFactor: 1.3,
		fontSize: 12,
	}).h;
	finalY = finalY + teamNamesHeight;
	//---------------------------------------------------------------------------------------

	// FONT BOLD
	doc.setFont(undefined, "bold");
	doc.text("Descrição do serviço:", 14, finalY + 5);

	// FONT NORMAl
	doc.setFont(undefined, "normal");
	doc.text(description, 14, finalY + 10, {
		align: "left",
		maxWidth: 180,
		lineHeightFactor: 1.3,
	});
	const descriptionHeight = doc.getTextDimensions(description, {
		align: "left",
		maxWidth: 180,
		lineHeightFactor: 1.3,
		fontSize: 12,
	}).h;
	finalY = finalY + 10 + descriptionHeight;

	if (imgsBefore.length !== 0 && imgsAfter.length !== 0) {
		// FONT BOLD
		doc.setFont(undefined, "bold");
		doc.text("Fotos de antes:", 14, finalY + 5);
		imgsBefore.forEach((item, index) => {
			doc.addImage(item, "JPEG", 14 + index * 62, finalY + 10, 44 + 15, 45);
		});

		if (finalY + 10 + 2 * 50 >= finalLimitY) {
			doc.addPage();

			doc.setFont(undefined, "bold");
			doc.setFontSize(13);
			doc.text("SERVIÇO DE CALDEIRARIA", 70, 23);
			doc.setFontSize(9);
			doc.text("CNPJ: 34.050.439/0001-40", 70, 30);
			doc.text("RUA ITACOLOMI 247-MACAÉ-RJ", 70, 37);
			doc.addImage("./assets/logo.jpg", "JPEG", 10, 13, 45, 25);
			doc.addImage("./assets/iso9001.png", "JPEG", 160, 18, 24, 22);
			doc.rect(13, 44, 180, 0.1, "F"); // Line

			addFooter(doc);
			finalY = initialYPage;
		} else {
			finalY = finalY + 10 + 55;
		}

		doc.setFont(undefined, "bold");
		doc.setFontSize(11);
		doc.text("Fotos de depois:", 14, finalY);
		imgsAfter.forEach((item, index) => {
			doc.addImage(item, "JPEG", 14 + index * 62, finalY + 5, 44 + 15, 45);
		});
		finalY = finalY + 55;
	}

	doc.setFont(undefined, "bold");
	doc.text("Observação:", 14, finalY + 5);
	doc.text("Assinatura do responsável da embarcação:", 14, finalY + 15);
	doc.text("Assinatura do responsável da equipe: ", 14, finalY + 30);
	doc.text("Assinatura da prestadora de serviço: ", 14, finalY + 45);

	doc.setFont(undefined, "normal");
	doc.text(observacao, 38, finalY + 5);
	doc.text(nomeResponsavelEmbarcacao ?? "", 85, finalY + 30);

	doc.save("a4.pdf");

	location.reload();
}