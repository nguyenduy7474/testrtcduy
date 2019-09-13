var socket = io("https://testrtcduy.herokuapp.com")
//var socket = io("localhost:3000")



navigator.getUserMedia = navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia;
var p = null
var p2 = null

function bindEvent(p){

    p.on('err', (err) => {
        console.log("loi~: ", err)
    })

    p.on('signal', (data) => {
        console.log('aa')
        $("#offer").val(JSON.stringify(data))
    })

    p.on('stream', (stream) =>{
        var friendStream = document.getElementById("friendStream")
        friendStream.srcObject = stream
        friendStream.play()
    })

}

socket.on('SendOfferConnect', (offer) => {
    
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then((stream) => {
        p2 = new SimplePeer({
            initiator: false,
            stream: stream,
            trickle: false
        })
        

        p2.on('signal', (answer) => {
            console.log(answer)
            socket.emit("SendAnswerToServer", {answer: answer, idsocket: offer.idsocket})
        })
        p2.signal(JSON.parse(offer.offer))

        p2.on('stream', (stream) =>{
            var friendStream = document.getElementById("friendStream")
            friendStream.srcObject = stream
            friendStream.play()
        })

        var localStream = document.getElementById("localStream")
            localStream.srcObject = stream;
            localStream.play()
    })
    .catch((err) => {})
})

$("#start").click(() => {
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then((stream) => {
            p = new SimplePeer({
                initiator: true,
                stream: stream,
                trickle: false
            })

            p.on('signal', (offer) => {
                socket.emit("SendOfferToServer", offer)
            })

            var localStream = document.getElementById("localStream")
            localStream.srcObject = stream;
            localStream.play()
        })
    .catch((err) =>{console.log(err)})
})

socket.on('SendAnswerToConnect', (answer) => {
    p.signal(answer)
    p.on('signal', () => {
        console.log('s')
    })
    p.on('stream', (stream) =>{
        var friendStream = document.getElementById("friendStream")
        friendStream.srcObject = stream
        friendStream.play()
    })

})