
navigator.getUserMedia = navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia;
var p = null


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

$("#start").click(() => {
    navigator.mediaDevices.getUserMedia({video: true, audio: false}, (stream) => {

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
        navigator.mediaDevices.getUserMedia({video: true, audio: false}, (stream) => {
            console.log("aa")
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
        }, (err) => {})
    }else{
        p.signal(JSON.parse($("#answer").val()))
        bindEvent(p)
    }
})

