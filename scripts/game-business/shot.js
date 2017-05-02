//load shoot sound
var SOUND_SHOOT = new Audio();
SOUND_SHOOT.src = 'snd/shoot.mp3';
SOUND_SHOOT.volume = 0.2;
SOUND_SHOOT.load();

var Shot = function(context, spacecraft){
    this.context = context;
    this.spacecraft = spacecraft;

    //positioning shot in top of the spacecraft
    this.width = 3;
    this.height = 10;
    this.x = spacecraft.x + 18; // 36 / 2
    this.y = spacecraft.y - this.height;
    this.speed = 500;
    this.color = 'yellow';

    SOUND_SHOOT.currentTime = 0.0;
    SOUND_SHOOT.play();
}

Shot.prototype = {
    refresh: function(){
        var increase = this.speed * this.animation.elapsed / 1000;
        if(this.spacecraft.shotDirection == UP_DIRECTION){
            this.y -= increase;
        }

        if(this.spacecraft.shotDirection == LEFT_UP_DIRECTION){
            this.x -= increase;
            this.y -= increase;
        }

        if(this.spacecraft.shotDirection == RIGHT_UP_DIRECTION){
            this.x += increase;
            this.y -= increase;
        }

        if(this.y < -this.height){
            this.collider.removeSprite(this);
            this.animation.removeSprite(this);
        }
    },
    draw: function(){
        var ctx = this.context;
        ctx.fillStyle = 'yellow';
        ctx.fillRect(this.x, this.y, this.width, this.height);

        ctx.restore();
    },
    rectanglesCollision: function(){
        return [{x: this.x, y: this.y, width: this.width, height: this.height}]
    },
    collidedWith: function(other){

    }
}
