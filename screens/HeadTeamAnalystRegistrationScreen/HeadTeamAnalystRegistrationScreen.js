import React, { useEffect, useState, Component  } from 'react'
import { Image, Text, TextInput, TouchableOpacity, ScrollView , View , ActivityIndicator} from 'react-native';
import styles from './styles';
// import * as firebase from 'firebase/app';
import firebase from 'firebase/app'
import 'firebase/auth';
import 'firebase/database';




export default class HeadTeamAnalystRegistrationScreen extends Component{

    constructor() {
        super();
        this.state = {
            fullName: '',
            email: '', 
            password: '',
            confirmPassword:'',
            inviteCode:'',
            teamplayerlimit: 0,
            teamgamelimit:0,
            isLoading: false,
            teaminvitecode: ''
        }


  
    
    }


    
    onSignUpPress = () => {
       
        const { fullName, email, password } = this.state

  
        if (fullName.length > 0) {
            
                 
        }
        else
        {
            alert("Please enter your full name.")
        }
     


    //  Password confirmation Check
    if (this.state.password !== this.state.confirmPassword) {
        alert("Passwords don't match.")
        return
    }
  


     
     

            //Validation for TeaminviteCode - This must be unique within the users records

            //snapshot searching for data.teaminvitecode 
                //If exist alert user
                //catch then create user 


    //    const checkUniqueness = firebase.database().ref('users').orderByChild('teaminvitecode').equalTo(data.teaminvitecode).once('value').then(function(snapshot)  {

    //     alert('not un');

    //    }).catch(function() {
    //     alert('We cna ');
    // });

    const data = {

        teaminvitecode:this.state.teaminvitecode
    
        
    };

    //Check if the team invite is completely unique in the users list
    const checkUniqueness = firebase.database().ref("users").orderByChild('teaminvitecode').equalTo(data.teaminvitecode).once('value' , snapshot =>  {
        if (snapshot.exists()){
          alert('This team invite code is not unique, try again');
        }
        else
        {

            firebase
            .auth()
            .createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then((response) => {
                const uid = response.uid;
                const userType = "HeadTeamAnalyst";
                const data2 = {
                    id: uid,
                    email: this.state.email,
                    fullName: this.state.fullName,
                    userType:   userType,
                    teamCreated: 0,
                    teamplayerlimit:this.state.teamplayerlimit,
                    teamgamelimit:this.state.teamgamelimit,
                    teaminvitecode:this.state.teaminvitecode
                
                    
                };
    

                const usersRef = firebase.database().ref('users/' + uid)
                     usersRef
                         .set(data2)
                              .then(() => {
                                        this.setState({
                                            isLoading: true,
                                        })
                                    
                                        this.props.navigation.navigate('Login')
                                    })
                                    .catch((error) => {
                                        alert(error)
                                    });
                            })
                            .catch((error) => {
                                alert(error)
                        });
        }

    });
      


 }
   
   
  render(){
    if(this.state.isLoading){
        return(
          <View style={styles.preloader}>
            <ActivityIndicator size="large" color="#9E9E9E"/>
          </View>
        )
      }    
    return (
        <ScrollView styles= {{ backgroundColor: '#252626'}}>
                <Text style={styles.footerText}> Please enter your full name:</Text>
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#aaaaaa"
                    placeholder='Please enter your full name'
                    // onChangeText={(text) => setFullName(text)}
                    onChangeText={(text) => this.setState({fullName:text})}
                    value={this.state.fullName}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />

                <Text style={styles.footerText}> Please enter your email:</Text>
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#aaaaaa"
                    placeholder='Please enter your email'
                    // onChangeText={(text) => setEmail(text)}
                    onChangeText={(text) => this.setState({email:text})}
                    value={this.state.email}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />

                <Text style={styles.footerText}> Please enter your password:</Text>
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#aaaaaa"
                    secureTextEntry
                    placeholder='Password'
                    // onChangeText={(text) => setPassword(text)}
                    onChangeText={(text) => this.setState({password:text})}
                    value={this.state.password}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                 <Text style={styles.footerText}> Please confirm your password:</Text>
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#aaaaaa"
                    secureTextEntry
                    placeholder='Confirm Password'
                    // onChangeText={(text) => setConfirmPassword(text)}
                    onChangeText={(text) => this.setState({confirmPassword:text})}
                    value={this.state.confirmPassword}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />

            <Text style={styles.footerText}> Please enter the team player limit for this client (30 is standard) :</Text>
                <TextInput
                        style={styles.input}
                        placeholderTextColor="#aaaaaa"
                        placeholder='Please enter the team player limit for this client'
              
                        onChangeText={(text) => this.setState({teamplayerlimit:text})}
                        value={this.state.teamplayerlimit}
                        underlineColorAndroid="transparent"
                        autoCapitalize="none"
                    />

            <Text style={styles.footerText}> Please enter the team game limit for this client (30 is standard - You may select more if this is in their payment package) :</Text>
                <TextInput
                        style={styles.input}
                        placeholderTextColor="#aaaaaa"
                        placeholder='Please enter the team game limit for this client'
                        onChangeText={(text) => this.setState({teamgamelimit:text})}
                        value={this.state.teamgamelimit}
                        underlineColorAndroid="transparent"
                        autoCapitalize="none"
                    />
                

            <Text style={styles.footerText}> Please enter their team invite code :</Text>
                <TextInput
                        style={styles.input}
                        placeholderTextColor="#aaaaaa"
                        placeholder='Please enter their team invite code'
                        onChangeText={(text) => this.setState({teaminvitecode:text})}
                        value={this.state.teaminvitecode}
                        underlineColorAndroid="transparent"
                        autoCapitalize="none"
                    />

                <View style={styles.footerView}>
                    <TouchableOpacity style={styles.button} onPress={this.onSignUpPress}>
                    <Text style={styles.buttonTitle}>Sign up!</Text>
                    </TouchableOpacity>
                </View>


        </ScrollView>
    )
}

}