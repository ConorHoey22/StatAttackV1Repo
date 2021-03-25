//This is for if someone leaves a team or creates a new player account this will allow them to join a team

// Can they reobtain stats before they were register? so like say they play for Warrenpoint 20/21 
//and then they sign for newry 21/22 but didnt get join the team(Newry)
// until half way through the season but newry had already been tracking his stats with temporary player account 


import React, { useEffect, useState , Component  } from 'react'
import {FlatList, Keyboard,StyleSheet, Text, View , ScrollView, TouchableOpacity,TextInput ,Picker, Button , Alert} from 'react-native'

// import * as firebase from 'firebase/app';
import firebase from 'firebase/app'
import 'firebase/auth';
import 'firebase/database';
import { ThemeColors } from 'react-navigation';



import { useNavigation } from '@react-navigation/native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';


class JoinTeam extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            fullName:'',
            TeamName: '',
            SportType: '',
            inviteCode:'',
            hasATeam: false,
            userType: [],
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
    }

    componentDidMount(){

    
    }

    
    JoinTeam = () => { 
              
        const {  inviteCode , teamInviteCode} = this.state

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
                                                       // this.setState({
                                                       //      isLoading: true,
                                                       //   })
                                                   
                                   
                                                   });

                                                   childSnapshot1.ref.update({UserID: data.id , Verified: true, inviteCode:''});
                                           
                                                   alert('Account Created', this.props.navigation.navigate('Login'));

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
        

        render(){




            return (
                <ScrollView style={stylesJoinTeam.container}>
                   

                   <Text style={stylesJoinTeam.Text}>Join a Team</Text>
        


                </ScrollView>
            )

        }
}

const stylesJoinTeam = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#252626'
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
    }
});


export default JoinTeam;