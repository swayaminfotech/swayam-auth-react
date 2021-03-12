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
  TextInput,
  Button,
  Alert,
  ActivityIndicator,
  Modal,

} from 'react-native';

import {getFontSize, getLayoutSize} from "../resources/ResponsiveHelper";
import Header from '../components/Header';
import {Colors, CommanStyles, TextFontSize, Strings, ScaleSizeUtils,AppFonts } from "../resources/index"
import PrimaryButton from "../components/PrimaryButton"
import FormTextField from "../components/FormTextField"
import {Constants}  from "../networks/Constants";
import Utils from "../helper/Utils"
import {sendPostAuthenticationRequest} from "../networks/RestApiService"

const { width, height } = Dimensions.get('window');

export default class TermsOfServiceScreen extends Component{
constructor(props){
  super(props);
  this.state={
    isLoading:false,
  }
}

  render(){
    return(
      <View style={styles.MainContainer}>
      <StatusBar backgroundColor={Colors.header_color} />
       <SafeAreaView style={{flex:1}}>

        <Modal
          transparent={true}
          animationType={'fade'}
          visible={this.state.isLoading}
          onRequestClose={() => {this.setState({loading:false})}}>
          <View style={CommanStyles.modalBackground}>
            <View style={CommanStyles.activityIndicator}>
              <ActivityIndicator  animating={this.state.isLoading}  color={Colors.app_background_color} size={'large'} />
            </View>
         </View>
       </Modal>
       <View style={{flexDirection:'column'}}>
       <Header
         title={Strings.terms_use}
         Navigate={this.props.navigation}
         isBack={true}
         colorBack="#fff"
         style={{color:'#000'}}
         navigation={this.props.navigation} />
        <View style={styles.Container}>
           <Text style={styles.content}>{"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. \n\n It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."}</Text>
        </View>
       </View>
     </SafeAreaView>
    </View>
    );
  }
}

const styles = StyleSheet.create({
  MainContainer:{
    flex:1,
    backgroundColor:Colors.white,
  },
  Container:{
    padding:ScaleSizeUtils.PADDING_DEFAULT
  },

  content:{
    color:"#000",
    fontSize:TextFontSize.TEXT_SIZE_INTRO_TEXT,
  },

});
