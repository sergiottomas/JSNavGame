var Enemy = function(context, image, imgExplosion){
    this.context = context;
    this.image = image;
    this.imgExplosion = imgExplosion;
    this.x = 0;
    this.y = 0;
    this.speed = 0;
}

Enemy.prototype = {
    refresh: function(){
        this.y += this.speed * this.animation.elapsed / 1000;

        if(this.y > this.context.canvas.height){
            this.collider.removeSprite(this);
            this.animation.removeSprite(this);
            this.animation.removeTask(this);
        }
    },
    draw: function(){
        this.context.drawImage(this.image, this.x, this.y, this.image.width, this.image.height);
    },
    rectanglesCollision: function(){
        var rets = [
            {x: this.x + 16, y: this.y, width: this.image.width / 2, height: 10},
            {x: this.x, y: this.y + 12, width: this.image.width, height: 12},
            {x: this.x + 16, y: this.y + 26, width: this.image.width / 2, height: 8}
        ];

        return rets;
    },
    collidedWith: function(other){
        if(other instanceof Shot){
            //remove this enemy
            this.animation.removeSprite(this);
            this.animation.removeTask(this);
            this.collider.removeSprite(this);

            //remove shot
            this.animation.removeSprite(other);
            this.collider.removeSprite(other);

            var explosion = new Explosion(this.context, this.imgExplosion, this.x, this.y);
            this.animation.newSprite(explosion);
        }
    }
}
