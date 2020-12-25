var turnNum = 1; // номер игрока, который должен ходить
var deg = 1; // кол-во поворотов стрелки
var deadParts1 = 0; // кол-во попаданий 1-го игрока
var deadParts2 = 0; // кол-во попаданий 2-го игрока
var points1 = 0; // кол-во очков у игрока 1
var points2 = 0; // кол-во очков у игрока 2
var strokeNum = 1; // номер хода
var lastXHit = 0; // последнее попадание компьютера по оси X
var lastYHit = 0; // последнее попадание компьютера по оси Y
var ifLastHit = false; // определяет, был ли последний ход компьютера удачным (попадание)
var checkedPos1 = []; // создание хранилища под проверенные клетки поля игроком 1
	for (var i = 0; i < 8; i++) {
		checkedPos1[i] = [];
		for (var j = 0; j < 8; j++)
			checkedPos1[i][j] = 0;
	}
var checkedPos2 = []; // создание хранилища под проверенные клетки поля игроком 2
	for (var i = 0; i < 8; i++) {
		checkedPos2[i] = [];
		for (var j = 0; j < 8; j++)
			checkedPos2[i][j] = 0;
	}

function startGame() {
	ifGame = true;
	drawField(11);
	var but = document.getElementById("nextOrStart");
	but.blur();
	but.style.visibility = "hidden";

	var mainMenu = document.getElementById("mainMenu");
	mainMenu.style.left = 8.5 * cellSize + "px";

	var cap1Name = document.createElement("div");
	cap1Name.id = "cap1Name";
	cap1Name.style.position = "absolute";
	cap1Name.style.top = 0.3 * cellSize + "px";
	cap1Name.style.left = (5 - 17 * (name1.length + 12) / 140) * cellSize + "px";
	cap1Name.style.fontSize = "4vh";
	cap1Name.style.color = "green";
	if (lang == "РУ")
		cap1Name.innerText = "Капитан " + name1 + " (" + points1 + ")";
	else if (lang == "EN")
		cap1Name.innerText = "Captain " + name1 + " (" + points1 + ")";
	cap1Name.style.zIndex = 6;
	cap1Name.style.userSelect = "none";
	document.body.appendChild(cap1Name);

	var cap2Name = document.createElement("div");
	cap2Name.id = "cap2Name";
	cap2Name.style.position = "absolute";
	cap2Name.style.top = 0.3 * cellSize + "px";
	cap2Name.style.left = (16 - 17 * (name2.length + 12) / 140) * cellSize + "px";
	cap2Name.style.fontSize = "4vh";
	cap2Name.style.color = "black";
	if (lang == "РУ")
		cap2Name.innerText = "Капитан " + name2 + " (" + points2 + ")";
	else if (lang == "EN")
		cap2Name.innerText = "Captain " + name2 + " (" + points2 + ")";
	cap2Name.style.zIndex = 6;
	cap2Name.style.userSelect = "none";
	document.body.appendChild(cap2Name);

	var turn = document.createElement("div");
	turn.id = "turn";
	turn.style.position = "absolute";
	turn.style.top = 4.5 * cellSize + "px";
	turn.style.left = 9.5 * cellSize + "px";
	turn.style.width = 1.5 * cellSize + "px";
	turn.style.height = cellSize + "px";
	turn.style.backgroundImage = "url(../img/turn.png)";
	turn.style.backgroundSize = "contain";
	turn.style.backgroundRepeat = "no-repeat";
	turn.style.zIndex = 6;
	turn.style.transition = "all 0.5s ease-out 0s";
	turn.style.userSelect = "none";
	document.body.appendChild(turn);
}

function newTurn(x, y) {
	var turn = document.getElementById("turn");
	var cap1Name = document.getElementById("cap1Name");
	var cap2Name = document.getElementById("cap2Name");
	if (turnNum == 1) {
		var numX = -1;
		if (x >= 12 * cellSize && x <= 20 * cellSize) {
			for (i = 0; i < 8; i++) {
				if ((12 + i) * cellSize <= x)
					numX++;
				else
					break;
			}
		}
		var numY = -1;
		if (y >= cellSize && y <= 9 * cellSize) {
			for (i = 0; i < 8; i++) {
				if ((1 + i) * cellSize <= y)
					numY++;
				else
					break;
			}
		}
		if (numX > -1 && numY > -1 && checkedPos1[numY][numX] == 0) {
			checkedPos1[numY][numX] = 1;
			if (shipsPos2[numY][numX] == 0) {
				ctx.beginPath();
				ctx.arc((12.5 + numX) * cellSize, (1.5 + numY) * cellSize, cellSize / 7, 0, 2 * Math.PI, false);
				ctx.fillStyle = 'red';
				ctx.fill();
				ctx.strokeStyle = 'red';
				ctx.closePath();
				ctx.stroke();
				turn.style.transform = "rotate(" + deg * 180 + "deg)";
				turnNum = 2;
				deg++;
				cap1Name.style.color = "black";
				cap2Name.style.color = "green";
				if (count == 1 && turnNum == 2) {
					setTimeout(compTurn, 1000);
				}
			}
			else if (shipsPos2[numY][numX] == 1) {
				checkIfShipIsDead(1, numX, numY);
				deadParts1++;
			}
		}
	} else if (turnNum == 2) {
		var numX = -1;
		if (x >= cellSize && x <= 9 * cellSize) {
			for (i = 0; i < 8; i++) {
				if ((1 + i) * cellSize <= x)
					numX++;
				else
					break;
			}
		}

		var numY = -1;
		if (y >= cellSize && y <= 9 * cellSize) {
			for (i = 0; i < 8; i++) {
				if ((1 + i) * cellSize <= y)
					numY++;
				else
					break;
			}
		}
		if (numX > -1 && numY > -1 && checkedPos2[numY][numX] == 0) {
			checkedPos2[numY][numX] = 1;
			if (shipsPos1[numY][numX] == 0) {
				ctx.beginPath();
				ctx.arc((1.5 + numX) * cellSize, (1.5 + numY) * cellSize, cellSize / 7, 0, 2 * Math.PI, false);
				ctx.fillStyle = 'red';
				ctx.fill();
				ctx.strokeStyle = 'red';
				ctx.closePath();
				ctx.stroke();
				turn.style.transform = "rotate(" + deg * 180 + "deg)";
				strokeNum++;
				turnNum = 1;
				deg++;
				cap2Name.style.color = "black";
				cap1Name.style.color = "green";
			}
			else if (shipsPos1[numY][numX] == 1) {
				checkIfShipIsDead(2, numX, numY);
				deadParts2++;
				if (lang == "РУ")
					cap2Name.innerText = "Капитан " + name2 + " (" + points2 + ")";
				else if (lang == "EN")
					cap2Name.innerText = "Captain " + name2 + " (" + points2 + ")";
			}
		}
	}
	if (deadParts1 == 20)
		victory(1);
	else if (deadParts2 == 20)
		victory(2);
}

function compTurn() {
	if (deadParts2 == 20) {
		victory(2);
		return;
	}
	var turn = document.getElementById("turn");
	var cap1Name = document.getElementById("cap1Name");
	var cap2Name = document.getElementById("cap2Name");
	var xCoord;
	var yCoord;
	if (ifLastHit) {
		if (lastYHit > 0 && checkedPos2[lastYHit - 1][lastXHit] == 0) {
			xCoord = lastXHit;
			yCoord = lastYHit - 1;
		} else if (lastXHit < 7 && checkedPos2[lastYHit][lastXHit + 1] == 0) {
			xCoord = lastXHit + 1;
			yCoord = lastYHit;
		} else if (lastYHit < 7 && checkedPos2[lastYHit + 1][lastXHit] == 0) {
			xCoord = lastXHit;
			yCoord = lastYHit + 1;
		} else if (lastXHit > 0 && checkedPos2[lastYHit][lastXHit - 1] == 0) {
			xCoord = lastXHit - 1;
			yCoord = lastYHit;
		} else {
			xCoord = Math.floor(Math.random() * 100) % 8;
			yCoord = Math.floor(Math.random() * 100) % 8;
			while (checkedPos2[yCoord][xCoord] == 1) {
				xCoord = Math.floor(Math.random() * 100) % 8;
				yCoord = Math.floor(Math.random() * 100) % 8;
			}
		}
	}
	else {
		xCoord = Math.floor(Math.random() * 100) % 8;
		yCoord = Math.floor(Math.random() * 100) % 8;
		while (checkedPos2[yCoord][xCoord] == 1) {
			xCoord = Math.floor(Math.random() * 100) % 8;
			yCoord = Math.floor(Math.random() * 100) % 8;
		}
	}
	checkedPos2[yCoord][xCoord] = 1;
	if (shipsPos1[yCoord][xCoord] == 0) {
		ifLastHit = false;
		ctx.beginPath();
		ctx.arc((1.5 + xCoord) * cellSize, (1.5 + yCoord) * cellSize, cellSize / 7, 0, 2 * Math.PI, false);
		ctx.fillStyle = 'red';
		ctx.fill();
		ctx.strokeStyle = 'red';
		ctx.closePath();
		ctx.stroke();
		turn.style.transform = "rotate(" + deg * 180 + "deg)";
		turnNum = 1;
		strokeNum++;
		deg++;
		cap1Name.style.color = "green";
		cap2Name.style.color = "black";
	} else if (shipsPos1[yCoord][xCoord] == 1) {
		ifLastHit = true;
		lastXHit = xCoord;
		lastYHit = yCoord;
		checkIfShipIsDead(2, xCoord, yCoord);
		deadParts2++;
		setTimeout(compTurn, 1000);
	}
}

function checkIfShipIsDead(num, x, y) {
	var numDeckChecked = 1;
	var numDeck = 1;
	var dir = ["left", "up", "right", "down"];
	var deckPos = [[y, x]];
	for (i = 0; i < 4; i++) {
		if (num == 1) {
			if (dir[i] == "left" && x > 0) {
				if (shipsPos2[y][x - 1] == 1) {
					numDeck++;
					if (x > 1 && shipsPos2[y][x - 2] == 1) {
						numDeck++;
						if (x > 2 && shipsPos2[y][x - 3] == 1)
							numDeck++;
					}
					if (checkedPos1[y][x - 1] == 1) {
						numDeckChecked++;
						deckPos.push([y, x - 1]);
						if (x > 1) {
							if (shipsPos2[y][x - 2] == 1) {
								if (checkedPos1[y][x - 2] == 1) {
									numDeckChecked++;
									deckPos.push([y, x - 2]);
									if (x > 2) {
										if (shipsPos2[y][x - 3] == 1) {
											if (checkedPos1[y][x - 3] == 1) {
												numDeckChecked++;
												deckPos.push([y, x - 3]);
											}
										}
									}
								}
							}
						}
					}
				}
			} else if (dir[i] == "up" && y > 0) {
				if (shipsPos2[y - 1][x] == 1) {
					numDeck++;
					if (y > 1 && shipsPos2[y - 2][x] == 1) {
						numDeck++;
						if (y > 2 && shipsPos2[y - 3][x] == 1)
							numDeck++;
					}
					if (checkedPos1[y - 1][x] == 1) {
						numDeckChecked++;
						deckPos.push([y - 1, x]);
						if (y > 1) {
							if (shipsPos2[y - 2][x] == 1) {
								if (checkedPos1[y - 2][x] == 1) {
									numDeckChecked++;
									deckPos.push([y - 2, x]);
									if (y > 2) {
										if (shipsPos2[y - 3][x] == 1) {
											if (checkedPos1[y - 3][x] == 1) {
												numDeckChecked++;
												deckPos.push([y - 3, x]);
											}
										}
									}
								}
							}
						}
					}
				}
			} else if (dir[i] == "right" && x < 7) {
				if (shipsPos2[y][x + 1] == 1) {
					numDeck++;
					if (x < 6 && shipsPos2[y][x + 2] == 1) {
						numDeck++;
						if (x < 5 && shipsPos2[y][x + 3] == 1)
							numDeck++;
					}
					if (checkedPos1[y][x + 1] == 1) {
						numDeckChecked++;
						deckPos.push([y, x + 1]);
						if (x < 6) {
							if (shipsPos2[y][x + 2] == 1) {
								if (checkedPos1[y][x + 2] == 1) {
									numDeckChecked++;
									deckPos.push([y, x + 2]);
									if (x < 5) {
										if (shipsPos2[y][x + 3] == 1) {
											if (checkedPos1[y][x + 3] == 1) {
												numDeckChecked++;
												deckPos.push([y, x + 3]);
											}
										}
									}
								}
							}
						}
					}
				}
			} else if (dir[i] == "down" && y < 7) {
				if (shipsPos2[y + 1][x] == 1) {
					numDeck++;
					if (y < 6 && shipsPos2[y + 2][x] == 1) {
						numDeck++;
						if (y < 5 && shipsPos2[y + 3][x] == 1)
							numDeck++;
					}
					if (checkedPos1[y + 1][x] == 1) {
						numDeckChecked++;
						deckPos.push([y + 1, x]);
						if (y < 6) {
							if (shipsPos2[y + 2][x] == 1) {
								if (checkedPos1[y + 2][x] == 1) {
									numDeckChecked++;
									deckPos.push([y + 2, x]);
									if (y < 5) {
										if (shipsPos2[y + 3][x] == 1) {
											if (checkedPos1[y + 3][x] == 1) {
												numDeckChecked++;
												deckPos.push([y + 3, x]);
											}
										}
									}
								}
							}
						}
					}
				}
			}
		} else if (num == 2) {
			if (dir[i] == "left" && x > 0) {
				if (shipsPos1[y][x - 1] == 1) {
					numDeck++;
					if (x > 1 && shipsPos1[y][x - 2] == 1) {
						numDeck++;
						if (x > 2 && shipsPos1[y][x - 3] == 1)
							numDeck++;
					}
					if (checkedPos2[y][x - 1] == 1) {
						numDeckChecked++;
						deckPos.push([y, x - 1]);
						if (x > 1) {
							if (shipsPos1[y][x - 2] == 1) {
								if (checkedPos2[y][x - 2] == 1) {
									numDeckChecked++;
									deckPos.push([y, x - 2]);
									if (x > 2) {
										if (shipsPos1[y][x - 3] == 1) {
											if (checkedPos2[y][x - 3] == 1) {
												numDeckChecked++;
												deckPos.push([y, x - 3]);
											}
										}
									}
								}
							}
						}
					}
				}
			} else if (dir[i] == "up" && y > 0) {
				if (shipsPos1[y - 1][x] == 1) {
					numDeck++;
					if (y > 1 && shipsPos1[y - 2][x] == 1) {
						numDeck++;
						if (y > 2 && shipsPos1[y - 3][x] == 1)
							numDeck++;
					}
					if (checkedPos2[y - 1][x] == 1) {
						numDeckChecked++;
						deckPos.push([y - 1, x]);
						if (y > 1) {
							if (shipsPos1[y - 2][x] == 1) {
								if (checkedPos2[y - 2][x] == 1) {
									numDeckChecked++;
									deckPos.push([y - 2, x]);
									if (y > 2) {
										if (shipsPos1[y - 3][x] == 1) {
											if (checkedPos2[y - 3][x] == 1) {
												numDeckChecked++;
												deckPos.push([y - 3, x]);
											}
										}
									}
								}
							}
						}
					}
				}
			} else if (dir[i] == "right" && x < 7) {
				if (shipsPos1[y][x + 1] == 1) {
					numDeck++;
					if (x < 6 && shipsPos1[y][x + 2] == 1) {
						numDeck++;
						if (x < 5 && shipsPos1[y][x + 3] == 1)
							numDeck++;
					}
					if (checkedPos2[y][x + 1] == 1) {
						numDeckChecked++;
						deckPos.push([y, x + 1]);
						if (x < 6) {
							if (shipsPos1[y][x + 2] == 1) {
								if (checkedPos2[y][x + 2] == 1) {
									numDeckChecked++;
									deckPos.push([y, x + 2]);
									if (x < 5) {
										if (shipsPos1[y][x + 3] == 1) {
											if (checkedPos2[y][x + 3] == 1) {
												numDeckChecked++;
												deckPos.push([y, x + 3]);
											}
										}
									}
								}
							}
						}
					}
				}
			} else if (dir[i] == "down" && y < 7) {
				if (shipsPos1[y + 1][x] == 1) {
					numDeck++;
					if (y < 6 && shipsPos1[y + 2][x] == 1) {
						numDeck++;
						if (y < 5 && shipsPos1[y + 3][x] == 1)
							numDeck++;
					}
					if (checkedPos2[y + 1][x] == 1) {
						numDeckChecked++;
						deckPos.push([y + 1, x]);
						if (y < 6) {
							if (shipsPos1[y + 2][x] == 1) {
								if (checkedPos2[y + 2][x] == 1) {
									numDeckChecked++;
									deckPos.push([y + 2, x]);
									if (y < 5) {
										if (shipsPos1[y + 3][x] == 1) {
											if (checkedPos2[y + 3][x] == 1) {
												numDeckChecked++;
												deckPos.push([y + 3, x]);
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
	if (numDeck == numDeckChecked) {
		if (num == 1) {
			points1 += (65 - strokeNum) * (5 - numDeck);
			var cap1Name = document.getElementById("cap1Name");
			if (lang == "РУ")
				cap1Name.innerText = "Капитан " + name1 + " (" + points1 + ")";
			else if (lang == "EN")
				cap1Name.innerText = "Captain " + name1 + " (" + points1 + ")";
		} else if (num == 2) {
			points2 += (65 - strokeNum) * (5 - numDeck);
			var cap2Name = document.getElementById("cap2Name");
			if (lang == "РУ")
				cap2Name.innerText = "Капитан " + name2 + " (" + points2 + ")";
			else if (lang == "EN")
				cap2Name.innerText = "Captain " + name2 + " (" + points2 + ")";
		}
		pointDeadCells(num, deckPos);
	}
	ctx.beginPath();
	var coef = 0;
	if (num == 1)
		coef = 11;
	ctx.moveTo((1 + coef + x) * cellSize, (1 + y) * cellSize);
	ctx.lineTo((2 + coef + x) * cellSize, (2 + y) * cellSize);
	ctx.moveTo((2 + coef + x) * cellSize, (1 + y) * cellSize);
	ctx.lineTo((1 + coef + x) * cellSize, (2 + y) * cellSize);
	ctx.closePath();
	ctx.strokeStyle = 'green';
	ctx.stroke();
}

function pointDeadCells(num, arr) {
	if (num == 1) {
		for (i = 0; i < arr.length; i++) {
			if (arr[i][1] > 0 && shipsPos2[arr[i][0]][arr[i][1] - 1] == 0 && checkedPos1[arr[i][0]][arr[i][1] - 1] == 0) {
				checkedPos1[arr[i][0]][arr[i][1] - 1] = 1;
				ctx.beginPath();
				ctx.fillStyle = 'red';
				ctx.arc((12.5 + arr[i][1] - 1) * cellSize, (1.5 + arr[i][0]) * cellSize, cellSize / 7, 0, 2 * Math.PI, false);
				ctx.fill();
				ctx.closePath();
			}
			if (arr[i][1] > 0 && arr[i][0] > 0 && shipsPos2[arr[i][0] - 1][arr[i][1] - 1] == 0 && checkedPos1[arr[i][0] - 1][arr[i][1] - 1] == 0) {
				checkedPos1[arr[i][0] - 1][arr[i][1] - 1] = 1;
				ctx.beginPath();
				ctx.fillStyle = 'red';
				ctx.arc((12.5 + arr[i][1] - 1) * cellSize, (1.5 + arr[i][0] - 1) * cellSize, cellSize / 7, 0, 2 * Math.PI, false);
				ctx.fill();
				ctx.closePath();
			}
			if (arr[i][0] > 0 && shipsPos2[arr[i][0] - 1][arr[i][1]] == 0 && checkedPos1[arr[i][0] - 1][arr[i][1]] == 0) {
				checkedPos1[arr[i][0] - 1][arr[i][1]] = 1;
				ctx.beginPath();
				ctx.fillStyle = 'red';
				ctx.arc((12.5 + arr[i][1]) * cellSize, (1.5 + arr[i][0] - 1) * cellSize, cellSize / 7, 0, 2 * Math.PI, false);
				ctx.fill();
				ctx.closePath();
			}
			if (arr[i][1] < 7 && arr[i][0] > 0 && shipsPos2[arr[i][0] - 1][arr[i][1] + 1] == 0 && checkedPos1[arr[i][0] - 1][arr[i][1] + 1] == 0) {
				checkedPos1[arr[i][0] - 1][arr[i][1] + 1] = 1;
				ctx.beginPath();
				ctx.fillStyle = 'red';
				ctx.arc((12.5 + arr[i][1] + 1) * cellSize, (1.5 + arr[i][0] - 1) * cellSize, cellSize / 7, 0, 2 * Math.PI, false);
				ctx.fill();
				ctx.closePath();
			}
			if (arr[i][1] < 7 && shipsPos2[arr[i][0]][arr[i][1] + 1] == 0 && checkedPos1[arr[i][0]][arr[i][1] + 1] == 0) {
				checkedPos1[arr[i][0]][arr[i][1] + 1] = 1;
				ctx.beginPath();
				ctx.fillStyle = 'red';
				ctx.arc((12.5 + arr[i][1] + 1) * cellSize, (1.5 + arr[i][0]) * cellSize, cellSize / 7, 0, 2 * Math.PI, false);
				ctx.fill();
				ctx.closePath();
			}
			if (arr[i][1] < 7 && arr[i][0] < 7 && shipsPos2[arr[i][0] + 1][arr[i][1] + 1] == 0 && checkedPos1[arr[i][0] + 1][arr[i][1] + 1] == 0) {
				checkedPos1[arr[i][0] + 1][arr[i][1] + 1] = 1;
				ctx.beginPath();
				ctx.fillStyle = 'red';
				ctx.arc((12.5 + arr[i][1] + 1) * cellSize, (1.5 + arr[i][0] + 1) * cellSize, cellSize / 7, 0, 2 * Math.PI, false);
				ctx.fill();
				ctx.closePath();
			}
			if (arr[i][0] < 7 && shipsPos2[arr[i][0] + 1][arr[i][1]] == 0 && checkedPos1[arr[i][0] + 1][arr[i][1]] == 0) {
				checkedPos1[arr[i][0] + 1][arr[i][1]] = 1;
				ctx.beginPath();
				ctx.fillStyle = 'red';
				ctx.arc((12.5 + arr[i][1]) * cellSize, (1.5 + arr[i][0] + 1) * cellSize, cellSize / 7, 0, 2 * Math.PI, false);
				ctx.fill();
				ctx.closePath();
			}
			if (arr[i][1] > 0 && arr[i][0] < 7 && shipsPos2[arr[i][0] + 1][arr[i][1] - 1] == 0 && checkedPos1[arr[i][0] + 1][arr[i][1] - 1] == 0) {
				checkedPos1[arr[i][0] + 1][arr[i][1] - 1] = 1;
				ctx.beginPath();
				ctx.fillStyle = 'red';
				ctx.arc((12.5 + arr[i][1] - 1) * cellSize, (1.5 + arr[i][0] + 1) * cellSize, cellSize / 7, 0, 2 * Math.PI, false);
				ctx.fill();
				ctx.closePath();
			}
		}
	}
	else if (num == 2) {
		for (i = 0; i < arr.length; i++) {
			if (arr[i][1] > 0 && shipsPos1[arr[i][0]][arr[i][1] - 1] == 0 && checkedPos2[arr[i][0]][arr[i][1] - 1] == 0) {
				checkedPos2[arr[i][0]][arr[i][1] - 1] = 1;
				ctx.beginPath();
				ctx.fillStyle = 'red';
				ctx.arc((1.5 + arr[i][1] - 1) * cellSize, (1.5 + arr[i][0]) * cellSize, cellSize / 7, 0, 2 * Math.PI, false);
				ctx.fill();
				ctx.closePath();
			}
			if (arr[i][1] > 0 && arr[i][0] > 0 && shipsPos1[arr[i][0] - 1][arr[i][1] - 1] == 0 && checkedPos2[arr[i][0] - 1][arr[i][1] - 1] == 0) {
				checkedPos2[arr[i][0] - 1][arr[i][1] - 1] = 1;
				ctx.beginPath();
				ctx.fillStyle = 'red';
				ctx.arc((1.5 + arr[i][1] - 1) * cellSize, (1.5 + arr[i][0] - 1) * cellSize, cellSize / 7, 0, 2 * Math.PI, false);
				ctx.fill();
				ctx.closePath();
			}
			if (arr[i][0] > 0 && shipsPos1[arr[i][0] - 1][arr[i][1]] == 0 && checkedPos2[arr[i][0] - 1][arr[i][1]] == 0) {
				checkedPos2[arr[i][0] - 1][arr[i][1]] = 1;
				ctx.beginPath();
				ctx.fillStyle = 'red';
				ctx.arc((1.5 + arr[i][1]) * cellSize, (1.5 + arr[i][0] - 1) * cellSize, cellSize / 7, 0, 2 * Math.PI, false);
				ctx.fill();
				ctx.closePath();
			}
			if (arr[i][1] < 7 && arr[i][0] > 0 && shipsPos1[arr[i][0] - 1][arr[i][1] + 1] == 0 && checkedPos2[arr[i][0] - 1][arr[i][1] + 1] == 0) {
				checkedPos2[arr[i][0] - 1][arr[i][1] + 1] = 1;
				ctx.beginPath();
				ctx.fillStyle = 'red';
				ctx.arc((1.5 + arr[i][1] + 1) * cellSize, (1.5 + arr[i][0] - 1) * cellSize, cellSize / 7, 0, 2 * Math.PI, false);
				ctx.fill();
				ctx.closePath();
			}
			if (arr[i][1] < 7 && shipsPos1[arr[i][0]][arr[i][1] + 1] == 0 && checkedPos2[arr[i][0]][arr[i][1] + 1] == 0) {
				checkedPos2[arr[i][0]][arr[i][1] + 1] = 1;
				ctx.beginPath();
				ctx.fillStyle = 'red';
				ctx.arc((1.5 + arr[i][1] + 1) * cellSize, (1.5 + arr[i][0]) * cellSize, cellSize / 7, 0, 2 * Math.PI, false);
				ctx.fill();
				ctx.closePath();
			}
			if (arr[i][1] < 7 && arr[i][0] < 7 && shipsPos1[arr[i][0] + 1][arr[i][1] + 1] == 0 && checkedPos2[arr[i][0] + 1][arr[i][1] + 1] == 0) {
				checkedPos2[arr[i][0] + 1][arr[i][1] + 1] = 1;
				ctx.beginPath();
				ctx.fillStyle = 'red';
				ctx.arc((1.5 + arr[i][1] + 1) * cellSize, (1.5 + arr[i][0] + 1) * cellSize, cellSize / 7, 0, 2 * Math.PI, false);
				ctx.fill();
				ctx.closePath();
			}
			if (arr[i][0] < 7 && shipsPos1[arr[i][0] + 1][arr[i][1]] == 0 && checkedPos2[arr[i][0] + 1][arr[i][1]] == 0) {
				checkedPos2[arr[i][0] + 1][arr[i][1]] = 1;
				ctx.beginPath();
				ctx.fillStyle = 'red';
				ctx.arc((1.5 + arr[i][1]) * cellSize, (1.5 + arr[i][0] + 1) * cellSize, cellSize / 7, 0, 2 * Math.PI, false);
				ctx.fill();
				ctx.closePath();
			}
			if (arr[i][1] > 0 && arr[i][0] < 7 && shipsPos1[arr[i][0] + 1][arr[i][1] - 1] == 0 && checkedPos2[arr[i][0] + 1][arr[i][1] - 1] == 0) {
				checkedPos2[arr[i][0] + 1][arr[i][1] - 1] = 1;
				ctx.beginPath();
				ctx.fillStyle = 'red';
				ctx.arc((1.5 + arr[i][1] - 1) * cellSize, (1.5 + arr[i][0] + 1) * cellSize, cellSize / 7, 0, 2 * Math.PI, false);
				ctx.fill();
				ctx.closePath();
			}
		}
	}
}

function victory(num) {
	ifGame = false;
	var mainMenuBut = document.getElementById("mainMenu");
	mainMenuBut.style.visibility = "hidden";
	var pts = " очков!";
	var modal = document.getElementById('result');
	var resultText = document.getElementById('resultText');
	var resTxt = document.createElement("h1");
	resTxt.textAlign = "center";
	allRecords.sort( (a, b) => b[0] - a[0] );
	if (num == 1) {
		if (points1 % 10 == 1 && points1 % 100 != 11)
			pts = " очко!";
		else if (points1 % 10 > 1 && points1 % 10 < 5 && (points1 % 100 > 14 || points1 % 100 < 12))
			pts = " очка!";
		if (lang == "РУ")
			resTxt.innerHTML = "Капитан " + name1 + " побеждает!<br/>Его результат: " + points1 + pts;
		else if (lang == "EN") {
			if (points1 % 10 == 1)
				resTxt.innerHTML = "Captain " + name1 + " wins!<br/>Result: " + points1 + " point";
			else
				resTxt.innerHTML = "Captain " + name1 + " wins!<br/>Result: " + points1 + " points";
		}
		if (points1 > allRecords[allRecords.length - 1][0]) {
			allRecords.pop();
			allRecords.push([points1, name1]);
			allRecords.sort( (a, b) => b[0] - a[0] );
			window.localStorage.setItem('records', allRecords);
		}
	}
	else if (num == 2) {
		if (points2 % 10 == 1 && points2 % 100 != 11)
			pts = " очко!";
		else if (points2 % 10 > 1 && points2 % 10 < 5 && (points2 % 100 > 14 || points2 % 100 < 12))
			pts = " очка!";
		if (lang == "РУ")
			resTxt.innerHTML = "Капитан " + name2 + " побеждает!<br/>Его результат: " + points2 + pts;
		else if (lang == "EN") {
			if (points1 % 10 == 1)
				resTxt.innerHTML = "Captain " + name2 + " wins!<br/>Result: " + points2 + " point";
			else
				resTxt.innerHTML = "Captain " + name2 + " wins!<br/>Result: " + points2 + " points";
		}
		if (points2 > allRecords[allRecords.length - 1][0]) {
			allRecords.pop();
			allRecords.push([points2, name2]);
			allRecords.sort( (a, b) => b[0] - a[0] );
			window.localStorage.setItem('records', allRecords);
		}
	}
	resultText.appendChild(resTxt);
	var vic = document.getElementById("vic");
	var newGame = document.getElementById("newGame");
	if (lang == "EN") {
		vic.innerText = "Victory!";
		newGame.innerText = "MAIN MENU";
	}
	else if (lang == "РУ") {
		vic.innerText = "Победа!";
		newGame.innerText = "ГЛАВНОЕ МЕНЮ";
	}
	modal.style.display = "block";
}

function newGame() {
	document.location.href = "../index.html";
}
