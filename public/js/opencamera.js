var socket = io("https://testrtcduy.herokuapp.com/")



navigator.getUserMedia = navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia;
var p = null
var p2 = null
var stream1 = null
var stream2 = null
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

/*$("#start").click(() => {
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then((stream) => {

        p = new SimplePeer({
            initiator: true,
            stream: stream,
            trickle: false
        })

        bindEvent(p)


        var localStream = document.getElementById("localStream")
        localStream.srcObject = stream;
        localStream.play()
    })
    .catch((err) =>{console.log(err)})

})*/

/*$("#receiver-connect").click(() => {
    if(p == null){
        navigator.mediaDevices.getUserMedia({video: true, audio: false})
        .then((stream) => {
            p = new SimplePeer({
                initiator: false,
                stream: stream,
                trickle: false
            })
            console.log(p)
            p.signal(JSON.parse($("#answer").val()))
            bindEvent(p)


            var localStream = document.getElementById("localStream")
            localStream.srcObject = stream;
            localStream.play()
        })
        .catch((err) => {})
    }else{
        p.signal(JSON.parse($("#answer").val()))
        bindEvent(p)
    }
})*/
/*function senddataoffer(offer, peer){
    $.ajax({
        type: "POST",
        url: "/nhanoffer",
        data: {offer: offer, peer: peer},
        success: function(data){
            console.log('doi ket noi')
        }
    })
}*/

/*function senddataanswer(answer, id){
    console.log(id)
    $.ajax({
        type: "POST",
        url: "/nhananswer",
        data: {answer: answer, id: id},
        success: function(data){
            console.log('ok r đó')
        }
    })
}*/



socket.on('SendOfferConnect', (offer) => {
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then((stream) => {
        p2 = new SimplePeer({
            initiator: false,
            stream: stream,
            trickle: false
        })
        
        p2.signal(JSON.parse(offer.offer))

        p2.on('signal', (answer) => {
            socket.emit("SendAnswerToServer", {answer: answer, idsocket: offer.idsocket})
        })

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
            stream1 = stream
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
    console.log(answer)
    p.signal(answer)
    p.on('signal', () => {
        console.log('s')
    })
/*    p.on('stream', (stream) =>{
        var friendStream = document.getElementById("friendStream")
        friendStream.srcObject = stream
        friendStream.play()
    })*/
})