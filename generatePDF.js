const { jsPDF } = window.jspdf;

let teamProfissions = {
	"Soldador": 0,
	"Caldeireiro": 0,
	"Pintor": 0,
	"Ajudante": 0,
	"Supervisor": 0,
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
const initialYPage = 48;
const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

let finalY = 0;

// Código para adicionar loading no botão
const btn = document.getElementById("buttonSend");
const text = document.getElementById("btnText");
const spinner = document.getElementById("btnSpinner");
function toggleLoading(isLoading) {
	text.textContent = isLoading ? "Carregando..." : "Concluído!";
	spinner.classList.toggle("d-none", !isLoading);
	btn.disabled = isLoading;
}

function updateLogisticaOrPessoal(event, type) {
	event.preventDefault();
	const elementId = type === "logisticaPessoal" ? "teveLogisticaPessoal" : "teveLogisticaMaterial";
	document.getElementById(elementId).textContent = event.srcElement.checked ? "SIM" : "NÃO";
}

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

async function fileSelectedHandler(event, afterOrBefore) {
	let file = event.target.files[0];
	const imageType = /image.*/;

	if (!file.type.match(imageType)) {
		const area = afterOrBefore === "before" ? fileDisplayAreaBefore : fileDisplayAreaAfter;
		area.innerHTML = "Só aceita imagens";
		return;
	}

	try {
		const dataURL = await readFileAsDataURL(file);
		const img = await loadImage(dataURL);
		img.style = "width:100%; margin-top: 15px; max-height: 22rem;";

		if (afterOrBefore === "before") {
			imgsBefore.push({ src: dataURL, width: img.naturalWidth, height: img.naturalHeight });
			fileDisplayAreaBefore.appendChild(img);
		} else {
			imgsAfter.push({ src: dataURL, width: img.naturalWidth, height: img.naturalHeight });
			fileDisplayAreaAfter.appendChild(img);
		}
	} catch (error) {
		console.error("Erro ao carregar imagem:", error);
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

async function addNewPage(numeroRelatorio) {
	doc.addPage();
	addReportNumber(numeroRelatorio); // Número relatorio no topo
	doc.setFont(undefined, "bold");
	doc.setFontSize(13);
	doc.text("SERVIÇO DE CALDEIRARIA", 70, 23);
	doc.setFontSize(9);
	doc.text("CNPJ: 34.050.439/0001-40", 70, 30);
	doc.text("RUA ITACOLOMI 247-MACAÉ-RJ", 70, 37);

	const logo = await loadImage("./assets/logo.jpg");
	doc.addImage(logo, "JPEG", 10, 13, 45, 25);

	const iso = await loadImage("./assets/iso9001.jpg");
	doc.addImage(iso, "JPEG", 160, 18, 24, 22);

	doc.rect(13, 44, 180, 0.1, "F"); // Line

	addFooter(doc);
	finalY = initialYPage;
}

function readFileAsDataURL(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result);
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
}

function loadImage(src) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = reject;
		img.src = src;
	});
}

function addReportNumber(numeroRelatorio) {
	console.log(numeroRelatorio)

	doc.setFontSize(9);
	doc.setFont(undefined, "normal");
	doc.text(`N° ${numeroRelatorio}`, 180, 8); // Adiciona numero no relatorio
}

async function gerarPdf() {
	//Resetar estado
	doc = new jsPDF();
	finalY = 0;
	let numeroRelatorio = 0;
	let ultimoRelatorio;

	try {
		toggleLoading(true);
		const response = await fetch("get_ultimo_relatorio.php");
		ultimoRelatorio = await response.json();
		if (ultimoRelatorio) {
			numeroRelatorio = +ultimoRelatorio.id + 1;
		}
	} catch (error) {
		console.error(error);
	}

	const logisticaPessoal = document.getElementById("logisticaPessoal").checked;
	const logisticaMaterial = document.getElementById("logisticaMaterial").checked;
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

	// Adiciona Cabeçalho
	addReportNumber(numeroRelatorio); // Número relatorio no topo

	doc.setFont(undefined, "bold");
	doc.setFontSize(13);
	doc.text("SERVIÇO DE CALDEIRARIA", 70, 23);
	doc.setFontSize(9);
	doc.text("CNPJ: 34.050.439/0001-40", 70, 30);
	doc.text("RUA ITACOLOMI 247-MACAÉ-RJ", 70, 37);

	const logo = await loadImage("./assets/logo.jpg");
	doc.addImage(logo, "JPEG", 10, 13, 45, 25);

	const iso = await loadImage("./assets/iso9001.jpg");
	doc.addImage(iso, "JPEG", 160, 18, 24, 22);

	// Adiciona Rodapé
	addFooter(doc);

	doc.rect(13, 44, 180, 0.1, "F"); // Divider

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
	doc.text("Hora Término:", 130, 101);
	doc.text("Logística de material:", 14, 108);
	doc.text("Logística de pessoal:", 130, 108);
	doc.text("Material utilizado:", 14, 115);
	doc.setFont(undefined, "normal");
	doc.text("Del Offshore", 58, 52);
	doc.text("contato@deloffshore.com", 27, 59);
	doc.text("(22)998469474 / (22)998884700", 135, 59);
	doc.text(nomeCliente, 30, 66);
	doc.text(nomeEmbarcacao, 57, 73);
	doc.text(emailResponsavelEmbarcacao, 86, 80);
	doc.text(localDoServico, 27, 87);
	doc.text(dataInicioFormatoCorreto, 36, 94);
	doc.text(dataTerminoFormatoCorreto, 156, 94);
	doc.text(horaInicio, 36, 101);
	doc.text(horaTermino, 157, 101);
	doc.text(logisticaMaterial === true ? "Sim" : "Não", 55, 108);
	doc.text(logisticaPessoal === true ? "Sim" : "Não", 171, 108);

	doc.text(material, 14, 120, {
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
	finalY = 118 + materialHeight;

	//---------------------------------------------------------------------------------------
	doc.setFont(undefined, "bold");
	doc.text("Ordem do serviço:", 14, finalY + 5);
	doc.text("Equipe:", 14, finalY + 12);

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

	doc.setFont(undefined, "bold");
	doc.text("Descrição do serviço:", 14, finalY + 5);

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
	finalY = finalY + 15 + descriptionHeight;


	// Adição das imagens
	// if height > width  -> retrato
	// if width > height -> paisagem
	const gap = 5;

	function addImage(src, positionY, width, height) {
		doc.addImage(
			src,
			"JPEG",
			14,
			positionY,
			width,
			height
		);

		finalY = height + gap + finalY;
	}

	if (imgsBefore.length > 0) {
		for (let index = 0; index < imgsBefore.length; index++) {
			const item = imgsBefore[index];
			const itemWidth = item.width > item.height ? 140 : 80;
			const itemHeight = item.height > item.width ? 100 : 60;
			const isFit = (itemHeight + gap + finalY) < finalLimitY;

			// Se não couber, adiciona nova página
			if (!isFit) {
				await addNewPage(numeroRelatorio);
			}

			// Se for a primeira imagem, adiciona a legenda
			if (index === 0) {
				doc.setFontSize(11);
				doc.setFont(undefined, "bold");
				doc.text(`Fotos${imgsAfter.length > 0 ? ' de antes' : ''}:`, 14, finalY);
			}

			addImage(item.src, finalY + gap, itemWidth, itemHeight);
		}
	}

	if (imgsAfter.length > 0) {
		for (let index = 0; index < imgsAfter.length; index++) {
			const item = imgsAfter[index];
			const itemWidth = item.width > item.height ? 140 : 80;
			const itemHeight = item.height > item.width ? 100 : 60;
			const isFit = (itemHeight + gap + finalY) < finalLimitY;

			// Se não couber, adiciona nova página
			if (!isFit) {
				await addNewPage(numeroRelatorio);
			}

			// Se for a primeira imagem, adiciona a legenda
			if (index === 0) {
				finalY += 4; // Adiciona gap
				doc.setFontSize(11);
				doc.setFont(undefined, "bold");
				doc.text('Fotos de depois', 14, finalY);
			}

			addImage(item.src, finalY + gap, itemWidth, itemHeight);
		}
	}

	// Página final
	await addNewPage(numeroRelatorio);

	doc.setFont(undefined, "bold");
	doc.setFontSize(11);
	doc.text("Observação:", 14, finalY + 5);
	doc.setFont(undefined, "normal");
	doc.text(observacao, 14, finalY + 10, {
		align: "left",
		maxWidth: 180,
		lineHeightFactor: 1.3,
	});
	const observationHeight = doc.getTextDimensions(observacao, {
		align: "left",
		maxWidth: 180,
		lineHeightFactor: 1.3,
		fontSize: 12,
	}).h;

	finalY = finalY + 5 + observationHeight;

	doc.setFontSize(11);
	doc.setFont(undefined, "bold");
	doc.text("Assinatura do responsável da embarcação:", 14, finalY + 15);
	doc.text("Assinatura do responsável da equipe: ", 14, finalY + 30);
	doc.text("Assinatura da prestadora de serviço: ", 14, finalY + 45);
	doc.text(nomeResponsavelEmbarcacao ?? "", 85, finalY + 30);

	try {
		if (ultimoRelatorio) {
			let pdfArrayBuffer = doc.output('blob');
			let pdfBlob = new Blob([pdfArrayBuffer], { type: "application/pdf" });

			const formData = new FormData();
			formData.append("pdf", pdfBlob);
			formData.append("ultimoRelatorio", numeroRelatorio);

			const savePdf = await fetch("save_pdf.php", {
				method: "POST",
				body: formData
			})

			const savePdfJson = await savePdf.json();
			doc.save(savePdfJson.nomeArquivo);
			setTimeout(() => location.reload(), 1000);
		}
	} catch (error) {
		console.error("Error:", error)
	}
}