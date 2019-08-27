/*function opencamera(){
    navigator.mediaDevices.getUserMedia({ audio: false, video: {width: 300, height: 160}}).then(function(mediaStream) {
        var video = document.getElementById("localStream")
        video.srcObject = mediaStream;
        video.play();

        var peer1 = new SimplePeer({ initiator: true })
        var peer2 = new SimplePeer()

        peer1.on('signal', data => {
          // when peer1 has signaling data, give it to peer2 somehow
          peer2.signal(data)
        })

        peer2.on('signal', data => {
          // when peer2 has signaling data, give it to peer1 somehow
          peer1.signal(data)
        })

        peer1.on('connect', () => {
          // wait for 'connect' event before using the data channel
          peer1.send('hey peer2, how is it going?')
        })

        peer2.on('data', data => {
          // got a data channel message
          console.log('got a message from peer1: ' + data)
        })
    }).catch((err) => console.log(err))
}

opencamera()*/
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia
var p = null


function bindEvent(p){

    p.on('err', (err) => {
        console.log("loi~: ", err)
    })

    p.on('signal', (data) => {
        $("#offer").val(JSON.stringify(data))
    })

    p.on('stream', (stream) =>{
        var friendStream = document.getElementById("friendStream")
        friendStream.srcObject = stream
        friendStream.play()
    })

}

$("#start").click(() => {
    navigator.getUserMedia({video: true, audio: false}, (stream) => {

        p = new SimplePeer({
            initiator: true,
            stream: stream,
            trickle: false
        })

        bindEvent(p)


        var localStream = document.getElementById("localStream")
        localStream.srcObject = stream;
        localStream.play()
    }, (err) => {})

})

$("#receiver-connect").click(() => {
    if(p == null){
        navigator.getUserMedia({video: true, audio: false}, (stream) => {
            console.log("aa")
            p = new SimplePeer({
                initiator: false,
                trickle: false
            })
            p.signal(JSON.parse($("#answer").val()))
            bindEvent(p)


            var localStream = document.getElementById("localStream")
            localStream.srcObject = stream;
            localStream.play()
        }, (err) => {})
    }else{
        p.signal(JSON.parse($("#answer").val()))
        bindEvent(p)
    }
})

