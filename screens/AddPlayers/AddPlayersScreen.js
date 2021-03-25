import React, { useEffect, useState, Component } from 'react'
import { Image, Text, TextInput, FlatList, TouchableOpacity, View ,Button ,ScrollView, Alert , StyleSheet} from 'react-native'

import firebase from 'firebase/app'
import 'firebase/auth';
import 'firebase/database';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { ImageEditor } from 'react-native';


 class AddPlayersScreen extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            fullName: '',
            inviteCode: '',
            playercounter: 0,
            teamplayerlimit:0,
            starting11Player:0,
            SubStatus:0,
            listPlayers:[],
            templist:[],
            tempid:'',
         };

    
      }

      componentDidMount(){
            this.checkLimit();
            this.playerList();

         
    
       }
       
       
        
  

       playerList = () => {

    
                var myUserId = firebase.auth().currentUser.uid;
                var tempArr = [];

                firebase.database().ref('/teams').child(myUserId).child('/players')
                    .on('value', snapshot => {
                      
                       tempArr = this.snapshotToArray(snapshot);
                        this.setState({
                            listPlayers: tempArr
                        });


                    })

       
        }
       

        snapshotToArray = snapshot => {
            var retArr = [];
            snapshot.forEach(childSnapshot => {
                var item = childSnapshot.val();
                item.key = childSnapshot.key;
                retArr.push(item);
            });
            return retArr;
        }
   
    
      


        checkLimit = () => {


                var myUserId = firebase.auth().currentUser.uid;


                    //get value and check the clients team player limit 
                    firebase.database().ref('/users').child(myUserId)
                    .on('value', (snapshot) => {
                    
                    const userObj = snapshot.val();
                    let teamplayerlimit= userObj.teamplayerlimit;
                    this.setState({teamplayerlimit:teamplayerlimit});

                    //get value and check clients player counter
                    firebase.database().ref('/teams').child(myUserId)
                    .on('value', (snapshot) => {

                    const teamObj = snapshot.val();
                    let playercounter= teamObj.playercounter;
                    this.setState({playercounter:playercounter});

                });
   
            });
               
        }

        addPlayer = async() => {
          
            const { fullName, inviteCode} = this.state

            if (fullName.length > 0) {
                

                if (inviteCode.length > 0) {
                
                    const playerData1 = {
                        inviteCode:this.state.inviteCode,
                    };
        
                    var myUserId = firebase.auth().currentUser.uid;
                    
            //Check if the team invite is completely unique in the users list
            const checkUniqueness = firebase.database().ref('/teams').child(myUserId).child('/players').orderByChild('inviteCode').equalTo(playerData1.inviteCode).once('value' , snapshot =>  {
                if (snapshot.exists()){
                  alert('This player invite code has already been used, try again');
                }
                else
                {

                    var isUnique = false;


                    
                    //Check if the UserID generated is unique 
                    while (isUnique == false)
                    {

                        //Generate a random UserID
                        var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
                        var uniqid = randLetter + Date.now();
                 

                            // RISK Acceptance//
                        // The odds of the team having the same userid within this very low as you can only have 30 players


                        const checkUniqueness = firebase.database().ref('/teams').child(myUserId).child('/players').orderByChild('UserID').equalTo(uniqid).once('value' , snapshot =>  {
                            if(snapshot.exists())
                            {
                             
                                isUnique = false;
                            }
                            else
                            {
                                const playerData = {
                                    fullName:this.state.fullName,
                                    inviteCode:this.state.inviteCode,
                                    UserID: uniqid,
                                    Verified: false,
                                    starting11Status: 0,
                                    SubStatus:0,
                                    AvailableStatus:1,
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
                                
                                const teamplayersref = firebase.database().ref('/teams').child(myUserId).child('/players')
                        
                                   firebase.database().ref('/teams').child(myUserId)
                                    .child('playercounter')
                                    .set(firebase.database.ServerValue.increment(1))
                    
                    
                                teamplayersref.push(playerData);
                          
                                
                        

                               












                                isUnique = true;


                     
                             
                            }
                        });

                        if(isUnique = true)
                        {
                            break;
                        }
                    }

                
                   
     
                  
            


            
                }
        


                });

            }
                else
                {
                    alert("Please enter their invite code.")
                }
    
                     
            }
            else
            {
                alert("Please enter their full name.")
            }
         
      
       







          



    }

    ViewPlayer = ( itemKey ) => {
        var myUserId = firebase.auth().currentUser.uid;
        
         firebase.database().ref('/teams').child(myUserId).child('/players').child(itemKey)
         .once('value' , snapshot =>  {
            const playerObj = snapshot.val();


            this.props.navigation.navigate('ViewPlayer', {
                playerKey: playerObj.UserID,
                itemKey: itemKey
            });


         });     



 

    }
    
    
    RemovePlayer = ( itemKey ) => {


        
        var myUserId = firebase.auth().currentUser.uid;
        //Obtain the selected player (UserID) from the list of data 

        firebase.database().ref('/teams').child(myUserId).child('/players')
        .once('value' , snapshot =>  {
            if (snapshot.exists())
            {


                    //Remove record from team players record
                    firebase.database().ref('/teams').child(myUserId).child('/players').child(itemKey).remove();


                    //Reduce player counter by 1
                    firebase.database().ref('/teams').child(myUserId)
                    .child('playercounter')
                    .set(firebase.database.ServerValue.increment(-1))

            }
            else{
                alert('Player does not exist')
            }
         
        });
      
   
    }

    render (){
        var AddPlayerView;
        var PlayerList;


      


        const checkplayercounter = this.state.playercounter;
        const checkteamplayerlimit = this.state.teamplayerlimit;

        if(checkplayercounter == checkteamplayerlimit)
        {
            AddPlayerView = (
                <View>
                    <Text style={styles.myText}>Your team player limit has been hit.  Please either delete a player from your team or contact us to upgrade you package </Text>
                </View>
            );
        }
        else{

            AddPlayerView = (
                <View>
                    <Text style={styles.myText}> Please enter your full name:</Text>
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

                
                    <Text style={styles.myText}>*Players will enter this code when registering to join a team</Text>
                    <TextInput
                        style={styles.input}
                        placeholderTextColor="#aaaaaa"
                        placeholder='Please enter your invite code'
                        // onChangeText={(text) => setInviteCode(text)}
                        onChangeText={(text) => this.setState({inviteCode:text})}
                        value={this.state.inviteCode}
                        underlineColorAndroid="transparent"
                        autoCapitalize="none"
                    />

                    <View style={styles.footerView}>
                        <TouchableOpacity style={styles.button} onPress={this.addPlayer}>
                        <Text style={styles.buttonTitle}>Click here to add the player</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            );





     

            PlayerList = (
                
              

                <View>
                <View style={styles.footerText}>
                    <Text style={styles.myText}>Your Team Members (* Scroll down to view more *)</Text>
                            <FlatList
                                data={this.state.listPlayers}
                                style={styles.footerText}
                                renderItem={({ item }) => (
                                    <View style={styles.textWrapper}>

                                        
                                        <View>
                                        <Text style={styles.footerText}>Player Name: {item.fullName}</Text>
                                        </View>


                                            <TouchableOpacity style={styles.button} onPress={() => this.ViewPlayer(item.key)}>
                                                <Text style={styles.buttonTitle}>View Player</Text>
                                            </TouchableOpacity>
                                        
                                            <TouchableOpacity style={styles.button} onPress={() => this.RemovePlayer(item.key)} >
                                                <Text style={styles.buttonTitle}>Remove Player</Text>
                                            </TouchableOpacity>
                                
                                        
                            
                                    </View>
                                )}
                            
                                />
                    
                            </View>

          
          
                </View> 
                    









            );

        


        }
        

        //Currenlty here , exception due to using scrollview over a flatlists , logbox creates more exception- reseach more on utube

        return(
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center'  ,    backgroundColor: '#252626',  fontSize: 20,}}>
             {AddPlayerView}

             {PlayerList}
            </ScrollView>
         
        )
    }

}


const styles = StyleSheet.create({

    Text: {
        paddingLeft: 40
    },

    container: { 
        flex: 1 ,
        backgroundColor: '#242424', 
    },

    textWrapper: {
      height: hp('100%'), // 70% of height device screen
      width: wp('80%') ,  // 80% of width device screen
      flexDirection:"row",
      justifyContent:'space-between',
      alignItems: 'center',
      height: 50,
      borderRadius: 5,
 
      backgroundColor: 'white',
      marginTop: 30,
      marginBottom: 10,
      marginLeft: 60,
      marginRight: 10,
    
      paddingLeft: 6,

    },
    myText: {
      fontSize: hp('5%'),// End result looks like the provided UI mockup
      color: 'black',
      fontSize: hp('2%'),
  
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
        backgroundColor: '#FF6D01',
        padding: 15,
        
        borderRadius: 5,
        alignItems: "center",
        justifyContent:'space-between'
    },
  
    buttonTitle: {
        color: 'white',
        fontSize: hp('2%'),
   
    },

    myText:{
        color: 'white',
        fontSize: hp('2%'),
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 30,
        marginRight: 30,
        paddingLeft: 16
    },

    
    footerView: {
        flex: 1,
        alignItems: "center",
        marginTop: 20
        
    },
    footerText: {
        color: 'black',
        fontSize: hp('2%'),
        
    },
    footerLink: {
        color: "#788eec",
   
        fontSize: hp('2%') 
    },
  });



export default AddPlayersScreen;

