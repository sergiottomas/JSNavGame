var Ammo  = function(context, image, imgExplosion){
    this.context = context;
    this.image = image;
    this.imgExplosion = imgExplosion;
    this.amount = 0;

    this.x = 0;
    this.y = 0;
    this.speed = 250;
}

Ammo.prototype = {
    refresh: function(){
        var increase = this.speed * this.animation.elapsed / 1000;
        this.y += increase;
    },
    draw: function(){
        this.context.drawImage(this.image, this.x, this.y, this.image.width, this.image.height);
    },
    rectanglesCollision: function(){
        var rets = [
            {x: this.x, y: this.y, width: this.image.width, height: this.image.height}
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
