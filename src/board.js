class Board {
    constructor(boardSize, numSquares) {
        // set board size, must be evenly divizable by number of grid squares
        this.boardSize = boardSize - (boardSize % numSquares)
        this.numSquares = numSquares
        
        this.setCanvas()
        
        this.setImages()
        
        this.createObjects()
        
        this.setEventListeners()

        this.genGrid()

        this.drawClicks = this.drawClicks.bind(this)
        this.main = this.main.bind(this)
        this.render = this.render.bind(this)
        this.reset = this.reset.bind(this)

        // Let's play this game!
        this.then = Date.now();
        this.reset();
        this.main();
        debugger    
    }

    setImages() {
        // Background image
        this.bgReady = false;
        this.bgImage = new Image();
        this.bgImage.onload = () => {
            this.bgReady = true;
        };
        this.bgImage.src = "images/grass_template2.jpg";

        // Hero image
        this.heroReady = false;
        this.heroImage = new Image();
        this.heroImage.onload = () => {
            this.heroReady = true;
        };
        this.heroImage.src = "images/hero.png";
        // Background image
        this.monsterReady = false;
        this.monsterImage = new Image();
        this.monsterImage.onload =  () => {
            this.monsterReady = true;
        };
        this.monsterImage.src = "images/monster.png";

    }

    createObjects(){
        // Game objects
        this.hero = {
            speed: 256, // movement in pixels per second
            x: 0,
            y: 0
        };
        this.monster = {
            x: 0,
            y: 0
        };
        this.monstersCaught = 0;
       
    }
    
    setCanvas() {
        // insert the canvas
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = this.boardSize;
        this.canvas.height = this.boardSize;
        this.canvas.id = 'myCanvas'
        document.body.appendChild(this.canvas);
    }
    

    drawGrid() {
        
        for (let index = 1; index < 20; index++) {
            let boardLength = index * (this.boardSize / this.numSquares)
           

            this.ctx.beginPath();
            this.ctx.lineTo(boardLength,0);
            this.ctx.lineTo(boardLength, 600);
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.lineTo(0, boardLength);
            this.ctx.lineTo(600, boardLength);
            this.ctx.stroke();
        }

    }

    genGrid() {
        this.board = {}
        for (let x = 1; x < 21; x++) {
            for (let y = 1; y < 21; y++) {
                this.board[[x, y]] = {'occupied': false}
            }
        }
    }

    captureClickonGrid(e){
        const clickX = (e.x - this.elemLeft) - ((e.x - this.elemLeft) % 30)
        const clickY = (e.y - this.elemTop) - ((e.y - this.elemTop) % 30)

        const square = this.board[((clickX / 30) + 1), ((clickY / 30) + 1)]
        
        this.elements.push([this.heroImage, clickX, clickY])

    }

    setEventListeners() {
        // Handle keyboard controls
        this.keysDown = {};

        
        this.elemLeft = this.canvas.offsetLeft,
        this.elemTop = this.canvas.offsetTop,
        this.elements = [];

        addEventListener('mousedown', (e) => {
            this.captureClickonGrid(e)
        })

        addEventListener("keydown", (e) => {
            this.keysDown[e.keyCode] = true;
        }, false);

        addEventListener("keyup", (e) => {
            delete this.keysDown[e.keyCode];
        }, false);
        

    }

    reset() {
        this.hero.x = this.canvas.width / 2;
        this.hero.y = this.canvas.height / 2;

        // Throw the monster somewhere on the screen randomly
        this.monster.x = 32 + (Math.random() * (this.canvas.width - 64));
        this.monster.y = 32 + (Math.random() * (this.canvas.height - 64));
    }


    update(modifier) {
        if (38 in this.keysDown) { // Player holding up
            this.hero.y -= this.hero.speed * modifier;
        }
        if (40 in this.keysDown) { // Player holding down
            this.hero.y += this.hero.speed * modifier;
        }
        if (37 in this.keysDown) { // Player holding left
            this.hero.x -= this.hero.speed * modifier;
        }
        if (39 in this.keysDown) { // Player holding right
            this.hero.x += this.hero.speed * modifier;
        }

        // Are they touching?
        if (
            this.hero.x <= (this.monster.x + 32)
            && this.monster.x <= (this.hero.x + 32)
            && this.hero.y <= (this.monster.y + 32)
            && this.monster.y <= (this.hero.y + 32)
        ) {
            this.reset();
        }
    }


    render() {
        if (this.bgReady) {
            
            this.ctx.drawImage(this.bgImage, 0, 0);
        }

        this.drawGrid()

        if (this.heroReady) {
            this.ctx.drawImage(this.heroImage, this.hero.x, this.hero.y);
        }

        if (this.monsterReady) {
            this.ctx.drawImage(this.monsterImage, this.monster.x, this.monster.y);
        }
        
        if (this.elements.length) {
            
            this.elements.forEach(this.drawClicks)
        }

    }

    drawClicks(click) {
        this.ctx.drawImage(...click)
    }

    
    main() {
        
        let now = Date.now();
        var delta = now - this.then;

        this.update(delta / 1000);
        this.render();

        this.then = now;

        // Cross-browser support for requestAnimationFrame
        var w = window;
        requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

        

        // Request to do this again ASAP
        requestAnimationFrame(this.main);
    }

}

export default Board;