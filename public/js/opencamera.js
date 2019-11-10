//var socket = io("https://testrtcduy.herokuapp.com")
//var socket = io("localhost:3000")
var socket = io("https://2a6ee087.ngrok.io")


navigator.mediaDevices.getUserMedia = navigator.mediaDevices.getUserMedia || 
                            navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia;
var p = null
var p2 = null
var alreadycall = []
function startchat(){

    navigator.mediaDevices.getUserMedia({video: { width: 200, height: 200 }, audio: true})
    .then((stream) => {
            p = new SimplePeer({
                initiator: true,
                stream: stream,
                trickle: false,
                config: { iceServers: [
                        {urls:'stun:stun.l.google.com:19302' },
                        {
                            url: 'turn:numb.viagenie.ca',
                            credential: 'muazkh',
                            username: 'webrtc@live.com'
                        },
/*                        {
                            url: 'turn:turn.bistri.com:80',
                            credential: 'homeo',
                            username: 'homeo'
                        },*/
                    ] 
                }
            })

            p.on('signal', (offer) => {
                socket.emit("SendOfferToServer", {offer: offer, alreadycall: alreadycall})
            })

            p.on('stream', (stream) =>{
                var friendStream = document.getElementById("friendStream")
                friendStream.srcObject = stream
                /*friendStream.play()*/
                var isPlaying = friendStream.currentTime > 0 && !friendStream.paused && !friendStream.ended 
                        && friendStream.readyState > 2;
                if (!isPlaying) {
                  friendStream.play()
                }
            })

            var localStream = document.getElementById("localStream")
            localStream.srcObject = stream;
            
            var isPlaying = localStream.currentTime > 0 && !localStream.paused && !localStream.ended 
                    && localStream.readyState > 2;
                    console.log("aa " + isPlaying)
            if (!isPlaying) {
              localStream.play()
            }
        })
    .catch((err) =>{console.log(err)})
}

socket.on('SendOfferConnect', (offer) => {
    
    navigator.mediaDevices.getUserMedia({video: { width: 200, height: 200 }, audio: true})
    .then((stream) => {
        p2 = new SimplePeer({
            initiator: false,
            stream: stream,
            trickle: false,
            config: { iceServers: [
                    {urls:'stun:stun.l.google.com:19302' },
                    {
                        url: 'turn:numb.viagenie.ca',
                        credential: 'muazkh',
                        username: 'webrtc@live.com'
                    },
/*                    {
                        url: 'turn:turn.bistri.com:80',
                        credential: 'homeo',
                        username: 'homeo'
                    },*/
                ] 
            }
        })

        p2.on('signal', (answer) => {
            socket.emit("SendAnswerToServer", {answer: answer, idsocket: offer.idsocket, socketp2: socket.id})
        })

        p2.signal(JSON.parse(offer.offer))

        p2.on('stream', (stream) =>{
            var friendStream = document.getElementById("friendStream")
            friendStream.srcObject = stream
            /*friendStream.play()*/
            var isPlaying = friendStream.currentTime > 0 && !friendStream.paused && !friendStream.ended 
                    && friendStream.readyState > 2;
            if (!isPlaying) {
              friendStream.play()
            }
        })

        alreadycall.push(offer.idsocket)

        var localStream = document.getElementById("localStream")
        localStream.srcObject = stream;
        
        var isPlaying = localStream.currentTime > 0 && !localStream.paused && !localStream.ended 
                && localStream.readyState > 2;
                console.log("bb " + isPlaying)
        if (!isPlaying) {
          localStream.play()
        }
    })
    .catch((err) => {})
})

$("#start").click(() => {
    socket.disconnect()
    socket.connect()
    if(p!=null){
        p.destroy()
        var friendStream = document.getElementById("friendStream")
        friendStream.load()
    }
    if(p2!=null){
        p2.destroy()
        var friendStream = document.getElementById("friendStream")
        friendStream.load()
    }



    startchat()
})

socket.on('SendAnswerToConnect', (answer) => {
    console.log(answer)
    alreadycall.push(answer.socketp2)
    p.signal(answer.answer)
    p.on('signal', () => {
        console.log('ok')
    })
})

socket.on('Peerdisconnect', (dis) => {
    console.log('ss')
    var friendStream = document.getElementById("friendStream")
    friendStream.load()
    startchat()
})