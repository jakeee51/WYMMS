import React, { useState } from 'react';
import {
    StyleSheet, Button, View, Text
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BackgroundService from './BackgroundService'


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

  return (
    <View style={styles.container}>
      <LinearGradient
      // Background Linear Gradient
      colors={['#00E4F1', 'transparent']}
      style={styles.background}
      />
      <View style={{width: 200, marginBottom: 200, marginRight: 100}}>
        <BackgroundService setCount={setCount} />
      </View>
      <Text style={styles.text}>{count}</Text>
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
    text: {
      fontSize: 100,
      textAlign: 'center'
    }
});

export default MyStack;