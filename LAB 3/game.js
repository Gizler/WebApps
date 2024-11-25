const canvas=document.createElement("canvas");
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
const context = canvas.getContext("2d");
document.body.appendChild(canvas);
canvas.addEventListener("click",clicked);

const cursorDiv = document.querySelector('.cursor');


const sprite=new Image();
sprite.src="images/walkingdead.png";
const heart=new Image();
const lost=new Image();
heart.src="images/full_heart.png";
lost.src="images/empty_heart.png";
const spriteX=200;
const spriteY=312;
const topSpace=0.15*canvas.height;
const sadMusic = new Audio('images/sad-music.mp3');

const gameOverPopup = document.getElementById('popup');
const finalScoreElement = document.getElementById('finalScore');

context.font = topSpace+"px Arial";
context.fillStyle ="white";


let zombies=[];
let lives=3;
let score=0;


function animate(obj) {
	obj.frame=(obj.frame+1)%10;
}

class Zombie {
	constructor() {
		this.frame=0;
		let scale=Math.random()+0.2;
		this.x=canvas.width;
		this.width=spriteX*scale;
		this.height=spriteY*scale;
		this.y=(0.8+Math.random()*0.2)*canvas.height-this.height;
		this.speed=1+Math.random()*2;
		setInterval(animate,100,this);
	}
	
	draw() {
		context.drawImage(sprite, spriteX*this.frame, 0, spriteX, spriteY, this.x, this.y, this.width, this.height);
	}
	
	move() {
		if(this.x<-this.height)
			return false;
		this.x-=this.speed;
		return true;
	}
}

function reset() {
	context.drawImage(heart,10,10,topSpace-10,topSpace-10);
	context.drawImage(heart,topSpace+5,10,topSpace-10, topSpace-10);
	context.drawImage(heart,2*topSpace,10,topSpace-10, topSpace-10);
	zombies=[];
	lives=3;
	score=0;
	gameOverPopup.style.display = 'none';
	sadMusic.pause();
	drawScore();
	spawn();
	mainLoop();	
}

function spawn() {
	if(lives>0) {
		zombies.push(new Zombie());
		setTimeout(spawn, Math.random()*5000+1000);
	}
}

function run(zombie, index) {
	if(zombie.move())
		zombie.draw();
	else {
		zombies.splice(index,1);
		lives--;
		context.drawImage(lost,10+lives*(topSpace-5),10,topSpace-10,topSpace-10);
	}
}

function mainLoop() {
	context.clearRect(0, topSpace, canvas.width, canvas.height);
	zombies.forEach(run);
	if(lives>0)
		requestAnimationFrame(mainLoop);
	if(lives==0) {
		sadMusic.play();
		finalScoreElement.textContent = score;
		gameOverPopup.style.display = 'block';
	}
}

function clicked() {
	if(lives>0) {
		let missed=true;
		for(let i=0;i<zombies.length;i++) {
			if(shot(zombies[i])) {
				score+=20;
				missed=false;
				zombies.splice(i,1);
				break;
			}
		}
		if(missed)
			score-=5;
	}
	drawScore();
}

function shot(zombie) {
	if(event.clientX > zombie.x && event.clientX < zombie.x+zombie.width &&
		event.clientY > zombie.y && event.clientY < zombie.y+zombie.height)
		return true;
	return false;
}

function drawScore() {
	let str=score.toString();
	str="0".repeat(5-str.length)+str;
	context.clearRect(canvas.width/2,0,canvas.width,topSpace);
	context.fillText(str, canvas.width-topSpace*4, topSpace-5);
}

function moveCursor(e) {
	cursorDiv.style.transform=`translate3d(${e.clientX-100}px, ${e.clientY-100}px, 0)`;
}

window.addEventListener('mousemove', moveCursor)




reset();



