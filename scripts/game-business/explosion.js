var SOUND_EXPLOSION = new Audio();
SOUND_EXPLOSION.src = 'snd/explosion.mp3';
SOUND_EXPLOSION.volume = 0.2;
SOUND_EXPLOSION.load();

var Explosion = function(context, image, x, y){
    this.context = context;
    this.image = image;
    this.spritesheet = new Spritesheet(context, image, 1, 5);
    this.spritesheet.interval = 75;
    this.x = x;
    this.y = y;

    var explosion = this;
    this.spritesheet.endOfTheCycle = function(){
        explosion.animation.removeSprite(explosion);

        if(explosion.endOfExplosion)
            explosion.endOfExplosion();
    }

    SOUND_EXPLOSION.currentTime = 0.0;
    SOUND_EXPLOSION.play();
}

Explosion.prototype = {
    refresh: function(){},
    draw: function(){
        this.spritesheet.draw(this.x, this.y);
        this.spritesheet.nextFrame();
    }
}
