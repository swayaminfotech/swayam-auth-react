import React from 'react';
import {
  AppRegistry,Animated,Dimensions,
  SafeAreaView,ActivityIndicator,
  StyleSheet, Alert,
  ScrollView,TouchableHighlight,
  View,Image,TouchableOpacity,
  Text,TextInput,
  StatusBar,Modal,Platform,Button,Picker,FlatList,ImageBackground,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from "@react-native-community/netinfo";
import {sha512} from 'js-sha512';


const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './HomeScreen';

const Drawer = createDrawerNavigator();

class NavigationDrawerScreen extends React.Component {

  constructor(props) {
  super(props)
  this.state = {
        loading: false,

    };
  }

  async componentDidMount() {

  }

  render() {
    return (
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={HomeScreen}  screenProps={this.props}/>
        <Drawer.Screen name="Edit Profile" component={HomeScreen}  screenProps={this.props}/>
        <Drawer.Screen name="Change Password" component={HomeScreen}  screenProps={this.props}/>
        <Drawer.Screen name="About Us" component={HomeScreen}  screenProps={this.props}/>
        <Drawer.Screen name="Rate App" component={HomeScreen}  screenProps={this.props}/>
        <Drawer.Screen name="Share App" component={HomeScreen}  screenProps={this.props}/>

      </Drawer.Navigator>
    );
  }
}
export default NavigationDrawerScreen;
