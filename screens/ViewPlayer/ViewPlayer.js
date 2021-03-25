import React, { useEffect, useState, Component } from 'react'
import { Image, Text, TextInput, FlatList, TouchableOpacity, View ,Button ,ScrollView, Alert , StyleSheet} from 'react-native'


import firebase from 'firebase/app'
import 'firebase/auth';
import 'firebase/database';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';



//This is only to view players from "YOUR TEAM"

 class ViewPlayer extends Component {
    constructor(props) {
        super(props);

        this.state = { 
            UserID:'',
            fullName:'',
            TeamName: '',
            SportType: '',
            inviteCode:'',
            hasATeam: false,
            userType: [],
            PlayerList:[],
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


     this.getPlayerDetails();

        var myUserId = firebase.auth().currentUser.uid;

        //get SportType of your Team
        firebase.database().ref('/teams').child(myUserId).once('value' , snapshot =>  {
            const playerObj = snapshot.val();

            console.log(playerObj);

            let SportType = playerObj.SportType;
            this.setState({SportType:SportType});

        });


       

    }


    getPlayerDetails = async() => {

         // Pass the sport type from the {manageTeam} use it to determine the screas

            //Obtain SelectedStarting11 Array of players
            const { state, setParams, navigate } = this.props.navigation;
            const params = state.params || {};



            var myUserId = firebase.auth().currentUser.uid;

            var playerKey = params.playerKey;


        // WE need to test the below also a condition so that playerKey has a temporary UserID - jsut display (/teams/players record)

            //   Use record ref to get Player details

                    firebase.database().ref('/users').child(params.playerKey)
                    .once('value' , snapshot =>  {

                        if(snapshot.exists())
                        {

                            const playerObj = snapshot.val();

                            console.log(playerObj);

                            let fullName = playerObj.fullName;
                            this.setState({fullName:fullName});

                            let totalAssists = playerObj.totalAssists;
                            this.setState({totalAssists:totalAssists});

                            let totalGoals = playerObj.totalGoals;
                            this.setState({totalGoals: playerObj.totalGoals});
                    
                            let totalLostTheBall = playerObj.totalLostTheBall;
                            this.setState({totalLostTheBall: totalLostTheBall});
                        
                            let totalPasses =  playerObj.totalPasses; 
                            this.setState({totalPasses: totalPasses});
                    
                            let totalPoints = playerObj.totalPoints;
                            this.setState({totalPoints: totalPoints});

                            let totalRedCards = playerObj.totalRedCards;
                            this.setState({totalRedCards: totalRedCards});
                        
                            let totalShots =  playerObj.totalShots;
                            this.setState({totalShots: totalShots})
                        
                            let totalShotsOnTarget = playerObj.totalShotsOnTarget;
                            this.setState({totalShotsOnTarget: totalShotsOnTarget});
                        
                            let totalTackles = playerObj.totalTackles;
                            this.setState({totalTackles: totalTackles});
                            
                            let totalWonTheBall = playerObj.totalWonTheBall;
                            this.setState({totalWonTheBall:totalWonTheBall});

                            let totalYellowCards = playerObj.totalYellowCards;
                            this.setState({totalYellowCards:totalYellowCards});
                            
                            let userType = playerObj.userType;
                            this.setState({userType:userType});

                            let SportType = playerObj.sportType;
                            this.setState({SportType:SportType});

                        }
                        else
                        {
                            console.log('Doesnt exist');

                            //Players
                            firebase.database().ref('/teams').child(myUserId).child('/players').child(params.itemKey)
                            .once('value' , snapshot =>  {

                                const playerObj = snapshot.val();

                                console.log(snapshot.val());
    
        
                                let fullName = playerObj.fullName;
                                this.setState({fullName:fullName});


                                console.log(fullName);

                                console.log(this.state.fullName);
        
                                let totalAssists = playerObj.totalAssists;
                                this.setState({totalAssists:totalAssists});
        
                                let totalGoals = playerObj.totalGoals;
                                this.setState({totalGoals: playerObj.totalGoals});
                           
                                let totalLostTheBall = playerObj.totalLostTheBall;
                                this.setState({totalLostTheBall: totalLostTheBall});
                              
                                let totalPasses =  playerObj.totalPasses; 
                                this.setState({totalPasses: totalPasses});
                           
                                let totalPoints = playerObj.totalPoints;
                                this.setState({totalPoints: totalPoints});
        
                                let totalRedCards = playerObj.totalRedCards;
                                this.setState({totalRedCards: totalRedCards});
                               
                                let totalShots =  playerObj.totalShots;
                                this.setState({totalShots: totalShots})
                             
                                let totalShotsOnTarget = playerObj.totalShotsOnTarget;
                                this.setState({totalShotsOnTarget: totalShotsOnTarget});
                            
                                let totalTackles = playerObj.totalTackles;
                                this.setState({totalTackles: totalTackles});
                                
                                let totalWonTheBall = playerObj.totalWonTheBall;
                                this.setState({totalWonTheBall:totalWonTheBall});
        
                                let totalYellowCards = playerObj.totalYellowCards;
                                this.setState({totalYellowCards:totalYellowCards});
                                
                  
                            });

                        }
                      
                        
            });
    }


   render (){
    


    // check sportType 
    var SportType = this.state.SportType;
    var ProfileHeader;
    var Stats;

    if(SportType == 'GAA')
    {
            ProfileHeader = (
                <View style={styles.headerContainer}>
                  <Text style = {styles.Text}>{this.state.fullName}</Text>
                </View>
              
           
            
            );

            Stats = (
                <View style={styles.StatRow}>
                    <View style={styles.StatColumn}>
                        <Text style = {styles.Text}>Goals: {this.state.totalGoals}</Text>
                        <Text style = {styles.Text}>Points: {this.state.totalPoints}</Text>
                        <Text style = {styles.Text}>Passes: {this.state.totalPasses} </Text>
                        <Text style = {styles.Text}>Shots: {this.state.totalShots}</Text>
                        <Text style = {styles.Text}>Shots on target: {this.state.totalShotsOnTarget}</Text>
                        <Text style = {styles.Text}>Tackles:{this.state.totalTackles}</Text>
                        <Text style = {styles.Text}>Won the ball: {this.state.totalWonTheBall} </Text>
                        <Text style = {styles.Text}>Lost the ball: {this.state.totalLostTheBall} </Text>
                        <Text style = {styles.Text}>Yellow Card: {this.state.totalYellowCards} </Text>
                        <Text style = {styles.Text}>Red Card: {this.state.totalRedCards} </Text>
                        <Text style = {styles.Text}>Assists: {this.state.totalAssists} </Text>
                    </View>
                 </View>
            );
    }
    else if(SportType == 'Soccer'){
        ProfileHeader = (
                <View style = {styles.container}>
                  <Text style = {styles.Text}>Goals: {this.state.totalGoals}</Text>
                  <Text style = {styles.Text}>Passes: {this.state.totalPasses} </Text>
                  <Text style = {styles.Text}>Shots: {this.state.totalShots}</Text>
                  <Text style = {styles.Text}>Shots on target: {this.state.totalShotsOnTarget}</Text>
                  <Text style = {styles.Text}>Tackles:{this.state.totalTackles}</Text>
                  <Text style = {styles.Text}>Won the ball: {this.state.totalWonTheBall} </Text>
                  <Text style = {styles.Text}>Lost the ball: {this.state.totalLostTheBall} </Text>
                  <Text style = {styles.Text}>Yellow Card: {this.state.totalYellowCards} </Text>
                  <Text style = {styles.Text}>Red Card: {this.state.totalRedCards} </Text>
                  <Text style = {styles.Text}>Assists: {this.state.totalAssists} </Text>
                </View>
            );


            Stats = (
                <View style={styles.StatRow}>
                    <View style={styles.StatColumn}>
                        <Text style = {styles.Text}>Goals: {this.state.totalGoals}</Text>
                        <Text style = {styles.Text}>Passes: {this.state.totalPasses} </Text>
                        <Text style = {styles.Text}>Shots: {this.state.totalShots}</Text>
                        <Text style = {styles.Text}>Shots on target: {this.state.totalShotsOnTarget}</Text>
                        <Text style = {styles.Text}>Tackles:{this.state.totalTackles}</Text>
                        <Text style = {styles.Text}>Won the ball: {this.state.totalWonTheBall} </Text>
                        <Text style = {styles.Text}>Lost the ball: {this.state.totalLostTheBall} </Text>
                        <Text style = {styles.Text}>Yellow Card: {this.state.totalYellowCards} </Text>
                        <Text style = {styles.Text}>Red Card: {this.state.totalRedCards} </Text>
                        <Text style = {styles.Text}>Assists: {this.state.totalAssists} </Text>
                    </View>
                 </View>
            );
    }

    return(
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center'  ,  backgroundColor: '#242424', alignItems: "center", fontSize: 20,}}>
        
            {/* <Text>test</Text>
          <Text style = {styles.Text}>{this.state.fullName}</Text> */}
        {ProfileHeader}
        <View style={styles.dataContainer}>
        {Stats}
        </View>
        </ScrollView>
        )
   

    }

 }

 const styles = StyleSheet.create({
    // container: {
    //     backgroundColor: '#242424', 
    // },
    Text: {
        color:'#ffffff',
        fontSize: 20,
        fontWeight: "bold",
        
    },

    container: {
        backgroundColor: '#000000', 
      
        alignItems: "center",
        fontSize: 20,
       
    },
    
    dcontainer: {
        backgroundColor: '#242424', 
        height:'100%',
        alignItems: "center",
        fontSize: 20,
       
    },
    
    headerContainer:{ 

        backgroundColor: '#FF6D01',
        alignItems: "center",
        borderWidth: 4,
        borderColor:'#ffffff',
         alignItems: 'center',
        width: wp('50%') ,  // % of width device screen
        marginTop:30,
        padding:4,
  
    },



    dataContainer: {
        // height: hp('50%'), // 70% of height device screen
        width: wp('50%') ,  // % of width device screen
        backgroundColor: '#424242', 
        alignItems: "center",
        borderWidth: 4,
        borderColor:'#ffffff',
 
        marginBottom:10
    },

    StatRow: {
        flex:1,
        flexDirection:"row",
        alignItems: "center",
        marginBottom:10
    },

    StatColumn: {
        flex:1,
        flexDirection:"column",
        padding: 50,
        marginBottom:10
    },

    buttonPosition:{
        alignItems: "center",
    },

    button: {
        width: '80%',
        paddingTop:8,
        paddingBottom:8,
        borderRadius:7,
        marginTop: 20,
        fontSize: 20,
        backgroundColor: '#FF6D01',
        alignItems: "center",
    },
    buttonTitle: {
        color:'#ffffff',
        fontSize: 16,
        fontWeight: "bold"
    },

 });

 export default ViewPlayer;