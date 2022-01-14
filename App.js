import { StatusBar } from 'expo-status-bar';
import React, { Component, useState } from 'react';
import { StyleSheet, TextInput, Text, View, Button } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const App = () => {
  const [text, onChangeText] = useState();
  return (
    <View style={styles.container}>
      <LinearGradient
      // Background Linear Gradient
      colors={['#00E4F1', 'transparent']}
      style={styles.background}
      />
      <View style={{marginBottom: 500}}>
        <Button
          color="gold"
          title="Start"
        />
      </View>
    </View>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'yellow',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FDC9CC',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
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