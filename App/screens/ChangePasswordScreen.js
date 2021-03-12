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

/* Change password Screen */
export default class ChangePasswordScreen extends Component<Props> {

  constructor(props) {
    super(props);
      this.state={
        password: '',
        passwordError: null,
        new_password:'',
        new_passwordError:null,
        confirm_password:'',
        confirm_passwordError:null,
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
    const {password,new_password,confirm_password} = this.state
    var isValid = true;

    if(Utils.isStringNull(password)) {
       isValid = false;
       this.setState({isError:true,errorTitle: Strings.password_title,errorMessage:Strings.oldpassword_message});
       setTimeout(()=> {
         this.setState({isError:false});
       },1500);
    }else if(Utils.isStringNull(new_password)) {
       isValid = false;
       this.setState({isError:true,errorTitle: Strings.password_title,errorMessage:Strings.newpassword_message});
       setTimeout(()=> {
         this.setState({isError:false});
       },1500);
    }else if(!Utils.isValidPassword(new_password)) {
       isValid = false;
       this.setState({isError:true,errorTitle: Strings.password_title,errorMessage:Strings.valid_password_message});
       setTimeout(()=> {
         this.setState({isError:false});
       },1500);
    }else if(Utils.isStringNull(confirm_password)) {
       isValid = false;
       this.setState({isError:true,errorTitle: Strings.confirm_password_title,errorMessage:Strings.confirm_password_message});
       setTimeout(()=> {
         this.setState({isError:false});
       },1500);
    }else if(confirm_password !== new_password) {
       isValid = false;
       this.setState({isError:true,errorTitle: Strings.confirm_password_title,errorMessage:Strings.mismatch_password_message});
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
        this.changePassword();
      }
    }

  }

  async changePassword(){
  const isConnected = await Utils.isConnectedCheck()
  if(isConnected == true){
    this.setState({isLoading:true});

   var body = JSON.stringify({
     oldPassword:sha512(this.state.password),
     password:sha512(this.state.new_password),

    })

   var data = await sendPostAuthenticationRequest(Constants.CHANGE_PASSWORD, body)
   if(data != null && data.data.status === 200 && data.data != null){
     this.setState({isLoading: false,password:'',new_password:'',confirm_password:''}, async ()=> {
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
    Alert.alert(Strings.network_message)
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

  render() {
    const { email, password, emailError, passwordError,errorTitle,errorMessage} = this.state;
    return (
      <SafeAreaView style={CommanStyles.container} >
        <StatusBar backgroundColor={Colors.app_color} />
        <Header
          title={Strings.change_password}
          Navigate={this.props.navigation}
          isBack={false}
          isMenu={true}
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

              <Text style={[CommanStyles.inputTitleText,{marginTop:getLayoutSize(30)}]}>{Strings.current_password}</Text>
              <FormTextField
                  errorText={passwordError}
                  secureTextEntry={true}
                  forwardRef={(input) => { this.passwordFiled = input; }}
                  value={password}
                  onChangeText={(text) => this.setState({password: text, passwordError: null})}
                  onSubmitEditing={() => { this.new_passwordField.focus(); }} />

              <Text style={[CommanStyles.inputTitleText,{marginTop:getLayoutSize(30)}]}>{Strings.new_password}</Text>
              <FormTextField
                  errorText={passwordError}
                  secureTextEntry={true}
                  forwardRef={(input) => { this.new_passwordField = input; }}
                  value={password}
                  onChangeText={(text) => this.setState({new_password: text, new_passwordError: null})}
                  onSubmitEditing={() => { this.confirm_passwordField.focus(); }} />

              <Text style={[CommanStyles.inputTitleText,{marginTop:getLayoutSize(30)}]}>{Strings.new_confirm_password}</Text>
              <FormTextField
                  errorText={passwordError}
                  secureTextEntry={true}
                  forwardRef={(input) => { this.confirm_passwordField = input; }}
                  value={password}
                  onChangeText={(text) => this.setState({confirm_password: text, confirm_passwordError: null})} />

              <PrimaryButton onPressButton={()=>{this.isValid()}} >{Strings.change_password}</PrimaryButton>

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
