var Core = function(){
    //initial configs
    this.images = {
        space: 'img/background-space.png',
        stars: 'img/background-stars.png',
        clouds: 'img/background-clouds.png',
        spacecraft: 'img/spacecraft-spritesheet.png',
        enemy: 'img/enemy.png',
        explosion: 'img/explosion-spritesheet.png',
        rocket: 'img/rocket.png',
        ammo: 'img/ammo.png',
        energy: 'img/energy.png'
    };
    this.totalImages = 0;
    this.loadedImages = 0;
    this.score = 0;
    this.gameEngine = new GameEngine();
    this.graphicEngine = new GraphicEngine();

    //game business

    //scenario
    this.steps = [
        {
            song: null,
            space: null,
            stars: null,
            clouds: null,
            dificulty: 0,
            start: function(){
                var self = this;

                //step song
                this.song = new Audio();
                this.song.src = 'snd/action-song.mp3';
                this.song.volume = 0.8;
                this.song.loop = true;

                this.enemyCreator = {
                    lastEnemy: new Date().getTime(),
                    process: function(){
                        var now = new Date().getTime();
                        var elapsed = now - this.lastEnemy;

                        //1000 = 1s
                        if(elapsed > 1000){
                            self.addEnemy();
                            this.lastEnemy = now;
                        }
                    }
                };

                this.ammoCreator = {
                    lastAmmo: new Date().getTime(),
                    process: function(){
                        var now = new Date().getTime();
                        var elapsed = now - this.lastAmmo;

                        //1000 = 1s
                        if(elapsed > randomize(30000, 60000)){
                            self.addAmmo();
                            this.lastAmmo = now;
                        }
                    }
                }

                this.energyCreator = {
                    lastEnergy: new Date().getTime(),
                    process: function(){
                        var now = new Date().getTime();
                        var elapsed = now - this.lastEnergy;

                        //1000 = 1s
                        if(elapsed > randomize(60000, 120000)){
                            self.addEnergy();
                            this.lastEnergy = now;
                        }
                    }
                }

                core.gameEngine.animation.newTask(this.enemyCreator);
                core.gameEngine.animation.newTask(this.ammoCreator);
                core.gameEngine.animation.newTask(this.energyCreator);
            },
            continue: function(){
                this.enemyCreator.lastEnemy = new Date().getTime();
                this.ammoCreator.lastAmmo = new Date().getTime();
                this.energyCreator.lastEnergy = new Date().getTime();
            },
            addEnemy: function(){
                var enemy = new Enemy(context, core.images.enemy, core.images.explosion);

                //min: 250, max: 800
                enemy.speed = randomize(250, 800);

                //min: 0, max: canvas width - enemy width
                enemy.x = randomize(0, canvas.width - core.images.enemy.width)

                //discount height
                enemy.y = -core.images.enemy.height;

                core.gameEngine.animation.newSprite(enemy);
                core.gameEngine.collider.newSprite(enemy);
            },
            addAmmo: function(){
                var ammo = new Ammo(context, core.images.ammo, core.images.explosion);
                //ammo.speed = randomize(150, 800);
                ammo.x = randomize(0, canvas.width - core.images.ammo.width);
                ammo.y = -core.images.ammo.height;

                core.gameEngine.animation.newSprite(ammo);
                core.gameEngine.collider.newSprite(ammo);
            },
            addEnergy: function(){
                var energy = new Energy(context, core.images.energy, core.images.explosion);
                //ammo.speed = randomize(150, 800);
                energy.x = randomize(0, canvas.width - core.images.energy.width);
                energy.y = -core.images.energy.height;

                core.gameEngine.animation.newSprite(energy);
                core.gameEngine.collider.newSprite(energy);
            }
        }
    ];
    this.step = 0;

    //units
    this.shot = null;
    this.spacecraft = null;
    this.enemy = null;
}

Core.prototype = {
    init: function(){
        for(var i in this.images){
            var image = new Image();
            image.src = this.images[i];
            image.onload = this.loading;
            this.images[i] = image;
            this.totalImages++;
        }
    },
    loading: function(){
        context.save();
        context.drawImage(core.images.space, 0, 0, canvas.width, canvas.height);
        context.fillStyle = 'white';
        context.fillStroke = 'black';
        context.font = '50px sans-serif';
        context.strokeText("Carregando ...", 100, 202);
        context.fillText("Carregando ...", 100, 200);
        context.restore();

        core.loadedImages++;

        var totalsize = 300;
        var size = (core.loadedImages / core.totalImages)  * totalsize;
        context.save();
        context.fillStyle = '#d00';
        context.strokeStyle = 'yellow';
        context.fillRect(100, 250, size, 30);
        context.strokeRect(100, 250, size, 30);
        context.restore();

        if(core.loadedImages == core.totalImages){
            core.initEngines();
            core.initScenario();
            core.initUnits();
            core.initGame();
        }
    },
    initEngines: function(){
        this.gameEngine.load();
        this.graphicEngine.load();
    },
    initScenario: function(){
        var step = this.steps[this.step];

        step.space = new Background(context, this.images.space);
        step.stars = new Background(context, this.images.stars);
        step.clouds = new Background(context, this.images.clouds);
        step.space.speed = 60;
        step.stars.speed = 150;
        step.clouds.speed = 500;

        this.gameEngine.animation.newSprite(step.space);
        this.gameEngine.animation.newSprite(step.stars);
        this.gameEngine.animation.newSprite(step.clouds);
    },
    initUnits: function(){
        this.spacecraft = new Spacecraft(context, this.gameEngine.keyboard, this.images.spacecraft, this.images.explosion);
        this.spacecraft.speed = 200;
        this.spacecraft.energyFinished = function(other){
            core.kill(this, function(){
                window.setTimeout(function(){
                    core.gameOver();
                    core.gameEngine.animation.off();
                }, 200);
            });
            core.kill(other);
        }

        this.gameEngine.collider.onCollide = function(o1, o2){
            if((o1 instanceof Shot && o2 instanceof Enemy) || (o1 instanceof Enemy && o2 instanceof Shot)){
                core.score += 10;
            }
        }

        this.panel = new Panel(context, this.spacecraft);

        this.gameEngine.collider.newSprite(this.spacecraft);
        this.gameEngine.animation.newSprite(this.spacecraft);
        this.gameEngine.animation.newSprite(this.panel);
        this.gameEngine.animation.newTask(this.gameEngine.collider);
    },
    initGame: function(){
        document.getElementById('playButton').style.display = 'block';
    },
    startGame: function(){
        var step = this.steps[this.step];

        document.getElementById('playButton').style.display = 'none';

        this.spacecraft.reposition();
        this.spacecraft.activeShot(true);
        this.spacecraft.ammo = 300;
        this.spacecraft.energy = 3;
        this.score = 0;

        this.gameEngine.keyboard.trigger(ENTER, this.pauseGame);
        step.start();


        this.gameEngine.animation.on();
    },
    pauseGame: function(){
        var step = core.steps[core.step];

        if(core.gameEngine.animation.init){
            step.song.pause();
            core.gameEngine.animation.off();
            core.spacecraft.activeShot(false);

            context.save();
            context.fillStyle = 'white';
            context.strokeStyle = 'black';
            context.font = '50px sans-serif';
            context.fillText("Pausado", 160, 200);
            context.strokeText("Pausado", 160, 200);
            context.restore();
        }else{
            step.continue();
            step.song.play();
            core.gameEngine.animation.on();
            core.spacecraft.activeShot(true);
        }
    },
    gameOver: function(){
        var step = this.steps[this.step];

        step.song.pause();
        step.song.currentTime = 0.0;

        context.drawImage(this.images.space, 0, 0, canvas.width, canvas.height);
        context.save();
        context.fillStyle = 'white';
        context.strokeStyle = 'black';
        context.font = '70px sans-serif';
        context.fillText("GAME OVER", 40, 200);
        context.strokeText("GAME OVER", 40, 200);
        context.restore();

        this.gameEngine.keyboard.trigger("ENTER", null);

        //reset spacecraft
        this.spacecraft.activeShot(false);
        this.gameEngine.animation.newSprite(this.spacecraft);
        this.gameEngine.collider.newSprite(this.spacecraft);

        //remove sprites
        for(var i in this.gameEngine.animation.sprites){
            var sprite = this.gameEngine.animation.sprites[i];
            if(sprite instanceof Enemy || sprite instanceof Ammo || sprite instanceof Energy)
                this.gameEngine.animation.removeSprite(sprite);
        }

        //remove tasks
        for(var i in this.gameEngine.animation.tasks){
            var task = this.gameEngine.animation.tasks[i];
            if(!(task instanceof Collider))
                this.gameEngine.animation.removeTask(task);
        }

        this.gameEngine.animation.newTask(this.gameEngine.collider);

        document.getElementById('playButton').style.display = 'block';
    },
    kill: function(target, callback){
        if(target){
            var explosion = new Explosion(context, target.imgExplosion, target.x, target.y);

            target.animation.newSprite(explosion);
            target.animation.removeSprite(target);
            target.animation.removeTask(target);
            target.collider.removeSprite(target);

            explosion.endOfExplosion = callback;
        }
    }
}
