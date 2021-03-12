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
  ImageBackground,
  ActivityIndicator,
  Alert,
} from 'react-native';

import {getFontSize, getLayoutSize} from "../resources/ResponsiveHelper";
import Header from '../components/Header';
import {Colors, CommanStyles, TextFontSize, Strings, ScaleSizeUtils,AppFonts } from "../resources/index"
import PrimaryButton from "../components/PrimaryButton"
import FormTextField from "../components/FormTextField"
import ImagePicker from 'react-native-image-crop-picker';
import Utils from "../helper/Utils"
import {Constants}  from "../networks/Constants";
import {sendPostAuthenticationRequest,sendPostFormDataRequest,sendPostDataRequest} from "../networks/RestApiService"
import { sha512 } from 'js-sha512';
import AsyncStorage from '@react-native-community/async-storage';

const { width, height } = Dimensions.get('window');


export default class EditProfileScreen extends Component{
  constructor(props) {
    super(props);
      this.state={
        first_name:'',
        first_nameError:null,
        last_name:'',
        last_nameError:null,
        email: '',
        emailError: null,
        gender:'',
        about_me:'',
        about_meError:null,
        isError:false,
        genderChecked:false,
        profile_picture:'',
        imgPickerModalOpen:false,
        errorTitle:'',
        errorMessage:'',
        isLoading:false,
        profile_picture:'',
        type:'',
        fileName:'',
      };
  }
componentDidMount(){
  this.getProfile();
}

async isValid() {
  const {first_name,last_name,email,about_me,gender,profile_picture} = this.state;
  var isValid = true;

  if(Utils.isStringNull(profile_picture)) {
      isValid = false;
      this.setState({isError:true,errorTitle: Strings.image_title,errorMessage:Strings.image_message});
      setTimeout(()=> {
        this.setState({isError:false});
      },1500);
  }else if(Utils.isStringNull(first_name)) {
      isValid = false;
      this.setState({isError:true,errorTitle: Strings.firstname_title,errorMessage:Strings.firstname_message});
      setTimeout(()=> {
        this.setState({isError:false});
      },1500);
  }else if(Utils.isStringNull(last_name)) {
      isValid = false;
      this.setState({isError:true,errorTitle: Strings.lastname_title,errorMessage:Strings.lastname_message});
      setTimeout(()=> {
        this.setState({isError:false});
      },1500);
  }else if(Utils.isStringNull(email)) {
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
  }else if(Utils.isStringNull(about_me)) {
      isValid = false;
      this.setState({isError:true,errorTitle: Strings.aboutme_title,errorMessage:Strings.aboutme_message});
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
      this.doSignUp();
    }
  }
}

async getProfile(){
    const isConnected = await Utils.isConnectedCheck()
    let user_id = await AsyncStorage.getItem('@user_Id');
    if(isConnected == true && !Utils.isStringNull(user_id)){
      this.setState({isLoading:true});

     var body = JSON.stringify({
       user_id:user_id,
       logged_id:user_id,
     })

     var data = await sendPostDataRequest(Constants.USER_DETAIL, body)

     if(data != null && data.status === 200 && data.data != null){
       this.setState({isLoading: false,
         first_name: data.data.first_name,last_name: data.data.last_name,email: data.data.email,about_me: data.data.about_me,about_me: data.data.gender, profile_picture: data.data.profile_picture,})

     }else {
       this.setState({isLoading:false})
       Alert.alert(data.data.message)
     }

    }else {
      Alert.alert(Strings.network_message)
    }
  }

async doSignUp(){
    const {first_name,last_name,email,about_me,gender,profile_picture,type,fileName} = this.state;
    const isConnected = await Utils.isConnectedCheck()
    if(isConnected == true ){
      this.setState({isLoading:true});

      var genderText='';
      if(gender == 0){
        genderText= 'Male';
      }else if(gender == 1){
        genderText= 'Female';
      }

     let formBody = new FormData();
     formBody.append("first_name", first_name);
     formBody.append("last_name", last_name);
     formBody.append("email", email);
     formBody.append("password", sha512(password));
     formBody.append("about_us", about_me);
     formBody.append("gender", genderText);
     formBody.append("device_token", 'android');
     formBody.append("device_type", '0');
     this.setState({isLoading: true});
     if(profile_picture !== null && profile_picture !== "" && type !== null && type !== "" ) {
        var photo = {
          uri: profile_picture,
          type: type,
          name: !Utils.isStringNull(fileName) ? fileName : "Photo.jpg",
        };
        formBody.append("profile_picture", photo);
      } else {
        if(!Utils.isStringNull(profile_picture)) {
          //formBody.append("profile_picture", profile_picture);
        }
      }
     var data = await sendPostFormDataRequest(Constants.UPDATE_PROFILE, formBody)
     this.setState({isLoading: false});
     console.log("data11111------->" + JSON.stringify(data));

     if(data != null && data.status === 200 && data.data != null){
       Alert.alert("",
        data.message,
        [
          {text: 'Ok', onPress: () => {
            this.props.navigation.reset({
                index: 0,
                routes: [
                {
                  name: 'SideMenu',
                },
              ],
            })
          }},
        ],
        {cancelable: false});

     }else {
       this.setState({isLoading:false}, ()=> {
         Alert.alert(data.message)
       })
     }

    }else {
      Utils.DialogBox("Alert","Not internet connection available")
    }
  }

selectImagePicker(index){
    this.setState({ profileError: null });
    switch (index) {
      case 0:
      ImagePicker.openCamera({
        width: 300,
        height: 400,
        cropping: true,
      }).then(image => {
        this.setState({profile_picture: image.path, fileName: image.fileName, type: image.mime},()=>{
        });
      });
        break;
      case 1:
      ImagePicker.openPicker({
         width: 350,
         height: 400,
         cropping: true
       }).then(image => {
         this.setState({profile_picture: image.path, fileName: image.fileName, type: image.mime},()=>{
         });
      });

        break;
      default:
    }
    this.setState({imgPickerModalOpen:false})
  }

setIMGPickerVisible(visible){
        this.setState({imgPickerModalOpen: visible,});
    }

  render(){
    const {errorTitle,errorMessage, profile_picture,first_name,first_nameError,last_name,last_nameError,email, emailError,password,passwordError,confirm_password,confirm_passwordError,about_me,about_meError,gender} = this.state;
    return(
      <View style={styles.MainContainer}>
        <StatusBar backgroundColor={Colors.app_color} />
        <Header
          title={Strings.edit_profile}
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
         <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.imgPickerModalOpen}
            onRequestClose={() => {
              this.setIMGPickerVisible(!this.state.imgPickerModalOpen);  }}>
              <View style={styles.imagePickerDialogView}  >
                 <View style={styles.subViewImagePicker}>
                    <TouchableOpacity onPress={()=> this.setState({}), () => {
                      this.setIMGPickerVisible(!this.state.imgPickerModalOpen)
                      let aInterval = setInterval(() => {
                      this.selectImagePicker(0)
                      clearInterval(aInterval);
                      }, 600)
                    } }>
                      <Text style={styles.textDialogImagePicker}>Select from camera</Text>
                    </TouchableOpacity>
                      <View style={styles.divider}/>
                        <TouchableOpacity onPress={()=> this.setState({}), () => {
                          this.setIMGPickerVisible(!this.state.imgPickerModalOpen)
                          let aInterval = setInterval(() => {
                             this.selectImagePicker(1)
                             clearInterval(aInterval);
                          }, 600)
                    }}>
                     <Text style={styles.textDialogImagePicker}>Select from gallery</Text>
                    </TouchableOpacity>
                  <View style={styles.divider}/>
                    <TouchableOpacity onPress={()=> this.setIMGPickerVisible(!this.state.imgPickerModalOpen)}>
                        <Text style={styles.textDialogImagePicker}>Cancel</Text>
                    </TouchableOpacity>
                 </View>
              </View>
          </Modal>
          <ScrollView contentContainerStyle={{ flexGrow: 1}}>
            <View style={styles.container}>
                <TouchableOpacity style={styles.image} onPress={() => {this.setState({imgPickerModalOpen: true})}}>
                    <Image source={!Utils.isStringNull(this.state.profile_picture) ? {uri: this.state.profile_picture} : require("../assets/profile_placeholder.png")}  style={styles.image} resizeMode="contain"/>
                    <Image source={require("../assets/add_circle_white.png")} style={styles.add_image} resizeMode="contain"/>
                </TouchableOpacity>

                <Text style={[CommanStyles.inputTitleText,{marginTop:getLayoutSize(40)}]}>{Strings.first_name}</Text>
                <FormTextField
                    errorText={first_nameError}
                    forwardRef={(input) => { this.firstname = input; }}
                    returnKeyType = {"next"}
                    value={first_name}
                    onChangeText={(text) => this.setState({first_name: text, first_nameError: null})}
                    onSubmitEditing={() => { this.lastname.focus(); }} />

                <Text style={[CommanStyles.inputTitleText,{marginTop:getLayoutSize(30)}]}>{Strings.last_name}</Text>
                <FormTextField
                    errorText={last_nameError}
                    forwardRef={(input) => { this.lastname = input; }}
                    returnKeyType = {"next"}
                    value={last_name}
                    onChangeText={(text) => this.setState({last_name: text, last_nameError: null})}
                    onSubmitEditing={() => { this.emailField.focus(); }} />

                <Text style={[CommanStyles.inputTitleText,{marginTop:getLayoutSize(30)}]}>{Strings.email}</Text>
                <FormTextField
                    errorText={emailError}
                    forwardRef={(input) => { this.emailField = input; }}
                    returnKeyType = {"next"}
                    value={email}
                    onChangeText={(text) => this.setState({email: text, emailError: null})}
                    onSubmitEditing={() => { this.aboutmeField.focus(); }} />

                <Text style={[CommanStyles.inputTitleText,{marginTop:getLayoutSize(30)}]}>{Strings.about_me}</Text>
                <FormTextField
                    errorText={about_meError}
                    forwardRef={(input) => { this.aboutmeField = input; }}
                    returnKeyType = {"next"}
                    value={about_me}
                    onChangeText={(text) => this.setState({about_me: text, about_meError: null})}
                    onSubmitEditing={() => { this.passwordField.focus(); }} />

                <Text style={[CommanStyles.inputTitleText,{marginTop:getLayoutSize(30)}]}>{Strings.gender}</Text>

                <View style={{flexDirection:"row",flex:1,marginTop:getLayoutSize(20)}}>
                       <TouchableOpacity style={{alignSelf:'center'}} onPress={()=>{this.setState ({genderChecked:true,checkError: null,gender:0})}}>
                           {this.state.genderChecked && gender == 0  ?
                               <View >
                                   <Image source={require("../assets/radio_checked.png")} style={styles.checkbox}/>
                               </View>
                           :
                             <View >
                                <Image source={require("../assets/radio_unchecked.png")} style={styles.checkbox}/>
                             </View>
                          }

                       </TouchableOpacity>
                        <View style={{flex:1,flexDirection:'row',  flexWrap: 'wrap', marginLeft:getLayoutSize(10) }}>
                           <Text style={[styles.terms_use,{flexWrap: 'wrap' }]}>{Strings.male}</Text>
                        </View>

                        <TouchableOpacity style={{alignSelf:'center'}} onPress={()=>{this.setState ({genderChecked:true,checkError: null,gender:1})}}>
                            {this.state.genderChecked && gender == 1 ?
                                <View >
                                    <Image source={require("../assets/radio_checked.png")} style={styles.checkbox}/>
                                </View>
                            :
                              <View >
                                 <Image source={require("../assets/radio_unchecked.png")} style={styles.checkbox}/>
                              </View>
                           }

                        </TouchableOpacity>
                         <View style={{flex:1,flexDirection:'row',  flexWrap: 'wrap', marginLeft:getLayoutSize(10) }}>
                            <Text style={[styles.terms_use,{flexWrap: 'wrap' }]}>{Strings.female}</Text>
                         </View>
                </View>
              <PrimaryButton onPressButton={()=>{this.isValid()}} >{Strings.sign_up}</PrimaryButton>
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
    width:getLayoutSize(130),
    height:getLayoutSize(130),
    justifyContent:'center',
    alignSelf:'center',
    borderRadius:getLayoutSize(130/2),
    resizeMode:'cover',
  },

  add_image:{
    width:getLayoutSize(50),
    height:getLayoutSize(50),
    right:0,
    bottom:0,
    position:'absolute',
    tintColor:Colors.app_color
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

  checkbox:{
    width:ScaleSizeUtils.PADDING_DEFAULT,
    height:ScaleSizeUtils.PADDING_DEFAULT,
  },

  terms_use:{
    fontSize:getFontSize(14),
    color:"#000",
    fontFamily:AppFonts.font_regular
  },

  imagePickerDialogView:{
     width: width,
     height: height,
     backgroundColor: 'rgba(0, 0, 0, 0.5)',
     justifyContent: 'center',
     alignItems: 'center',

  },
  subViewImagePicker: {
     width:width- 80,
     backgroundColor:Colors.white,
     borderRadius:getLayoutSize(5)
  },

  textDialogImagePicker: {
    textAlign:'center' ,
    padding: ScaleSizeUtils.PADDING_DEFAULT,
    fontSize:getLayoutSize(20),
    fontFamily:AppFonts.font_regular
  },
});
