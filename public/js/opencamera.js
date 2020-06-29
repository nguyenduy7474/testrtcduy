//var socket = io("https://testrtcduy.herokuapp.com")
//var socket = io("localhost:3000")
var socket = io("https://c46ba683f1da.ngrok.io")


navigator.mediaDevices.getUserMedia = navigator.mediaDevices.getUserMedia || 
                            navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia;
var p = null
var p2 = null
var currentStream;
var friendstream;
var dvid = []

$( document ).ready(function() {
    $("#noichuyen").show()
});

async function startchat(deviceid, roomnumber, type, contraint = {/*video: {height: {min: 480, max: 1080}, width: {min: 640, max: 1920}, aspectRatio: 16/9}, */audio: true}){
    if(type == "call"){
        //contraint.video.deviceId = {exact: deviceid}
        let stream = await navigator.mediaDevices.getUserMedia(contraint)

        currentStream = stream

        p = new SimplePeer({
            initiator: true,
            stream: stream,
            trickle: false,
            config: { iceServers: [
                    {urls:'stun:stun.l.google.com:19302' },
                    {urls:'stun:stun1.l.google.com:19302' },
                    {urls:'stun:stun2.l.google.com:19302' },
                    {urls:'stun:stun3.l.google.com:19302' },
                    {urls:'stun:stun4.l.google.com:19302' },
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
/*                    {
                        url: 'turn:103.90.224.63',
                        credential: 'duy123456789',
                        username: 'nguyenduy7474'
                    },*/

                ] 
            }
        })

        p.on('signal', (offer) => {
            socket.emit("SendOfferToServer", {offer: offer, roomnumber: roomnumber, type: type})
        })

        p.on('stream', (stream) =>{
            var friendStream = document.getElementById("friendStream")
            
            friendStream.srcObject = stream
            friendstream = stream
            var isPlaying = friendStream.currentTime > 0 && !friendStream.paused && !friendStream.ended 
                    && friendStream.readyState > 2;
            if (!isPlaying) {
              friendStream.play()
            }
        })

        
        var localStream = document.getElementById("localStream")
        localStream.srcObject = stream;
        localStream.muted = true;
        localStream.play();

    }else{
            let stream = await navigator.mediaDevices.getUserMedia({video: false, audio: true})
            currentStream = stream

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
                    ] 
                }
            })

            p.on('signal', (offer) => {
                socket.emit("SendOfferToServer", {offer: offer, roomnumber: roomnumber, type: type})
            })

            p.on('stream', (stream) =>{
                var friendStream = document.getElementById("friendStream")
                friendstream = stream
                friendStream.srcObject = stream
                var isPlaying = friendStream.currentTime > 0 && !friendStream.paused && !friendStream.ended 
                        && friendStream.readyState > 2;
                if (!isPlaying) {
                  friendStream.play()
                }
            })
            
/*                var localStream = document.getElementById("localStream")
            localStream.srcObject = stream;
            currentStream = stream
            localStream.muted = true;
            localStream.play();*/
        
    }
    
}

socket.on('listphong', (listphong) => {
    let offer
    let a
    for(var i=0; i<listphong.length; i++){
        offer = JSON.stringify(listphong[i].offer)
        a = `<tr><td width="69%" height="100%" style="border: 1px black solid">
            `+ listphong[i].roomnumber +`
        </td>
        <td width="69%" height="100%" style="border: 1px black solid">`

        a += "<button type='button' class='btn btn-success btn-lg' onclick='sharescreennha(`"+ listphong[i].roomnumber +"`, "+ offer +", `"+ listphong[i].idsocket +"`, `"+ listphong[i].res +"`)'>Nói chuyện</button>"


        a += `</td></tr>`
        $("#dong").append(a)
    }

})

/*$("#startback").click(() => {
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


    startchat({video: {facingMode: 'environment'}, audio: true})
})*/

socket.on('SendAnswerToConnect', (answer) => {
    answer = answer.answer
    p.signal(answer)
    p.on('signal', () => {
        console.log('ok')
    })
})

socket.on('Peerdisconnect', (dis) => {
    console.log('ss')
    var friendStream = document.getElementById("friendStream")
    friendStream.load()
})

function stopMediaTracks() {
  currentStream.getTracks().forEach(track => {
    track.stop();
  });
  friendstream.getTracks().forEach(track => {
    track.stop();
  });
}

socket.on('showpeer', (data) => {
    var offer = JSON.stringify(data.offer)
    console.log(data)
    var a = `<tr><td width="69%" height="100%" style="border: 1px black solid">
            `+ data.roomnumber +`
        </td>
        <td width="69%" height="100%" style="border: 1px black solid">`

        a += "<button type='button' class='btn btn-success btn-lg' onclick='sharescreennha(`"+ data.roomnumber +"`, "+ offer +", `"+ data.idsocket +"`, `"+ data.res +"`)'>Nói chuyện</button>"


        a += `</td></tr>`
    $("#dong").append(a)
})

function send(deviceid){
    var roomnumber = $("#roomnumber").val()
    var type = "call"
    startchat(deviceid, roomnumber, type)

}

function sharescreen(){
    var roomnumber = $("#roomnumber").val()
    var type = "sharescreen"
    startchat(null, roomnumber, type, {video: {width: 854, height: 480, aspectRatio: 16/9, frameRate: { ideal: 30,}}, audio: false})

}

async function sharescreennha(roomnumber, offer, idsocket, res){
    
let stream =await navigator.mediaDevices.getUserMedia({video: false, audio: true})
        
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
                ] 
            }
        })

        p2.on('signal', (answer) => {
            socket.emit("SendAnswerToServer", {answer: answer, roomnumber: roomnumber, idsocket: idsocket})
        })

        p2.signal(offer)

        p2.on('stream', (stream) =>{
            var friendStream = document.getElementById("friendStream")

            friendStream.srcObject = stream
            friendstream = stream
            var isPlaying = friendStream.currentTime > 0 && !friendStream.paused && !friendStream.ended 
                    && friendStream.readyState > 2;
            if (!isPlaying) {
              friendStream.play()
            }
        })

        var localStream = document.getElementById("localStream")
        localStream.srcObject = stream;
        currentStream = stream
        localStream.muted = true;
        localStream.play()
    
}


async function startcall(roomnumber, offer, idsocket, dvid){
    console.log(dvid)
    let contraint = {/*video: {height: {min: 480, max: 1080}, width: {min: 640, max: 1920}, aspectRatio: 16/9}, */audio: true}
    //contraint.video.deviceId = {exact: dvid}

    let stream = await navigator.mediaDevices.getUserMedia(contraint)
    console.log(contraint)

    currentStream = stream

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
            ] 
        }
    })

    p2.on('signal', (answer) => {
        socket.emit("SendAnswerToServer", {answer: answer, roomnumber: roomnumber, idsocket: idsocket})
    })

    p2.signal(offer)

    p2.on('stream', (stream) =>{
        var friendStream = document.getElementById("friendStream")
        friendStream.srcObject = stream
        friendstream = stream
        var isPlaying = friendStream.currentTime > 0 && !friendStream.paused && !friendStream.ended 
                && friendStream.readyState > 2;
        if (!isPlaying) {
          friendStream.play()
        }
    })

    var localStream = document.getElementById("localStream")
    localStream.srcObject = stream;
    localStream.muted = true;
    localStream.play()
}
