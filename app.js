var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port, function () {
	console.log('Server listening at port %d', port);
});

// Static HTML files
app.use(express.static(path.join(__dirname, 'Public')));

var users = {

}

var messages = [];

// Sockets connect
io.sockets.on("connection", function(socket){

    socket.on("new-msg", function(msg){
    	console.log("new message")
    	messages.push(users[socket.id])
    	messages.push(msg)
        socket.emit("msg", messages)
        socket.broadcast.emit("msg", messages)
    })

    socket.on("register", function(username){
    	if (username != "" && username != null) {
    		var username = username
 			jah = false
 			for (var i = 0; i < Object.keys(users).length; i++){
 				console.log(Object.keys(users))
 				if (users[Object.keys(users)[i]] == username){
 					jah = true
 					delete users[Object.keys(users)[i]]
 					users[socket.id] = username
 				}
 			}
 			if (!jah){
    			users[socket.id] = username
				messages.push(1)
				messages.push(username + " joined")
				socket.broadcast.emit("msg", messages)
			}
    		console.log(users[socket.id], " - ", socket.id)
    	}else{
    		socket.disconnect()
    		console.log("Connection terminated")
    		console.log("User kicked")
    		console.log("Reason: ", "NO_NAME")
   		}
	})

	socket.on("clearChat", function(){
		messages = []
	})


    setTimeout(function(){
    	socket.emit("messages", messages)}, 200)

    console.log()
    console.log("New connection")

    socket.on("disconnect", function(){
    	var lastId = socket.id
    	setTimeout(function(){
    		for (var i = 0; i < Object.keys(users).length; i++){
    			if (Object.keys(users)[i] == lastId){
    				messages.push(1)
    				messages.push(users[Object.keys(users)[i]] + " left")
    				socket.broadcast.emit("msg", messages)
    				delete users[lastId]
    			}
    		}
    	}, 1000)
    })
});