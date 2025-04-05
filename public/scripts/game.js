class Game{
    constructor(socket){
        this.socket = socket;
        this.time_elapsed = 0;
        this.game_frame = $('.game_frame');
        this.box = new Shapes(this);
        this.game_frame.append(this.box.getShape());
        this.controller = new GameController();
        this.speed = 704-(88);
        this.board = [];
        this.is_playing = true;
        for(let row = 0; row < 16; row++){
            this.board.push([]);
            for(let col = 0; col < 10; col++){
                $('.row').eq(row).children().eq(col).attr('filled',false);
                this.board[row].push(false);
            }
        }
        this.received_input = false;
        // console.log(this.board);
    }
    gameloop(){
        if(!this.is_playing){
            return;
        }
        // console.log('Game is running...')
        // let draw_rate = 1000/60;
        let game = this;
        // let invoked_time = new Date().getMilliseconds;
        // let delta_time = 0;
        // let current_time;
        // let box = $('.box')[0];
        if(this.controller.key_press.length > 0 && !this.received_input){
            // console.log('Input received', game.received_input);
            // let time_elapsed = 0;
            let time_stamp = 48;
            if(game.controller.key_press[0] === 'W'){
                time_stamp = 100;
            }
            game.box.move(game.controller.key_press);
            this.received_input = true;
            // let invoked_time = new Date().getMilliseconds();
            setTimeout(function(){
                // let current_time = new Date().getMilliseconds();
                // console.log('Time passed',current_time - invoked_time);
                game.received_input = false;
            },time_stamp);
        }
        if(this.time_elapsed > this.speed){ 
            this.box.draw();
            this.#sendBoardData();
            this.box.fall();
            //Update, Draw, Render logic here
            // this.box.fall();
            // this.box.draw();
            // console.log('Time Elapsed:',this.time_elapsed);
            // console.log('FPS:',this.fps_counter);
            // this.box.getShape().style.transform = 'translate(0,'+'px)';
            // console.log('Time passed:',this.time_elapsed);
            this.time_elapsed = 0;
        }
        this.time_elapsed += 1000/60;
        window.requestAnimationFrame(()=> game.gameloop());
        // setTimeout(function(){
        // },game.speed);
    }
    isOver(){
        this.is_playing = false;
        alert('Game Over');
    }
    #sendBoardData(){
        let board_state = [];
        let board_rows = $('#you .row');
        for(let row = 0; row < board_rows.length; row++){
            board_state.push([]);
            for(let col = 0; col < board_rows.eq(0).children().length; col++){
                let style = board_rows.eq(row).children().eq(col).attr('style') + '';
                board_state[row].push(style);
            }
        }
        console.log(board_state);
        this.socket.emit('state_changed', {board: board_state});
    }
}