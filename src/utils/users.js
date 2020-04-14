const users = []


//addUser , removeUser , getUser , getUsersInRoom

const addUser = ({ id , username , room })=>{
    //clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

//validate the data
    if(!username || !room){
        return {
            error:'Username and room both are required!'
        }
    }
    //check for existing user
    const existingUser  = users.find((user)=>{
        return user.room === room && user.username === username
    })
    //Validate username
    if(existingUser){
      return {
            error:'Username is in use!'
        }
    }

//store user

const user = {id,username,room}
users.push(user)
return { user }
}

//remove user
const removeUser=(id)=>{
    const index= users.findIndex((user)=>{
        return user.id === id
    })
    if(index!==-1){
        return users.splice(index,1)[0]
    }
}
//getUser
const getUser = (id)=>{
    return users.find((user)=> user.id === id)
}

//getUsersInRoom
const getUsersInRoom = (room)=>
{
    room = room.trim().toLowerCase()
    return users.filter((user)=> user.room === room)
}

// addUser({
//     id:1,
//     username:'vishal',
//     room:'a'
// })

// addUser({
//     id:2,
//     username:'avi',
//     room:'a'
// })

// addUser({
//     id:3,
//     username:'vishal',
//     room:'b'
// })

// const user= getUser(2)

// console.log(user)

// const userList = getUsersInRoom('a')
// console.log(userList)

// // const removedUser = removeUser(1)
// // console.log(removedUser)
// // console.log(users)

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}