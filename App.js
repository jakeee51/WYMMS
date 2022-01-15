import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, Text, View, Button } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Location from 'expo-location';

const Stack = createNativeStackNavigator();

const MyStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={MainScreen}
          options={{ title: 'LikeAlert' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const MainScreen = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);
  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location.coords.latitude);
    text += ", " + JSON.stringify(location.coords.longitude)
  }

  return (
    <View style={styles.container}>
      <LinearGradient
      // Background Linear Gradient
      colors={['#00E4F1', 'transparent']}
      style={styles.background}
      />
      <View style={{width: 250, marginBottom: 200}}>
        <Button
            color="gold"
            title="Start"
        />
        <Text>{text}</Text>
      </View>
    </View>
  );
};

export default MyStack;

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
  textinput: {
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: 'transparent',
    fontSize: 36,
    color: '#000',
    padding: 25,
  },
});