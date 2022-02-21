import React, { useState, useEffect } from 'react';
import {
    SafeAreaView, StyleSheet, ScrollView,
    Button, View, Text, TextInput, StatusBar,
    TouchableOpacity, Platform, Linking,
} from 'react-native';
import { Header, Colors } from 'react-native/Libraries/NewAppScreen';
import { LinearGradient } from 'expo-linear-gradient';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import UserLocation from './UserLocation';
import BackgroundJob from 'react-native-background-actions';


const sleep = (time) => new Promise((resolve) => setTimeout(() => resolve(), time));
BackgroundJob.on('expiration', () => {
    console.log('iOS: I am being closed!');
});
function handleOpenURL(evt) {
    console.log(evt.url);
    // do something with the url
}
Linking.addEventListener('url', handleOpenURL);

const taskRandom = async (taskData) => {
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

class App extends React.Component {
    playing = BackgroundJob.isRunning();

    toggleBackground = async () => {
        this.playing = !this.playing;
        if (this.playing) {
            try {
                console.log('Trying to start background service');
                await BackgroundJob.start(taskRandom, options);
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
            <>
                <StatusBar barStyle="dark-content" />
                <SafeAreaView>
                    <ScrollView
                        contentInsetAdjustmentBehavior="automatic"
                        style={styles.scrollView}>
                        <Header />
                        {global.HermesInternal == null ? null : (
                            <View style={styles.engine}>
                                <Text style={styles.footer}>Engine: Hermes</Text>
                            </View>
                        )}
                        <View style={styles.body}>
                            <TouchableOpacity
                            style={{ height: 100, width: 100, backgroundColor: 'red' }}
                            onPress={this.toggleBackground}>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </>
        );
    }
}

// const Stack = createNativeStackNavigator();

// const MyStack = () => {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator>
//         <Stack.Screen
//           name="Main"
//           component={MainScreen}
//           options={{ title: 'LikeAlert' }}
//         />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// const MainScreen = ({ navigation }) => {
//   return (
//     <View style={styles.container}>
//       <LinearGradient
//       // Background Linear Gradient
//       colors={['#00E4F1', 'transparent']}
//       style={styles.background}
//       />
//       <View style={{width: 250, marginBottom: 200}}>
//         <UserLocation />
//       </View>
//     </View>
//   );
// };

export default App;

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