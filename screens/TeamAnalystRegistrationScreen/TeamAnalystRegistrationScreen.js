import React, { Component, useEffect, useState } from 'react'
import { Image, Text, TextInput, TouchableOpacity, ScrollView , View , StyleSheet} from 'react-native';
import styles from './styles';
// import * as firebase from 'firebase/app';
import firebase from 'firebase/app'
import 'firebase/auth';
import 'firebase/database';


//--Task -fix this page so that it not a function

class TeamAnalystRegistrationScreen extends Component {
    constructor(props) {
        super(props);

        this.state = { 
            fullName:'',
            email:'',
            password:'',
            confirmPassword:'',
            teamAdminInvite:'',
            CreatedByUserID:'',
            teamAdminArray:[],
            
        };
    }



    componentDidMount(){

    }
 
    onSignUpPress = () => {

        var fullName = this.state.fullName;
        var email = this.state.email;
        var password = this.state.password;
        var confirmPassword = this.state.confirmPassword;
        var teamAdminInvite = this.state.teamAdminInvite;
        var CreatedByUserID = this.state.CreatedByUserID;

        var teamAdminArray = this.state.teamAdminArray;

        //  Full name Validation
        if(fullName == "")
        {
            alert("Please enter your full name.")
            return
        }

        //  Email Validation
        if(email == "")
        {
            alert("Please enter your email.")
            return
        }

        //  teamAdminInvite Validation
        if(teamAdminInvite == "")
        {
            alert("Please enter your teamAdminInvite code.")
            return
        }

        //  Password confirmation Check
        if (password !== confirmPassword) {
            alert("Passwords don't match.")
            return
        }
        
 


        //Check if the team exists
        const checkIFTeamExists = firebase.database().ref("teams").orderByChild('teamAdminInvite').equalTo(teamAdminInvite).once('value' , snapshot =>  {
        if (snapshot.exists()){

            //obtain Team ID 
            const teamObj = snapshot.val();

            snapshot.forEach(function(childSnapshot) {
              
                var key = childSnapshot.key;
    
                 
                teamAdminArray.push(key);

            });



             for(var i = 0; i < teamAdminArray.length; i++)
             {

            
            
                 firebase
                 .auth()
                 .createUserWithEmailAndPassword(email, password)
                 .then((response) => {
                    const uid = response.user.uid;
                    const userType = "TeamAnalyst";
                    const data2 = {
                        id: uid,
                        email: email,
                        fullName: this.state.fullName,
                        userType: userType,
                        teamAdminInvite:this.state.teamAdminInvite,
                        teamID: teamAdminArray[0],
                        hasTACreated: 0,

                    };
             
                    const usersRef = firebase.database().ref('users/' + uid)
                        usersRef
                        .set(data2)
                        .then(() => {
                            this.props.navigation.navigate('Login')
                        })      
                        .catch((error) => {
                            alert(error)
                        });
            


                    });

            }
        }

        });

    }


            
            
//                 });
//             }

//         }

//     });

// }


    //         for(var i = 0; i < teamAdminArray.length; i++)
    //         {

    //             firebase
    //             .auth()
    //             .createUserWithEmailAndPassword(email, password)
    //             .then((response) => {
    //                 const uid = response.user.uid;
    //                 const userType = "TeamAnalyst";
    //                 const data2 = {
    //                     id: uid,
    //                     email: email,
    //                     fullName: this.state.fullName,
    //                     userType: userType,
    //                     teamAdminInvite:this.state.teamAdminInvite
                    
                        
    //                 };


    //                 const usersRef = firebase.database().ref('users/' + uid)
    //                     usersRef
    //                         .set(data2)
    //                                 .then(() => {
                                        

    //                 //Add the team Analyst to the Team Record
    //                                 const addTeamAdmin = firebase.database().ref('teams').child(teamAdminArray[0]).child('teamAdmins')
                
    //                                     var adminData = {
    //                                         id: uid,
    //                                         fullName:this.state.fullName,
    //                                         teamID: teamAdminArray[0]
    //                                     };

    //                                     //update user record
    //                                     const addTeamtoUser = firebase.database().ref('users').orderByChild('id').equalTo(uid).once('value' , snapshot =>  {
    //                                         if (snapshot.exists()){

    //                                             console.log(snapshot.val());



    //                                             // var teamID = {
    //                                             //     TeamID: teamAdminArray[0],
    //                                             // };

    //                                             addTeamtoUser.update({TeamID: teamAdminArray[0]});
    //                                         }

    //                                     });
                                      
                                    


    //                                 addTeamAdmin.push(adminData);

    //                                 console.log(adminData);

    //                                         this.props.navigation.navigate('Login')
    //                                     })
    //                                     .catch((error) => {
    //                                         alert(error)
    //                                     });
    //                             })
    //                             .catch((error) => {
    //                                 alert(error)
    //                         });


    //             }  

    //         }
        
    
    //         else
    //         {
    //             alert('Cannot find Team - Maybe incorrect team admin code');
    //         }

        

    //   });
    

    // }

    render(){

        return (
            <ScrollView>
                    <Text style={styles.footerText}> Please enter your full name:</Text>
                    <TextInput
                        style={styles.input}
                        placeholderTextColor="#aaaaaa"
                        placeholder='Please enter your full name'
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
                        onChangeText={(text) => this.setState({confirmPassword:text})}
                        value={this.state.confirmPassword}
                        underlineColorAndroid="transparent"
                        autoCapitalize="none"
                    />

                    <Text style={styles.footerText}>Please enter you invite code.This can be obtained by your  Head Team Analyst - this will be in the team record:</Text>
                    <TextInput
                        style={styles.input}
                        placeholderTextColor="#aaaaaa"
                        placeholder='Please enter your invite code'
                        onChangeText={(text) => this.setState({teamAdminInvite:text})}
                        value={this.state.teamAdminInvite}
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

export default TeamAnalystRegistrationScreen;

       
    // const [fullName, setFullName] = useState('')
    // const [email, setEmail] = useState('')
    // const [password, setPassword] = useState('')
    // const [confirmPassword, setConfirmPassword] = useState('')
    // const [teamAdminInvite, setInviteCode] = useState('')


    // const CreatedByUserID = '';

    
    // const onSignUpPress = () => {
    //     //  Full name Validation
    //     if(fullName == "")
    //     {
    //         alert("Please enter your full name.")
    //         return
    //     }

    //     //  Email Validation
    //     if(email == "")
    //     {
    //         alert("Please enter your email.")
    //         return
    //     }

    //     //  teamAdminInvite Validation
    //     if(teamAdminInvite == "")
    //     {
    //         alert("Please enter your teamAdminInvite code.")
    //         return
    //     }

    //     //  Password confirmation Check
    //     if (password !== confirmPassword) {
    //         alert("Passwords don't match.")
    //         return
    //     }
    //     //Set UserType to TA
    //     if (password !== confirmPassword) {
    //         alert("Passwords don't match.")
    //         return
    //     }



//Check if the team invite is completely unique in the users list
// const checkIFTeamExists = firebase.database().ref("teams").orderByChild('teamAdminInvite').equalTo(teamAdminInvite).once('value' , snapshot =>  {
//         if (snapshot.exists()){

//             //obtain Team ID 
//             const teamObj = snapshot.val();


//             console.log(snapshot.val());

//             let CreatedByUserID = teamObj.CreatedByUserID;
//             this.setState({CreatedByUserID: teamObj.CreatedByUserID});


//              console.log(CreatedByUserID);

// console.log(email);
// console.log(password);


//             //bug here - CreatID isnt defined in state
//             firebase
//             .auth()
//             .createUserWithEmailAndPassword(email, password)
//             .then((response) => {
//                 const uid = response.user.uid;
//                 const userType = "TeamAnalyst";
//                 const data2 = {
//                     id: uid,
//                     email: email,
//                     fullName: this.state.fullName,
//                     userType:   userType,
//                     teamCreated: 0,
//                     teamplayerlimit:this.state.teamplayerlimit,
//                     teamgamelimit:this.state.teamgamelimit,
//                     teamAdminInvite:this.state.teamAdminInvite
                
                    
//                 };


//                 const usersRef = firebase.database().ref('users/' + uid)
//                     usersRef
//                         .set(data2)
//                                 .then(() => {
//                                         this.setState({
//                                             isLoading: true,
//                                         })
                                    

//                                         //Add the team Analyst to the Team Record
//                                         // const teamAdminsRef = firebase.database().ref('teams').orderByChild('')

//                                 const addTeamAdmin = firebase.database().ref('teams').child(CreatedByUserID).child('teamAdmins')

//                                     var adminData = {
//                                         id: uid,
//                                         fullName:this.state.fullName
//                                     };


//                                 addTeamAdmin.update(adminData);

//                                         this.props.navigation.navigate('Login')
//                                     })
//                                     .catch((error) => {
//                                         alert(error)
//                                     });
//                             })
//                             .catch((error) => {
//                                 alert(error)
//                         });
//             }
//             else
//             {
//                 alert('Cannot find Team - Maybe incorrect team admin code');
//             }

//       });

























//   navigation.navigate('Login')















//         }
       


    

//     return (
//         <ScrollView>
//                 <Text style={styles.footerText}> Please enter your full name:</Text>
//                 <TextInput
//                     style={styles.input}
//                     placeholderTextColor="#aaaaaa"
//                     placeholder='Please enter your full name'
//                     onChangeText={(text) => setFullName(text)}
//                     value={fullName}
//                     underlineColorAndroid="transparent"
//                     autoCapitalize="none"
//                 />

//                 <Text style={styles.footerText}> Please enter your email:</Text>
//                 <TextInput
//                     style={styles.input}
//                     placeholderTextColor="#aaaaaa"
//                     placeholder='Please enter your email'
//                     onChangeText={(text) => setEmail(text)}
//                     value={email}
//                     underlineColorAndroid="transparent"
//                     autoCapitalize="none"
//                 />

//                 <Text style={styles.footerText}> Please enter your password:</Text>
//                 <TextInput
//                     style={styles.input}
//                     placeholderTextColor="#aaaaaa"
//                     secureTextEntry
//                     placeholder='Password'
//                     onChangeText={(text) => setPassword(text)}
//                     value={password}
//                     underlineColorAndroid="transparent"
//                     autoCapitalize="none"
//                 />
//                  <Text style={styles.footerText}> Please confirm your password:</Text>
//                 <TextInput
//                     style={styles.input}
//                     placeholderTextColor="#aaaaaa"
//                     secureTextEntry
//                     placeholder='Confirm Password'
//                     onChangeText={(text) => setConfirmPassword(text)}
//                     value={confirmPassword}
//                     underlineColorAndroid="transparent"
//                     autoCapitalize="none"
//                 />

//                 <Text style={styles.footerText}>Please enter you invite code.This can be obtained by your  Head Team Analyst - this will be in the team record:</Text>
//                 <TextInput
//                     style={styles.input}
//                     placeholderTextColor="#aaaaaa"
//                     placeholder='Please enter your invite code'
//                     onChangeText={(text) => setInviteCode(text)}
//                     value={teamAdminInvite}
//                     underlineColorAndroid="transparent"
//                     autoCapitalize="none"
//                 />

//                 <View style={styles.footerView}>
//                     <TouchableOpacity style={styles.button} onPress={() => onSignUpPress()}>
//                     <Text style={styles.buttonTitle}>Sign up!</Text>
//                     </TouchableOpacity>
//                 </View>

//         </ScrollView>
//     )
// }