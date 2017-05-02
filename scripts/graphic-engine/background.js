var Background = function(context, image){
    this.context = context;
    this.image = image;
    this.speed = 0;
    this.imgRepeatPoint = 0;
}

Background.prototype = {
    refresh: function(){
        //refresh imgRepeatPoint
        this.imgRepeatPoint += this.speed * this.animation.elapsed / 1000;

        if(this.imgRepeatPoint > this.image.height)
            this.imgRepeatPoint = 0;
    },
    draw: function(){
        var img = this.image;

        //fist copy
        var positionY = this.imgRepeatPoint - img.height;
        this.context.drawImage(img, 0, positionY, img.width, img.height);

        //second copy
        positionY = this.imgRepeatPoint;
        this.context.drawImage(img, 0, positionY, img.width, img.height);
    }
}
