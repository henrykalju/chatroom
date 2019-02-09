console.log("start");

var socket = io();

input = document.getElementById("input");
ul = document.getElementById("main-list");

setTimeout(function(){
	socket.emit('register', localStorage.getItem('username'))
},100)


input.addEventListener("keyup", function(event){
	event.preventDefault()
	var keypressed = event.keyCode

	if (!input.value.replace(/\s/g, '').length) {
  		input.value = ""
	}


	if (keypressed == 13 && input.value.slice(0, input.value.length - 1) != "") {
		socket.emit("new-msg", input.value)
		input.value = ""
	} else if(input.value.slice(0, input.value.length) == ""){
		input.value = ""
	}
	
})

socket.on("connect", function(){
	setTimeout(function(){
		if (socket.disconnected){
			window.location.href = "/index.html"
		}
	}, 200)
	socket.emit("register", localStorage.getItem("username"));
})

socket.on("msg", function(messages){
	if (messages[messages.length - 2] == localStorage.getItem('username')){
		add_message(messages[messages.length - 1], 1)
	}else if(messages[messages.length - 2] == 1){
		add_message(messages[messages.length - 1], 2)
	}else{
		add_message(messages[messages.length - 2] + ": " + messages[messages.length - 1])
	}
})

socket.on("messages", function(messages){
	for (var i = 0; i < messages.length; i += 2){
		if (messages[i] == localStorage.getItem('username')){
			add_message(messages[i + 1], 1)
		}else if(messages[i] == 1){
			add_message(messages[i + 1], 2)
		}else{
			add_message(messages[i] + ": " + messages[i + 1])
		}
	}
})

add_message = function(msg, sender = 0){
	nmsg = document.createElement("LI")
	if (sender == 1){
		nmsg.style = "text-align: right"
	}else if(sender == 2){
		nmsg.style = "text-align: center; font-style: italic; color: RGBA(0, 0, 0, 0.5)"
	}
	text = document.createTextNode(msg)
	nmsg.appendChild(text)
	ul.appendChild(nmsg)
	document.getElementById("chat-main").scrollTop = document.getElementById("chat-main").scrollHeight;
}