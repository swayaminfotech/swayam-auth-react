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

import SplashScreen from './App/screens/SplashScreen';
import LoginScreen from './App/screens/LoginScreen';
import ForgotPasswordScreen from './App/screens/ForgotPasswordScreen';
import SignUpScreen from './App/screens/SignUpScreen';
import NavigationDrawerScreen from './App/screens/NavigationDrawerScreen';
import SideMenu from './App/screens/SideMenu';
import TermsOfServiceScreen from './App/screens/TermsOfServiceScreen';
import EditProfileScreen from './App/screens/EditProfileScreen';
import SideMenuNavigator from './App/Navigator/SideMenuNavigator';

const Stack = createStackNavigator();

const App: () => React$Node = () => {
  return (
    <>
    <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} options={{ headerShown: false }} />
          <Stack.Screen name="SignUpScreen" component={SignUpScreen} options={{ headerShown: false }} />
          <Stack.Screen name="NavigationDrawerScreen" component={NavigationDrawerScreen} options={{ headerShown: false }} />
          <Stack.Screen name="SideMenuNavigator" component={SideMenuNavigator} options={{ headerShown: false }} />
          <Stack.Screen name="SideMenu" component={SideMenu} options={{ headerShown: false }} />
          <Stack.Screen name="TermsOfServiceScreen" component={TermsOfServiceScreen} options={{ headerShown: false }} />

        </Stack.Navigator>
    </NavigationContainer>
    </>
  );
};

export default App;
