class Shapes{
    constructor(game_loop){
        this.game_loop = game_loop;
        console.log(this.game_loop);
        this.shapes = [
            {shape:[[true,true],[true,true]],color: 'yellow', name: 'o',width: 2, space:{
                right: 0,
                left: 0,
                bottom: 0
            }},
            {
                shape:[
                    [false,true,false,false],
                    [false,true,false,false],
                    [false,true,false,false],
                    [false,true,false,false]
                ], 
                color:'lightblue',
                name: 'i',
                width: 4,
                space:{
                    right: 2,
                    left: 1,
                    bottom: 0
                }
            },
            {
                shape:[
                    [false,true,false],
                    [false,true,false],
                    [true,true,false],
                ],
                color: 'blue',
                name: 'j',
                width: 3,
                space:{
                    right: 1,
                    left: 0,
                    bottom: 0
                }
            },{
                shape:[
                    [false,true,false],
                    [false,true,false],
                    [false,true,true],
                ],
                color: 'orange',
                name: 'l',
                width: 3,
                space:{
                    right: 0,
                    left: 1,
                    bottom: 0
                }
            },{
                shape:[
                    [false,true,false],
                    [false,true,true],
                    [false,true,false],
                ],
                color: 'purple',
                name: 't',
                width: 3,
                space:{
                    right: 0,
                    left: 1,
                    bottom: 0
                }
            },{
                shape:[
                    [false,false,false],
                    [true,true,false],
                    [false,true,true],
                ],
                color: 'red',
                name: 'z',
                width: 3,
                space:{
                    right: 0,
                    left: 0,
                    bottom: 0
                }
            },{
                shape:[
                    [false,false,false],
                    [false,true,true],
                    [true,true,false],
                ],
                color: 'green',
                name: 's',
                width: 3,
                space:{
                    right: 0,
                    left: 0,
                    bottom: 0
                }
            }
        ]
        // this.shape = document.createElement('div');
        // this.shape.classList.add('box');
        // let rand = Math.floor(Math.random() * this.shapes.length);
        // this.shape = this.shapes[rand];
        // this.x = Math.floor(Math.random() * (9));
        // this.y = 0;
        // this.speed = 1;
        // this.draw();
        // this.state = 'falling';
        // this.shape_blocks = [];
        // for(let row = 0; row < this.shape.shape.length; row++){
        //     for(let col = 0; col < this.shape.shape[row].length; col++){
        //         if(this.shape.shape[row][col]){
        //             if(!this.shape_blocks[row]){
        //                 this.shape_blocks[row] = [];
        //             }
        //             this.shape_blocks[row].push(true);
        //         }
        //     }
        // };
        // console.log(this.shape_blocks);
        this.create();
    }
    create(){
        let game = this;
        let rand = Math.floor(Math.random() * this.shapes.length);
        this.shape = {...game.shapes[rand]};
        this.x = Math.floor(Math.random() * (8 - (this.shape.space.right)) + (0 - this.shape.space.left));
        this.y = 0-this.shape.shape.length;
        this.speed = 1;
        //check for spaces
        let rows = this.shape.shape.length;
        let cols = this.shape.shape[0].length;
        let bottom_space = 0;
        let left_space = 0;
        let right_space = 0;
        for(let row = 0; row < rows; row++){
            let has_bottom_space = true;
            for(let col = 0; col < cols; col++){
                if(row > 1 && this.shape.shape[row][col])   has_bottom_space = false;
            }
            if(row > 1 && has_bottom_space) bottom_space++;
        }
        for(let col = 0; col < cols; col++){
            let has_left_space = true,has_right_space = true;
            for(let row = 0; row < rows; row++){
                if(col > 1 & this.shape.shape[row][col])    has_right_space = false;
                if(col < 2 && this.shape.shape[row][col])   has_left_space = false;
            }
            if(col > 1 && has_right_space)  right_space++;
            if(col < 2 && has_left_space)   left_space++;
        }
        this.shape.space.right = right_space;
        this.shape.space.left = left_space;
        this.shape.space.bottom = bottom_space;
        this.draw();
        console.log('----- Created Shape -----')
        console.log('created',this.shape);
    }
    getShape(){
        return this.shape;
    }
    fall(){
        // console.log('collision',this.#collisionDetected());
        if(this.#groundLimit(this.shape)){
            this.fill();
        }
        this.y++;
        // if(this.y < (16-this.shape.shape.length)){
        //     return;
        // }
    }
    move(keys){
        let key = keys[0];
        if(key == 'S'){
            this.fall();
            // if(this.y >= (40*16 - 80)){
            //     return;
            // }
            // this.y += 10;
        }else if(key == 'A'){
            if(this.#sideLimit(this.shape,-1)) return;
            // this.x -= 40;
            this.x--;
        }else if(key == 'D'){
            // console.log(9-this.shape.orientation.right_space);
            if(this.#sideLimit(this.shape,+1)){
                return;
            }
            this.x++;
        }else if(key == 'W'){
            this.rotate();
        }
        this.draw();
    }   
    draw(){
        // let rows = $('.row');
        // let cols = $('.row .cell');
        // console.log('shape',this.shape.shape)
        // $('.cell').attr('current-block', false);
        // console.log(this.shape.shape.length);
        let last_position = $('#you .current-block');
        last_position.css('background-color','transparent');
        last_position.removeClass('current-block');
        for(let i = 0; i < this.shape.shape.length; i++){
            if(this.y+i<0) continue;
            let row = $('#you .row').eq(this.y + i);
            let current_block = this.shape.shape[i];
            for(let j = 0; j < this.shape.shape[i].length; j++){
                if(current_block[j]){
                    row.children().eq(this.x + j).addClass('current-block');
                    row.children().eq(this.x + j).css('background-color',this.shape.color);
                }
            }
        }
        // this.shape.style.transform = 'translate('+this.x+'px,'+this.y+'px)';
    }
    fill(){
        this.draw();
        let shape = this;
        let position = $('#you .current-block');
        for(let i = 0; i < position.length; i++){
            if(position.eq(i) && position.eq(i).attr('filled') == 'true'){
                this.game_loop.isOver();
            }
        }
        // console.log(position);
        position.attr('filled',true);
        position.removeClass('current-block');
        this.#checkCompleteRows();
        this.create();
        // setTimeout(function(){
        // },20)
    }
    rotate(){
        let game = this;
        let temporary_shape = {...game.shape};
        // console.log('temporary_shape', temporary_shape);
        let new_arr = [];
        let rows = this.shape.shape.length;
        let cols = this.shape.shape[0].length;
        let bottom_space = 0;
        let left_space = 0;
        let right_space = 0;
        for(let row = 0; row < rows; row++){
            new_arr.push([]);
            for(let col = 0; col < cols; col++){
                new_arr[row].push(false);
            }
        }
        for(let row = 0; row < rows; row++){
            let has_bottom_space = true;  
            for(let col = 0; col < cols; col++){
                new_arr[col][rows-row-1] = this.shape.shape[row][col];
                if(row > 1 && new_arr[row][col]){
                    has_bottom_space = false;
                }
                // if(col < 2 && new_arr[row][col]){
                //     has_bottom_space = false;
                // }
            }
            if(row > 1 && has_bottom_space){
                bottom_space++;
            }
        }
        for(let col = 0; col < cols; col++){
            let has_left_space = true, has_right_space = true;
            for(let row = 0; row < rows; row++){
                if(col < 2 && new_arr[row][col]){
                    //check for left space
                    has_left_space = false;
                }
                if(col > 1 && new_arr[row][col]){
                    //check for right space
                    has_right_space = false;
                }
            }
            if(col < 2 && has_left_space) left_space++;
            if(col > 1 && has_right_space) right_space++;
        }
        let diff = (this.x + (this.shape.width - (left_space + right_space)) -1);
        // console.log(diff-2);
        let y_axis = this.y;
        let x_axis = this.x;
        // console.log('left-block', $('.row')[y_axis]);
        temporary_shape.shape = new_arr;
        temporary_shape.space.right = right_space;
        temporary_shape.space.left = left_space;
        temporary_shape.space.bottom = bottom_space;
        // console.log('final', this.#exclusiveLeftRightLimit(this,temporary_shape));
        console.log('shape',this.shape);
        console.log('diff',diff);
        if(diff >= 10 || (this.x + left_space) <= 0||  this.#exclusiveLeftRightLimit(this,temporary_shape)){
            return;
        }
        // if(this.#sideLimit(temporary_shape,-1) || this.#sideLimit(temporary_shape,+1)){
        //     // if(diff > 10){
        //     //     while(diff > 10){
        //     //         this.move(['A']);
        //     //         diff--;
        //     //     }
        //     // }
        //     // if(x_axis == this.x) return;
        //     // alert('Cannot Rotate');
        //     // this.shape = temporary_shape;
        //     // new_arr = temporary_shape.shape; 
        //     // console.log(temporary_shape);
        //     return;
        // }
        this.shape.space.right = right_space;
        this.shape.space.left = left_space;
        this.shape.space.bottom = bottom_space;
        //For reverting back to original 
        // this.shape.shape = new_arr;
        // let x_axis = this.x;

        // if(this.#sideLimit(-1)){
            
        // }
        // console.log(new_arr);
        this.shape.shape = new_arr;
    }
    #groundLimit(shape){
        // console.log('y',this.y);
        // console.log('x',this.x);
        // if(this.y >= (16-this.shape.shape.length)){
        //     return true;
        // }
        // // for(){

        // // }
        // let row = $('.row').eq(this.y + this.shape.shape.length);
        // let cell = row.children().eq(this.x);
        // console.log('is Filled below?',(cell.attr('filled') == 'true'))
        // console.log(cell[0]);
        // if(cell.attr('filled') == 'true'){
        //     return true;
        // }
        // console.log('y?', this.y >= (16-this.shape.shape.length));
        // return false;
        // console.log($('.current-block'));
        return this.#map_block(this,shape,(block,shape,row,current_block,i,j)=>{
            let row_below = $('#you .row').eq(block.y + i + 1);
            // console.log('cb',current_block[j]);
            // console.log(row_below.children().eq(this.x+j)[0]);
            // console.log(row_below.children().eq(j).attr('filled));
            // console.log('below',row_below.children().eq(j).attr('filled') == 'true');
            // console.log('grounded?',(current_block[j] && row_below.children().eq(j).attr('filled') == 'true'))
            // console.log('ground',this.y >= (16-this.shape.shape.length));
            return (current_block[j] && row_below.children().eq(block.x + j).attr('filled') == 'true' || block.y >= (16-shape.shape.length + shape.space.bottom))
        });
    }
    #sideLimit(shape,pos){
        return this.#map_block(this,shape,(block,shape,row,current_block,i,j)=>{
            // let space = (pos > 0 )? this.shape.space.right : this.shape.space.left;
            // if(this.shape.name == 'i'){
            //     console.log(this.shape);
            // }
            console.log('x is', block.x);
            console.log('right_space', shape.space.right);
            console.log('rightX is',block.x + (shape.width - shape.space.right) - 1);
            console.log('total',9 - 1);
            return (
                current_block[j] && row.children().eq(block.x+j+pos).attr('filled') === 'true' 
                || (pos < 0 && block.x == (0 - shape.space.left)) 
                || (pos > 0 && (block.x + (shape.width - shape.space.right) - 1) >= (10-1))
            )
        });
        // for(let i = 0; i < this.shape.shape.length; i++){
        //     let row = $('.row').eq(this.y + i);
        //     let current_block = this.shape.shape[i];
        //     for(let j = 0; j < this.shape.shape[i].length; j++){
                
        //         // if(current_block[j]){
        //         //     row.children().eq(this.x + j).addClass('current-block');
        //         //     row.children().eq(this.x + j).css('background-color',this.shape.color);
        //         // }
        //     }
        // }
    }
    #exclusiveLeftRightLimit(block,shape){
        for(let i = 0; i < shape.shape.length; i++){
            if(block.y+i < 0) continue;
            let current_block = shape.shape[i];
            let row = $('#you .row').eq(block.y + i);
            for(let j = 0; j < shape.shape[0].length; j++){
                // console.log('starting y:' + block.y + ' x:', block.x );
                // console.log('row', i);
                // console.log('right check',(current_block[j] && row.children().eq(block.x+j).attr('filled') === 'true'));
                // console.log('left check', (current_block[j] && row.children().eq(block.x+j).attr('filled') === 'true'));
                if(current_block[j] && row.children().eq(block.x + j).attr('filled') == 'true') return true;
                // if(current_block[j] && row.children().eq(block.x+j+1).eq())
                // return true;
            }
        }
        return false;
    }
    #map_block(block,shape,callback){
        for(let i = 0; i < shape.shape.length; i++){
            if(block.y+i<0) continue;
            let row = $('#you .row').eq(block.y + i);
            let current_block = shape.shape[i];
            for(let j = 0; j < shape.shape[i].length; j++){
                if(callback(block,shape,row,current_block,i,j)){
                    return true;
                };
                // if(current_block && row.children().eq(this.x+j+pos).attr('filled') === 'true' || (pos < 0 && this.x == (0 - this.shape.orientation.left_space)) || (pos > 0 && this.x == (9-1))){
                //     return true;
                // }
                // if(current_block[j]){
                //     row.children().eq(this.x + j).addClass('current-block');
                //     row.children().eq(this.x + j).css('background-color',this.shape.color);
                // }
            }
        }
        return false;
    }
    #checkCompleteRows(){
        let rows = $('#you .row');
        console.log('checking... ',rows.length, ' rows');
        for(let row = 0; row < rows.length; row++){
            let cols = rows.eq(row).children();
            let isComplete = true;
            // console.log('checking... ',cols.length, ' cols');
            for(let col = 0; col < cols.length; col++){
                // console.log('checking... ',col);
                // console.log(cols.eq(col).attr('filled'));
                if(cols.eq(col).attr('filled') == 'false'){
                    isComplete = false;
                }
            }
            // console.log('row ' + row + ' is complete?: ',isComplete)
            if(isComplete){
                rows.eq(row).hide();
                let new_row = document.createElement('div');
                new_row.classList.add('row');
                for(let i = 0; i < cols.length; i++){
                    let new_col = document.createElement('div');
                    new_col.classList.add('cell');
                    new_col.setAttribute('filled',false);
                    // new_col.attr('filled', false);
                    new_row.appendChild(new_col);
                }
                $('#you').prepend(new_row);
                setTimeout(function(){
                    rows.eq(row).remove();
                },500);
            }
        }
    }
}