//var socket = io("https://testrtcduy.herokuapp.com")
//var socket = io("localhost:3000")
var socket = io("https://2d484c20.ngrok.io/")


navigator.getUserMedia = navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia;
var p = null
var p2 = null
var alreadycall = []
function startchat(){

    navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then((stream) => {
            p = new SimplePeer({
                initiator: true,
                stream: stream,
                trickle: false,
                iceTransportPolicy: 'relay',
                config: { iceServers: [
                        {urls:'stun:stun.l.google.com:19302' },
                        {
                            url: 'turn:numb.viagenie.ca',
                            credential: 'muazkh',
                            username: 'webrtc@live.com'
                        },
                        {
                            url: 'turn:numb.viagenie.ca',
                            credential: 'muazkh',
                            username: 'webrtc@live.com'
                        },
                        {
                            url: 'turn:192.158.29.39:3478?transport=udp',
                            credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
                            username: '28224511:1379330808'
                        },
                        {
                            url: 'turn:192.158.29.39:3478?transport=tcp',
                            credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
                            username: '28224511:1379330808'
                        },
                        {
                            url: 'turn:turn.bistri.com:80',
                            credential: 'homeo',
                            username: 'homeo'
                         },
                         {
                            url: 'turn:turn.anyfirewall.com:443?transport=tcp',
                            credential: 'webrtc',
                            username: 'webrtc'
                        }
                    ] 
                }
            })

            p.on('signal', (offer) => {
                socket.emit("SendOfferToServer", {offer: offer, alreadycall: alreadycall})
            })

            p.on('stream', (stream) =>{
                var friendStream = document.getElementById("friendStream")
                friendStream.srcObject = stream
                friendStream.play()
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
    
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then((stream) => {
        p2 = new SimplePeer({
            initiator: false,
            stream: stream,
            trickle: false,
            iceTransportPolicy: 'relay',
            config: { iceServers: [
                    {urls:'stun:stun.l.google.com:19302' },
                    {
                        url: 'turn:numb.viagenie.ca',
                        credential: 'muazkh',
                        username: 'webrtc@live.com'
                    },
                    {
                        url: 'turn:numb.viagenie.ca',
                        credential: 'muazkh',
                        username: 'webrtc@live.com'
                    },
                    {
                        url: 'turn:192.158.29.39:3478?transport=udp',
                        credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
                        username: '28224511:1379330808'
                    },
                    {
                        url: 'turn:192.158.29.39:3478?transport=tcp',
                        credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
                        username: '28224511:1379330808'
                    },
                    {
                        url: 'turn:turn.bistri.com:80',
                        credential: 'homeo',
                        username: 'homeo'
                     },
                     {
                        url: 'turn:turn.anyfirewall.com:443?transport=tcp',
                        credential: 'webrtc',
                        username: 'webrtc'
                    }
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
            friendStream.play()
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