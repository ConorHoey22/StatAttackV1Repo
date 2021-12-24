
import React, { useEffect, useState , Component  } from 'react'
import {FlatList, Keyboard,  StyleSheet, Text, ScrollView ,View , TouchableOpacity,TextInput ,Picker, Button , Alert} from 'react-native'

import firebase from 'firebase/app'
 import 'firebase/auth';
import 'firebase/database';

import { useNavigation } from '@react-navigation/native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

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
             teamAdminInvite:'',
          
             displayOptions: true,
             displayExistingSignup: false,
             displayNewAccountSignup:false,
             HA_ID:'',
             Verified:false
            

        
        }


    
    }

 


    

  

// //                 // console.log('User Found');
// //         //When someone creates account using the same Teaminvitecode and playercode which has already been created before/ used? 
// //             //What should be prompt
// //             //What is the current process looking like , are they able to join a team or are they added to the team??


// //         // const { fullName, email, password , inviteCode , sportType , teamAdminInvite  } = this.state;


// //             // var AccountCreationStatus = this.state.AccountCreationStatus;
    
// //           var fullName = this.state.fullName;
// //           var email = this.state.email;
// //           var password = this.state.password;
// //           var inviteCode = this.state.inviteCode;
// //           var sportType = this.state.sportType;
// //           var teamAdminInvite = this.state.teamAdminInvite;
      

// //             //  if (fullName.length > 0) {
                
                     
// //             //  }
// //             //  else
// //             //  {
// //             //     return alert("Please enter your full name.")
// //             //  }

       
// //             //  //  Password confirmation Check
// //             //  if (this.state.password !== this.state.confirmPassword) {
// //             //     return alert("Passwords don't match.")
                
// //             //  }


// //             //  if(sportType == '')
// //             //  {
// //             //     return alert("Please select a sport")
               
// //             //  }

// //             //  if(email == '')
// //             //  {
// //             //     return alert("Please enter your email")
                
// //             //  }


           
       
// //             //  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
// //             //  if (reg.test(email) === false) 
// //             //  {
// //             //    return alert("Email is Not Correct");
               


// //             //  }
                     
               
                
             

// //             //  if(teamAdminInvite == '')
// //             //  {
// //             //     return alert("Please enter your team invite code");
            
// //             //  }

// //             //  if(inviteCode == '')
// //             //  {
// //             //     return alert("Please enter your player invite code");
               
// //             //  }


// //         // GET team An UID by have a matching Team Invite code entered by the user
 

// //         //This Function is if the a Team Admin has created a temporary player account for this user and now the user would like to activate a proper User/Player Account



// //             //First Find the Team 
// //             //find the player matching team record with invitecode 
// //                 //IF success - Update UserID with new ID 
// //                 //ELSE - Fail , already in use or activated


// //         //Find the Team 
// //             const findTeam = firebase.database().ref('/teams').orderByChild("teamAdminInvite").equalTo(teamAdminInvite)
// //             .once('value').then(function(snapshot) {
// //                 //IF TEAM INVITE CODE EXISTS
// //                 if(snapshot.exists()) {
                    
// //                         snapshot.forEach(function (childSnapshot) {

// //                         var value = childSnapshot.val();


// //                         //obtain the TEAM id
// //                         var HA_ID = value.CreatedByUserID;
   
// //                         var TeamRecordSportType = value.SportType; 
   
   
   
                   

// //                     // Find matching team player record 
// //                     const find = firebase.database().ref('teams').child(HA_ID).child('players').orderByChild('inviteCode').equalTo(inviteCode)
// //                          .once('value').then(function(snapshot1)  {

// //                         if(snapshot.exists()) {
                            
// //                             snapshot1.forEach(function (childSnapshot1) {

// //                                 var value1 = childSnapshot1.val();

// //                                 var VerifiedVariable = value1.Verified;

                                
// //                                 //Check that SportType matches temp Player Record

// //                                 if(TeamRecordSportType == sportType)
// //                                 {

// //                                     //Account Verification check
// //                                     if(value1.Verified == false)
// //                                     {
// //                                             // Create User Account
// //                                             firebase
// //                                             .auth()
// //                                             .createUserWithEmailAndPassword(email, password)
// //                                             .then((response) => {
// //                                                 const uid = response.user.uid
// //                                                 const userType = "Player"


// //                                                 if(sportType == 'GAA')
// //                                                 {

// // //Try set state here
// // //Rewrite it

// //                                                     // this.setState()

// //                                                     const data = {
// //                                                             id: uid,
// //                                                             teamID: HA_ID,
// //                                                             email: email,
// //                                                             fullName: fullName,
// //                                                             userType:  userType,
// //                                                             totalPoints:0,
// //                                                             totalPasses: 0,
// //                                                             totalShots:0,
// //                                                             totalShotsOnTarget:0,
// //                                                             totalTackles:0,
// //                                                             totalWonTheBall:0,
// //                                                             totalLostTheBall:0,
// //                                                             totalYellowCards:0,
// //                                                             totalRedCards:0,
// //                                                             totalAssists:0
// //                                                     };


// //                                                     const usersRef = firebase.database().ref('users/' + uid)
// //                                                     usersRef
// //                                                         .set(data)
// //                                                          .then(() => {
                                                     

// //                                                             childSnapshot1.ref.update({UserID: data.id , Verified: true, inviteCode:''});
// //                                                             // return alert("Account Created", this.props.navigation.navigate('Login'));
// //                                                             function1();


                                          
// //                                                             // this.handleAuthorChange();
                                                          
                                        
                                                          
                                    
                                                             
                                                    
                                                

                                                    
// //                                                         });

                                                    
                                                        
                                                

// //                                                 }
// //                                                 else if(sportType == 'Soccer')
// //                                                 {
// //                                                     const data = {
// //                                                         id: uid,
// //                                                         teamID: HA_ID,
// //                                                         email: email,
// //                                                         fullName: fullName,
// //                                                         userType:   userType,
// //                                                         totalPasses: 0,
// //                                                         totalShots:0,
// //                                                         totalShotsOnTarget:0,
// //                                                         totalTackles:0,
// //                                                         totalWonTheBall:0,
// //                                                         totalLostTheBall:0,
// //                                                         totalYellowCards:0,
// //                                                         totalRedCards:0,
// //                                                         totalAssists:0
// //                                                     };
                                                   
                                                   
// //                                                     const usersRef = firebase.database().ref('users/' + uid)
// //                                                     usersRef
// //                                                         .set(data)
// //                                                         // .then(() => {
// //                                                             then(res => {
                                                            
// //                                                             // useState({AccountCreationStatus:true});
                                                            
// //                                                             childSnapshot1.ref.update({UserID: data.id , Verified: true, inviteCode:''});
                                                         
                                                       
// //                                                             return alert("Account Created", this.props.navigation.navigate('Login'));
                                      

                                                              
        

// //                                                         });


                                         
// //                                                 }
    

// //                                             });

// //                                         }
                                       
                                    

// //                                     }
// //                                     else
// //                                     {
                                      
// //                                         return alert('Sport type does not match existing account - Please Try Again');
                                      
// //                                     }
                                

// //                             });

// //                         }
// //                         else{
                            
                           
// //                             return alert('Unable to find Player record - Please enter a valid Player invite code');
                            
// //                         }
                  
// //                         });


// //                     });
                
// //                 }
// //                 else{
// //                         //INVALID TEAM INVITE CODE
// //                         alert('Please provide a valid team invite code');
// //                         return;
// //                 }
// //             }) // END SNAPSHOT - FindTeam

// //     }
    
  
   
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






    LinkAccount = async() => {


      
        const { fullName, email, password , inviteCode , sportType , teamAdminInvite , Verified} = this.state;

        //   FullName Check
        if (this.state.fullName.length > 0) {
                            
                                
        }  
        else
        {
             alert("Please enter your full name.");
             return;
        }    


        //   Password confirmation Check
        if (this.state.password.length > 6) {
                            
                                
        }  
        else
        {
             alert("Password must be greater than 6 characters.");
             return;
        }    


     //   Password confirmation Check
         if (this.state.password !== this.state.confirmPassword) 
         {
             alert("Passwords don't match.");
             return;
         }

     //  Sport Type check
         if(this.state.sportType == '')
         {
             alert("Please select a sport");
             return;
         }
     
         if(this.state.email == '')
         {
                  alert("Please enter your email")
                  return;
                         
         }
       

                     let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                     if (reg.test(this.state.email) === false) 
                     {
                          alert("Email is Not Correct");
                          return;
                     }
                            

                     if(this.state.teamAdminInvite == '')
                     {
                         alert("Please enter your team invite code");
                         return;
                   
                     }
       
                     if(this.state.inviteCode == '')
                     {
                         alert("Please enter your player invite code");
                         return;
                      
                     }




        //GET team An UID by have a matching Team Invite code entered by the user
    

     

        const userteaminvitecode = firebase.database().ref('/teams').orderByChild("teamAdminInvite").equalTo(teamAdminInvite)
             .once('value').then(function(snapshot) {
               
                if(snapshot.exists())
                {
                    
                    snapshot.forEach(function (childSnapshot) {

                    var value = childSnapshot.val();
                    var HA_ID = value.CreatedByUserID;
                    var TeamRecordSportType = value.SportType


                        //Check that SportType matches 
                        if(TeamRecordSportType == sportType)
                        {

                        //Find matching team player record 
                        const find = firebase.database().ref('teams').child(HA_ID).child('players').orderByChild('inviteCode').equalTo(inviteCode)
                            .once('value').then(function(snapshot1)  {

                                //Check if Exists

                                    if(snapshot1.exists()) 
                                    {
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



                                               if(sportType == 'GAA')
                                                 {



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
                                                                        
                                                                        childSnapshot1.ref.update({UserID: data.id , Verified: true, inviteCode:''});
                                                                        alert('Account Created Successfully. Try to logging in');
                                                                    });



                                                        

                                                    }
                                                    else if(sportType == 'Soccer')
                                                    {
                                                        const data = {
                                                            id: uid,
                                                            email: email,
                                                            fullName: fullName,
                                                            userType:   userType,
                                                            sportType: sportType,
                                                            inviteCode: inviteCode,
                                                            hasATeam:true,
                                                            totalGoals:0,
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
                                                                
                                                                childSnapshot1.ref.update({UserID: data.id , Verified: true, inviteCode:''});
                                                                alert('Account Created Successfully. Try to logging in');
                                                            });

                                                    }
                                                })



                                                        
                                                }
                                                else{
                                                    alert('Please log in or contact your team admin as this player account has already been activated.');
                                                }
                                            
                                            })
                                        }
                                        else
                                        {
                                            alert('Invalid player invite code- Please try again.');
                                        }

                                    })
                       
                                }

                                else
                                {
                                    alert('The sport selected does not match our records for this account');
                                }




                                })
                           
                           
                           
                           
                           
                            }
                            else
                            {
                                alert('Invalid team invite code- Please try again.');
                            }
                            
                                
                       
    
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



ExistingPlayerRegistration = async() => {

    this.setState({AccountCreationStatus:true});
 
}



















     render(){

        var options; 

        var displayOptions = this.state.displayOptions;

        var displayExistingSignup = this.state.displayExistingSignup;

        var Verified = this.state.Verified;

 
    





        if(displayOptions == true)
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



        if(displayExistingSignup == true)
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
                    onChangeText={(text) => this.setState({inviteCode:text})}
                    value={this.state.inviteCode}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />


                <Text style={stylesPlayerReg.footerText}>Please enter your "TEAM" invite code. This can be obtained from your Team Analyst:</Text>
                <TextInput
                    style={stylesPlayerReg.input}
                    placeholderTextColor="#aaaaaa"
                    placeholder='Please enter your Team invite code'
                    onChangeText={(text) => this.setState({teamAdminInvite:text})}
                    value={this.state.teamAdminInvite}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />

                <View style={stylesPlayerReg.footerView}>
                    <TouchableOpacity style={stylesPlayerReg.button}  
                   onPress={this.LinkAccount}>
                    <Text style={stylesPlayerReg.buttonTitle}>Sign up!</Text>
                    </TouchableOpacity>
                </View>

                {/* onPress={ () => { this.ExistingSignUp(), this.props.navigation.navigate('Login'); }}> */}
        </ScrollView>

            );
        }


     


//         if(this.state.displayNewAccountSignup == true)
//         {
//             options = (
//                 <ScrollView style={stylesPlayerReg.container}>
                
//                 <Text style={stylesPlayerReg.footerText}> New Account</Text>
//                 <Text style={stylesPlayerReg.footerText}> Please enter your full name:</Text>
//                 <TextInput
//                     style={stylesPlayerReg.input}
//                     placeholderTextColor="#aaaaaa"
//                     placeholder='Please enter your full name'
//                     // onChangeText={(text) => setFullName(text)}
//                     onChangeText={(text) => this.setState({fullName:text})}
//                     value={this.state.fullName}
//                     underlineColorAndroid="transparent"
//                     autoCapitalize="none"
//                 />

//                 <Text style={stylesPlayerReg.footerText}> Please enter your email:</Text>
//                 <TextInput
//                     style={stylesPlayerReg.input}
//                     placeholderTextColor="#aaaaaa"
//                     placeholder='Please enter your email'
//                     // onChangeText={(text) => setEmail(text)}
//                     onChangeText={(text) => this.setState({email:text})}
//                     value={this.state.email}
//                     underlineColorAndroid="transparent"
//                     autoCapitalize="none"
//                 />

//                 <Text style={stylesPlayerReg.footerText}> Please enter your password:</Text>
//                 <TextInput
//                     style={stylesPlayerReg.input}
//                     placeholderTextColor="#aaaaaa"
//                     secureTextEntry
//                     placeholder='Password'
//                     // onChangeText={(text) => setPassword(text)}
//                     onChangeText={(text) => this.setState({password:text})}
//                     value={this.state.password}
//                     underlineColorAndroid="transparent"
//                     autoCapitalize="none"
//                 />
//                  <Text style={stylesPlayerReg.footerText}> Please confirm your password:</Text>
//                 <TextInput
//                     style={stylesPlayerReg.input}
//                     placeholderTextColor="#aaaaaa"
//                     secureTextEntry
//                     placeholder='Confirm Password'
//                     // onChangeText={(text) => setConfirmPassword(text)}
//                     onChangeText={(text) => this.setState({confirmPassword:text})}
//                     value={this.state.confirmPassword}
//                     underlineColorAndroid="transparent"
//                     autoCapitalize="none"
//                 />

//                 <Text style={stylesPlayerReg.footerText}> Please confirm your sport:</Text>
                
//                 <Picker
//                         selectedValue={this.state.sportType}
//                         style={stylesPlayerReg.input}
//                         onValueChange={(text) => this.setState({sportType:text})}
//                         >

//                             <Picker.Item label="Select a sport" value="" />
//                             <Picker.Item label="GAA" value="GAA" />
//                             <Picker.Item label="Soccer" value="Soccer"/>


//                 </Picker>
              
//                 <View style={stylesPlayerReg.footerView}>
//                     <TouchableOpacity style={stylesPlayerReg.button} 
//                     onPress={ () => { this.NewAccountSignUp, this.props.navigation.navigate('PlayerRegistrationScreen')} }>
//                         <Text style={stylesPlayerReg.buttonTitle}>Sign up!</Text>
//                     </TouchableOpacity>
//                 </View>


//         </ScrollView>

//             );
//         }


//         if(this.state.AccountCreationStatus == true)
//         {

//             options = (
//             <ScrollView>
//                <Text style={stylesPlayerReg.footerText}> Account Created:</Text>



//                <View style={stylesPlayerReg.footerView}>
//                     <TouchableOpacity style={stylesPlayerReg.button} 
//                     onPress={ () => { this.props.navigation.navigate('Login')}}>
//                         <Text style={stylesPlayerReg.buttonTitle}>Lets Go</Text>
//                     </TouchableOpacity>
//                 </View>
//             </ScrollView>

//             );
//         }


            
  
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