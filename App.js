
import React, { useState,useEffect } from 'react';
import {
    StyleSheet, Button, View, Text, NativeModules, NativeEventEmitter
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { stringToBytes } from "convert-string";
import BleManager from 'react-native-ble-manager';
import BackgroundService from './BackgroundService'

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const Stack = createNativeStackNavigator();

const MyStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={MainScreen}
          options={{ title: 'LikeAlert' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const MainScreen = ({ navigation }) => {
  const [count, setCount] = useState(0);
  const [list, setList] = useState([]);
  const peripherals = new Map();

  const handleStopScan = () => {
    console.log('Scan is stopped');
    setIsScanning(false);
  }

  const handleDisconnectedPeripheral = (data) => {
    let peripheral = peripherals.get(data.peripheral);
    if (peripheral) {
      peripheral.connected = false;
      peripherals.set(peripheral.id, peripheral);
      setList(Array.from(peripherals.values()));
    }
    console.log('Disconnected from ' + data.peripheral);
  }

  const handleUpdateValueForCharacteristic = (data) => {
    console.log('Received data from ' + data.peripheral + ' characteristic ' + data.characteristic, data.value);
  }

  const handleDiscoverPeripheral = (peripheral) => {
    console.log('Got ble peripheral', peripheral);
    if (!peripheral.name) {
      peripheral.name = 'NO NAME';
    }
    peripherals.set(peripheral.id, peripheral);
    setList(Array.from(peripherals.values()));
  }

  const retrieveConnected = () => {
    BleManager.connect("DC:A6:32:CD:2C:4F").then(() => {
      console.log("Connected");
      BleManager.retrieveServices("DC:A6:32:CD:2C:4F").then((peripheralInfo) => {
        console.log("MADE IT: ", peripheralInfo.services);
        var service = 'bb3368df-2710-4ece-846c-d1c876a2da7a';
        var readCharacteristic = '00000000-2710-4ece-846c-d1c876a2da7a';
        var writeCharacteristic = '00000001-2710-4ece-846c-d1c876a2da7a';
        const data = stringToBytes("ACTIVATE OP RED");
        setTimeout(() => {
          BleManager.writeWithoutResponse("DC:A6:32:CD:2C:4F", service, writeCharacteristic, data).then(() => {
            console.log('WROTE TO DEVICE');
          }).catch((error) => {
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

  useEffect(() => {
    BleManager.start({showAlert: false});

    bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);
    bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', handleDisconnectedPeripheral );
    bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic );
    
    return (() => {
      console.log('unmount');
      bleManagerEmitter.removeListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);
      bleManagerEmitter.removeListener('BleManagerDisconnectPeripheral', handleDisconnectedPeripheral );
      bleManagerEmitter.removeListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic );
    })
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
      // Background Linear Gradient
      colors={['#00E4F1', 'transparent']}
      style={styles.background}
      />
      <Button title="Send To Device" onPress={() => retrieveConnected() } />
      <View style={{width: 200, marginBottom: 200, marginRight: 100}}>
        <BackgroundService />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FDC9CC',
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        height: 800,
    },
});

export default MyStack;