import React, { useEffect, useState , Component  } from 'react'
import {ImageBackground, Dimensions,StatusBar,FlatList, Keyboard,  StyleSheet, Image, Text, View , ScrollView, TouchableOpacity,TextInput , Button , Alert} from 'react-native'

import { DarkTheme, useNavigation } from '@react-navigation/native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';





import firebase from 'firebase/app'
import 'firebase/auth';
import 'firebase/database';
import { createKeyboardAwareNavigator, ThemeColors } from 'react-navigation';

import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {Picker} from '@react-native-picker/picker';

// import {Picker} from '@react-native-community/picker';
import { TapGestureHandler } from 'react-native-gesture-handler';

const screenWidth = Dimensions.get('window').width;

const screenHeight = Dimensions.get('window').height;


const win = Dimensions.get('window');


const ratioGaaView = win.width/590;


const ratioSoccerView = win.width/700;

class ViewGame extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            TeamName: '',
            OpponentsName:'',
            SportType: '',
            inviteCode:'',
            hasATeam: false,
            userType: [],
            GameList:[],
            GameViewList:[],
            EventType:'',

            UsersScreenHeight:0,
            UsersScreenWidth:0,
            statRecord:'',
            gameStatsRecordsArray:[],

            selectedTeamPlayer:'',
            selectedOpponentsPlayer:'',

            PlayerData:[],
            OpponentsPlayerData:[],
            YourTeamPlayerData:[],
            tempArr:[],
            tempArrOpponents:[],
            tempArrYourTeam:[],

            playerArr:[],
            OpponentsplayerArr:[],

       
       

            totalTeamGoals: 0,
            totalTeamPoints:0,
            totalTeamPasses: 0,
            totalTeamShots:0,
            totalTeamShotsOnTarget:0,
            totalTeamRedCards:0,
            totalTeamYellowCards:0,

            totalOpponentsTeamGoals:0,
            totalOpponentsTeamPoints:0,
            totalOpponentsTeamShots: 0,
            totalOpponentsTeamShotsOnTarget:0,
            totalOpponentsTeamPasses: 0,
            totalOpponentsTeamRedCards:0,
            totalOpponentsTeamYellowCards:0,


            GameRecordKey:'',
            StatsRecordKey: '',

            //Detailed Analysis - Player Specific
            tempEventFieldLocations:[],
            YourTeamFieldEventsView: false,
            OpponentsFieldEventsView:false,


            YourTeamEventSelection: '',
            OpponentsEventSelection:'',

            EventFieldLocations:[],
            OpponentsEventFieldLocations:[],

            //Detailed Analysis - Tean event Specific
            displayTeamSpecificEventSelection:false,
            displayOpponentsSpecificEventSelection:false,

        
            //Field Location views - Overall Team/Opponent Team Events
            YourTeamSpecificStatFieldEvents: false,
            OpponentsSpecificStatFieldEventsSoccerView:false,

            //frontend end toggles
            displayReviewSelection:true,
            displayReviewGameStats:false,
            displayReviewYourTeamPlayer:false,
            displayReviewOpponentsPlayer:false,
            displaySelectedPlayerStats:false,
            displayOpponentsSelectedPlayerStats:false,

            //Event Selection - Overall Team/Opponent Team Events
            SelectAnEvent_ReviewGameStats_YourTeam:false,
            SelectAnEvent_ReviewGameStats_Opponents:false,

            //Event Selection - Player Specific Event Selection  
            SelectAnEvent_ReviewGameStats_YourTeamPlayer:false,
            SelectAnEvent_ReviewGameStats_Opponents_TeamPlayer:false,

            //Field Location views - Overall Team/Opponent Team Events (GAA + Soccer)
            YourTeamSpecificStatFieldEvents:false,
            OpponentsSpecificStatFieldEvents:false,

            //Individual Player Stats
            PlayerKitNumber: 0,
            PlayerName:'',
            PlayerPosition:'',
            Goals:0,
            Points:0,
            Passes:0,
            Shots:0,
            ShotsOnTarget:0,
            RedCards:0,
            YellowCards:0,
           
        };

     
    }

    componentDidMount(){

        //Obtain SelectedStarting11 Array of players
        const { state, setParams, navigate } = this.props.navigation;
        const params = state.params || {};

        // Firebase Key for the Game record
        this.setState({GameRecordKey: params.GameRecordKey});

        //Firebase Key for the Game Stats Record
        this.setState({StatsRecordKey: params.StatsRecordKey});


        var myUserId = firebase.auth().currentUser.uid;
        var GameRecordKey = this.state.GameRecordKey;
        var gameStatsRecordsArray = this.state.gameStatsRecordsArray;


        // GET Team SportType
        firebase.database().ref('/teams').child(myUserId)
        .on('value', snapshot => {
            const userObj = snapshot.val();

            let SportType = userObj.SportType;
            this.setState({SportType:SportType});

            let TeamName = userObj.TeamName;
            this.setState({TeamName:TeamName});

        });

            this.setState({SelectAnEvent_ReviewGameStats_Opponents_TeamPlayer:false});
     
            this.filterGameData();

    }

            
 
  filterGameData = async() => {

    var totalTeamGoals = this.state.totalTeamGoals;

    var myUserId = firebase.auth().currentUser.uid;

        //Obtain SelectedStarting11 Array of players
        const { state, setParams, navigate } = this.props.navigation;
        const params = state.params || {};
        

        var tempArr = [];
        var tempArrOpponents = [];

   try{

   
        

    //GET Game records and put them all into an array 
    firebase.database().ref('/teams').child(myUserId).child('games').child(params.GameRecordKey).child('YourTeamStats').child(params.StatsRecordKey)
    .on('value', snapshot => {
   

        if(snapshot.exists())
        {

            const gameObj = snapshot.val();


            let screenWidth = gameObj.screenWidth;
            this.setState({StatsStoredUsingScreenWidth: screenWidth});

            let screenHeight = gameObj.screenHeight;
            this.setState({StatsStoredUsingScreenHeight: screenHeight});


            let totalTeamGoals = gameObj.totalTeamGoals;
            this.setState({totalTeamGoals: totalTeamGoals});

            let totalTeamPoints = gameObj.totalTeamPoints;
            this.setState({totalTeamPoints: totalTeamPoints});

            // let totalTeamPasses = gameObj.totalTeamPasses;
            // this.setState({totalTeamPasses:totalTeamPasses});

            let totalTeamShots = gameObj.totalTeamShots;
            this.setState({totalTeamShots:totalTeamShots});

            let totalTeamShotsOnTarget = gameObj.totalTeamShotsOnTarget;
            this.setState({totalTeamShotsOnTarget:totalTeamShotsOnTarget});

            let OpponentsName = gameObj.OpponentsName;
            this.setState({OpponentsName: OpponentsName});

            let totalOpponentsTeamGoals = gameObj.totalOpponentsTeamGoals;
            this.setState({totalOpponentsTeamGoals: totalOpponentsTeamGoals});

            // let totalOpponentsTeamPasses = gameObj.totalOpponentsTeamPasses;
            // this.setState({totalOpponentsTeamPasses:totalOpponentsTeamPasses});

            let totalOpponentsTeamShots = gameObj.totalOpponentsTeamShots;
            this.setState({totalOpponentsTeamShots:totalOpponentsTeamShots});

            let totalOpponentsTeamShotsOnTarget = gameObj.totalOpponentsTeamShotsOnTarget;
            this.setState({totalOpponentsTeamShotsOnTarget:totalOpponentsTeamShotsOnTarget});


            }
            else 
            {

            }
        });

        


          //Get data from DB - Your Team Event Locations 
          firebase.database().ref('/teams').child(myUserId).child('/games').child(params.GameRecordKey).child('EventFieldPositions')
          .on('value', snapshot => {
    
             tempArr = this.snapshotToArray(snapshot);

              this.setState({
                  EventFieldLocations: tempArr
              });
  
       
          });


        

        //Get data from DB  - Opponents Event Locations 
        firebase.database().ref('/teams').child(myUserId).child('/games').child(params.GameRecordKey).child('OpponentsEventFieldPositions')
        .on('value', snapshot => {

            tempArrOpponents = this.snapshotToArray(snapshot);

            this.setState({
                OpponentsEventFieldLocations:  tempArrOpponents
            });
        });



        var myUserId = firebase.auth().currentUser.uid;
        var playerArr = [];

        firebase.database().ref('/teams').child(myUserId).child('/games').child(params.GameRecordKey).child('YourTeam').child('players')
            .on('value', snapshot => {

            
              
                playerArr = this.snapshotToArray(snapshot);

                this.setState({
                    PlayerData: playerArr
                });

        });


        var OpponentsplayerArr = [];
        firebase.database().ref('/teams').child(myUserId).child('/games').child(params.GameRecordKey).child('Opponents').child('players')
        .on('value', snapshot => {

       
          
            OpponentsplayerArr = this.snapshotToArray(snapshot);

            this.setState({
                OpponentsPlayerData: OpponentsplayerArr
            });

        });

   
        }
        catch(err){
            
        }
      }





    //Your Team - Player Lists
    GetSelectedYourTeamPlayerStats = value => () => {

        //Obtain Array of players
        const { state, setParams, navigate } = this.props.navigation;
        const params = state.params || {};

        var myUserId = firebase.auth().currentUser.uid;
        var tempArrYourTeam = [];

        firebase.database().ref('/teams').child(myUserId).child('/games').child(params.key).child('YourTeam').child('players')
            .on('value', snapshot => {
              
                tempArrYourTeam = this.snapshotToArray(snapshot);
                this.setState({
                    YourTeamPlayerData: tempArrYourTeam
                });

        });

   


    }


    GoToMainMenu = async() => {
        this.props.navigation.navigate('Home');
    }

 

    GoToViewGameMenu = async() => {
        
        //Make View game menu appear
        this.setState({displayReviewSelection:true});

        //Make field disappear 
        this.setState({YourTeamSpecificStatFieldEvents: false});
        this.setState({OpponentsSpecificStatFieldEvents: false});

        this.setState({displayReviewGameStats:false});
        this.setState({displaySelectedPlayerStats:false});
        this.setState({displayOpponentsSelectedPlayerStats:false});

        this.setState({SelectAnEvent_ReviewGameStats_YourTeam:false});
        this.setState({SelectAnEvent_ReviewGameStats_Opponents:false});
        this.setState({SelectAnEvent_ReviewGameStats_YourTeamPlayer:false});
        this.setState({SelectAnEvent_ReviewGameStats_Opponents_TeamPlayer:false});



    };



       
     


    //Opponents - Player Lists
    GetSelectedOpponentsPlayerStats = value => () => {

        //Obtain Array of players
        const { state, setParams, navigate } = this.props.navigation;
        const params = state.params || {};

        var myUserId = firebase.auth().currentUser.uid;
        var tempArrOpponents = [];

        firebase.database().ref('/teams').child(myUserId).child('/games').child(params.key).child('Opponents').child('players')
            .on('value', snapshot => {
              
                tempArrOpponents = this.snapshotToArray(snapshot);
                this.setState({
                    OpponentsPlayerData: tempArrOpponents
                });

        });




    }

    //GET a specifc YOUR TEAM player
    ReviewPlayerStats = ( itemKey ) => {
        
        var selectedTeamPlayer = this.state.selectedTeamPlayer;
        var YourTeamEventSelection = this.state.YourTeamEventSelection;

        var myUserId = firebase.auth().currentUser.uid;


       const { state, setParams, navigate } = this.props.navigation;
       const params = state.params || {};
       var tempArr = this.state.tempArr;

        if(selectedTeamPlayer == '' )
        {
            return alert("Please select a player");
        }
        else
        {
            this.setState({displayReviewGameStats: false});
            this.setState({displaySelectedPlayerStats:true});
            this.setState({SelectAnEvent_ReviewGameStats_YourTeamPlayer:false});
            

 
            firebase.database().ref('/teams').child(myUserId).child('/games').child(params.GameRecordKey).child('YourTeam').child('players').orderByChild("PlayerID").equalTo(selectedTeamPlayer)
            .on('value', snapshot => {

                const playerObj = snapshot.val();


     
                tempArr = this.snapshotToArray(snapshot);
         

                for(var i = 0; i < tempArr.length; i++)
                {

                    let Goals = tempArr[i].Goals;
                    this.setState({Goals:Goals});

                    let Points = tempArr[i].Points;
                    this.setState({Points:Points});
                    
                    let Passes = tempArr[i].Passes;
                    this.setState({Passes:Passes});

                    let PlayerKitNumber = tempArr[i].PlayerKitNumber;
                    this.setState({PlayerKitNumber:PlayerKitNumber});

                    let PlayerName = tempArr[i].PlayerName;
                    this.setState({PlayerName:PlayerName});

                    let PlayerPosition = tempArr[i].PlayerPosition;
                    this.setState({PlayerPosition:PlayerPosition});

                    let Shots = tempArr[i].Shots;
                    this.setState({Shots:Shots});

                    let ShotsOnTarget = tempArr[i].ShotsOnTarget;
                    this.setState({ShotsOnTarget: ShotsOnTarget});

                }

              
            
            
        
           
            });



        }



   

    }


    //GET a specific OPPONENTS player
    ReviewOpponentsPlayerStats = ( itemKey ) => {

    
        var myUserId = firebase.auth().currentUser.uid;

        const { state, setParams, navigate } = this.props.navigation;
        const params = state.params || {};
        var tempArr = this.state.tempArr;
             

        var selectedOpponentsPlayer = this.state.selectedOpponentsPlayer;

        if(selectedOpponentsPlayer == '' )
        {
            return alert("Please select a player");
        }
        else
        {
            
            this.setState({displayReviewGameStats: false});
            this.setState({displayOpponentsSelectedPlayerStats:true});
            this.setState({SelectAnEvent_ReviewGameStats_Opponents_TeamPlayer:false});
         
              firebase.database().ref('/teams').child(myUserId).child('/games').child(params.GameRecordKey).child('Opponents').child('players').orderByChild("PlayerID").equalTo(selectedOpponentsPlayer)
              .on('value', snapshot => {
  
                  const playerObj = snapshot.val();
  
                  tempArr = this.snapshotToArray(snapshot);
           
  
                  for(var i = 0; i < tempArr.length; i++)
                  {
                      
                      let Goals = tempArr[i].Goals;
                      this.setState({Goals:Goals});
  
                      let Points = tempArr[i].Points;
                      this.setState({Points:Points});
                      
                      let Passes = tempArr[i].Passes;
                      this.setState({Passes:Passes});
  
                      let PlayerKitNumber = tempArr[i].PlayerKitNumber;
                      this.setState({PlayerKitNumber:PlayerKitNumber});
  
                      let PlayerName = tempArr[i].PlayerName;
                      this.setState({PlayerName:PlayerName});
  
                      let PlayerPosition = tempArr[i].PlayerPosition;
                      this.setState({PlayerPosition:PlayerPosition});
  
                      let Shots = tempArr[i].Shots;
                      this.setState({Shots:Shots});
  
                      let ShotsOnTarget = tempArr[i].ShotsOnTarget;
                      this.setState({ShotsOnTarget: ShotsOnTarget});
  
                  }
              
                      
              });
  
  
  
          }
  
  






        }


    GetSpecificPlayerEventLocations = async() => {
        
        //Array to store event Locations
        var EventFieldLocations = this.state.EventFieldLocations;   

        var YourTeamEventSelection = this.state.YourTeamEventSelection;

        var selectedTeamPlayer = this.state.selectedTeamPlayer;

    
        var myUserId = firebase.auth().currentUser.uid;
        var tempEventFieldLocations = this.state.tempEventFieldLocations;

      
        if(selectedTeamPlayer != '')
        {

            if(YourTeamEventSelection == '')
            {
                return alert("Please select an event");
            }
            else
            {
                //get Event locations using SelectedTeamPlayer + YourTeamEventSelection
                const { state, setParams, navigate } = this.props.navigation;
                const params = state.params || {};
               
                //empty tempEventFieldLocations as this is only a temp array
                tempEventFieldLocations.splice(0,tempEventFieldLocations.length);
        
                //filter array to get the specific player and event locations
                for (var i = 0; i < EventFieldLocations.length; i++) 
                {
        
                    if(EventFieldLocations[i].EventType == YourTeamEventSelection)
                    {
                        if(EventFieldLocations[i].UserID == selectedTeamPlayer)
                        {

                            var data = {
                                x:EventFieldLocations[i].x, 
                                y:EventFieldLocations[i].y,
                                id:EventFieldLocations[i].UserID,
                                EventType:EventFieldLocations[i].EventType
                            };
            
            
                            //Push to new temp EventFieldLocations
                            this.state.tempEventFieldLocations.push(data);

                           

                        }
        
                    }
                }
        
        

                    //Make Field Image appear
                    this.setState({YourTeamSpecificStatFieldEvents:true});
                    
                    this.setState({SelectAnEvent_ReviewGameStats_YourTeamPlayer:false});

            }


        }
        else
        {
            return alert("Please select a player");
        }

    }

    //Opponents
    GetSpecificOpponentsPlayerEventLocations = async() => {
        
        //Array to store event Locations
        var OpponentsEventFieldLocations = this.state.OpponentsEventFieldLocations;   
    
        var OpponentsEventSelection = this.state.OpponentsEventSelection;
    
        var selectedOpponentsPlayer = this.state.selectedOpponentsPlayer;
    
   
        var tempEventFieldLocations = this.state.tempEventFieldLocations;
    
            
            if(selectedOpponentsPlayer != '')
            {
    
                if(OpponentsEventSelection == '')
                {
                    return alert("Please select an event");
                }
                else
                {
                    //get Event locations using SelectedTeamPlayer + YourTeamEventSelection
                    const { state, setParams, navigate } = this.props.navigation;
                    const params = state.params || {};
                   
                    //empty tempEventFieldLocations as this is only a temp array
                    tempEventFieldLocations.splice(0,tempEventFieldLocations.length);
            
                    //filter array to get the specific player and event locations
                    for (var i = 0; i < OpponentsEventFieldLocations.length; i++) 
                    {
            
                   
                        //Bug here- we are not  hitting this if statement
                        if(OpponentsEventFieldLocations[i].EventType == OpponentsEventSelection)
                        {
                         
                            if(OpponentsEventFieldLocations[i].UserID == selectedOpponentsPlayer)
                            {
                    
                                var data = {
                                    x:OpponentsEventFieldLocations[i].x, 
                                    y:OpponentsEventFieldLocations[i].y,
                                    id:OpponentsEventFieldLocations[i].UserID
                                };
                
                
                                //Push to new temp EventFieldLocations
                                this.state.tempEventFieldLocations.push(data);
                

                            }

                          
                        }
                    }
            
                        //Make Field Image appear
                        this.setState({OpponentsSpecificStatFieldEvents:true});

                        this.setState({SelectAnEvent_ReviewGameStats_Opponents_TeamPlayer: false});

                    
                }
    
    
            }
            else
            {
                return alert("Please select a player");
            }
    
        }
    
    



    //Toggles frontend - View overall game stats
    ReviewGameStats = async() => { 

        this.setState({ displayReviewSelection:false});

        this.setState({ displayReviewGameStats: true});
    }

    //Toggles frontend - Event Selection will appear
    TeamSpecificStat = async() => {
    
        this.setState({ SelectAnEvent_ReviewGameStats_YourTeam: true });

        this.setState({ displayReviewSelection: false});

        
        this.setState({ displayReviewGameStats: false});



    }

    //Toggles frontend - Event Selection will appear
    OpponentsSpecificStat = async() => {
        
        this.setState({ SelectAnEvent_ReviewGameStats_Opponents: true});

        this.setState({ displayReviewGameStats: false});

        this.setState({ displayReviewSelection: false});
    }

    ExecuteYourTeamEventAnaylsis = async() => {

          //Users Event selection
          var YourTeamEventSelection = this.state.YourTeamEventSelection;
  
          //Array to store event Locations
          var EventFieldLocations = this.state.EventFieldLocations;
  
          var myUserId = firebase.auth().currentUser.uid;
          var tempEventFieldLocations = this.state.tempEventFieldLocations;

          const { state, setParams, navigate } = this.props.navigation;
          const params = state.params || {};
         
          //empty tempEventFieldLocations as this is only a temp array
          tempEventFieldLocations.splice(0,tempEventFieldLocations.length);
  
          //filter array to get the specific player and event locations
          for (var i = 0; i < EventFieldLocations.length; i++) 
          {
  
              if(EventFieldLocations[i].EventType == YourTeamEventSelection)
              {
  
                  var data = {
                      x:EventFieldLocations[i].x, 
                      y:EventFieldLocations[i].y 
                  };
  
  
                  //Push to new temp EventFieldLocations
                  this.state.tempEventFieldLocations.push(data);
  
              }
          }
  

          this.setState({SelectAnEvent_ReviewGameStats_YourTeam:false});

          //Make Field Image appear
          this.setState({YourTeamSpecificStatFieldEvents:true});
   
    }

    ExecuteOpponentsPlayerEventAnaylsis = async() => {

        //Users Event selection
        var OpponentEventSelection = this.state.OpponentEventSelection;
        
        //Array to store event Locations
        var OpponentsEventFieldLocations = this.state.OpponentsEventFieldLocations;

        var myUserId = firebase.auth().currentUser.uid;
        var tempEventFieldLocations = this.state.tempEventFieldLocations;

        var SportType = this.state.SportType;


        const { state, setParams, navigate } = this.props.navigation;
        const params = state.params || {};

        //empty tempEventFieldLocations as this is only a temp array
        tempEventFieldLocations.splice(0,tempEventFieldLocations.length);

        //filter array to get the specific player and event locations
        for (var i = 0; i < OpponentsEventFieldLocations.length; i++) 
        {

            if(OpponentsEventFieldLocations[i].EventType == OpponentEventSelection)
            {

                var data = {
                    x:OpponentsEventFieldLocations[i].x, 
                    y:OpponentsEventFieldLocations[i].y 
                };


                //Push to new temp EventFieldLocations
                this.state.tempEventFieldLocations.push(data);


             
            }
        }


        this.setState({SelectAnEvent_ReviewGameStats_Opponents:false});

       
        //Make Field Image appear
        this.setState({OpponentsSpecificStatFieldEvents:true});

     
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

    //The users Team player selection will appear
    YourTeamSelected = async() => {

        this.setState({ displayReviewOpponentsPlayer:false });
        this.setState({ displayReviewSelection:false});
        this.setState({ displayReviewYourTeamPlayer:true });
        this.setState({ displayTeamOption: false}); 

        
    //Your Team - Player List

        //Obtain SelectedStarting11 Array of players
        const { state, setParams, navigate } = this.props.navigation;
        const params = state.params || {};

        var myUserId = firebase.auth().currentUser.uid;
        var tempArr = [];

        firebase.database().ref('/teams').child(myUserId).child('/games').child(params.GameRecordKey).child('YourTeam').child('players')
            .on('value', snapshot => {

                console.log(snapshot.val());
              
                tempArr = this.snapshotToArray(snapshot);

                this.setState({
                    PlayerData: tempArr
                });

        });


    
    }

    //Opponents player selection will appear
    OpponentsSelected = async() => {

        this.setState({ displayReviewSelection:false});
        this.setState({ displayReviewOpponentsPlayer:true });
        this.setState({ displayTeamOption: false}); 



        //Your Team - Player List

        //Obtain SelectedStarting11 Array of players
        const { state, setParams, navigate } = this.props.navigation;
        const params = state.params || {};

        var myUserId = firebase.auth().currentUser.uid;
        var tempArr = [];

        firebase.database().ref('/teams').child(myUserId).child('/games').child(params.GameRecordKey).child('Opponents').child('players')
            .on('value', snapshot => {

            
              
                tempArr = this.snapshotToArray(snapshot);


                // console.log(this.snapshotToArray(snapshot));
                this.setState({
                    OpponentsPlayerData: tempArr
                });

        });


    }

    //This will trigger a selection on the frontend , where the user selects to review their Team players
    SelectPlayerSelection = async() => {

        this.setState({displayReviewGameStats: false});
        this.setState({displayReviewSelection:false});

        this.setState({SelectAnEvent_ReviewGameStats_YourTeamPlayer:true});

    }

    
    //This will trigger a selection on the frontend , where the user selects to review the Opponents players
    SelectOpponentsPlayerSelection = async() => {

        this.setState({displayReviewGameStats: false});
        this.setState({displayReviewSelection:false});

        this.setState({SelectAnEvent_ReviewGameStats_Opponents_TeamPlayer:true});

    }

   
        render(){
            
            var ReviewGameStats;
            var ReviewPlayerStats;
            var ReviewSelection;
            var TeamOption;
            var PlayerStats;
            
            var FieldWithPlots;
        
            var SportType = this.state.SportType;

            var PlayerKitNumber = this.state.PlayerKitNumber;

            var PlayerName = this.state.PlayerName;

            var PlayerPosition = this.state.PlayerPosition;
            var Goals = this.state.Goals;
            var Points = this.state.Points;
            var Passes = this.state.Passes;
            var Shots = this.state.Shots;
            var ShotsOnTarget = this.state.ShotsOnTarget;
            var YourTeamEventSelection = this.state.YourTeamEventSelection;

            
            var displayReviewSelection = this.state.displayReviewSelection;
            var displaySelectedPlayerStats = this.state.displaySelectedPlayerStats;
            var displayReviewGameStats = this.state.displayReviewGameStats;
            var displayOpponentsSelectedPlayerStats = this.state.displayOpponentsSelectedPlayerStats;
            
            //Event Selection - Overall Team/Opponent Team Events
            var SelectAnEvent_ReviewGameStats_YourTeam  = this.state.SelectAnEvent_ReviewGameStats_YourTeam;
            var SelectAnEvent_ReviewGameStats_Opponents = this.state.SelectAnEvent_ReviewGameStats_Opponents;

            //Event Selection - Player Specific Event Selection  
            var SelectAnEvent_ReviewGameStats_YourTeamPlayer = this.state.SelectAnEvent_ReviewGameStats_YourTeamPlayer;
            var SelectAnEvent_ReviewGameStats_Opponents_TeamPlayer = this.state.SelectAnEvent_ReviewGameStats_Opponents_TeamPlayer;

            //Field Location views - Overall Team/Opponent Team Events (GAA + Soccer)
            var YourTeamSpecificStatFieldEvents = this.state.YourTeamSpecificStatFieldEvents;
            var OpponentsSpecificStatFieldEvents = this.state.OpponentsSpecificStatFieldEvents;



          


                    if(displayReviewSelection == true)
                    {

                            ReviewSelection = (

                                <ScrollView style={stylesViewGame.container}>
                                
                                    <Text style={stylesViewGame.text}>Select an Option:</Text>

                                    <TouchableOpacity style={stylesViewGame.button} onPress = {this.ReviewGameStats}>
                                        <Text style={stylesViewGame.StatTextWhite}>Review All Games Stats</Text>
                                    </TouchableOpacity>
                                    
                                    <TouchableOpacity style={stylesViewGame.button} onPress = {this.SelectPlayerSelection}>
                                        <Text style={stylesViewGame.StatTextWhite}>Specific players stats from {this.state.TeamName}</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={stylesViewGame.button} onPress = {this.SelectOpponentsPlayerSelection}>
                                        <Text style={stylesViewGame.StatTextWhite}>Specific players stats from {this.state.OpponentsName}</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={stylesViewGame.button} onPress = {this.GoToMainMenu}>
                                        <Text style={stylesViewGame.StatTextWhite}>Back to Main Menu</Text>
                                    </TouchableOpacity>
                                
                                </ScrollView>

                            );
        
                    }



                    if(displayReviewGameStats == true)
                    {

                        if(SportType == 'GAA')
                        {

                            //We are here - cant get the rows//- look at github and replace that way
                            ReviewGameStats= (

                                <View style={stylesViewGame.container}>

                                    <View style={stylesViewGame.headerContainer}>
                                        <Text style={stylesViewGame.StatTextWhite}>{this.state.TeamName}</Text>
                                    </View>

                                    <View style={stylesViewGame.StatRow}>
                                        <View style={stylesViewGame.StatColumn}>
                                            <Text style={stylesViewGame.StatTextWhite}> Goals: {this.state.totalTeamGoals}</Text>
                                            <Text style={stylesViewGame.StatTextWhite}> Points: {this.state.totalTeamPoints}</Text>
                                            <Text style={stylesViewGame.StatTextWhite}> Shots: {this.state.totalTeamShots}</Text>
                                            <Text style={stylesViewGame.StatTextWhite}> Shots on target: {this.state.totalTeamShotsOnTarget}</Text>
                                        </View>
                                    </View>


                                    <TouchableOpacity style={stylesViewGame.button} onPress = {this.TeamSpecificStat}>
                                        <Text style={stylesViewGame.buttonTitle}>Review a specific stat from {this.state.TeamName} records</Text>
                                    </TouchableOpacity>

 
                                    <View style={stylesViewGame.headerContainer}>
                                        <Text style={stylesViewGame.StatTextWhite}>{this.state.OpponentsName}</Text>
                                    </View>

                                    <View style={stylesViewGame.StatRow}>
                                        <View style={stylesViewGame.StatColumn}>
                                            <Text style={stylesViewGame.StatTextWhite}> Goals: {this.state.totalOpponentsTeamGoals}</Text>
                                            <Text style={stylesViewGame.StatTextWhite}> Points: {this.state.totalOpponentsTeamPoints}</Text>
                                            <Text style={stylesViewGame.StatTextWhite}> Shots: {this.state.totalOpponentsTeamShots}</Text>
                                            <Text style={stylesViewGame.StatTextWhite}> Shots on target: {this.state.totalOpponentsTeamShotsOnTarget}</Text>
                                        </View>
                                    </View>

                                    <TouchableOpacity style={stylesViewGame.button} onPress = {this.OpponentsSpecificStat}>
                                        <Text style={stylesViewGame.buttonTitle}>Review a specific stat from {this.state.OpponentsName} records</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={stylesViewGame.button} onPress = {this.GoToMainMenu}>
                                        <Text style={stylesViewGame.buttonTitle}>Back to Main Menu</Text>
                                    </TouchableOpacity> 

                                </View>

                            );

                        }
                        else if(SportType == 'Soccer')
                        {

                            ReviewGameStats= (

                                <View style={stylesViewGame.container}>

                                    <View style={stylesViewGame.headerContainer}>
                                        <Text style={stylesViewGame.StatTextWhite}>{this.state.TeamName} records</Text>
                                    </View>

                                    <View style={stylesViewGame.StatRow}>
                                        <View style={stylesViewGame.StatColumn}>
                                            <Text style={stylesViewGame.StatTextWhite}> Goals: {this.state.totalTeamGoals}</Text>
                                            <Text style={stylesViewGame.StatTextWhite}> Shots: {this.state.totalTeamShots}</Text>
                                            <Text style={stylesViewGame.StatTextWhite}> Shots on target: {this.state.totalTeamShotsOnTarget}</Text>
                                        </View>
                                    </View>

                                    <TouchableOpacity style={stylesViewGame.button} onPress = {this.TeamSpecificStat}>
                                        <Text style={stylesViewGame.buttonTitle}>Review a specific stat from {this.state.TeamName} </Text>
                                    </TouchableOpacity>

                                    <View style={stylesViewGame.headerContainer}>
                                        <Text style={stylesViewGame.StatTextWhite}>{this.state.OpponentsName} records</Text>
                                    </View>

                                    <View style={stylesViewGame.StatRow}>
                                        <View style={stylesViewGame.StatColumn}>
                                            <Text style={stylesViewGame.StatTextWhite}> Goals: {this.state.totalOpponentsTeamGoals}</Text>
                                            <Text style={stylesViewGame.StatTextWhite}> Shots: {this.state.totalOpponentsTeamShots}</Text>
                                            <Text style={stylesViewGame.StatTextWhite}> Shots on target: {this.state.totalOpponentsTeamShotsOnTarget}</Text>
                                        </View>
                                    </View>

                                    <TouchableOpacity style={stylesViewGame.button} onPress = {this.OpponentsSpecificStat}>
                                        <Text style={stylesViewGame.buttonTitle}>Review a specific stat from {this.state.OpponentsName} records</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={stylesViewGame.button} onPress = {this.GoToMainMenu}>
                                        <Text style={stylesViewGame.buttonTitle}>Back to Main Menu</Text>
                                    </TouchableOpacity>


                                </View>
                            );  
                        }

                    }


                    if(SelectAnEvent_ReviewGameStats_YourTeam)
                    {

                        if(SportType == 'GAA')
                        {

                            ReviewPlayerStats = (
                                
                                <ScrollView style={stylesViewGame.container}>
            
                                        <Text style={stylesViewGame.buttonTitle}>Select a stat below</Text>
            
                                        <Picker
                                            selectedValue={this.state.YourTeamEventSelection}
                                            style={stylesViewGame.input}
                                            onValueChange={(text) => this.setState({YourTeamEventSelection:text})}
                                        >
                                            
                                            <Picker.Item label="Select a event" value="" />
                                            <Picker.Item label="Goal" value="Goal" />
                                            <Picker.Item label="Point" value="Point"/>
                                            <Picker.Item label="Pass" value="Pass"/>
                        
                        
                                        </Picker>
            
                                        <TouchableOpacity style={stylesViewGame.button} onPress = {this.ExecuteYourTeamEventAnaylsis}>
                                            <Text style={stylesViewGame.buttonTitle}>Review this teams games stats</Text>
                                        </TouchableOpacity>   

                                        <TouchableOpacity style={stylesViewGame.button} onPress = {this.GoToMainMenu}>
                                            <Text style={stylesViewGame.buttonTitle}>Back to Main Menu</Text>
                                        </TouchableOpacity>

            
                                </ScrollView>
                            );

                        }
                    
                        else if(SportType == 'Soccer')
                        {
                            ReviewPlayerStats = (
                                
                                <ScrollView style={stylesViewGame.container}>
            
                                        <Text style={stylesViewGame.buttonTitle}>Select a stat below</Text>
            
                                        <Picker
                                            selectedValue={this.state.YourTeamEventSelection}
                                            style={stylesViewGame.input}
                                            onValueChange={(text) => this.setState({YourTeamEventSelection:text})}
                                        >
                                            
                                            <Picker.Item label="Select a event" value="" />
                                            <Picker.Item label="Goal" value="Goal" />
                                            <Picker.Item label="Pass" value="Pass"/>
                        
                        
                                        </Picker>
            
                                        <TouchableOpacity style={stylesViewGame.button} onPress = {this.ExecuteYourTeamEventAnaylsis}>
                                            <Text style={stylesViewGame.buttonTitle}>Review this teams games stats</Text>
                                        </TouchableOpacity>   

                                        <TouchableOpacity style={stylesViewGame.button} onPress = {this.GoToMainMenu}>
                                            <Text style={stylesViewGame.buttonTitle}>Back to Main Menu</Text>
                                        </TouchableOpacity>

            
                                </ScrollView>
                            );
                        }
                    }

                    if(SelectAnEvent_ReviewGameStats_Opponents)
                    {

                        if(SportType == 'GAA')
                        {

                            ReviewPlayerStats = (

                                <ScrollView style={stylesViewGame.container}>
                
                                    <Text style={stylesViewGame.buttonTitle}>Select a stat below</Text>
                
                                        <Picker
                                            selectedValue={this.state.OpponentsEventSelection}
                                            style={stylesViewGame.input}
                                            onValueChange={(text) => this.setState({OpponentsEventSelection:text})}
                                        >
                                                        
                                            <Picker.Item label="Select a event" value="" />
                                            <Picker.Item label="Goal" value="Goal" />
                                            <Picker.Item label="Point" value="Point"/>
                                            <Picker.Item label="Pass" value="Pass"/>
                                    
                                    
                                            </Picker>
                
                                            <TouchableOpacity style={stylesViewGame.button} onPress = {this.ExecuteOpponentsPlayerEventAnaylsis}>
                                                <Text style={stylesViewGame.buttonTitle}>Submit</Text>
                                            </TouchableOpacity>   

                                            <TouchableOpacity style={stylesViewGame.button} onPress = {this.GoToMainMenu}>
                                                <Text style={stylesViewGame.buttonTitle}>Back to Main Menu</Text>
                                            </TouchableOpacity>

                
                                </ScrollView>
                            );
                        }
                        else if(SportType == 'Soccer')
                        {

                            ReviewPlayerStats = (

                                <ScrollView style={stylesViewGame.container}>
                
                                    <Text style={stylesViewGame.buttonTitle}>Select a stat</Text>
                
                                        <Picker
                                            selectedValue={this.state.OpponentsEventSelection}
                                            style={stylesViewGame.input}
                                            onValueChange={(text) => this.setState({OpponentsEventSelection:text})}
                                        >
                                                        
                                            <Picker.Item label="Select a event" value="" />
                                            <Picker.Item label="Goal" value="Goal" />
                                            <Picker.Item label="Pass" value="Pass"/>
                                    
                                    
                                            </Picker>
                
                                            <TouchableOpacity style={stylesViewGame.button} onPress = {this.ExecuteOpponentsPlayerEventAnaylsis}>
                                                <Text style={stylesViewGame.buttonTitle}>Submit</Text>
                                            </TouchableOpacity>   

                                            <TouchableOpacity style={stylesViewGame.button} onPress = {this.GoToMainMenu}>
                                                <Text style={stylesViewGame.buttonTitle}>Back to Main Menu</Text>
                                            </TouchableOpacity>

                
                                </ScrollView>
                            );
                        }
                    }


                // YOUR_TEAM SPECIFIC PLAYER  
                
                 if(SelectAnEvent_ReviewGameStats_YourTeamPlayer == true)
                 {
                     if(SportType == 'GAA')
                     {

                        ReviewPlayerStats = (

                            <ScrollView style={stylesViewGame.container}>

                                <Text style={stylesViewGame.buttonTitle}>Select a player </Text>

                                <Picker
                                    selectedValue={this.state.selectedTeamPlayer}
                                    style={stylesViewGame.input}
                                    onValueChange={(text) => this.setState({selectedTeamPlayer:text})}
                                >

                                <Picker.Item label="Select a Player" value="" />
                                    {this.state.PlayerData.map((item, index) => {
                                        return (

                                                <Picker.Item label={item.PlayerName} value={item.PlayerID}/>
                                            
                                                )

                                    })} 

                                </Picker> 

                                <Text style={stylesViewGame.buttonTitle}>Select a stat (*Optional*)</Text>

                                <Picker
                                    selectedValue={this.state.YourTeamEventSelection}
                                    style={stylesViewGame.input}
                                    onValueChange={(text) => this.setState({YourTeamEventSelection:text})}
                                    >
                                                    
                                        <Picker.Item label="Select a event" value="" />
                                        <Picker.Item label="Goal" value="Goal" />
                                        <Picker.Item label="Point" value="Point" />
                                        <Picker.Item label="Pass" value="Pass"/>


                                </Picker>  


                                <TouchableOpacity style={stylesViewGame.button} onPress = {this.ReviewPlayerStats}>
                                    <Text style={stylesViewGame.buttonTitle}>Review this players games stats</Text>
                                </TouchableOpacity> 

                                
                                <TouchableOpacity style={stylesViewGame.button} onPress = {this.GetSpecificPlayerEventLocations}>
                                    <Text style={stylesViewGame.buttonTitle}>Review this players event locations</Text>
                                </TouchableOpacity> 

                                <TouchableOpacity style={stylesViewGame.button} onPress = {this.GoToMainMenu}>
                                        <Text style={stylesViewGame.buttonTitle}>Back to Main Menu</Text>
                                </TouchableOpacity>




                                
                            </ScrollView>

                        );


                    }
                    else if(SportType == 'Soccer')
                    {
                        ReviewPlayerStats = (

                            <ScrollView style={stylesViewGame.container}>

                                <Text style={stylesViewGame.buttonTitle}>Select a player</Text>

                                <Picker
                                    selectedValue={this.state.selectedTeamPlayer}
                                    style={stylesViewGame.input}
                                    onValueChange={(text) => this.setState({selectedTeamPlayer:text})}
                                >

                                <Picker.Item label="Select a Player" value="" />
                                    {this.state.PlayerData.map((item, index) => {
                                        return (

                                                <Picker.Item label={item.PlayerName} value={item.PlayerID}/>
                                            
                                                )

                                    })} 

                                </Picker> 

                                <Text style={stylesViewGame.buttonTitle}>Select a stat (*Optional*)</Text>

                                <Picker
                                    selectedValue={this.state.YourTeamEventSelection}
                                    style={stylesViewGame.input}
                                    onValueChange={(text) => this.setState({YourTeamEventSelection:text})}
                                    >
                                                    
                                        <Picker.Item label="Select a event" value="" />
                                        <Picker.Item label="Goal" value="Goal" /> 
                                        <Picker.Item label="Pass" value="Pass"/>


                                </Picker>  

                                <TouchableOpacity style={stylesViewGame.button} onPress = {this.ReviewPlayerStats}>
                                    <Text style={stylesViewGame.buttonTitle}>Review this players games stats</Text>
                                </TouchableOpacity> 

                                
                                <TouchableOpacity style={stylesViewGame.button} onPress = {this.GetSpecificPlayerEventLocations}>
                                    <Text style={stylesViewGame.buttonTitle}>Review this players event locations</Text>
                                </TouchableOpacity> 

                                <TouchableOpacity style={stylesViewGame.button} onPress = {this.GoToMainMenu}>
                                        <Text style={stylesViewGame.buttonTitle}>Back to Main Menu</Text>
                                </TouchableOpacity>


                                
                            </ScrollView>

                        );

                      

                    }

                    
                 }

                 if(SelectAnEvent_ReviewGameStats_Opponents_TeamPlayer == true)
                 {

                        if(SportType == 'GAA')
                        {

                            ReviewPlayerStats = (
                                
                                <ScrollView style={stylesViewGame.container}>

                                    <Text style={stylesViewGame.buttonTitle}>Select a player</Text>

                                    <Picker
                                        selectedValue={this.state.selectedOpponentsPlayer}
                                        style={stylesViewGame.input}
                                        onValueChange={(text) => this.setState({selectedOpponentsPlayer:text})}
                                    >

                                    <Picker.Item label="Select a Player" value="" />
                                        {this.state.OpponentsPlayerData.map((item, index) => {
                                            return (

                                                    <Picker.Item label={item.PlayerName} value={item.PlayerID}/>
                                                
                                                    )

                                        })} 

                                    </Picker> 

                                    <Text style={stylesViewGame.buttonTitle}>Select a stat (*Optional*)</Text>

                                    <Picker
                                        selectedValue={this.state.OpponentsEventSelection}
                                        style={stylesViewGame.input}
                                        onValueChange={(text) => this.setState({OpponentsEventSelection:text})}
                                        >
                                                        
                                            <Picker.Item label="Select a event" value="" />
                                            <Picker.Item label="Goal" value="Goal" /> 
                                            <Picker.Item label="Point" value="Point" /> 
                                            <Picker.Item label="Pass" value="Pass"/>


                                    </Picker>  

                                    <TouchableOpacity style={stylesViewGame.button} onPress = {this.ReviewOpponentsPlayerStats}>
                                        <Text style={stylesViewGame.buttonTitle}>Review this players games stats</Text>
                                    </TouchableOpacity> 

                                    
                                    <TouchableOpacity style={stylesViewGame.button} onPress = {this.GetSpecificOpponentsPlayerEventLocations}>
                                        <Text style={stylesViewGame.buttonTitle}>Review this players event locations</Text>
                                    </TouchableOpacity> 

                                    <TouchableOpacity style={stylesViewGame.button} onPress = {this.GoToMainMenu}>
                                            <Text style={stylesViewGame.buttonTitle}>Back to Main Menu</Text>
                                    </TouchableOpacity>


                                    
                                </ScrollView>

                            );

                       

                        }
   
                    
                    
                    if(SportType =='Soccer')
                    {

                        ReviewPlayerStats = (
                            
                            <ScrollView style={stylesViewGame.container}>

                                <Text style={stylesViewGame.buttonTitle}>Select a player</Text>

                                <Picker
                                    selectedValue={this.state.selectedOpponentsPlayer}
                                    style={stylesViewGame.input}
                                    onValueChange={(text) => this.setState({selectedOpponentsPlayer:text})}
                                >

                                <Picker.Item label="Select a Player" value="" />
                                    {this.state.OpponentsPlayerData.map((item, index) => {
                                        return (

                                                <Picker.Item label={item.PlayerName} value={item.PlayerID}/>
                                            
                                                )

                                    })} 

                                </Picker> 

                                <Text style={stylesViewGame.buttonTitle}>Select a stat (*Optional*)</Text>

                                <Picker
                                    selectedValue={this.state.OpponentsEventSelection}
                                    style={stylesViewGame.input}
                                    onValueChange={(text) => this.setState({OpponentsEventSelection:text})}
                                    >
                                                    
                                        <Picker.Item label="Select a event" value="" />
                                        <Picker.Item label="Goal" value="Goal" /> 
                                        <Picker.Item label="Pass" value="Pass"/>


                                </Picker>  

                                <TouchableOpacity style={stylesViewGame.button} onPress = {this.ReviewOpponentsPlayerStats}>
                                    <Text style={stylesViewGame.buttonTitle}>Review this players games stats</Text>
                                </TouchableOpacity> 

                                
                                <TouchableOpacity style={stylesViewGame.button} onPress = {this.GetSpecificOpponentsPlayerEventLocations}>
                                    <Text style={stylesViewGame.buttonTitle}>Review this players event locations</Text>
                                </TouchableOpacity> 

                                <TouchableOpacity style={stylesViewGame.button} onPress = {this.GoToMainMenu}>
                                        <Text style={stylesViewGame.Text}>Back to Main Menu</Text>
                                </TouchableOpacity>



                                
                            </ScrollView>

                        );

                      
   
                    }

                }
                 



                if(displaySelectedPlayerStats == true)
                {
                    if(SportType == 'GAA')
                    {
                        ReviewGameStats= (
                            <ScrollView style={stylesViewGame.container}>

                                <View>
                                    <View style={stylesViewGame.headerContainer}>
                                        <Text style={stylesViewGame.StatTextWhite}>{PlayerName}</Text>
                                    </View>

                                    <View style={stylesViewGame.StatRow}>
                                        <View style={stylesViewGame.StatColumn}>
                                            <Text style={stylesViewGame.StatTextWhite}> Goals: {Goals}</Text>
                                            <Text style={stylesViewGame.StatTextWhite}> Points: {Points}</Text>
                                            <Text style={stylesViewGame.StatTextWhite}> Shots: {Shots}</Text>
                                            <Text style={stylesViewGame.StatTextWhite}> Shots on target: {ShotsOnTarget}</Text>
                                            <Text style={stylesViewGame.StatTextWhite}> Passes: {Passes}</Text>
                                        </View>

                                        <View style={stylesViewGame.StatColumn}>
                                            <Text style={stylesViewGame.StatTextWhite}> EventType: {Goals}</Text>
                                            <Text style={stylesViewGame.StatTextWhite}> EventType: {Goals}</Text>
                                            <Text style={stylesViewGame.StatTextWhite}> EventType: {Goals}</Text>
                                            <Text style={stylesViewGame.StatTextWhite}> EventType: {Goals}</Text>
                                            <Text style={stylesViewGame.StatTextWhite}> EventType: {Goals}</Text>
                                        </View>

                                        <View style={stylesViewGame.StatColumn}>
                                            <Text style={stylesViewGame.StatTextWhite}> EventType: {Goals}</Text>
                                            <Text style={stylesViewGame.StatTextWhite}> EventType: {Goals}</Text>
                                            <Text style={stylesViewGame.StatTextWhite}> EventType: {Goals}</Text>
                                            <Text style={stylesViewGame.StatTextWhite}> EventType: {Goals}</Text>
                                            <Text style={stylesViewGame.StatTextWhite}> EventType: {Goals}</Text>
                                        </View>
                                    </View>

                                    <TouchableOpacity style={stylesViewGame.button} onPress = {this.GoToMainMenu}>
                                        <Text style={stylesViewGame.StatTextWhite}> Back to Main Menu</Text>
                                    </TouchableOpacity>

                                    
                                    <TouchableOpacity style={stylesViewGame.button} onPress = {this.GoToViewGameMenu}>
                                        <Text style={stylesViewGame.StatTextWhite}>Back to View Game Menu</Text>
                                    </TouchableOpacity>
                                </View>

                            </ScrollView>
                        );
                    }
                    
                    if(SportType == 'Soccer')
                    {
                        ReviewGameStats = (

                            <ScrollView style={stylesViewGame.container}>

                                        <View>
                                            <View style={stylesViewGame.headerContainer}>
                                                <Text style={stylesViewGame.StatTextWhite}>{PlayerName}</Text>
                                            </View>

                                            <View style={stylesViewGame.StatRow}>
                                                <View style={stylesViewGame.StatColumn}>
                                                    <Text style={stylesViewGame.StatTextWhite}> Goals: {Goals}</Text>
                                                    <Text style={stylesViewGame.StatTextWhite}> Shots: {Shots}</Text>
                                                    <Text style={stylesViewGame.StatTextWhite}> Shots on target: {ShotsOnTarget}</Text>
                                                    <Text style={stylesViewGame.StatTextWhite}> Passes: {Passes}</Text>
                                                </View>

                                                <View style={stylesViewGame.StatColumn}>
                                                    <Text style={stylesViewGame.StatTextWhite}> EventType: {Goals}</Text>
                                                    <Text style={stylesViewGame.StatTextWhite}> EventType: {Goals}</Text>
                                                    <Text style={stylesViewGame.StatTextWhite}> EventType: {Goals}</Text>
                                                    <Text style={stylesViewGame.StatTextWhite}> EventType: {Goals}</Text>
                                                    <Text style={stylesViewGame.StatTextWhite}> EventType: {Goals}</Text>
                                                </View>
                                            </View>

                                            <TouchableOpacity style={stylesViewGame.button} onPress = {this.GoToMainMenu}>
                                                <Text style={stylesViewGame.StatTextWhite}>Back to Main Menu</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity style={stylesViewGame.button} onPress = {this.GoToViewGameMenu}>
                                                <Text style={stylesViewGame.StatTextWhite}>Back to View Game Menu</Text>
                                            </TouchableOpacity>
                                        </View>

                            </ScrollView>
                        );
                    }



                }

                if(displayOpponentsSelectedPlayerStats == true)
                {
                    if(SportType == 'GAA')
                    {
                        ReviewGameStats= (
                            <ScrollView style={stylesViewGame.container}>

                                <View>
                                    <View style={stylesViewGame.headerContainer}>
                                        <Text style={stylesViewGame.StatTextWhite}>{PlayerName}</Text>
                                    </View>

                                    <View style={stylesViewGame.StatRow}>
                                        <View style={stylesViewGame.StatColumn}>
                                            <Text style={stylesViewGame.StatTextWhite}> Goals: {Goals}</Text>
                                            <Text style={stylesViewGame.StatTextWhite}> Points: {Points}</Text>
                                            <Text style={stylesViewGame.StatTextWhite}> Shots: {Shots}</Text>
                                            <Text style={stylesViewGame.StatTextWhite}> Shots on target: {ShotsOnTarget}</Text>
                                            <Text style={stylesViewGame.StatTextWhite}> Passes: {Passes}</Text>
                                        </View>

                                        <View style={stylesViewGame.StatColumn}>
                                            <Text style={stylesViewGame.StatTextWhite}> EventType: {Goals}</Text>
                                            <Text style={stylesViewGame.StatTextWhite}> EventType: {Goals}</Text>
                                            <Text style={stylesViewGame.StatTextWhite}> EventType: {Goals}</Text>
                                            <Text style={stylesViewGame.StatTextWhite}> EventType: {Goals}</Text>
                                            <Text style={stylesViewGame.StatTextWhite}> EventType: {Goals}</Text>
                                        </View>
                                    </View>

                                    <TouchableOpacity style={stylesViewGame.button} onPress = {this.GoToMainMenu}>
                                        <Text style={stylesViewGame.StatTextWhite}>Back to Main Menu</Text>
                                    </TouchableOpacity>
                                    
                                    <TouchableOpacity style={stylesViewGame.button} onPress = {this.GoToViewGameMenu}>
                                        <Text style={stylesViewGame.StatTextWhite}>Back to View Game Menu</Text>
                                    </TouchableOpacity>

                                </View>

                            </ScrollView>
                        );
                    }
                    
                    if(SportType == 'Soccer')
                    {
                        ReviewGameStats = (

                            <ScrollView style={stylesViewGame.container}>

                                        <View>
                                            <View style={stylesViewGame.headerContainer}>
                                                <Text style={stylesViewGame.StatTextWhite}>{PlayerName}</Text>
                                            </View>
                                            
                                            <View style={stylesViewGame.StatRow}>
                                                <View style={stylesViewGame.StatColumn}>
                                                    <Text style={stylesViewGame.StatTextWhite}> Goals: {Goals}</Text>
                                                    <Text style={stylesViewGame.StatTextWhite}> Shots: {Shots}</Text>
                                                    <Text style={stylesViewGame.StatTextWhite}> Shots on target: {ShotsOnTarget}</Text>
                                                    <Text style={stylesViewGame.StatTextWhite}> Passes: {Passes}</Text>
                                                </View>

                                                <View style={stylesViewGame.StatColumn}>
                                                    <Text style={stylesViewGame.StatTextWhite}> EventType: {Goals}</Text>
                                                    <Text style={stylesViewGame.StatTextWhite}> EventType: {Goals}</Text>
                                                    <Text style={stylesViewGame.StatTextWhite}> EventType: {Goals}</Text>
                                                    <Text style={stylesViewGame.StatTextWhite}> EventType: {Goals}</Text>
                                                    <Text style={stylesViewGame.StatTextWhite}> EventType: {Goals}</Text>
                                                </View>

                                            </View>

                                            <TouchableOpacity style={stylesViewGame.button} onPress = {this.GoToMainMenu}>
                                                <Text style={stylesViewGame.StatTextWhite}>Back to Main Menu</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity style={stylesViewGame.button} onPress = {this.GoToViewGameMenu}>
                                                <Text style={stylesViewGame.StatTextWhite}>Back to View Game Menu</Text>
                                            </TouchableOpacity>

                                        </View>

                            </ScrollView>
                        );
                    }



                }
               
               


                if(YourTeamSpecificStatFieldEvents == true)
                {


                   //Condition to check if the Device is smaller than the image so for mobile view we check the StatsStoredUsingScreenWidth  
                        //if screenwidth < StatsStoredUsingScreenWidth || screenHeight < StatsStoredUsingScreenHeight
                            //Then alert the user that this maybe be inaccurate . please try a larger device screen size e.g web version
                                //ScrollView possibly for mobile

                                if(SportType == 'GAA')
                                {
            
                                    if(screenWidth != this.state.StatsStoredUsingScreenWidth && screenHeight != this.state.StatsStoredUsingScreenHeight)
                                    {
                                        
                                            if(screenWidth < 600 || screenHeight < 376)
                                            {
                                                alert('Warning - This device is too small to display the full image. Please scroll across the image to navigate or use a larger device screen size.');
            
                                                FieldWithPlots = (
                                               
                                                    <ScrollView>
                                                    
                                                    <ScrollView horizontal={true} style={stylesViewGame.imagePlotContainer}>
                                                    
                                                        <View style={stylesViewGame.EventContainer}>
                                                            <Text style={stylesViewGame.buttonTitle}> Event Type: {YourTeamEventSelection}</Text>
                                                        </View>

                                                        <View style={stylesViewGame.ColumnContainer}>
                                                            <TouchableOpacity style={stylesViewGame.button} onPress = {this.GoToMainMenu}>
                                                                <Text style={stylesViewGame.buttonTitle}>Back to Main Menu</Text>
                                                            </TouchableOpacity>
                                                        </View>
                            
                                                        <View style={stylesViewGame.ColumnContainer}>
                                                            <TouchableOpacity style={stylesViewGame.button} onPress = {this.GoToViewGameMenu}>
                                                                <Text style={stylesViewGame.buttonTitle}>Back to View Game Menu</Text>
                                                            </TouchableOpacity>
                                                        </View>

                                                    </ScrollView>

                                                    <ScrollView horizontal={true} style={stylesViewGame.imagePlotContainer}>
            
                                                    <ScrollView>
                                                                
                                                                <Image style ={stylesViewGame.imagePxGAA}                        
                                                                source={require('./GAApitch1.png')}/>
                                                                {this.state.EventFieldLocations.map((data) => {
                                                                    return (
                                                                    <View 
                                                                        style={{
                                                                        position: 'absolute',
                                                                        left: data.x,
                                                                        top: data.y,
                                                                        backgroundColor:'#242424',
                                                                        width: 10,
                                                                        height: 10,
                                                                        borderWidth:2,
                                                                        borderColor:'#C30000',
                                                                        borderRadius: 50
                                                                        }}>
                                                                    </View> 
                                                            
                                                                )
                                                            })} 
                                
                                                        </ScrollView>
                                                    </ScrollView>

                                                </ScrollView>
                            
                        
                        
                                                );
            
            
            
                                            } 
                                            else 
                                            {
                                      
                                                FieldWithPlots = (
            
                                                    <ScrollView>
                                                    
                                                    <ScrollView horizontal={true} style={stylesViewGame.imagePlotContainer}>
                                                    
                                                        <View style={stylesViewGame.EventContainer}>
                                                            <Text style={stylesViewGame.buttonTitle}> Event Type: {YourTeamEventSelection}</Text>
                                                        </View>

                                                        <View style={stylesViewGame.ColumnContainer}>
                                                            <TouchableOpacity style={stylesViewGame.button} onPress = {this.GoToMainMenu}>
                                                                <Text style={stylesViewGame.buttonTitle}>Back to Main Menu</Text>
                                                            </TouchableOpacity>
                                                        </View>
                            
                                                        <View style={stylesViewGame.ColumnContainer}>
                                                            <TouchableOpacity style={stylesViewGame.button} onPress = {this.GoToViewGameMenu}>
                                                                <Text style={stylesViewGame.buttonTitle}>Back to View Game Menu</Text>
                                                            </TouchableOpacity>
                                                        </View>

                                                    </ScrollView>

                                                    <ScrollView horizontal={true} style={stylesViewGame.imagePlotContainer}>
            
                                                    <ScrollView>
                                                                
                                                                <Image style ={stylesViewGame.imagePxGAA}                        
                                                                source={require('./GAApitch1.png')}/>
                                                                {this.state.EventFieldLocations.map((data) => {
                                                                    return (
                                                                    <View 
                                                                        style={{
                                                                        position: 'absolute',
                                                                        left: data.x,
                                                                        top: data.y,
                                                                        backgroundColor:'#242424',
                                                                        width: 10,
                                                                        height: 10,
                                                                        borderWidth:2,
                                                                        borderColor:'#C30000',
                                                                        borderRadius: 50
                                                                        }}>
                                                                    </View> 
                                                            
                                                                )
                                                            })} 
                                
                                                        </ScrollView>
                                                    </ScrollView>

                                                </ScrollView>
                                            
                                                );
            
                                            }
                                   
            
                        
            
            
                                    }   
            
                                    else
                                    {
            
            
            
                                        if(screenWidth < 600 || screenHeight < 376)
                                        {
                
                                            alert('Warning - This device is too small to display the full image. Please scroll across the image to navigate or use a larger device screen size.');
                                            
                                            FieldWithPlots = (
            
                                
                                    
                                                <ScrollView>
                                                    
                                                    <ScrollView horizontal={true} style={stylesViewGame.imagePlotContainer}>
                                                    
                                                        <View style={stylesViewGame.EventContainer}>
                                                            <Text style={stylesViewGame.buttonTitle}> Event Type: {YourTeamEventSelection}</Text>
                                                        </View>

                                                        <View style={stylesViewGame.ColumnContainer}>
                                                            <TouchableOpacity style={stylesViewGame.button} onPress = {this.GoToMainMenu}>
                                                                <Text style={stylesViewGame.buttonTitle}>Back to Main Menu</Text>
                                                            </TouchableOpacity>
                                                        </View>
                            
                                                        <View style={stylesViewGame.ColumnContainer}>
                                                            <TouchableOpacity style={stylesViewGame.button} onPress = {this.GoToViewGameMenu}>
                                                                <Text style={stylesViewGame.buttonTitle}>Back to View Game Menu</Text>
                                                            </TouchableOpacity>
                                                        </View>

                                                    </ScrollView>

                                                    <ScrollView horizontal={true} style={stylesViewGame.imagePlotContainer}>
            
                                                    <ScrollView>
                                                                
                                                                <Image style ={stylesViewGame.imagePxGAA}                        
                                                                source={require('./GAApitch1.png')}/>
                                                                {this.state.EventFieldLocations.map((data) => {
                                                                    return (
                                                                    <View 
                                                                        style={{
                                                                        position: 'absolute',
                                                                        left: data.x,
                                                                        top: data.y,
                                                                        backgroundColor:'#242424',
                                                                        width: 10,
                                                                        height: 10,
                                                                        borderWidth:2,
                                                                        borderColor:'#C30000',
                                                                        borderRadius: 50
                                                                        }}>
                                                                    </View> 
                                                            
                                                                )
                                                            })} 
                                
                                                        </ScrollView>
                                                    </ScrollView>

                                                </ScrollView>
                            
                                            );
                                        }
            
                                        FieldWithPlots = (
            
                                
                                    
                                           <ScrollView>
                                                    
                                                    <ScrollView horizontal={true} style={stylesViewGame.imagePlotContainer}>
                                                    
                                                        <View style={stylesViewGame.EventContainer}>
                                                            <Text style={stylesViewGame.buttonTitle}> Event Type: {YourTeamEventSelection}</Text>
                                                        </View>

                                                        <View style={stylesViewGame.ColumnContainer}>
                                                            <TouchableOpacity style={stylesViewGame.button} onPress = {this.GoToMainMenu}>
                                                                <Text style={stylesViewGame.buttonTitle}>Back to Main Menu</Text>
                                                            </TouchableOpacity>
                                                        </View>
                            
                                                        <View style={stylesViewGame.ColumnContainer}>
                                                            <TouchableOpacity style={stylesViewGame.button} onPress = {this.GoToViewGameMenu}>
                                                                <Text style={stylesViewGame.buttonTitle}>Back to View Game Menu</Text>
                                                            </TouchableOpacity>
                                                        </View>

                                                    </ScrollView>

                                                    <ScrollView horizontal={true} style={stylesViewGame.imagePlotContainer}>
            
                                                    <ScrollView>
                                                                
                                                                <Image style ={stylesViewGame.imagePxGAA}                        
                                                                source={require('./GAApitch1.png')}/>
                                                                {this.state.EventFieldLocations.map((data) => {
                                                                    return (
                                                                    <View 
                                                                        style={{
                                                                        position: 'absolute',
                                                                        left: data.x,
                                                                        top: data.y,
                                                                        backgroundColor:'#242424',
                                                                        width: 10,
                                                                        height: 10,
                                                                        borderWidth:2,
                                                                        borderColor:'#C30000',
                                                                        borderRadius: 50
                                                                        }}>
                                                                    </View> 
                                                            
                                                                )
                                                            })} 
                                
                                                        </ScrollView>
                                                    </ScrollView>

                                                </ScrollView>
            
                                        );
            
                                    }   
            
                                }
                                else if(SportType == 'Soccer')
                                {
            
                                        if(screenWidth != this.state.StatsStoredUsingScreenWidth && screenHeight != this.state.StatsStoredUsingScreenHeight)
                                        {
            
                                            if(screenWidth < 600 || screenHeight < 376)
                                            {
                                                alert('Warning - This device is too small to display the full image. Please scroll across the image to navigate or use a larger device screen size.');
            
                                        
                                                FieldWithPlots = (
                                          
                                                    <ScrollView>
                                                    
                                                    <ScrollView horizontal={true} style={stylesViewGame.imagePlotContainer}>
                                                    
                                                        <View style={stylesViewGame.EventContainer}>
                                                            <Text style={stylesViewGame.buttonTitle}> Event Type: {YourTeamEventSelection}</Text>
                                                        </View>

                                                        <View style={stylesViewGame.ColumnContainer}>
                                                            <TouchableOpacity style={stylesViewGame.button} onPress = {this.GoToMainMenu}>
                                                                <Text style={stylesViewGame.buttonTitle}>Back to Main Menu</Text>
                                                            </TouchableOpacity>
                                                        </View>
                            
                                                        <View style={stylesViewGame.ColumnContainer}>
                                                            <TouchableOpacity style={stylesViewGame.button} onPress = {this.GoToViewGameMenu}>
                                                                <Text style={stylesViewGame.buttonTitle}>Back to View Game Menu</Text>
                                                            </TouchableOpacity>
                                                        </View>

                                                    </ScrollView>

                                                    <ScrollView horizontal={true} style={stylesViewGame.imagePlotContainer}>
            
                                                    <ScrollView>
                                                                
                                                    <Image style ={stylesViewGame.imagePxSoccer}                   
                                                                source={require('./SoccerField.png')}/>
                                                                {this.state.EventFieldLocations.map((data) => {
                                                                    return (
                                                                    <View 
                                                                        style={{
                                                                        position: 'absolute',
                                                                        left: data.x,
                                                                        top: data.y,
                                                                        backgroundColor:'#242424',
                                                                        width: 10,
                                                                        height: 10,
                                                                        borderWidth:2,
                                                                        borderColor:'#C30000',
                                                                        borderRadius: 50
                                                                        }}>
                                                                    </View> 
                                                            
                                                                )
                                                            })} 
                                
                                                        </ScrollView>
                                                    </ScrollView>

                                                </ScrollView>
                            





                                                );
            
                                            }
                                            else
                                            {
            
            
            
                                                FieldWithPlots = (
            
                                                    <ScrollView>
                                                    
                                                    <ScrollView horizontal={true} style={stylesViewGame.imagePlotContainer}>
                                                    
                                                        <View style={stylesViewGame.EventContainer}>
                                                            <Text style={stylesViewGame.buttonTitle}> Event Type: {YourTeamEventSelection}</Text>
                                                        </View>

                                                        <View style={stylesViewGame.ColumnContainer}>
                                                            <TouchableOpacity style={stylesViewGame.button} onPress = {this.GoToMainMenu}>
                                                                <Text style={stylesViewGame.buttonTitle}>Back to Main Menu</Text>
                                                            </TouchableOpacity>
                                                        </View>
                            
                                                        <View style={stylesViewGame.ColumnContainer}>
                                                            <TouchableOpacity style={stylesViewGame.button} onPress = {this.GoToViewGameMenu}>
                                                                <Text style={stylesViewGame.buttonTitle}>Back to View Game Menu</Text>
                                                            </TouchableOpacity>
                                                        </View>

                                                    </ScrollView>

                                                    <ScrollView horizontal={true} style={stylesViewGame.imagePlotContainer}>
            
                                                    <ScrollView>
                                                                
                                                    <Image style ={stylesViewGame.imagePxSoccer}                   
                                                                source={require('./SoccerField.png')}/>
                                                                {this.state.EventFieldLocations.map((data) => {
                                                                    return (
                                                                    <View 
                                                                        style={{
                                                                        position: 'absolute',
                                                                        left: data.x,
                                                                        top: data.y,
                                                                        backgroundColor:'#242424',
                                                                        width: 10,
                                                                        height: 10,
                                                                        borderWidth:2,
                                                                        borderColor:'#C30000',
                                                                        borderRadius: 50
                                                                        }}>
                                                                    </View> 
                                                            
                                                                )
                                                            })} 
                                
                                                        </ScrollView>
                                                    </ScrollView>

                                                </ScrollView>
                        
                                                );
                                            }
            
                                    
            
                                        }
                                        else
                                        {
            
                                            if(screenWidth < 600 || screenHeight < 376)
                                            {
                                                alert('Warning - This device is too small to display the full image. Please scroll across the image to navigate or use a larger device screen size.');
            
                                        
                                                FieldWithPlots = (
                                                    <ScrollView>
                                                    
                                                    <ScrollView horizontal={true} style={stylesViewGame.imagePlotContainer}>
                                                    
                                                        <View style={stylesViewGame.EventContainer}>
                                                            <Text style={stylesViewGame.buttonTitle}> Event Type: {YourTeamEventSelection}</Text>
                                                        </View>

                                                        <View style={stylesViewGame.ColumnContainer}>
                                                            <TouchableOpacity style={stylesViewGame.button} onPress = {this.GoToMainMenu}>
                                                                <Text style={stylesViewGame.buttonTitle}>Back to Main Menu</Text>
                                                            </TouchableOpacity>
                                                        </View>
                            
                                                        <View style={stylesViewGame.ColumnContainer}>
                                                            <TouchableOpacity style={stylesViewGame.button} onPress = {this.GoToViewGameMenu}>
                                                                <Text style={stylesViewGame.buttonTitle}>Back to View Game Menu</Text>
                                                            </TouchableOpacity>
                                                        </View>

                                                    </ScrollView>

                                                    <ScrollView horizontal={true} style={stylesViewGame.imagePlotContainer}>
            
                                                    <ScrollView>
                                                                
                                                    <Image style ={stylesViewGame.imageSoccerMobile}                   
                                                                source={require('./SoccerField.png')}/>
                                                                {this.state.EventFieldLocations.map((data) => {
                                                                    return (
                                                                    <View 
                                                                        style={{
                                                                        position: 'absolute',
                                                                        left: data.x,
                                                                        top: data.y,
                                                                        backgroundColor:'#242424',
                                                                        width: 10,
                                                                        height: 10,
                                                                        borderWidth:2,
                                                                        borderColor:'#C30000',
                                                                        borderRadius: 50
                                                                        }}>
                                                                    </View> 
                                                            
                                                                )
                                                            })} 
                                
                                                        </ScrollView>
                                                    </ScrollView>

                                                </ScrollView>
                                                );
            
                                            }
            
                                        
                                            FieldWithPlots = (
            
                                
                                                <ScrollView>
                                                    
                                                <ScrollView horizontal={true} style={stylesViewGame.imagePlotContainer}>
                                                
                                                    <View style={stylesViewGame.EventContainer}>
                                                        <Text style={stylesViewGame.buttonTitle}> Event Type: {YourTeamEventSelection}</Text>
                                                    </View>

                                                    <View style={stylesViewGame.ColumnContainer}>
                                                        <TouchableOpacity style={stylesViewGame.button} onPress = {this.GoToMainMenu}>
                                                            <Text style={stylesViewGame.buttonTitle}>Back to Main Menu</Text>
                                                        </TouchableOpacity>
                                                    </View>
                        
                                                    <View style={stylesViewGame.ColumnContainer}>
                                                        <TouchableOpacity style={stylesViewGame.button} onPress = {this.GoToViewGameMenu}>
                                                            <Text style={stylesViewGame.buttonTitle}>Back to View Game Menu</Text>
                                                        </TouchableOpacity>
                                                    </View>

                                                </ScrollView>

                                                <ScrollView horizontal={true} style={stylesViewGame.imagePlotContainer}>
        
                                                <ScrollView>
                                                            
                                                <Image style ={stylesViewGame.imagePxSoccer}                   
                                                            source={require('./SoccerField.png')}/>
                                                            {this.state.EventFieldLocations.map((data) => {
                                                                return (
                                                                <View 
                                                                    style={{
                                                                    position: 'absolute',
                                                                    left: data.x,
                                                                    top: data.y,
                                                                    backgroundColor:'#242424',
                                                                    width: 10,
                                                                    height: 10,
                                                                    borderWidth:2,
                                                                    borderColor:'#C30000',
                                                                    borderRadius: 50
                                                                    }}>
                                                                </View> 
                                                        
                                                            )
                                                        })} 
                            
                                                    </ScrollView>
                                                </ScrollView>

                                            </ScrollView>
                                            );
                                        }
            
            
            
                                }
                              
                }





                if(OpponentsSpecificStatFieldEvents == true)
                {
                          //Condition to check if the Device is smaller than the image so for mobile view we check the StatsStoredUsingScreenWidth  
                        //if screenwidth < StatsStoredUsingScreenWidth || screenHeight < StatsStoredUsingScreenHeight
                            //Then alert the user that this maybe be inaccurate . please try a larger device screen size e.g web version
                                //ScrollView possibly for mobile

                                if(SportType == 'GAA')
                                {
            
                                    if(screenWidth != this.state.StatsStoredUsingScreenWidth && screenHeight != this.state.StatsStoredUsingScreenHeight)
                                    {
                                        
                                            if(screenWidth < 600 || screenHeight < 376)
                                            {
                                                alert('Warning - This device is too small to display the full image. Please scroll across the image to navigate or use a larger device screen size.');
            
                                                FieldWithPlots = (
                                               
                                                    <ScrollView>
                                                    
                                                    <ScrollView horizontal={true} style={stylesViewGame.imagePlotContainer}>
                                                    
                                                        <View style={stylesViewGame.EventContainer}>
                                                            <Text style={stylesViewGame.buttonTitle}> Event Type: {YourTeamEventSelection}</Text>
                                                        </View>

                                                        <View style={stylesViewGame.ColumnContainer}>
                                                            <TouchableOpacity style={stylesViewGame.button} onPress = {this.GoToMainMenu}>
                                                                <Text style={stylesViewGame.buttonTitle}>Back to Main Menu</Text>
                                                            </TouchableOpacity>
                                                        </View>
                            
                                                        <View style={stylesViewGame.ColumnContainer}>
                                                            <TouchableOpacity style={stylesViewGame.button} onPress = {this.GoToViewGameMenu}>
                                                                <Text style={stylesViewGame.buttonTitle}>Back to View Game Menu</Text>
                                                            </TouchableOpacity>
                                                        </View>

                                                    </ScrollView>

                                                    <ScrollView horizontal={true} style={stylesViewGame.imagePlotContainer}>
            
                                                    <ScrollView>
                                                                
                                                                <Image style ={stylesViewGame.imagePxGAA}                        
                                                                source={require('./GAApitch1.png')}/>
                                                                {this.state.OpponentsEventFieldLocations.map((data) => {
                                                                    return (
                                                                    <View 
                                                                        style={{
                                                                        position: 'absolute',
                                                                        left: data.x,
                                                                        top: data.y,
                                                                        backgroundColor:'#242424',
                                                                        width: 10,
                                                                        height: 10,
                                                                        borderWidth:2,
                                                                        borderColor:'#C30000',
                                                                        borderRadius: 50
                                                                        }}>
                                                                    </View> 
                                                            
                                                                )
                                                            })} 
                                
                                                        </ScrollView>
                                                    </ScrollView>

                                                </ScrollView>
                            
                        
                        
                                                );
            
            
            
                                            } 
                                            else 
                                            {
                                      
                                                FieldWithPlots = (
            
                                                    <ScrollView>
                                                    
                                                    <ScrollView horizontal={true} style={stylesViewGame.imagePlotContainer}>
                                                    
                                                        <View style={stylesViewGame.EventContainer}>
                                                            <Text style={stylesViewGame.buttonTitle}> Event Type: {YourTeamEventSelection}</Text>
                                                        </View>

                                                        <View style={stylesViewGame.ColumnContainer}>
                                                            <TouchableOpacity style={stylesViewGame.button} onPress = {this.GoToMainMenu}>
                                                                <Text style={stylesViewGame.buttonTitle}>Back to Main Menu</Text>
                                                            </TouchableOpacity>
                                                        </View>
                            
                                                        <View style={stylesViewGame.ColumnContainer}>
                                                            <TouchableOpacity style={stylesViewGame.button} onPress = {this.GoToViewGameMenu}>
                                                                <Text style={stylesViewGame.buttonTitle}>Back to View Game Menu</Text>
                                                            </TouchableOpacity>
                                                        </View>

                                                    </ScrollView>

                                                    <ScrollView horizontal={true} style={stylesViewGame.imagePlotContainer}>
            
                                                    <ScrollView>
                                                                
                                                                <Image style ={stylesViewGame.imagePxGAA}                        
                                                                source={require('./GAApitch1.png')}/>
                                                                {this.state.OpponentsEventFieldLocations.map((data) => {
                                                                    return (
                                                                    <View 
                                                                        style={{
                                                                        position: 'absolute',
                                                                        left: data.x,
                                                                        top: data.y,
                                                                        backgroundColor:'#242424',
                                                                        width: 10,
                                                                        height: 10,
                                                                        borderWidth:2,
                                                                        borderColor:'#C30000',
                                                                        borderRadius: 50
                                                                        }}>
                                                                    </View> 
                                                            
                                                                )
                                                            })} 
                                
                                                        </ScrollView>
                                                    </ScrollView>

                                                </ScrollView>
                                            
                                                );
            
                                            }
                                   
            
                        
            
            
                                    }   
            
                                    else
                                    {
            
            
            
                                        if(screenWidth < 600 || screenHeight < 376)
                                        {
                
                                            alert('Warning - This device is too small to display the full image. Please scroll across the image to navigate or use a larger device screen size.');
                                            
                                            FieldWithPlots = (
            
                                
                                    
                                                <ScrollView>
                                                    
                                                    <ScrollView horizontal={true} style={stylesViewGame.imagePlotContainer}>
                                                    
                                                        <View style={stylesViewGame.EventContainer}>
                                                            <Text style={stylesViewGame.buttonTitle}> Event Type: {YourTeamEventSelection}</Text>
                                                        </View>

                                                        <View style={stylesViewGame.ColumnContainer}>
                                                            <TouchableOpacity style={stylesViewGame.button} onPress = {this.GoToMainMenu}>
                                                                <Text style={stylesViewGame.buttonTitle}>Back to Main Menu</Text>
                                                            </TouchableOpacity>
                                                        </View>
                            
                                                        <View style={stylesViewGame.ColumnContainer}>
                                                            <TouchableOpacity style={stylesViewGame.button} onPress = {this.GoToViewGameMenu}>
                                                                <Text style={stylesViewGame.buttonTitle}>Back to View Game Menu</Text>
                                                            </TouchableOpacity>
                                                        </View>

                                                    </ScrollView>

                                                    <ScrollView horizontal={true} style={stylesViewGame.imagePlotContainer}>
            
                                                    <ScrollView>
                                                                
                                                                <Image style ={stylesViewGame.imagePxGAA}                        
                                                                source={require('./GAApitch1.png')}/>
                                                                {this.state.OpponentsEventFieldLocations.map((data) => {
                                                                    return (
                                                                    <View 
                                                                        style={{
                                                                        position: 'absolute',
                                                                        left: data.x,
                                                                        top: data.y,
                                                                        backgroundColor:'#242424',
                                                                        width: 10,
                                                                        height: 10,
                                                                        borderWidth:2,
                                                                        borderColor:'#C30000',
                                                                        borderRadius: 50
                                                                        }}>
                                                                    </View> 
                                                            
                                                                )
                                                            })} 
                                
                                                        </ScrollView>
                                                    </ScrollView>

                                                </ScrollView>
                            
                                            );
                                        }
            
                                        FieldWithPlots = (
            
                                
                                    
                                           <ScrollView>
                                                    
                                                    <ScrollView horizontal={true} style={stylesViewGame.imagePlotContainer}>
                                                    
                                                        <View style={stylesViewGame.EventContainer}>
                                                            <Text style={stylesViewGame.buttonTitle}> Event Type: {YourTeamEventSelection}</Text>
                                                        </View>

                                                        <View style={stylesViewGame.ColumnContainer}>
                                                            <TouchableOpacity style={stylesViewGame.button} onPress = {this.GoToMainMenu}>
                                                                <Text style={stylesViewGame.buttonTitle}> Back to Main Menu</Text>
                                                            </TouchableOpacity>
                                                        </View>
                            
                                                        <View style={stylesViewGame.ColumnContainer}>
                                                            <TouchableOpacity style={stylesViewGame.button} onPress = {this.GoToViewGameMenu}>
                                                                <Text style={stylesViewGame.buttonTitle}>Back to View Game Menu</Text>
                                                            </TouchableOpacity>
                                                        </View>

                                                    </ScrollView>

                                                    <ScrollView horizontal={true} style={stylesViewGame.imagePlotContainer}>
            
                                                 
                                                                <Image style ={stylesViewGame.imagePxGAA}                        
                                                                source={require('./GAApitch1.png')}/>
                                                                {this.state.OpponentsEventFieldLocations.map((data) => {
                                                                    return (
                                                                    <View 
                                                                        style={{
                                                                        position: 'absolute',
                                                                        left: data.x,
                                                                        top: data.y,
                                                                        backgroundColor:'#242424',
                                                                        width: 10,
                                                                        height: 10,
                                                                        borderWidth:2,
                                                                        borderColor:'#C30000',
                                                                        borderRadius: 50
                                                                        }}>
                                                                    </View> 
                                                            
                                                                )
                                                            })} 
                                
                                                      
                                                    </ScrollView>

                                                </ScrollView>
            
                                        );
            
                                    }   
            
                                }
                                else if(SportType == 'Soccer')
                                {
            
                                        if(screenWidth != this.state.StatsStoredUsingScreenWidth && screenHeight != this.state.StatsStoredUsingScreenHeight)
                                        {
            
                                            if(screenWidth < 600 || screenHeight < 376)
                                            {
                                                alert('Warning - This device is too small to display the full image. Please scroll across the image to navigate or use a larger device screen size.');
            
                                        
                                                FieldWithPlots = (
                                          
                                                    <ScrollView>
                                                    
                                                    <ScrollView horizontal={true} style={stylesViewGame.imagePlotContainer}>
                                                    
                                                        <View style={stylesViewGame.EventContainer}>
                                                            <Text style={stylesViewGame.buttonTitle}> Event Type: {YourTeamEventSelection}</Text>
                                                        </View>

                                                        <View style={stylesViewGame.ColumnContainer}>
                                                            <TouchableOpacity style={stylesViewGame.button} onPress = {this.GoToMainMenu}>
                                                                <Text style={stylesViewGame.buttonTitle}>Back to Main Menu</Text>
                                                            </TouchableOpacity>
                                                        </View>
                            
                                                        <View style={stylesViewGame.ColumnContainer}>
                                                            <TouchableOpacity style={stylesViewGame.button} onPress = {this.GoToViewGameMenu}>
                                                                <Text style={stylesViewGame.buttonTitle}>Back to View Game Menu</Text>
                                                            </TouchableOpacity>
                                                        </View>

                                                    </ScrollView>

                                                    <ScrollView horizontal={true} style={stylesViewGame.imagePlotContainer}>
            
                                                    <ScrollView>
                                                                
                                                    <Image style ={stylesViewGame.imagePxSoccer}                   
                                                                source={require('./SoccerField.png')}/>
                                                                {this.state.OpponentsEventFieldLocations.map((data) => {
                                                                    return (
                                                                    <View 
                                                                        style={{
                                                                        position: 'absolute',
                                                                        left: data.x,
                                                                        top: data.y,
                                                                        backgroundColor:'#242424',
                                                                        width: 10,
                                                                        height: 10,
                                                                        borderWidth:2,
                                                                        borderColor:'#C30000',
                                                                        borderRadius: 50
                                                                        }}>
                                                                    </View> 
                                                            
                                                                )
                                                            })} 
                                
                                                        </ScrollView>
                                                    </ScrollView>

                                                </ScrollView>
                            





                                                );
            
                                            }
                                            else
                                            {
            
            
            
                                                FieldWithPlots = (
            
                                                    <ScrollView>
                                                    
                                                    <ScrollView horizontal={true} style={stylesViewGame.imagePlotContainer}>
                                                    
                                                        <View style={stylesViewGame.EventContainer}>
                                                            <Text style={stylesViewGame.buttonTitle}> Event Type: {YourTeamEventSelection}</Text>
                                                        </View>

                                                        <View style={stylesViewGame.ColumnContainer}>
                                                            <TouchableOpacity style={stylesViewGame.button} onPress = {this.GoToMainMenu}>
                                                                <Text style={stylesViewGame.buttonTitle}>Back to Main Menu</Text>
                                                            </TouchableOpacity>
                                                        </View>
                            
                                                        <View style={stylesViewGame.ColumnContainer}>
                                                            <TouchableOpacity style={stylesViewGame.button} onPress = {this.GoToViewGameMenu}>
                                                                <Text style={stylesViewGame.buttonTitle}>Back to View Game Menu</Text>
                                                            </TouchableOpacity>
                                                        </View>

                                                    </ScrollView>

                                                    <ScrollView horizontal={true} style={stylesViewGame.imagePlotContainer}>
            
                                                    <ScrollView>
                                                                
                                                    <Image style ={stylesViewGame.imagePxSoccer}                   
                                                                source={require('./SoccerField.png')}/>
                                                                {this.state.OpponentsEventFieldLocations.map((data) => {
                                                                    return (
                                                                    <View 
                                                                        style={{
                                                                        position: 'absolute',
                                                                        left: data.x,
                                                                        top: data.y,
                                                                        backgroundColor:'#242424',
                                                                        width: 10,
                                                                        height: 10,
                                                                        borderWidth:2,
                                                                        borderColor:'#C30000',
                                                                        borderRadius: 50
                                                                        }}>
                                                                    </View> 
                                                            
                                                                )
                                                            })} 
                                
                                                        </ScrollView>
                                                    </ScrollView>

                                                </ScrollView>
                        
                                                );
                                            }
            
                                    
            
                                        }
                                        else
                                        {
            
                                            if(screenWidth < 600 || screenHeight < 376)
                                            {
                                                alert('Warning - This device is too small to display the full image. Please scroll across the image to navigate or use a larger device screen size.');
            
                                        
                                                FieldWithPlots = (
                                                    <ScrollView>
                                                    
                                                    <ScrollView horizontal={true} style={stylesViewGame.imagePlotContainer}>
                                                    
                                                        <View style={stylesViewGame.EventContainer}>
                                                            <Text style={stylesViewGame.buttonTitle}> Event Type: {YourTeamEventSelection}</Text>
                                                        </View>

                                                        <View style={stylesViewGame.ColumnContainer}>
                                                            <TouchableOpacity style={stylesViewGame.button} onPress = {this.GoToMainMenu}>
                                                                <Text style={stylesViewGame.buttonTitle}>Back to Main Menu</Text>
                                                            </TouchableOpacity>
                                                        </View>
                            
                                                        <View style={stylesViewGame.ColumnContainer}>
                                                            <TouchableOpacity style={stylesViewGame.button} onPress = {this.GoToViewGameMenu}>
                                                                <Text style={stylesViewGame.buttonTitle}>Back to View Game Menu</Text>
                                                            </TouchableOpacity>
                                                        </View>

                                                    </ScrollView>

                                                    <ScrollView horizontal={true} style={stylesViewGame.imagePlotContainer}>
            
                                                    <ScrollView>
                                                                
                                                    <Image style ={stylesViewGame.imageSoccerMobile}                   
                                                                source={require('./SoccerField.png')}/>
                                                                {this.state.OpponentsEventFieldLocations.map((data) => {
                                                                    return (
                                                                    <View 
                                                                        style={{
                                                                        position: 'absolute',
                                                                        left: data.x,
                                                                        top: data.y,
                                                                        backgroundColor:'#242424',
                                                                        width: 10,
                                                                        height: 10,
                                                                        borderWidth:2,
                                                                        borderColor:'#C30000',
                                                                        borderRadius: 50
                                                                        }}>
                                                                    </View> 
                                                            
                                                                )
                                                            })} 
                                
                                                        </ScrollView>
                                                    </ScrollView>

                                                </ScrollView>
                                                );
            
                                            }
            
                                        
                                            FieldWithPlots = (
            
                                
                                                <ScrollView>
                                                    
                                                <ScrollView horizontal={true} style={stylesViewGame.imagePlotContainer}>
                                                
                                                    <View style={stylesViewGame.EventContainer}>
                                                        <Text style={stylesViewGame.buttonTitle}> Event Type: {YourTeamEventSelection}</Text>
                                                    </View>

                                                    <View style={stylesViewGame.ColumnContainer}>
                                                        <TouchableOpacity style={stylesViewGame.button} onPress = {this.GoToMainMenu}>
                                                            <Text style={stylesViewGame.buttonTitle}>Back to Main Menu</Text>
                                                        </TouchableOpacity>
                                                    </View>
                        
                                                    <View style={stylesViewGame.ColumnContainer}>
                                                        <TouchableOpacity style={stylesViewGame.button} onPress = {this.GoToViewGameMenu}>
                                                            <Text style={stylesViewGame.buttonTitle}>Back to View Game Menu</Text>
                                                        </TouchableOpacity>
                                                    </View>

                                                </ScrollView>

                                                <ScrollView horizontal={true} style={stylesViewGame.imagePlotContainer}>
        
                                                <ScrollView>
                                                            
                                                <Image style ={stylesViewGame.imagePxSoccer}                   
                                                            source={require('./SoccerField.png')}/>
                                                            {this.state.OpponentsEventFieldLocations.map((data) => {
                                                                return (
                                                                <View 
                                                                    style={{
                                                                    position: 'absolute',
                                                                    left: data.x,
                                                                    top: data.y,
                                                                    backgroundColor:'#242424',
                                                                    width: 10,
                                                                    height: 10,
                                                                    borderWidth:2,
                                                                    borderColor:'#C30000',
                                                                    borderRadius: 50
                                                                    }}>
                                                                </View> 
                                                        
                                                            )
                                                        })} 
                            
                                                    </ScrollView>
                                                </ScrollView>

                                            </ScrollView>
                                            );
                                        }
            
            
            
                        }

                }



            return (
 

                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', backgroundColor: '#252626', alignItems: "center", fontSize: 20}}>

                    <View>
                        {ReviewSelection}  
                    </View>
                        
                    <View>
                        {FieldWithPlots}
                    </View>

                    
                    <View>
                        {ReviewGameStats}
                    </View>

                    
                    <View>
                        {ReviewPlayerStats}
                    </View>

                    
                    <View>
                        {PlayerStats}
                    </View>

                </ScrollView>
        
                      

                       


            )

        }
}


const stylesViewGame = StyleSheet.create({
    container: {
  
    
        fontSize: 20,
       
    },
    dataContainer: {
        // height: hp('50%'), // 70% of height device screen
        width: wp('80%') ,  // % of width device screen
        // backgroundColor: '#424242', 
        alignItems: "center",
        borderWidth: 4,
        borderColor:'#ffffff',
 
        marginBottom:10
    },
    Text:{
        color: "black",
        fontSize:18,
        justifyContent:'center',

    },

    ColumnContainer:{
        flex:1,
        flexDirection:"row",
        justifyContent:'center'
    },

    headerContainer:{ 

        backgroundColor: '#C30000',
        alignItems: "center",
        borderWidth: 4,
        borderRadius: 20,
        borderColor:'#ffffff',
        alignItems: 'center',
        width: wp('80%') ,  // % of width device screen
        marginTop:30,
        padding:4,
  
    },


    StatRow: {
        flex:1,
        flexDirection:"row",
        alignItems: "center",
        marginBottom:10,
        borderWidth: 4,
        borderRadius: 20,
        backgroundColor: "#33343F",
        borderColor:'#ffffff',
    },

    StatColumn: {
        flex:1,
        flexDirection:"column",
        padding: 50,
        marginBottom:10,

  

    },
    dcontainer: {
        backgroundColor: '#C30000',
        height:'100%',
        alignItems: "center",
        fontSize: 20,
       
    },

    StatRow: {
        flex:1,
        flexDirection:"row",
        borderWidth: 4,
        borderRadius: 20,
        borderColor:'#ffffff',
        alignItems: "center",
        marginBottom:10,
        backgroundColor: "#33343F",
    },


    StatText: {
        color: "black",
        fontSize:18,
        justifyContent:'center',
        fontWeight: "bold",
        
    },

    StatTextWhite: {
        color: "white",
        fontSize:18,
        textAlign: 'center',
        justifyContent:'center',
        fontWeight: "bold",
     
    },

    text:{
        color: "white",
        fontSize:18,
        fontWeight: "bold",
    },


    dataContainer: {
        backgroundColor: '#ffffff', 
        alignItems: 'center',
        
    },
    container2: {
        backgroundColor: '#ffffff', 
        alignItems: 'center',
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

    EventContainer:{
        flex:1,
        flexDirection:"row",
        justifyContent:'center',
        marginLeft: 30,
        marginRight: 30,
        marginTop: 20,
        height: 48,
    },

    button: {
        backgroundColor: '#C30000',
        marginLeft: 30,
        marginRight: 30,
        marginTop: 20,
        height: 48,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: 'center',
        width: '100%'
    },

    buttonTitle: {
        color:'white',
        fontSize:18,
        justifyContent:'center',
        textAlign: 'center',
        fontWeight: "bold",
    },

  
    
    imagePxGAA:{
    
        height:376,
        width:700,
  
        
     },

     imagePxGAAmobile:{
    
        height:300,
        width:590,
   
     
     },


    imagePxSoccer:{
        height:400,
        width: 700,

    },
    
   
    imageSoccerMobile:
    {
        
            height:280,
            width: 480,
        
    },
   
  

    imagePlotContainer: {

    
        flexWrap: 'wrap',
        flexDirection:"row",

        marginTop:10,
        paddingTop:10,
        paddingBottom:20,
        backgroundColor: "#33343F",
        borderRadius:10,
        borderWidth: 1,
        borderColor: '#fff',


       

    },

    imageColumn:{
        flexWrap: 'wrap',
        flexDirection:"column",


        marginLeft: 5,
        // marginRight: 30,
        marginTop: 10,
        height: 48,
        borderRadius: 5,

        // alignItems: "center",
        // justifyContent: 'center'
    },

    imageheaderContainer:{

      
        marginRight:40,
        marginLeft:40,
        marginTop:10,
        paddingTop:20,
        paddingBottom:20,
        backgroundColor:'#68a0cf',
        borderRadius:10,
        borderWidth: 1,
        borderColor: '#fff',
        width: '100%',

    },

    imageGAA:{
        width: win.width,
        height: 300 * ratioGaaView, //399 is actual height of image
    
    
    },
    
    
    imageSoccer:{
        width: win.width,
        height: 376 * ratioSoccerView , //399 is actual height of image
        top: '20%'
    
    },
    
    

});

export default ViewGame;