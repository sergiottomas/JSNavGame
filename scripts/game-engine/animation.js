function Animation(context){
    this.context = context;
    this.sprites = [];
    this.spritesToRemove = [];
    this.init = false;
    this.tasks = [];
    this.tasksToRemove = [];

    this.lastCyrcle = 0;
    this.elapsed = 0;
}

Animation.prototype = {
    newSprite: function(sprite){
        this.sprites.push(sprite);
        sprite.animation = this;
    },
    removeSprite: function(sprite){
        this.spritesToRemove.push(sprite);
    },
    on: function(){
        this.init = true;
        this.lastCyrcle = 0;
        this.nextFrame();
    },
    off: function(){
        this.init = false;
    },
    nextFrame: function(){
        if(!this.init) return;

        var now = new Date().getTime();

        if(this.lastCyrcle == 0)
            this.lastCyrcle = now;

        this.elapsed = now - this.lastCyrcle;



        //clear screen and draw background
        //this.clearScreen();

        //refresh sprite states
        for(var i in this.sprites){
            this.sprites[i].refresh();
        }

        //draw the sprites
        for(var i in this.sprites){
            this.sprites[i].draw();
        }

        //general tasks
        for(var i in this.tasks){
            this.tasks[i].process();
        }

        this.lastCyrcle = now;

        //call next circle
        var animation = this;
        requestAnimationFrame(function(){
            animation.nextFrame();
        });

        this.initRemovals();
    },
    initRemovals: function(){
        var sprites = [];
        var tasks = [];

        for(var i in this.sprites){
            if(this.spritesToRemove.indexOf(this.sprites[i]) == -1)
                sprites.push(this.sprites[i]);
        }

        for(var i in this.tasks){
            if(this.tasksToRemove.indexOf(this.tasks[i]) == -1)
                tasks.push(this.tasks[i]);
        }

        //clear exclusion arrays
        this.spritesToRemove = [];
        this.tasksToRemove = [];

        //replace old array to new array
        this.sprites = sprites;
        this.tasks = tasks;
    },
    clearScreen: function(){
        var ctx = this.context;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    },
    newTask: function(task){
        this.tasks.push(task);
        task.animation = this;
    },
    removeTask: function(task){
        this.tasksToRemove.push(task);
    }
}
