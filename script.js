let ctx = document.getElementById('canvas').getContext('2d');
let lifeCount = localStorage.getItem("lives") ? Number(localStorage.getItem("lives")) : 5;

if(lifeCount == 0) {
    localStorage.clear();
    document.getElementById("gameOver").style.display = "block";
    document.getElementById("refBtn").style.display = "block";
}

const refreshPage = () => {
    window.location.reload();
}

const setLives = (lives) => {
    lives = lifeCount - 1;
    localStorage.setItem("lives", lives); 
}

for(i=0; i<lifeCount; i++) {
    let heart = document.getElementById("heart");
    let life = document.createElement("i");
    life.id = "life";
    life.classList.add("bi-heart-fill");
    heart.appendChild(life);
}

class Component {
    constructor(x, y, color, width, height, type) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type;
        if (this.type == "circle") {
            ctx.beginPath();
            ctx.arc(this.x, this.y, width, height, 2 * Math.PI);
            ctx.strokeStyle = "white";
            ctx.stroke();
            ctx.closePath();
            ctx.fillStyle = color;
            ctx.fill();
        }

        if (this.type == "square") {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}

let dirX = Math.random() * 2;
let dirY = -2;
let ball = new Component(348, 670, "black", 7, 0, "circle");
let brick;
let brickWidth = 43;
let brickHeight = 50;
let brickMap = [];
let x = ball.x;
let y = ball.y;
let shipX = 300;
let shipY = 680;
let brickAmount = 12;
let brickY = 10;
let brickX = 50;

for (row = 1; row < 5; row++) {  
    for (column = row; column <= brickAmount; column++) {
            
    brick = new Component(column * brickX, brickY, "green", brickWidth, brickHeight, "square");
        brickMap.push([brick])
    } 
    brickAmount -= 1;
    brickY += 56;
    column -= 11;  
} 
    
const drawBricks = () => {
    for(check = 0; check < brickMap.length; check++) {
        brick = new Component(brickMap[check][0].x, brickMap[check][0].y, "green", brickWidth, brickHeight, "square")
    }
}

const drawShip = () => {
    ship = new Component(shipX, shipY, "red", 100, 15, "square"); 
}

drawShip();

const moveShip = (e) => {
    let x = e.offsetX - ship.width / 2;
    shipX = x;

    if(x < 0) {
        shipX = 0;
    } 

    if(x > canvas.width - ship.width) {
        shipX = canvas.width - ship.width;
    }
}

const brickCollision = () => {
    
    if(x < 5 || x > canvas.width - 5) {
        dirX = -dirX;
    }

    if(y < 5) {
        dirY = -dirY; 
    } 

    if(x >= ship.x && x <= ship.x + ship.width && y > canvas.height - (ship.height * 2)) {
        dirY = -dirY;
    }

    if(y >= shipY + 1) {
        setLives();
        document.location.reload();
    }

    for(check = 0; check < brickMap.length; check++) {

        let gap = brick.height - brick.width;

        if((x >= (brickMap[check][0].x) && x <= (brickMap[check][0].x + brick.width + gap)) && y == (brickMap[check][0].y + brick.height)){
            dirY = -dirY;
            brickMap.filter(number => brickMap[check][0] = number);
        }

        if((x >= brickMap[check][0].x && x <= (brickMap[check][0].x + brick.width + gap)) 
            && 
           (y >= brickMap[check][0].y && y < (brickMap[check][0].y + brick.height))) {
            dirX = -dirX;
            brickMap.filter(number => brickMap[check][0] = number)
        }  
    }  
}  

const moveBall = () => {   
    x += dirX;
    y += dirY;
    
    ball = new Component(x, y, "black", 7, 0, "circle");
}

const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawShip();
    drawBricks();
    moveBall();
    brickCollision();
}

const startGame = () => {
    canvas.addEventListener("mousemove", event => moveShip(event));
    setInterval(draw, 10); 
}

canvas.addEventListener('click', function(event) {
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    console.log("x: " + x + " y: " + y); 
}, false);



