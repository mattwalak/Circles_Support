activeGame = null;
activeGameAspect = -1;

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
    skyAspect: activeGameAspect
  };

  DesignerWs.send(JSON.stringify(msgObj));
};

function deliverFirework(msgObj){
  if(activeGame != null){
    msgObj.source = "Server";
    msgObj.command = "DeliverFirework";
    activeGame.send(JSON.stringify(msgObj));
  }else{
    console.log("ERROR - No active sky");
  }
}

// ------------------  MESSAGE PROCESSING  -----------------------------

function respondToNewPlayerConnected(playerWs, playerNum){
  // Response to game
  msgObj = {
    source: "Server",
    command: "PlayerInputData",
    newPlayerConnected: playerNum
  };
  activeGame.send(JSON.stringify(msgObj));

  // Response to player
  msgObj = {
    source: "Server",
    command: "ConnectionSuccess",
    playerNum: playerNum
  };
  playerWs.send(JSON.stringify(msgObj));
}

function respondToPlayerConnectionFailed(playerWs){
  msgObj = {
    source: "Server",
    command: "ConnectionFailed",
  };
  playerWs.send(JSON.stringify(msgObj));
}

function processPlayerMessage(msgObj, playerWs){
  switch(msgObj.command){
    case "RequestPlayerSpot":
      console.log("Player:RequestPlayerSpot");
      if(activeGame == null){
        console.log("No active game. Dropping connection");
        respondToPlayerConnectionFailed(playerWs);
      }else{
        if(player1 == null){
          console.log("Found our player 1");
          player1 = playerWs;
          respondToNewPlayerConnected(playerWs, 1);
        }else if(player2 == null){
          console.log("Found our player 2");
          player2 = playerWs;
          respondToNewPlayerConnected(playerWs, 2);
        }else{
          console.log("No open player spots. Dropping connection");
          respondToPlayerConnectionFailed(playerWs);
        }
      }
      break;
    case "CircleButtonClick":
      console.log("Player:CircleButtonClick");
      msgObj.source = "Server";
      activeGame.send(JSON.stringify(msgObj));
      break;
    case "SendTouchPositionData":
      console.log("Player:SendTouchPositionData");
      msgObj.source = "Server";
      activeGame.send(JSON.stringify(msgObj));
      break;

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

function processGameMessage(msgObj, gameWs){
  switch(msgObj.command){
    case "OpenNewGame":
      console.log("Game:OpenNewGame");
      activeGame = gameWs;
      player1 = null;
      player2 = null;
      break;
    /*
    case "OpenNewSky":
      console.log("Sky:OpenNewSky")
      activeGame = SkyWs;
      activeGameAspect = msgObj.skyAspect;
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