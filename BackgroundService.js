import React from 'react';
import {
    StyleSheet, Platform,
    View, TouchableOpacity, Linking
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import BackgroundJob from 'react-native-background-actions';
// import { UserLocation } from './UserLocation';


const sleep = (time) => new Promise((resolve) => setTimeout(() => resolve(), time));
BackgroundJob.on('expiration', () => {
    console.log('iOS: I am being closed!');
});
function handleOpenURL(evt) {
    console.log(evt.url);
    // do something with the url
}
Linking.addEventListener('url', handleOpenURL);

const backgroundTask = async (taskData) => {
    if (Platform.OS === 'ios') {
        console.warn(
            'This task will not keep your app alive in the background by itself, use other library like react-native-track-player that use audio,',
            'geolocalization, etc. to keep your app alive in the background while you excute the JS from this library.'
        );
    }
    await new Promise(async (resolve) => {
        // For loop with a delay
        const { delay } = taskData;
        console.log(BackgroundJob.isRunning(), delay)
        for (let i = 0; BackgroundJob.isRunning(); i++) {
            console.log('Runned -> ', i);
            await BackgroundJob.updateNotification({ taskDesc: 'Runned -> ' + i });
            await sleep(delay);
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
        delay: 1000,
    },
};

class BackgroundService extends React.Component {
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
            <View style={styles.body}>
                <TouchableOpacity
                style={{ height: 100, width: 100, backgroundColor: 'red' }}
                onPress={this.toggleBackground}>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
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