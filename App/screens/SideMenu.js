/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React,{Component} from 'react';
import { Button, View, StyleSheet,
   Linking,
   TouchableOpacity, Image, Text,Alert,Share } from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
//import Animated from 'react-native-reanimated';
import {Colors, ScaleSizeUtils, Strings, TextFontSize,AppFonts} from "../resources/index"
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './HomeScreen';
import EditProfileScreen from './EditProfileScreen';
import ChangePasswordScreen from './ChangePasswordScreen';
import AboutUsScreen from './AboutUsScreen';

import AsyncStorage from '@react-native-community/async-storage';
import Utils from "../helper/Utils";
import {getFontSize, getLayoutSize} from "../resources/ResponsiveHelper";
import SideMenuNavigator from '../Navigator/SideMenuNavigator';

const APP_STORE_LINK = 'itms://itunes.apple.com/us/app/apple-store/myiosappid?mt=8';
const PLAY_STORE_LINK = 'market://details?id=com.swayamauth';

function CustomDrawerMenuItemContent({rest, name, email, profilePicture}) {

  const[index, setSelectedIndex] = React.useState(-1)
  const[isReviewOpen, setReviewOpen] = React.useState(0)
  var sideMenuItems=[
    {"name": "Home", icon: require("../assets/ic_sidemenu_home.png"), navigateScreenName: 'Home'},
    {"name": "Edit Profile", icon: require("../assets/ic_sidemenu_profile.png"), navigateScreenName: 'EditProfileScreen'},
    {"name": "Change Password", icon: require("../assets/ic_side_menu_change_password.png"), navigateScreenName: 'ChangePasswordScreen'},
    {"name": "About Us", icon: require("../assets/ic_sidemenu_aboutus.png"), navigateScreenName: 'AboutUsScreen'},
    {"name": "Rate App", icon: require("../assets/ic_sidemenu_rate_application.png"), navigateScreenName: 'Home'},
    {"name": "Share App", icon: require("../assets/ic_sidemenu_share_application.png"), navigateScreenName: 'Home'},
  ]
  let menuItemView = [];
  for (let i = 0; i < sideMenuItems.length; i++){
    menuItemView.push(
    <TouchableOpacity  style={styles.menuItemViewTouchContainer} onPress={()=> {
      setSelectedIndex(i)
      if(i === 4){
        if(Platform.OS =='ios'){
          Linking.openURL(APP_STORE_LINK).catch(err => console.error('An error occurred', err));
        }
        else{
          Linking.openURL(PLAY_STORE_LINK).catch(err => console.error('An error occurred', err));
        }
      }else if(i === 5){
        try {
          const result = Share.share({
            message:
            "Hey check out this app at: https://play.google.com/store/apps/details?id=com.swayamauth",
            title:"SwayamAuth",
            url:"https://play.google.com/store/apps/details?id=com.swayamauth"
          });

          if (result.action === Share.sharedAction) {
            alert("Post Shared")
          } else if (result.action === Share.dismissedAction) {
            // dismissed
            alert("Post cancelled")
          }
        } catch (error) {
          alert(error.message);
        }
      }else {
      rest.navigation.navigate(sideMenuItems[i].navigateScreenName)
    }

    }}>
        <View style={[styles.menuItemViewContainer, {backgroundColor: index === i ? Colors.white : Colors.white}]}>
          <Image source={sideMenuItems[i].icon} style={styles.imageMenuItem} />
          <Text style={styles.menuText}>{sideMenuItems[i].name}</Text>
        </View>
    </TouchableOpacity>)
  }
  return (
    <DrawerContentScrollView {...rest} contentContainerStyle={{flex: 1}}>
      <View style={styles.menuHeaderRootContainer}>
        <View style={styles.menuProfileViewContainer}>
          <View style={styles.profilePictureView}>

           {
             !Utils.isStringNull(profilePicture) ?
               <Image style={styles.imageProfilePicture}
               source={{uri:profilePicture}} />
             :
               <Image style={styles.defaultProfilePicture}
               source={require("../assets/profile_placeholder.png")}
               resizeMode='cover'/>
           }

          </View>
          <View style={{flex: 1}}>
              <Text style={styles.userNameText}>{name}</Text>
            {/*<Text style={styles.emailUserText}>{email}</Text>*/}
          </View>
        </View>
      {/*<View style={styles.divider}/>*/}
        </View>
        <View style={{flex: 1}}>
        <View style={{flex: 1}}>
        {menuItemView}
        </View>
        <TouchableOpacity  style={styles.menuItemViewTouchContainer} onPress={()=> {
          Alert.alert(
               '',
               Strings.are_you_want_to_sure_logout_from_this_app,
               [
                  {text: Strings.no, onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                  {text: Strings.yes, onPress: async () => {
                    await AsyncStorage.clear();
                    rest.navigation.reset({
                        index: 0,
                        routes: [
                        {
                          name: 'LoginScreen',
                        },
                      ],
                    })
                    }},
               ],
               { cancelable: false }
          )
        }}>
            <View style={[styles.menuItemViewContainer, {backgroundColor : Colors.app_color}]}>
              <Image source={require("../assets/ic_sidemenu_logout.png")} style={styles.imageMenuItem} />
              <Text style={[styles.menuText,{color:Colors.white}]}>{"Logout"}</Text>
            </View>
        </TouchableOpacity>
        </View>
    </DrawerContentScrollView>
  );
}

const Drawer = createDrawerNavigator();

import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const ContentScreenLayoutContainer = ({data, navigation, style}) => {
  return (
    <View style={[styles.contentViewContainer, style]}>
      <View style={{flex: 1}}>
        <SideMenuNavigator screenProps={data.route} />
        </View>
    </View>
  );
};

export default class SideMenu extends Component{

  constructor(props){
    super(props);
    this.state={
          loading: false,
          email:'',
          username:'',
          profile_picture:'',
    }
  }

  componentDidMount(){
    this.getData();
  }

  async getData(){
    let email = await AsyncStorage.getItem('@email')
    let username = await AsyncStorage.getItem('@first_name')
    let profile_picture = await AsyncStorage.getItem('@profile_picture')
    this.setState({username:username,email:email,profile_picture:profile_picture})
  }

  render() {
    const {username,email,profile_picture} = this.state;
    return(
      <SideMenuNavigatorDrawer data={this.props} name={this.state.username} email={this.state.email} profilePicture={this.state.profile_picture}/>
    )
  }
}

function SideMenuNavigatorDrawer({name,data, email, profilePicture}) {

  /*const[progress, setProgress] = React.useState(new Animated.Value(0))
  const paddingAnim = Animated.interpolate(progress, {
    inputRange: [0, 1],
    outputRange: [1, 0.9],
  });
  const animSlideRadius = Animated.interpolate(progress, {
    inputRange: [0, 1],
    outputRange: [0, 8],
  });*/
  const screenStyles = { borderRadius: 0, borderWidth: 0, overflow:'hidden', borderColor: 'white',};
  return (
      <Drawer.Navigator initialRouteName="Home"
      drawerType="overlay"
      drawerContent={({ progress, ...props }) => {
        //setProgress(progress);
        return <CustomDrawerMenuItemContent name={name} email={email} profilePicture={profilePicture}  rest={props} />
      }}
      drawerStyle={{
        backgroundColor: Colors.white,
        }}
        //overlayColor="transparent"
        drawerContentOptions={{
        activeTintColor: Colors.color_menu_background_color,
          activeTintColor: Colors.color_menu_background_color,
          inactiveTintColor: Colors.color_menu_background_color,
        }}
        sceneContainerStyle={{backgroundColor: Colors.color_menu_background_color}}>
        <Drawer.Screen name="Home" >
        {props => <ContentScreenLayoutContainer {...props} data={data} style={screenStyles} />}
        </Drawer.Screen>
      </Drawer.Navigator>
  );
}


const styles = StyleSheet.create({
  contentViewContainer: {
    flex: 1,
    shadowColor: Colors.black,
    shadowOffset: {
     width: 0,
     height: 1,
    },
    backgroundColor: Colors.white,
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 4,
  },
  menuHeaderRootContainer: {
    paddingLeft: ScaleSizeUtils.PADDING_DEFAULT,
    paddingRight: ScaleSizeUtils.PADDING_DEFAULT/2,
    paddingTop: ScaleSizeUtils.PADDING_DEFAULT,
    paddingBottom: ScaleSizeUtils.PADDING_DEFAULT,
    backgroundColor:Colors.app_color,
    marginTop:-ScaleSizeUtils.MARGIN_TEN
  },
  menuProfileViewContainer: {
    flexDirection: 'row',
    //marginBottom: ScaleSizeUtils.PADDING_DEFAULT,
    alignItems: 'center',

  },
  userNameText: {
    //fontWeight: 'bold',
    fontSize: getFontSize(20),
    fontFamily:AppFonts.font_semibold,
    color:Colors.white
  },
  iconMenu: {
    marginLeft: ScaleSizeUtils.MARGIN_TEN,
    tintColor: Colors.black,
  },
  emailUserText: {
    fontSize: getFontSize(15) * 0.9,
    fontFamily:AppFonts.font_tt_norms_medium
  },
  divider: {
    backgroundColor: Colors.black,
    height: 1,
    width: '100%',
    alignSelf: 'center'
  },
  menuText: {
    marginLeft: getLayoutSize(20),
    fontSize: getFontSize(17),
    fontFamily:AppFonts.font_regular
  },
  profilePictureView: {
    backgroundColor: Colors.white,
    borderRadius: ScaleSizeUtils.HEIGHT_MENU_PROFILE_PICTURE/2,
    height: ScaleSizeUtils.HEIGHT_MENU_PROFILE_PICTURE,
    width: ScaleSizeUtils.HEIGHT_MENU_PROFILE_PICTURE,
    marginRight: ScaleSizeUtils.PADDING_DEFAULT,
    justifyContent:'center',
    alignItems:'center',
  },
  imageProfilePicture: {
    height: ScaleSizeUtils.HEIGHT_MENU_PROFILE_PICTURE,
    width: ScaleSizeUtils.HEIGHT_MENU_PROFILE_PICTURE,
    resizeMode: 'contain',
    borderRadius: ScaleSizeUtils.HEIGHT_MENU_PROFILE_PICTURE/2,
  },

  defaultProfilePicture: {
    height: ScaleSizeUtils.HEIGHT_MENU_PROFILE_PICTURE,
    width: ScaleSizeUtils.HEIGHT_MENU_PROFILE_PICTURE,
    resizeMode: 'contain',
    alignSelf:'center',
    alignItems:'center',
  },

  menuItemViewTouchContainer: {
    flexDirection: 'row',
    marginTop: ScaleSizeUtils.MARGIN_TEN,
  },
  menuItemViewContainer: {
    flexDirection: 'row',
    width: '100%',
    paddingLeft: ScaleSizeUtils.PADDING_DEFAULT,
    paddingTop: ScaleSizeUtils.MARGIN_TEN,
    paddingBottom: ScaleSizeUtils.MARGIN_TEN,
    paddingRight: ScaleSizeUtils.PADDING_DEFAULT,
    backgroundColor: Colors.white,
  },
  imageMenuItem: {
    height: ScaleSizeUtils.MENU_ICON_HEIGHT,
    width: ScaleSizeUtils.MENU_ICON_HEIGHT,
    resizeMode: 'contain'
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    fontSize: getFontSize(15),
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});
