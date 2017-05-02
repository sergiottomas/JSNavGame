var Collider = function(){
    this.sprites = [];
    this.spritesToRemove = [];
    this.onCollide = null;
}

Collider.prototype = {
    newSprite: function(sprite){
        this.sprites.push(sprite);
        sprite.collider = this;
    },
    removeSprite: function(sprite){
        this.spritesToRemove.push(sprite);
    },
    process: function(){
        var alreadyTested = new Object();

        //here we will check the collider
        for(var i in this.sprites){
            //check colision
            for(var j in this.sprites){
                //not collide with yourself
                if(i == j) continue;

                //generate unique string
                var id1 = this.uniqueString(this.sprites[i]);
                var id2 = this.uniqueString(this.sprites[j]);

                //create the arrays if not exists
                if(!alreadyTested[id1])
                    alreadyTested[id1] = [];
                if(!alreadyTested[id2])
                    alreadyTested[id2] = [];

                if(! (alreadyTested[id1].indexOf(id2) >= 0 || alreadyTested[id2].indexOf(id1) >= 0) ){
                    this.checkCollision(this.sprites[i], this.sprites[j]);

                    alreadyTested[id1].push(id2);
                    alreadyTested[id2].push(id1);
                }
            }
        }

        this.initRemovals();
    },
    initRemovals: function(){
        //create new array
        var sprites = [];

        for(var i in this.sprites){
            if(this.spritesToRemove.indexOf(this.sprites[i]) == -1)
                sprites.push(this.sprites[i]);
        }

        //clear spritesToRemove
        this.spritesToRemove = [];

        //replace old array to new array
        this.sprites = sprites;
    },
    checkCollision: function(sprite1, sprite2){
        var rets1 = sprite1.rectanglesCollision();
        var rets2 = sprite2.rectanglesCollision();

        colisoes:
        for(var i in rets1){
            for(var j in rets2){
                if(this.rectangleCollide(rets1[i], rets2[j])){
                    sprite1.collidedWith(sprite2, rets2[j].name);
                    sprite2.collidedWith(sprite1, rets1[i].name);

                    if(this.onCollide)
                        this.onCollide(sprite1, sprite2, rets1[i].name, rets2[j].name);

                    //dont need see all rectangles
                    break colisoes;
                }
            }
        }
    },
    rectangleCollide: function(ret1, ret2){
        return  (
            (ret1.x + ret1.width) > ret2.x &&
            ret1.x < (ret2.x + ret2.width) &&
            (ret1.y + ret1.height) > ret2.y &&
            ret1.y < (ret2.y + ret2.height)
        );
    },
    uniqueString: function(sprite){
        var str = '';
        var rectangles = sprite.rectanglesCollision();

        for(var i in rectangles){
            str += 'x:' + rectangles[i].x + ',';
            str += 'y:' + rectangles[i].y + ',';
            str += 'w:' + rectangles[i].width + ',';
            str += 'h:' + rectangles[i].height + '\n';
        }

        return str;
    }
}
