// 0.0.1b
// I just need the button art, E

let WIDTH = 700;
let HEIGHT = 500;
let menu = [];
let img;
let screen = 0;

function MenuItem(x_, y_, ySpeed_, yPower_, img_, id_) {
	this.dimX = 400 * 0.5; // We should keep it this way until the final buttons are ready
	this.dimY = 300 * 0.5;
	this.x = x_;
	this.y = y_;
	this.ySpeed = ySpeed_;
	this.yPower = yPower_;
	this.img = img_;
	this.id = id_;
	this.finalY = this.y;
	
	this.clicked = () => {	
		screen = (this.id == 2) ? 1 : 2;
	}
	
	this.render = () => {
		this.finalY = this.y + sin(frameCount * this.ySpeed) * this.yPower;
		
		if (mouseIsPressed) {
			if (mouseX >= this.x - this.dimX / 2 && mouseX <= this.x + this.dimX / 2) {
				if (mouseY >= this.y - this.dimY / 2 && mouseY <= this.finalY + this.dimY / 2) {
					this.clicked();
				}
			}
		}
		
		push();
		this.img.resize(this.dimX, this.dimY);
		translate(this.x, this.finalY);
		rotate(PI / 180 * sin(frameCount / 25) * 2);
		imageMode(CENTER);
		image(this.img, 0, 0, 0, 0);
		pop();
	}
}

preload = () => {
	img = loadImage("https://cors-anywhere.herokuapp.com/http://pixelartmaker.com/art/9b4cf54d4690c1d.png");
}

setup = () => {
	menu.push(new MenuItem(WIDTH / 2, 100, 0.05, 10, img, 1));
	menu.push(new MenuItem(WIDTH / 2, 250, 0.05, 10, img, 2));
	menu.push(new MenuItem(WIDTH / 2, 350, 0.05, 10, img, 3));
	createCanvas(WIDTH, HEIGHT);
}

draw = () => {
	background(250);
	
	if (screen == 0) {
		menu.forEach((item) => { // Render all menu items
			item.render();
		});
	} else if (screen == 1) {
		textSize(50);
		text("GAME", WIDTH / 2, HEIGHT / 2);
	} else if (screen == 2) {
		textSize(50);
		text("CREDITS", WIDTH / 2, HEIGHT / 2);
	}
}
