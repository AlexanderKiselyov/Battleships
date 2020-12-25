var name = "Player"; // текущее имя игрока
var lang = "РУ"; // текущий язык игры
var allRecords = new Array(10); // список рекордов (максимум 10 лучших)
	for (var i = 0; i < 10; i++)
		allRecords[i] = [0, 0];

document.oncontextmenu = function () { return false }; // запрет показа контекстного меню


function rulesClick() {
	var modal = document.getElementById('rules');
	var rulesText = document.getElementById("rulesText");
	if (lang == "РУ")
		rulesText.src = "txt/rulesRU.html";
	else if (lang == "EN")
		rulesText.src = "txt/rulesEN.html";
	modal.style.display = "block";
}

function recordsClick() {
	var recordsList1 = document.getElementById('recordsListCol1');
	var recordsList2 = document.getElementById('recordsListCol2');
	var recordsList3 = document.getElementById('recordsListCol3');
	var clearRecTxt = document.getElementById('clearRecBut');
	var saveRecTxt = document.getElementById('saveRecBut');
	recordsList1.innerHTML = '';
	recordsList2.innerHTML = '';
	recordsList3.innerHTML = '';
	if (window.localStorage.getItem('records')) {
		var recordsBuf = window.localStorage.getItem('records').split(',');
		for (var i = 0; i < recordsBuf.length / 2; i++) {
			allRecords[i][0] = parseInt(recordsBuf[2 * i]);
			allRecords[i][1] = recordsBuf[2 * i + 1];
		}
	}
	if (allRecords[0][0] != 0) {
		if (lang == "РУ") {
			recordsList1.innerHTML += '<p><b>Ранг</b></p><br>';
			recordsList2.innerHTML += '<p>Очки</p><br>';
			recordsList3.innerHTML += '<p>Имя капитана</p><br>';
		} else if (lang == "EN") {
			recordsList1.innerHTML += '<p><b>Rank</b></p><br>';
			recordsList2.innerHTML += '<p>Points</p><br>';
			recordsList3.innerHTML += '<p>Captain name</p><br>';
		}
		for (var i = 0; i < allRecords.length; i++) {
			if (allRecords[i][0] != 0) {
				recordsList1.innerHTML += '<p>' + (i + 1) + '.</p>';
				recordsList2.innerHTML += '<p>' + allRecords[i][0] + '</p>';
				recordsList3.innerHTML += '<p>' + allRecords[i][1] + '</p>';
			}
			else
				break;
		}
	} else if (lang == "РУ") {
		saveRecTxt.innerHTML = 'СОХРАНИТЬ';
		clearRecTxt.innerHTML = 'ОЧИСТИТЬ';
		recordsList2.innerHTML = '<br/><br/><br/><br/><br/>РЕКОРДОВ НЕТ!';
	} else if (lang == "EN") {
		saveRecTxt.innerHTML = 'SAVE';
		clearRecTxt.innerHTML = 'CLEAR';
		recordsList2.innerHTML = '<br/><br/><br/><br/><br/>NO RECORDS!';
	}
	var modal = document.getElementById('records');
	modal.style.display = "block";
}

function closeClick(param) {
	var modal;
	var modalContent;
	if (param == 1) {
		modal = document.getElementById('rules');
		modalContent = document.getElementsByClassName('modal-content')[1];
	}
	else if (param == 2) {
		modal = document.getElementById('records');
		modalContent = document.getElementsByClassName('modal-content')[2];
	}
	else {
		modal = document.getElementById('newName');
		modalContent = document.getElementsByClassName('modal-content')[0];
	}
	var animate = modalContent.animate([ {top: '0px', opacity: '1'}, {top: '-70vh', opacity: '0'} ], {duration: 1000, iterations: 1});
	animate.play();
	setTimeout(displayNone, 1000, modal);
}

function displayNone(modal) {
	modal.style.display = "none";
}

window.onclick = function(event) {
	var modal = document.getElementById('rules');
	var modal1 = document.getElementById('records');
	var modal2 = document.getElementById('newName');
    if (event.target == modal) {
		var modalContent = document.getElementsByClassName('modal-content')[1];
		var animate = modalContent.animate([ {top: '0px', opacity: '1'}, {top: '-70vh', opacity: '0'} ], {duration: 1000, iterations: 1});
		animate.play();
		setTimeout(displayNone, 1000, modal);
    } else if (event.target == modal1) {
		var modalContent = document.getElementsByClassName('modal-content')[2];
		var animate = modalContent.animate([ {top: '0px', opacity: '1'}, {top: '-70vh', opacity: '0'} ], {duration: 1000, iterations: 1});
		animate.play();
		setTimeout(displayNone, 1000, modal1);
	} else if (event.target == modal2) {
		var modalContent = document.getElementsByClassName('modal-content')[0];
		var animate = modalContent.animate([ {top: '0px', opacity: '1'}, {top: '-70vh', opacity: '0'} ], {duration: 1000, iterations: 1});
		animate.play();
		setTimeout(displayNone, 1000, modal2);
	}
}

function setName() {
	var nameField = document.getElementById('name');
	nameField.innerText += ' ' + name;
}

function enterName() {
	var newNameInput = document.getElementById('newNameInput');
	newNameInput.value = "";
	var modal = document.getElementById('newName');
	modal.style.display = "block";
	newNameInput.focus();
}

function changeName() {
	var newNameInput = document.getElementById('newNameInput');
	if (newNameInput.value != "") {
		name = newNameInput.value;
		window.localStorage.setItem('name', name);
		var nameField = document.getElementById('name');
		var textField = nameField.innerText.substr(0, 11);
		nameField.innerText = textField + ' ' + newNameInput.value;
		closeClick(3);
	}
}

function btnClick(num) {
	window.localStorage.setItem('count', num);
	window.localStorage.setItem('name', name);
	window.localStorage.setItem('lang', lang);
	window.localStorage.setItem('records', allRecords);
}

function langClick() {
	var langNew = document.getElementById("lang");
	var name = document.getElementById("name");
	var p1 = document.getElementById("1p");
	var p2 = document.getElementById("2p");
	var rls = document.getElementById("rls");
	var rcrds = document.getElementById("rcrds");
	var capInf = document.getElementById("capInf");
	var inf = document.getElementById("inf");
	var rlsTxt = document.getElementById("rlsTxt");
	var rcrdsTxt = document.getElementById("rcrdsTxt");
	if (lang == "РУ") {
		name.innerText = "PlayerName: Player";
		p1.innerText = "1 PLAYER";
		p2.innerText = "2 PLAYERS";
		rls.innerText = "RULES";
		rcrds.innerText = "RECORDS";
		capInf.innerText = "Captain name";
		inf.innerText = "* Maximum number of characters in the name - 10.";
		rlsTxt.innerText = "Rules";
		rcrdsTxt.innerText = "Records";
		lang = "EN";
		window.localStorage.setItem('lang', lang);
		langNew.innerText = "EN";
	} else if (lang == "EN") {
		name.innerText = "Имя игрока: Player";
		p1.innerText = "1 ИГРОК";
		p2.innerText = "2 ИГРОКА";
		rls.innerText = "ПРАВИЛА";
		rcrds.innerText = "РЕКОРДЫ";
		capInf.innerText = "Имя капитана";
		inf.innerText = "* Максимально количество символов в имени - 10.";
		rlsTxt.innerText = "Правила";
		rcrdsTxt.innerText = "Рекорды";
		lang = "РУ";
		window.localStorage.setItem('lang', lang);
		langNew.innerText = "РУ";
	}
}

function clearRecords() {
		window.localStorage.removeItem('records');
		for (var i = 0; i < 10; i++)
			allRecords[i] = [0, 0];
		var recordsList1 = document.getElementById('recordsListCol1');
		var recordsList2 = document.getElementById('recordsListCol2');
		var recordsList3 = document.getElementById('recordsListCol3');
		recordsList1.innerHTML = '';
		if (lang == "РУ")
			recordsList2.innerHTML = '<br/><br/><br/><br/><br/>РЕКОРДОВ НЕТ!';
		else if (lang == "EN")
			recordsList2.innerHTML = '<br/><br/><br/><br/><br/>NO RECORDS!';
		recordsList3.innerHTML = '';
}

function saveRecords() {
		var saveRec = document.getElementById('saveRec');
		var bufRec = 0;
		if (allRecords[0][0] == 0) {
			if (lang == "РУ")
				bufRec = 'Нет рекордов!';
			else if (lang == "EN")
				bufRec = 'No records!';
		}
		else {
			if (lang == "РУ")
				bufRec = 'Ранг      Очки      Имя капитана\n\n';
			else if (lang == "EN")
				bufRec = 'Rank      Points    Captain name\n\n';
			for (var i = 0; i < allRecords.length; i++) {
				if (allRecords[i][0] != 0) {
					var buf = '';
					buf += (i + 1) + '.';
					buf = buf.padEnd(10);
					buf += allRecords[i][0];
					buf = buf.padEnd(20);
					bufRec += buf + allRecords[i][1] + '\n';
				}
			}
		}
		var file = new Blob([bufRec], {type: 'text/plain'});
		saveRec.href = URL.createObjectURL(file);
		saveRec.download = 'records.txt';
}
