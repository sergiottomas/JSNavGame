var LEFT_ARROW = 37;
var RIGHT_ARROW = 39;
var UP_ARROW = 38;
var DOWN_ARROW = 40;
var SPACE = 32;
var ENTER = 13;

function Keyboard(element){
    this.element = element;

    //keypress array
    this.pressedKeys = [];

    //fired(disparadas) keys array
    this.firedKeys = [];

    //shoting functions
    this.shootingFunctions = [];

    //fix keys states in array
    var keyboard = this;
    element.addEventListener('keydown', function(e){
        var key = e.keyCode;
        keyboard.pressedKeys[key] = true;

        if(keyboard.shootingFunctions[key]){
            keyboard.firedKeys[key] = true;
            keyboard.shootingFunctions[key]();
        }
    });

    element.addEventListener('keyup', function(e){
        var key = e.keyCode;
        keyboard.pressedKeys[key] = false;
        keyboard.firedKeys[key] = false;
    })
};

Keyboard.prototype = {
    pressedKey: function(key){
        return this.pressedKeys[key];
    },
    trigger: function(key, callback){
        this.shootingFunctions[key] = callback;
    }
}
