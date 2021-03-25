import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Button,
  TouchableOpacity
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import colors from '../assets/colors';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

import WelcomeScreen from './WelcomeScreen';



class LoadingScreen extends Component {
  constructor() {
    super();
   
  }

  componentDidMount(){
      this.checkIfLoggedIn();
  }

// Below doesnt work 100%
  checkIfLoggedIn = () => {
      //unsubscribe will only make the system to check if the user is signed in while on loading screen
      this.unsubscribe = firebase.auth().onAuthStateChanged((user)=>{
          if(user)
          {
              // Navigate to home screen as this user exists and is logged in 
               this.props.navigation.navigate('WelcomeScreen', {user})
          }
          else
          {
               // Navigate to the user to the login screen // Below doesnt work
               this.props.navigation.navigate('Login')
          }
      })
  }

  componentWillUnmount = () => {
    this.unsubscribe();
  }


  render() {
    return (

    <View style={styles.container}>
     <ActivityIndicator size="large" color={colors.logoColor}/>
    </View>

    );
  }
}
export default LoadingScreen;

const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: "center",
    backgroundColor: colors.bgMain,
    alignItems: "center",
   
  }
});
