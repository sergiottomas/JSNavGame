function Spritesheet(context, img, lines, cols){
    this.context = context;
    this.img = img;
    this.lines = lines;
    this.cols = cols;
    this.interval = 0;
    this.line = 0;
    this.col = 0;
    this.endOfTheCycle = null;
}

Spritesheet.prototype = {
    nextFrame: function(){
        var now = new Date().getTime();

        //no last time mensured
        if(!this.lastTime){
            this.lastTime = now;
        }

        //its time to change col?
        if(now - this.lastTime < this.interval){
            return;
        }

        if(this.col < this.cols - 1){
            this.col++;
        }else{
            this.col = 0;
            if(this.endOfTheCycle)
                this.endOfTheCycle();
        }

        //save time of last change
        this.lastTime = now;
    },
    draw: function(x, y){
        var frameWidth = this.img.width / this.cols;
        var frameHeight = this.img.height / this.lines;

        this.context.drawImage(this.img, frameWidth * this.col, frameHeight * this.line, frameWidth, frameHeight, x, y, frameWidth, frameHeight)
    }
}
