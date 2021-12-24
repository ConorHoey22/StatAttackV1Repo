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
            SportType:''
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

                    let SportType= teamObj.SportType;
                    this.setState({SportType:SportType});

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
                    <Text style={styles.myText}>Your Team player limit has been hit.  Please either delete a player from your team or contact us to upgrade you package </Text>
                </View>
            );
        }
        else{

            AddPlayerView = (
                <View>

                    <ScrollView>
                    <View style={styles.textcolumn}>
                            <Text style={styles.BlackTextBold}> Create a Player record: </Text>
                        <View style={styles.columnView}>
                                <Text style={styles.BlackText}> Please enter their full name:</Text>
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

                            </View>

                            <View style={styles.columnView}>
                                <Text style={styles.BlackText}>*Players will enter this code when registering to join a team</Text>
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
                            </View>

                            <View style={styles.footerView}>
                                <TouchableOpacity style={styles.exitRedButton} onPress={this.addPlayer}>
                                    <Text style={styles.myText}>Click here to add the player</Text>
                                </TouchableOpacity>
                            </View>
                            
                        </View>
                        
                        </ScrollView>

         

                </View>
            );





     

            PlayerList = (
                
              

    


                    <View>
                    
                  
                        <Text style={styles.WhiteTextBold}>Your Team Members</Text>
                   
                        <FlatList
                            data={this.state.listPlayers}
                        
                            renderItem={({ item }) => (
                                <View style={styles.textWrapper}>
                                    
                                            <Text style = {styles.PlayerName}>Player Name: {item.fullName}</Text>

                                                    <View style={styles.columnView}>
                                                        <TouchableOpacity style={styles.exitRedButton} onPress={() => this.ViewPlayer(item.key)}>
                                                            <Text style={styles.myText}>View Player</Text>
                                                        </TouchableOpacity>
                                                    </View> 


                                                    <View style={styles.columnView}>    
                                                        <TouchableOpacity style={styles.RedButton} onPress={() => this.RemovePlayer(item.key)}>                           
                                                            {/* <Text style={styles.myText}>Remove Player</Text>  */}
                                                            <Image style={styles.ExitButton} source={require('./exit.png')}/>
                                                        </TouchableOpacity>
                                                    </View> 

                                        

                                </View>
                                
                        
                                
                            )}
                            
                            />

                    </View>

            // </View>
                    
                     
            
           
          
       



                   





            );

        


        }
        


        return(
         
            <ScrollView contentContainerStyle={{  flex: 1 ,backgroundColor: '#242424', alignItems: "center"}}>


                    {AddPlayerView} 
         
   
            </ScrollView>
         
        )
    }

}


const styles = StyleSheet.create({

    Text: {
        paddingLeft: 40,
        color: 'white',
        fontWeight: "bold",
    },

    
    ExitButton:{
        width:50,
        height: 48,
    },


    container: {
        backgroundColor: '#242424',
        alignItems: 'center',
   
    },

  
    StatRow: {
        flex:1,
       flexDirection:"column",
       
        marginBottom:10,
        backgroundColor: "#33343F",
        

    },

    StatColumn: {
        flex:1,
        flexDirection:"column",
     
        backgroundColor: "#33343F",
 
    },
    columnView: {
        
          paddingTop:10,
          paddingBottom:10,
          paddingLeft: 10,
          paddingRight: 10,
          alignItems: 'center',

    },

    PlayerName:{

        paddingBottom: 30,
        paddingRight: 50,
        color: 'black',
        alignItems: 'center',
        fontWeight: "bold",
        justifyContent:'center',
    },

    textWrapper: {

      flexDirection:"row",
      justifyContent:'center',

      backgroundColor: 'white',
      alignItems: 'center',
      borderColor:'#C30000',
      width: '100%',
      borderWidth: 4,
      marginTop: 10,
      marginBottom: 10,
    
      
      paddingTop:10,
     paddingLeft: 10,
      borderRadius: 10,

    },

    textcolumn: {

        flexDirection:"column",
        justifyContent:'center',
        width: '100%',
        backgroundColor: 'white',
        alignItems: 'center',
        borderColor:'#C30000',
        borderWidth: 4,
        padding: 50,
        marginTop: 100,
  
      },
    myText: {

      color: 'white',
      alignItems: 'center',

      paddingTop: 5
  
    },

    dcontainer: {
        backgroundColor: 'white',
        height:'100%',
        alignItems: "center",
        fontSize: 20,
       
    },


    input: {
        height: 60,
        width:200,
        borderWidth: 2,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'white',
        borderColor:'#C30000',
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 30,
        marginRight: 30,
        paddingLeft: 16
    },
    exitRedButton: {
        backgroundColor: '#C30000',
        paddingBottom: 30,
        paddingLeft: 16,
        paddingRight: 16,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: 'space-around'
    },

  
    exitRedButtonTitle: {
        color: 'white',
        fontSize: hp('2%'),
   
    },

    BlackText:{
        color: 'black',
    },
 
  
    BlackTextBold:{
        color: 'black',
        fontWeight: "bold",

    },

    
    WhiteTextBold:{
        color: 'white',
        fontWeight: "bold",

    },
    
    footerView: {
        marginTop: 30,
        marginBottom: 30,
        alignItems: "center",
  
        
    },
    footerText: {
        color: 'black',
        fontSize: hp('2%'),
        
    },
    footerLink: {
        color: "#788eec",
        fontSize: hp('2%') 
    },
    headerContainer:{ 

        backgroundColor: 'white',
        alignItems: "center",
        borderWidth: 4,
        borderRadius: 20,
        borderColor:'#C30000',
        fontWeight: "bold",

    },

  });



export default AddPlayersScreen;

