var Panel = function(context, spacecraft){
    this.context = context;
    this.spacecraft = spacecraft;
    this.spritesheet = new Spritesheet(context, spacecraft.image, 3, 2);
    this.spritesheet.line = 0;
    this.spritesheet.col = 0;
}

Panel.prototype = {
    refresh: function(){

    },
    draw: function(){
        var ctx = this.context;
        ctx.scale(0.5, 0.5);

        //energy
        var x = 20;
        var y = 20;

        for(var i = 1; i <= this.spacecraft.energy; i++){
            this.spritesheet.draw(x, y);
            x += 40;
        }

        ctx.scale(2, 2);

        //score
        ctx.save();
        ctx.fillStyle = 'white';
        ctx.font = '18px sans-serif';
        ctx.fillText(core.score, 100, 27);
        ctx.restore();

        //rocket icon
        ctx.save();
        ctx.scale(0.5, 0.5);
        ctx.drawImage(core.images.ammo, 50, (ctx.canvas.height * 2) - core.images.ammo.height - 18, core.images.ammo.width, core.images.ammo.height);
        ctx.restore();

        //bullets
        ctx.save();
        ctx.fillStyle = 'white';
        ctx.font = '18px sans-serif';
        ctx.fillText(this.spacecraft.ammo, core.images.ammo.width + 10, ctx.canvas.height - 14);
        ctx.restore();
    }
}
