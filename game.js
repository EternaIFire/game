// 0.0.2

let WIDTH = 700, HEIGHT = 500;
let buttonDimX = 165, buttonDimY = 47, screen = 0, time = 0;
let timeStarted = Date.now(), menu = [];
let onTransition = false;
let backButton, playImg, creditsImg, transition, fps, player, level, scrollX, scrollY, dir, center;

class Player {
	update = () => {	
		this.velY += 0.2;
		this.posY += this.velY;
		this.falling++;
		
		this.velX *= 0.78;	
		this.posX += this.velX;
		
		while (!touchingGround()) {
			this.posY -= 0.2;
			this.velY = 0;
			this.falling = 0;
		}
		
		if (keyIsDown(LEFT_ARROW)) {
			this.velX -= 1.5;
			dir = -90;
		}
		
		if (keyIsDown(RIGHT_ARROW)) {
			this.velX += 1.5;
			dir = 90;
		}
		
		if (keyIsDown(UP_ARROW) && this.falling < 4) this.velY = -6;

		if (this.posY > 500) reset();
		scrollX += (this.posX + center - scrollX) * 0.3;
		center += ((dir / 2) - center) * 0.3;
	}

	draw = () => {
		fill(64);
		rect(this.posX - scrollX + WIDTH / 2, this.posY, 30, 50);
	}
	
	constructor(posX, posY) {
		this.falling = 0;
		this.velX = 0;
		this.velY = 0;
		this.posX = posX;
		this.posY = posY;
	}
}

function SceneTransition() {
	this.y = -HEIGHT;
	
	this.update = () => {
		this.y += 30;
		
		if (this.y >= HEIGHT) {
			transition = undefined;
			onTransition = false;
			time = 0;
		}
	}
	
	this.render = () => {
		this.update();

		fill(0);
		rect(WIDTH / 2, this.y, WIDTH, HEIGHT);
	}
}

function ButtonTransition(finalX_, delay_) {
	this.x = -buttonDimX;
	this.finalX = finalX_;
	this.delay = delay_;
	
	this.setDelay = del => {
		this.delay = del;
		return this;
	}
	
	this.update = () => {
		if (this.x !== this.finalX && Date.now() - timeStarted > this.delay) this.x += (this.finalX - this.x) / 20;		
		return this.x;
	}
}

function MenuItem(x_, y_, ySpeed_, yPower_, img_, id_) {
	this.dimX = buttonDimX;
	this.dimY = buttonDimY;
	this.x = x_;
	this.y = y_;
	this.ySpeed = ySpeed_;
	this.yPower = yPower_;
	this.img = img_;
	this.id = id_;
	this.yPos = this.y;
	this.xPos = 0;
	this.tint = false;
	
	this.clicked = () => {
		if (this.id === 2) {
			reset();
			handleTransition(1);
		} else if (this.id === 3) {
			handleTransition(2)
		} else if (this.id === 4) {
			handleTransition(0);
		}
	}
	
	this.update = () => {
		this.xPos = (typeof this.x === "number") ? this.x : this.x.update();
		this.yPos = this.y + sin(frameCount * this.ySpeed) * this.yPower;
	}
	
	this.render = () => {
		this.update();
		
		push();
		if (this.tint) tint(255, 127);
		this.img.resize(this.dimX, this.dimY);
		translate(this.xPos, this.yPos);
		rotate(PI / 180 * sin(frameCount / 25) * 2);
		imageMode(CENTER);
		image(this.img, 0, 0, 0, 0);
		pop();
		
		if (mouseX >= this.xPos - this.dimX / 2 && mouseX <= this.xPos + this.dimX / 2 && mouseY >= this.y - this.dimY / 3 && mouseY <= this.yPos + this.dimY / 5) {
			this.tint = true;
			
			if (mouseIsPressed) {
				this.clicked();
			}
		} else {
			if (this.tint) this.tint = false;
		}
	}
}

sceneTransition = () => {
	onTransition = true;
	transition = new SceneTransition();
}

handleTransition = (screen_) => {
	if (!onTransition) {
		sceneTransition();
		time = 18000 / round(getFrameRate());
	}
	
	setTimeout(() => {
		screen = screen_;
	}, time);
}

makeButtonTransition = (pos, delay) => {
	return new ButtonTransition(pos, delay);
}

preload = () => {
	playImg = loadImage("https://cors-anywhere.herokuapp.com/https://eternaifire.github.io/game/play.svg");
	creditsImg = loadImage("https://cors-anywhere.herokuapp.com/https://eternaifire.github.io/game/credits.svg");
}

setup = () => {
	reset();
	noStroke();
	rectMode(CENTER);
	menu.push(new MenuItem(makeButtonTransition(WIDTH / 2, 0), 100, 0.05, 10, playImg, 1));
	menu.push(new MenuItem(makeButtonTransition(WIDTH / 2, 500), 250, 0.05, 10, playImg, 2));
	menu.push(new MenuItem(makeButtonTransition(WIDTH / 2, 1000), 350, 0.05, 10, creditsImg, 3));
	backButton = new MenuItem(WIDTH / 2, 50, 0.05, 10, playImg, 4);	
	createCanvas(WIDTH, HEIGHT);
}

reset = () => {
	scrollX = 0;
	scrollY = 0;
	dir = 90;
	center = 0;
	player = new Player(0, -50);
}

renderGame = () => {
	player.update();
	drawGround();
	player.draw();
}

drawGround = () => {
	fill(255);
	rect(WIDTH / 2 - scrollX, 350 - scrollY, 500, 50);
}

touchingGround = () => {
	return player.posY <= 300;
}

draw = () => {
	background(52, 166, 251);

	menu.forEach((item) => {	
		if (screen === 0) {
			item.render();
		} else {
			item.update();
		}
	});
	
	if (screen === 1) {
		renderGame();
		backButton.render();
	} else if (screen === 2) {
		textAlign(CENTER);
		textSize(50);
		text("MADE BY BONFIRE\n AND ETERNITY", WIDTH / 2, HEIGHT / 2);
		backButton.render();
	}
	
	if (transition) transition.render();
}
