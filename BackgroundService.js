import { Component } from 'react';
import {
    StyleSheet, Platform, Image, Alert,
    View, TouchableOpacity, Linking, PermissionsAndroid
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import BackgroundJob from 'react-native-background-actions';
import Geolocation from 'react-native-geolocation-service';
import VoiceRecog from './VoiceService';
import { sendBleCommand } from './BleService'; 


var setCount;
const URL = "http://jakeee51.pythonanywhere.com";
const SLEEP = (time) => new Promise((resolve) => setTimeout(() => resolve(), time));

BackgroundJob.on('expiration', () => {
    console.log('iOS: I am being closed!');
});
function handleOpenURL(evt) {
    console.log(evt.url);
}
Linking.addEventListener('url', handleOpenURL);


const hasPermissionIOS = async () => {
    const openSetting = () => {
      Linking.openSettings().catch(() => {
        Alert.alert('Unable to open settings');
      });
    };
    const status = await Geolocation.requestAuthorization("always");
    if (status === 'granted') {
      return true;
    }
    if (status === 'denied') {
      Alert.alert('Location permission denied');
    }
    if (status === 'disabled') {
      Alert.alert(
        `Turn on Location Services to allow "${appConfig.displayName}" to determine your location.`,
        '',
        [
          { text: 'Go to Settings', onPress: openSetting },
          { text: "Don't Use Location", onPress: () => {} },
        ],
      );
    }
    return false;
  };

const hasLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const hasPermission = await hasPermissionIOS();
      return hasPermission;
    }
    if (Platform.OS === 'android' && Platform.Version < 23) {
      return true;
    }
    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (hasPermission) {
      return true;
    }
    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }
    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show(
        'Location permission denied by user.',
        ToastAndroid.LONG,
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        'Location permission revoked by user.',
        ToastAndroid.LONG,
      );
    }
    return false;
  };

const getLoc = () => {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            console.log("GETLOC:", xhr.responseText);
        }
    }
    xhr.open("POST", URL + "/getloc", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send("pas=S%2bJ");
    return xhr.responseText;
};

const setLoc = (coords) => {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", URL + "/setloc", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(`user=J&loc=${coords}&pas=S%2bJ`);
    return xhr;
};

const isTogether = (pair) => {
    var ret = false;
    let lat1 = pair.S[0]; let lon1 = pair.S[1];
    let lat2 = pair.J[0]; let lon2 = pair.J[1];
    console.log(`PAIR: ${lat2}, ${lon2}`);
    lat1 = pair.S[0] * Math.PI / 180;
    lon1 = pair.S[1] * Math.PI / 180;
    lat2 = pair.J[0] * Math.PI / 180;
    lon2 = pair.J[1] * Math.PI / 180;

    // Haversine formula
    let dlon = lon2 - lon1;
    let dlat = lat2 - lat1;
    let a = Math.pow(Math.sin(dlat / 2), 2)
                + Math.cos(lat1) * Math.cos(lat2)
                * Math.pow(Math.sin(dlon / 2), 2);
    let c = 2 * Math.asin(Math.sqrt(a));

     // Radius of earth in miles. Use 6371 for kilometers
    let R = 3956;

    let dist = c * R;
    let feet = dist * 5280;
    if (feet < 32.0)
        ret = true;

    // var dist1 = Math.abs(lat1 - lat2);
    // var dist2 = Math.abs(lon1 - lon2);
    // if (dist1 <= .0009 || dist2 <= .0009)
    //     ret = true;
    console.log(`DIST: ${dist}`);
    console.log(`FEET: ${feet}`);
    return ret;
};

const backgroundTask = async (taskData) => {
    const hasPermission = await hasLocationPermission();
    if (!hasPermission) {
      return;
    }
    if (Platform.OS === 'ios') {
        console.warn(
            'This task will not keep your app alive in the background by itself, use other library like react-native-track-player that use audio,',
            'geolocalization, etc. to keep your app alive in the background while you excute the JS from this library.'
        );
    } else {
        var vr = new VoiceRecog();
        vr.startRecognizing();
    }
    await new Promise(async (resolve) => {
        const { delay } = taskData;
        console.log(BackgroundJob.isRunning(), delay);
        for (let i = 0; BackgroundJob.isRunning(); i++) {
            console.log("Iteration -> ", i);
            if (true) {
                Geolocation.getCurrentPosition(
                    (position) => {
                        var latitude = position.coords.latitude;
                        var longitude = position.coords.longitude;
                        var xhr = setLoc(JSON.stringify([latitude, longitude]));
                        xhr.onreadystatechange = function() {
                            if (xhr.readyState == XMLHttpRequest.DONE) {
                                // console.log("SETLOC:", xhr.responseText);
                                if (isTogether(JSON.parse(xhr.responseText))) {
                                    sendBleCommand("LED", "ON");
                                    console.log("ACTIVATE OP YELLOW"); setCount(i);
                                } else {
                                    sendBleCommand("LED", "OFF"); setCount(0);
                                }
                            }
                        }
                    },
                    (error) => {
                        console.log(error.code, error.message);
                    },
                    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
                );
            }
            // await BackgroundJob.updateNotification({ taskDesc: 'Runned -> ' + i });
            await SLEEP(delay);
        }
    });
};

const options = {
    taskName: 'Listener',
    taskTitle: 'WYMMS Listener',
    taskDesc: 'Listens for audio and retrieves geolocation data in the background',
    taskIcon: {
        name: 'ic_launcher',
        type: 'mipmap',
    },
    color: '#ff00ff',
    linkingURI: 'com.jakeee51.wymms://getaud/getloc',
    parameters: {
        delay: 5000,
    },
};

class BackgroundService extends Component {
    constructor(props) {
        super();
        setCount = props.setCount;
    }
    playing = BackgroundJob.isRunning();

    toggleBackground = async () => {
        this.playing = !this.playing;
        if (this.playing) {
            try {
                console.log('Trying to start background service');
                await BackgroundJob.start(backgroundTask, options);
                console.log('Successful start!');
            } catch (e) {
                console.log('Error', e);
            }
        } else {
            console.log('Stop background service');
            await BackgroundJob.stop();
        }
    };
    render() {
        return (
            <View>
                <TouchableOpacity
                onPress={this.toggleBackground}>
                    <Image style={styles.button} source={require('./assets/like_alert.png')} />
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    button: {
        width: 300,
        height: 300        
    },
    scrollView: {
        backgroundColor: Colors.lighter,
    },
    engine: {
        position: 'absolute',
        right: 0,
    },
    body: {
        backgroundColor: Colors.white,
    },
    footer: {
        color: Colors.dark,
        fontSize: 12,
        fontWeight: '600',
        padding: 4,
        paddingRight: 12,
        textAlign: 'right',
    },
});

export default BackgroundService;
