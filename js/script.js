var canvas, ctx, WIDTH, HEIGHT, FPS = 15, tileSize, playing, running, score = 0;
var snake, playLabel, food;
var touch = [], offset = [];
		
window.addEventListener("touchstart", touchStart);
window.addEventListener("touchmove", touchMove);
window.addEventListener("touchend", touchEnd);

window.addEventListener("keydown", keyDown);
window.addEventListener("orientationchange", changeOrientation);
window.addEventListener("resizewindow", resizeWindow);

var keys = {
	KEY_UP: 38,
	KEY_DOWN: 40,
	KEY_RIGHT: 39,
	KEY_LEFT: 37
};

function isLandscape() {
	if (screen.orientation)
		return (screen.orientation.type == "landscape-primary" || screen.orientation.type == "landscape-secondary");
		return (WIDTH > HEIGHT);
	}

function PlayLabel() {
	this.factor = 1.5;
	this.color = "#5D8357";
	this.font = tileSize * this.factor + "pt Arial";
	this.text;

	this.messages = [];

	this.messages["portrait"] = "Rotacione seu dispositivo para poder jogar";
	this.messages["touchToPlay"] = "Toque na tela para jogar";
	this.messages["pressEnter"] = "Pressione as setas para jogar";

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
	if (!isLandscape())
		this.text = this.messages["portrait"];
	else
		this.text = this.messages["touchToPlay"];
    }
	else
		this.text = this.messages["pressEnter"];

		this.setText = function(key) {
		this.text = this.messages[key];
	}
	this.update = function() {
	this.font = tileSize * this.factor + "pt Arial";
	}

	this.draw = function() {
	ctx.fillStyle = this.color;
				ctx.font = this.font;
				ctx.fillText(this.text, WIDTH / 2 - (ctx.measureText(this.text).width / 2), HEIGHT / 2);
			}
		}

		function changeOrientation(e) {
			resizeWindow();

			if (isLandscape())
				playLabel.setText("touchToPlay");

			else if (!playing)  {
				playLabel.setText("portrait");
			}

			else {
				playing = false;
				playLabel.setText("portrait");
			}			
		}

		//função para redimensionar a tela. windows
		function resizeWindow(){
			WIDTH = window.innerWidth;
			HEIGHT = window.innerHeight;

			canvas.width = WIDTH;
			canvas.height = HEIGHT;

			tileSize = Math.max(Math.floor(WIDTH / 60), Math.floor(HEIGHT / 60));
		}

function touchEnd(e){
	if(!playing)
		return;
	if(Math.abs(offset[0]) > Math.abs(offset[1]))
		snake.direction = [offset[0] / Math.abs(offset[0]), 0];
	else
		snake.direction = [0, offset[1] / Math.abs(offset[1])];
	}

function touchMove(e){
	if(!playing)
		return;

		var t = e.touches[0];
		offset = [t.pageX - touch[0], t.pageY - touch[1]];
	}

//função para a movimentação do snake(inputs no celular)
function touchStart(e){
	e.preventDefault();

	var t = e.touches[0];
	touch = [t.pageX, t.pageY];

	if(!playing){
	if(screen.orientation && isLandscape()){
		document.documentElement.webkitRequestFullscreen();
		screen.orientation.lock("landscape");
			}
		if(isLandscape())
			playing = true;
		}
	}

		function keyDown(e) {
			if (!playing) {
				if (e.keyCode == keys.KEY_UP || e.keyCode == keys.KEY_DOWN || e.keyCode == keys.KEY_LEFT || e.keyCode == keys.KEY_RIGHT)
					playing = true;
				else
					return;
			}

			switch(e.keyCode) {
				case keys.KEY_UP:
					snake.direction = [0, -1];
					break;

				case keys.KEY_DOWN:
					snake.direction = [0, 1];
					break;

				case keys.KEY_LEFT:
					snake.direction = [-1, 0];
					break;

				case keys.KEY_RIGHT:
					snake.direction = [1, 0];
					break;
			}
		}

		//Função para gerar aleateriamento a fruta na tela
		function Food() {
			this.color = "#ff0000",
			this.position = [Math.floor(Math.random() * (WIDTH / tileSize)), Math.floor(Math.random() * (HEIGHT / tileSize))];

			for (var i = 0; i < snake.body.length; i++) {
				while (this.position[0] == snake.body[i][0] && this.position[1] == snake.body[i][1])
					this.position = [Math.floor(Math.random() * (WIDTH / tileSize)), Math.floor(Math.random() * (HEIGHT / tileSize))];
			}

			this.draw = function() {
				ctx.fillStyle = this.color;
				ctx.fillRect(this.position[0] * tileSize, this.position[1] * tileSize, tileSize, tileSize);
			}
		}
		
//Função snake
function Snake() {
	this.body = [[10, 10], [10, 11], [10, 12]],
	this.direction = [0, -1],
	this.color = "#000";

	this.update = function() {
	var nextPos = [this.body[0][0] + this.direction[0], this.body[0][1] + this.direction[1]];

	if (!playing) {
		if(snake.direction[1] == -1 && nextPos[1] <= Math.floor(HEIGHT * 0.1 / tileSize)) 
			snake.direction = [1, 0];	 

		else if (snake.direction[0] == 1 && nextPos[0] >= Math.floor(WIDTH * 0.9 / tileSize)) 
			snake.direction = [0, 1];	 

		else if (snake.direction[1] == 1 && nextPos[1] >= Math.floor(HEIGHT * 0.9 / tileSize)) 
			snake.direction = [-1, 0];

		else if (snake.direction[0] == -1 && nextPos[0] <= Math.floor(WIDTH * 0.1 / tileSize)) 
			snake.direction = [0, -1];
	} 

	if (nextPos[0] == this.body[1][0] && nextPos[1] == this.body[1][1]) {
		this.body.reverse();
		nextPos = [this.body[0][0] + this.direction[0], this.body[0][1] + this.direction[1]];
	}
		this.body.pop();
		this.body.splice(0, 0, nextPos);
	}
	    this.draw = function() {
		ctx.fillStyle = this.color;
			for (var i = 0; i < this.body.length; i++)
				ctx.fillRect(this.body[i][0] * tileSize, this.body[i][1] * tileSize, tileSize, tileSize);
			}
		}

		function newGame(){
			snake = new Snake();
			food = new Food();
			playLabel =  new PlayLabel();
			this.score = 0;
			this.FPS = 15;
			changeScore();	

			playing = false;
		}
//função que inicia, (quadrado tela)
function init(){
	canvas = document.createElement("canvas");
	document.body.appendChild(canvas); //adicinando no body
	ctx = canvas.getContext("2d"); //desenhando na tela

	running = true;
	resizeWindow();

	newGame();
		requestAnimationFrame(run);
	}

	var lastTime = 0, dt = 0, lag = 0;

function run(time) {
	dt = time - lastTime;
	lastTime = time;

	if (running) {
    	lag += dt;

	while (lag >= 1000 / FPS) { 
		update();
			lag -= 1000 / FPS;
		}
	}
	draw();	
		requestAnimationFrame(run);
	}

		function update() {
			snake.update();
			playLabel.update();

// colide comigo mesmo
for (var i = 1; i < snake.body.length; i++) {
	if (snake.body[0][0] == snake.body[i][0] && snake.body[0][1] == snake.body[i][1]) {
		gameOver();
		newGame();
	}
}

// colide com os cantos
if (snake.body[0][0] < 0 || snake.body[0][0] * tileSize > WIDTH || snake.body[0][1] < 0 || snake.body[0][1] * tileSize > HEIGHT) {
	gameOver();
	newGame();
} 
			
// colide com a comida
if (snake.body[0][0] == food.position[0] && snake.body[0][1] == food.position[1]) {
	snake.body.splice(snake.body.length - 1, 0, [snake.body[snake.body.length - 1]]);
	food = new Food();
	this.score++;
	this.FPS += 2;
	changeScore();
	}
}

function changeScore() {
	document.getElementById("score").innerHTML = this.score;
}

function draw() {
	ctx.clearRect(0, 0, WIDTH, HEIGHT);
		snake.draw();
		food.draw();
	if (!playing)
		playLabel.draw();
	}
	init();
function gameOver() {
	document.getElementById("scoreFinal").innerHTML = this.score;
	document.getElementById("gameover").style.display = "inherit";
	setTimeout(function() {document.getElementById("gameover").style.display = "none";}, 6000);
}