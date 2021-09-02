import React, { useEffect, useState , Component  } from 'react'
import {FlatList, Keyboard,  StyleSheet, Text, ScrollView ,View , TouchableOpacity,TextInput ,Picker, Button , Alert} from 'react-native'

// import * as firebase from 'firebase/app';
import firebase from 'firebase/app'
import 'firebase/auth';
import 'firebase/database';
import { ThemeColors } from 'react-navigation';



import { useNavigation } from '@react-navigation/native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { TouchableNativeFeedbackBase } from 'react-native';



class PlayerRegistrationScreen extends Component{

    constructor(props) {
        super(props);
    
        this.state = {
            fullName: '',
            email: '', 
            password: '',
            confirmPassword:'',
            inviteCode:'',
            sportType:'',
            teaminvitecode:'',
            isLoading: false,
            displayOptions: true,
            displayExistingSignup: false,
            displayNewAccountSignup:false,
        }


  
    
    }




    updateInputVal = (val, prop) => {
        const state = this.state;
        state[prop] = val;
        this.setState(state);
      }
    
      onButtonPress = () =>
      {
         this.props.navigation.navigate('Login');
      }



    ExistingSignUp = () => {


        //When someone creates account using the same Teaminvitecode and playercode which has already been created before/ used? 
            //What should be prompt
            //What is the current process looking like , are they able to join a team or are they added to the team??
                

      
        const { fullName, email, password , inviteCode , sportType} = this.state


  
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


            if(sportType == '')
            {
                alert("Please select a sport")
            }

        //GET team An UID by have a matching Team Invite code entered by the user
        var teaminvitecode = this.state.teaminvitecode;

        

            
        const userteaminvitecode = firebase.database().ref('/users').orderByChild("teaminvitecode").equalTo(teaminvitecode)
             .once('value').then(function(snapshot) {

                snapshot.forEach(function (childSnapshot) {

                var value = childSnapshot.val();
                var HA_ID = value.id;

                    //Find matching team player record 
                    const find = firebase.database().ref('teams').child(HA_ID).child('players').orderByChild('inviteCode').equalTo(inviteCode)
                        .once('value').then(function(snapshot1)  {

                            snapshot1.forEach(function (childSnapshot1) {
                            
                                var value1 = childSnapshot1.val();

                                var dd = value1.Verified;

                                if(value1.Verified == false)
                                {
                                    // Create user
                                            firebase
                                            .auth()
                                            .createUserWithEmailAndPassword(email, password)
                                            .then((response) => {
                                                const uid = response.user.uid
                                                const userType = "Player"
                                                const data = {
                                                    id: uid,
                                                    email: email,
                                                    fullName: fullName,
                                                    userType:   userType,
                                                    sportType: sportType,
                                                    inviteCode: inviteCode,
                                                    hasATeam:true,
                                                    totalGoals:0,
                                                    totalPoints:0,
                                                    totalPasses: 0,
                                                    totalShots:0,
                                                    totalShotsOnTarget:0,
                                                    totalTackles:0,
                                                    totalWonTheBall:0,
                                                    totalLostTheBall:0,
                                                    totalYellowCards:0,
                                                    totalRedCards:0,
                                                    totalAssists:0
                                                };
                                    

                                            const usersRef = firebase.database().ref('users/' + uid)
                                                    usersRef
                                                        .set(data)
                                                        .then(() => {
                                                        
                                                        

                                        
                                                        });

                                                        
                                                        childSnapshot1.ref.update({UserID: data.id , Verified: true, inviteCode:''});
                                            
                                                     
                                                     
                                                        Alert.alert('Account Created Successfully. Try to logging in' ,  
                                                      [
                                                        {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
                                                        {text: 'Yes', onPress:  () => navigation.navigate('Login')},
                                                      ],
                                                      { cancelable: false }
                                                    );
                          
                                                      
                                                      
                                                      
                                                      
                                                      
                                                    //   , this.props.navigation.navigate('Login'));
                                                        //Send user to Login screen 



                                            });


                                             
                                }
                                else{
                                    alert('This player account has already been activated. Please contact you team admin.');
                                }
                                


                            });
                                
                       
    
                        })

                })
            })

    }




    NewAccountSignUp = () => {
        
        const { fullName, email, password , inviteCode, sportType} = this.state



        if (fullName.length > 0) 
        {
            
                 
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

        
        if(sportType == '')
        {
            alert("Please select a sport")
        }




                // Create user
                            firebase
                            .auth()
                            .createUserWithEmailAndPassword(email, password)
                                .then((response) => {
                                     const uid = response.user.uid
                                        
                                        const userType = "Player"
                                        const data = {
                                            id: uid,
                                            email: email,
                                            fullName: fullName,
                                            userType:  userType,
                                            sportType: sportType,
                                            totalGoals:0,
                                            totalPoints:0,
                                            totalPasses: 0,
                                            totalShots:0,
                                            totalShotsOnTarget:0,
                                            totalTackles:0,
                                            totalWonTheBall:0,
                                            totalLostTheBall:0,
                                            totalYellowCards:0,
                                            totalRedCards:0,
                                            totalAssists:0

                                        };
                                

                                        const usersRef = firebase.database().ref('users/' + uid)
                                            usersRef
                                                .set(data)
                                                    .then(() => {
                                                        
                                                         return alert("Account Created", this.props.navigation.navigate('Login'));
                                    
                                                    });
                                    
                                        });

    }


    SignUpOptionExistingAcccount = () => {

        this.setState({displayOptions: false});
        this.setState({displayExistingSignup: true});
        this.setState({displayNewAccountSignup: false});
    }


    SignUpOptionNewAccount = () => {

        this.setState({displayOptions: false});
        this.setState({displayExistingSignup: false});
        this.setState({displayNewAccountSignup: true});
    }


    render(){

        //Option - Has your Team set up your Player Account - If click Existing Player

        //Option - New Player Account

        var options;

        if(this.state.displayOptions == true)
        {
            options = (
                <ScrollView style={stylesPlayerReg.container}>
                  
                  <Text style={stylesPlayerReg.footerText}>Has your team already created a temporary player account for you? If so click the below!</Text>

                  
                            <TouchableOpacity style={stylesPlayerReg.button} onPress={this.SignUpOptionExistingAcccount}>
                                <Text style={stylesPlayerReg.buttonTitle}>Existing Player account</Text>
                            </TouchableOpacity>
                   

        
                            <Text style={stylesPlayerReg.footerText}>Click below if you want to create a new player account!</Text>

               
                            <TouchableOpacity style={stylesPlayerReg.button} onPress={this.SignUpOptionNewAccount}>
                                <Text style={stylesPlayerReg.buttonTitle}>New Player Account</Text>
                            </TouchableOpacity>
                   


                </ScrollView>

            )
        }

        if(this.state.displayExistingSignup == true)
        {
            options = (
                <ScrollView style={stylesPlayerReg.container}>
                <Text style={stylesPlayerReg.footerText}> Please enter your full name:</Text>
                <TextInput
                    style={stylesPlayerReg.input}
                    placeholderTextColor="#aaaaaa"
                    placeholder='Please enter your full name'
                    // onChangeText={(text) => setFullName(text)}
                    onChangeText={(text) => this.setState({fullName:text})}
                    value={this.state.fullName}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />

                <Text style={stylesPlayerReg.footerText}> Please enter your email:</Text>
                <TextInput
                    style={stylesPlayerReg.input}
                    placeholderTextColor="#aaaaaa"
                    placeholder='Please enter your email'
                    // onChangeText={(text) => setEmail(text)}
                    onChangeText={(text) => this.setState({email:text})}
                    value={this.state.email}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />

                <Text style={stylesPlayerReg.footerText}> Please enter your password:</Text>
                <TextInput
                    style={stylesPlayerReg.input}
                    placeholderTextColor="#aaaaaa"
                    secureTextEntry
                    placeholder='Password'
                    // onChangeText={(text) => setPassword(text)}
                    onChangeText={(text) => this.setState({password:text})}
                    value={this.state.password}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                 <Text style={stylesPlayerReg.footerText}> Please confirm your password:</Text>
                <TextInput
                    style={stylesPlayerReg.input}
                    placeholderTextColor="#aaaaaa"
                    secureTextEntry
                    placeholder='Confirm Password'
                    // onChangeText={(text) => setConfirmPassword(text)}
                    onChangeText={(text) => this.setState({confirmPassword:text})}
                    value={this.state.confirmPassword}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />


                <Text style={stylesPlayerReg.footerText}> Please confirm your sport:</Text>
              
                <Picker
                        selectedValue={this.state.sportType}
                        style={stylesPlayerReg.input}
                        onValueChange={(text) => this.setState({sportType:text})}
                        >

                            <Picker.Item label="Select a sport" value="" />
                            <Picker.Item label="GAA" value="GAA" />
                            <Picker.Item label="Soccer" value="Soccer"/>


                </Picker>

                <Text style={stylesPlayerReg.footerText}>Please enter your "PLAYER" invite code. This can be obtained from your Team Analyst:</Text>
                <TextInput
                    style={stylesPlayerReg.input}
                    placeholderTextColor="#aaaaaa"
                    placeholder='Please enter your Player invite code'
                    // onChangeText={(text) => setInviteCode(text)}
                    onChangeText={(text) => this.setState({inviteCode:text})}
                    value={this.state.inviteCode}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />


                <Text style={stylesPlayerReg.footerText}>Please enter your "TEAM" invite code. This can be obtained from your Team Analyst:</Text>
                <TextInput
                    style={stylesPlayerReg.input}
                    placeholderTextColor="#aaaaaa"
                    placeholder='Please enter your Teaminvite code'
                    // onChangeText={(text) => setInviteCode(text)}
                    onChangeText={(text) => this.setState({teaminvitecode:text})}
                    value={this.state.teaminvitecode}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />

                <View style={stylesPlayerReg.footerView}>
                    <TouchableOpacity style={stylesPlayerReg.button} onPress={this.ExistingSignUp}>
                    <Text style={stylesPlayerReg.buttonTitle}>Sign up!</Text>
                    </TouchableOpacity>
                </View>


        </ScrollView>

            );
        }

        if(this.state.displayNewAccountSignup == true)
        {
            options = (
                <ScrollView style={stylesPlayerReg.container}>
                
                <Text style={stylesPlayerReg.footerText}> New Account</Text>
                <Text style={stylesPlayerReg.footerText}> Please enter your full name:</Text>
                <TextInput
                    style={stylesPlayerReg.input}
                    placeholderTextColor="#aaaaaa"
                    placeholder='Please enter your full name'
                    // onChangeText={(text) => setFullName(text)}
                    onChangeText={(text) => this.setState({fullName:text})}
                    value={this.state.fullName}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />

                <Text style={stylesPlayerReg.footerText}> Please enter your email:</Text>
                <TextInput
                    style={stylesPlayerReg.input}
                    placeholderTextColor="#aaaaaa"
                    placeholder='Please enter your email'
                    // onChangeText={(text) => setEmail(text)}
                    onChangeText={(text) => this.setState({email:text})}
                    value={this.state.email}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />

                <Text style={stylesPlayerReg.footerText}> Please enter your password:</Text>
                <TextInput
                    style={stylesPlayerReg.input}
                    placeholderTextColor="#aaaaaa"
                    secureTextEntry
                    placeholder='Password'
                    // onChangeText={(text) => setPassword(text)}
                    onChangeText={(text) => this.setState({password:text})}
                    value={this.state.password}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                 <Text style={stylesPlayerReg.footerText}> Please confirm your password:</Text>
                <TextInput
                    style={stylesPlayerReg.input}
                    placeholderTextColor="#aaaaaa"
                    secureTextEntry
                    placeholder='Confirm Password'
                    // onChangeText={(text) => setConfirmPassword(text)}
                    onChangeText={(text) => this.setState({confirmPassword:text})}
                    value={this.state.confirmPassword}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />

                <Text style={stylesPlayerReg.footerText}> Please confirm your sport:</Text>
                
                <Picker
                        selectedValue={this.state.sportType}
                        style={stylesPlayerReg.input}
                        onValueChange={(text) => this.setState({sportType:text})}
                        >

                            <Picker.Item label="Select a sport" value="" />
                            <Picker.Item label="GAA" value="GAA" />
                            <Picker.Item label="Soccer" value="Soccer"/>


                </Picker>
              
                <View style={stylesPlayerReg.footerView}>
                    <TouchableOpacity style={stylesPlayerReg.button} onPress={this.NewAccountSignUp}>
                        <Text style={stylesPlayerReg.buttonTitle}>Sign up!</Text>
                    </TouchableOpacity>
                </View>


        </ScrollView>

            );
        }



  
    return (
     <ScrollView style={stylesPlayerReg.container}>
            {options}
      </ScrollView>
    )
}

}


const stylesPlayerReg = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#252626',
    },
   
    logo: {
        flex: 1,
        height: 120,
        width: 90,
        alignSelf: "center",
        margin: 30
    },
    input: {
        height: 48,

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
        marginRight: 30,
        marginTop: 20,
        height: 48,
        borderRadius: 5,
        borderWidth: 2,
        borderColor:'#000000',
        alignItems: "center",
        justifyContent: 'center'
    },
    buttonTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: "bold"
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
    }
});


export default PlayerRegistrationScreen;