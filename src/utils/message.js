const generateMessage = (username,text) =>{
    return {
        username,
        text,
        createdAt: new Date().getTime()
    }
}
const generateLocation = (username,locURL) =>{
    return {
        username,
        locURL,
        createdAt: new Date().getTime()
    }
}
module.exports={
    generateMessage,
    generateLocation
}