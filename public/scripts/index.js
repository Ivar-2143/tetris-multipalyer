const socket = io();
const game = new Game(socket);
let player;
if(player_name){
    socket.emit('new_user',{name: player_name});
}

socket.on('user_credential', function(data){
    player = new Player(data.id, data.name);
});

socket.on('user_joined', function(data){
    pop_up(data.user, data.msg);
    update_player_section(data.users);
});

socket.on('players_in_battle', function(data){
    pop_up(data.user, data.msg);
    update_player_section(data.users);
    if(data.user.id == player.id && data.user.isPlaying){
        $('.players button').toggle();
        $('#btn_ready').fadeIn();
    }
    update_players_ready(data);
});


socket.on('players_ready', function(data){
    if(data.user.id == player.id){
        $('#btn_ready').attr('disabled', 'disabled');
    }
    update_players_ready(data);
});

socket.on('start_game', function(data){
    let countdown = $('.countdown');
    countdown.append('<h3>Starting in...</h3>');
    let counter = 3;
    countdown.append('<h3 class="timer">'+counter+' </h3>');
    setTimeout(function(){
        counter--;
        $('.timer').html(counter);
    },1000);
    setTimeout(function(){
        counter--;
        $('.timer').html(counter);
    },2000);
    setTimeout(function(){
        countdown.html('');
        $('.players_ready').html('');
        $('#btn_ready').hide();
        game.gameloop();
    },3000);
});

socket.on('game_state_changed', function(data){
    let board_id = data.user.name + '_' + data.user.id;
    let board_rows = $('#'+board_id + ' .row');
    for(let row = 0; row < board_rows.length; row++){
        for(let col = 0; col < board_rows.eq(0).children().length; col++){
            if(data.board[row][col] != 'undefined'){
                board_rows.eq(row).children().eq(col).attr('style', data.board[row][col]);
            }
        }
    }
})

$('#btn_join-battle').on('click', function(){
    socket.emit('join_battle');
})
$('#btn_ready').on('click', function(){
    socket.emit('i_am_ready');
});


// let draw_rate = 1000/60;
// setInterval(()=>game.gameloop(),20);
// game.gameloop();

$(document).on('keydown', function(e){
    game.controller.keyPress(e.keyCode);         
});
$(document).on('keyup', function(e){
    game.controller.keyLifted(e.keyCode);
});

function pop_up(user,msg){
    let user_name = (user.id == player.id)? user.name + '(You)' : user.name;
    $('#pop_up').html('<span>'+ user_name + '</span> ' + msg );
    $('#pop_up').show();
    setTimeout(function(){
        $('#pop_up').fadeOut();
    },1000);
}
function update_player_section(users){
    $('.players_in_battle').html('<h4>In-Battle</h4>');
    $('.other_players').html('<h4>Other players</h4>');
    for(key in users){
        console.log('users');
        let user = users[key];
        let user_name = (user.id == player.id)? user.name+'(You)' : user.name;
        let element = document.createElement('p');
        element.innerHTML = user_name;
        element.id = user.id;
        if(user.isPlaying){
            $('.players_in_battle').append(element);
        }else{
            $('.other_players').append(element);
        }
    }
}
function patch_player_name(user){
    return (user.id == player.id)? user.name+'(You)' : user.name
}
function update_players_ready(data){
    let players_ready = 0;
    for(key in data.in_battle){
        // console.log(key, data.in_battle[key]);
        let user = data.in_battle[key];
        let board = $('.game_frame').eq(key);
        let player_name = patch_player_name(user);
        board.find('h1').html(player_name);
        if(player.id == user.id){
            board.attr('id','you');
        }else{
            let board_id = user.name+'_'+user.id;
            console.log('enemy', board_id);
            board.attr('id',board_id);
        }
        if(user.isReady){
            players_ready++;
        }
        // console.log(data.in_battle[key]);
    }
    $('.players_ready').html('Players Ready ' + players_ready + '/' + data.in_battle.length);
}
