; (function() {
	var Game = function(canvasId){
		var canvas = document.getElementById(canvasId);
		var screen = canvas.getContext("2d");
		var scoreText = document.getElementById("scoreText");
		var gameSize = {
			width:canvas.width,
			height:canvas.height
		};
		this.score = 0;
		this.scoreIncr = 10;
		this.timer = 0;
		this.bodies = [new Player(this,gameSize), new Food(this,gameSize)];
		var self = this;
		var tick = function() {
			self.update();
			self.draw(screen, gameSize);
			requestAnimationFrame(tick);
		};

		tick();
	};

	Game.prototype = {
		update:function(){

			if (this.bodies[0].position.x<0 ||
				this.bodies[0].position.y<0 ||
				this.bodies[0].position.x>784 ||
				this.bodies[0].position.y>584 ){
				this.bodies[0] = new GameOver(this,this.gameSize,this.score);
			}
			if (isEaten(this.bodies[0], this.bodies[1])){
				this.bodies[1] = new Food(this,this.gameSize);
				this.score+=this.scoreIncr;
				scoreText.innerHTML = this.score;
			}
			for (var i =0 ; i< this.bodies.length; i++) {
				this.bodies[i].update();
			}
			if (this.timer>1500 ){
				this.timer = 0;
				this.scoreIncr*=2;

			}
			this.timer++;


		},
		draw:function(screen,gameSize){
			clearCanvas(screen,gameSize);
			for (var i = this.bodies.length - 1; i >= 0; i--) {
				drawRect(screen,this.bodies[i]);
			}
		},

	};

	var Food = function(game, gameSize){
		this.size = {
			width:32,
			height:32
		};
		this.position = {
			x:Math.round(Math.random()*24)*32,
			y:Math.round(Math.random()*17)*32,
		};
		console.log(this.position);
	};

	Food.prototype = {
		update:function(){}
	};

	var Player = function(game,gameSize){
		this.timeStep = 32;
		this.speed = 32;
		this.timer=0;
		this.position = {
			x:384,
			y:288
		};
		this.size = {
			width:32,
			height:32
		};
		this.velocity = {
			x:this.speed,
			y:0
		};
		this.keyboarder = new Keyboarder();
		this.color = "red";

	};

	Player.prototype = {
		update:function(){
			if (this.timer>1500){
				this.timeStep/=2;
				console.log(this.timeStep);
				this.timer = 0;
			}

			if(this.keyboarder.isDawn(this.keyboarder.KEYS.LEFT)){
				this.velocity.x = -this.speed;
				this.velocity.y = 0;
			}
			if(this.keyboarder.isDawn(this.keyboarder.KEYS.RIGHT)){
				this.velocity.x = this.speed;
				this.velocity.y = 0;
			}
			if(this.keyboarder.isDawn(this.keyboarder.KEYS.UP)){
				this.velocity.x = 0;
				this.velocity.y = -this.speed;
			}
			if(this.keyboarder.isDawn(this.keyboarder.KEYS.DOWN)){
				this.velocity.x = 0;
				this.velocity.y = this.speed;
			}
			if (this.timer%this.timeStep===0){
				this.position.x +=this.velocity.x;
				this.position.y +=this.velocity.y;
			}
			this.timer++;


		}
	};


	var GameOver = function(game, gameSize, score) {
		this.game = game;
		this.size = {
			width:800,
			height:600,
		};
		this.score =score;
		this.color = "#d55";
		this.text = "You lost! Your score is:";
		this.position = {
			x:0, 
			y:0
		};
	};

	GameOver.prototype = {
		update: function() {
			this.timer++;
			if(this.timer%60 ===0){
				console.log("GG WP");
			}
		}
	};



	var Keyboarder = function() {
		var keyState = {};

		window.onkeydown = function(e){
			keyState[e.keyCode] = true;
		};
			window.onkeyup = function(e) {
			keyState[e.keyCode] = false;
		};

		this.isDawn = function(keyCode) {
			return keyState[keyCode]===true;
		};

		this.KEYS = {
			LEFT:37,
			RIGHT:39,
			UP:38,
			DOWN:40
		};


	};

	var isEaten = function(b1,b2){
		return (b1.position.x === b2.position.x &&
				b1.position.y === b2.position.y);
	};

	var drawRect = function(screen, body) {

		screen.fillStyle = body.color || "#909";
		screen.fillRect(body.position.x, body.position.y, body.size.width, body.size.height);
		if (body.text!==undefined){
			screen.fillStyle = "#d22";
			screen.font = "30px Arial";
			screen.fillText(body.text, 250,200);
			screen.fillText(body.score, 390,300);
		}
	};
	var clearCanvas = function(screen,gameSize){
		screen.clearRect(0,0,gameSize.width,gameSize.height);
	};

	window.onload = (function(){
		new Game("canvas");
	});

}());