activeSky = null;
activeSkyAspect = -1;

player1 = null;
player2 = null;

const http = require('http');
const ws = require('ws');
const wss = new ws.Server({noServer: true});

// ------------------  RESPONSE FUNCTIONS  -----------------------------

function sendRequestSkyDimensionsResponse(PlayerWs){
  msgObj = {
    source: "Server",
    command: "RequestSkyAspectResponse",
    skyAspect: activeSkyAspect
  };

  DesignerWs.send(JSON.stringify(msgObj));
};

function deliverFirework(msgObj){
  if(activeSky != null){
    msgObj.source = "Server";
    msgObj.command = "DeliverFirework";
    activeSky.send(JSON.stringify(msgObj));
  }else{
    console.log("ERROR - No active sky");
  }
}

// ------------------  MESSAGE PROCESSING  -----------------------------

function processPlayerMessage(msgObj, PlayerWs){
  switch(msgObj.command){
    

    /*
    case "RequestSkyAspect":
      console.log("Designer:RequestSkyAspect");
      sendRequestSkyDimensionsResponse(DesignerWs);
      break;
    case "SendFirework":
      console.log("Designer:SendFirework");
      deliverFirework(msgObj);
      break;*/
    default:
      console.log(`Designer: Unknown message = ${msg}`);
  }
}

function processGameMessage(msgObj, GameWs){
  switch(msgObj.command){
    case "StartNewGame":
      console.log("Game:StartNewGame");
      break;
    /*
    case "OpenNewSky":
      console.log("Sky:OpenNewSky")
      activeSky = SkyWs;
      activeSkyAspect = msgObj.skyAspect;
      break;
    case "PantsOptional":
      console.log("Sky:PantsOptional");
      break;*/
    default:
      console.log(`Sky: Unknown message = ${msg}`);
  }
}

// -------------------- WEB SOCKET STUFF ---------------------------------

function accept(req, res) {
  // all incoming requests must be websockets
  if (!req.headers.upgrade || req.headers.upgrade.toLowerCase() != 'websocket') {
    console.log("Connection rejected because it is not a websocket");
    res.end();
    return;
  }

  // can be Connection: keep-alive, Upgrade
  if (!req.headers.connection.match(/\bupgrade\b/i)) {
    console.log("Non upgradable connection");
    res.end();
    return;
  }

  wss.handleUpgrade(req, req.socket, Buffer.alloc(0), onConnect);
}

function onConnect(ws) {
  console.log("New Connection Established!")

  ws.on('message', function (message) {
    console.log(`Got message: ${message}`);

    try{
      msgObj = JSON.parse(message.toString());
      switch(msgObj.source){
        case "Game":
          processGameMessage(msgObj, ws);
          break;
        case "Player":
          processPlayerMessage(msgObj, ws);
          break;
        default:
          console.log(`Unknown source in message: ${message}`);
      }
    }catch(e){
      console.log(`Can't parse message: ${message}`);
    }
  });
}

if (!module.parent) {
  console.log("launching on port 42742");
  http.createServer(accept).listen(42742);
} else {
  exports.accept = accept;
}