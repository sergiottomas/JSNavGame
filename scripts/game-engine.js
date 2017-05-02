var GameEngine = function(){
    this.animation = null;
    this.keyboard = null;
    this.collider = null;
}

GameEngine.prototype = {
    load: function(){
        //instace all game engine class
        this.animation = new Animation(context);
        this.keyboard = new Keyboard(document);
        this.collider = new Collider();
    }
}
