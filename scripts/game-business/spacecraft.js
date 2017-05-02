var LEFT_DIRECTION = 1;
var RIGHT_DIRECTION = 2;
var UP_DIRECTION = 3;
var DOWN_DIRECTION = 4;
var LEFT_UP_DIRECTION = 5;
var RIGHT_UP_DIRECTION = 6;


var Spacecraft = function(context, keyboard, image, imgExplosion){
    this.context = context;
    this.keyboard = keyboard;
    this.image = image;
    this.imgExplosion = imgExplosion;
    this.x = 0;
    this.y = 0;
    this.speed = 0;

    this.shotDirection = UP_DIRECTION;
    this.energyFinished = null;
    this.energy = 3;

    this.spritesheet = new Spritesheet(context, image, 3, 2);
    this.spritesheet.line = 0;
    this.spritesheet.interval = 100;

    //weapon
    this.rockets = 5;
    this.ammo = 300;
}

Spacecraft.prototype = {
    reposition: function(){
        var canvas = this.context.canvas;
        this.x = canvas.width / 2 - 18;
        this.y = canvas.height - 48;
    },
    refresh: function(){
        var increase = this.speed * this.animation.elapsed / 1000;
        if(this.keyboard.pressedKey(LEFT_ARROW) && this.x > 0){
            this.x -= increase;
            this.shotDirection = UP_DIRECTION;
        }


        if(this.keyboard.pressedKey(RIGHT_ARROW) && this.x < this.context.canvas.width - 36){
            this.x += increase;
            this.shotDirection = UP_DIRECTION;
        }


        if(this.keyboard.pressedKey(UP_ARROW) && this.y > 0){
            this.y -= increase;
            this.shotDirection = UP_DIRECTION;
        }

        if(this.keyboard.pressedKey(DOWN_ARROW) && this.y < this.context.canvas.height - 48){
            this.y += increase;
            this.shotDirection = UP_DIRECTION;
        }
    },
    draw: function(){
        if(this.keyboard.pressedKey(LEFT_ARROW))
            this.spritesheet.line = 1;
        else if(this.keyboard.pressedKey(RIGHT_ARROW))
            this.spritesheet.line = 2;
        else
            this.spritesheet.line = 0;

        this.spritesheet.draw(this.x, this.y);
        this.spritesheet.nextFrame();
    },
    shoot: function(){
        if(this.ammo > 0){
            var shot = new Shot(this.context, this);
            this.animation.newSprite(shot);
            this.collider.newSprite(shot);

            this.ammo--;
        }
    },
    rectanglesCollision: function(){
        var rets = [
            {x: this.x + 2, y: this.y + 19, width: 9, height: 13},
            {x: this.x + 13, y: this.y + 3, width: 10, height: 33},
            {x: this.x + 25, y: this.y + 19, width: 9, height: 13}
        ];

        return rets;
    },
    collidedWith: function(other){
        if(other instanceof Enemy){
            this.animation.removeSprite(other)
            this.animation.removeTask(other);
            this.collider.removeSprite(other);

            var explosion = new Explosion(this.context, this.imgExplosion, other.x, other.y);
            this.animation.newSprite(explosion);

            var spacecraft = this;
            explosion.endOfExplosion = function(){
                spacecraft.energy--;

                if(spacecraft.energy < 0){
                    spacecraft.energyFinished(other);
                }else{
                    //spacecraft.collider.newSprite(spacecraft);
                    //spacecraft.animation.newSprite(spacecraft);
                    spacecraft.reposition();
                }
            }
        }else if(other instanceof Ammo){
            this.animation.removeSprite(other);
            this.animation.removeTask(other);
            this.collider.removeSprite(other);

            this.ammo += 50;
        }else if(other instanceof Energy){
            this.animation.removeSprite(other);
            this.animation.removeTask(other);
            this.collider.removeSprite(other);

            if(this.energy < 3){
                this.energy += 1;
            }
        }
    },
    activeShot: function(active){
        var self = this;
        if(active){
            this.keyboard.trigger(SPACE, function(){
                self.shoot();
            });
        }else{
            this.keyboard.trigger(SPACE, null);
        }
    }
}
