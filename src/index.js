const express = require('express')
const path = require('path')
const http  =require('http')
const socketio =require('socket.io')
const Filter =  require('bad-words')
const {generateMessage,generateLocation} = require('./utils/message')
const { addUser,removeUser,getUser, getUsersInRoom} = require('./utils/users')

const app= express()
const server = http.createServer(app)
const io = socketio(server)
const port = process.env.PORT || 3000

const publicDirectoryPath = path.join(__dirname,'../public')

app.use(express.static(publicDirectoryPath))

// let count= 0
//  io.on('connection',(socket)=>{
//      console.log('New WebSocket Connection')
//     socket.emit('countUpdated',count)
//     socket.on('increment',()=>{
//         count++
//         socket.emit('countUpdated',count)
//         io.emit('countUpdated',count)

//     })
//  })
io.on('connection',(socket)=>{
    console.log("New Connection!");

    // socket.emit('message',generateMessage('Welcome'))
    // socket.broadcast.emit('message',generateMessage('A new User has Joined'))

    socket.on('join',({username,room},callback)=>{
        const {error,user} = addUser({ id:socket.id ,  username ,  room })
        
        if(error){
            return callback(error)
        }
        
        socket.join(user.room)
    
    socket.emit('message',generateMessage('Admin','Welcome'))
    socket.broadcast.to(user.room).emit('message',generateMessage('Admin',`${user.username} has joined the room`))
    io.to(user.room).emit('roomData',{
        room: user.room,
        users: getUsersInRoom(user.room)
    })
    callback()
    })

    socket.on('sendMessage',(message,callback)=>{
        const user = getUser(socket.id)
        const filter = new Filter()
        if(filter.isProfane(message)){
            return callback('this is not allowed')
        }
        io.to(user.room).emit('message',generateMessage(user.username,message))
        callback()
    })



socket.on('sendLocation',(coords,callback)=>{
    const user = getUser(socket.id)
        io.to(user.room).emit('locationmsg',generateLocation(user.username,`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    }) 

socket.on('disconnect',()=>{

    const user = removeUser(socket.id)

    if(user){
                io.to(user.room).emit('message',generateMessage('Admin',`${user.username} has left!`))
            io.to(user.room).emit('roomData',{
        room: user.room,
        users: getUsersInRoom(user.room)
    })
     
    }
        // io.emit('message',generateMessage('A user has just left'))
    })
})
server.listen(port,()=>{
    console.log(`Server is running on ${port}`)
})