import React, { useEffect, useState, Component } from 'react'
import { ScrollView,Image, Text, TextInput,StyleSheet, TouchableOpacity, View ,Button ,Picker} from 'react-native'

import firebase from 'firebase/app'
import 'firebase/auth';
import 'firebase/database';

import {Dimensions} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';


 
const screenWidth = Dimensions.get('window').width;

const screenHeight = Dimensions.get('window').height;


class LoginScreen extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            email: '',
            password: '',
            selectedPlayer:'',
            dataList:[],
            fullname:'',
            UserID:0,
            

            SelectedStartingTeam: []
          
         };
      }

    componentDidMount(){


      const fullname = this.state.fullname;
      const UserID = this.state.UserID;

      const tempArr = {
        
        UserID:   1,
        fullname: 'dsa'
       

         };

    // // teamplayersref.push(playerData);
    // addgame.push(playerData);





      this.state.SelectedStartingTeam.push(tempArr);

      console.log(this.state.SelectedStartingTeam);
    


 

    }

    onLogin = async() => {

        const email = this.state.email;
        const password = this.state.password;


        if(this.state.email == '' || this.state.password == '') {
          alert('Enter details to signin!')
        } else {
          this.setState({
            isLoading: true,
          });


         
    
            firebase.auth()
                .signInWithEmailAndPassword(email, password)
                .then(() => this.props.navigation.navigate('Home'))
                .catch(error => alert(error.toString(error)));

                  

                  
            
        }
    

  }


  




            


    render (){

    


          

        
        return(
            

          
            <ScrollView style={styles.container}>
             <Text style={styles.Text}> Please enter your email:</Text>
              <TextInput
                  name='email'
                  style={styles.input}
                  placeholderTextColor="#aaaaaa"
                  placeholder='Please enter your email'
                  onChangeText={(text) => this.setState({email:text})}
                  value={this.state.email}
                  underlineColorAndroid="transparent"
                  autoCapitalize="none"
              />
              <Text style={styles.Text}> Please enter your password:</Text>
              <TextInput
                  name='password'
                  style={styles.input}
                  placeholderTextColor="#aaaaaa"
                  secureTextEntry
                  placeholder='Password'
            
                  onChangeText={(text) => this.setState({password:text})}
                  value={this.state.password}
                  underlineColorAndroid="transparent"
                  autoCapitalize="none"
              /> 
                            
             <TouchableOpacity style={styles.button} onPress={this.onLogin}>
                  <Text style={styles.Text}>Login</Text>
              </TouchableOpacity>  
          



            </ScrollView>

          //   <ScrollView>
       
          //     <ScrollView>
          //       <SmartPicker
          //         selectedValue={this.state.selectedPlayer}
          //         label='Set you favorite country'
          //        onValueChange={this.handleChange}
          //       >
          //       {this.state.SelectedStartingTeam.map((item, index) => {
          //           return (
                          
          //                 <Picker.Item label={item.fullname} value={item.UserID}/>)
          //           })}

          //       </SmartPicker>
          //     </ScrollView>
           
          // </ScrollView>

        )

    

  }

}

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#252626',
  
    },

    card:{
      borderWidth: 1,
      height:'100%',
      width: '100%',
      borderColor: "#C30000",
      borderRadius: 10,
      backgroundColor: "#ffffff",
      marginTop: 10,
      marginLeft: 4
    },
    logo: {
        flex: 1,
        height: 120,
        width: 90,
        alignSelf: "center",
        margin: 30
    },
    input: {
        height: 60,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'white',
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 30,
        marginRight: 30,
        paddingLeft: 16
    },
    button: {
        backgroundColor: '#C30000',
        marginLeft: 30,
        marginRight: 50,
        marginTop: 20,
        height: 48,
        width:150,
        borderRadius: 5,
        borderWidth: 2,
        borderColor:'#000000',
        alignItems: "center",
        justifyContent: 'center'
    },
    Text:{
      color: "white",
      fontSize:15,
      marginTop: 10,
      marginBottom: 10,
      marginLeft: 16,
      marginRight: 30,
      paddingLeft: 16,
      fontWeight: "bold",
     
  
  },
    footerView: {
        flex: 1,
        alignItems: "center",
        marginTop: 20
    },
    footerText: {
        fontSize:18,
        height: 30,
        marginTop: 15,
        marginBottom: 5,
        marginLeft: 20,
        marginRight: 30,
        paddingLeft: 10,
        color: 'white',
        fontWeight: "bold",
    },
    footerLink: {
        color: "#788eec",
        fontWeight: "bold",
        fontSize: 16
    },


  
  
   
    test: {
      backgroundColor: '#000000',
      borderWidth: 4,
      borderColor:'#949494',
      borderRadius: 6,
    }
  });

export default LoginScreen;