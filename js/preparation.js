var count = 0; // кол-во игроков
var name1 = ""; // имя первого игрока
var name2 = ""; // имя второго игрока (если игра на 2 игроков) или компьютера (если игра для 1 игрока)
var curPlayer = 1; // игрок, заполняющий корабли на поле
var cellSize = 0; // размер ячейки поля
var ifMouseDown = false; // true - левая кнопка мыши нажата, иначе - false
var ifRotation = false; // true - в данный момент происходит эффект движения и/или поворота, иначе - false
var coordX = 0; // текущие координаты мыши по оси X
var coordY = 0; // текущие координаты мыши по оси Y
var data = null; // объект текущего перетаскиваемого корабля
var canvas = null; // объект canvas для прорисовки поля
var ctx = null; // контекст canvas
var ifNewGame = false; // если необходимо начинать игру
var ifAuto = false; // автоматическая расстановка кораблей компьютером
var ifGame = false; // если игра началась, то true, иначе - false
var x4 = ""; // координаты 4-х палубного корабля
var y4 = "";
var x31 = ""; // координаты 3-х палубного корабля
var y31 = "";
var x32 = ""; // координаты 3-х палубного корабля
var y32 = "";
var x21 = ""; // координаты 2-х палубного корабля
var y21 = "";
var x22 = ""; // координаты 2-х палубного корабля
var y22 = "";
var x23 = ""; // координаты 2-х палубного корабля
var y23 = "";
var x11 = ""; // координаты 1-о палубного корабля
var y11 = "";
var x12 = ""; // координаты 1-о палубного корабля
var y12 = "";
var x13 = ""; // координаты 1-о палубного корабля
var y13 = "";
var x14 = ""; // координаты 1-о палубного корабля
var y14 = "";

var shipsPos1 = []; // создание хранилища под положение кораблей игрока 1
for (var i = 0; i < 8; i++) {
    shipsPos1[i] = [];
    for (var j = 0; j < 8; j++)
        shipsPos1[i][j] = 0;
}

var shipsPos2 = []; // создание хранилища под положение кораблей игрока 2
for (var i = 0; i < 8; i++) {
    shipsPos2[i] = [];
    for (var j = 0; j < 8; j++)
        shipsPos2[i][j] = 0;
}

document.oncontextmenu = function () { return false }; // запрет показа контекстного меню

function mouseDown(e) {
	if (e.which == 1)
		ifMouseDown = true;
}

function mouseUp(e) {
	if (e.which == 1)
		ifMouseDown = false;
	if (ifGame)
		newTurn(e.clientX, e.clientY);
}

function mouseMove(e) {
	if (ifMouseDown && !ifRotation && data) {
		data.style.top = parseInt(window.getComputedStyle(data).top) + (e.clientY - coordY) + "px";
		data.style.left = parseInt(window.getComputedStyle(data).left) + (e.clientX - coordX) + "px";
		coordX = e.clientX;
		coordY = e.clientY;
	}
}

function dragStartOrRotate(e) {
	data = document.getElementById(e.target.id);
	if (e.which == 1) {
		data.style.zIndex = (window.getComputedStyle(data).zIndex * 2);
		coordX = e.clientX;
		coordY = e.clientY;
	}
	else if (e.which == 3 && !ifRotation) {
		data.style.transition = "all 0.5s ease-out 0s";
		ifRotation = true;
		if (window.getComputedStyle(data).transform == "matrix(1, 0, 0, 1, 0, 0)" ||
		window.getComputedStyle(data).transform == "none")
			data.style.transform = 'rotate(-90deg)';
		else
			data.style.transform = 'rotate(0deg)';
		setTimeout(resetTransition, 500, data);
		if (data.getBoundingClientRect().right < 9.5 * cellSize)
			setTimeout(putShip, 500, data);
	}
}

function dragStop(e) {
	data = document.getElementById(e.target.id);
	if (e.which == 1) {
		data.style.zIndex = (window.getComputedStyle(data).zIndex / 2);
		if (parseInt(window.getComputedStyle(data).top) + (parseInt(window.getComputedStyle(data).height) / 2) < cellSize ||
		parseInt(window.getComputedStyle(data).bottom) + (parseInt(window.getComputedStyle(data).height) / 2) < parseInt(document.body.clientHeight) - 9 * cellSize ||
		parseInt(window.getComputedStyle(data).left) + (parseInt(window.getComputedStyle(data).width) / 2) < cellSize ||
		parseInt(window.getComputedStyle(data).right) + (parseInt(window.getComputedStyle(data).width) / 2) < parseInt(document.body.clientWidth) - 9 * cellSize) {
			resetPosition(data);
		} else
			putShip(data);
	}
	data = null;
}

function addParams() {
	canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
	canvas.width = document.body.clientWidth;
	canvas.height = document.body.clientHeight;
	cellSize = Math.min(parseInt(document.body.clientWidth), parseInt(document.body.clientHeight)) / 10;
  count = window.localStorage.getItem('count');
  name1 = window.localStorage.getItem('name');
  lang = window.localStorage.getItem('lang');
  var recordsBuf = window.localStorage.getItem('records').split(',');
	for (var i = 0; i < recordsBuf.length / 2; i++) {
		allRecords[i][0] = parseInt(recordsBuf[2 * i]);
		allRecords[i][1] = recordsBuf[2 * i + 1];
	}
	if (lang == "RU")
		lang = "РУ";
	if (count == 1) {
		drawAutoAlign();
		drawMainMenuBut();
		drawField(0);
		drawCapName();
		drawShips();
		name2 = "Computer";
	}
	else if (count == 2)
		addName2();
}

function addName2() {
	var newNameInput = document.getElementById('newNameInput');
	newNameInput.value = "";
	var modal = document.getElementById('newName');
	var capInfSec = document.getElementById("capInfSec");
	var infSec = document.getElementById("infSec");
	if (lang == "EN") {
		capInfSec.innerText = "Second captain name";
		infSec.innerText = "* Maximum number of characters in the name - 10.";
	} else if (lang == "РУ") {
		capInfSec.innerText = "Имя второго капитана";
		infSec.innerText = "* Максимально количество символов в имени - 10.";
	}
	modal.style.display = "block";
	newNameInput.focus();
}

function closeClick() {
	var modal = document.getElementById('newName');
	var modalContent = document.getElementsByClassName('modal-content')[0];
	var animate = modalContent.animate([ {top: '0px', opacity: '1'}, {top: '-70vh', opacity: '0'} ], {duration: 1000, iterations: 1});
	animate.play();
	setTimeout(displayNone, 1000, modal);
}

function displayNone(modal) {
	modal.style.display = "none";
	if (name2 == "")
		name2 = "Player2";
	drawAutoAlign();
	drawMainMenuBut();
	drawField(0);
	drawCapName();
	drawShips();
}

window.onclick = function(event) {
	var modal = document.getElementById('newName');
	if (event.target == modal) {
		var modalContent = document.getElementsByClassName('modal-content')[0];
		var animate = modalContent.animate([ {top: '0px', opacity: '1'}, {top: '-70vh', opacity: '0'} ], {duration: 1000, iterations: 1});
		animate.play();
		setTimeout(displayNone, 1000, modal);
	}
}

function changeName() {
	var newNameInput = document.getElementById('newNameInput');
	if (newNameInput.value != "") {
		name2 = newNameInput.value;
		closeClick();
	}
}

function resetPosition(data) {
	var but = document.getElementById("nextOrStart");
	if (but)
		but.style.visibility = "hidden";
	var elem = data;
	var bufX = "";
	var bufY = "";
	if (elem.id == "ship4") {
		bufY = y4;
		bufX = x4;
	} else if (elem.id == "ship31") {
		bufY = y31;
		bufX = x31;
	} else if (elem.id == "ship32") {
		bufY = y32;
		bufX = x32;
	} else if (elem.id == "ship21") {
		bufY = y21;
		bufX = x21;
	} else if (elem.id == "ship22") {
		bufY = y22;
		bufX = x22;
	} else if (elem.id == "ship23") {
		bufY = y23;
		bufX = x23;
	} else if (elem.id == "ship11") {
		bufY = y11;
		bufX = x11;
	} else if (elem.id == "ship12") {
		bufY = y12;
		bufX = x12;
	} else if (elem.id == "ship13") {
		bufY = y13;
		bufX = x13;
	} else if (elem.id == "ship14") {
		bufY = y14;
		bufX = x14;
	}
	elem.style.transition = "all 1s ease-out 0s";
	ifRotation = true;
	elem.style.top = bufY;
	elem.style.left = bufX;
	if (window.getComputedStyle(elem).transform == "matrix(1, 0, 0, 1, 0, 0)" ||
		window.getComputedStyle(elem).transform == "none")
		setTimeout(resetTransition, 1000, elem);
	else {
		setTimeout(changeTransitionAndRotate, 1000, elem);
		setTimeout(resetTransition, 1500, elem);
	}
}

function changeTransitionAndRotate(elem) {
	elem.style.transitionDuration = "0.5s";
	elem.style.transform = "rotate(0deg)";
	ifRotation = true;
}

function resetTransition(elem) {
	elem.style.transition = "none";
	ifRotation = false;
}

function putShip(elem) {
	var index = 0;
	if (elem.id == "ship4")
		index = 5;
	else if (elem.id == "ship31" || elem.id == "ship32")
		index = 6;
	else if (elem.id == "ship21" || elem.id == "ship22" || elem.id == "ship23")
		index = 7;
	else if (elem.id == "ship11" || elem.id == "ship12" || elem.id == "ship13" || elem.id == "ship14")
		index = 8;
	var numX = 1;
	var numY = 1;
	var min = 2 * cellSize;
	var ifVertical = false;
	for (i = 0; i < index; i++) {
		if (window.getComputedStyle(elem).transform == "matrix(1, 0, 0, 1, 0, 0)" ||
		window.getComputedStyle(elem).transform == "none")
		{
			if (min > Math.abs(parseInt(window.getComputedStyle(elem).left) - (1 + i) * cellSize)) {
				min = Math.abs(parseInt(window.getComputedStyle(elem).left) - (1 + i) * cellSize);
				numX = i + 1;
			}
		} else {
			if (min > Math.abs(elem.getBoundingClientRect().top - (1 + i) * cellSize)) {
				min = Math.abs(elem.getBoundingClientRect().top - (1 + i) * cellSize);
				numY = i + 1;
			}
			ifVertical = true;
		}
	}
	min = 2 * cellSize;
	for (i = 0; i < 8; i++) {
		if (window.getComputedStyle(elem).transform == "matrix(1, 0, 0, 1, 0, 0)" ||
		window.getComputedStyle(elem).transform == "none")
		{
			if (min > Math.abs(parseInt(window.getComputedStyle(elem).top) - (1 + i) * cellSize)) {
				min = Math.abs(parseInt(window.getComputedStyle(elem).top) - (1 + i) * cellSize);
				numY = i + 1;
			}
		} else {
			if (min > Math.abs(elem.getBoundingClientRect().left - (1 + i) * cellSize)) {
				min = Math.abs(elem.getBoundingClientRect().left - (1 + i) * cellSize);
				numX = i + 1;
			}
		}
	}
	if (checkIfAllCellsAreAvailable(elem, 9 - index, ifVertical)) {
		elem.style.transition = "all 0.5s ease-out 0s";
		ifRotation = true;
		if (window.getComputedStyle(elem).transform == "matrix(1, 0, 0, 1, 0, 0)" ||
			window.getComputedStyle(elem).transform == "none")
		{
			elem.style.top = numY * cellSize + "px";
			elem.style.left = numX * cellSize + "px";
		} else {
			elem.style.top = numY * cellSize - (parseInt(window.getComputedStyle(elem).height) - parseInt(window.getComputedStyle(elem).width)) / 2 + "px";
			elem.style.left = numX * cellSize + (parseInt(window.getComputedStyle(elem).height) - parseInt(window.getComputedStyle(elem).width)) / 2 + "px";
		}
		setTimeout(resetTransition, 500, elem);
		if (checkIfAllShipsAreOnTheField()) {
			var but = document.getElementById("nextOrStart");
			if (but) {
				if (!ifNewGame)
					but.style.visibility = "visible";
			}
			else
				drawStartOrNext();
		}
	} else
		resetPosition(elem);
}

function checkIfAllCellsAreAvailable(elem, count, ifVertical) {
	var top = elem.getBoundingClientRect().top;
	var left = elem.getBoundingClientRect().left;
	elem.style.visibility = "hidden";
	for (i = 0; i < count; i++) {
		if (ifVertical) {
			var centerX = left + 0.5 * cellSize;
			var centerY = top + (i + 0.5) * cellSize;
		} else {
			var centerX = left + (i + 0.5) * cellSize;
			var centerY = top + 0.5 * cellSize;
		}
		if ((document.elementFromPoint(centerX, centerY) && document.elementFromPoint(centerX, centerY).id != 'canvas' && document.elementFromPoint(centerX, centerY).id != 'mainMenu') ||
		(document.elementFromPoint(centerX - cellSize, centerY - cellSize) && document.elementFromPoint(centerX - cellSize, centerY - cellSize).id != 'canvas' && document.elementFromPoint(centerX - cellSize, centerY - cellSize).id != 'mainMenu') ||
		(document.elementFromPoint(centerX, centerY - cellSize) && document.elementFromPoint(centerX, centerY - cellSize).id != 'canvas' && document.elementFromPoint(centerX, centerY - cellSize).id != 'mainMenu') ||
		(document.elementFromPoint(centerX + cellSize, centerY - cellSize) && document.elementFromPoint(centerX + cellSize, centerY - cellSize).id != 'canvas' && document.elementFromPoint(centerX + cellSize, centerY - cellSize).id != 'mainMenu') ||
		(document.elementFromPoint(centerX + cellSize, centerY) && document.elementFromPoint(centerX + cellSize, centerY).id != 'canvas' && document.elementFromPoint(centerX + cellSize, centerY).id != 'mainMenu') ||
		(document.elementFromPoint(centerX + cellSize, centerY + cellSize) && document.elementFromPoint(centerX + cellSize, centerY + cellSize).id != 'canvas' && document.elementFromPoint(centerX + cellSize, centerY + cellSize).id != 'mainMenu') ||
		(document.elementFromPoint(centerX, centerY + cellSize) && document.elementFromPoint(centerX, centerY + cellSize).id != 'canvas' && document.elementFromPoint(centerX, centerY + cellSize).id != 'mainMenu') ||
		(document.elementFromPoint(centerX - cellSize, centerY + cellSize) && document.elementFromPoint(centerX - cellSize, centerY + cellSize).id != 'canvas' && document.elementFromPoint(centerX - cellSize, centerY + cellSize).id != 'mainMenu') ||
		(document.elementFromPoint(centerX - cellSize, centerY) && document.elementFromPoint(centerX - cellSize, centerY).id != 'canvas' && document.elementFromPoint(centerX - cellSize, centerY).id != 'mainMenu')) {
			elem.style.visibility = "visible";
			return false;
		}
	}
	elem.style.visibility = "visible";
	return true;
}

function checkIfAllShipsAreOnTheField() {
	var ships = document.getElementsByClassName("ships");
	for (i = 0; i < ships.length; i++) {
		if (ships[i].getBoundingClientRect().right > 9.5 * cellSize)
			return false;
	}
	return true;
}

function nextOrStart() {
	var but = document.getElementById("nextOrStart");
	var ships = document.getElementsByClassName("ships");
	if (but.innerHTML == "ПРОДОЛЖИТЬ" || but.innerHTML == "CONTINUE") {
		ifNewGame = true;
		mindShipsPos(shipsPos1);
		var capName = document.getElementById("capName");
		if (lang == "РУ")
			capName.innerHTML = "Корабли капитана " + name2;
		else if (lang == "EN")
			capName.innerHTML = "Captain " + name2 + " ships";
		for (i = 0; i < ships.length; i++)
			resetPosition(ships[i]);
		if (lang == "РУ")
			but.innerHTML = "НАЧАТЬ ИГРУ";
		else if (lang == "EN")
			but.innerHTML = "START";
		but.style.visibility = "hidden";
	}
	else if (but.innerHTML == "НАЧАТЬ ИГРУ" || but.innerHTML == "START") {
		if (count == 1)
			mindShipsPos(shipsPos1);
		else if (count == 2)
			mindShipsPos(shipsPos2);
		for (i = 0; i < ships.length; i++)
			ships[i].style.visibility = "hidden";
		var capName = document.getElementById("capName");
		capName.style.visibility = "hidden";
		var autoAlign = document.getElementById("autoAlign");
		autoAlign.style.visibility = "hidden";
		ifAuto = true;
		but.style.visibility = "hidden";
		setTimeout(compShips, 1000);
		startGame(); // переход в скрипт play.js (начало игры)
	}
}

function compShips() {
	autoAlignClick(2);
}

function mindShipsPos(arr) {
	for (i = 0; i < 8; i++) {
		for (j = 0; j < 8; j++) {
			arr[j][i] = 0;
			if (document.elementFromPoint((i + 1.5) * cellSize, (j + 1.5) * cellSize).id != 'canvas')
				arr[j][i] = 1;
		}
	}
}

function mainMenuClick() {
	document.location.href = "../index.html";
}

function drawAutoAlign() {
	var autoAlign = document.getElementById("autoAlign");
	autoAlign.style.position = "absolute";
	autoAlign.style.top = 1.5 * cellSize + "px";
	autoAlign.style.left = 17 * cellSize + "px";
	autoAlign.style.width = 1.5 * cellSize + "px";
	autoAlign.style.height = 1.5 * cellSize + "px";
	autoAlign.style.zIndex = 6;
	autoAlign.style.cursor = "pointer";
	autoAlign.style.transition = "0.5s";
	autoAlign.style.backgroundSize = "200% auto";
	autoAlign.style.boxShadow = "0 0 20px #eee";
	autoAlign.style.borderRadius = "10px";
	autoAlign.style.backgroundImage = "linear-gradient(to right, #a1c4fd 0%, #c2e9fb 51%, #a1c4fd 100%)";
	autoAlign.onmouseover = function() { autoAlign.style.backgroundPosition = "right center"; };
	autoAlign.onmouseout = function() { autoAlign.style.backgroundPosition = "left center"; };
	if (lang == "РУ")
		autoAlign.value = "АВТО";
	else if (lang == "EN")
		autoAlign.value = "AUTO";
	autoAlign.style.userSelect = "none";
}

function drawMainMenuBut() {
	var mainMenuBut = document.getElementById("mainMenu");
	mainMenuBut.style.position = "absolute";
	mainMenuBut.style.top = 0.25 * cellSize + "px";
	mainMenuBut.style.left = 1 * cellSize + "px";
	mainMenuBut.style.width = 4 * cellSize + "px";
	mainMenuBut.style.height = 0.5 * cellSize + "px";
	mainMenuBut.style.zIndex = 6;
	mainMenuBut.style.cursor = "pointer";
	mainMenuBut.style.transition = "0.5s";
	mainMenuBut.style.backgroundSize = "200% auto";
	mainMenuBut.style.boxShadow = "0 0 20px #eee";
	mainMenuBut.style.borderRadius = "10px";
	mainMenuBut.style.backgroundImage = "linear-gradient(to right, #a1c4fd 0%, #c2e9fb 51%, #a1c4fd 100%)";
	mainMenuBut.onmouseover = function() { mainMenuBut.style.backgroundPosition = "right center"; };
	mainMenuBut.onmouseout = function() { mainMenuBut.style.backgroundPosition = "left center"; };
	if (lang == "РУ")
		mainMenuBut.value = "ГЛАВНОЕ МЕНЮ";
	else if (lang == "EN")
		mainMenuBut.value = "MAIN MENU";
	mainMenuBut.style.userSelect = "none";
}

function drawField(shift) {
    ctx.beginPath();
    ctx.moveTo((1 + shift) * cellSize, cellSize);
	for (i = 0; i <= 8; i++) {
		ctx.lineTo(cellSize + (i + shift) * cellSize, 9 * cellSize);
		ctx.moveTo(cellSize + (i + 1 + shift) * cellSize , cellSize);
	}
	ctx.closePath();
	ctx.stroke();

    ctx.beginPath();
    ctx.moveTo((1 + shift) * cellSize, cellSize);
	for (i = 0; i <= 8; i++) {
		ctx.lineTo((9 + shift) * cellSize, cellSize + i * cellSize);
		ctx.moveTo((1 + shift) * cellSize, cellSize + (i + 1) * cellSize);
	}
    ctx.closePath();
    ctx.stroke();

	ctx.beginPath();
	ctx.font = '30px monospace';
	for (i = 0; i < 8; i++) {
		if (lang == "РУ")
			ctx.fillText(String.fromCharCode(1040 + i), (0.5 + shift) * cellSize, (1.5 + i) * cellSize + 10);
		else if (lang == "EN")
			ctx.fillText(String.fromCharCode(65 + i), (0.5 + shift) * cellSize, (1.5 + i) * cellSize + 10);
		ctx.fillText(i + 1, (1.5 + i + shift) * cellSize - 10, 9.5 * cellSize);
	}
	ctx.closePath();
	ctx.stroke();
}

function drawCapName() {
	var capName = document.createElement("h1");
	capName.id = "capName";
	capName.style.position = "absolute";
	capName.style.top = 0.4 * cellSize + "px";
	capName.style.left = 12.5 * cellSize + "px";
	capName.style.fontSize = "30px";
	if (lang == "РУ")
		capName.innerHTML = "Корабли капитана " + name1;
	else if (lang == "EN")
		capName.innerHTML = "Captain " + name1 + " ships";
	capName.style.zIndex = 6;
	capName.style.userSelect = "none";
	document.body.appendChild(capName);
}

function drawShips() {
	var ship4 = document.createElement("div");
	ship4.id = "ship4";
	ship4.style.width = 4 * cellSize + "px";
	ship4.style.height = cellSize + "px";
	ship4.style.backgroundImage = "url(../img/4.png)";
	ship4.style.top = 2 * cellSize + "px";
	ship4.style.left = 11 * cellSize + "px";
	ship4.className = "ships";
	document.body.appendChild(ship4);
	x4 = 11 * cellSize + "px";
	y4 = 2 * cellSize + "px";

	var ship31 = document.createElement("div");
	ship31.id = "ship31";
	ship31.style.width = 3 * cellSize + "px";
	ship31.style.height = cellSize + "px";
	ship31.style.backgroundImage = "url(../img/3.png)";
	ship31.style.top = 4 * cellSize + "px";
	ship31.style.left = 11 * cellSize + "px";
	ship31.className = "ships";
	document.body.appendChild(ship31);
	x31 = 11 * cellSize + "px";
	y31 = 4 * cellSize + "px";

	var ship32 = document.createElement("div");
	ship32.id = "ship32";
	ship32.style.width = 3 * cellSize + "px";
	ship32.style.height = cellSize + "px";
	ship32.style.backgroundImage = "url(../img/3.png)";
	ship32.style.top = 4 * cellSize + "px";
	ship32.style.left = 15 * cellSize + "px";
	ship32.className = "ships";
	document.body.appendChild(ship32);
	x32 = 15 * cellSize + "px";
	y32 = 4 * cellSize + "px";

	var ship21 = document.createElement("div");
	ship21.id = "ship21";
	ship21.style.width = 2 * cellSize + "px";
	ship21.style.height = cellSize + "px";
	ship21.style.backgroundImage = "url(../img/2.png)";
	ship21.style.top = 6 * cellSize + "px";
	ship21.style.left = 11 * cellSize + "px";
	ship21.className = "ships";
	document.body.appendChild(ship21);
	x21 = 11 * cellSize + "px";
	y21 = 6 * cellSize + "px";

	var ship22 = document.createElement("div");
	ship22.id = "ship22";
	ship22.style.width = 2 * cellSize + "px";
	ship22.style.height = cellSize + "px";
	ship22.style.backgroundImage = "url(../img/2.png)";
	ship22.style.top = 6 * cellSize + "px";
	ship22.style.left = 14 * cellSize + "px";
	ship22.className = "ships";
	document.body.appendChild(ship22);
	x22 = 14 * cellSize + "px";
	y22 = 6 * cellSize + "px";

	var ship23 = document.createElement("div");
	ship23.id = "ship23";
	ship23.style.width = 2 * cellSize + "px";
	ship23.style.height = cellSize + "px";
	ship23.style.backgroundImage = "url(../img/2.png)";
	ship23.style.top = 6 * cellSize + "px";
	ship23.style.left = 17 * cellSize + "px";
	ship23.className = "ships";
	document.body.appendChild(ship23);
	x23 = 17 * cellSize + "px";
	y23 = 6 * cellSize + "px";

	var ship11 = document.createElement("div");
	ship11.id = "ship11";
	ship11.style.width = cellSize + "px";
	ship11.style.height = cellSize + "px";
	ship11.style.backgroundImage = "url(../img/1.png)";
	ship11.style.top = 8 * cellSize + "px";
	ship11.style.left = 11 * cellSize + "px";
	ship11.className = "ships";
	document.body.appendChild(ship11);
	x11 = 11 * cellSize + "px";
	y11 = 8 * cellSize + "px";

	var ship12 = document.createElement("div");
	ship12.id = "ship12";
	ship12.style.width = cellSize + "px";
	ship12.style.height = cellSize + "px";
	ship12.style.backgroundImage = "url(../img/1.png)";
	ship12.style.top = 8 * cellSize + "px";
	ship12.style.left = 13 * cellSize + "px";
	ship12.className = "ships";
	document.body.appendChild(ship12);
	x12 = 13 * cellSize + "px";
	y12 = 8 * cellSize + "px";

	var ship13 = document.createElement("div");
	ship13.id = "ship13";
	ship13.style.width = cellSize + "px";
	ship13.style.height = cellSize + "px";
	ship13.style.backgroundImage = "url(../img/1.png)";
	ship13.style.top = 8 * cellSize + "px";
	ship13.style.left = 15 * cellSize + "px";
	ship13.className = "ships";
	document.body.appendChild(ship13);
	x13 = 15 * cellSize + "px";
	y13 = 8 * cellSize + "px";

	var ship14 = document.createElement("div");
	ship14.id = "ship14";
	ship14.style.width = cellSize + "px";
	ship14.style.height = cellSize + "px";
	ship14.style.backgroundImage = "url(../img/1.png)";
	ship14.style.top = 8 * cellSize + "px";
	ship14.style.left = 17 * cellSize + "px";
	ship14.className = "ships";
	document.body.appendChild(ship14);
	x14 = 17 * cellSize + "px";
	y14 = 8 * cellSize + "px";

	var ships = document.getElementsByClassName("ships");
	for (i = 0; i < ships.length; i++) {
		ships[i].style.position = "absolute";
		ships[i].style.backgroundSize = "contain";
		ships[i].style.backgroundRepeat = "no-repeat";
		ships[i].style.zIndex = 10;
		ships[i].style.cursor = "pointer";
		ships[i].addEventListener("mousedown", function(event) { dragStartOrRotate(event) });
		ships[i].addEventListener("mouseup", function(event) { dragStop(event) });
	}
}

function drawStartOrNext() {
	var but = document.createElement("button");
	but.id = "nextOrStart";
	but.style.width = 4 * cellSize + "px";
	but.style.height = 2 * cellSize + "px";
	but.style.position = "absolute";
	but.style.zIndex = 10;
	but.style.top = 4 * cellSize + "px";
	but.style.left = 13 * cellSize + "px";
	but.style.fontSize = "5vh";
	but.style.transition = "0.5s";
	but.style.backgroundSize = "200% auto";
	but.style.boxShadow = "0 0 20px #eee";
	but.style.borderRadius = "10px";
	but.style.backgroundImage = "linear-gradient(to right, #a1c4fd 0%, #c2e9fb 51%, #a1c4fd 100%)";
	but.onmouseover = function() { but.style.backgroundPosition = "right center"; };
	but.onmouseout = function() { but.style.backgroundPosition = "left center"; };
	if (count == 1) {
		curPlayer = 2;
		if (lang == "РУ")
				but.innerHTML = "НАЧАТЬ ИГРУ";
		else if (lang == "EN")
				but.innerHTML = "START";
	}
	else if (!ifNewGame) {
			if (lang == "РУ")
				but.innerHTML = "ПРОДОЛЖИТЬ";
			else if (lang == "EN")
				but.innerHTML = "CONTINUE";
	}
	else if (ifNewGame) {
			if (lang == "РУ")
				but.innerHTML = "НАЧАТЬ ИГРУ";
			else if (lang == "EN")
				but.innerHTML = "START";
	}
	but.style.cursor = "pointer";
	but.onclick = function(event) { nextOrStart(); but.style.visibility = "hidden"; };
	document.body.appendChild(but);
	if (ifAuto)
		but.style.visibility = "hidden";
}

function toMainMenuIfNoAction() {
  var time = 0;
  document.addEventListener('mousemove', resetTimer);
  document.addEventListener('keypress', resetTimer);
  document.addEventListener('click', resetTimer);
  document.addEventListener('submit', resetTimer);
  document.addEventListener('focus', resetTimer);

  function resetTimer() {
    clearTimeout(time);
    time = setTimeout(toMenu, 10000);
  }

  function toMenu() {
      alert("Из-за бездействия Вы будете перенаправлены в главное меню игры.");
    	document.location.href = "../index.html";
  }
}
