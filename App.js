import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import Start from './components/Start';
import Chat from './components/Chat';
// import react native gesture handler
import 'react-native-gesture-handler';
// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Create the navigator
// Under, createStackNavigator function is used to navigate between components faster.
// It will be used in 'return' to define the different components to navigate for and the initialRouteName that contains the starting component.
const Stack = createStackNavigator();

export default class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Start'>
          <Stack.Screen name='Start' component={Start} />
          <Stack.Screen name='Chat' component={Chat} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
})
