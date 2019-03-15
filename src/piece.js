class Piece {
    constructor(ctx, startX, startY){
        this.ctx = ctx;
        this.x = startX;
        this.y = startY;
        this.imgReady = false;
    }

    setImage(imgPath) {
        this.image = new Image();
        this.image.onload = () => {
            this.imgReady = true;
        }
        this.image.src = imgPath
    }
}

export default Piece