var attempts = 0; // количество попыток добавления одного корбаля на поле (не более 100)

function autoAlignClick(num) {
	for (var j = 0; j < 8; j++) {
		for (var k = 0; k < 8; k++)
		if (num == 1)
			shipsPos1[j][k] = 0;
		else
			shipsPos2[j][k] = 0;
	}
	var arr = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
	for (var i = 0; i < arr.length; i++) {
		checkShip(arr[i], num, i);
	}
	var cnt = 0;
	for (var j = 0; j < 8; j++) {
		for (var k = 0; k < 8; k++)
			if (num == 1)
				cnt += shipsPos1[j][k];
			else
				cnt += shipsPos2[j][k];
	}
	if (cnt == 20 && !document.getElementById("nextOrStart"))
		drawStartOrNext();
	else if (cnt == 20 && document.getElementById("nextOrStart") && !ifGame)
		document.getElementById("nextOrStart").style.visibility = "visible";
}

function checkShip(cnt, num, index) {
	var direction = Math.floor(Math.random() * 100) % 2; // 0 - по горизонтали, 1 - по вертикали
	var xCoord;
	var yCoord;
	if (direction == 0) {
		xCoord = Math.floor(Math.random() * 100) % (9 - cnt);
		yCoord = Math.floor(Math.random() * 100) % 8;
	} else {
		xCoord = Math.floor(Math.random() * 100) % 8;
		yCoord = Math.floor(Math.random() * 100) % (9 - cnt);
	}
	var bufXCoord = xCoord;
	var bufYCoord = yCoord;
	for (var i = 0; i < cnt; i++) {
		if (num == 1) {
			if ((shipsPos1[bufXCoord][bufYCoord] == 1) ||
				(bufYCoord > 0 && shipsPos1[bufXCoord][bufYCoord - 1] == 1) ||
				(bufXCoord < 7 && bufYCoord > 0 && shipsPos1[bufXCoord + 1][bufYCoord - 1] == 1) ||
				(bufXCoord < 7 && shipsPos1[bufXCoord + 1][bufYCoord] == 1) ||
				(bufXCoord < 7 && bufYCoord < 7 && shipsPos1[bufXCoord + 1][bufYCoord + 1] == 1) ||
				(bufYCoord < 7 && shipsPos1[bufXCoord][bufYCoord + 1] == 1) ||
				(bufXCoord > 0 && bufYCoord < 7 && shipsPos1[bufXCoord - 1][bufYCoord + 1] == 1) ||
				(bufXCoord > 0 && shipsPos1[bufXCoord - 1][bufYCoord] == 1) ||
				(bufXCoord > 0 && bufYCoord > 0 && shipsPos1[bufXCoord - 1][bufYCoord - 1] == 1)) {
					attempts++;
					if (attempts == 100) {
						for (var j = 0; j < 8; j++) {
							for (var k = 0; k < 8; k++)
								shipsPos1[j][k] = 0;
						}
						autoAlignClick(num);
						return;
					}
					else {
						checkShip(cnt, num, index);
						return;
					}
				}
		} else {
			if ((shipsPos2[bufXCoord][bufYCoord] == 1) ||
				(bufYCoord > 0 && shipsPos2[bufXCoord][bufYCoord - 1] == 1) ||
				(bufXCoord < 7 && bufYCoord > 0 && shipsPos2[bufXCoord + 1][bufYCoord - 1] == 1) ||
				(bufXCoord < 7 && shipsPos2[bufXCoord + 1][bufYCoord] == 1) ||
				(bufXCoord < 7 && bufYCoord < 7 && shipsPos2[bufXCoord + 1][bufYCoord + 1] == 1) ||
				(bufYCoord < 7 && shipsPos2[bufXCoord][bufYCoord + 1] == 1) ||
				(bufXCoord > 0 && bufYCoord < 7 && shipsPos2[bufXCoord - 1][bufYCoord + 1] == 1) ||
				(bufXCoord > 0 && shipsPos2[bufXCoord - 1][bufYCoord] == 1) ||
				(bufXCoord > 0 && bufYCoord > 0 && shipsPos2[bufXCoord - 1][bufYCoord - 1] == 1)) {
					attempts++;
					if (attempts == 100) {
						for (var j = 0; j < 8; j++) {
							for (var k = 0; k < 8; k++)
								shipsPos2[j][k] = 0;
						}
						autoAlignClick(num);
						return;
					}
					else {
						checkShip(cnt, num, index);
						return;
					}
				}
		}
		if (direction == 0)
			bufXCoord++;
		else
			bufYCoord++;
	}
	attempts = 0;
	for (var j = 0; j < cnt; j++) {
		if (direction == 0)
			if (num == 1)
				shipsPos1[xCoord + j][yCoord] = 1;
			else
				shipsPos2[xCoord + j][yCoord] = 1;
		else
			if (num == 1)
				shipsPos1[xCoord][yCoord + j] = 1;
			else
				shipsPos2[xCoord][yCoord + j] = 1;
	}
	if (cnt == 4)
		data = document.getElementById("ship4");
	if (cnt == 3 && index == 1)
		data = document.getElementById("ship31");
	if (cnt == 3 && index == 2)
		data = document.getElementById("ship32");
	if (cnt == 2 && index == 3)
		data = document.getElementById("ship21");
	if (cnt == 2 && index == 4)
		data = document.getElementById("ship22");
	if (cnt == 2 && index == 5)
		data = document.getElementById("ship23");
	if (cnt == 1 && index == 6)
		data = document.getElementById("ship11");
	if (cnt == 1 && index == 7)
		data = document.getElementById("ship12");
	if (cnt == 1 && index == 8)
		data = document.getElementById("ship13");
	if (cnt == 1 && index == 9)
		data = document.getElementById("ship14");
	data.style.transition = "all 1s ease-out 0s";
	if (direction == 1) {
		data.style.transform = "rotate(0deg)";
		data.style.top = (xCoord + 1) * cellSize + "px";
		data.style.left = (yCoord + 1) * cellSize + "px";
	}
	else if (cnt == 4) {
		data.style.transform = "rotate(90deg)";
		data.style.top = (xCoord + 2.5) * cellSize + "px";
		data.style.left = (yCoord - 0.5) * cellSize + "px";
	}
	else if (cnt == 3) {
		data.style.transform = "rotate(90deg)";
		data.style.top = (xCoord + 2) * cellSize + "px";
		data.style.left = (yCoord) * cellSize + "px";
	}
	else if (cnt == 2) {
		data.style.transform = "rotate(90deg)";
		data.style.top = (xCoord + 1.5) * cellSize + "px";
		data.style.left = (yCoord + 0.5) * cellSize + "px";
	}
	else if (cnt == 1) {
		data.style.transform = "rotate(90deg)";
		data.style.top = (xCoord + 1) * cellSize + "px";
		data.style.left = (yCoord + 1) * cellSize + "px";
	}
	setTimeout(endTrans, 1000, data);
}

function endTrans(data) {
	data.style.transition = "none";
}