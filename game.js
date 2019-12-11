// 0.0.2

let WIDTH = 700, HEIGHT = 500;
let buttonDimX = 200, buttonDimY = 150, screen = 0, time = 0;
let timeStarted = Date.now(), menu = [];
let onTransition = false;
let backButton, img, transition, fps;

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
		rect(0, this.y, WIDTH, HEIGHT);
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
		
		if (mouseX >= this.xPos - this.dimX / 2 && mouseX <= this.xPos + this.dimX / 2 && mouseY >= this.y - this.dimY / 3 && mouseY <= this.yPos + this.dimY / 5) {
			this.tint = true;
			
			if (mouseIsPressed) {
				this.clicked();
			}
		} else {
			if (this.tint) this.tint = false;
		}
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
	img = loadImage("https://cors-anywhere.herokuapp.com/http://pixelartmaker.com/art/9b4cf54d4690c1d.png");
}

setup = () => {
	menu.push(new MenuItem(makeButtonTransition(WIDTH / 2, 0), 100, 0.05, 10, img, 1));
	menu.push(new MenuItem(makeButtonTransition(WIDTH / 2, 500), 250, 0.05, 10, img, 2));
	menu.push(new MenuItem(makeButtonTransition(WIDTH / 2, 1000), 350, 0.05, 10, img, 3));
	backButton = new MenuItem(WIDTH / 2, 50, 0.05, 10, img, 4);	
	createCanvas(WIDTH, HEIGHT);
}

draw = () => {
	background(250);
	
	menu.forEach((item) => {	
		if (screen == 0) {
			item.render();
		} else {
			item.update();
		}
	});
	
	if (screen == 1) {
		backButton.render();
		textAlign(CENTER);
		textSize(50);
		text("GAME", WIDTH / 2, HEIGHT / 2);
	} else if (screen == 2) {
		backButton.render();
		textAlign(CENTER);
		textSize(50);
		text("CREDITS", WIDTH / 2, HEIGHT / 2);
	}
	
	if (transition) transition.render();
}
