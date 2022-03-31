import { stringToBytes } from "convert-string";
import BleManager from 'react-native-ble-manager';


const MAC_ADDRESS = "DC:A6:32:CD:2C:4F";
const SERVICE = 'bb3368df-2710-4ece-846c-d1c876a2da7a';
const CHARACTERISTICS = {"LED": "00000000-2710-4ece-846c-d1c876a2da7a",
                         "ROBO": "00000001-2710-4ece-846c-d1c876a2da7a"};

export const sendBleCommand = (mode, cmd) => {
    BleManager.connect(MAC_ADDRESS).then(() => {
        console.log("Connected");
        BleManager.retrieveServices(MAC_ADDRESS).then((peripheralInfo) => {
        // console.log("MADE IT: ", peripheralInfo.services);
        const data = stringToBytes(cmd);
        setTimeout(() => {
            BleManager.writeWithoutResponse(MAC_ADDRESS, SERVICE, CHARACTERISTICS[mode], data).then(() => {
            console.log("WROTE " + cmd + " TO " + mode);
            }).catch((error) => {
            console.log("FAILED TO WRITE");
            console.log(error);
            });
        }, 500);
        }).catch((error) => {
        console.log("FAILED TO RETRIEVE SERVICES");
        console.log(error);
        });
    }).catch((error) => {
        console.log("FAILED TO CONNECT DEVICE");
        console.log(error);
    });
}