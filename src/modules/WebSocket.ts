import { myUserAccount, environmentData } from './DecentralAPI';
import { getCurrentRealm } from '@decentraland/EnvironmentAPI';

let connection: any = null;
let landIDNumber: number;
let landIDPadded: string;
let walletAddress;

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
export class WSConnection {
  gameInstances: any[];
  environment;

  constructor(gameInstances) {
    this.gameInstances = gameInstances;
    this.environment = environmentData();

    landIDNumber = this.environment[0];
    landIDPadded = padding(landIDNumber, 3);
    walletAddress = myUserAccount();

    this.webSocketConnection();
  }

  webSocketConnection() {
    log('WebSocket connection activated');

    /////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////
    // open WebSocket connection and handle incoming WebSocket messages
    connection = new WebSocket(this.environment[2]);
    
    connection.onopen = function() {
      log('connection is open and ready to use');
    };

    connection.onerror = function(error) {
      log(
        'an error occurred when sending/receiving data: ' +
          JSON.stringify(error)
      );
    };

    connection.onmessage = message => {
      try {
        const json = JSON.parse(message.data);

        // if correct address send the message contents to each game instance
        if (json.type == 'message' || (json.type == 'blockchain' && json.data._address == walletAddress)) {
          for (var i = 0; i < this.gameInstances.length; i++) {
            this.gameInstances[i].messageHandler(json);
          }
        }

        return;
      } catch (e) {
        let seconds = '';

        const minutes = message.data.split(':')[1];
        const secondsGMT = message.data.split(':')[2];
        if (typeof secondsGMT !== 'undefined') {
          seconds = secondsGMT.split(' ')[0];
        } else {
          log(message.data);
        }

        // send the ping to each game instance
        for (var i = 0; i < this.gameInstances.length; i++) {
          this.gameInstances[i].pingHandler(minutes, seconds);
        }

        return;
      }
    };
  }
}

export async function verifyTableID(machineID, tableID, gameType) {
  const currentRealm = await getCurrentRealm();
  const myTableID = `${currentRealm.domain}-${currentRealm.serverName}-${currentRealm.layer}-${machineID}-${gameType}`
  return myTableID == tableID;
}

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// send metatransaction data to WebSocket server
export async function sendMessage(gameType, machineID, gameData) {
  const gameTypePadded = padding(gameType, 3);
  const machineIDPadded = padding(machineID, 3);
  const currentRealm = await getCurrentRealm();

  // create global machine ID based on land ID, game ID, and local machine ID
  const globalID = landIDPadded + gameTypePadded + machineIDPadded;
  const tableID = `${currentRealm.domain}-${currentRealm.serverName}-${currentRealm.layer}-${machineID}-${gameType}`
  
  // send the machine ID (global), player wallet address, and data particular to this game
  const json = JSON.stringify({
    type: 'message',
    machineID: globalID,
    tableID: tableID,
    walletAddress: walletAddress,
    gameData: gameData
  });

  connection.send(json);
}

function padding(number, size) {
  let numberString = number.toString();

  while (numberString.length < size) numberString = '0' + numberString;

  return numberString;
}
