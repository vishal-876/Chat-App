const socket=io()
//Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput=$messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $messages = document.querySelector('#messages')
//location
const $sendlocationButton =document.querySelector('#send-location')
// socket.on('countUpdated',(count)=>{
//     console.log('kya haal',count);   
// })
// document.querySelector('#increment').addEventListener('click',()=>{
// console.log("Clicked")
// socket.emit('increment')

// })

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate  = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML
//options
const {username,room} = Qs.parse(location.search,{ignoreQueryPrefix:true})

const  autoscroll = () => {
    //new msg element
    const $newMessage = $messages.lastElementChild

    //Height of last msg
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt( newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    //visible height
    const visibleHeight = $messages.offsetHeight

    //height of messages container
    const containerHeight = $messages.scrollHeight

    //how far have i scrolled
    const scrollOffset = $messages.scrollTop + visibleHeight

    if((containerHeight - newMessageHeight) <= scrollOffset){
        $messages.scrollTop = $messages.scrollHeight
    }
}

socket.on('message', (message)=>{
    console.log(message);
    const html = Mustache.render(messageTemplate,{
       username:message.username,
        message:message.text,
        createdAt:moment(message.createdAt).format('HH:mm A')
    })
    $messages.insertAdjacentHTML('beforeend',html)

    autoscroll()
})

socket.on('locationmsg',(url)=>{
    console.log(url)
        const html = Mustache.render(locationTemplate,{
        username:url.username,
        url:url.locURL,
        createdAt:moment(url.createdAt).format('HH:mm A')
    })
    $messages.insertAdjacentHTML('beforeend',html)

     autoscroll()
})

socket.on('roomData',({room,users})=>{
        const html = Mustache.render(sidebarTemplate,{
            room,
            users
        })
    document.querySelector('#sidebar').innerHTML = html
})

 $messageForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    //disable
    $messageFormButton.setAttribute('disabled','disabled') 
    // const message = document.querySelector('input').value
    const message = e.target.elements.message.value
    socket.emit('sendMessage',message,(error)=>{
        //enable
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
       if(error){
           console.log(error)
       }
        console.log("The message delivered")
    })
})


$sendlocationButton.addEventListener('click',()=>{

if(!navigator.geolocation){
   return alert("not found")   
}
$sendlocationButton.setAttribute('disabled','disabled')

navigator.geolocation.getCurrentPosition((position)=>{
  
  socket.emit('sendLocation',{
  latitude: position.coords.latitude,
  longitude: position.coords.longitude
  },()=>{
      $sendlocationButton.removeAttribute('disabled')
      console.log("Location Shared")
  })
})
})
socket.emit('join',{username,room},(error)=>{

if(error){
    alert(error)
    location.href = '/'
}
})