import { elements } from "./elements.js";

let turn = "x";

let shape = {
	x: "x",
	o: "o",
};

let shapeColor = {
	x: "#007bff",
	o: "#f71012",
};

let allSpots = document.querySelectorAll(".spot");

let markedSpots = 0;
let recentSpot;
let recentShape;
let over = false;
let xScore = 0;
let yScore = 0;

let relations = {
	spot1: {
		nx: "spot2",
		nnx: "spot3",
		ny: "spot4",
		nny: "spot7",
		nxy: "spot5",
		nnxy: "spot9",
	},

	spot2: {
		nx: "spot3",
		nnx: "spot1",
		ny: "spot5",
		nny: "spot8",
		nxy: null,
		nnxy: null,
	},

	spot3: {
		nx: "spot1",
		nnx: "spot2",
		ny: "spot6",
		nny: "spot9",
		nxy: "spot5",
		nnxy: "spot7",
	},

	spot4: {
		nx: "spot5",
		nnx: "spot6",
		ny: "spot7",
		nny: "spot1",
		nxy: null,
		nnxy: null,
	},

	spot5: {
		nx: "spot6",
		nnx: "spot4",
		ny: "spot8",
		nny: "spot2",
		nxy: "spot9",
		nnxy: "spot1",
		nxy2: "spot7",
		nnxy2: "spot3",
	},

	spot6: {
		nx: "spot4",
		nnx: "spot5",
		ny: "spot9",
		nny: "spot3",
		nxy: null,
		nnxy: null,
	},

	spot7: {
		nx: "spot8",
		nnx: "spot9",
		ny: "spot1",
		nny: "spot4",
		nxy: "spot3",
		nnxy: "spot5",
	},

	spot8: {
		nx: "spot9",
		nnx: "spot7",
		ny: "spot2",
		nny: "spot5",
		nxy: null,
		nnxy: null,
	},

	spot9: {
		nx: "spot7",
		nnx: "spot8",
		ny: "spot3",
		nny: "spot6",
		nxy: "spot1",
		nnxy: "spot5",
	},
};

let winningSpots = [];
let strikeStyle;
let winningShape;

let winAnimation = ` winningAnimation 450ms ease-in 3 `;

let diagRelElements = ["spot1", "spot3", "spot7", "spot9", "spot5"];
let centerElement = ["spot5"];

setTurn();

elements.gameBoard.addEventListener("click", (event) => {
	if (
		event.target.classList.contains("spot") &&
		!event.target.classList.contains("marked")
	) {
		//to draw where the user clicks
		drawShape(event.target);

		//to mark the drawn spot
		markSpot(event.target);

		//to update the turn
		updateTurn();

		//to change the side after each turn
		changeSide();

		//to see if the game is over
		checkIfOver();
	}
});

function drawShape(spot) {
	spot.innerHTML = `<span class = "shape-gameboard shape-gameboard-${shape[turn]}">${shape[turn]}</span>`;
}

function markSpot(spot) {
	spot.classList.add("marked");
	recentSpot = spot.id;
	recentShape = spot.innerText;
}

function updateTurn() {
	if (turn === "x") {
		turn = "o";
		setTurn();
	} else {
		turn = "x";
		setTurn();
	}
}

function changeSide(side) {
	if (arguments.length > 0) {
		if (side === "x") {
			elements.ticSide.classList.add("turn-player");
			elements.tacSide.classList.remove("turn-player");
		} else {
			elements.ticSide.classList.remove("turn-player");
			elements.tacSide.classList.add("turn-player");
		}
	} else {
		elements.tacSide.classList.toggle("turn-player");
		elements.ticSide.classList.toggle("turn-player");
	}
}

function setTurn() {
	elements.turn.querySelector(".turn-shape").innerText = turn;
	elements.turn.querySelector(".turn-shape").style.color = shapeColor[turn];
}

function checkIfOver() {
	let result = checkIfWon(recentSpot);

	if (result) {
		winningSpots = result.slice(0, 3);

		//strikeStyle = result[3];
		winningShape = recentShape;

		gameOver("win", winningShape);
	} else {
		markedSpots++;
		if (markedSpots === 9 && !over) {
			gameOver("draw");
		}
	}
}

function checkIfWon(recentSpot) {
	if (
		document
			.getElementById(relations[recentSpot].nx)
			.classList.contains("marked") &&
		document
			.getElementById(relations[recentSpot].nnx)
			.classList.contains("marked")
	) {
		if (
			document.getElementById(relations[recentSpot].nx).innerText ===
				recentShape &&
			document.getElementById(relations[recentSpot].nnx).innerText ===
				recentShape
		) {
			return [
				recentSpot,
				relations[recentSpot].nx,
				relations[recentSpot].nnx,
				"horizontal",
			];
		}
	}

	if (
		document
			.getElementById(relations[recentSpot].ny)
			.classList.contains("marked") &&
		document
			.getElementById(relations[recentSpot].nny)
			.classList.contains("marked")
	) {
		if (
			document.getElementById(relations[recentSpot].ny).innerText ===
				recentShape &&
			document.getElementById(relations[recentSpot].nny).innerText ===
				recentShape
		) {
			return [
				recentSpot,
				relations[recentSpot].ny,
				relations[recentSpot].nny,
				"vertical",
			];
		}
	}

	if (diagRelElements.indexOf(recentSpot) > -1) {
		if (
			document
				.getElementById(relations[recentSpot].nxy)
				.classList.contains("marked") &&
			document
				.getElementById(relations[recentSpot].nnxy)
				.classList.contains("marked")
		) {
			if (
				document.getElementById(relations[recentSpot].nxy).innerText ===
					recentShape &&
				document.getElementById(relations[recentSpot].nnxy)
					.innerText === recentShape
			) {
				return [
					recentSpot,
					relations[recentSpot].nxy,
					relations[recentSpot].nnxy,
					"diagonalOne",
				];
			}
		}
	}

	if (centerElement.indexOf(recentSpot) > -1) {
		if (
			document
				.getElementById(relations[recentSpot].nxy2)
				.classList.contains("marked") &&
			document
				.getElementById(relations[recentSpot].nnxy2)
				.classList.contains("marked")
		) {
			if (
				document.getElementById(relations[recentSpot].nxy2)
					.innerText === recentShape &&
				document.getElementById(relations[recentSpot].nnxy2)
					.innerText === recentShape
			) {
				return [
					recentSpot,
					relations[recentSpot].nxy2,
					relations[recentSpot].nnxy2,
					"diagonalTwo",
				];
			}
		}
	}
}

function gameOver(message, winningShape) {
	over = true;

	if (message === "win") {
		//to mark which spots made the game over
		markWinningSpots();

		//to show who won
		showResult("win");

		if (winningShape === "x") {
			//to update the score
			updateScore(++xScore, yScore);

			//to give x the first move since it won
			turn = "x";

			setTurn();

			changeSide(winningShape);
		} else {
			updateScore(xScore, ++yScore);

			//to give o the first move since it won
			turn = "o";

			setTurn();

			changeSide(winningShape);
		}
	} else if (message === "draw") {
		//to mark all the spots to say that the game is draw
		markAllSpots();

		//to show the result
		showResult("draw");
	}

	//to reset the board after the game is over
	resetBoard(2300);

	//to reset the whole game and a few variables
	resetGame();
}

function showResult(message) {
	if (message === "win") {
		if (winningShape === "x") {
			document.querySelector(".tic-winning-tag").classList.add("show");
		} else {
			document.querySelector(".tac-winning-tag").classList.add("show");
		}
	} else if (message === "draw") {
		document.querySelector(".draw-tag").classList.add("show");
	}
}

function updateScore(xScoreUpdated, yScoreUpdated) {
	elements.ticScore.innerText = xScoreUpdated;
	elements.tacScore.innerText = yScoreUpdated;
}

function markWinningSpots() {
	// if (strikeStyle === "horizontal") {
	// 	winningSpots.forEach((spot) => {
	// 		document.getElementById(spot).classList.add("horizontal");
	// 	});
	// } else if (strikeStyle === "vertical") {
	// 	winningSpots.forEach((spot) => {
	// 		document.getElementById(spot).classList.add("vertical");
	// 	});
	// } else if (strikeStyle === "diagonalOne") {
	// 	winningSpots.forEach((spot) => {
	// 		document.getElementById(spot).classList.add("diagonalOne");
	// 	});
	// } else if (strikeStyle === "diagonalTwo") {
	// 	winningSpots.forEach((spot) => {
	// 		document.getElementById(spot).classList.add("diagonalTwo");
	// 	});
	// }

	winningSpots.forEach((spot) => {
		document.getElementById(
			spot
		).children[0].style.animation = winAnimation;
	});
}

function markAllSpots() {
	allSpots.forEach((spot) => {
		spot.children[0].style.animation = winAnimation;
	});
}

function resetBoard(timer) {
	setTimeout(function () {
		allSpots.forEach((spot) => {
			spot.innerText = null;
			spot.classList.remove("marked");
		});

		//to hide the result
		hideResult();
	}, timer);
}

function hideResult() {
	document.querySelector(".tic-winning-tag").classList.remove("show");
	document.querySelector(".tac-winning-tag").classList.remove("show");
	document.querySelector(".draw-tag").classList.remove("show");
}

function resetGame() {
	markedSpots = 0;
	recentSpot = null;
	winningShape = null;
	recentShape = null;
	over = false;
}

elements.resetButton.addEventListener("click", () => {
	updateScore(0, 0);
	resetBoard(0);
	resetGame();
});

function resetScore() {
	xScore = 0;
	yScore = 0;
}
