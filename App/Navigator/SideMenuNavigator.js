/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import EditProfileScreen from '../screens/EditProfileScreen';
import HomeScreen from '../screens/HomeScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import AboutUsScreen from '../screens/AboutUsScreen';


const Stack = createStackNavigator();

const SideMenuNavigator: () => React$Node = () => {
  return (
    <>
      <Stack.Navigator>
        <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AboutUsScreen" component={AboutUsScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </>
  );
};

export default SideMenuNavigator;
