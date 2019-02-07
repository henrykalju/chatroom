console.log("start")

form = document.getElementById("form")

form.onsubmit = function(event){
	event.preventDefault()
	username = event.target.name.value
	localStorage.setItem("username", username)

	window.location.href = "/chat.html"
}