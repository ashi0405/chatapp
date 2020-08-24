var socket=io.connect()

var username=document.getElementById('username')
var usernameForm=document.getElementById('usernameForm')
var btn=document.getElementById('submit')

btn.addEventListener('click',function(data){
    socket.emit('user',{
        username:username.value
    })
    
})


//client to server here