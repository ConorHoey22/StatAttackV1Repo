import React, { useEffect, useState , Component  } from 'react'
import {FlatList, StyleSheet,Keyboard, Text, View , ScrollView, TouchableOpacity,TextInput ,Picker, Button , Alert} from 'react-native'

// import * as firebase from 'firebase/app';
import firebase from 'firebase/app'
import 'firebase/auth';
import 'firebase/database';
import { ThemeColors } from 'react-navigation';

import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import { useNavigation } from '@react-navigation/native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';


class TeamProfile extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            TeamName: '',
            SportType: '',
            inviteCode:'',
            hasATeam: false,
            userType: [],
            totalTeamGoals: 0,
            totalTeamPoints: 0,
            totalTeamPasses: 0,
            totalTeamShots:0,
            totalTeamShotsOnTarget:0,
            totalTeamRedCards:0,
            totalTeamYellowCards:0,
            listGames:[],
            PlayerList:[],
            GameViewList:[],
            templist:[], 
            tempArr:[],
            tempArr1:[],
            tempPlayer:[],

            OpponentsStatsRecordKey:'',
            gameRecordsArray:[],

            displayGamesBtn:false,
        };
    }

    componentDidMount(){
        this.getTeamDetails();
        this.getTeamStats();
        this.getTeamGames();
        

            //Display Batch of Games
            this.setState({displayGamesBtn: false});

         


    }

    getTeamDetails = async() => {

        var myUserId = firebase.auth().currentUser.uid;
        firebase.database().ref('/teams').child(myUserId)
        .on('value', snapshot => {
            const userObj = snapshot.val();

            let SportType = userObj.SportType;
            this.setState({SportType:SportType});

            let TeamName = userObj.TeamName;
            this.setState({TeamName:TeamName});

      
            
            
        });
    }


    getTeamStats = async() => {

        var myUserId = firebase.auth().currentUser.uid;
        firebase.database().ref('/teams').child(myUserId).child('Stats')
        .on('value', snapshot => {
            const userObj = snapshot.val();

         

            let totalTeamGoals = userObj.totalTeamGoals;
            this.setState({totalTeamGoals:totalTeamGoals});

            // let totalTeamPoints = userObj.totalTeamPoints;
            // this.setState({totalTeamPoints:totalTeamPoints});


            // let totalTeamPasses = userObj.totalTeamPasses;
            // this.setState({totalTeamPasses:totalTeamPasses});

            let totalTeamShots = userObj.totalTeamShots;
            this.setState({totalTeamShots:totalTeamShots});

            let totalTeamShotsOnTarget = userObj.totalTeamShotsOnTarget;
            this.setState({totalTeamShotsOnTarget:totalTeamShotsOnTarget});

            
            
        });
    }





    getTeamGames = async() => {
        
        var myUserId = firebase.auth().currentUser.uid;
        var tempArr = [];
        var displayGamesBtn = this.state.displayGamesBtn;

        
            var gameRecordsArray = this.state.gameRecordsArray;
            
            //GET Game records and put them all into an array 
            var query = firebase.database().ref('/teams').child(myUserId).child('games').orderByKey();
            query.once("value")
            .then(function(snapshot) {
                snapshot.forEach(function(childSnapshot) {
              
                var key = childSnapshot.key;
    
                 
                gameRecordsArray.push(key);

        
    

                })

            });


    }

    filterTeamGames = async() => {
        var myUserId = firebase.auth().currentUser.uid;
        var listGames = this.state.listGames;
        var tempArr = this.state.tempArr;
        var tempArr1 = this.state.tempArr1;
        var gameRecordsArray = this.state.gameRecordsArray;


      

        var listGames = this.state.listGames;

        //loop through each game record using the gameRecordsArray and iterate through the record is and use it in firebase child
        for(var i = 0; i < gameRecordsArray.length; i++)
        {


           // now that you have the record and 
    
            firebase.database().ref('/teams').child(myUserId).child('games').child(gameRecordsArray[i]).child('YourTeamStats')
           .on('value', snapshot => {
                console.log(snapshot.val());

                        tempArr = this.snapshotToArray(snapshot);
                        console.log(tempArr);

                        for(var i = 0; i < tempArr.length; i++)
                        {
                        

                                var data = {
                                    
                                    StatsRecordKey: tempArr[i].key,
                                    GameRecordKey: tempArr[i].GameRecordKey,
                                    UsersGAAGoals: tempArr[i].UsersGAAGoals,
                                    UsersGAAPoints: tempArr[i].UsersGAAPoints,
                                    OpponentsName: tempArr[i].OpponentsName,
                                    OpponentsGAAGoals:tempArr[i].OpponentsGAAGoals,
                                    OpponentsGAAPoints:tempArr[i].OpponentsGAAPoints
                                    
                                }

                                this.state.GameViewList.push(data);

     
                        }
                     
                        listGames.push(tempArr);


            })

        }

                   //Display Batch of Games
                   this.setState({displayGamesBtn: true});

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

    RemoveGame = (itemKey) => {

        var myUserId = firebase.auth().currentUser.uid;
        //Obtain the selected player (UserID) from the list of data 

        firebase.database().ref('/teams').child(myUserId).child('games')
        .once('value' , snapshot =>  {
            if (snapshot.exists())
            {


                    //Remove record from team games record
                    firebase.database().ref('/teams').child(myUserId).child('games').child(itemKey).remove();


                      //Reduce game counter by 1
                      firebase.database().ref('/teams').child(myUserId)
                      .child('games').child('gamecounter')
                      .set(firebase.database.ServerValue.increment(-1))


                    this.props.navigation.navigate('Home');

            }
            else{
                alert('This game does not exist');
            }
         
        });


     

    }



        

    render(){

            var ProfileData;
            var TeamStatsData;
            var ViewGames;
            var ViewGamesBtn;
            var SportType = this.state.SportType;

            var displayGamesBtn = this.state.displayGamesBtn;

            if(SportType == 'GAA')
            {
                ProfileData = ( 
                    <View style={styleProfile.headerContainer}>
                        <Text style={styleProfile.buttonTitle}>{this.state.TeamName}</Text>
                        <Text style={styleProfile.buttonTitle}>Sport: {this.state.SportType}</Text>
                    </View>
                );

                TeamStatsData = (
    


                    <View style={styleProfile.StatRow}>
                        <View style={styleProfile.StatColumn}>
             
                            <Text style={styleProfile.buttonTitle}>Goals: {this.state.totalTeamGoals}</Text>
                            <Text style={styleProfile.buttonTitle}>Points: {this.state.totalTeamPoints}</Text>
                            <Text style={styleProfile.buttonTitle}>Passes: {this.state.totalTeamPasses}</Text>
                            <Text style={styleProfile.buttonTitle}>Shots: {this.state.totalTeamShots}</Text>
                  
                        </View>

                        <View style={styleProfile.StatColumn}>
                            <Text style={styleProfile.buttonTitle}>Points: {this.state.totalTeamPoints}</Text>
                            <Text style={styleProfile.buttonTitle}>Red Cards: {this.state.totalTeamRedCards}</Text>
                            <Text style={styleProfile.buttonTitle}>Yellow Cards: {this.state.totalTeamYellowCards}</Text>
                        </View>
                    </View>
                );

                if(displayGamesBtn == true)
                {
                      // take away button and only display games

                      ViewGames = (
       
                            <FlatList
                                        data={this.state.GameViewList}
                                        renderItem={({ item }) => (
                                        
                                            <View style={styleProfile.container}>
                                                    <View style={styleProfile.headerContainer}>
                                                        <Text style={styleProfile.buttonTitle}>{this.state.TeamName} vs {item.OpponentsName} </Text>
                                                    </View>
                                                    
                                                    <View style={styleProfile.dataContainer}>

                                                        <View style={styleProfile.StatRow}>

                                                                    <Text style={styleProfile.buttonTitle}>{this.state.TeamName} </Text>
                                                                    <Text style={styleProfile.buttonTitle}>{item.UsersGAAGoals} : {item.UsersGAAPoints} </Text>

                                                        </View>

                                                        <View style={styleProfile.StatRow}>

                                                                    <Text style={styleProfile.buttonTitle}>{item.OpponentsName} </Text>
                                                                    <Text style={styleProfile.buttonTitle}>{item.OpponentsGAAGoals} : {item.OpponentsGAAPoints} </Text>

                                                        </View>     
                                                            
                                                            
                                                        <View style={styleProfile.StatRow}>
                                                        
                                                                <TouchableOpacity style={styleProfile.button} onPress={() => this.props.navigation.navigate('ViewGame', { GameRecordKey : item.GameRecordKey, StatsRecordKey: item.StatsRecordKey})}> 
                                                                    <Text style={styleProfile.buttonTitle}>Click here to view this games</Text>
                                                                </TouchableOpacity>
                                                        </View>
                                                        
                                                        <View style={styleProfile.StatRow}>
                                                                <TouchableOpacity style={styleProfile.button} onPress={() => this.RemoveGame(item.GameRecordKey)}>
                                                                    <Text style={styleProfile.buttonTitle}>DELETE THIS GAME</Text>
                                                                </TouchableOpacity>
                                                        </View>
                                                            
                                                    </View>
                                                </View>

                                         
                                        )}
                            
                                    />
                     
                
                           
                   );
                }
                else if(displayGamesBtn == false)
                {

                

                    // Display button
                    ViewGamesBtn = (
                        <View style={styleProfile.buttonPosition}>
                            <TouchableOpacity style={styleProfile.button} onPress={this.filterTeamGames}>
                                <Text style={styleProfile.buttonTitle}>View Games</Text>
                            </TouchableOpacity>
                        </View>
                  );
                }

             
                // );
            }
            else if(SportType == 'Soccer')
            {

           
                ProfileData = ( 
                    <View style={styleProfile.headerContainer}>
                        <Text style={styleProfile.buttonTitle}>{this.state.TeamName}</Text>
                        <Text style={styleProfile.buttonTitle}>Sport: {this.state.SportType}</Text>
                    </View>
                );

                TeamStatsData = (
    


                    <View style={styleProfile.StatRow}>
                        <View style={styleProfile.StatColumn}>
             
                            <Text style={styleProfile.buttonTitle}>Goals: {this.state.totalTeamGoals}</Text>
                            <Text style={styleProfile.buttonTitle}>Passes: {this.state.totalTeamPasses}</Text>
                            <Text style={styleProfile.buttonTitle}>Shots: {this.state.totalTeamShots}</Text>
                  
                        </View>

                        <View style={styleProfile.StatColumn}>
                   
                            <Text style={styleProfile.buttonTitle}>Red Cards: {this.state.totalTeamRedCards}</Text>
                            <Text style={styleProfile.buttonTitle}>Yellow Cards: {this.state.totalTeamYellowCards}</Text>
                        </View>
                    </View>
                );

                if(displayGamesBtn == true)
                {
                      // take away button and only display games

                      ViewGames = (
       
                            <FlatList
                                        data={this.state.GameViewList}
                                        renderItem={({ item }) => (
                                        
                                            <View style={styleProfile.container}>
                                                    <View style={styleProfile.headerContainer}>
                                                        <Text style={styleProfile.buttonTitle}>{this.state.TeamName} vs {item.OpponentsName} </Text>
                                                    </View>
                                                    
                                                    <View style={styleProfile.dataContainer}>

                                                        <View style={styleProfile.StatRow}>

                                                                    <Text style={styleProfile.buttonTitle}>{this.state.TeamName} </Text>
                                                                    <Text style={styleProfile.buttonTitle}>{item.UsersGAAGoals} : {item.UsersGAAPoints} </Text>

                                                        </View>

                                                        <View style={styleProfile.StatRow}>

                                                                    <Text style={styleProfile.buttonTitle}>{item.OpponentsName} </Text>
                                                                    <Text style={styleProfile.buttonTitle}>{item.OpponentsGAAGoals} : {item.OpponentsGAAPoints} </Text>

                                                        </View>     
                                                            
                                                            
                                                        <View style={styleProfile.StatRow}>
                                                        
                                                                <TouchableOpacity style={styleProfile.button} onPress={() => this.props.navigation.navigate('ViewGame', { GameRecordKey : item.GameRecordKey, StatsRecordKey: item.StatsRecordKey})}> 
                                                                    <Text style={styleProfile.buttonTitle}>Click here to view this games</Text>
                                                                </TouchableOpacity>
                                                        </View>
                                                        
                                                        <View style={styleProfile.StatRow}>
                                                                <TouchableOpacity style={styleProfile.button} onPress={() => this.RemoveGame(item.GameRecordKey)}>
                                                                    <Text style={styleProfile.buttonTitle}>DELETE THIS GAME</Text>
                                                                </TouchableOpacity>
                                                        </View>
                                                            
                                                    </View>
                                                </View>

                                         
                                        )}
                            
                                    />
                     
                
                           
                   );
                }
                else if(displayGamesBtn == false)
                {

                

                    // Display button
                    ViewGamesBtn = (
                        <View style={styleProfile.buttonPosition}>
                            <TouchableOpacity style={styleProfile.button} onPress={this.filterTeamGames}>
                                <Text style={styleProfile.buttonTitle}>View Games</Text>
                            </TouchableOpacity>
                        </View>
                  );
                }

             
                // );
               
            }



    
            

            return (
                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center'  ,  backgroundColor: '#252626', alignItems: "center", fontSize: 20,}}>
       
                    {ProfileData}
               
                    <View style={styleProfile.dataContainer}>
                         {TeamStatsData}
                    </View>

                    {ViewGamesBtn}

                    {ViewGames}
                   
                    
         
                </ScrollView>
            )

        }
}

const styleProfile = StyleSheet.create({
    container: {
        backgroundColor: '#242424', 
      
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

export default TeamProfile;