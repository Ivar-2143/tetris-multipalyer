class GameController{
    constructor(){
        this.key_press = [];
        this.directions = {
            up: "W",
            down: "S",
            left: "A",
            right: "D",
        }
        this.keys = {
            87: this.directions.up,
            65: this.directions.left,
            68: this.directions.right,
            83: this.directions.down,
        }
    }
    keyPress(code){
        let key = this.keys[code];
        if(key && this.key_press.indexOf(key) === -1){
            // console.log('pressing',this.keys[code]);
            this.key_press.unshift(this.keys[code]);
            // console.log('key pressed',this.key_press);
        }
    }
    keyLifted(code){
        let key = this.keys[code];
        let index = this.key_press.indexOf(key);
        if(index > -1){
            // console.log('lifted', this.keys[code]);
            this.key_press.splice(index,1);
            // console.log('key pressed',this.key_press);
        }
    }
}