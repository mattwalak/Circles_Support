DEBUG = (location.hostname === "localhost" || location.hostname === "127.0.0.1");
host = "ws://3.85.104.149:42742";

if(DEBUG){
  console.log("In debug");
  host = "ws://localhost:42742";
}

function processServerMessage(msgObj){
  switch(msgObj.command){
    case "RequestSkyAspectResponse":
      console.log("Server:RequestSkyAspectResponse");
      onReceiveSkyAspect(msgObj.skyAspect);
      break;
    default:
      console.log(`Designer: Unknown command = ${msg}`);
  }
};


let socket = new WebSocket(host);

function alert(msg){
  console.log(msg);
}

socket.onopen = function(e) {
  alert("[open] Connection established");
  // alert("Sending to server");
  // socket.send("Designer_Message");
};

socket.onmessage = function(event) {
  alert(`[message] Data received from server: ${event.data}`);

  try{
    msgObj = JSON.parse(event.data.toString());
    if(msgObj.source === "Server"){
      processServerMessage(msgObj);
    }else{
      console.log("Unknown source");
    }
  }catch(e){
    console.log("I don't understand this message");
  }
};

socket.onclose = function(event) {
  if (event.wasClean) {
    alert(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
  } else {
    // e.g. server process killed or network down
    // event.code is usually 1006 in this case
    alert('[close] Connection died');
  }
};

socket.onerror = function(error) {
  alert(`[error] ${error.message}`);
  console.log("EEEEEERRRR", error)
};

// ---------------------------------- SEND MESSAGES -------------------------------------------

function sendMessage(){
  socket.send("Designer:pants optional!");
  alert("Sending designer message");
};

function sendFirework(type, shape, hue, scale, normPosX, normPosY){
  msg = {
    source: "Designer",
    command: "SendFirework",
    type: type,
    shape: shape,
    hue: hue,
    scale: scale,
    normPosX: normPosX,
    normPosY: normPosY
  };

  console.log(msg);

  socket.send(JSON.stringify(msg));
}

/*
function sendFirework(shape, color){
  msg = {
    source: "Designer",
    command: "SendFirework",
    particleShape: shape,
    particleColor: {r: color._array[0], g: color._array[1], b: color._array[2], a: color._array[3]}
  };

  console.log(color);

  socket.send(JSON.stringify(msg));
};*/

function sendRequestSkyAspect(){
  msg = {
    source: "Designer",
    command: "RequestSkyAspect"
  };

  socket.send(JSON.stringify(msg));
};