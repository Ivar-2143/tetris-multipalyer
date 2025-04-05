const express = require('express');
const app = express();
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
const server = app.listen(8000,()=>console.log('Listening on port 8000: http://localhost:8000/'));
const io = require('socket.io')(server);
let users = {};
let playing_players = [];

app.get('/', (req, res) => {
    res.render('index');
})

io.on('connection', function(socket){
    let user;
    socket.emit('players', {users: users});
    socket.on('new_user', function(data){
        user = data.name;
        users[socket.id] = {
            id: socket.id,
            name: user,
            isPlaying: false
        }
        socket.emit('user_credential', {id: socket.id,name:user});
        const data = {msg:'joined the game.',user: {id: socket.id, name:user}, users: users}
        io.emit('user_joined', );
        // socket.broadcast.emit('user_joined', {msg: user + ' joined the game.', users: users})
    });

    socket.on('join_battle', function(){
        if(playing_players.length == 2){
            socket.emit('players_full', {msg: '2 Players are only allowed to join. Please wait \'till the game is done.'});
        }else{
            let arr_length = playing_players.length;
            users[socket.id].isPlaying = true;
            playing_players[arr_length] = users[socket.id];
            playing_players[arr_length].isReady = false;
            io.emit('players_in_battle',{msg: 'joined the battle.', user: users[socket.id],users: users, in_battle: playing_players});
        }
    });

    socket.on('i_am_ready', function(data){
        for(let i = 0; i < playing_players.length; i++){
            if(playing_players[i].id == socket.id){
                playing_players[i].isReady = true;
                io.emit('players_ready', {user: users[socket.id], in_battle: playing_players});
            }
            if(playing_players[i].id != socket.id && playing_players[i].isReady){
                io.emit('start_game', {})
            }
        }
    });

    socket.on('state_changed',function(data){
        //Send the HTML data of the board;
        // console.log(data);
        socket.broadcast.emit('game_state_changed', {user: users[socket.id],board: data.board});
    })

    socket.on('i_lost', function(data){
        let winner;
        for(let i = 0; i < playing_players.length; i++){
            if(playing_players[i].id != socket.id){
                winner = playing_players[i];
            }
        }
        playing_players = [];
        socket.broadcast.emit('game_over', {winner: winner, loser: users[socket.id], action: reset});
    })

    socket.on('disconnect', function(reason){
        delete users[socket.id];
        socket.broadcast.emit('user_left', {
            msg: user+' has left the game.',
            users: users
        })
    });
});