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
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
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

export default class ForgotPasswordScreen extends Component{
  constructor(props) {
    super(props);
      this.state={
        email: '',
        emailError: null,
        isError:false,
        errorTitle:'',
        errorMessage:'',
        isLoading:false,
      };
  }
componentDidMount(){

}

async isValid() {
  const {email} = this.state
  var isValid = true;

  if(Utils.isStringNull(email)) {
      isValid = false;
      this.setState({isError:true,errorTitle: Strings.email_title,errorMessage:Strings.email_message});
      setTimeout(()=> {
        this.setState({isError:false});
      },1500);
  } else if(!Utils.isValidEmailAddress(email)) {
      isValid = false;
      this.setState({isError:true,errorTitle: Strings.valid_email_title,errorMessage:Strings.valid_email_message});
      setTimeout(()=> {
        this.setState({isError:false});
      },1500);
  }else {
    var isInternetConnected = await Utils.isConnected();

    if(isValid && !isInternetConnected) {
      isValid = false;
      this.setState({isError:true,errorTitle: Strings.network_title,errorMessage:Strings.network_message});
      setTimeout(()=> {
        this.setState({isError:false});
      },1500);
    }else {
      this.doForgotPassword();
    }
  }


}

async doForgotPassword(){
const isConnected = await Utils.isConnectedCheck()
  if(isConnected == true){
    this.setState({isLoading:true});

     var body = JSON.stringify({
       email:this.state.email,
      })

     var data = await sendPostAuthenticationRequest(Constants.FORGOTPASSWORD, body)
     if(data != null && data.data.status === 200 && data.data != null){
       this.setState({isLoading: false,email:''}, async ()=> {
         Alert.alert(data.data.message)
       });
     }else {
       this.setState({isLoading:false}, ()=> {
         setTimeout(()=> {
            Alert.alert(data.data.message)
            },2000);
       })
     }

  }else {
    Utils.DialogBox("Alert","Not internet connection available")
  }
}

  render(){
    const { email, emailError,errorTitle,errorMessage} = this.state;
    return(
      <View style={styles.MainContainer}>
        <StatusBar backgroundColor={Colors.app_color} />
        <Header
          title={Strings.forgotpassword}
          Navigate={this.props.navigation}
          isBack={true}
          colorBack="#fff"
          style={{color:'#000'}}
          navigation={this.props.navigation} />
          <Modal
            transparent={true}
            animationType={'fade'}
            visible={this.state.isError}
            onRequestClose={() => {}}>
            <View style={CommanStyles.errorBackground}>
              <Image source={require("../assets/ic_info.png")} style={styles.error_image} resizeMode="contain"/>
              <View style={{flexDirection:'column',marginLeft:getLayoutSize(15)}}>
                  <Text style={[styles.error_title]}>{errorTitle}</Text>
                  <Text style={[styles.error_text]}>{errorMessage}</Text>
              </View>
           </View>
         </Modal>
         <Modal
            transparent={true}
            animationType={'fade'}
            visible={this.state.isLoading}
            onRequestClose={() => {this.setState({loading:false})}}>
            <View style={CommanStyles.modalBackground}>
              <View style={CommanStyles.activityIndicator}>
                <ActivityIndicator  animating={this.state.isLoading}  color={Colors.app_color} size={'large'} />
              </View>
           </View>
         </Modal>
          <ScrollView contentContainerStyle={{ flexGrow: 1}}>
            <View style={styles.container}>
              <Image source={require("../assets/app_icon.png")} style={styles.image} resizeMode="contain"/>
                <Text style={[CommanStyles.inputTitleText,{marginTop:getLayoutSize(40)}]}>{Strings.email}</Text>
                <FormTextField
                    errorText={emailError}
                    forwardRef={(input) => { this.emailField = input; }}
                    returnKeyType = {"next"}
                    value={email}
                    onChangeText={(text) => this.setState({email: text, emailError: null})}
                    onSubmitEditing={() => { this.passwordFiled.focus(); }} />

                <PrimaryButton onPressButton={()=>{this.isValid()}} >{Strings.send}</PrimaryButton>


            </View>
          </ScrollView>
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
  container: {
    ...CommanStyles.container,
    padding: ScaleSizeUtils.PADDING_DEFAULT,
  },

  image:{
    width:getLayoutSize(200),
    height:getLayoutSize(200),
    justifyContent:'center',
    alignSelf:'center',
  },

  displayText:{
    color:Colors.darkGray,
    fontSize:TextFontSize.INPUT_TITLE_TEXT,
    marginTop:getLayoutSize(20),
    alignSelf:'center',
    marginTop:getLayoutSize(20),
    fontFamily: AppFonts.font_regular,
  },

  registerButtonContainer: {
    width: '100%',
    padding: ScaleSizeUtils.PADDING_AUTH_BUTTON,
    marginBottom: ScaleSizeUtils.MARGIN_BOTTOM_REGISTER_TEXT,
  },

  error_image:{
    width:getLayoutSize(55),
    height:getLayoutSize(55),
  },

  error_title:{
    color:Colors.error_border,
    fontSize:TextFontSize.INPUT_TITLE_TEXT,
    fontFamily: AppFonts.font_medium,
  },
  error_text:{
    color:Colors.darkGray,
    fontSize:TextFontSize.INPUT_TITLE_TEXT,
    fontFamily: AppFonts.font_regular,
    marginTop:getLayoutSize(5)
  },
});
