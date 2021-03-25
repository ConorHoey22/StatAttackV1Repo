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



// const functions = require('firebase-functions')
// const admin = require('firebase-admin')
// admin.initializeApp(functions.config().firebase)
// const db = admin.database().ref()

function GoToButton({ screenName }) {
    const navigation = useNavigation();
  
    return (
      <Button
        title={`${screenName}`}
        onPress={() => navigation.navigate(screenName)}
      />
    );
  }
  
  
  
  function SignUpNavigation({ navigation }) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
  
        <GoToButton screenName="Login" />
   
      </View>
    );
  }

class SignUpScreen extends Component {
  constructor() {
    super();
    this.state = {
      first_name:'',
      last_name:'',
      email: '',
      password: '',
      isLoading: false
    };
  }

 
  onSignUp = async () => {
    if (this.state.email && this.state.password) {
      this.setState({ isLoading: true });

      const store = admin.firestore()

      try {
        const response = await firebase
          .auth()
          .createUserWithEmailAndPassword(
            this.state.email,
            this.state.password
          );

         

          if(response)
          {


            let userData = {
              first_name: this.state.first_name,
              last_name: this.state.first_name,
              utype: 1,
              createdon: admin.firestore.FieldValue.serverTimestamp(),
              intitems: []
          }
  
           
              this.setState({isLoading:false});
              db.collection("users").doc(uid).add(userData)

          }
      }
      catch (error) {
          this.setState({isLoading:false});
        if(error.code == 'auth/email-already-in-use'){
          alert('User already Exists. Try Login in')
        }
      }
    } 
    else {
      alert('Please enter your email and password')
    }     
  };

  
 
  render() {

    
  
    return (

  <View style={styles.container}>
  {this.state.isLoading ? (
          <View
            style={[
              StyleSheet.absoluteFill,
              {
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                elevation: 1000
              }
            ]}
          >
            <ActivityIndicator size="large" color={colors.logoColor} />
          </View>
        ) : null}
      <View style={{ flex: 1, justifyContent: 'center', alignItems:"center" }}>
      {/* <TextInput
            style={styles.textInput}
            placeholder={'Please enter your first name'}
            placeholderTextColor={colors.bgTextInputDark}
            onChangeText={first_name => this.setState({ first_name })}
            // value={this.state.first_name}
      />

      <TextInput
            style={styles.textInput}
            placeholder={'Please enter your last name'}
            placeholderTextColor={colors.bgTextInputDark}
            onChangeText={last_name => this.setState({ last_name })}
            // value={this.state.last_name}
      /> */}
      <TextInput
            style={styles.textInput}
            placeholder={'abc@example.com'}
            placeholderTextColor={colors.bgTextInputDark}
            keyboardType="email-address"
            onChangeText={email => this.setState({ email })}
            // value={this.state.email}
      />

        <TextInput
            style={styles.textInput}
            placeholder={'Enter your password'}
            placeholderTextColor={colors.bgTextInputDark}
            secureTextEntry
            onChangeText={password => this.setState({ password })}
            // value={this.state.password}
        />
  
{/* 

  <View style={styles.container}>
      
      <TouchableOpacity
        style={styles.button}
        // onPress={onPress}
      >
        <Text>Press Here</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        // onPress={onPress}
      >
        <Text>Press Here</Text>
      </TouchableOpacity>
      </View>
  </View>
 */}

      <TextInput
            style={styles.textInput}
            placeholder={'Enter you first name'}
            placeholderTextColor={colors.bgTextInputDark}
            onChangeText={first_name => this.setState({ first_name })}
      />

      <TextInput
            style={styles.textInput}
            placeholder={'Enter you last name'}
            placeholderTextColor={colors.bgTextInputDark}
            onChangeText={last_name => this.setState({ last_name })}
      />


      {/* Buttons Container */}
        <View style={{ alignItems: "center",}}>
            <View style={styles.container1}>
            <GoToButton screenName="Login" />
            <View style={styles.container1}>
                <Button
                        title='Sign up'
                        onPress={this.onSignUp}
                        style={styles.loginButtons, { borderColor: colors.bgPrimary }}
                      
                      >               
                </Button>


              
              </View>
            </View>    
          </View>
      </View>
  </View>

    );
  }
}
export default SignUpScreen;

const styles = StyleSheet.create({
  
  textInput: {
    height: 50,
    width:300,
    borderWidth: 0.5,
    borderColor: colors.borderColor,
    marginHorizontal: 40,
    marginBottom: 10,
    color: colors.txtWhite,
    // paddingHorizontal: 20
  },
  loginButtons: {
    height: 12,
    borderWidth: 0.5,
    backgroundColor: 'transparent',
    padding: 10,
    width: 50
  },
 

  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: "center",
    backgroundColor: colors.bgMain,
    alignItems: "center",
   
  },
  container1: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingLeft:10,
    alignItems: "center",
    
  },
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10
  },
  countContainer: {
    alignItems: "center",
    padding: 10
  }
});
