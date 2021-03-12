import React, { Component } from 'react';
import {  Platform, StyleSheet, Alert, ScrollView, SafeAreaView, Image, Text, TouchableOpacity, Dimensions, View,StatusBar,Modal,ActivityIndicator } from 'react-native';
import {Colors, CommanStyles, TextFontSize, Strings, ScaleSizeUtils,AppFonts } from "../resources/index"
//import {PrimaryButton, FormTextField } from "../components"
import PrimaryButton from "../components/PrimaryButton"
import FormTextField from "../components/FormTextField"
import Header from '../components/Header';
import Utils from "../helper/Utils"
import {sendPostAuthenticationRequest} from "../networks/RestApiService"
import AsyncStorage from '@react-native-community/async-storage';
import { sha512 } from 'js-sha512';
import {getFontSize, getLayoutSize} from "../resources/ResponsiveHelper";
import {Constants}  from "../networks/Constants";

const { width, height } = Dimensions.get('window');

/* LoginScreen Screen */
export default class LoginScreen extends Component<Props> {

  constructor(props) {
    super(props);
      this.state={
        email: '',
        emailError: null,
        password: '',
        passwordError: null,
        isError:false,
        errorTitle:'',
        errorMessage:'',
        isLoading:false,
      };
  }

  componentDidMount() {
    setTimeout(()=> {
      this.setState({isError:false});
    },1500);
  }

  async isValid() {
    const {email, password} = this.state
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
    }else if(Utils.isStringNull(password)) {
       isValid = false;
       this.setState({isError:true,errorTitle: Strings.password_title,errorMessage:Strings.password_message});
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
        this.doLogin();
      }
    }
  }

  async doLogin(){
  const isConnected = await Utils.isConnectedCheck()
  if(isConnected == true){
    this.setState({isLoading:true});

   var body = JSON.stringify({
     email:this.state.email,
     password:sha512(this.state.password),
     device_token:'android',
     device_type:'0',
    })

   var data = await sendPostAuthenticationRequest(Constants.LOGIN, body)
   if(data != null && data.data.status === 200 && data.data != null){
     this.setState({isLoading: false}, async ()=> {

     AsyncStorage.setItem("@user_id",JSON.stringify(data.data.data.user_id));
     AsyncStorage.setItem("@full_name",data.data.data.user_name);
     AsyncStorage.setItem("@email",data.data.data.email);
     AsyncStorage.setItem('@profile_picture', data.data.data.profile_picture);

     this.props.navigation.reset({
         index: 0,
         routes: [
         {
           name: 'SideMenu',
         },
       ],
     })
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

  redirectScreen(name) {
    this.props.navigation.reset({
        index: 0,
        routes: [
        {
          name: name,
        },
      ],
    })
  }

  redirectAnotherScreen(name) {
    this.props.navigation.navigate(name);
  }

  redirectScreenWithPayload(name, payload) {
    this.props.navigation.navigate(name, payload);
  }

  onEmailTextChange=(textValue) => {
      this.setState({email: textValue, emailError: null})
  }

  onPasswordTextChange=(textValue) => {
      this.setState({password: textValue, passwordError: null})
  }

  render() {
    const { email, password, emailError, passwordError,errorTitle,errorMessage} = this.state;
    return (
      <SafeAreaView style={CommanStyles.container} >
        <StatusBar backgroundColor={Colors.app_color} />
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
                  onChangeText={(text) => this.onEmailTextChange(text)}
                  onSubmitEditing={() => { this.passwordFiled.focus(); }} />
              <Text style={[CommanStyles.inputTitleText,{marginTop:getLayoutSize(30)}]}>{Strings.password}</Text>
              <FormTextField
                  errorText={passwordError}
                  secureTextEntry={true}
                  forwardRef={(input) => { this.passwordFiled = input; }}
                  value={password}
                  onChangeText={(text) => this.onPasswordTextChange(text)} />
              <PrimaryButton onPressButton={()=>{this.isValid()}} >{Strings.login}</PrimaryButton>
              <TouchableOpacity onPress={()=>{this.redirectAnotherScreen("ForgotPasswordScreen")}}>
                <Text style={[styles.displayText]}>{Strings.forgotpassword}</Text>
              </TouchableOpacity>
              <View style={{bottom:0,position:'absolute',alignSelf:'center'}}>
                <TouchableOpacity style={styles.registerButtonContainer} onPress={()=>{this.redirectAnotherScreen("SignUpScreen")}}>
                  <Text style={styles.donHaveAccountStyle}>{Strings.dont_have_an_account}</Text>
                </TouchableOpacity>
              </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
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
  donHaveAccountStyle: {
    fontSize: TextFontSize.INPUT_TITLE_TEXT,
    textAlign: 'center',
    color: Colors.darkGray,
    fontFamily: AppFonts.font_regular,
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
