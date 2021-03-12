//HeaderWhite
import React, { Component } from 'react';

import {
  Text,
  View,
  Image,
  TouchableHighlight,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet
} from 'react-native';
import { sendPostRequest, sendPostAuthenticationHeaderFormDataRequest } from '../networks/RestApiService'
import AsyncStorage from '@react-native-community/async-storage';
import {getLayoutSize,getFontSize} from '../resources/ResponsiveHelper'
import Utils from "../helper/Utils"
import { CommanStyles, Colors, AppFonts } from "../resources"
import NetInfo from "@react-native-community/netinfo";
import { DrawerActions } from '@react-navigation/native'



export default class Header extends Component {

      constructor(props) {
        super(props)
        this.state = {
              loading: false,
        };
      }



  render() {
    return (
    <View>
    <View style={[styles.shadowHeader,{backgroundColor: !this.props.headerColor ? '#fff' : this.props.headerColor }]}>

          {!!this.props.isBack && (
            <View style={{
              justifyContent: 'center',
              alignItems: 'flex-end',
                  position:'absolute',
                  left: getLayoutSize(15),}}>
              <TouchableOpacity onPress={() => this.props.navigation.goBack() }>
                  <Image
                    style={{tintColor: Colors.app_color,width:getLayoutSize(20),height:getLayoutSize(20)}}
                    source={require('../assets/backarrow.png')}
                    resizeMode='contain'
                  />
              </TouchableOpacity>
            </View>
          )}

          {!!this.props.isMenu && (
            <View style={{
              justifyContent: 'center',
              alignItems: 'flex-end',
                  position:'absolute',
                  left: getLayoutSize(15),}}>
              <TouchableOpacity onPress={() => this.props.navigation.openDrawer() }>
                  <Image
                    style={{tintColor: Colors.app_color,width:getLayoutSize(30),height:getLayoutSize(30)}}
                    source={require('../assets/menu_white.png')}
                    resizeMode='contain'
                  />
              </TouchableOpacity>
            </View>
          )}

          <Modal
            transparent={true}
            animationType={'fade'}
            visible={this.state.loading}
            onRequestClose={() => {this.setState({loading:false})}}>
              <View style={CommanStyles.modalBackground}>
                <View style={styles.activityIndicator}>
                  <ActivityIndicator
                      animating={this.state.loading} />
                </View>
              </View>
          </Modal>


      {!!this.props.title && (
        <Text style={styles.titleText}>{this.props.title}</Text>
      )}

    </View>

      <View
    style={{
      borderBottomColor: '#E6E6E6',
      borderBottomWidth: 1,
    }}
    />
    </View>

      )
  }
}
const styles = StyleSheet.create({
    shadowHeader: {
        padding: getLayoutSize(5),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f3f5f7',
        width: '100%'
    },
    titleText: {
      color: Colors.app_color,
      margin: getLayoutSize(10),
      fontFamily: AppFonts.font_medium,
      fontSize: getFontSize(20)
    },
    activityIndicator: {
        backgroundColor: '#FFFFFF',
        height: getLayoutSize(150),
        width: getLayoutSize(150),
        borderRadius: getLayoutSize(10),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
});
