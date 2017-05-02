var GraphicEngine = function(){
    this.background = null;
    this.spritesheet = null;
}

GraphicEngine.prototype = {
    load: function(){
        //refer to class, not instance
        this.background = Background;
        this.spritesheet = Spritesheet;
    }
}
