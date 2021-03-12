import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Dimensions,
  Image,
  TouchableOpacity,

} from 'react-native';

import {Colors,Strings} from "../resources/index";
import {getFontSize, getLayoutSize} from "../resources/ResponsiveHelper";
import Header from '../components/Header';
const { width, height } = Dimensions.get('window');
import { WebView } from 'react-native-webview';
import {Constants}  from "../networks/Constants";


export default class HomeScreen extends Component{

componentDidMount(){

}

  render(){
    return(
      <View style={styles.MainContainer}>
        <StatusBar backgroundColor={Colors.app_color} />
        <Header
          title={Strings.home}
          Navigate={this.props.navigation}
          isBack={false}
          isMenu={true}
          colorBack="#fff"
          style={{color:'#000'}}
          navigation={this.props.navigation} />
          <WebView
            source={{
              uri: Constants.ABOUT_US_URL
            }}
            style={{ marginTop: 0 }}
          />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  MainContainer:{
    width:"100%",
    height:height,
    flex:1,
    backgroundColor:Colors.white,
  },
  image:{
    width:getLayoutSize(300),
    height:getLayoutSize(300),
    justifyContent: 'center',
    alignSelf: 'center'
  },
  image_logo:{
    width:getLayoutSize(300),
    height:getLayoutSize(150),
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop:getLayoutSize(10)
  },
});
