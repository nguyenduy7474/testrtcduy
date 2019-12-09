var socket = io("https://testrtcduy.herokuapp.com")
//var socket = io("localhost:3000")
/*var socket = io("https://ca494614.ngrok.io")*/


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
    window.mobilecheck = function() {
      var check = false;
      (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
      return check;
    };

    if(!window.mobilecheck()){
        $("#sharescreen480").show()
        $("#sharescreen720").show()
        $("#sharescreen1080").show()
    }

    navigator.mediaDevices.enumerateDevices()
    .then(function(devices) {
        let count = 1
      devices.forEach(function(device) {
        if(device.kind == "videoinput"){
            dvid.push(device.deviceId)
            $("#call").append(`<button type="button" class="btn btn-success btn-lg" onclick="send('` + device.deviceId + `')">Camera `+ count +`</button>&nbsp;&nbsp;`)
            count++
        }
      });

    })
    .catch(function(err) {
      console.log(err.name + ": " + err.message);
    });
});

async function startchat(deviceid, roomnumber, type, contraint = {video: {height: {min: 480, max: 1080}, width: {min: 640, max: 1920}, aspectRatio: 16/9}, audio: true}){
    if(type == "call"){
        contraint.video.deviceId = {exact: deviceid}
        console.log(contraint)
        let stream = await navigator.mediaDevices.getUserMedia(contraint)

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
        if(window.mobilecheck() == false){
            let desktopStream = await navigator.mediaDevices.getDisplayMedia(contraint)
            let streamaudio = await navigator.mediaDevices.getUserMedia({video: false, audio: true})

            let tracks = [...desktopStream.getTracks(), ...streamaudio.getAudioTracks()]
            let stream = new MediaStream(tracks);
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
                socket.emit("SendOfferToServer", {offer: offer, roomnumber: roomnumber, type: type, res: contraint.video.height})
            })



            p.on('stream', (stream) =>{
                var friendStream = document.getElementById("friendStream")

                console.log(stream.getTracks())
                friendStream.srcObject = stream
                friendstream = stream
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

        if(listphong[i].type == "call"){
            for(var i = 0; i< dvid.length; i++){
                a += "<button type='button' class='btn btn-success btn-lg' onclick='startcall(`"+ listphong[i].roomnumber +"`, "+ offer +", `"+ listphong[i].idsocket +"`, `" + dvid[i] + "`)'>Camera "+ (i+1) +"</button>"
            }
        }else{
            a += "<button type='button' class='btn btn-success btn-lg' onclick='sharescreennha(`"+ listphong[i].roomnumber +"`, "+ offer +", `"+ listphong[i].idsocket +"`, `"+ listphong[i].res +"`)'>share screen</button>"
        }

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

        if(data.type == "call"){
            for(var i=0; i< dvid.length; i++){
                a += "<button type='button' class='btn btn-success btn-lg' onclick='startcall(`"+ data.roomnumber +"`, "+ offer +", `"+ data.idsocket +"`, `" + dvid[i] + "`)'>Camera "+ (i+1) +"</button>"
            }
        }else{
            a += "<button type='button' class='btn btn-success btn-lg' onclick='sharescreennha(`"+ data.roomnumber +"`, "+ offer +", `"+ data.idsocket +"`, `"+ data.res +"`)'>share screen</button>"
        }

        a += `</td></tr>`
    $("#dong").append(a)
})

function send(deviceid){
    var roomnumber = $("#roomnumber").val()
    var type = "call"
    startchat(deviceid, roomnumber, type)

}

function sharescreen(res){
    var roomnumber = $("#roomnumber").val()
    var type = "sharescreen"
    if(res == "480"){
        startchat(null, roomnumber, type, {video: {width: 854, height: 480, aspectRatio: 16/9, frameRate: { ideal: 30,}}, audio: false})
    }else if(res == "720"){
        startchat(null, roomnumber, type, {video: {width: 1280, height: 720, aspectRatio: 16/9, frameRate: { ideal: 30}}, audio: false})
    }else{
        startchat(null, roomnumber, type, {video: {width: 1920, height: 1080, aspectRatio: 16/9, frameRate: { ideal: 30}}, audio: false})
    }
    
}

async function sharescreennha(roomnumber, offer, idsocket, res){
    
    if(window.mobilecheck() == false){
        let contraint
        if(res == "480"){
            contraint = {video: {width: 854, height: 480, aspectRatio: 16/9, frameRate: { ideal: 30}}, audio: false}
        }else if(res == "720"){
            contraint = {video: {width: 1280, height: 720, aspectRatio: 16/9, frameRate: { ideal: 30}}, audio: false}
        }else{
            contraint = {video: {width: 1920, height: 1080, aspectRatio: 16/9, frameRate: { ideal: 30}}, audio: false}
        }

        let desktopStream = await navigator.mediaDevices.getDisplayMedia(contraint)
        let streamaudio = await navigator.mediaDevices.getUserMedia({video: false, audio: true})
        let tracks = [...desktopStream.getTracks(), ...streamaudio.getAudioTracks()]
        let stream = new MediaStream(tracks);
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
        
    /*  var localStream = document.getElementById("localStream")
        localStream.srcObject = stream;
        localStream.muted = true;
        localStream.play()*/

    }else{
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
    
}


async function startcall(roomnumber, offer, idsocket, dvid){
    console.log(dvid)
    let contraint = {video: {height: {min: 480, max: 1080}, width: {min: 640, max: 1920}, aspectRatio: 16/9}, audio: true}
    contraint.video.deviceId = {exact: dvid}

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
