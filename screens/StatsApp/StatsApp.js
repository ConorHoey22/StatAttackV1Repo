import React, { useEffect, useState , Component  } from 'react'
import { Picker, ImageBackground,Dimensions,StatusBar,TouchableOpacity,StyleSheet,Image,FlatList, Keyboard, Text, View , TextInput , Alert, SegmentedControlIOSComponent , ScrollView, VirtualizedList, TouchableNativeFeedbackBase} from 'react-native'





import firebase from 'firebase/app'
import 'firebase/auth';
import 'firebase/database';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';



let padToTwo = (number) => (number <= 9 ? `0${number}`: number);




import { CommonActions, useNavigation } from '@react-navigation/native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { cond } from 'react-native-reanimated';


const screenWidth = Dimensions.get('window').width;

const screenHeight = Dimensions.get('window').height;


const win = Dimensions.get('window');


const ratioView = win.width/590;


const SoccerRatioView = win.width/700;





class StatsApp extends Component {

    constructor(props) {
        super(props);
        this.state = { 

          x:0,
          y:0,
          //All Stats  holder array
          StatsHolder:[],

          //Selected individual Player Stats Array (Your Team)
          SelectedPlayerArray: [],

          //Selected Individual Player Stats Array (Opponents Team)
          SelectedOpponentsPlayerArray: [],

          //Opponentname
          OpponentsName:'',
          TeamName:'',

          OpponentsMode:false,
          YourTeamMode:true,


          //Total Team Stats + Events Array
          TotalTeamStats:[],
          GoalsArray:[],
          PassesArray:[],


          //DisplayTotalTeamStats
          totalTeamGoals: 0,
          totalTeamPoints: 0,
          totalTeamPasses: 0,
          totalTeamShots:0,
          totalTeamShotsOnTarget:0,


          //DisplayTotalOpponentsTeamStats
          totalOpponentsTeamGoals: 0,
          totalOpponentsTeamPoints:0,
          totalOpponentsTeamPasses: 0,
          totalOpponentsTeamShots:0,
          totalOpponentsTeamShotsOnTarget:0,

        

          EventTimestamp: '',


          //Game Record Key
          GameRecordKey:'',  
          OpponentsRecordKey:'',

          //TeamCounters Stats
          Goals:0,
          Passes:0,
          Shots:0,
          ShotsOnTarget:0,
          Points:0,

          //GAA Team Scoreboard
          UsersTeamGAAGoalCounter: 0,
          UsersTeamGAAPointCounter: 0,

          OpponentsTeamGAAGoalCounter: 0,
          OpponentsTeamGAAPointCounter: 0,

          //Soccer Team Scoreboard
          UsersTeamSoccerGoalCounter: 0,
          OpponentsTeamSoccerGoalCounter: 0,

  
    

          //Storage for players selected
          TeamsheetArray: [],
          StartingTeamArray:[],
          SubBenchArray:[],

          OpponentsTeamsheetArray:[],
          OpponentsStartingTeamArray:[],
          OpponentsSubBenchArray:[],
          

          //Stat taking selection variables
          SportType:'',
          selectedPlayerKitNumber:'',
          selectedSubPlayerKitNumber:'',
          selectedOpponentsPlayerKitNumber:'',
          selectedOpponentsSubPlayerKitNumber:'',
          selectedEventType:'',


          //Field Position
          EventFieldPositions:[], // {x: , y; , eventType: '' , Team: '', EventType:'', PlayerKitNumber:}
          OpponentsEventFieldPositions:[], // {x: , y; , eventType: '' , Team: '', EventType:'', PlayerKitNumber:}
          FieldPosition:'',
          xFieldPosition:0,
          yFieldPosition:0,

          //Detailed Analysis
        
          ActivatePlotOnField: false,
          ActivateViewFieldPlots: false,
          DetailedGameAnalysisSelectionView: false,
          ReviewYourTeamEventLocationsView:false,
          TeamSelection:false,
          PlayerEventSelection:false,
          EventPercentages:false,
          selectedYourTeamPlayer:'',
          YourTeamEventSelection:'',
          selectedOpponentPlayer:'',
          OpponentEventSelection:'',
          DetailAnalysisStatHolder:[],
          OpponentsDetailAnalysisStatHolder:[],


          //Frontend Display toggles
          displayFieldPositionSelection:false,
          displaysEventsOnField:false,
          displayEventsContainer:false,
          displayEventHistory:false,
          displayEventPattern:false,
          displayStartingTeam: false,
          displaySubBench: false,
          displayOpponentsStartingTeam: false,
          displayOpponentsSubBench: false,
          ScoreboardContainerToggle: true,

          displayTeamPercentages:false,
          displayOpponentsPercentages:false,


          DetailedGameAnalysisSelectionView:false,

          YourTeamReviewSelection:false,
          OpponentsReviewSelection:false,


          TeamSelection:false,
          OpponentsSelection:false,

       

          TeamEventPercentages:false,
          OpponentsEventPercentages:false,


          displayIndividualPlayerStatsTable:false,

          //Timer
          min: 0,
          sec: 0,
          msec: 0,

          timer: null,
          minutes_Counter: '00',
          seconds_Counter: '00',
          startDisable: false,


          //Scoreboard GAA
          GAAGoalsCounter:0,
          GAAPointsCounter:0,

          //Scoreboard Soccer
          SoccerGoalsCounter:0,


          //Team Event Patterns
          TeamEventPatterns: [],
          TeamEventPatternMessage:'',
          IndividualEventPatternMessage:'',
          EventFieldPositionPatternMessage: '',

          selectedEvent:'',
 

          color: 'green'

        };

        //Timer
        this.interval = null;


    }


     componentDidMount(e){
      
            //Obtain SelectedStarting11 Array of players
            const { state, setParams, navigate } = this.props.navigation;
            const params = state.params || {};


            // Firebase Key for the Game record
            this.setState({GameRecordKey: params.key});

            this.setState({OpponentName: params.OpponentsName});

            // Firebase Key for Opponents Game record 
            this.setState({OpponentsRecordKey: params.opponentsKey});

         
    
            var TeamsheetArray = this.state.TeamsheetArray;
            var StartingTeamArray = this.state.StartingTeamArray;
            var SubBenchArray = this.state.SubBenchArray;

            var OpponentsTeamsheetArray = this.state.OpponentsTeamsheetArray;

            TeamsheetArray = params.data;
            this.setState({TeamsheetArray: params.data});

            OpponentsTeamsheetArray = params.opponentsData;
            this.setState({OpponentsTeamsheetArray: params.opponentsData});


 


            //Maybe need to loop through each start and sub and reset all values
            //  Divide the list of players into 2 Arrays 
            //  StartingTeam and SubBench

            for (var i = 0; i < TeamsheetArray.length; i++) {

                if(TeamsheetArray[i].status === 'StartingTeam')
                {

                    // WE are here , i cant get the full array to display with subbench for some reason , doing the below might work
                    var data = {
                        Goals: TeamsheetArray[i].Goals,
                        Passes: TeamsheetArray[i].Passes,
                        Points: TeamsheetArray[i].Points,
                        Shots: TeamsheetArray[i].Shots,
                        ShotsOnTarget: TeamsheetArray[i].ShotsOnTarget,
                        UserID: TeamsheetArray[i].UserID,
                        fullName: TeamsheetArray[i].fullName,
                        playerKitNumber: TeamsheetArray[i].playerKitNumber,
                        playerPosition: TeamsheetArray[i].playerPosition,
                        status: TeamsheetArray[i].status
                    }

                    this.state.StartingTeamArray.push(data);
                   
                }
                else if(TeamsheetArray[i].status === 'SubBench')
                {
                    var data1 = {
                        Goals: TeamsheetArray[i].Goals,
                        Passes: TeamsheetArray[i].Passes,
                        Points: TeamsheetArray[i].Points,
                        Shots: TeamsheetArray[i].Shots,
                        ShotsOnTarget: TeamsheetArray[i].ShotsOnTarget,
                        UserID: TeamsheetArray[i].UserID,
                        fullName: TeamsheetArray[i].fullName,
                        playerKitNumber: TeamsheetArray[i].playerKitNumber,
                        playerPosition: TeamsheetArray[i].playerPosition,
                        status: TeamsheetArray[i].status
                    }


                    this.state.SubBenchArray.push(data1);

                
                }
         

            }


     

            for (var i = 0; i < OpponentsTeamsheetArray.length; i++) {

                if(OpponentsTeamsheetArray[i].status === 'StartingTeam')
                {
                    var data3 = {
                        Goals:  OpponentsTeamsheetArray[i].Goals,
                        Passes: OpponentsTeamsheetArray[i].Passes,
                        Points: OpponentsTeamsheetArray[i].Points,
                        Shots: OpponentsTeamsheetArray[i].Shots,
                        ShotsOnTarget: OpponentsTeamsheetArray[i].ShotsOnTarget,
                        UserID: OpponentsTeamsheetArray[i].UserID,
                        fullName: OpponentsTeamsheetArray[i].fullName,
                        playerKitNumber: OpponentsTeamsheetArray[i].playerKitNumber,
                        playerPosition: OpponentsTeamsheetArray[i].playerPosition,
                        status: OpponentsTeamsheetArray[i].status
                    };



                    this.state.OpponentsStartingTeamArray.push(data3);
                   
                }
                else if(OpponentsTeamsheetArray[i].status === 'SubBench')
                {

                    var data4 = {
                        Goals: OpponentsTeamsheetArray[i].Goals,
                        Passes: OpponentsTeamsheetArray[i].Passes,
                        Points: OpponentsTeamsheetArray[i].Points,
                        Shots: OpponentsTeamsheetArray[i].Shots,
                        ShotsOnTarget: OpponentsTeamsheetArray[i].ShotsOnTarget,
                        UserID: OpponentsTeamsheetArray[i].UserID,
                        fullName: OpponentsTeamsheetArray[i].fullName,
                        playerKitNumber: OpponentsTeamsheetArray[i].playerKitNumber,
                        playerPosition: OpponentsTeamsheetArray[i].playerPosition,
                        status: OpponentsTeamsheetArray[i].status
                    };

                    this.state.OpponentsSubBenchArray.push(data4);
                }
         

            }

            var myUserId = firebase.auth().currentUser.uid;
              
            //Get the team sport type
                firebase.database().ref('/teams').child(myUserId)
                .on('value', (snapshot) => {

                const teamObj = snapshot.val();

                let SportType = teamObj.SportType;
                this.setState({SportType:SportType});

                let TeamName = teamObj.TeamName;
                this.setState({TeamName:TeamName});

                });

          
 
    
}   

ExitReviewDetailAnalysis = () => {
  // Toggles off all additional frontend that is not needed to proceed
      

  //Sub bench container Appear           
  this.setState({displaySubBench: false});
        
  // Make FieldPosition Disappear
  this.setState({displayFieldPositionSelection:false});

  // Make Event selection disappear 
  this.setState({displayEventsContainer:false});

  //Make Review disappear
  this.setState({displayReviewGameContainer:false});

  // This will make all starting team players appear
  this.setState({displayStartingTeam: true});


  //Opponents Sub Bench to disappear 
  this.setState({displayOpponentsSubBench: false});

  //Opponents starting team players disappear
  this.setState({displayOpponentsStartingTeam:false });

  
  //Disable individual stats table if it true
  this.setState({displayIndividualPlayerStatsTable: false});

  this.setState({displayReviewIndividualSquadPlayer: false});

  this.setState({displayReviewIndividualSubBenchPlayer: false});

  this.setState({displayReviewTotalTeamStatsContainer:false});

  this.setState({displayReviewOpponentsTotalTeamStatsContainer:false});

  this.setState({displayReviewIndividualPlayerStatsContainer:false});

  this.setState({displayReviewYourTeamIndividualPlayerStatsContainer:false})

  this.setState({displayReviewOpponentsIndividualPlayerStatsContainer:false});

  this.setState({displayReviewYourTeamIndividualSquadPlayer:false});
  this.setState({displayReviewOpponentsIndividualSquadPlayer:false});

  this.setState({displayReviewOpponentsIndividualSubBenchPlayer:false});


  this.setState({displayReviewOpponentsIndividualPlayers:false});

  this.setState({ActivateUndoButton:false});

 

          //Team Event Selection - Detailed Game analysis
          this.setState({TeamSelection: false});

          this.setState({DetailedGameAnalysisSelectionView:false});
          this.setState({YourTeamReviewSelection:false});
          this.setState({OpponentsReviewSelection: false});

          this.setState({TeamSelection: false});
          this.setState({OpponentEventSelection:false});

          //Detailed Review Player buttons
          this.setState({displayDetailedIndividualSquadPlayer:false});
          this.setState({displayDetailedIndividualSubBenchPlayer:false});
  
          this.setState({displayDetailedIndividualSquadPlayerEventSelection: false});
          this.setState({displayDetailedIndividualSubBenchEventSelection:false});

          
          this.setState({displayDetailedIndividualOpponentsSquadPlayerEventSelection:false});
          this.setState({displayDetailedIndividualOpponentsSubBenchEventSelection:false});


         
          this.setState({ExecuteTeamDetailAnalysisView:false});
          this.setState({ExecuteDetailOpponentsTeamAnalysis: false});

          this.setState({ExecuteOpponentsTeamDetailAnalysis:false});



          this.setState({EventSelectionTeamDetailAnalysis:false});
          this.setState({ExecuteSubBenchDetailAnalysis:false});
          this.setState({EventSelectionOpponentsDetailAnalysis:false});
          
          this.setState({TeamEventPercentages:false});
          this.setState({OpponentsEventPercentages:false});
          this.setState({ExecuteOpponentsDetailAnalysis:false});
          this.setState({ExecuteOpponentsSubBenchDetailAnalysis:false});

          //Detail Percentages
          this.setState({TeamEventPercentages:false});
          this.setState({OpponentsEventPercentages:false});



          //makes Event History display
          this.setState({
              displayEventHistory: true
          });

          //makes Event Pattern display
          this.setState({
              displayEventPattern: true
          });


          //display field View
          this.setState({ActivateViewFieldPlots:false});    

          this.setState({ExecuteDetailAnalysis:false});


         this.setState({ExecuteOpponentsDetailAnalysis:false});


        //Toggle On Scoreboard as it gets turned off during this view
        this.setState({ScoreboardContainerToggle:true});
        

    }



    
    


    onButtonStart = () => {
 

        let timer = setInterval(() => {
     
          var num = (Number(this.state.seconds_Counter) + 1).toString(),
            count = this.state.minutes_Counter;
     
          if (Number(this.state.seconds_Counter) == 59) {
            count = (Number(this.state.minutes_Counter) + 1).toString();
            num = '00';
          }
     
          this.setState({
            minutes_Counter: count.length == 1 ? '0' + count : count,
            seconds_Counter: num.length == 1 ? '0' + num : num
          });
        }, 1000);

        this.setState({ timer });
     
        this.setState({startDisable : true})

      




        //Sub bench container Appear           
        this.setState({displaySubBench: false});
        
        // Make FieldPosition Disappear
        this.setState({displayFieldPositionSelection:false});

        // Make Event selection disappear 
        this.setState({displayEventsContainer:false});

        //Make Review disappear
        this.setState({displayReviewGameContainer:false});

        // This will make all starting team players appear
        this.setState({displayStartingTeam: true});


        //Opponents Sub Bench to disappear 
        this.setState({displayOpponentsSubBench: false});

        //Opponents starting team players disappear
        this.setState({displayOpponentsStartingTeam:false });
 
        
        //Disable individual stats table if it true
        this.setState({displayIndividualPlayerStatsTable: false});

        this.setState({displayReviewIndividualSquadPlayer: false});

        this.setState({displayReviewIndividualSubBenchPlayer: false});

        this.setState({displayReviewTotalTeamStatsContainer:false});

        this.setState({displayReviewOpponentsTotalTeamStatsContainer:false});

        this.setState({displayReviewIndividualPlayerStatsContainer:false});

        this.setState({displayReviewYourTeamIndividualPlayerStatsContainer:false})

        this.setState({displayReviewOpponentsIndividualPlayerStatsContainer:false});

        this.setState({displayReviewYourTeamIndividualSquadPlayer:false});
        this.setState({displayReviewOpponentsIndividualSquadPlayer:false});

        this.setState({displayReviewOpponentsIndividualSubBenchPlayer:false});


        this.setState({displayReviewOpponentsIndividualPlayers:false});

        this.setState({ActivateUndoButton:false});

       
     
                //Team Event Selection - Detailed Game analysis
                this.setState({TeamSelection: false});
     
                this.setState({DetailedGameAnalysisSelectionView:false});
                this.setState({YourTeamReviewSelection:false});
                this.setState({OpponentsReviewSelection: false});

                this.setState({TeamSelection: false});
                this.setState({OpponentEventSelection:false});

                //Detailed Review Player buttons
                this.setState({displayDetailedIndividualSquadPlayer:false});
                this.setState({displayDetailedIndividualSubBenchPlayer:false});
        
                this.setState({displayDetailedIndividualSquadPlayerEventSelection: false});
                this.setState({displayDetailedIndividualSubBenchEventSelection:false});

                
                this.setState({displayDetailedIndividualOpponentsSquadPlayerEventSelection:false});
                this.setState({displayDetailedIndividualOpponentsSubBenchEventSelection:false});


               
                this.setState({ExecuteDetailAnalysis:false});
                this.setState({ExecuteSubBenchDetailAnalysis:false});

                this.setState({ExecuteOpponentsDetailAnalysis:false});
                this.setState({ExecuteOpponentsSubBenchDetailAnalysis:false});

                //Detail Percentages
                this.setState({TeamEventPercentages:false});
                this.setState({OpponentsEventPercentages:false});

     

                //makes Event History display
                this.setState({
                    displayEventHistory: true
                });

                //makes Event Pattern display
                this.setState({
                    displayEventPattern: true
                });


                //display field View
                this.setState({ActivateViewFieldPlots:false});    


              
                
      }

      

        onButtonStop = () => {
            clearInterval(this.state.timer);
            this.setState({startDisable : false});

            this.setState({ActivateUndoButton:false});

        //Sub bench container Appear           
        this.setState({displaySubBench: false});
        
        // Make FieldPosition Disappear
        this.setState({displayFieldPositionSelection:false});

        // Make Event selection disappear 
        this.setState({displayEventsContainer:false});

        // This will make all starting team players disappear
        this.setState({displayStartingTeam: false});

         //This will make all review frontend disappear
        this.setState({displayReviewIndividualSubBenchPlayer: false});   

        this.setState({displayReviewIndividualSquadPlayer:false});

        

        }

        onButtonClear = () => {
            this.setState({
            timer: null,
            minutes_Counter: '00',
            seconds_Counter: '00',
            });


        //Sub bench container Appear           
        this.setState({displaySubBench: false});
        
        // Make FieldPosition Disappear
        this.setState({displayFieldPositionSelection:false});

        // Make Event selection disappear 
        this.setState({displayEventsContainer:false});

        // This will make all starting team players disappear
        this.setState({displayStartingTeam: true});

         //This will make all review frontend disappear
        this.setState({displayReviewIndividualSubBenchPlayer: false});   

        this.setState({displayReviewIndividualSquadPlayer:false});
        this.setState({ActivateUndoButton:false});
        



    }

    GetOpponentsPlayers  = () => {

        //Activate Opponents Mode
        this.setState({OpponentsMode: true});

        //Deactivate YourTeam Mode
        this.setState({YourTeamMode: false});


        // This will make all starting team players disappear
        this.setState({displayOpponentsStartingTeam: true });

        // This will make all starting team players disappear
        this.setState({displayStartingTeam: false});
    }


    GetYourTeamPlayers  = () => {

        //Deactivate Opponents Mode
        this.setState({OpponentsMode: false});

        //Activate YourTeam Mode
        this.setState({YourTeamMode: true});

        //This will make all starting team players disappear
        this.setState({displayOpponentsStartingTeam: false });

        //This will make all starting team players disappear
        this.setState({displayStartingTeam: true});
    }

    UndoReviewButton = () => {
        this.setState({ActivateUndoReviewButton:false});

        this.setState({ExecuteDetailAnalysis:false});
        this.setState({ExecuteSubBenchDetailAnalysis: false});
        this.setState({ExecuteOpponentsDetailAnalysis: false});
        this.setState({ExecuteOpponentsSubBenchDetailAnalysis: false});
    }


    


    SelectPlayer = value => () => {

        var getKitNumber = value;

        //Stop the timer , Store the timer the user pressed the Player number
        this.onButtonStop();

        var MinEventOccured = this.state.MinEventOccured;
        var SecEventOccured = this.state.SecEventOccured;



        this.setState({MinEventOccured: this.state.minutes_Counter});
        this.setState({SecEventOccured: this.state.seconds_Counter});

        
      
        if(this.state.displayOpponentsStartingTeam == true)
        {
       
            // Obtain the Opponents Kit number/Player Selected
            this.setState({
                selectedOpponentsPlayerKitNumber: getKitNumber
                    }, () => console.log(this.state.selectedOpponentsPlayerKitNumber));

           
            // Clear the Kit number/Player Selected
            this.setState({
                selectedPlayerKitNumber: ''
                    }, () => console.log(this.state.selectedPlayerKitNumber));

            // This will make all starting team players disappear
            this.setState({displayStartingTeam: false});

            // This will make all opponents starting team players disappear
            this.setState({displayOpponentsStartingTeam: false});

            // Make Events appear
            this.setState({displayEventsContainer: true});

            this.setState({
                displayEventHistory: false
            });

            //makes Event Pattern display
            this.setState({
                displayEventPattern: false
            });


            this.setState({ActivateUndoButton:true});

        }
        else
        {
           
            // Obtain the Kit number/Player Selected
            this.setState({
                selectedPlayerKitNumber: getKitNumber
                    }, () => console.log(this.state.selectedPlayerKitNumber));

            // Obtain the Opponents Kit number/Player Selected
            this.setState({
                selectedOpponentsPlayerKitNumber: ''
                }, () => console.log(this.state.selectedOpponentsPlayerKitNumber));

            // This will make all starting team players disappear
            this.setState({displayStartingTeam: false});

            
            // This will make all opponents starting team players disappear
            this.setState({displayOpponentsStartingTeam: false});

            // Make Events appear
            this.setState({displayEventsContainer: true});

            this.setState({
                displayEventHistory: false
            });

            //makes Event Pattern display
            this.setState({
                displayEventPattern: false
            });


            this.setState({ActivateUndoButton:true});
        }





     
    
      

    }



    SubEventSelected = value => () => {
        

              // Events Selection disappear
              this.setState({displayEventsContainer: false});


        //Opponents mode check, this is toggled on once the user clicks Opponents Team button and toggles off once the user executes the event or Undo or stop/ start button
        
                if(this.state.YourTeamMode == true)
                {
        
                    //Sub Bench to appear 
                    this.setState({displaySubBench: true});
        
                    //Starting team to disappear
                    this.setState({displayStartingTeam: false});
        
                }
                else if(this.state.OpponentsMode == true)
                {
        
                    //Sub Bench to appear 
                    this.setState({displayOpponentsSubBench: true});
        
                    //Opponents starting team players disappear
                    this.setState({displayOpponentsStartingTeam:false });
        
                }
        
        
    }
        
    ExecuteOpponentSub = value => () => {

                 // Obtain arrays  
                 var StartingTeamArray = this.state.StartingTeamArray;
                 var SubBench = this.state.SubBenchArray;
                 var getKitNumber = value;
                 var getPlayer = this.state.selectedOpponentsPlayerKitNumber;
    
                 var OpponentsStartingTeamArray = this.state.OpponentsStartingTeamArray;
                 var OpponentsSubBenchArray = this.state.OpponentsSubBenchArray;
    
                 var validDelete;
                 var validOpponentDelete;
    
                 var getEventType = this.state.selectedEventType;
    
    
            if(getKitNumber == '')
            {
                // user has not selected a player to sub off 
    
                // They have the option to undo the event selection by clicking the undo button
            }
            else
            {
    
               
    
    
                //we execute the sub now
    
                //Remove from Starting team + push it to the subbench
    
                    //Remove from Starting team
                    for(var i = 0; i < OpponentsStartingTeamArray.length; i++)
                    {
                           if(OpponentsStartingTeamArray[i].playerKitNumber == getPlayer)
                           {
                               
                                   if(OpponentsStartingTeamArray[i].status == 'StartingTeam' && OpponentsStartingTeamArray[i].playerKitNumber == this.state.selectedOpponentsPlayerKitNumber)
                                   {
                                              // Push the player subbing OFF to the SubBenchArray 
               
                                              // change status to 'SubBench'
               
                                               var playerData = {
                                                   
                                                   Goals: OpponentsStartingTeamArray[i].Goals,
                                                   Passes: OpponentsStartingTeamArray[i].Passes,
                                                   Points: OpponentsStartingTeamArray[i].Points,
                                                   Shots: OpponentsStartingTeamArray[i].Shots,
                                                   ShotsOnTarget: OpponentsStartingTeamArray[i].ShotsOnTarget,
                                                   UserID: OpponentsStartingTeamArray[i].UserID,
                                                   fullName: OpponentsStartingTeamArray[i].fullName,
                                                   playerKitNumber: OpponentsStartingTeamArray[i].playerKitNumber,
                                                   playerPosition: OpponentsStartingTeamArray[i].playerPosition,
                                                   status: 'SubBench',
                                               };
               
                                               this.state.OpponentsSubBenchArray.push(playerData);
       
                                                //Delete from StartingTeamArray
       
                                               for(var i = 0; i < OpponentsStartingTeamArray.length; i++)
                                               {
                                               
                                                   //  //delete the record with status as 'StartingTeam' 
                                                   if(OpponentsStartingTeamArray[i].status == 'StartingTeam' && OpponentsStartingTeamArray[i].playerKitNumber == this.state.selectedOpponentsPlayerKitNumber)
                                                   {
                                                        OpponentsStartingTeamArray.splice(i,1);
                                                   
                                                   }
                                                   else
                                                   {
                                                   
                                                   }
                       
                                               }
               
                             
                                       
                                   }
    
                            }
    
                    }
    
    
                
                    // Obtain the Kit number/Player Selected
                    this.setState({
                        selectedOpponentsPlayerKitNumber: getKitNumber
                            }, () => console.log(this.state.selectedOpponentsPlayerKitNumber));
    
                        
    
    
                    for(var i = 0; i < OpponentsSubBenchArray.length; i++)
                    {
                   
                        if(OpponentsSubBenchArray[i].status == 'SubBench' && OpponentsSubBenchArray[i].playerKitNumber == getKitNumber)
                        {
                            // Push the player subbing ON to the StartingTeamArray 
                        
                            // change status to 'StartingTeam'
                            var playerData = {
                                                
                                Goals: OpponentsSubBenchArray[i].Goals,
                                Passes: OpponentsSubBenchArray[i].Passes,
                                Points: OpponentsSubBenchArray[i].Points,
                                Shots: OpponentsSubBenchArray[i].Shots,
                                ShotsOnTarget: OpponentsSubBenchArray[i].ShotsOnTarget,
                            
                                UserID: OpponentsSubBenchArray[i].UserID,
                                fullName: OpponentsSubBenchArray[i].fullName,
                                playerKitNumber: OpponentsSubBenchArray[i].playerKitNumber,
                                playerPosition: OpponentsSubBenchArray[i].playerPosition,
                                status: 'StartingTeam',
                            };
        
                            this.state.OpponentsStartingTeamArray.push(playerData);
                            validOpponentDelete = true;
                        }
                        else
                        {
                        
                        }
    
                    }
    
    
                    if(validOpponentDelete == true)
                    {
                    

                        //WE ARE here ,the player is not taken away also button frontend is not updated
    
                        for(var i = 0; i < OpponentsSubBenchArray.length; i++)
                        {
                        
                            if(OpponentsSubBenchArray[i].status == 'SubBench' && OpponentsSubBenchArray[i].playerKitNumber == getKitNumber)
                            {
                            
                                OpponentsSubBenchArray.splice(i,1);
                            }
                        }
    
    
                        this.UndoEvent();
    
                    }


                    console.log(OpponentsStartingTeamArray);
                    console.log(OpponentsSubBenchArray);

            }

    }



    ExecuteSub = value => () => {

             // Obtain arrays  
             var StartingTeamArray = this.state.StartingTeamArray;
             var SubBench = this.state.SubBenchArray;
             var getKitNumber = value;
             var getPlayer = this.state.selectedPlayerKitNumber;

             var OpponentsStartingTeamArray = this.state.OpponentsStartingTeamArray;
             var OpponentsSubBench = this.state.OpponentsSubBenchArray;

             var minutesPlayed = this.state.minutes_Counter;
             var secondsPlayed = this.state.seconds_Counter;

             var validDelete;
             var validOpponentDelete;

             var getEventType = this.state.selectedEventType;


        if(getKitNumber == '')
        {
            // user has not selected a player to sub off 

            // They have the option to undo the event selection by clicking the undo button
        }
        else
        {


            //we execute the sub now

            //Remove from Starting team + push it to the subbench

                //Remove from Starting team
                for(var i = 0; i < StartingTeamArray.length; i++)
                {
                       if(StartingTeamArray[i].playerKitNumber == getPlayer)
                       {
                           
                               if(StartingTeamArray[i].status == 'StartingTeam' && StartingTeamArray[i].playerKitNumber == this.state.selectedPlayerKitNumber)
                               {
                                          // Push the player subbing OFF to the SubBenchArray 
           
                                          // change status to 'SubBench'
           
                                           var playerData = {
                                               
                                               Goals: StartingTeamArray[i].Goals,
                                               Passes:StartingTeamArray[i].Passes,
                                               Points: StartingTeamArray[i].Points,
                                               Shots: StartingTeamArray[i].Shots,
                                               ShotsOnTarget: StartingTeamArray[i].ShotsOnTarget,
                                               UserID: StartingTeamArray[i].UserID,
                                               fullName: StartingTeamArray[i].fullName,
                                               playerKitNumber: StartingTeamArray[i].playerKitNumber,
                                               playerPosition: StartingTeamArray[i].playerPosition,
                                               status: 'SubBench',

                                                //

                                               //Obtain timer - How long they played will be calculated by currentTimerMins - Starting timer mins = minutesPlayerd (Needs tested)
                                               //calculated by currentTimersec - Starting timer secs = secsPlayerd
                                                minutesPlayed:minutesPlayed,
                                                secondsPlayed:secondsPlayed

                                                //


                                           };
           
                                           this.state.SubBenchArray.push(playerData);
   
                                            //Delete from StartingTeamArray
   
                                           for(var i = 0; i < StartingTeamArray.length; i++)
                                           {
                                           
                                               //  //delete the record with status as 'StartingTeam' 
                                               if(StartingTeamArray[i].status == 'StartingTeam' && StartingTeamArray[i].playerKitNumber == this.state.selectedPlayerKitNumber)
                                               {
                                                   StartingTeamArray.splice(i,1);
                                               
                                               }
                                               else
                                               {
                                               
                                               }
                   
                                           }
           
                                               // Make Events disappear
                                                this.setState({displayEventsContainer: false});
                        
                        
                                                // This will make all starting team players disappear
                                                this.setState({displayStartingTeam: false});
                        
                                                //Sub bench container Appear
                                                this.setState({displaySubBench: true});
                                   
                               }

                        }

                }


            
                // Obtain the Kit number/Player Selected
                this.setState({
                    selectedPlayerKitNumber: getKitNumber
                        }, () => console.log(this.state.selectedPlayerKitNumber));

                    


                for(var i = 0; i < SubBench.length; i++)
                {
               
                    if(SubBench[i].status == 'SubBench' && SubBench[i].playerKitNumber == getKitNumber)
                    {
                    // Push the player subbing ON to the StartingTeamArray 
                
                    // change status to 'StartingTeam'
                    var playerData = {
                                        
                        Goals: SubBench[i].Goals,
                        Passes: SubBench[i].Passes,
                        Points: SubBench[i].Points,
                        Shots: SubBench[i].Shots,
                        ShotsOnTarget: SubBench[i].ShotsOnTarget,
                    
                        UserID: SubBench[i].UserID,
                        fullName: SubBench[i].fullName,
                        playerKitNumber: SubBench[i].playerKitNumber,
                        playerPosition: SubBench[i].playerPosition,
                        status: 'StartingTeam',
                    };

                    this.state.StartingTeamArray.push(playerData);
                    validDelete = true;
                    }
                    else
                    {
                    
                    }

                }


                if(validDelete == true)
                {
                

                    for(var i = 0; i < SubBench.length; i++)
                    {
                    
                        if(SubBench[i].status == 'SubBench' && SubBench[i].playerKitNumber == getKitNumber)
                        {
                        
                                SubBench.splice(i,1);
                        }
                    }


                    this.UndoEvent();

                }


    
 
    }


}


    ObtainEventSelected = value => () => {
        var SportType = this.state.SportType; 
        var getEvent = value;

        //Obtain_Store the Event Type Selected

          // Obtain the Event
          this.setState({
            selectedEventType: getEvent
                }, () => console.log(this.state.selectedEventType));

                //Obtain kitnumber
                var getPlayer = this.state.selectedPlayerKitNumber;
                var GetOpponentsPlayer = this.selectedOpponentsPlayerKitNumber;


                 //makes Event History display
                    this.setState({
                        displayEventHistory: false
                    });

                  
                     // Enable EvemySelection
                     this.setState({displayEventsContainer: false});

                

                // Enable Field Selection
                this.setState({displayFieldPositionSelection: true});

           

                // Enable the ability to undo an event selection
                this.setState({ActivateUndoButtonForFieldSelection:true})
        
    }

  



    //Undo Event
    UndoEvent  = async() => {



        // //Sub bench container Appear           
        this.setState({displaySubBench: false});

        // // This will make all starting team players appear
        this.setState({displayStartingTeam: true});

        //Opponents Starting Team
        this.setState({displayOpponentsStartingTeam: false});

        //Opponents Sub bench container Appear  
        this.setState({displayOpponentsSubBench: false});
        
        // Make FieldPosition Disappear
        this.setState({displayFieldPositionSelection:false});

        // Make Event selection disappear 
        this.setState({displayEventsContainer:false});

        this.setState({ActivateUndoButton:false});

        this.setState({ActivateUndoButtonForFieldSelection:false});
        
        //stop the timer
        this.onButtonStop();

        // Unpause timer
        this.onButtonStart();



    }

    ReviewGame = async() => {


        this.setState({displayReviewGameContainer:true});


           // This will make all starting team players disappear
           this.setState({displayStartingTeam: false});

           //Sub bench container disAppear           
           this.setState({displaySubBench: false});
           
           // Make FieldPosition Disappear
           this.setState({displayFieldPositionSelection:false});
   
           // Make Event selection disappear 
           this.setState({displayEventsContainer:false});
        
           this.onButtonStop();

           this.setState({displayReviewTotalTeamStatsContainer:false});
           this.setState({displayReviewOpponentsTotalTeamStatsContainer:false});

           this.setState({displayReviewYourTeamIndividualPlayerStatsContainer:false});


           this.setState({displayReviewYourTeamIndividualSquadPlayer:false});
           this.setState({displayReviewOpponentsIndividualPlayers:false});

           this.setState({displayReviewOpponentsIndividualSubBenchPlayer:false});

           this.setState({displayReviewIndividualPlayerStatsContainer:false});


                      
            this.setState({displayReviewIndividualSubBenchPlayer:false});   
            this.setState({displayReviewIndividualSquadPlayer:false});

            //disable Event selection view
            this.setState({EventSelectionTeamDetailAnalysis:false});

            //disable Event selection view
            this.setState({EventSelectionOpponentsDetailAnalysis:false});

            this.setState({ActivateUndoButton:false});
            
            //Activate Opponents Mode
            this.setState({OpponentsMode: false});




        // This will make all opponents starting team players disappear
        this.setState({displayOpponentsStartingTeam: false});


                //Team Event Selection - Detailed Game analysis
                this.setState({TeamSelection: false});
     
                this.setState({DetailedGameAnalysisSelectionView:false});
                this.setState({YourTeamReviewSelection:false});
                this.setState({OpponentsReviewSelection: false});

                this.setState({TeamSelection: false});
                this.setState({OpponentEventSelection:false});

                //Detailed Review Player buttons
                this.setState({displayDetailedIndividualSquadPlayer:false});
                this.setState({displayDetailedIndividualSubBenchPlayer:false});
                this.setState({displayOpponentsDetailedIndividualSquadPlayer:false});
                this.setState({displayOpponentsDetailedIndividualSubBenchPlayer:false});

                this.setState({displayDetailedIndividualSquadPlayerEventSelection: false});
                this.setState({displayDetailedIndividualSubBenchEventSelection:false});

                this.setState({displayDetailedIndividualOpponentsSquadPlayerEventSelection:false});
                this.setState({displayDetailedIndividualOpponentsSubBenchEventSelection:false});

                //Detail Percentages
                this.setState({TeamEventPercentages:false});
                this.setState({OpponentsEventPercentages:false});

                this.setState({ExecuteDetailAnalysis:false});
                this.setState({ExecuteSubBenchDetailAnalysis:false});
                this.setState({ExecuteOpponentsDetailAnalysis:false});
                this.setState({ExecuteOpponentsSubBenchDetailAnalysis:false});





               //makes Event History display
                this.setState({
                    displayEventHistory: false
                }); 

                   //makes Event Pattern display
                    this.setState({
                        displayEventPattern: false
                    });

                    

        if(this.state.displayReviewYourTeamIndividualPlayerStatsContainer == true)
        {
            this.setState({displayReviewYourTeamIndividualPlayerStatsContainer:false})
        }

        if(this.state.displayReviewOpponentsIndividualPlayerStatsContainer == true)
        {
            this.setState({displayReviewOpponentsIndividualPlayerStatsContainer:false});
        }
     
    
    }


    ReviewTotalTeamStats = async() => {
        //Toggle on and off feature - display to either appear or disappear
        if(this.state.displayReviewTotalTeamStatsContainer == true)
        {           
            this.setState({displayReviewTotalTeamStatsContainer:false});
            // this.setState({displayIndividualPlayerStatsTable:false}); 
            // this.setState({displayReviewOpponentsTotalTeamStatsContainer:false});


               //makes Event History display
         this.setState({
            displayEventHistory: false
        }); 

           //makes Event Pattern display
           this.setState({
            displayEventPattern: false
        });

        }
        else
        {

            this.setState({displayReviewGameContainer:false});
            this.setState({displayReviewTotalTeamStatsContainer:true});


            //makes Event History display
            this.setState({
                displayEventHistory: false
            }); 


           //makes Event Pattern display
           this.setState({
            displayEventPattern: false
            });

        }
    }


    ReviewOpponentsTotalTeamStats = async() => {
        //Toggle on and off feature - display to either appear or disappear
        if(this.state.displayReviewOpponentsTotalTeamStatsContainer == true)
        {           
            this.setState({displayReviewOpponentsTotalTeamStatsContainer:false});
            this.setState({displayReviewTotalTeamStatsContainer:false});
            // this.setState({displayIndividualPlayerStatsTable:false}); 


               //makes Event History display
         this.setState({
            displayEventHistory: false
        }); 

           //makes Event Pattern display
           this.setState({
            displayEventPattern: false
        });

        }
        else
        {
            this.setState({displayReviewGameContainer:false});
            this.setState({displayReviewTotalTeamStatsContainer:false});
            this.setState({displayReviewOpponentsTotalTeamStatsContainer:true});
  

            //makes Event History display
            this.setState({
                displayEventHistory: false
            }); 


           //makes Event Pattern display
           this.setState({
            displayEventPattern: false
            });

        }
    }

    ReviewIndividualPlayerStats = async() => {
        //Toggle on and off feature - display to either appear or disappear
        if(this.state.displayReviewIndividualPlayerStatsContainer == true)
        {           

            //Make the rest disappear (clear screen)
            this.setState({displayReviewGameContainer:false});
            this.setState({displayReviewTotalTeamStatsContainer:false});
            this.setState({displayReviewOpponentsTotalTeamStatsContainer:false});


            
            this.setState({displayIndividualPlayerStatsTable: false});
            this.setState({displayReviewIndividualSubBenchPlayer:false});   
            this.setState({displayReviewIndividualSquadPlayer:false});

               //makes Event History display
                this.setState({
                    displayEventHistory: false
                }); 

                   //makes Event Pattern display
                    this.setState({
                        displayEventPattern: false
                    });
 
        }
        else
        {

            this.setState({displayReviewIndividualPlayerStatsContainer:true});


            //Make the rest disappear (clear screen)
            this.setState({displayReviewGameContainer:false});
            this.setState({displayReviewTotalTeamStatsContainer:false});
            this.setState({displayReviewOpponentsTotalTeamStatsContainer:false});


            
            this.setState({displayIndividualPlayerStatsTable: false});
            this.setState({displayReviewIndividualSubBenchPlayer:false});   
            this.setState({displayReviewIndividualSquadPlayer:false});



               //makes Event History display
                this.setState({
                    displayEventHistory: false
                }); 


            //makes Event Pattern display
            this.setState({
                displayEventPattern: false
            });
          
        }
    }

    ReviewYourTeam = async() => {

        this.setState({displayReviewYourTeamIndividualPlayerStatsContainer:true});

         //Make Player selection disapper
         this.setState({displayReviewIndividualSquadPlayer: false});
         this.setState({displayReviewIndividualSubBenchPlayer: false});

         this.setState({displayReviewOpponentsIndividualSquadPlayer:false});
         this.setState({displayReviewOpponentsIndividualSubBenchPlayer:false});


    }

    ReviewOpponentsTeam = async() => {
        
         this.setState({displayReviewOpponentsIndividualPlayerStatsContainer:true});

         //Make Player selection disapper
         this.setState({displayReviewIndividualSquadPlayer: false});
         this.setState({displayReviewIndividualSubBenchPlayer: false});
        
         this.setState({displayReviewOpponentsIndividualPlayer:false});
         this.setState({displayReviewOpponentsIndividualSubBenchPlayer:false});
        
    
    }




    


    //--------Your Team Individual Review Frontend Toggles-----------
    ReviewIndividualSquadPlayer = async() => {
         
        //Make list of Starting players from "Your Team" appear
         this.setState({displayReviewIndividualSquadPlayer:true});

        //Makes Event History display disappear
        this.setState({
            displayEventHistory: false
        }); 


        //This will make The Stats table for "Your Team" individual player disappear
        this.setState({displayReviewYourTeamIndividualSquadPlayer:false});

            
        //This will make The Stats table for "Opponents Team" starting individual player appear (we can use this for both starting players and sub)
        this.setState({displayReviewOpponentsIndividualPlayers:false});
    

        if(this.state.displayReviewIndividualSubBenchPlayer == true)
        {
            this.setState({displayReviewIndividualSubBenchPlayer:false});
        }
      



    }

    ReviewIndividualSubBenchPlayer = async() => {
        
        //Make list of Subbench players from "Your Team" appear
        this.setState({displayReviewIndividualSubBenchPlayer: true});

        //This will make the Startingteam selection button disappear
        this.setState({displayReviewIndividualSquadPlayer:false});
        
        //This will make The Stats table for "Your Team" individual player disappear
        this.setState({displayReviewYourTeamIndividualSquadPlayer:false});

        
        //This will make The Stats table for "Opponents Team" starting individual player appear (we can use this for both starting players and sub)
        this.setState({displayReviewOpponentsIndividualPlayers:false});

         //makes Event History display disappear
         this.setState({
            displayEventHistory: false
         }); 

        
    }
//-----------------------------------------------------------------------

//--------Opponents Individual Review Frontend Toggles-------------------

    ReviewOpponentsIndividualSquadPlayer = async() => {

        //Make a list of Squad Players from "Opponents Team" appear
        this.setState({displayReviewOpponentsIndividualSquadPlayer:true});


        //This will make The Stats table for "Opponents Team" starting individual player disappear (we can use this for both starting players and sub)
        this.setState({displayReviewOpponentsIndividualPlayers:false});

        //This will make the Startingteam selection button disappear
        this.setState({displayReviewIndividualSquadPlayer:false});

        //This will make The Stats table for "Your Team" individual player disappear
        this.setState({displayReviewYourTeamIndividualSquadPlayer:false});


         //makes Event History display disappear
         this.setState({
            displayEventHistory: false
         }); 

        if(this.state.displayReviewOpponentsIndividualSubBenchPlayer == true)
        {
            this.setState({displayReviewOpponentsIndividualSubBenchPlayer:false});
        }
      
        
    }


    ReviewOpponentsIndividualSubBenchPlayer = async() => {
        
        //Make a list of Sub bench from "Opponents Team" appear
        this.setState({displayReviewOpponentsIndividualSubBenchPlayer:true});
        
        //This will make The Stats table for "Opponents Team" starting individual player disappear (we can use this for both starting players and sub)
        this.setState({displayReviewOpponentsIndividualPlayers:false});

        //This will make the Startingteam selection button disappear
        this.setState({displayReviewIndividualSquadPlayer:false});
        
        //This will make The Stats table for "Your Team" individual player disappear
        this.setState({displayReviewYourTeamIndividualSquadPlayer:false});

    

        //makes Event History display disappear
        this.setState({
            displayEventHistory: false
        }); 


  

    }

    //------------------------------------------------------------------

    //Your Team Starting players
    GetSelectedPlayerStats = value => () => {


        //This will only contain 1 record at a time 
        var SelectedPlayerArray = this.state.SelectedPlayerArray;

        var StartingTeamArray = this.state.StartingTeamArray;

        var SubBench = this.state.SubBenchArray;

        var getKitNumber = value;

        // Obtain the Kit number/Player Selected
        this.setState({
            selectedPlayerKitNumber: getKitNumber
        }, () => console.log(this.state.selectedPlayerKitNumber));

     
            //SelectedPlayerArray will only contain 1 player record
            // Clear previously used array if its not empty
            SelectedPlayerArray.splice(0,SelectedPlayerArray.length);


            //loop startingteam
            for(var i = 0; i < StartingTeamArray.length; i++)
            {
         
                if(StartingTeamArray[i].status == 'StartingTeam' && StartingTeamArray[i].playerKitNumber == getKitNumber)
                {

      
                     // Get stats and store in a array 
                        var playerData = {
                                                
                         Goals: StartingTeamArray[i].Goals,
                         Passes: StartingTeamArray[i].Passes,
                         Points: StartingTeamArray[i].Points,
                         Shots: StartingTeamArray[i].Shots,
                         ShotsOnTarget: StartingTeamArray[i].ShotsOnTarget,
                         UserID: StartingTeamArray[i].UserID,
                         fullName: StartingTeamArray[i].fullName,
                         playerKitNumber: StartingTeamArray[i].playerKitNumber,
                         playerPosition: StartingTeamArray[i].playerPosition,
                        
                        };


                        SelectedPlayerArray.push(playerData);

                        //This will make The Stats table for "Your Team" individual player appear
                        this.setState({displayReviewYourTeamIndividualSquadPlayer:true});


                        //This will make the Startingteam selection button disappear
                        this.setState({displayReviewIndividualSquadPlayer:false});

     

                }
             


            }
    }

    GetSelectedPlayerStatsSubbench = value => () => {
  
        //This will only contain 1 record at a time 
            var SelectedPlayerArray = this.state.SelectedPlayerArray;

            var SubBench = this.state.SubBenchArray;

            var getKitNumber = value;

            // Obtain the Kit number/Player Selected
            this.setState({
                selectedPlayerKitNumber: getKitNumber
            }, () => console.log(this.state.selectedPlayerKitNumber));

     
            //SelectedPlayerArray will only contain 1 player record
            // Clear previously used array if its not empty
            SelectedPlayerArray.splice(0,SelectedPlayerArray.length);


            //loop Subbench
            for(var i = 0; i < SubBench.length; i++)
            {
      
                if(SubBench[i].status == 'SubBench' && SubBench[i].playerKitNumber == getKitNumber)
                {
              
                    // Get stats and store in a array 
                        var playerData = {
                                                
                        Goals: SubBench[i].Goals,
                        Passes: SubBench[i].Passes,
                        Points: SubBench[i].Points,
                        UserID: SubBench[i].UserID,
                        fullName: SubBench[i].fullName,
                        playerKitNumber: SubBench[i].playerKitNumber,
                        playerPosition: SubBench[i].playerPosition,
                        
                        };


                        SelectedPlayerArray.push(playerData);

                        //This will make "Opponents Team" sub bench buttons disappear
                        this.setState({displayReviewIndividualSubBenchPlayer:false});   

                        //This will make The Stats table for "Your Team" starting individual player appear (we can use this for both starting players and sub)
                        this.setState({displayReviewYourTeamIndividualSquadPlayer:true});


                        //This will make the Startingteam selection button disappear
                        this.setState({displayReviewIndividualSquadPlayer:false});
                     

                }
            }

    }


        

    
    

    
    GetSelectedOpponentsPlayerStats = value => () => {
        
            var SelectedPlayerArray = this.state.SelectedOpponentsPlayerArray;

            var StartingTeamArray = this.state.OpponentsStartingTeamArray;

            var getKitNumber = value;

            // Obtain the Kit number/Player Selected
            this.setState({
                selectedPlayerKitNumber: getKitNumber
            }, () => console.log(this.state.selectedPlayerKitNumber));


     
            //SelectedPlayerArray will only contain 1 player record
            // Clear previously used array if its not empty
            SelectedPlayerArray.splice(0,SelectedPlayerArray.length);

        
            //loop startingteam
            for(var i = 0; i < StartingTeamArray.length; i++)
            {
         
                if(StartingTeamArray[i].status == 'StartingTeam' && StartingTeamArray[i].playerKitNumber == getKitNumber)
                {

      
                     // Get stats and store in a array 
                        var playerData = {
                                                
                         Goals: StartingTeamArray[i].Goals,
                         Passes: StartingTeamArray[i].Passes,
                         Points: StartingTeamArray[i].Points,
                         UserID: StartingTeamArray[i].UserID,
                         fullName: StartingTeamArray[i].fullName,
                         playerKitNumber: StartingTeamArray[i].playerKitNumber,
                         playerPosition: StartingTeamArray[i].playerPosition,
                        
                        };


                        SelectedPlayerArray.push(playerData);

              


                        //This will make the Opponents team selection button disappear
                        this.setState({displayReviewOpponentsIndividualSquadPlayer:false});



                        //This will make The Stats table for "Opponents Team" starting individual player appear (we can use this for both starting players and sub)
                        this.setState({displayReviewOpponentsIndividualPlayers:true});


                        //This will make the Startingteam selection button disappear
                        this.setState({displayReviewIndividualSquadPlayer:false});
                        this.setState({displayReviewIndividualSubBenchPlayer:false});   

                }



    
        }

    }






    
    GetSelectedOpponentsPlayerStatsSubBench = value => () => {
        
            var SelectedPlayerArray = this.state.SelectedOpponentsPlayerArray;

            var SubBench = this.state.OpponentsSubBenchArray;

            var getKitNumber = value;

            // Obtain the Kit number/Player Selected
            this.setState({
                selectedPlayerKitNumber: getKitNumber
            }, () => console.log(this.state.selectedPlayerKitNumber));

            //SelectedPlayerArray will only contain 1 player record
            // Clear previously used array if its not empty
            SelectedPlayerArray.splice(0,SelectedPlayerArray.length);

            //loop Subbench
            for(var i = 0; i < SubBench.length; i++)
            {
        
                if(SubBench[i].status == 'SubBench' && SubBench[i].playerKitNumber == getKitNumber)
                {
                
                    // Get stats and store in a array 
                        var playerData = {
                                                
                        Goals: SubBench[i].Goals,
                        Passes: SubBench[i].Passes,
                        Points: SubBench[i].Points,
                        UserID: SubBench[i].UserID,
                        fullName: SubBench[i].fullName,
                        playerKitNumber: SubBench[i].playerKitNumber,
                        playerPosition: SubBench[i].playerPosition,
                        
                        };


                        SelectedPlayerArray.push(playerData);

                        //This will make "Opponents Team"  buttons disappear
                        this.setState({displayReviewOpponentsIndividualSubBenchPlayer:false});
                        this.setState({displayReviewOpponentsIndividualSquadPlayer:false});

                        //This will make The Stats table for "Opponents Team" starting individual player appear (we can use this for both starting players and sub)
                        this.setState({displayReviewOpponentsIndividualPlayers:true});


                        //This will make the Startingteam selection button disappear
                        this.setState({displayReviewIndividualSquadPlayer:false});
                        this.setState({displayReviewIndividualSubBenchPlayer:false});   
                    

                }
            }
        }
    
 

    


  

    EndGame = async() => {
         
       //Stop the Game Timer
       this.onButtonStop();

       var SportType = this.state.SportType;

       var StartingTeamArray = this.state.StartingTeamArray;
       var SubBenchArray = this.state.SubBenchArray;
    
       var myUserId = firebase.auth().currentUser.uid;

       var GameRecordKey = this.state.GameRecordKey;

        //Field Location Data Arrays
        var EventFieldPositions = this.state.EventFieldPositions;
        var OpponentsEventFieldPositions = this.state.OpponentsEventFieldPositions;


        //Your Team Stat Events
        var UsersTeamGAAGoalCounter = this.state.UsersTeamGAAGoalCounter;
        var UsersTeamGAAPointCounter = this.state.UsersTeamGAAPointCounter;
        var UsersTeamSoccerGoalCounter = this.state.UsersTeamSoccerGoalCounter;

        //Opponents Stat Events
        var OpponentsTeamGAAGoalCounter = this.state.OpponentsTeamGAAGoalCounter;
        var OpponentsTeamGAAPointCounter = this.state.OpponentsTeamGAAPointCounter;
        var OpponentsTeamSoccerGoalCounter = this.state.OpponentsTeamSoccerGoalCounter;
    
        //Totals - Your Team
        var totalTeamGoals = this.state.totalTeamGoals;
        var totalTeamPoints = this.state.totalTeamPoints
        var totalTeamPasses = this.state.totalTeamPasses;
        var totalTeamShots = this.state.totalTeamShots;
        var totalTeamShotsOnTarget = this.state.totalTeamShotsOnTarget;

        //Totals - Opponents
        var totalOpponentsTeamGoals = this.state.totalOpponentsTeamGoals;
        var totalOpponentsTeamPoints = this.state.totalOpponentsTeamPoints;
        var totalOpponentsPasses = this.state.totalOpponentsTeamPasses;
        var totalOpponentsTeamShots = this.state.totalOpponentsTeamShots;
        var totalOpponentsTeamShotsOnTarget = this.state.totalOpponentsTeamShotsOnTarget;
        
        //Update YourTeam Game Record totals
        var updateGameRecord = firebase.database().ref('/teams').child(myUserId).child('games').child(GameRecordKey).child('YourTeamStats');

        //Update Opponents Game Record totals 
        var updateOpGameRecord = firebase.database().ref('/teams').child(myUserId).child('games').child(GameRecordKey).child('OpponentsStats');

        //update users team ALL TIME STATS
        var updateGoals = { totalTeamGoals: firebase.database.ServerValue.increment(totalTeamGoals)};
        var updateShots = { totalTeamShots: firebase.database.ServerValue.increment(totalTeamShots)};
        var updateShotsOn = { totalTeamShotsOnTarget: firebase.database.ServerValue.increment(totalTeamShotsOnTarget)};


        firebase.database().ref('/teams').child(myUserId)
        .child('gamecounter')
        .set(firebase.database.ServerValue.increment(1));


        //This can only be used by the HeadTeam Admin 

        //------SEND ALL TOTAL TEAM STATS TO THE DATABASE (Teams/USERID/STATS)-------

        if(SportType == 'GAA')
        {

            //Push to Team Database record
            var updateDB = firebase.database().ref('/teams').child(myUserId).child('Stats');
            
            //Your Team Totals 
            var updateTeamTotals = {
        
                    totalTeamGoals: firebase.database.ServerValue.increment(totalTeamGoals),
                    totalTeamShots: firebase.database.ServerValue.increment(totalTeamShots),
                    totalTeamShotsOnTarget: firebase.database.ServerValue.increment(totalTeamShotsOnTarget),
                    totalTeamPoints: firebase.database.ServerValue.increment(totalTeamPoints)
            };

            updateDB.update(updateTeamTotals);
  
        }
        else if(SportType == 'Soccer')
        {
            
            //Push to Team Database record
            var updateDB = firebase.database().ref('/teams').child(myUserId).child('Stats');
                        
            //Your Team Total 
            var updateTeamTotals = {

                    totalTeamGoals: firebase.database.ServerValue.increment(totalTeamGoals),
                    totalTeamShots: firebase.database.ServerValue.increment(totalTeamShots),
                    totalTeamShotsOnTarget: firebase.database.ServerValue.increment(totalTeamShotsOnTarget),
                    
            };

            updateDB.update(updateTeamTotals);

        }

        // ------------------------------------------------------------

        //GAA Scores  --- Your Team  - also put opponents in here for flexibilty in (ManageTeam) + GameRecord key
        if(SportType == 'GAA')
        {
             
            var updateFinalScores = {

                GameRecordKey: GameRecordKey,
                screenWidth: Dimensions.get('window').width,
                screenHeight: Dimensions.get('window').height,
                UsersGAAGoals: firebase.database.ServerValue.increment(UsersTeamGAAGoalCounter),        
                UsersGAAPoints: firebase.database.ServerValue.increment(UsersTeamGAAPointCounter),

                OpponentsName: this.state.OpponentName,
                OpponentsGAAGoals: firebase.database.ServerValue.increment(OpponentsTeamGAAGoalCounter),
                OpponentsGAAPoints: firebase.database.ServerValue.increment(OpponentsTeamGAAPointCounter),
                
                totalOpponentsTeamGoals: firebase.database.ServerValue.increment(totalOpponentsTeamGoals),
                totalOpponentsTeamShots: firebase.database.ServerValue.increment(totalOpponentsTeamShots),
                totalOpponentsTeamShotsOnTarget: firebase.database.ServerValue.increment(totalOpponentsTeamShotsOnTarget),
                totalOpponentsTeamPoints: firebase.database.ServerValue.increment(totalOpponentsTeamPoints),


                totalTeamGoals: firebase.database.ServerValue.increment(totalTeamGoals),
                totalTeamShots: firebase.database.ServerValue.increment(totalTeamShots),
                totalTeamShotsOnTarget: firebase.database.ServerValue.increment(totalTeamShotsOnTarget),
                totalTeamPoints: firebase.database.ServerValue.increment(totalTeamPoints)
            };


            // Your Team Totals + Opponents Totals -- .child('YourTeamStats');
            updateGameRecord.push(updateFinalScores);

            //GAA Scores  --- Opponents
            var updateOpponentsFinalScores = {

                OpponentsName: this.state.OpponentName,
                OpponentsGAAGoals: firebase.database.ServerValue.increment(OpponentsTeamGAAGoalCounter),
                OpponentsGAAPoints: firebase.database.ServerValue.increment(OpponentsTeamGAAPointCounter),
                
                totalOpponentsTeamGoals: firebase.database.ServerValue.increment(totalOpponentsTeamGoals),
                totalOpponentsTeamShots: firebase.database.ServerValue.increment(totalOpponentsTeamShots),
                totalOpponentsTeamShotsOnTarget: firebase.database.ServerValue.increment(totalOpponentsTeamShotsOnTarget),

            };

            

            // Opponents Totals  --  .child('OpponentsStats');
            updateOpGameRecord.push(updateOpponentsFinalScores);




        }      
        
        
        
        if(SportType == 'Soccer')
        {
            //--Final Scores 
       
            // Soccer Scores  --- Your Team - also put opponents scores in here for flexibility
            var updateFinalScoresSoccer = {
                GameRecordKey: GameRecordKey,
                UsersSoccerGoals: firebase.database.ServerValue.increment(UsersTeamSoccerGoalCounter),
                
                OpponentsName: this.state.OpponentName,
                OpponentsSoccerGoals: firebase.database.ServerValue.increment(OpponentsTeamSoccerGoalCounter),
             
                screenWidth: Dimensions.get('window').width,
                screenHeight: Dimensions.get('window').height,
                totalOpponentsTeamGoals: firebase.database.ServerValue.increment(totalOpponentsTeamGoals),
                totalOpponentsTeamShots: firebase.database.ServerValue.increment(totalOpponentsTeamShots),
                totalOpponentsTeamShotsOnTarget: firebase.database.ServerValue.increment(totalOpponentsTeamShotsOnTarget),


                totalTeamGoals: firebase.database.ServerValue.increment(totalTeamGoals),
                totalTeamShots: firebase.database.ServerValue.increment(totalTeamShots),
                totalTeamShotsOnTarget: firebase.database.ServerValue.increment(totalTeamShotsOnTarget)

            
            };


        
            //Soccer Scores  --- Opponents
            var updateOpponentsFinalScoresSoccer = {
            
                OpponentsName: this.state.OpponentName,
                screenWidth: Dimensions.get('window').width,
                screenHeight: Dimensions.get('window').height,
                OpponentsSoccerGoals: firebase.database.ServerValue.increment(OpponentsTeamSoccerGoalCounter),

                
                totalOpponentsTeamGoals: firebase.database.ServerValue.increment(totalOpponentsTeamGoals),
                totalOpponentsTeamShots: firebase.database.ServerValue.increment(totalOpponentsTeamShots),
                totalOpponentsTeamShotsOnTarget: firebase.database.ServerValue.increment(totalOpponentsTeamShotsOnTarget)

            };

            // Your Team Totals + Opponents Totals
            updateGameRecord.push(updateFinalScoresSoccer);
            updateOpGameRecord.push(updateOpponentsFinalScoresSoccer);


        }

        //Send Stats to the Players User Record , if they have one
        if(SportType == 'GAA')
        {

                for (var i = 0; i < StartingTeamArray.length; i++) {
        
                    var UserID = StartingTeamArray[i].UserID;
                    var Goals = StartingTeamArray[i].Goals;
                    // var Points = StartingTeamArray[i].Points;
                    var Shots = StartingTeamArray[i].Shots;
                    var ShotsOnTarget = StartingTeamArray[i].ShotsOnTarget;
             
                
                    //SEND DATA to (Player)User account
                     var updateUser = firebase.database().ref('/users').orderByChild("id").equalTo(UserID);
                         updateUser.on("child_added", function(snapshot) {
    
                         if(snapshot.exists()) 
                         {

                            // Push stats to the player USER Account
                            var updateStats = {
                                totalGoals: firebase.database.ServerValue.increment(Goals),
                                totalShots: firebase.database.ServerValue.increment(Shots),
                                totalShotsOnTarget: firebase.database.ServerValue.increment(ShotsOnTarget)
                                //totalPoints: firebase.database.ServerValue.increment(Points),
                            };
    
                            snapshot.ref.update(updateStats);
                    
                         }
                         else{

                         }
                    
                    });

                }

                //Sub Bench send stats
                for (var i = 0; i < SubBenchArray.length; i++) {


                    var UserID = SubBenchArray[i].UserID;
                    var Goals = SubBenchArray[i].Goals;
                    // var Points = SubBenchArray[i].Points;
                    var Shots = SubBenchArray[i].Shots;
                    var ShotsOnTarget = SubBenchArray[i].ShotsOnTarget;
             
                
                    //SEND DATA to (Player)User account
                    var updateUser = firebase.database().ref('/users').orderByChild("id").equalTo(UserID);
                    updateUser.on("child_added", function(snapshot) {

                    if(snapshot.exists()) 
                    {

                        // Push stats to the player USER Account
                        var updateStats = {
                            totalGoals: firebase.database.ServerValue.increment(Goals),
                            totalShots: firebase.database.ServerValue.increment(Shots),
                            totalShotsOnTarget: firebase.database.ServerValue.increment(ShotsOnTarget)
                            //totalPoints: firebase.database.ServerValue.increment(Points),
                        };

                        snapshot.ref.update(updateStats);

                    }
                    else{

                    }

                    });
                }
                

            }
            else if(SportType == 'Soccer')
            {
                for (var i = 0; i < StartingTeamArray.length; i++) {
                        
                    var UserID = StartingTeamArray[i].UserID;
                    var Goals = StartingTeamArray[i].Goals;
                    var Shots = StartingTeamArray[i].Shots;
                    var ShotsOnTarget = StartingTeamArray[i].ShotsOnTarget;
                    
                                
                    var updateUser = firebase.database().ref('/users').orderByChild("id").equalTo(UserID);
                    updateUser.on("child_added", function(snapshot) {
                    
                            if (snapshot.exists()) 
                            {
                    
                                // Push stats to the player USER Account
                                var updateStats = {
                                    totalGoals: firebase.database.ServerValue.increment(Goals),
                                    totalShots: firebase.database.ServerValue.increment(Shots),
                                    totalShotsOnTarget: firebase.database.ServerValue.increment(ShotsOnTarget)
                                };
                    
                                snapshot.ref.update(updateStats);
                    
                            }
                            else
                            {
                    
                            }
                    });
                }
                
                //Sub Bench send stats
                for (var i = 0; i < SubBenchArray.length; i++) {


                    var UserID = SubBenchArray[i].UserID;
                    var Goals = SubBenchArray[i].Goals;
                 
                    var Shots = SubBenchArray[i].Shots;
                    var ShotsOnTarget = SubBenchArray[i].ShotsOnTarget;
             
                
                    //SEND DATA to (Player)User account
                    var updateUser = firebase.database().ref('/users').orderByChild("id").equalTo(UserID);
                    updateUser.on("child_added", function(snapshot) {

                    if(snapshot.exists()) 
                    {

                        // Push stats to the player USER Account
                        var updateStats = {
                            totalGoals: firebase.database.ServerValue.increment(Goals),
                            totalShots: firebase.database.ServerValue.increment(Shots),
                            totalShotsOnTarget: firebase.database.ServerValue.increment(ShotsOnTarget)
                            //totalPoints: firebase.database.ServerValue.increment(Points),
                        };

                        snapshot.ref.update(updateStats);

                    }
                    else{

                    }

                    });
                }
                

            }



            //Send stats to Teams/Players record - This will allow temporary accounts to have stats 
            if(SportType == 'GAA')
            {
                    var updatePlayer = firebase.database().ref('/teams').child(myUserId).child('/players').orderByChild('UserID').equalTo(UserID);
                    updatePlayer.on("child_added", function(snapshot) {


                        if(snapshot.exists()) 
                        {
                            // Push stats to the player player record 
                            var updateStats = {
                                totalGoals: firebase.database.ServerValue.increment(Goals),
                                totalShots: firebase.database.ServerValue.increment(Shots),
                                totalShotsOnTarget: firebase.database.ServerValue.increment(ShotsOnTarget)
                                //totalPoints: firebase.database.ServerValue.increment(Points),
                            };

                            snapshot.ref.update(updateStats);

                        }
                        else
                        {
                            
                        }
                    });
    

                //Send SubBench Player stats to User Accounts
                for (var i = 0; i < SubBenchArray.length; i++) {
    
                        var SubUserID = SubBenchArray[i].UserID;
                        var SubGoals = SubBenchArray[i].Goals;
                        // var SubPoints = SubBenchArray[i].Points;
                        var SubShots = SubBenchArray[i].Shots;
                        var SubShotsOnTarget = SubBenchArray[i].ShotsOnTarget;
                        
                        var updateUserSub = firebase.database().ref('/teams').child(myUserId).child('/players').orderByChild('UserID').equalTo(UserID);
                            updateUserSub.on("child_added", function(snapshot) {
    

                            if(snapshot.exists()) 
                            {
                                // Push stats to the player USER Account
                                var updateStats2 = {
                                    totalGoals: firebase.database.ServerValue.increment(SubGoals),
                                    totalShots: firebase.database.ServerValue.increment(SubShots),
                                    totalShotsOnTarget: firebase.database.ServerValue.increment(SubShotsOnTarget)
                                    //totalPoints: firebase.database.ServerValue.increment(Points),
                                };
    
                                snapshot.ref.update(updateStats2);

                            }
                            else
                            {

                            }
                        });

                }
            }
            else if (SportType == 'Soccer')
            {

                var updatePlayer = firebase.database().ref('/teams').child(myUserId).child('/players').orderByChild('UserID').equalTo(UserID);
                    updatePlayer.on("child_added", function(snapshot) {

                        if(snapshot.exists()) 
                        {
                            // Push stats to the player player record 
                            var updateStats = {
                                totalGoals: firebase.database.ServerValue.increment(Goals),
                                totalShots: firebase.database.ServerValue.increment(Shots),
                                totalShotsOnTarget: firebase.database.ServerValue.increment(ShotsOnTarget)
                                //totalPoints: firebase.database.ServerValue.increment(Points),
                            };

                            snapshot.ref.update(updateStats);

                        }
                        else
                        {
                                
                        }
                });


                //Send SubBench Player stats to User Accounts
                for (var i = 0; i < SubBenchArray.length; i++) {

                        var SubUserID = SubBenchArray[i].UserID;
                        var SubGoals = SubBenchArray[i].Goals;
                        // var SubPoints = SubBenchArray[i].Points;
                        var SubShots = SubBenchArray[i].Shots;
                        var SubShotsOnTarget = SubBenchArray[i].ShotsOnTarget;
                        
                        var updateUserSub = firebase.database().ref('/teams').child(myUserId).child('/players').orderByChild('UserID').equalTo(UserID);
                            updateUserSub.on("child_added", function(snapshot) {


                            if(snapshot.exists()) 
                            {
                                // Push stats to the player USER Account
                                var updateStats2 = {
                                    totalGoals: firebase.database.ServerValue.increment(SubGoals),
                                    totalShots: firebase.database.ServerValue.increment(SubShots),
                                    totalShotsOnTarget: firebase.database.ServerValue.increment(SubShotsOnTarget)
                                    //totalPoints: firebase.database.ServerValue.increment(Points),
                                };

                                snapshot.ref.update(updateStats2);

                            }
                            else
                            {

                            }
                        });

                }
            }



    
        
    // Send Event Field Locations
    for (var i = 0; i < EventFieldPositions.length; i++) 
        {
       
            //Update YourTeam Game Record
            var EventLocations = firebase.database().ref('/teams').child(myUserId).child('games').child(GameRecordKey).child('EventFieldPositions');

                var data = {
                    x: EventFieldPositions[i].x,
                    y: EventFieldPositions[i].y,
                    GameRecord: GameRecordKey,
                    EventType:EventFieldPositions[i].EventType,
                    PlayerKitNumber:EventFieldPositions[i].PlayerKitNumber,
                    UserID: EventFieldPositions[i].UserID

                };

            EventLocations.push(data);

            //Send field event locations data to the USER ACCOUNT
                    var userEvent = firebase.database().ref('/users').orderByChild("id").equalTo(EventFieldPositions[i].UserID);
                        userEvent.on("child_added", function(snapshot) {
                        if (snapshot.exists()) 
                        {
                        
                     
                            snapshot.ref.child('Events').push(data);
                        }
                        else
                        {
                
                        }
                        
                    });


                //Send stats to Teams/Players record - This will allow temporary accounts to have stats 
               var updatePlayer = firebase.database().ref('/teams').child(myUserId).child('/players').orderByChild('UserID').equalTo(EventFieldPositions[i].UserID);
               updatePlayer.on("child_added", function(snapshot) {

                    if (snapshot.exists()) 
                    {
                        // Push stats to the player player record 
                        var data1 = {
                            x: EventFieldPositions[i].x,
                            y: EventFieldPositions[i].y,
                            GameRecordKey: GameRecordKey,
                            EventType:EventFieldPositions[i].EventType,
                            PlayerKitNumber:EventFieldPositions[i].PlayerKitNumber,
                            PlayerPosition: EventFieldPositions[i].PlayerPosition,
                            UserID: EventFieldPositions[i].UserID
        
                        };
    
                        snapshot.ref.child('Events').push(data1);

                    }
                    else
                    {

                    }
               });

    
            }



        
                //Send Opponents Event field data 
                for (var i = 0; i < OpponentsEventFieldPositions.length; i++) 
                {

        
          
                      

                        var OpponentsEventLocations = firebase.database().ref('/teams').child(myUserId).child('games').child(GameRecordKey).child('OpponentsEventFieldPositions');
                
                    
                            var data2 = {
                                x: OpponentsEventFieldPositions[i].x,
                                y: OpponentsEventFieldPositions[i].y,
                                GameRecord: GameRecordKey,
                                EventType:OpponentsEventFieldPositions[i].EventType,
                                PlayerKitNumber:OpponentsEventFieldPositions[i].PlayerKitNumber,
                                UserID: OpponentsEventFieldPositions[i].UserID,
                                PlayerPosition: OpponentsEventFieldPositions[i].PlayerPosition,

                                UserID: OpponentsEventFieldPositions[i].UserID
                            };

                            OpponentsEventLocations.push(data2);

                
                    
                }

            


            //Send User back to home menu
            this.props.navigation.navigate('Home')

    }





    


    //This is like a toggle, used in both the starting list of players and sub bench as if the player record is not found they are redirected to here as obviously they are a sub
    SubOnPlayer  = async() => {

        var StartingTeamArray = this.state.StartingTeamArray;
        var SubBench = this.state.SubBenchArray;

        var SportType = this.state.SportType;


        //SportType to know the max number that legally can be on the pitch 
        if(SportType == 'GAA')
        {
           //Check if Sub Bench is empty 
           if (SubBench  === undefined || SubBench.length <= 1) 
           {
                  // array empty or does not exist
                  alert('Cannot sub anymore players - You must have at least 1 player on the field');
           }
         
           else
           {
               if(StartingTeamArray.length = 11) 
               {
                   alert('Cannot sub anymore players on - Max 15 players on the field')   
               }
               else
               {
               
                   // This will make all starting team players disappear
                   this.setState({displayStartingTeam: false});
               
                   // display all sub players on the screen 
                   this.setState({displaySubBench: true}, () => {
                       // put the things you wish to occur after you have set your state.
              
                   }); 

               }
           }
       
        }
        else if(SportType == 'Soccer')
        {

            //Check if Sub Bench is empty 
            if (SubBench  === undefined || SubBench.length <= 1) 
            {
                   // array empty or does not exist
                   alert('Cannot sub anymore players - You must have at least 1 player on the field');
            }
          
            else
            {
                if(StartingTeamArray.length = 11) 
                {
                    alert('Cannot sub anymore players on - Max 15 players on the field')   
                }
                else
                {
                
                    // This will make all starting team players disappear
                    this.setState({displayStartingTeam: false});
                
                    // display all sub players on the screen 
                    this.setState({displaySubBench: true}, () => {
                        // put the things you wish to occur after you have set your state.
                     
                    }); 

                    
                }
            }

        }




       

    }



        ObtainFieldPositionSelected = (e) => {
  

        // Make Events disappear
        this.setState({displayEventsContainer: false});


        // Make Field Position appear
        this.setState({displayFieldPositionSelection: false});

    
        //Make undo button disappear
        this.setState({ActivateUndoButtonForFieldSelection:false});

        // This will make all starting team players disappear
        this.setState({displayStartingTeam: false});

        this.setState({displaySubBench: false});

        // This will make all opponents starting team players disappear
        this.setState({displayOpponentsStartingTeam: false});

        this.setState({displayOpponentsSubBench:false});


        //makes Event History display
        this.setState({
            displayEventHistory: false
        });


        //makes Event Pattern display
        this.setState({
            displayEventPattern: false
        });
        

        //Start the timer again
        this.onButtonStart();


        //"your team array"
         var StartingTeamArray = this.state.StartingTeamArray;
         var YourTeamSelectedPlayer = this.state.selectedPlayerKitNumber;
                

        //Opponents Obtain arrays  
        var OpponentsStartingTeamArray = this.state.OpponentsStartingTeamArray;
        var OpponentsSelectedPlayer = this.state.selectedOpponentsPlayerKitNumber;



        if(this.state.selectedEventType == 'Goal')
        {


            if(this.state.selectedPlayerKitNumber == "")
            {

                for (var i = 0; i < OpponentsStartingTeamArray.length; i++) 
                {
                    if(OpponentsSelectedPlayer == OpponentsStartingTeamArray[i].playerKitNumber)
                    {

                            //Execute Opponents Goal

                            var data = {
                                x: e.nativeEvent.locationX, 
                                y: e.nativeEvent.locationY,
                                Team: 'Opponents',
                                EventType:'Goal',
                                PlayerKitNumber:this.state.selectedOpponentsPlayerKitNumber,
                                UserID: OpponentsStartingTeamArray[i].UserID,
                                PlayerPosition: OpponentsStartingTeamArray[i].playerPosition
                            
                            };

                          
                            
                            this.state.OpponentsEventFieldPositions.push(data);

                            console.log(this.state.OpponentsEventFieldPositions);

                    }
                }
            

                this.ExecuteOpponentsGoal();
             
            }
            else
            {

                if(this.state.selectedOpponentsPlayerKitNumber == "")
                {
                
                    for (var i = 0; i < StartingTeamArray.length; i++) 
                    {
                        if(YourTeamSelectedPlayer == StartingTeamArray[i].playerKitNumber)
                        {
                    
                  

                            //Execute "Your Team goal"

                            var data = {
                                x: e.nativeEvent.locationX, 
                                y: e.nativeEvent.locationY,
                                Team: 'YourTeam',
                                EventType:'Goal',
                                PlayerKitNumber: this.state.selectedPlayerKitNumber,
                                UserID: StartingTeamArray[i].UserID,
                                PlayerPosition: StartingTeamArray[i].playerPosition
                            };
                        
                         
                            
                            this.state.EventFieldPositions.push(data);

                        }
                    }

                    this.ExecuteGoal();

                
            
                }
               

            }
            

            this.setState({ActivateUndoButton:false});

          
        }   
        else if(this.state.selectedEventType == 'Pass')
        {

            if(this.state.selectedPlayerKitNumber == "")
            {
                //Execute Opponents Pass

                  var data = {
                    x: e.nativeEvent.locationX,
                    y: e.nativeEvent.locationY,
                    Team: 'Opponents',
                    EventType:'Goal',
                    PlayerKitNumber:this.state.selectedOpponentsPlayerKitNumber,
                    UserID: OpponentsStartingTeamArray[i].UserID,
                    PlayerPosition: OpponentsStartingTeamArray[i].playerPosition
                
                };
                
                this.state.OpponentsEventFieldPositions.push(data);

                // this.ExecuteOpponentsPass();
             
            }
            else
            {

                if(this.state.selectedOpponentsPlayerKitNumber == "")
                {
                    //Execute "Your Team Pass"

                    var data = {
                        x: e.nativeEvent.locationX,
                        y: e.nativeEvent.locationY,
                        Team: 'YourTeam',
                        EventType:'Goal',
                        PlayerKitNumber:this.state.selectedPlayerKitNumber,
                        UserID: StartingTeamArray[i].UserID,
                        PlayerPosition: StartingTeamArray[i].playerPosition
                    
                    };
                    
                    this.state.EventFieldPositions.push(data);

                    this.ExecutePass();
            
                  
    
                }
               

    
            this.setState({ActivateUndoButton:false});

            }
        }
        else if(this.state.selectedEventType == 'Point')
        {


                //GAA only
                this.ExecutePoint();

            this.setState({ActivateUndoButton:false});

        }
        else if(this.state.selectedEventType == 'Shot')
        {   

     
                this.ExecuteShot();
     

            this.setState({ActivateUndoButton:false});

        }
        else if(this.state.selectedEventType == 'Tackle')
        {   



                this.ExecuteTackle();
     

            this.setState({ActivateUndoButton:false});

        }
        else if(this.state.selectedEventType == 'LostTheBall')
        {   

          
     
             
                this.ExecuteLostTheBall();
        

            this.setState({ActivateUndoButton:false});
           


        }
        else if(this.state.selectedEventType == 'Foul')
        {   

      
         
                this.ExecuteFoul();
    

            this.setState({ActivateUndoButton:false});

        }
        else if(this.state.selectedEventType == 'WonTheBall')
        {   

        
                this.ExecuteWonTheBall();
         
            this.setState({ActivateUndoButton:false});


        }
        else if(this.state.selectedEventType == 'Kickout')
        {   

                this.ExecuteKickout();
          

            this.setState({ActivateUndoButton:false});
        
        }

    }


    //we are here -- we need to consider SPORTTYPE
    ExecuteOpponentsGoal = async() => {

        var myUserId = firebase.auth().currentUser.uid;
        var SportType = this.state.SportType;
        var GameRecordKey = this.state.GameRecordKey;
        var OpponentsRecordKey = this.state.OpponentsRecordKey;
           
        var FieldPosition = this.state.FieldPosition;
    

        var TimestampMinute = this.state.MinEventOccured;
        var TimestampSecond =  this.state.SecEventOccured;


         //Reset individual Event pattern message value
         this.setState({
            IndividualEventPatternMessage: ''
        }); 

        //Reset Field Event pattern message value
        this.setState({
            EventFieldPositionPatternMessage: ''
        }); 
    

        //makes Event History display
        this.setState({
            displayEventHistory: true
        });

        //makes Event Pattern display
        this.setState({
            displayEventPattern: true
        });

        //"your team array"
        var s = this.state.StartingTeamArray;
        var YourTeamSelectedPlayer = this.state.selectedPlayerKitNumber;
        
        //Opponents Obtain arrays  
        var OpponentsStartingTeamArray = this.state.OpponentsStartingTeamArray;
        var OpponentsSelectedPlayer = this.state.selectedOpponentsPlayerKitNumber;




                //loop around each item within TeamsheetArray and  find the item with the same playerKitNumber as this.state.selectedPlayerKitNumber value

                var StatsHolder = this.state.StatsHolder;

                for (var i = 0; i < OpponentsStartingTeamArray.length; i++) {
                    if(OpponentsSelectedPlayer == OpponentsStartingTeamArray[i].playerKitNumber)
                    {


                    
                            var stats4 = {
                                UserID: OpponentsStartingTeamArray[i].UserID,
                                fullName: OpponentsStartingTeamArray[i].fullName,
                                playerKitNumber: OpponentsStartingTeamArray[i].playerKitNumber,
                                playerPosition: OpponentsStartingTeamArray[i].playerPosition,
                                eventType: 'Goal',
                                TeamOption: 'Opponents',
                                FieldPosition: FieldPosition,
                                TimestampMinute: TimestampMinute,
                                TimestampSecond: TimestampSecond

                            };

                            StatsHolder.push(stats4);


                            var stats5 = {
                                UserID: OpponentsStartingTeamArray[i].UserID,
                                fullName: OpponentsStartingTeamArray[i].fullName,
                                playerKitNumber: OpponentsStartingTeamArray[i].playerKitNumber,
                                playerPosition: OpponentsStartingTeamArray[i].playerPosition,
                                eventType: 'Shot',
                                TeamOption: 'Opponents',
                                FieldPosition: FieldPosition,
                                TimestampMinute: TimestampMinute,
                                TimestampSecond: TimestampSecond

                            };

                            StatsHolder.push(stats5);

                            
                            var stats6 = {
                                UserID: OpponentsStartingTeamArray[i].UserID,
                                fullName: OpponentsStartingTeamArray[i].fullName,
                                playerKitNumber: OpponentsStartingTeamArray[i].playerKitNumber,
                                playerPosition: OpponentsStartingTeamArray[i].playerPosition,
                                eventType: 'Shot On Target',
                                TeamOption: 'Opponents',
                                FieldPosition: FieldPosition,
                                TimestampMinute: TimestampMinute,
                                TimestampSecond: TimestampSecond

                            };

                            StatsHolder.push(stats6);


                          

                            
                            this.setState((prevState, props) => ({
                                selectedPlayerKitNumber: ''
                            })); 

                            this.setState((prevState, props) => ({
                                selectedOpponentsPlayerKitNumber: ''
                            })); 




                            
                            //"Opponents Array"
                            var OpponentsObjectIndex = OpponentsStartingTeamArray.findIndex((obj => obj.playerKitNumber == OpponentsSelectedPlayer));

                            OpponentsStartingTeamArray[OpponentsObjectIndex].Goals = OpponentsStartingTeamArray[OpponentsObjectIndex].Goals + 1;

                            OpponentsStartingTeamArray[OpponentsObjectIndex].Shots = OpponentsStartingTeamArray[OpponentsObjectIndex].Shots + 1;

                            OpponentsStartingTeamArray[OpponentsObjectIndex].ShotsOnTarget = OpponentsStartingTeamArray[OpponentsObjectIndex].ShotsOnTarget + 1;

                                //add Goal to totalopponentsteamgoals 
                                this.setState((prevState, props) => ({
                                    totalOpponentsTeamGoals: prevState.totalOpponentsTeamGoals + 1
                                })); 


                                // Add shots to totalteamshots
                                this.setState((prevState, props) => ({
                                    totalOpponentsTeamShots: prevState.totalOpponentsTeamShots + 1
                                })); 

                                // Add shots on target to totalteamshotsontarget
                                this.setState((prevState, props) => ({
                                    totalOpponentsTeamShotsOnTarget: prevState.totalOpponentsTeamShotsOnTarget + 1
                                })); 
                

                                                        

        
                                    if(this.state.SportType == 'GAA')
                                    {
                                        //Add a Goal to the Your Team GAA team Game Record
                                        var yourTeam = firebase.database().ref('/teams').child(myUserId)
                                            .child('games').child(GameRecordKey).child('Opponents').child('Stats');
                                            
                                            
                                            yourTeam.on("child_added", function(snapshot) {
            
                                                var update = {OpponentsTeamGAAGoalCounter: firebase.database.ServerValue.increment(1)};
                            
                                                snapshot.ref.update(update);
                                            });
            
            
                                        // Add a goal to the players record
                                        var dd = firebase.database().ref('/teams').child(myUserId)
                                        .child('games').child(GameRecordKey).child('Opponents').child('players').orderByChild('PlayerKitNumber').equalTo(this.state.selectedOpponentsPlayerKitNumber);
                                            dd.on("child_added", function(snapshot) {
            
                                                var update = {Goals:firebase.database.ServerValue.increment(1)};
            
                                                snapshot.ref.update(update);
                                            });
            
                                        // Add a shot to the players record
                                        var dd = firebase.database().ref('/teams').child(myUserId)
                                        .child('games').child(GameRecordKey).child('Opponents').child('players').orderByChild('PlayerKitNumber').equalTo(this.state.selectedOpponentsPlayerKitNumber);
                                            dd.on("child_added", function(snapshot) {
            
                                                var update = {Shots:firebase.database.ServerValue.increment(1)};
            
                                                snapshot.ref.update(update);
                                            });
            
                                        // Add a shot on target to the players record
                                        var dd = firebase.database().ref('/teams').child(myUserId)
                                        .child('games').child(GameRecordKey).child('Opponents').child('players').orderByChild('PlayerKitNumber').equalTo(this.state.selectedOpponentsPlayerKitNumber);
                                            dd.on("child_added", function(snapshot) {
            
                                                var update = {ShotsOnTarget:firebase.database.ServerValue.increment(1)};
            
                                                snapshot.ref.update(update);
                                            });



                                              //Update Opponents Team GAA Goal counter
                                            this.setState((prevState, props) => ({
                                                OpponentsTeamGAAGoalCounter: prevState.OpponentsTeamGAAGoalCounter + 1
                                            })); 
                                    }
                                    else if(this.state.SportType == 'Soccer')
                                    {
                                        
                                        //Add a Goal to the Your Team GAA team Game Record
                                        var yourTeam = firebase.database().ref('/teams').child(myUserId)
                                            .child('games').child(GameRecordKey).child('Opponents').child('Stats');
                                            
                                            
                                            yourTeam.on("child_added", function(snapshot) {
            
                                                var update = {UsersTeamSoccerGoalCounter: firebase.database.ServerValue.increment(1)};
                            
                                                snapshot.ref.update(update);
                                            });
            
            
            
                                        // Add a goal to the players record
                                        var dd = firebase.database().ref('/teams').child(myUserId)
                                         .child('games').child(GameRecordKey).child('Opponents').child('players').orderByChild('PlayerKitNumber').equalTo(this.state.selectedOpponentsPlayerKitNumber);
                                             dd.on("child_added", function(snapshot) {
             
                                                 var update = {Goals:firebase.database.ServerValue.increment(1)};
             
                                                 snapshot.ref.update(update);
                                             });
             
                                        // Add a shot to the players record
                                        var dd = firebase.database().ref('/teams').child(myUserId)
                                         .child('games').child(GameRecordKey).child('Opponents').child('players').orderByChild('PlayerKitNumber').equalTo(this.state.selectedOpponentsPlayerKitNumber);
                                             dd.on("child_added", function(snapshot) {
             
                                                 var update = {Shots:firebase.database.ServerValue.increment(1)};
             
                                                 snapshot.ref.update(update);
                                             });
             
                                        // Add a shot on target to the players record
                                        var dd = firebase.database().ref('/teams').child(myUserId)
                                         .child('games').child(GameRecordKey).child('Opponents').child('players').orderByChild('PlayerKitNumber').equalTo(this.state.selectedOpponentsPlayerKitNumber);
                                             dd.on("child_added", function(snapshot) {
             
                                                 var update = {ShotsOnTarget:firebase.database.ServerValue.increment(1)};
             
                                                 snapshot.ref.update(update);
                                             });


                                             this.setState((prevState, props) => ({
                                                OpponentsTeamSoccerGoalCounter: prevState.OpponentsTeamSoccerGoalCounter + 1
                                            })); 
                                             
                                    }


                        }

            
                    }




                //count number of records where playerkitnumber == YourTeamSelectedPlayer &&  eventType == 'Goal'
                var YourTeamIndividualRecordCounter = 0;
                var OpponentsIndividualRecordCounter = 0;
                var YourTeamRecordCounter = 0;
                var OpponentsRecordCounter = 0;

                var YourTeamEventFieldPositionPatternCounter = 0;
                var OpponentsEventFieldPositionPatternCounter = 0;
                
              
                for (var i = 0; i < StatsHolder.length; i++) 
                {
                    //Check team stats - Team Event Patterns
                    if(StatsHolder[i].eventType == 'Goal' && StatsHolder[i].TeamOption == 'YourTeam')
                    {
                        YourTeamRecordCounter++;

                        var TeamName = this.state.TeamName;

                        if(YourTeamRecordCounter >=4)
                        {
                            this.setState({
                                TeamEventPatternMessage: TeamName + ' has scored ' + YourTeamRecordCounter + ' goals'
                            }); 
                        }

                    }
                    else if (StatsHolder[i].eventType == 'Goal' && StatsHolder[i].TeamOption == 'Opponents')
                    {
                        OpponentsRecordCounter++;

                        var OpponentName = this.state.OpponentName;

                        if(OpponentsRecordCounter >=4)
                        {
                            this.setState({
                                TeamEventPatternMessage: OpponentName + ' have scored ' + OpponentsRecordCounter + ' goals'
                            }); 
                        }

                    }

                    //Check Individual Event Patterns
                    if(StatsHolder[i].playerKitNumber == YourTeamSelectedPlayer && StatsHolder[i].eventType == 'Goal' && StatsHolder[i].TeamOption == 'YourTeam')
                    {
                        YourTeamIndividualRecordCounter++;
                    
                        var TeamName = this.state.TeamName;

                        if(YourTeamIndividualRecordCounter >=4)
                        {
                            //alert user 
                        //update frontend message
                            this.setState({
                                IndividualEventPatternMessage: TeamName + ': - Player Number ' + StatsHolder[i].playerKitNumber + ' has scored ' + YourTeamIndividualRecordCounter + ' goals'
                            }); 
                        }
                    }
                    else if(StatsHolder[i].playerKitNumber == OpponentsSelectedPlayer && StatsHolder[i].eventType == 'Goal' && StatsHolder[i].TeamOption == 'Opponents') 
                    {
                        OpponentsIndividualRecordCounter++;
                    
                        var OpponentName = this.state.OpponentName;

                        if(OpponentsIndividualRecordCounter >=4)
                        {
                            //alert user 
                        //update frontend message
                            this.setState({
                                IndividualEventPatternMessage: OpponentName + ': - Player Number ' + StatsHolder[i].playerKitNumber + ' has scored ' + OpponentsIndividualRecordCounter + ' goals'
                            }); 
                        }
                    }


                    //Event Field Position Pattern 
                    if(StatsHolder[i].eventType == 'Goal' && StatsHolder[i].TeamOption == 'YourTeam' && StatsHolder[i].FieldPosition == FieldPosition)
                    {
                        YourTeamEventFieldPositionPatternCounter++;

                        var TeamName = this.state.TeamName;

                        if(YourTeamEventFieldPositionPatternCounter >=4)
                        {
                            this.setState({
                                EventFieldPositionPatternMessage: TeamName + ' have scored a goal from this position - ' + FieldPosition + ' ' +  YourTeamEventFieldPositionPatternCounter + ' times'
                            }); 
                        }
                    }
                    else if (StatsHolder[i].eventType == 'Goal' && StatsHolder[i].TeamOption == 'Opponents' && StatsHolder[i].FieldPosition == FieldPosition)
                    {
                        OpponentsEventFieldPositionPatternCounter++;

                          
                        var OpponentName = this.state.OpponentName;

                        if(OpponentsEventFieldPositionPatternCounter >=4)
                        {
                            this.setState({
                                EventFieldPositionPatternMessage: OpponentName + ' have scored a goal from this position - ' + FieldPosition + ' ' + OpponentsEventFieldPositionPatternCounter + ' times'
                            }); 
                        }

                    }
                }
            
        

    }
   

    
    //"Your Team Goal"
    ExecuteGoal = async() => {
    
        var myUserId = firebase.auth().currentUser.uid;
        var SportType = this.state.SportType;
        var GameRecordKey = this.state.GameRecordKey;
        var OpponentsRecordKey = this.state.OpponentsRecordKey;
           
        var FieldPosition = this.state.FieldPosition;
    

        var TimestampMinute = this.state.MinEventOccured;
        var TimestampSecond =  this.state.SecEventOccured;


     

        //Reset individual Event pattern message value
        this.setState({
            IndividualEventPatternMessage: ''
        }); 

        //Reset Field Event pattern message value
        this.setState({
            EventFieldPositionPatternMessage: ''
        }); 
    

        //makes Event History display
        this.setState({
            displayEventHistory: true
        });

        //makes Event Pattern display
        this.setState({
            displayEventPattern: true
        });

        //"your team array"
        var s = this.state.StartingTeamArray;
        var YourTeamSelectedPlayer = this.state.selectedPlayerKitNumber;
        
        //Opponents Obtain arrays  
        var OpponentsStartingTeamArray = this.state.OpponentsStartingTeamArray;
        var OpponentsSelectedPlayer = this.state.selectedOpponentsPlayerKitNumber;




        //loop around each item within TeamsheetArray and  find the item with the same playerKitNumber as this.state.selectedPlayerKitNumber value
        for (var i = 0; i < s.length; i++) {
            if(YourTeamSelectedPlayer == s[i].playerKitNumber)
            {
                var StatsHolder = this.state.StatsHolder;



                if(SportType == 'GAA')
                {

                var stats = {
                    UserID: s[i].UserID,
                    fullName: s[i].fullName,
                    playerKitNumber: s[i].playerKitNumber,
                    playerPosition: s[i].playerPosition,
                    eventType: 'Goal',
                    TeamOption: 'YourTeam',
                    FieldPosition: FieldPosition,
                    TimestampMinute: TimestampMinute,
                    TimestampSecond: TimestampSecond

                };

                StatsHolder.push(stats);


                var stats1 = {
                    UserID: s[i].UserID,
                    fullName: s[i].fullName,
                    playerKitNumber: s[i].playerKitNumber,
                    playerPosition: s[i].playerPosition,
                    eventType: 'Shot',
                    TeamOption: 'YourTeam',
                    FieldPosition: FieldPosition,
                    TimestampMinute: TimestampMinute,
                    TimestampSecond: TimestampSecond

                };

                StatsHolder.push(stats1);

                this.setState((prevState, props) => ({
                    UsersTeamGAAGoalCounter: prevState.UsersTeamGAAGoalCounter + 1
                })); 

       


            }
            else if(SportType == 'Soccer')
            {
                var stats = {
                    UserID: s[i].UserID,
                    fullName: s[i].fullName,
                    playerKitNumber: s[i].playerKitNumber,
                    playerPosition: s[i].playerPosition,
                    eventType: 'Goal',
                    TeamOption: 'YourTeam',
                    FieldPosition: FieldPosition,
                    TimestampMinute: TimestampMinute,
                    TimestampSecond: TimestampSecond

                };

                StatsHolder.push(stats);


                var stats1 = {
                    UserID: s[i].UserID,
                    fullName: s[i].fullName,
                    playerKitNumber: s[i].playerKitNumber,
                    playerPosition: s[i].playerPosition,
                    eventType: 'Shot',
                    TeamOption: 'YourTeam',
                    FieldPosition: FieldPosition,
                    TimestampMinute: TimestampMinute,
                    TimestampSecond: TimestampSecond

                };

                StatsHolder.push(stats1);

                
                var stats2 = {
                    UserID: s[i].UserID,
                    fullName: s[i].fullName,
                    playerKitNumber: s[i].playerKitNumber,
                    playerPosition: s[i].playerPosition,
                    eventType: 'Shot On Target',
                    TeamOption: 'YourTeam',
                    FieldPosition: FieldPosition,
                    TimestampMinute: TimestampMinute,
                    TimestampSecond: TimestampSecond

                };

                StatsHolder.push(stats2);


                this.setState((prevState, props) => ({
                    UsersTeamSoccerGoalCounter: prevState.   UsersTeamSoccerGoalCounter + 1
                })); 


            }

        }

    }
                this.setState((prevState, props) => ({
                    selectedPlayerKitNumber: ''
                })); 

                this.setState((prevState, props) => ({
                    selectedOpponentsPlayerKitNumber: ''
                })); 


                

         

                 

                    //"Your Team array "
                    var objectIndex = s.findIndex((obj => obj.playerKitNumber == YourTeamSelectedPlayer));

                    s[objectIndex].Goals = s[objectIndex].Goals + 1;

                    s[objectIndex].Shots = s[objectIndex].Shots + 1;

                    s[objectIndex].ShotsOnTarget = s[objectIndex].ShotsOnTarget + 1;


                        // Add goal to totalteamgoals
                        this.setState((prevState, props) => ({
                            totalTeamGoals: prevState.totalTeamGoals + 1
                        })); 

                        // Add shots to totalteamshots
                        this.setState((prevState, props) => ({
                            totalTeamShots: prevState.totalTeamShots + 1
                        })); 

                        // Add shots on target to totalteamshotsontarget
                        this.setState((prevState, props) => ({
                            totalTeamShotsOnTarget: prevState.totalTeamShotsOnTarget + 1
                        })); 


                     

                      

                        if(this.state.SportType == 'GAA')
                        {
                         

                            // Add a goal to the players record
                            var dd = firebase.database().ref('/teams').child(myUserId)
                            .child('games').child(GameRecordKey).child('YourTeam').child('players').orderByChild('PlayerKitNumber').equalTo(this.state.selectedPlayerKitNumber);
                                dd.on("child_added", function(snapshot) {

                                    var update = {Goals:firebase.database.ServerValue.increment(1)};

                                    snapshot.ref.update(update);
                                });

                            // Add a shot to the players record
                            var dd = firebase.database().ref('/teams').child(myUserId)
                            .child('games').child(GameRecordKey).child('YourTeam').child('players').orderByChild('PlayerKitNumber').equalTo(this.state.selectedPlayerKitNumber);
                                dd.on("child_added", function(snapshot) {

                                    var update = {Shots:firebase.database.ServerValue.increment(1)};

                                    snapshot.ref.update(update);
                                });

                             // Add a shot on target to the players record
                            var dd = firebase.database().ref('/teams').child(myUserId)
                             .child('games').child(GameRecordKey).child('YourTeam').child('players').orderByChild('PlayerKitNumber').equalTo(this.state.selectedPlayerKitNumber);
                                 dd.on("child_added", function(snapshot) {

                                     var update = {ShotsOnTarget:firebase.database.ServerValue.increment(1)};

                                     snapshot.ref.update(update);
                                 });
                        }
                        else if(this.state.SportType == 'Soccer')
                        {
                            
                            // Add a goal to the players record
                            var dd = firebase.database().ref('/teams').child(myUserId)
                             .child('games').child(GameRecordKey).child('YourTeam').child('players').orderByChild('PlayerKitNumber').equalTo(this.state.selectedPlayerKitNumber);
                                 dd.on("child_added", function(snapshot) {
 
                                     var update = {Goals:firebase.database.ServerValue.increment(1)};
 
                                     snapshot.ref.update(update);
                                 });
 
                            // Add a shot to the players record
                            var dd = firebase.database().ref('/teams').child(myUserId)
                             .child('games').child(GameRecordKey).child('YourTeam').child('players').orderByChild('PlayerKitNumber').equalTo(this.state.selectedPlayerKitNumber);
                                 dd.on("child_added", function(snapshot) {
 
                                     var update = {Shots:firebase.database.ServerValue.increment(1)};
 
                                     snapshot.ref.update(update);
                                 });
 
                            // Add a shot on target to the players record
                            var dd = firebase.database().ref('/teams').child(myUserId)
                             .child('games').child(GameRecordKey).child('YourTeam').child('players').orderByChild('PlayerKitNumber').equalTo(this.state.selectedPlayerKitNumber);
                                 dd.on("child_added", function(snapshot) {
 
                                     var update = {ShotsOnTarget:firebase.database.ServerValue.increment(1)};
 
                                     snapshot.ref.update(update);
                                 });

                        }
                                    

                
            

      
            //   //count number of records where playerkitnumber == YourTeamSelectedPlayer &&  eventType == 'Goal'
              var YourTeamIndividualRecordCounter = 0;
              var OpponentsIndividualRecordCounter = 0;
              var YourTeamRecordCounter = 0;
              var OpponentsRecordCounter = 0;

              var YourTeamEventFieldPositionPatternCounter = 0;
              var OpponentsEventFieldPositionPatternCounter = 0;

              for (var i = 0; i < StatsHolder.length; i++) 
              {
                  //Check team stats - Team Event Patterns
                  if(StatsHolder[i].eventType == 'Goal' && StatsHolder[i].TeamOption == 'YourTeam')
                  {
                      YourTeamRecordCounter++;

                      var TeamName = this.state.TeamName;

                      if(YourTeamRecordCounter >=4)
                      {
                          this.setState({
                              TeamEventPatternMessage: TeamName + ' has scored ' + YourTeamRecordCounter + ' goals'
                          }); 
                      }

                  }
                  else if (StatsHolder[i].eventType == 'Goal' && StatsHolder[i].TeamOption == 'Opponents')
                  {
                      OpponentsRecordCounter++;

                      var OpponentName = this.state.OpponentName;

                      if(OpponentsRecordCounter >=4)
                      {
                          this.setState({
                              TeamEventPatternMessage: OpponentName + ' have scored ' + OpponentsRecordCounter + ' goals'
                          }); 
                      }

                  }



                  //Check Individual Event Patterns -- GOALS
                  if(StatsHolder[i].playerKitNumber == YourTeamSelectedPlayer && StatsHolder[i].eventType == 'Goal' && StatsHolder[i].TeamOption == 'YourTeam')
                  {
                      YourTeamIndividualRecordCounter++;
                  
                      var TeamName = this.state.TeamName;

                      if(YourTeamIndividualRecordCounter >=4)
                      {
                          //alert user 
                      //update frontend message
                          this.setState({
                              IndividualEventPatternMessage: TeamName + ': - Player Number ' + StatsHolder[i].playerKitNumber + ' has scored ' + YourTeamIndividualRecordCounter + ' goals'
                          }); 
                      }
                  }
                  else if(StatsHolder[i].playerKitNumber == OpponentsSelectedPlayer && StatsHolder[i].eventType == 'Goal' && StatsHolder[i].TeamOption == 'Opponents') 
                  {
                      OpponentsIndividualRecordCounter++;
                  
                      var OpponentName = this.state.OpponentName;

                      if(OpponentsIndividualRecordCounter >=4)
                      {
                          //alert user 
                      //update frontend message
                          this.setState({
                              IndividualEventPatternMessage: OpponentName + ': - Player Number ' + StatsHolder[i].playerKitNumber + ' has scored ' + OpponentsIndividualRecordCounter + ' goals'
                          }); 
                      }
                  }


                   //Check Individual Event Patterns -- ShotsOnTarget
                    if(StatsHolder[i].playerKitNumber == YourTeamSelectedPlayer && StatsHolder[i].eventType == 'ShotsOnTarget' && StatsHolder[i].TeamOption == 'YourTeam')
                    {
                        YourTeamIndividualRecordCounter++;
                    
                        var TeamName = this.state.TeamName;

                        if(YourTeamIndividualRecordCounter >=4)
                        {
                            //alert user 
                        //update frontend message
                            this.setState({
                                IndividualEventPatternMessage: TeamName + ': - Player Number ' + StatsHolder[i].playerKitNumber + ' hit ' + YourTeamIndividualRecordCounter + ' shots on target'
                            }); 
                        }
                    }
                    else if(StatsHolder[i].playerKitNumber == OpponentsSelectedPlayer && StatsHolder[i].eventType == 'ShotsOnTarget' && StatsHolder[i].TeamOption == 'Opponents') 
                    {
                        OpponentsIndividualRecordCounter++;
                    
                        var OpponentName = this.state.OpponentName;

                        if(OpponentsIndividualRecordCounter >=4)
                        {
                        //alert user 
                        //update frontend message
                            this.setState({
                                IndividualEventPatternMessage: OpponentName + ': - Player Number ' + StatsHolder[i].playerKitNumber + ' hit ' + OpponentsIndividualRecordCounter + ' shots on target'
                            }); 
                        }
                    }


                  //Check Individual Event Patterns -- Shots
                  if(StatsHolder[i].playerKitNumber == YourTeamSelectedPlayer && StatsHolder[i].eventType == 'Shots' && StatsHolder[i].TeamOption == 'YourTeam')
                  {
                      YourTeamIndividualRecordCounter++;
                  
                      var TeamName = this.state.TeamName;

                      if(YourTeamIndividualRecordCounter >=4)
                      {
                        //alert user 
                      //update frontend message
                          this.setState({
                              IndividualEventPatternMessage: TeamName + ': - Player Number ' + StatsHolder[i].playerKitNumber + ' has had ' + YourTeamIndividualRecordCounter + ' shots'
                          }); 
                      }
                  }
                  else if(StatsHolder[i].playerKitNumber == OpponentsSelectedPlayer && StatsHolder[i].eventType == 'ShotsOnTarget' && StatsHolder[i].TeamOption == 'Opponents') 
                  {
                      OpponentsIndividualRecordCounter++;
                  
                      var OpponentName = this.state.OpponentName;

                      if(OpponentsIndividualRecordCounter >=4)
                      {
                          //alert user 
                      //update frontend message
                          this.setState({
                              IndividualEventPatternMessage: OpponentName + ': - Player Number ' + StatsHolder[i].playerKitNumber + ' has had ' + OpponentsIndividualRecordCounter + ' shots'
                          }); 
                      }
                  }

              }
          

            }

    


    
       

    

    ExecutePoint = async() => {

        var displayEventHistory = this.state.displayEventHistory;
        
        //makes Event History display
        this.setState({
            displayEventHistory: true
        }); 

        //makes Event Pattern display
        this.setState({
            displayEventPattern: true
        });

     
        //Reset individual Event pattern message value
        this.setState({
            IndividualEventPatternMessage: ''
        }); 

        //Reset Field Event pattern message value
        this.setState({
            EventFieldPositionPatternMessage: ''
        }); 
    

    }

    ExecuteShot = async() => {

        var displayEventHistory = this.state.displayEventHistory;
        
        //makes Event History display
        this.setState({
            displayEventHistory: true
        }); 


        //makes Event Pattern display
        this.setState({
            displayEventPattern: true
        });

        
       
        //Reset individual Event pattern message value
        this.setState({
            IndividualEventPatternMessage: ''
        }); 

        //Reset Field Event pattern message value
        this.setState({
            EventFieldPositionPatternMessage: ''
        }); 
    

    }

    ExecuteTackle = async() => {

        var displayEventHistory = this.state.displayEventHistory;
      //makes Event History display
      this.setState({
        displayEventHistory: true
    }); 


       //makes Event Pattern display
       this.setState({
        displayEventPattern: true
    });

    
        //Reset individual Event pattern message value
        this.setState({
            IndividualEventPatternMessage: ''
        }); 

        //Reset Field Event pattern message value
        this.setState({
            EventFieldPositionPatternMessage: ''
        }); 
    


    }

    ExecuteLostTheBall = async() => {

        var displayEventHistory = this.state.displayEventHistory;
      //makes Event History display
      this.setState({
        displayEventHistory: true
    }); 


          //makes Event Pattern display
          this.setState({
            displayEventPattern: true
        });

        
        //Reset individual Event pattern message value
        this.setState({
            IndividualEventPatternMessage: ''
        }); 

        //Reset Field Event pattern message value
        this.setState({
            EventFieldPositionPatternMessage: ''
        }); 
    

    }
    ExecuteFoul= async() => {


        var displayEventHistory = this.state.displayEventHistory;
      //makes Event History display
      this.setState({
        displayEventHistory: true
    }); 


       //makes Event Pattern display
       this.setState({
        displayEventPattern: true
    });

    
        //Reset individual Event pattern message value
        this.setState({
            IndividualEventPatternMessage: ''
        }); 

        //Reset Field Event pattern message value
        this.setState({
            EventFieldPositionPatternMessage: ''
        }); 
    
        

    }

    ExecuteWonTheBall = async() => {

        var displayEventHistory = this.state.displayEventHistory;
      //makes Event History display
      this.setState({
        displayEventHistory: true
    }); 

    //makes Event Pattern display
    this.setState({
        displayEventPattern: true
    });

    
        //Reset individual Event pattern message value
        this.setState({
            IndividualEventPatternMessage: ''
        }); 

        //Reset Field Event pattern message value
        this.setState({
            EventFieldPositionPatternMessage: ''
        }); 
    

    }
    ExecuteKickout = async() => {
        
        var displayEventHistory = this.state.displayEventHistory;
      //makes Event History display
      this.setState({
        displayEventHistory: true
    }); 

       //makes Event Pattern display
       this.setState({
        displayEventPattern: true
    });

    
        //Reset individual Event pattern message value
        this.setState({
            IndividualEventPatternMessage: ''
        }); 

        //Reset Field Event pattern message value
        this.setState({
            EventFieldPositionPatternMessage: ''
        }); 
    
        

    }

    ExecutePass = async() => {
    
        var myUserId = firebase.auth().currentUser.uid;
        var SportType = this.state.SportType;
        var GameRecordKey = this.state.GameRecordKey;;
           
        var FieldPosition = this.state.FieldPosition;
    

        var TimestampMinute = this.state.MinEventOccured;
        var TimestampSecond =  this.state.SecEventOccured;


        //Reset individual Event pattern message value
        this.setState({
            IndividualEventPatternMessage: ''
        }); 

        //Reset Field Event pattern message value
        this.setState({
            EventFieldPositionPatternMessage: ''
        }); 
    

        //makes Event History display
        this.setState({
            displayEventHistory: true
        });
        
           //makes Event Pattern display
           this.setState({
            displayEventPattern: true
        });



        if(SportType == 'GAA')
        {

 
            // Add a pass to the players record
            var dd = firebase.database().ref('/teams').child(myUserId)
            .child('games').child('teamsheet').child('gamePlayers').child(GameRecordKey).orderByChild('PlayerKitNumber').equalTo(this.state.selectedPlayerKitNumber);
                dd.on("child_added", function(snapshot) {

                    var update = {Passes:firebase.database.ServerValue.increment(1)};

                    snapshot.ref.update(update);
                });

           



 //loop around each item within TeamsheetArray and  find the item with the same playerKitNumber as this.state.selectedPlayerKitNumber value

 var s = this.state.StartingTeamArray;
 var YourTeamSelectedPlayer = this.state.selectedPlayerKitNumber;


    var objectIndex = s.findIndex((obj => obj.playerKitNumber == YourTeamSelectedPlayer));

    s[objectIndex].Passes = s[objectIndex].Passes + 1;


    //Add goal to totalteamgoals
 
    this.setState((prevState, props) => ({
        totalTeamPasses: prevState.totalTeamPasses + 1
    })); 



    var StatsHolder = this.state.StatsHolder;


 for (var i = 0; i < s.length; i++) {
     if(YourTeamSelectedPlayer == s[i].playerKitNumber)
     {


    
            var stats = {
                UserID: s[i].UserID,
                fullName: s[i].fullName,
                playerKitNumber: s[i].playerKitNumber,
                playerPosition: s[i].playerPosition,
                eventType: 'Pass',
                FieldPosition: FieldPosition,
                TimestampMinute: TimestampMinute,
                TimestampSecond: TimestampSecond

            };

            StatsHolder.push(stats);

        }
    }

        
        //count number of records where playerkitnumber == YourTeamSelectedPlayer &&  eventType == 'Goal'
        var IndividualRecordCounter = 0;
        var recordCounter = 0;
        var EventFieldPositionPatternCounter = 0;

        for (var i = 0; i < StatsHolder.length; i++) 
        {
        //Check team stats - Team Event Patterns
            if(StatsHolder[i].eventType == 'Pass')
            {
                recordCounter++;

                if(recordCounter >=4)
                {




                    this.setState({
                        TeamEventPatternMessage: ' Your Team made ' + recordCounter + ' passes'
                    }); 
                }

            }
        //Check Individual Event Patterns
            if(StatsHolder[i].playerKitNumber == YourTeamSelectedPlayer && StatsHolder[i].eventType == 'Pass')
            {
                IndividualRecordCounter++;
               

                if(IndividualRecordCounter >=4)
                {
                    //alert user 
                   //update frontend message
                    this.setState({
                        IndividualEventPatternMessage: ' Player Number - ' + StatsHolder[i].playerKitNumber + ' has made ' + IndividualRecordCounter + ' passes'
                    }); 
                }
            } 
         }



       

    
        }
        else if (SportType == 'Soccer')
        {

            // Add a pass to the players record
            var dd = firebase.database().ref('/teams').child(myUserId)
            .child('games').child('teamsheet').child('gamePlayers').child(GameRecordKey).orderByChild('PlayerKitNumber').equalTo(this.state.selectedPlayerKitNumber);
                dd.on("child_added", function(snapshot) {

                    var update = {Passes:firebase.database.ServerValue.increment(1)};

                    snapshot.ref.update(update);
                });

  



            //loop around each item within TeamsheetArray and  find the item with the same playerKitNumber as this.state.selectedPlayerKitNumber value

            var s = this.state.StartingTeamArray;
            var YourTeamSelectedPlayer = this.state.selectedPlayerKitNumber;


            var objectIndex = s.findIndex((obj => obj.playerKitNumber == YourTeamSelectedPlayer));

            s[objectIndex].Passes = s[objectIndex].Passes + 1;


            //Add goal to totalteamgoals

            this.setState((prevState, props) => ({
            totalTeamPasses: prevState.totalTeamPasses + 1
            })); 



            var StatsHolder = this.state.StatsHolder;


            for (var i = 0; i < s.length; i++) {
                if(YourTeamSelectedPlayer == s[i].playerKitNumber)
                {

                    var stats = {
                        UserID: s[i].UserID,
                        fullName: s[i].fullName,
                        playerKitNumber: s[i].playerKitNumber,
                        playerPosition: s[i].playerPosition,
                        eventType: 'Pass',
                        FieldPosition: FieldPosition,
                        TimestampMinute: TimestampMinute,
                        TimestampSecond: TimestampSecond

                    };

                    StatsHolder.push(stats);

                }
            }



        //count number of records where playerkitnumber == YourTeamSelectedPlayer &&  eventType == 'Goal'
        var IndividualRecordCounter = 0;
        var recordCounter = 0;

        for (var i = 0; i < StatsHolder.length; i++) 
        {
        //Check team stats - Team Event Patterns
            if(StatsHolder[i].eventType == 'Pass')
            {
                recordCounter++;

                if(recordCounter >=4)
                {
                    this.setState({
                        TeamEventPatternMessage: ' Your Team made ' + recordCounter + ' passes'
                    }); 
                }

            
        //Check Individual Event Patterns
            if(StatsHolder[i].playerKitNumber == YourTeamSelectedPlayer && StatsHolder[i].eventType == 'Pass')
            {
                IndividualRecordCounter++;
            

                if(IndividualRecordCounter >=4)
                {
                    //alert user 
                //update frontend message
                    this.setState({
                        IndividualEventPatternMessage: ' Player Number - ' + StatsHolder[i].playerKitNumber + ' has made ' + IndividualRecordCounter + ' passes'
                    }); 
                }
            } 


          }
        }

      }

    }


    PlotOnField = async() => {
        this.setState({ActivatePlotOnField: true});
        this.setState({ActivateViewFieldPlots: false});
    }
    
   

    DeactivateField = async() => {
        this.setState({ActivatePlotOnField: false});
        this.setState({ActivateViewFieldPlots: false});
    }

    ExecutePlotSelection = async(e)=> {
        var data = {
            x: e.nativeEvent.locationX,
            y: e.nativeEvent.locationY
        
          };
        
          this.state.EventFieldPositions.push(data);

          this.DeactivateField();

        
    }

 


    DetailedGameAnalysis = async() => {

        this.setState({displayReviewGameContainer:false});
        this.setState({DetailedGameAnalysisSelectionView:true});


    }


    ReviewYourTeamDGA = async() => {
        
        this.setState({DetailedGameAnalysisSelectionView:false});

        //Your Team View is toggled on
        this.setState({YourTeamReviewSelection: true});
      
    }

    ReviewOpponentsDGA = async() => {

        this.setState({OpponentsReviewSelection: true});
        this.setState({OpponentEventSelection:false});
        this.setState({DetailedGameAnalysisSelectionView:false});
        this.setState({ReviewDetailGameAnalysis:false});
        this.setState({YourTeamReviewSelection: false});
   
    }

    //(Your Team) - Team Events
    UserSelectsTeamEventsLocations = async() => {
        
        //Sends user to select an event view
        this.setState({EventSelectionTeamDetailAnalysis:true});

        this.setState({YourTeamReviewSelection: false});
    
        this.setState({OpponentsReviewSelection: false});


        this.setState({TeamSelection:false});

        this.setState({OpponentsReviewSelection: false});
        this.setState({OpponentEventSelection:false});
        this.setState({DetailedGameAnalysisSelectionView:false});
        this.setState({ReviewDetailGameAnalysis:false});
    }

    //(Your Team) - individual player
    UserSelectsPlayerEventsLocations = async() => {
        
        //Sends user to Select player view
        this.setState({TeamSelection:true});


        this.setState({YourTeamReviewSelection: false});
        
        this.setState({OpponentsReviewSelection: false});


        this.setState({OpponentsReviewSelection: false});
        this.setState({OpponentEventSelection:false});
        this.setState({DetailedGameAnalysisSelectionView:false});
        this.setState({ReviewDetailGameAnalysis:false});
    }

    //(Opponents) - team event
    UserSelectsOpponentsEventsLocations = async() => {
        
        //Sends user to select an event view
        this.setState({EventSelectionOpponentsDetailAnalysis:true})
        this.setState({YourTeamReviewSelection: false});
    
        this.setState({OpponentsReviewSelection: false});
        


        this.setState({OpponentsSelection:false});
        this.setState({OpponentsReviewSelection: false});
        this.setState({OpponentEventSelection:false});
        this.setState({DetailedGameAnalysisSelectionView:false});
        this.setState({ReviewDetailGameAnalysis:false});
    }
    
    //(Opponents) - individual player
    UserSelectsOpponentsPlayerEventsLocations = async() => {
        
        //Sends user to Select player view
        this.setState({OpponentsSelection:true});
        this.setState({YourTeamReviewSelection: false});
    
        this.setState({OpponentsReviewSelection: false});


       

        this.setState({OpponentsReviewSelection: false});
      
        this.setState({DetailedGameAnalysisSelectionView:false});
        this.setState({ReviewDetailGameAnalysis:false});

    }

    DetailedAnalysisIndividualSquadPlayer = async() => {
        
        this.setState({displayDetailedIndividualSquadPlayer:true});
        this.setState({TeamSelection:false});
        this.setState({YourTeamReviewSelection: false});
    
        this.setState({OpponentsReviewSelection: false});


        this.setState({displayDetailedIndividualSubBenchPlayer:false})
        this.setState({OpponentsSelection:false});

        this.setState({OpponentsReviewSelection: false});
        this.setState({OpponentEventSelection:false});
        this.setState({DetailedGameAnalysisSelectionView:false});
        this.setState({ReviewDetailGameAnalysis:false});


    }

    DetailedAnalysisIndividualSubBenchPlayer = async() => {
        
        this.setState({displayDetailedIndividualSubBenchPlayer:true});

        this.setState({displayDetailedIndividualSquadPlayer:false});
        this.setState({TeamSelection:false});
        this.setState({YourTeamReviewSelection: false});
    
        this.setState({OpponentsReviewSelection: false});


        this.setState({OpponentsSelection:false});

        this.setState({OpponentsReviewSelection: false});
        this.setState({OpponentEventSelection:false});
        this.setState({DetailedGameAnalysisSelectionView:false});
        this.setState({ReviewDetailGameAnalysis:false});


    }

    OpponentsDetailedAnalysisIndividualSquadPlayer = async() => {
   
        this.setState({displayOpponentsDetailedIndividualSquadPlayer:true});

        this.setState({OpponentsSelection: false});
    }

    OpponentsDetailedAnalysisIndividualSubBenchPlayer = async() => {
        
        this.setState({displayOpponentsDetailedIndividualSubBenchPlayer:true});
        this.setState({OpponentsSelection: false});
    }

    GetSelectedPlayerForDetailedAnalysis = value => () => {
        
        var getKitNumber = value;

        // Obtain the Kit number/Player Selected
        this.setState({
            selectedPlayerKitNumber: getKitNumber
        }, () => console.log(this.state.selectedPlayerKitNumber));


        //Disable player selection 
        this.setState({displayDetailedIndividualSquadPlayer:false});
        this.setState({displayReviewIndividualSquadPlayer:false});

        //Navigate user to select an event
        this.setState({displayDetailedIndividualSquadPlayerEventSelection:true});


     }

    GetSelectedSubBenchPlayerForDetailedAnalysis = value => () => {
        
        var getKitNumber = value;

        // Obtain the Kit number/Player Selected
        this.setState({
            selectedPlayerKitNumber: getKitNumber
        }, () => console.log(this.state.selectedPlayerKitNumber));
    

        //Navigate user to select an event
        this.setState({displayDetailedIndividualSubBenchEventSelection:true});

        //Disable player selection 
        this.setState({displayDetailedIndividualSubBenchPlayer:false});
        this.setState({displayReviewIndividualSubBenchPlayer:false});

    }

    RemovePlayer

  
    GetSelectedOpponentsPlayerForDetailedAnalysis = value => () => {
        
        var getKitNumber = value;

        // Obtain the Kit number/Player Selected
        this.setState({
            selectedOpponentsPlayerKitNumber: getKitNumber
        }, () => console.log(this.state.selectedOpponentsPlayerKitNumber));

        //Navigate user to select an event
        this.setState({displayDetailedIndividualOpponentsSquadPlayerEventSelection:true});


        //Disable player selection
        this.setState({displayOpponentsDetailedIndividualSquadPlayer:false});
        this.setState({displayReviewOpponentsIndividualSquadPlayer:false});

   

    }

    GetSelectedOpponentsSubBenchPlayerForDetailedAnalysis = value => () => {
        
        var getKitNumber = value;

        // Obtain the Kit number/Player Selected
        this.setState({
            selectedPlayerKitNumber: getKitNumber
        }, () => console.log(this.state.selectedPlayerKitNumber));

       //Navigate user to select an event
       this.setState({EventSelectionOpponentsDetailAnalysis:true});

       //Disable player selection
       this.setState({displayOpponentsDetailedIndividualSubBenchPlayer: false});
       this.setState({displayReviewOpponentsIndividualSubBenchPlayer:false});


        
        

    }



//----------------------Detailed Analysis Execute functions-------------------------


 //---------------------------YourTeam (Users) Detailed Analysis Execute functions -------------------------------
    SelectEventPlayerDetailedAnalysis = async() => {

        this.setState({displayDetailedIndividualSquadPlayerEventSelection: false});
        this.setState({displayReviewIndividualSquadPlayer: false});

        this.setState({displayReviewIndividualSubBenchPlayer: false});



        var EventFieldPositions = this.state.EventFieldPositions;

        //Temp array
        var DetailAnalysisStatHolder = this.state.DetailAnalysisStatHolder;

        var YourTeamEventSelection = this.state.YourTeamEventSelection;

        var selectedPlayerKitNumber = this.state.selectedPlayerKitNumber;




        //Clear DetailAnalysisStatHolder as this is only a temp array
        DetailAnalysisStatHolder.splice(0,DetailAnalysisStatHolder.length);

        // Logic for Field position and get data based on Event

        //Loop through EventFieldPositions 
            //Condition useing Event Selection , playerkitnumber


        for (var i = 0; i < EventFieldPositions.length; i++) 
        {
            if(EventFieldPositions[i].EventType == YourTeamEventSelection && EventFieldPositions[i].PlayerKitNumber == selectedPlayerKitNumber)
            {
                var data = {
                    x:EventFieldPositions[i].x,
                    y:EventFieldPositions[i].y,
                };

                //Push to Array
                this.state.DetailAnalysisStatHolder.push(data);
              

            }
            
        }

        //toggle off Scoreboard  
        this.setState({ScoreboardContainerToggle:false});
        

        //Display detailed analysis Screen + execute logic
        this.setState({ExecuteDetailAnalysis: true});
        
        this.setState({displayReviewYourTeamIndividualPlayerStatsContainer: false});
      
        this.setState({displayReviewIndividualPlayerStatsContainer:false});

        this.setState({displayDetailedIndividualSquadPlayerEventSelection:false});

        this.setState({displayDetailedIndividualSubBenchEventSelection: false});
        this.setState({ActivateUndoReviewButton:true});

    }
//---------------------------- YOUR TEAM Event Field Event Location Logic ---------------------------------------------

ExecuteTeamDetailAnalysis = async() => {

        //disable Event selection view
        this.setState({EventSelectionTeamDetailAnalysis:false});

        //Logic
        //disable Event selection view
        this.setState({EventSelectionOpponentsDetailAnalysis:false});
        
        var EventFieldPositions = this.state.EventFieldPositions;

        //Temp array
        var DetailAnalysisStatHolder = this.state.DetailAnalysisStatHolder;

        var YourTeamEventSelection = this.state.YourTeamEventSelection;

        //Logic

        //Clear DetailAnalysisStatHolder as this is only a temp array
        DetailAnalysisStatHolder.splice(0,DetailAnalysisStatHolder.length);


        // Make field appear

        for (var i = 0; i < EventFieldPositions.length; i++) 
        {
            if(EventFieldPositions[i].EventType == YourTeamEventSelection)
            {
                var data = {
                    x:EventFieldPositions[i].x,
                    y:EventFieldPositions[i].y,
                    UserID:EventFieldPositions[i].UserID,
                };

                //Push to Array
                this.state.DetailAnalysisStatHolder.push(data);
              

            }
            
        }

        //Display detailed analysis Screen + execute logic
        //Execute Detailed Team analysis
        this.setState({ExecuteTeamDetailAnalysisView: true});
        this.setState({ActivateUndoReviewButton: true});



        //toggle off Scoreboard  
        this.setState({ScoreboardContainerToggle:false});
    }








  
 //----------------------Opponents Detailed Analysis Execute functions - TEAM------------------
    ExecuteOpponentsDetailAnalysis = async() => {

        //disable Event selection view
        this.setState({EventSelectionOpponentsDetailAnalysis:false});
        

        
        var OpponentsEventFieldPositions = this.state.OpponentsEventFieldPositions;

 
        //Temp array
        var OpponentsDetailAnalysisStatHolder = this.state.OpponentsDetailAnalysisStatHolder;

        var YourTeamEventSelection = this.state.YourTeamEventSelection;

        //Logic

        //Clear DetailAnalysisStatHolder as this is only a temp array
        OpponentsDetailAnalysisStatHolder.splice(0,OpponentsDetailAnalysisStatHolder.length);




        for (var i = 0; i < OpponentsEventFieldPositions.length; i++) 
        {
            if(OpponentsEventFieldPositions[i].EventType == YourTeamEventSelection)
            {
                var data = {
                    x:OpponentsEventFieldPositions[i].x,
                    y:OpponentsEventFieldPositions[i].y,
                    UserID:OpponentsEventFieldPositions[i].UserID,
                };

                //Push to Array
                this.state.OpponentsDetailAnalysisStatHolder.push(data);
              

            }
            
        }

          //Display detailed analysis Screen + execute logic
          this.setState({ExecuteDetailOpponentsTeamAnalysis: true});
          this.setState({ActivateUndoReviewButton:true});


    }



    SelectEventOpponentsPlayerDetailedAnalysis = async() => {

        this.setState({EventSelectionOpponentsDetailAnalysis:false});


        var OpponentsEventFieldPositions = this.state.OpponentsEventFieldPositions;

        //Temp array
        var OpponentsDetailAnalysisStatHolder= this.state.OpponentsDetailAnalysisStatHolder;

        var YourTeamEventSelection = this.state.YourTeamEventSelection;

        var selectedPlayerKitNumber = this.state.selectedOpponentsPlayerKitNumber;




        //Clear DetailAnalysisStatHolder as this is only a temp array
        OpponentsDetailAnalysisStatHolder.splice(0,OpponentsDetailAnalysisStatHolder.length);

        // Logic for Field position and get data based on Event

        //Loop through OpponentsEventFieldPositions 
            //Condition useing Event Selection , playerkitnumber


        for (var i = 0; i < OpponentsEventFieldPositions.length; i++) 
        {
            if(OpponentsEventFieldPositions[i].EventType == YourTeamEventSelection && OpponentsEventFieldPositions[i].PlayerKitNumber == selectedPlayerKitNumber)
            {
                var data = {
                    x:OpponentsEventFieldPositions[i].x,
                    y:OpponentsEventFieldPositions[i].y,
                    UserID:OpponentsEventFieldPositions[i].UserID,
                };

                //Push to Array
                this.state.OpponentsDetailAnalysisStatHolder.push(data);
              

            }
            
        }
        

        //Display detailed analysis Screen + execute logic
        this.setState({ExecuteOpponentsTeamDetailAnalysis: true});
        this.setState({displayDetailedIndividualOpponentsSquadPlayerEventSelection:false});
        this.setState({ActivateUndoReviewButton:true});

    }

  
//---------------------------------------------------------------------------------------


//Team Analysis






// --------------------------- Your Team  + Opponents Team Percentages---------------------

ExecuteTeamPercentages  = async() => {

    this.setState({displayTeamPercentages: true});

    var YourTeamEventSelection = this.state.YourTeamEventSelection;

    // Check which Event they selected 

    //Goal - This would be like Shots that resulted in goals percents
        if(YourTeamEventSelection == 'Goal')
        {
            //Shooting Percentage = Goals Scored ÷ Shots on Goal
                    // Get number of shots
                    // Get number of Goals

                    //but doesnt goals get a shot as well

        
        }
        else if(YourTeamEventSelection == 'Point')
        {
            //Prob need another stats for this , like wide of failed attempt to a Point
        }
        else if(YourTeamEventSelection == 'Shots On Target')
        {
            //Shots on Target Percentage = Goals Scored ÷ Shots on Goal
        }
        else if(YourTeamEventSelection == 'Pass')
        {

            //May need a successful pass stat
            //Successful Passes 

        }

        

}

ExecuteOpponentsPercentages = async() => {

    this.setState({displayOpponentPercentages: true});

    var OpponentEventSelection = this.state.OpponentEventSelection;

    // Check which Event they selected 

    //Goal - This would be like Shots that resulted in goals percents
        if(OpponentEventSelection == 'Goal')
        {
            //Shooting Percentage = Goals Scored ÷ Shots on Goal
                    // Get number of shots
                    // Get number of Goals

                    //but doesnt goals get a shot as well

                    //Set this event percentage
                    //this.setState({GoalSuccessPercent:CalculatedPercentage}); 

        
        }
        else if(OpponentEventSelection == 'Point')
        {
            //Prob need another stats for this , like wide of failed attempt to a Point
             //this.setState({GoalSuccessPercent:CalculatedPercentage}); 
        
        }
        else if(OpponentEventSelection == 'Shots On Target')
        {
            //Shots on Target Percentage = Goals Scored ÷ Shots on Goal
        }
        else if(OpponentEventSelection == 'Pass')
        {

            //May need a successful pass stat
            //Successful Passes 

        }







}






    



        render(){
            var SportType = this.state.SportType;
            var PlayerContainer;
      
       
            var SubPlayerContainer;
            var ScoreboardContainer;
            var GAAEventContainer;
            var SoccerEventContainer;
            var FieldPositionSelectionContainer;
            var UndoButton;
            var OpponentsMode;
            var GAAContainer;
         
            var EventPositionDisplay;
            var EventsPatternContainer;
            var HistoryContainer;

            var ReviewGameContainer;
            var ReviewTotalTeamStatsContainer;
            var ReviewOpponentsTotalTeamStatsContainer;
            var ReviewIndividualPlayerStatsContainer;
            var ReviewIndividualSquadPlayer;
            var ReviewIndividualSubBenchPlayer;
        
            var ReviewOpponentsTeamStats;
            var ReviewDetailGameAnalysis;
            var ReviewDetailGameAnalysisOptions;

            var IndividualStatsTable;

            //Field Plot System
            var PlotOnField;
            var ViewFieldPlots;
        

            var ActivatePlotOnField = this.state.ActivatePlotOnField;
            var ActivateViewFieldPlots = this.state.ActivateViewFieldPlots;
            
            var DetailedGameAnalysisSelectionView = this.state.DetailedGameAnalysisSelectionView;

            var YourTeamReviewSelection = this.state.YourTeamReviewSelection;
            var OpponentsReviewSelection = this.state.OpponentsReviewSelection;
            var ScoreboardContainerToggle = this.state.ScoreboardContainerToggle;
            var ReviewYourTeamEventLocationsView = this.state.ReviewYourTeamEventLocationsView;



            var TeamSelection = this.state.TeamSelection;
            var OpponentsSelection = this.state.OpponentsSelection;
            
   
      
     
            
            var TeamEventPercentages = this.state.TeamEventPercentages;
            var OpponentsEventPercentages = this.state.OpponentsEventPercentages;
      

            //Team stats 
            var TotalTeamGoals = this.state.totalTeamGoals;
            var TotalTeamPoints = this.state.totalTeamPoints;
            var TotalTeamPasses = this.state.totalTeamPasses;
            var TotalTeamShots = this.state.totalTeamShots;
            var TotalTeamShotsOnTarget = this.state.totalTeamShotsOnTarget;

            //Opponents Team stats 
            var TotalOpponentsTeamGoals = this.state.totalOpponentsTeamGoals;
            var TotalOpponentsTeamPoints = this.state.TotalOpponentsTeamPoints;
            var TotalOpponentsTeamPasses = this.state.totalOpponentsTeamPasses;
            var TotalOpponentsTeamShots = this.state.totalOpponentsTeamShots;
            var TotalOpponentsTeamShotsOnTarget = this.state.totalOpponentsTeamShotsOnTarget;
   

            var StatsTable;
            
            
            var displayFieldPositionSelection = this.state.displayFieldPositionSelection;
            var displayEventsContainer = this.state.displayEventsContainer;
            var displayStartingTeam = this.state.displayStartingTeam;
            var displaySubBench = this.state.displaySubBench;

            var displayReviewGameContainer= this.state.displayReviewGameContainer;
            var displayReviewTotalTeamStatsContainer = this.state.displayReviewTotalTeamStatsContainer;
            var displayReviewOpponentsTotalTeamStatsContainer = this.state.displayReviewOpponentsTotalTeamStatsContainer;

            var displayReviewIndividualPlayerStatsContainer = this.state.displayReviewIndividualPlayerStatsContainer;
            var displayReviewYourTeamIndividualPlayerStatsContainer = this.state.displayReviewYourTeamIndividualPlayerStatsContainer;
            var displayReviewOpponentsIndividualPlayerStatsContainer = this.state.displayReviewOpponentsIndividualPlayerStatsContainer;
 
            var displayIndividualPlayerStatsTable = this.state.displayIndividualPlayerStatsTable;
            var displayReviewIndividualSquadPlayer = this.state.displayReviewIndividualSquadPlayer;
            var displayReviewIndividualSubBenchPlayer = this.state.displayReviewIndividualSubBenchPlayer;
            var displayReviewOpponentsIndividualSquadPlayer = this.state.displayReviewOpponentsIndividualSquadPlayer;
            var displayReviewOpponentsIndividualSubBenchPlayer = this.state.displayReviewOpponentsIndividualSubBenchPlayer;
            var displayReviewOpponentsIndividualSubBench = this.state.displayReviewOpponentsIndividualSubBench;
            var displayReviewYourTeamIndividualSquadPlayer = this.state.displayReviewYourTeamIndividualSquadPlayer;
            var displayReviewYourTeamIndividualSubBenchPlayer = this.state.displayReviewYourTeamIndividualSubBenchPlayer;
            var displayReviewOpponentsIndividualPlayers = this.state.displayReviewOpponentsIndividualPlayers;
            var displayOpponentsStartingTeam = this.state.displayOpponentsStartingTeam;
            var displayOpponentsSubBench = this.state.displayOpponentsSubBench;



            //Detailed Analysis 
            var displayDetailedIndividualSquadPlayer = this.state.displayDetailedIndividualSquadPlayer;
            var displayDetailedIndividualSubBenchPlayer = this.state.displayDetailedIndividualSubBenchPlayer;

            var displayDetailedIndividualSquadPlayerEventSelection = this.state.displayDetailedIndividualSquadPlayerEventSelection;
            var displayDetailedIndividualSubBenchEventSelection = this.state.displayDetailedIndividualSubBenchEventSelection;

            var displayOpponentsDetailedIndividualSquadPlayer = this.state.displayOpponentsDetailedIndividualSquadPlayer;
            var displayOpponentsDetailedIndividualSubBenchPlayer = this.state.displayOpponentsDetailedIndividualSubBenchPlayer;
            
            var displayDetailedIndividualOpponentsSquadPlayerEventSelection = this.state.displayDetailedIndividualOpponentsSquadPlayerEventSelection;
            var displayDetailedIndividualOpponentsSubBenchEventSelection = this.state.displayDetailedIndividualOpponentsSubBenchEventSelection;

            var displayDetailedTeamEvents = this.state.displayDetailedTeamEvents;
            var displayOpponentsTeamEvents = this.state.displayOpponentsTeamEvents;
          
            var selectedPlayerKitNumber = this.state.selectedPlayerKitNumber;
            var selectedOpponentsPlayerKitNumber = this.state.selectedOpponentsPlayerKitNumber;

            var YourTeamEventSelection = this.state.YourTeamEventSelection;
            var OpponentsEventSelection = this.state.OpponentsEventSelection;

            var displayTeamPercentages = this.state.displayTeamPercentages;
            var displayOpponentsPercentages = this.state.displayOpponentsPercentages;

            var ExecuteDetailAnalysis = this.state.ExecuteDetailAnalysis;
            var ExecuteSubBenchDetailAnalysis = this.state.ExecuteSubBenchDetailAnalysis;  // is this needed?

            var ExecuteOpponentsDetailAnalysis = this.state.ExecuteOpponentsDetailAnalysis;
            var ExecuteOpponentsSubBenchDetailAnalysis = this.state.ExecuteOpponentsSubBenchDetailAnalysis;// is this needed?
            var ExecuteOpponentsTeamDetailAnalysis = this.state.ExecuteOpponentsTeamDetailAnalysis;
            var ExecuteDetailTeamAnalysis = this.state.ExecuteDetailTeamAnalysis;
            var ExecuteDetailOpponentsTeamAnalysis = this.state.ExecuteDetailOpponentsTeamAnalysis;

            var ReviewDetailGameAnalysisFieldView = this.state.ReviewDetailGameAnalysisFieldView;


            //test 
            var ExecuteTeamDetailAnalysisView = this.state.ExecuteTeamDetailAnalysisView;

            //Team Event DA
            var EventSelectionTeamDetailAnalysis = this.state.EventSelectionTeamDetailAnalysis;
            var EventSelectionOpponentsDetailAnalysis = this.state.EventSelectionOpponentsDetailAnalysis;

          
            var ActivateUndoReviewButton = this.state.ActivateUndoReviewButton;
            var ActivateUndoButtonForFieldSelection = this.state.ActivateUndoButtonForFieldSelection;
            
            //========================================================================================================


            var ActivateUndoButton = this.state.ActivateUndoButton;

            var YourTeamMode = this.state.YourTeamMode;


            var displayEventHistory = this.state.displayEventHistory;
            var displayEventPattern = this.state.displayEventPattern;

            //event pattern message frontend
            var TeamEventPatternMessage = this.state.TeamEventPatternMessage;
            var IndividualEventPatternMessage = this.state.IndividualEventPatternMessage;
            var EventFieldPositionPatternMessage = this.state.EventFieldPositionPatternMessage;


            var selectedPlayerKitNumber = this.state.selectedPlayerKitNumber;
            var selectedEventType = this.state.selectedEventType;
            var MinEventOccured = this.state.MinEventOccured;
            var SecEventOccured = this.state.SecEventOccured;

            var StatsHolder = this.state.StatsHolder;
  
     

        
                // Review game  - Half time or mid game 
                if(displayReviewGameContainer == true )
                { 

                    if(SportType == 'GAA' || SportType == 'Soccer')
                    {

                        ReviewGameContainer = (

                            <View style={styles.ReviewContainer}>
                                <View style={styles.columnView}>

                                    <TouchableOpacity
                                        onPress={this.ExitReviewDetailAnalysis}
                                        activeOpacity={0.6}
                                        style={styles.ExitButton} 
                                
                                    > 
                                      <Image style={styles.ExitButton} source={require('./exit.png')}/> 
                                    </TouchableOpacity>

                                </View>


                                <View style={styles.columnView}>

                                <TouchableOpacity
                                    onPress={this.ReviewTotalTeamStats}
                                    activeOpacity={0.6}
                                    style={styles.button} 

                                > 
                                    <Text style={styles.buttonText}>Review Total Team Stats</Text>
                                </TouchableOpacity>

                                </View>


                                <View style={styles.columnView}>

                                <TouchableOpacity
                                    onPress={this.ReviewOpponentsTotalTeamStats}
                                    activeOpacity={0.6}
                                    style={styles.button} 

                                > 
                                    <Text style={styles.buttonText}>Review Opponents Total Team Stats</Text>
                                </TouchableOpacity>

                                </View>

                                <View style={styles.columnView}>
                                    <TouchableOpacity
                                        onPress={this.ReviewIndividualPlayerStats}
                                        activeOpacity={0.6}
                                        style={styles.button} 
                                
                                    > 
                                        <Text style={styles.buttonText}>Review Individual Player Stats</Text>
                                    </TouchableOpacity>

                                </View>

                                <View style={styles.columnView}>
                                    <TouchableOpacity
                                        onPress={this.DetailedGameAnalysis}
                                        activeOpacity={0.6}
                                        style={styles.button} 
                            
                                    > 
                                        <Text style={styles.buttonText}>Detailed Game Analysis</Text>
                                    </TouchableOpacity>
                                </View>


                            </View>
                        

                        );

                    }

                }

                //Total Team Stats
                if(displayReviewTotalTeamStatsContainer == true)
                {
                    if(SportType == 'GAA')
                    {

                        ReviewTotalTeamStatsContainer = (

                            <View style={styles.StatsTable}>

                        
                                <View style={styles.StatsRow}>
                        
                                    <View style={styles.column}>
                                    <Text style={styles.StatsTitle}> Total Team Stats</Text>
                                
                                        <Text style={styles.StatsText}>Goals: {TotalTeamGoals}</Text>
                                        <Text style={styles.StatsText}>Points:</Text>
                                        <Text style={styles.StatsText}>Passes: {TotalTeamPasses}</Text>
                                        <Text style={styles.StatsText}>Shots: {TotalTeamShots}</Text>
                                        <Text style={styles.StatsText}>Shots on target: {TotalTeamShotsOnTarget} </Text>
                                        <Text style={styles.StatsText}>Tackle:</Text>

                                
                                    </View>

                                    <View style={styles.column}>
                                            <Text style={styles.StatsText}>Won the ball:</Text>
                                            <Text style={styles.StatsText}>Lost the ball:</Text>
                                            <Text style={styles.StatsText}>Yellow Cards:</Text>
                                            <Text style={styles.StatsText}>Red Cards:</Text>
                                            <Text style={styles.StatsText}>Assists:</Text>
                                    </View>

                                </View>

                            </View>

                        );

                    }
                    else if(SportType == 'Soccer')
                    {
                        
                        ReviewTotalTeamStatsContainer = (

                            <View style={styles.StatsTable}>

                        
                                <View style={styles.StatsRow}>
                        
                                    <View style={styles.column}>
                                    <Text style={styles.StatsTitle}> Total Team Stats</Text>
                                
                                        <Text style={styles.StatsText}>Goals: {TotalTeamGoals}</Text>
                                        <Text style={styles.StatsText}>Passes: {TotalTeamPasses}</Text>
                                        <Text style={styles.StatsText}>Shots: {TotalTeamShots}</Text>
                                        <Text style={styles.StatsText}>Shots on target: {TotalTeamShotsOnTarget} </Text>
                                        <Text style={styles.StatsText}>Tackle:</Text>

                                
                                    </View>

                                    <View style={styles.column}>
                                            <Text style={styles.StatsText}>Won the ball:</Text>
                                            <Text style={styles.StatsText}>Lost the ball:</Text>
                                            <Text style={styles.StatsText}>Yellow Cards:</Text>
                                            <Text style={styles.StatsText}>Red Cards:</Text>
                                            <Text style={styles.StatsText}>Assists:</Text>
                                    </View>

                                </View>

                            </View>

                        );
                    }

                }


                if(displayReviewOpponentsTotalTeamStatsContainer == true)
                {

                    
                    if(SportType == 'GAA')
                    {

                        ReviewOpponentsTotalTeamStatsContainer = (

                                <View style={styles.StatsTable}>

                            
                                        <View style={styles.StatsRow}>
                                
                                            <View style={styles.column}>
                                            <Text style={styles.StatsTitle}> Total Opponents Team Stats</Text>
                                        
                                                <Text style={styles.StatsText}>Goals: {TotalOpponentsTeamGoals}</Text>
                                                <Text style={styles.StatsText}>Points:</Text>
                                                <Text style={styles.StatsText}>Passes: </Text>
                                                <Text style={styles.StatsText}>Shots: {TotalOpponentsTeamShots}</Text>
                                                <Text style={styles.StatsText}>Shots on target: {TotalOpponentsTeamShotsOnTarget} </Text>
                                                <Text style={styles.StatsText}>Tackle:</Text>

                                        
                                            </View>

                                            <View style={styles.column}>
                                                    <Text style={styles.StatsText}>Won the ball:</Text>
                                                    <Text style={styles.StatsText}>Lost the ball:</Text>
                                                    <Text style={styles.StatsText}>Yellow Cards:</Text>
                                                    <Text style={styles.StatsText}>Red Cards:</Text>
                                                    <Text style={styles.StatsText}>Assists:</Text>
                                            </View>

                                        </View>

                                    </View>

                            );

                        }
                        else if(SportType == 'Soccer')
                        {
                            ReviewOpponentsTotalTeamStatsContainer = (

                                <View style={styles.StatsTable}>

                            
                                        <View style={styles.StatsRow}>
                                
                                            <View style={styles.column}>
                                            <Text style={styles.StatsTitle}> Total Opponents Team Stats</Text>

                                                <Text style={styles.StatsText}>Goals: {TotalOpponentsTeamGoals}</Text>
                                                <Text style={styles.StatsText}>Passes: </Text>
                                                <Text style={styles.StatsText}>Shots: {TotalOpponentsTeamShots}</Text>
                                                <Text style={styles.StatsText}>Shots on target: {TotalOpponentsTeamShotsOnTarget} </Text>
                                                <Text style={styles.StatsText}>Tackle:</Text>

                                        
                                            </View>

                                            <View style={styles.column}>
                                                    <Text style={styles.StatsText}>Won the ball:</Text>
                                                    <Text style={styles.StatsText}>Lost the ball:</Text>
                                                    <Text style={styles.StatsText}>Yellow Cards:</Text>
                                                    <Text style={styles.StatsText}>Red Cards:</Text>
                                                    <Text style={styles.StatsText}>Assists:</Text>
                                            </View>

                                        </View>

                                    </View>

                            );
                        }
                }
                   


                        if(displayReviewIndividualPlayerStatsContainer == true)
                        {

                            

                                //Review Your Team or Opponents Team
                                
                                ReviewIndividualPlayerStatsContainer = (
                                    
                                    <View style={styles.ReviewContainer}>
                                        <TouchableOpacity
                                                    onPress={this.ExitReviewDetailAnalysis}
                                                    activeOpacity={0.6}
                                                    style={styles.ExitButton} 
                                            > 
                                            <Image style={styles.ExitButton} source={require('./exit.png')}/> 
                                        </TouchableOpacity>

                                            <View style={styles.playerColumnView}>   
                                                <Text style={styles.buttonText}>Review Individual Player Stats - Select a team to review</Text>
                                            </View>

                                        
                                
                                           
                                                
                                                <View style={styles.playerColumnView}>
                                                    
                                                            <TouchableOpacity
                                                            onPress={this.ReviewYourTeam}
                                                                    activeOpacity={0.6}
                                                                    style={styles.button} 
                                                    
                                                                > 
                                                                <Text style={styles.buttonText}>Your Team</Text>
                                                            </TouchableOpacity>
                                                </View>


                                                    <View style={styles.playerColumnView}>
                                                                <TouchableOpacity
                                                                    onPress={this.ReviewOpponentsTeam}
                                                                    activeOpacity={0.6}
                                                                    style={styles.button} 
                                                        
                                                                > 
                                                                    <Text style={styles.buttonText}>Opponents Team</Text>
                                                                </TouchableOpacity>
                                                    </View>
                                
                                        </View>

                                );

                            


                        }
                        
                        //Your Team 
                        if(displayReviewYourTeamIndividualPlayerStatsContainer == true)
                        {

                            ReviewIndividualPlayerStatsContainer = (
                                <View style={styles.ReviewContainer}>
                                         
                                        <View style={styles.playerColumnView}>
                                            <TouchableOpacity
                                                onPress={this.ExitReviewDetailAnalysis}
                                                activeOpacity={0.6}
                                                style={styles.ExitButton} 
                                                > 
                                                <Image style={styles.ExitButton} source={require('./exit.png')}/> 
                                            </TouchableOpacity>
                                        </View>

                                        <Text style={styles.buttonText}>Review a individual player from your team - Select an option</Text>
                                       
                                                
                                        <View style={styles.playerColumnView}>
                                            
                                                    <TouchableOpacity
                                                    onPress={this.ReviewIndividualSquadPlayer}
                                                            activeOpacity={0.6}
                                                            style={styles.button} 
                                            
                                                        > 
                                                        <Text style={styles.buttonText}>Squad Player</Text>
                                                    </TouchableOpacity>
                                            </View>

                                            <View style={styles.playerColumnView}>
                                                        <TouchableOpacity
                                                            onPress={this.ReviewIndividualSubBenchPlayer}
                                                            activeOpacity={0.6}
                                                            style={styles.button} 
                                                
                                                        > 
                                                            <Text style={styles.buttonText}>Sub Bench</Text>
                                                        </TouchableOpacity>
                                            </View>
                        
                                </View>

                            );

                        }

                        if(displayReviewIndividualSquadPlayer == true)
                        {
           
                               ReviewIndividualSquadPlayer =  (
                            
                                   <View style ={styles.playerRowView}>
           
                                       {this.state.StartingTeamArray.map((data,element) => {
                                           return (
                                               <View key={element} style={styles.listItemContainer}>
                                                   <View style={styles.playerColumnView}>
                                                       <TouchableOpacity style={styles.StartingKitNumberbutton} value={data.playerKitNumber} onPress={this.GetSelectedPlayerStats(data.playerKitNumber)}>
                                                           <Text style={styles.buttonText}>{data.playerKitNumber}</Text>
                                                       </TouchableOpacity> 
                                                   </View>
                                               </View>
                                           )
                                       })}
           

           
                                   </View>
                               );
           
                        }
   
   
                       if(displayReviewIndividualSubBenchPlayer == true)
                       {
                                ReviewIndividualSubBenchPlayer = ( 
           
                                   <View style ={styles.playerRowView}>
           
                                             
           
                                                   {this.state.SubBenchArray.map((data,element) => {
                                                       return (
                                                           <View key={element} style={styles.listItemContainer}>
                                                               <View style={styles.playerColumnView}>
                                                                   <TouchableOpacity style={styles.SubKitNumberbutton} value={data.playerKitNumber} onPress={this.GetSelectedSubBenchPlayerForDetailedAnalysis(data.playerKitNumber)}>
                                                                       <Text style={styles.buttonText}>{data.playerKitNumber}</Text> 
                                                                   </TouchableOpacity> 
                                                               </View>
                                                           </View>
                                                       )
                                                   })}
           
                                         
           
           
                                   </View>
           
           
                                 
                               );
   
                              
                       }


                       if(displayOpponentsDetailedIndividualSquadPlayer == true)
                       {
                            ReviewIndividualSquadPlayer =  (
                            
                                                                
                                <View style ={styles.playerRowView}>
        
                                    {this.state.OpponentsStartingTeamArray.map((data,element) => {
                                        return (
                                            <View key={element} style={styles.listItemContainer}>
                                                <View style={styles.playerColumnView}>
                                                    <TouchableOpacity style={styles.StartingKitNumberbutton} value={data.playerKitNumber} onPress={this.GetSelectedOpponentsPlayerForDetailedAnalysis(data.playerKitNumber)}>
                                                        <Text style={styles.buttonText}>{data.playerKitNumber}</Text>
                                                    </TouchableOpacity> 
                                                </View>
                                            </View>
                                        )
                                    })}
        
                                
                            
        
                                </View>
                            );
                       }

                       if(displayOpponentsDetailedIndividualSubBenchPlayer == true)
                       {
                            ReviewIndividualSubBenchPlayer = ( 
            
                                <View style ={styles.playerRowView}>

                                                {this.state.OpponentsSubBenchArray.map((data,element) => {
                                                    return (
                                                        <View key={element} style={styles.listItemContainer}>
                                                            <View style={styles.playerColumnView}>
                                                                <TouchableOpacity style={styles.SubKitNumberbutton} value={data.playerKitNumber} onPress={this.GetSelectedOpponentsSubBenchPlayerForDetailedAnalysis(data.playerKitNumber)}>
                                                                    <Text style={styles.buttonText}>{data.playerKitNumber}</Text> 
                                                                </TouchableOpacity> 
                                                            </View>
                                                        </View>
                                                    )
                                                })}
        
                                    
        
        
                                </View>
        
        
                            
                            );
                       }










                       //displays DetailedIndividualSquadPlayer EventSelection
                       if(displayDetailedIndividualSquadPlayerEventSelection == true)
                       {

                            if(SportType == 'GAA')
                            {

                                ReviewDetailGameAnalysis =  (
                                   
                           
                                    <View style={{backgroundColor:'#ffffff' ,  top:hp('20%') }}>
                                
                                         <TouchableOpacity activeOpacity={0.6} style={styles.ExitButton} onPress={this.ExitReviewDetailAnalysis}>
                                             <Image style={styles.ExitButton} source={require('./exit.png')}/> 
                                         </TouchableOpacity> 
                                   

                                                <Picker
                                                    selectedValue={this.state.YourTeamEventSelection}
                                                 
                                                    onValueChange={(text) => this.setState({YourTeamEventSelection:text})}
                                                >
                                
                                                <Picker.Item label="Select a event" value="" />
                                                <Picker.Item label="Goal" value="Goal" />
                                                <Picker.Item label="Point" value="Point"/>
                                                <Picker.Item label="Shots" value="Shots"/>
                                                <Picker.Item label="Shots on target" value="ShotsOnTarget"/>
                                                <Picker.Item label="Pass" value="Pass"/>
                                
                                
                                                </Picker>
                                            
                              
                                                    <TouchableOpacity activeOpacity={0.6} style={styles.button3} onPress={this.SelectEventPlayerDetailedAnalysis}>
                                                        <Text style={styles.buttonText}>Submit</Text>
                                                    </TouchableOpacity>
                                             
                                             
                                                            
                                    </View> 

                                    

                                );

                            }

                            
                            else if(SportType == 'Soccer')
                            {
                                ReviewDetailGameAnalysis =  (
                                    <View style={{backgroundColor:'#ffffff' ,  top:hp('20%') }}>
                             
                                     
                                            <TouchableOpacity activeOpacity={0.6} style={styles.ExitButton} onPress={this.ExitReviewDetailAnalysis}>
                                                <Image style={styles.ExitButton} source={require('./exit.png')}/> 
                                            </TouchableOpacity> 
                                   

                                       

                                            <Picker
                                                selectedValue={this.state.YourTeamEventSelection}
                                           
                                                onValueChange={(text) => this.setState({YourTeamEventSelection:text})}
                                            >
                            
                                            <Picker.Item label="Select a event" value="" />
                                            <Picker.Item label="Goal" value="Goal" />
                                            <Picker.Item label="Pass" value="Pass"/>
                                            <Picker.Item label="Shots" value="Shots"/>
                                            <Picker.Item label="Shots on target" value="ShotsOnTarget"/>
                            
                            
                                            </Picker>

                                                               
                                                <TouchableOpacity activeOpacity={0.6} style={styles.button3} onPress={this.SelectEventPlayerDetailedAnalysis}>
                                                    <Text style={styles.buttonText}>Submit</Text>
                                                </TouchableOpacity>
                                          

                                                        
                                    </View> 

                                );
                            }
                        }
                           
                

                       //Displays Your Team Sub bench EvenEventSelection
                       if(displayDetailedIndividualSubBenchEventSelection == true)
                       {

                            if(SportType == 'GAA')
                            {

                                ReviewDetailGameAnalysis =  (
                                   
                           
                                   
                                      <View style={{backgroundColor:'#ffffff' ,  top:hp('20%'), }}>
                                             
                                                    <TouchableOpacity activeOpacity={0.6} style={styles.ExitButton} onPress={this.ExitReviewDetailAnalysis}>
                                                                <Image style={styles.ExitButton} source={require('./exit.png')}/> 
                                                    </TouchableOpacity> 

                                            
                                         
                                                <Picker
                                                    selectedValue={this.state.YourTeamEventSelection}
                                              
                                                    onValueChange={(text) => this.setState({YourTeamEventSelection:text})}
                                                >
                                
                                                <Picker.Item label="Select a event" value="" />
                                                <Picker.Item label="Goal" value="Goal" />
                                                <Picker.Item label="Point" value="Point"/>
                                                <Picker.Item label="Shots" value="Shots"/>
                                                <Picker.Item label="Shots on target" value="ShotsOnTarget"/>
                                                <Picker.Item label="Pass" value="Pass"/>
                                
                                
                                                </Picker>
                                            
                                   
                                          
                                                    <TouchableOpacity activeOpacity={0.6} style={styles.button3} onPress={this.SelectEventPlayerDetailedAnalysis}>
                                                        <Text style={styles.buttonText}>Submit</Text>
                                                    </TouchableOpacity>
                                               
                                             
                                                            
                                    </View> 

                                    

                                );

                            }

                            
                            else if(SportType == 'Soccer')
                            {
                                ReviewDetailGameAnalysis =  (
                                    <View style={{backgroundColor:'#ffffff' ,  top:hp('20%'), }}>
                                    
                                            <TouchableOpacity activeOpacity={0.6} style={styles.ExitButton} onPress={this.ExitReviewDetailAnalysis}>
                                                <Image style={styles.ExitButton} source={require('./exit.png')}/> 
                                            </TouchableOpacity> 
                                          

                                   
                                            <Picker
                                                selectedValue={this.state.YourTeamEventSelection}
                                              
                                                onValueChange={(text) => this.setState({YourTeamEventSelection:text})}
                                            >
                            
                                            <Picker.Item label="Select a event" value="" />
                                            <Picker.Item label="Goal" value="Goal" />
                                            <Picker.Item label="Pass" value="Pass"/>
                                            <Picker.Item label="Shots" value="Shots"/>
                                            <Picker.Item label="Shots on target" value="ShotsOnTarget"/>
                            
                            
                                            </Picker>

                                                 
                                                <TouchableOpacity activeOpacity={0.6} style={styles.button3} onPress={this.SelectEventPlayerDetailedAnalysis}>
                                                    <Text style={styles.buttonText}>Submit</Text>
                                                </TouchableOpacity>
                                           

                                                        
                                    </View> 

                                );
                            }
                        }

                      



                      // - Opponent Player event selection
                      
                       //displays DetailedIndividualSquadPlayer EventSelection
                       if(displayDetailedIndividualOpponentsSquadPlayerEventSelection == true)
                       {

                            if(SportType == 'GAA')
                            {

                                ReviewDetailGameAnalysis =  (
                                    <View style={{backgroundColor:'#ffffff' ,  top:hp('30%'), }}>
                                        
                                                    <TouchableOpacity activeOpacity={0.6} style={styles.ExitButton} onPress={this.ExitReviewDetailAnalysis}>
                                                                <Image style={styles.ExitButton} source={require('./exit.png')}/> 
                                                    </TouchableOpacity> 
                                           

                                    
                                             <Picker
                                                selectedValue={this.state.YourTeamEventSelection}
                                               
                                                onValueChange={(text) => this.setState({YourTeamEventSelection:text})}
                                              >
                                              <Picker.Item label="Select a event" value="" />
                                              <Picker.Item label="Goal" value="Goal" />
                                              <Picker.Item label="Point" value="Point"/>
                                              <Picker.Item label="Shots" value="Shots"/>
                                              <Picker.Item label="Shots on target" value="ShotsOnTarget"/>
                                              <Picker.Item label="Pass" value="Pass"/>
                        
                        
                                            </Picker>

                                
                                                <TouchableOpacity activeOpacity={0.6} style={styles.button3} onPress={this.SelectEventOpponentsPlayerDetailedAnalysis}>
                                                    <Text style={styles.buttonText}>Submit</Text>
                                                </TouchableOpacity>
                                       
     
                                    </View> 

                                );

                            }
                            else if(SportType == 'Soccer')
                            {

                                ReviewDetailGameAnalysis =  (
                                    <View style={{backgroundColor:'#ffffff' ,  top:hp('30%'), }}>
                                            
                                          
                                                    <TouchableOpacity activeOpacity={0.6} style={styles.ExitButton} onPress={this.ExitReviewDetailAnalysis}>
                                                                <Image style={styles.ExitButton} source={require('./exit.png')}/> 
                                                    </TouchableOpacity> 
                                            

                                        
                                             <Picker
                                                selectedValue={this.state.YourTeamEventSelection}
                                              
                                                onValueChange={(text) => this.setState({YourTeamEventSelection:text})}
                                              >
                                              <Picker.Item label="Select a event" value="" />
                                              <Picker.Item label="Goal" value="Goal" />
                                              <Picker.Item label="Shots" value="Shots"/>
                                              <Picker.Item label="Shots on target" value="ShotsOnTarget"/>
                                              <Picker.Item label="Pass" value="Pass"/>
                        
                        
                                            </Picker>

                                                        
                                                <TouchableOpacity activeOpacity={0.6} style={styles.button3} onPress={this.SelectEventOpponentsPlayerDetailedAnalysis}>
                                                    <Text style={styles.buttonText}>Submit</Text>
                                                </TouchableOpacity>
                                       
     
                                    </View> 

                                );
                            }
                            
                        
                        }



// Your Team event locations
if(ExecuteTeamDetailAnalysisView == true)
{
    if(SportType == 'GAA')
    {
            if(screenWidth < 600 || screenHeight < 376)
            {

                ReviewDetailGameAnalysisFieldView = (

                            <View>
                                    <View style={styles.ReviewContainer2}>
                                        
                                        <View style={styles.rowView}>
                                            <TouchableOpacity activeOpacity={0.6} style={styles.ExitButton} onPress={this.ExitReviewDetailAnalysis}>
                                                <Image style={styles.ExitButton} source={require('./exit.png')}/>
                                            </TouchableOpacity>
                                        </View>
                                                                    
                                        <View style={styles.rowView}>
                                            <Text style={styles.StatsTitle}> Event Type: {YourTeamEventSelection}</Text>
                                        </View>  

                                    </View>

                                    <View style = {styles.fieldcontainer1}>
                        
                                    <Image style = {styles.imageGAAMobile} source={require('./GAApitch1.png')}/> 
                                        {this.state.DetailAnalysisStatHolder.map((data) => {
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
                                    </View>
                            </View>        
                        );
                
            }
            else
            {

                ReviewDetailGameAnalysisFieldView = (

                            <View>
                                    <View style={styles.ReviewContainer2}>
                                        
                                        <View style={styles.rowView}>
                                            <TouchableOpacity activeOpacity={0.6} style={styles.ExitButton} onPress={this.ExitReviewDetailAnalysis}>
                                                <Image style={styles.ExitButton} source={require('./exit.png')}/>
                                            </TouchableOpacity>
                                        </View>
                                                                    
                                        <View style={styles.rowView}>
                                            <Text style={styles.StatsTitle}> Event Type: {YourTeamEventSelection}</Text>
                                        </View>  

                                    </View>

                                    <View style = {styles.fieldcontainer1}>
                        
                                    <Image style = {styles.imagePxGAA} source={require('./GAApitch1.png')}/> 
                                        {this.state.DetailAnalysisStatHolder.map((data) => {
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
                                    </View>
                            </View>        
                        );
            }

    }
    else if(SportType == 'Soccer')
    {
            if(screenWidth < 600 || screenHeight < 376)
            {
                
                ReviewDetailGameAnalysisFieldView = (

                    <View>
                    
                        <View style={styles.ReviewContainer2}>
                                <View style={styles.rowView}>
                                    <TouchableOpacity activeOpacity={0.6} style={styles.ExitButton} onPress={this.ExitReviewDetailAnalysis}>
                                        <Image style={styles.ExitButton} source={require('./exit.png')}/>
                                    </TouchableOpacity>
                                </View>
                                
                                <View style={styles.rowView}>
                                    <Text style={styles.StatsTitle}> Event Type: {YourTeamEventSelection}</Text>
                                </View>  

                        </View>    
                    
                        <View style = {styles.fieldcontainer1}>
                                <Image style = {styles.imageSoccerMobile} source={require('./SoccerField.png')}/> 
                                {this.state.DetailAnalysisStatHolder.map((data) => {
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
                        </View>
                    </View>

                );
            
            }
            else
            {
                ReviewDetailGameAnalysisFieldView = (
                    <View>

                                     <View style={styles.ReviewContainer2}>
                                             <View style={styles.rowView}>
                                                  <TouchableOpacity activeOpacity={0.6} style={styles.ExitButton} onPress={this.ExitReviewDetailAnalysis}>
                                                     <Image style={styles.ExitButton} source={require('./exit.png')}/>
                                                  </TouchableOpacity>
                                             </View>
                                            
                                             <View style={styles.rowView}>
                                                 <Text style={styles.StatsTitle}> Event Type: {YourTeamEventSelection}</Text>
                                             </View>  
                    
                                     </View>    
                    
                                     <View style = {styles.fieldcontainer1}>
                                             <Image style = {styles.imagePxSoccer} source={require('./SoccerField.png')}/> 
                                             {this.state.DetailAnalysisStatHolder.map((data) => {
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
                                    </View>
                    
                                    </View>
                );
            }

    }
}





// -------------------------- Opponents Team Detailed Event Location ----------------------
//Execute Team Location Events - e.g All Passes locations 
 if(ExecuteDetailOpponentsTeamAnalysis == true)
    {

        if(SportType == 'GAA')
        {

                if(screenWidth < 600 || screenHeight < 376)
                {

                        ReviewDetailGameAnalysisFieldView = (
                            <View>
                                    <View style={styles.ReviewContainer2}>
                                        
                                        <View style={styles.rowView}>
                                            <TouchableOpacity activeOpacity={0.6} style={styles.ExitButton} onPress={this.ExitReviewDetailAnalysis}>
                                                <Image style={styles.ExitButton} source={require('./exit.png')}/>
                                            </TouchableOpacity>
                                        </View>
                                                                    
                                        <View style={styles.rowView}>
                                            <Text style={styles.StatsTitle}> Event Type: {YourTeamEventSelection}</Text>
                                        </View>  

                                    </View>

                                    <View style = {styles.fieldcontainer1}>
                        
                                    <Image style = {styles.imageGAAMobile} source={require('./SoccerField.png')}/> 
                                        {this.state.OpponentsDetailAnalysisStatHolder.map((data) => {
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
                                    </View>
                            </View>        
                        );

                }
                else
                {
                    ReviewDetailGameAnalysisFieldView =  (
                                                    
                        <View>
                            <View style={styles.ReviewContainer2}>
                                    <View style={styles.rowView}>
                                            <TouchableOpacity activeOpacity={0.6} style={styles.ExitButton} onPress={this.ExitReviewDetailAnalysis}>
                                                <Image style={styles.ExitButton} source={require('./exit.png')}/>
                                            </TouchableOpacity>
                                    </View>
                                    
                                    <View style={styles.rowView}>
                                        <Text style={styles.StatsTitle}> Event Type: {YourTeamEventSelection}</Text>
                                    </View>  

                            </View>    

                                        <View style = {styles.fieldcontainer1}>
                                    
                                                <Image style = {styles.imagePxGAA} source={require('./GAApitch1.png')}/> 
                                                    {this.state.OpponentsEventFieldPositions.map((data) => {
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
                                        </View>

                                    </View>

                    );
                }
            }
    }
    else if(SportType == 'Soccer')
    {
        if(screenWidth < 600 || screenHeight < 376)
        {

            ReviewDetailGameAnalysisFieldView =  (
                <View>
                
                <View style={styles.ReviewContainer2}>
                        <View style={styles.rowView}>
                             <TouchableOpacity activeOpacity={0.6} style={styles.ExitButton} onPress={this.ExitReviewDetailAnalysis}>
                                 <Image style={styles.ExitButton} source={require('./exit.png')}/>
                             </TouchableOpacity>
                        </View>
                        
                        <View style={styles.rowView}>
                            <Text style={styles.StatsTitle}> Event Type: {YourTeamEventSelection}</Text>
                        </View>  

                </View>    
            
                <View style = {styles.fieldcontainer1}>
                        <Image style = {styles.imageSoccerMobile} source={require('./SoccerField.png')}/> 
                        {this.state.OpponentsEventFieldPositions.map((data) => {
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
                </View>
                </View>

            );
        }
        else
        {
            ReviewDetailGameAnalysisFieldView =  (
            
            <View>

                <View style={styles.ReviewContainer2}>
                        <View style={styles.rowView}>
                             <TouchableOpacity activeOpacity={0.6} style={styles.ExitButton} onPress={this.ExitReviewDetailAnalysis}>
                                 <Image style={styles.ExitButton} source={require('./exit.png')}/>
                             </TouchableOpacity>
                        </View>
                        
                        <View style={styles.rowView}>
                            <Text style={styles.StatsTitle}> Event Type: {YourTeamEventSelection}</Text>
                        </View>  

                </View>    

                <View style = {styles.fieldcontainer1}>
                        <Image style = {styles.imagePxSoccer} source={require('./SoccerField.png')}/> 
                        {this.state.OpponentsEventFieldPositions.map((data) => {
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
                </View>

                </View>

            );
        }
    }
    

































                    
            //Field Views - Your Team individual Player 

                      if(ExecuteDetailAnalysis == true)
                      {

                            if(SportType == 'GAA')
                            {

                                if(screenWidth < 600 || screenHeight < 376)
                                {

                                
                                    ReviewDetailGameAnalysisFieldView =  (

                                        <View>
                                 
                                        <View style={styles.ReviewContainer2}>
                                            <View style={styles.rowView}>
                                                <TouchableOpacity activeOpacity={0.6} style={styles.ExitButton} onPress={this.ExitReviewDetailAnalysis}>
                                                    <Image style={styles.ExitButton} source={require('./exit.png')}/>
                                                </TouchableOpacity>
                                            </View>
                                        <View style={styles.rowView}>
                                             <Text style={styles.StatsTitle}> Player Number: {selectedPlayerKitNumber}  ,   Event Type: {YourTeamEventSelection}</Text>
                                        </View>  

                                        </View>
                                            <View style = {styles.fieldcontainer1}>
                                                <Image style = {styles.imageGAAMobile} source={require('./GAApitch1.png')}/> 
                                                        {this.state.DetailAnalysisStatHolder.map((data) => {
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

                                            </View>

                                    
                                    </View>
                                      




                                    );
                                }
                                else
                                {

                   

                                ReviewDetailGameAnalysisFieldView =  (
                                            
         
                                 <View>
                                      <View style={styles.ReviewContainer2}>
                                                <View style={styles.rowView}>
                                                     <TouchableOpacity activeOpacity={0.6} style={styles.ExitButton} onPress={this.ExitReviewDetailAnalysis}>
                                                         <Image style={styles.ExitButton} source={require('./exit.png')}/>
                                                     </TouchableOpacity>
                                                </View>
                                                
                                                <View style={styles.rowView}>
                                                    <Text style={styles.StatsTitle}> Player Number: {selectedPlayerKitNumber}  ,   Event Type: {YourTeamEventSelection}</Text>
                                                </View>  

                                      </View>    

                                                 <View style = {styles.fieldcontainer1}>
                                             
                                                         <Image style = {styles.imagePxGAA} source={require('./GAApitch1.png')}/> 
                                                             {this.state.DetailAnalysisStatHolder.map((data) => {
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
                                                 </View>

                                             </View>

                                    );
                                }

                            }
                            else if(SportType == 'Soccer')
                            {

                                if(screenWidth < 600 || screenHeight < 376)
                                {

                                    ReviewDetailGameAnalysisFieldView =  (
                                        <View>
                                        
                                        <View style={styles.ReviewContainer2}>
                                                <View style={styles.rowView}>
                                                     <TouchableOpacity activeOpacity={0.6} style={styles.ExitButton} onPress={this.ExitReviewDetailAnalysis}>
                                                         <Image style={styles.ExitButton} source={require('./exit.png')}/>
                                                     </TouchableOpacity>
                                                </View>
                                                
                                                <View style={styles.rowView}>
                                                    <Text style={styles.StatsTitle}> Player Number: {selectedPlayerKitNumber}  ,   Event Type: {YourTeamEventSelection}</Text>
                                                </View>  

                                        </View>    
                                    
                                        <View style = {styles.fieldcontainer1}>
                                                <Image style = {styles.imageSoccerMobile} source={require('./SoccerField.png')}/> 
                                                {this.state.DetailAnalysisStatHolder.map((data) => {
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
                                        </View>
                                        </View>

                                    );
                                }
                                else
                                {
                                    ReviewDetailGameAnalysisFieldView =  (
                                    
                                    <View>

                                        <View style={styles.ReviewContainer2}>
                                                <View style={styles.rowView}>
                                                     <TouchableOpacity activeOpacity={0.6} style={styles.ExitButton} onPress={this.ExitReviewDetailAnalysis}>
                                                         <Image style={styles.ExitButton} source={require('./exit.png')}/>
                                                     </TouchableOpacity>
                                                </View>
                                                
                                                <View style={styles.rowView}>
                                                    <Text style={styles.StatsTitle}> Player Number: {selectedPlayerKitNumber}  ,   Event Type: {YourTeamEventSelection}</Text>
                                                </View>  

                                        </View>    

                                        <View style = {styles.fieldcontainer1}>
                                                <Image style = {styles.imagePxSoccer} source={require('./SoccerField.png')}/> 
                                                {this.state.DetailAnalysisStatHolder.map((data) => {
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
                                        </View>

                                        </View>

                                    );
                                }
                            }
                      }

                      
            //Field Views - Opponents individual player

                      if(ExecuteOpponentsTeamDetailAnalysis == true)
                      {

                        if(SportType == 'GAA')
                        {

                            if(screenWidth < 600 || screenHeight < 376)
                            {

                                ReviewDetailGameAnalysisFieldView =  (
                                    
                                    <View>

                                        <View style={styles.ReviewContainer2}>
                                                <View style={styles.rowView}>
                                                    <TouchableOpacity activeOpacity={0.6} style={styles.ExitButton} onPress={this.ExitReviewDetailAnalysis}>
                                                        <Image style={styles.ExitButton} source={require('./exit.png')}/>
                                                    </TouchableOpacity>
                                                </View>
                                            <View style={styles.rowView}>
                                                <Text style={styles.StatsTitle}> Player Number: {selectedOpponentsPlayerKitNumber}  ,   Event Type: {YourTeamEventSelection}</Text>
                                            </View> 
                                        </View>


                                        <View style = {styles.fieldcontainer1}>
        
                                                <Image style = {styles.imageGAAMobile} source={require('./GAApitch1.png')}/> 
                                                {this.state.OpponentsDetailAnalysisStatHolder.map((data) => {
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
                                        </View>

                                    </View>

                                );
                            }
                            else
                            {

                                ReviewDetailGameAnalysisFieldView =  (
                                    
                                    <View>

                                    <View style={styles.ReviewContainer2}>
                                            <View style={styles.rowView}>
                                                <TouchableOpacity activeOpacity={0.6} style={styles.ExitButton} onPress={this.ExitReviewDetailAnalysis}>
                                                    <Image style={styles.ExitButton} source={require('./exit.png')}/>
                                                </TouchableOpacity>
                                            </View>
                                        <View style={styles.rowView}>
                                            <Text style={styles.StatsTitle}> Player Number: {selectedOpponentsPlayerKitNumber}  ,   Event Type: {YourTeamEventSelection}</Text>
                                        </View> 
                                    </View>

                                    <View style = {styles.fieldcontainer1}>
    
                                            <Image style = {styles.imagePxGAA} source={require('./GAApitch1.png')}/> 
                                            {this.state.OpponentsDetailAnalysisStatHolder.map((data) => {
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
                                    </View>

                                    </View>

                                );
                            }

                        }
                        else if(SportType == 'Soccer')
                        {

                            if(screenWidth < 600 || screenHeight < 376)
                            {
    
                                ReviewDetailGameAnalysisFieldView =  (
                                
                                <View>

                                    <View style={styles.ReviewContainer2}>
                                                <View style={styles.rowView}>
                                                     <TouchableOpacity activeOpacity={0.6} style={styles.ExitButton} onPress={this.ExitReviewDetailAnalysis}>
                                                         <Image style={styles.ExitButton} source={require('./exit.png')}/>
                                                     </TouchableOpacity>
                                                </View>
                                                
                                                <View style={styles.rowView}>
                                                    <Text style={styles.StatsTitle}> Player Number: {selectedOpponentsPlayerKitNumber}  ,   Event Type: {YourTeamEventSelection}</Text>
                                                </View>  

                                    </View>    

                                    <View style = {styles.fieldcontainer1}>
    
                                            <Image style = {styles.imageSoccerMobile} source={require('./SoccerField.png')}/> 
                                            {this.state.OpponentsDetailAnalysisStatHolder.map((data) => {
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
                                    </View>

                                    </View>
                                );

                            }
                            else
                            {
                                ReviewDetailGameAnalysisFieldView =  (
                                    <View>
                                       <View style={styles.ReviewContainer2}>
                                                <View style={styles.rowView}>
                                                     <TouchableOpacity activeOpacity={0.6} style={styles.ExitButton} onPress={this.ExitReviewDetailAnalysis}>
                                                         <Image style={styles.ExitButton} source={require('./exit.png')}/>
                                                     </TouchableOpacity>
                                                </View>
                                                
                                                <View style={styles.rowView}>
                                                    <Text style={styles.StatsTitle}> Player Number: {selectedOpponentsPlayerKitNumber}  ,   Event Type: {YourTeamEventSelection}</Text>
                                                </View>  

                                        </View>    
                                        <View style = {styles.fieldcontainer1}>
        
                                                <Image style = {styles.imagePxSoccer} source={require('./SoccerField.png')}/> 
                                                {this.state.OpponentsDetailAnalysisStatHolder.map((data) => {
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
                                        </View>
                                    </View>

                                );

                            }
                        }

                      }

                     


                       //---------------------------- Detail Game Analysis Selection ---------------------------
                       if(DetailedGameAnalysisSelectionView == true)
                       {

                                /* Selection  - Buttons to choose Your Team or Opponents */
                                ReviewDetailGameAnalysisOptions =  (
                                    <View style={styles.ReviewContainer}>
                                         <View style={styles.columnView}>
                                         <TouchableOpacity activeOpacity={0.6} style={styles.ExitButton} onPress={this.ExitReviewDetailAnalysis}>
                                                    <Image style={styles.ExitButton} source={require('./exit.png')}/> 
                                                </TouchableOpacity> 
                                          </View>
                                        <View style={styles.columnView}>
                                            <TouchableOpacity activeOpacity={0.6} style={styles.button}  onPress={this.ReviewYourTeamDGA}>
                                                    <Text style={styles.buttonText}>Your Team</Text> 
                                            </TouchableOpacity>
                                        </View>
                                        <View style={styles.columnView}>
                                            <TouchableOpacity activeOpacity={0.6} style={styles.button}  onPress={this.ReviewOpponentsDGA}>
                                                    <Text style={styles.buttonText}>Opponents</Text> 
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                );
                        
                        }

                        //Your Team Review Selection Option
                        if(YourTeamReviewSelection == true)
                        {

                                /* Selection screen - Buttons to choose a view to navigate to */
                                ReviewDetailGameAnalysisOptions =  (
                                    
                                    <View style={styles.ReviewContainer}>
                                         <View style={styles.columnView}>
                                         <TouchableOpacity activeOpacity={0.6} style={styles.ExitButton} onPress={this.ExitReviewDetailAnalysis}>
                                                    <Image style={styles.ExitButton} source={require('./exit.png')}/> 
                                                </TouchableOpacity> 
                                          </View>
                                        <View style={styles.columnView}>
                                            <TouchableOpacity activeOpacity={0.6} style={styles.button}  onPress={this.UserSelectsTeamEventsLocations}>
                                                    <Text style={styles.buttonText}>Review team events and field locations</Text> 
                                            </TouchableOpacity>
                                        </View>
                                        <View style={styles.columnView}>
                                            <TouchableOpacity activeOpacity={0.6} style={styles.button}  onPress={this.UserSelectsPlayerEventsLocations}>
                                                    <Text style={styles.buttonText}>Review a players events and field locations</Text> 
                                            </TouchableOpacity>
                                        </View>
                                        <View style={styles.columnView}>
                                            <TouchableOpacity activeOpacity={0.6} style={styles.button}  onPress={this.UserSelectsTeamPercentages}>
                                                    <Text style={styles.buttonText}>Event percentages</Text> 
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ); 
                        }
                        
                        if(OpponentsReviewSelection == true)
                        {
                            
                                /* Selection - Buttons to choose a view to navigate to */
                                ReviewDetailGameAnalysisOptions =  (
                                    <View style={styles.ReviewContainer}>
                                         <View style={styles.columnView}>
                                         <TouchableOpacity activeOpacity={0.6} style={styles.ExitButton} onPress={this.ExitReviewDetailAnalysis}>
                                                    <Image style={styles.ExitButton} source={require('./exit.png')}/> 
                                                </TouchableOpacity> 
                                          </View>
                                        <View style={styles.columnView}>
                                            <TouchableOpacity activeOpacity={0.6} style={styles.button}  onPress={this.UserSelectsOpponentsEventsLocations}>
                                                <Text style={styles.buttonText}>Review team events and field locations</Text> 
                                            </TouchableOpacity>
                                        </View>
                                        <View style={styles.columnView}>
                                            <TouchableOpacity activeOpacity={0.6} style={styles.button}  onPress={this.UserSelectsOpponentsPlayerEventsLocations}>
                                                <Text style={styles.buttonText}>Review a players events and field locations</Text> 
                                            </TouchableOpacity>
                                        </View>
                                        <View style={styles.columnView}>
                                            <TouchableOpacity activeOpacity={0.6} style={styles.button}  onPress={this.UserSelectsTeamPercentages}>
                                                    <Text style={styles.buttonText}> Event percentages</Text> 
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ); 
                        }

                        
                            //Your Team Event Locations - Select Squad or Sub Bench
                            if(TeamSelection == true)
                            {
                                ReviewIndividualPlayerStatsContainer = (
                                    <View style={styles.ReviewContainer}>
                                                <View style={styles.playerColumnView}>
                                                    <TouchableOpacity activeOpacity={0.6} style={styles.ExitButton} onPress={this.ExitReviewDetailAnalysis}>
                                                                <Image style={styles.ExitButton} source={require('./exit.png')}/> 
                                                    </TouchableOpacity> 
                                                </View>
                                            <Text style={styles.buttonText}>Review a individual player from your team - Select an option</Text>
                                           
                                        
                                            <View style={styles.playerColumnView}>
                                                
                                                        <TouchableOpacity
                                                                onPress={this.DetailedAnalysisIndividualSquadPlayer}
                                                                activeOpacity={0.6}
                                                                style={styles.button} 
                                                
                                                            > 
                                                            <Text style={styles.buttonText}>Squad Player</Text>
                                                        </TouchableOpacity>
                                                </View>
    
                                                <View style={styles.playerColumnView}>
                                                            <TouchableOpacity
                                                                onPress={this.DetailedAnalysisIndividualSubBenchPlayer}
                                                                activeOpacity={0.6}
                                                                style={styles.button} 
                                                    
                                                            > 
                                                                <Text style={styles.buttonText}>Sub Bench</Text>
                                                            </TouchableOpacity>
                                                </View>
                            
                                    </View>
    
                                );
                            }

                            //Opponents Event Locations - Select Squad or Sub Bench
                            if(OpponentsSelection == true)
                            {
                                ReviewIndividualPlayerStatsContainer = (
                                    <View style={styles.ReviewContainer}>
                                               <View style={styles.playerColumnView}>
                                                    <TouchableOpacity activeOpacity={0.6} style={styles.ExitButton} onPress={this.ExitReviewDetailAnalysis}>
                                                        <Image style={styles.ExitButton} source={require('./exit.png')}/> 
                                                    </TouchableOpacity> 
                                                </View>
                                            <Text style={styles.buttonText}>Review a individual player from your team - Select an option</Text>
                                         
                                            <View style={styles.playerColumnView}>
                                                
                                                        <TouchableOpacity
                                                                onPress={this.OpponentsDetailedAnalysisIndividualSquadPlayer}
                                                                activeOpacity={0.6}
                                                                style={styles.button} 
                                                
                                                            > 
                                                            <Text style={styles.buttonText}>Squad Player</Text>
                                                        </TouchableOpacity>
                                                </View>
    
                                                <View style={styles.playerColumnView}>
                                                            <TouchableOpacity
                                                                onPress={this.OpponentsDetailedAnalysisIndividualSubBenchPlayer}
                                                                activeOpacity={0.6}
                                                                style={styles.button} 
                                                    
                                                            > 
                                                                <Text style={styles.buttonText}>Sub Bench</Text>
                                                            </TouchableOpacity>
                                                </View>
                            
                                    </View>
    
                                );
                            }
     
                            //Your Team Players Selection view - Starting Lineup Team
                            if(displayDetailedIndividualSquadPlayer == true)
                            {
                                
                                ReviewIndividualSquadPlayer =  (
                           
                                                               
                                    <View style ={styles.playerRowView}>
            
                                     {this.state.StartingTeamArray.map((data,element) => {
                                            return (
                                                <View key={element} style={styles.listItemContainer}>
                                                    <View style={styles.playerColumnView}>
                                                        <TouchableOpacity style={styles.StartingKitNumberbutton} value={data.playerKitNumber} onPress={this.GetSelectedPlayerForDetailedAnalysis(data.playerKitNumber)}>
                                                            <Text style={styles.buttonText}>{data.playerKitNumber}</Text>
                                                        </TouchableOpacity> 
                                                    </View>
                                                </View>
                                            )
                                        })}
            
                                       
                                   

                                    </View>
                                );

                            }

                             //Your Team Players Selection view - Sub bench 
                            if(displayDetailedIndividualSubBenchPlayer == true)
                            {
                                ReviewIndividualSubBenchPlayer = ( 
            
                                    <View style ={styles.playerRowView}>
            
                                                    {this.state.SubBenchArray.map((data,element) => {
                                                        return (
                                                            <View key={element} style={styles.listItemContainer}>
                                                                <View style={styles.playerColumnView}>
                                                                    <TouchableOpacity style={styles.SubKitNumberbutton} value={data.playerKitNumber}  onPress={this.GetSelectedSubBenchPlayerForDetailedAnalysis(data.playerKitNumber)}>
                                                                        <Text style={styles.buttonText}>{data.playerKitNumber}</Text> 
                                                                    </TouchableOpacity> 
                                                                </View>
                                                            </View>
                                                        )
                                                    })}
            
                                    </View>
            
                                
                                );
                            }

        

                            //Select an Event (Team Events View)
                            if(EventSelectionTeamDetailAnalysis)
                            {

                                if(SportType == 'GAA')
                                {

                                    ReviewDetailGameAnalysis =  (
                                        <View style={{backgroundColor:'#ffffff' ,  top:hp('20%'), }}>
                                          
                                      
                                                <TouchableOpacity
                                                    onPress={this.ExitReviewDetailAnalysis}
                                                    activeOpacity={0.6}
                                                    style={styles.ExitButton} 
                                                    > 
                                                    <Image style={styles.ExitButton} source={require('./exit.png')}/> 
                                                </TouchableOpacity>
                                           
                                                   
                                                    <Picker
                                                        selectedValue={this.state.YourTeamEventSelection}
                                                      
                                                        onValueChange={(text) => this.setState({YourTeamEventSelection:text})}
                                                        >
            
                                                        <Picker.Item label="Select a event" value="" />
                                                        <Picker.Item label="Goal" value="Goal" />
                                                        <Picker.Item label="Point" value="Point"/>
                                                        <Picker.Item label="Shots" value="Shots"/>
                                                        <Picker.Item label="Shots on target" value="ShotsOnTarget"/>
                                                        <Picker.Item label="Pass" value="Pass"/>
            
            
                                                    </Picker>

                                                
                                                  
                                           
                                                    <TouchableOpacity activeOpacity={0.6} style={styles.button3} onPress={this.ExecuteTeamDetailAnalysis}>
                                                        <Text style={styles.buttonText}>Submit</Text>
                                                    </TouchableOpacity>
                                                
                                        </View> 
    
                                    );

                                }
                                else if(SportType == 'Soccer')
                                {
                                    ReviewDetailGameAnalysis =  (

                                        <View style={{backgroundColor:'#ffffff' ,  top:hp('20%'), }}>
                                           
                                          
                                                <TouchableOpacity
                                                    onPress={this.ExitReviewDetailAnalysis}
                                                    activeOpacity={0.6}
                                                    style={styles.ExitButton} 
                                                    > 
                                                    <Image style={styles.ExitButton} source={require('./exit.png')}/> 
                                                </TouchableOpacity>

                                            

                                              
                                                    <Picker
                                                        selectedValue={this.state.YourTeamEventSelection}
                                                        
                                                        onValueChange={(text) => this.setState({YourTeamEventSelection:text})}
                                                        >
            
                                                        <Picker.Item label="Select a event" value="" />
                                                        <Picker.Item label="Goal" value="Goal" />
                                                        <Picker.Item label="Shots" value="Shot"/>
                                                        <Picker.Item label="Shots" value="Shots"/>
                                                        <Picker.Item label="Shots on target" value="ShotsOnTarget"/>
                                                        <Picker.Item label="Pass" value="Pass"/>
            
            
                                                    </Picker>
                                            
                                                    <TouchableOpacity activeOpacity={0.6} style={styles.button3} onPress={this.ExecuteTeamDetailAnalysis}>
                                                        <Text style={styles.buttonText}>Submit</Text>
                                                   </TouchableOpacity>
                                            
    
                                        </View> 
    
                                    );
                                }
                            }
                            


                            //Select an Event (Opponents Events View)
                            if(EventSelectionOpponentsDetailAnalysis)
                            {

                                if(SportType == 'GAA')
                                {
                                    ReviewDetailGameAnalysis =  (

                                        <View style={{backgroundColor:'#ffffff' ,  top:hp('20%'), }}>
                                  
                                           
                                                <TouchableOpacity
                                                    onPress={this.ExitReviewDetailAnalysis}
                                                    activeOpacity={0.6}
                                                    style={styles.ExitButton} 
                                                    > 
                                                    <Image style={styles.ExitButton} source={require('./exit.png')}/> 
                                                </TouchableOpacity>

                                          
                                          
                                                    <Picker
                                                        selectedValue={this.state.YourTeamEventSelection}
                                                      
                                                        onValueChange={(text) => this.setState({YourTeamEventSelection:text})}
                                                        >
            
                                                        <Picker.Item label="Select a event" value="" />
                                                        <Picker.Item label="Goal" value="Goal" />
                                                        <Picker.Item label="Point" value="Point"/>
                                                        <Picker.Item label="Shots" value="Shot"/>
                                                        <Picker.Item label="Shots on target" value="ShotsOnTarget"/>
                                                        <Picker.Item label="Pass" value="Pass"/>
            
            
                                                    </Picker>
                                              
                
                                                <TouchableOpacity activeOpacity={0.6} style={styles.button3} onPress={this.ExecuteOpponentsDetailAnalysis}>
                                                    <Text style={styles.buttonText}>Submit</Text>
                                                </TouchableOpacity>
    
                                        </View> 
    
                                    );

                                }
                                else if(SportType == 'Soccer')
                                {
                                    ReviewDetailGameAnalysis =  (

                                        <View style={{backgroundColor:'#ffffff' ,  top:hp('20%'), }}>
                                            
                                    
                                          
                                                <TouchableOpacity
                                                    onPress={this.ExitReviewDetailAnalysis}
                                                    activeOpacity={0.6}
                                                    style={styles.ExitButton} 
                                                    > 
                                                    <Image style={styles.ExitButton} source={require('./exit.png')}/> 
                                                </TouchableOpacity>
                                           

                                                    <Picker
                                                        selectedValue={this.state.YourTeamEventSelection}
                                                     
                                                        onValueChange={(text) => this.setState({YourTeamEventSelection:text})}
                                                        >
            
                                                        <Picker.Item label="Select a event" value="" />
                                                        <Picker.Item label="Goal" value="Goal" />
                                                        <Picker.Item label="Shots" value="Shot"/>
                                                        <Picker.Item label="Shots on target" value="ShotsOnTarget"/>
                                                        <Picker.Item label="Pass" value="Pass"/>
            
            
                                                    </Picker>
                
                                                <TouchableOpacity activeOpacity={0.6} style={styles.button3} onPress={this.ExecuteOpponentsDetailAnalysis}>
                                                    <Text style={styles.buttonText}>Submit</Text>
                                                </TouchableOpacity>
    
                                        </View> 
    
                                    );

                                }
                                
                               
                                 
                            }

                          

                             // Your Team percentages
                             if(TeamEventPercentages == true)
                             {

                                if(SportType == 'GAA')
                                {
                                
                                    ReviewDetailGameAnalysis =  (
                                            
                                        <View style={{backgroundColor:'#ffffff' ,  top:hp('20%'), }}>
                                       
                                            <View style={styles.playerColumnView}>
                                                <TouchableOpacity
                                                    onPress={this.ExitReviewDetailAnalysis}
                                                    activeOpacity={0.6}
                                                    style={styles.ExitButton} 
                                                    > 
                                                    <Image style={styles.ExitButton} source={require('./exit.png')}/> 
                                                </TouchableOpacity>
                                            </View>
                                            
                                            
                                    
                                                            {/* Select an event  */}
                                                            <Picker
                                                                selectedValue={this.state.YourTeamEventSelection}
                                                                
                                                                onValueChange={(text) => this.setState({YourTeamEventSelection:text})}
                                                                >
            
                                                                <Picker.Item label="Select a event" value="" />
                                                                <Picker.Item label="Goal" value="Goal" />
                                                                <Picker.Item label="Point" value="Point"/>
                                                                <Picker.Item label="Shots" value="Shot"/>
                                                                <Picker.Item label="Shots on target" value="ShotsOnTarget"/>
                                                                <Picker.Item label="Pass" value="Pass"/>
            
            
                                                            </Picker>


                                                <TouchableOpacity activeOpacity={0.6} style={styles.button3} onPress={this.ExecuteOpponentsDetailAnalysis}>
                                                    <Text style={styles.buttonText}>Submit</Text>
                                                </TouchableOpacity>
        
                                        </View> 

                                    );
                                
                                }
                                else if(SportType == 'Soccer')
                                {
                                    ReviewDetailGameAnalysis =  (
                                            
                                        <View style={{backgroundColor:'#ffffff' ,  top:hp('20%'), }}>
                                           
                                            <View style={styles.playerColumnView}>
                                                <TouchableOpacity
                                                    onPress={this.ExitReviewDetailAnalysis}
                                                    activeOpacity={0.6}
                                                    style={styles.ExitButton} 
                                                    > 
                                                    <Image style={styles.ExitButton} source={require('./exit.png')}/> 
                                                </TouchableOpacity>
                                            </View>
                                            
                                            
                                            <Text style={styles.buttonText}>{this.state.TeamName} Event Percentages</Text>
                                                            {/* Select an event  */}
                                                            <Picker
                                                                selectedValue={this.state.YourTeamEventSelection}
                                                                
                                                                onValueChange={(text) => this.setState({YourTeamEventSelection:text})}
                                                                >
            
                                                                <Picker.Item label="Select a event" value="" />
                                                                <Picker.Item label="Goal" value="Goal" />
                                                                <Picker.Item label="Shots" value="Shots"/>
                                                                <Picker.Item label="Shots on target" value="ShotsOnTarget"/>
                                                                <Picker.Item label="Pass" value="Pass"/>
            
            
                                                            </Picker>
        
                                                <TouchableOpacity activeOpacity={0.6} style={styles.button3} onPress={this.ExecuteOpponentsDetailAnalysis}>
                                                    <Text style={styles.buttonText}>Submit</Text>
                                                </TouchableOpacity>



                                        </View> 

                                    );
                                }
                                  

                             }
 
                             // Opponents percentages
                             if(OpponentsEventPercentages == true)
                             {

                                if(SportType == 'GAA')
                                {
                                 
                                    ReviewDetailGameAnalysis =  (
                                        <View style={{backgroundColor:'#ffffff' ,  top:hp('20%'), }}>
                                      
                                          
                                                <TouchableOpacity
                                                    onPress={this.ExitReviewDetailAnalysis}
                                                    activeOpacity={0.6}
                                                    style={styles.ExitButton} 
                                                    > 
                                                    <Image style={styles.ExitButton} source={require('./exit.png')}/> 
                                                </TouchableOpacity>
                                            
                                            
                                            <Text style={styles.buttonText}>{this.state.OpponentsName} Event Percentages</Text>

                                            {/* Select an event  */}
                                            <Picker
                                                selectedValue={this.state.OpponentsEventSelection}
                                                
                                                onValueChange={(text) => this.setState({OpponentsEventSelection:text})}
                                                >

                                                <Picker.Item label="Select a event" value="" />
                                                <Picker.Item label="Goal" value="Goal" />
                                                <Picker.Item label="Point" value="Point"/>
                                                <Picker.Item label="Shots" value="Shots"/>
                                                <Picker.Item label="Shots on target" value="ShotsOnTarget"/>
                                                <Picker.Item label="Pass" value="Pass"/>


                                            </Picker>

                                            <TouchableOpacity activeOpacity={0.6} style={styles.button3} onPress={this.ExecuteOpponentsPercentages}>
                                                <Text style={styles.buttonText}>Submit</Text>
                                            </TouchableOpacity>

                                        </View> 
                                    );

                                }
                                else if(SportType == 'Soccer')
                                {
                                    ReviewDetailGameAnalysis =  (
                                        <View style={{backgroundColor:'#ffffff' ,  top:hp('20%'), }}>
                                            
                                       
                                                <TouchableOpacity
                                                    onPress={this.ExitReviewDetailAnalysis}
                                                    activeOpacity={0.6}
                                                    style={styles.ExitButton} 
                                                    > 
                                                    <Image style={styles.ExitButton} source={require('./exit.png')}/> 
                                                </TouchableOpacity>
                                           
                                            
                                            
                                            
                                            <Text style={styles.buttonText}>{this.state.OpponentsName} Event Percentages</Text>

                                            {/* Select an event  */}
                                            <Picker
                                                selectedValue={this.state.OpponentsEventSelection}
                                                
                                                onValueChange={(text) => this.setState({OpponentsEventSelection:text})}
                                                >

                                                <Picker.Item label="Select a event" value="" />
                                                <Picker.Item label="Goal" value="Goal" />
                                                <Picker.Item label="Shots" value="Shots"/>
                                                <Picker.Item label="Shots on target" value="ShotsOnTarget"/>
                                                <Picker.Item label="Pass" value="Pass"/>


                                            </Picker>

                                            <TouchableOpacity activeOpacity={0.6} style={styles.button3} onPress={this.ExecuteOpponentsPercentages}>
                                                <Text style={styles.buttonText}>Submit</Text>
                                            </TouchableOpacity>

                                        </View> 
                                    );
                                }
 
                             }


                          

             if(displayStartingTeam == true)
             {

                OpponentsMode = (

                    <View style={styles.GetOpponentsPlayers}>
                         <TouchableOpacity style={styles.OpponentsModeBtn} onPress={this.GetOpponentsPlayers}>
                              <Text style={styles.buttonText}>Opponents Players</Text>
                          </TouchableOpacity> 
                    </View>
                 );




                PlayerContainer = (

                    <View style ={styles.playerRowView}>
                            
                    
                                    {this.state.StartingTeamArray.map((data,element) => {
                                        return (
                                            <View key={element} style={styles.listItemContainer}>
                                                <View style={styles.playerColumnView}>
                                                    <TouchableOpacity style={styles.StartingKitNumberbutton} value={data.playerKitNumber}  onPress={this.SelectPlayer(data.playerKitNumber)}>
                                                        <Text style={styles.buttonText}>{data.playerKitNumber}</Text>
                                                    </TouchableOpacity> 

                                                </View>
                                    
                                            </View>

                                        )
                                    })}

                                

                                
                    </View>

                    
                ); 





             }


             if(displaySubBench == true)
             {
                SubPlayerContainer = (


                    <View style ={styles.playerRowView}>
                  
         
                        {this.state.SubBenchArray.map((data,element) => {
                            return (
                                <View key={element} style={styles.listItemContainer}>
                                    <View style={styles.playerColumnView}>
                                        <TouchableOpacity style={styles.SubKitNumberbutton} value={data.playerKitNumber}  onPress={this.ExecuteSub(data.playerKitNumber)}>
                                            <Text style={styles.buttonText}>{data.playerKitNumber}</Text>
                                        </TouchableOpacity> 

                                    </View>
                        
                              </View>

                            )
                        })}

                       

                    
                    </View>


                );


             }



             //Display Opponents Starting Team 
             if(displayOpponentsStartingTeam == true)
             {
                 
                YourTeamMode = (

                    <View style={styles.GetYourTeamPlayers}>
                         <TouchableOpacity style={styles.OpponentsModeBtn} onPress={this.GetYourTeamPlayers}>
                              <Text style={styles.buttonText}>Your Team Players</Text>
                          </TouchableOpacity> 
                    </View>
                 );




                PlayerContainer = (

                    <View style ={styles.playerRowView}>
                            
                    
                                    {this.state.OpponentsStartingTeamArray.map((data,element) => {
                                        return (
                                            <View key={element} style={styles.listItemContainer}>
                                                <View style={styles.playerColumnView}>
                                                    <TouchableOpacity style={styles.SubKitNumberbutton} value={data.playerKitNumber}  onPress={this.SelectPlayer(data.playerKitNumber)}>
                                                        <Text style={styles.buttonText}>{data.playerKitNumber}</Text>
                                                    </TouchableOpacity> 

                                                </View>
                                    
                                            </View>

                                        )
                                    })}

                                

                                
                    </View>

                    
                ); 
             }

             //Display Opponents Sub bench 
             if(displayOpponentsSubBench == true)
             {
                PlayerContainer = (

                    <View style ={styles.playerRowView}>
                   
                                    {this.state.OpponentsSubBenchArray.map((data,element) => {
                                        return (
                                            <View key={element} style={styles.listItemContainer}>
                                                <View style={styles.playerColumnView}>
                                                    <TouchableOpacity style={styles.SubKitNumberbutton} value={data.playerKitNumber}  onPress={this.ExecuteOpponentSub(data.playerKitNumber)}>
                                                        <Text style={styles.buttonText}>{data.playerKitNumber}</Text>
                                                    </TouchableOpacity> 

                                                </View>
                                    
                                            </View>

                                        )
                                    })}

                                
                        
                                
                    </View>

                    
                ); 
             }


                       
           
           //--------------------------------------------------------------------------------------------------------------
           

                         //Opponents Team
                         if(displayReviewOpponentsIndividualPlayerStatsContainer == true)
                         {
 
                             ReviewIndividualPlayerStatsContainer = (
                                 <View style={styles.ReviewContainer}>
                                         
                                         <Text style={styles.buttonText}>Review a individual player from the opponents team - Select an option</Text>
                                         
                                         <View style={styles.playerColumnView}>
                                         <TouchableOpacity activeOpacity={0.6} style={styles.ExitButton} onPress={this.ExitReviewDetailAnalysis}>
                                                    <Image style={styles.ExitButton} source={require('./exit.png')}/> 
                                                </TouchableOpacity> 
                                        </View>

                                         <View style={styles.playerColumnView}>
                                             
                                                     <TouchableOpacity
                                                     onPress={this.ReviewOpponentsIndividualSquadPlayer}
                                                             activeOpacity={0.6}
                                                             style={styles.button} 
                                             
                                                         > 
                                                         <Text style={styles.buttonText}>Squad Player</Text>
                                                     </TouchableOpacity>
                                             </View>
 
                                             <View style={styles.playerColumnView}>
                                                         <TouchableOpacity
                                                             onPress={this.ReviewOpponentsIndividualSubBenchPlayer}
                                                             activeOpacity={0.6}
                                                             style={styles.button} 
                                                 
                                                         > 
                                                             <Text style={styles.buttonText}>Sub Bench</Text>
                                                         </TouchableOpacity>
                                             </View>
                         
                                 </View>
 
                             );
 
                         }

                    

                     if(displayReviewOpponentsIndividualSquadPlayer == true)
                     {
        
                            ReviewIndividualSquadPlayer =  (
                        
                                                            
                                <View style ={styles.playerRowView}>
        
                                    {this.state.OpponentsStartingTeamArray.map((data,element) => {
                                        return (
                                            <View key={element} style={styles.listItemContainer}>
                                                <View style={styles.playerColumnView}>
                                                    <TouchableOpacity style={styles.StartingKitNumberbutton} value={data.playerKitNumber} onPress={this.GetSelectedOpponentsPlayerStats(data.playerKitNumber)}>
                                                        <Text style={styles.buttonText}>{data.playerKitNumber}</Text>
                                                    </TouchableOpacity> 
                                                </View>
                                            </View>
                                        )
                                    })}
        
                                   
                               
        
                                </View>
                            );
        
                     }


                    if(displayReviewOpponentsIndividualSubBenchPlayer == true)
                    {
                             ReviewIndividualSubBenchPlayer = ( 
        
                                <View style ={styles.playerRowView}>

                                                {this.state.OpponentsSubBenchArray.map((data,element) => {
                                                    return (
                                                        <View key={element} style={styles.listItemContainer}>
                                                            <View style={styles.playerColumnView}>
                                                                <TouchableOpacity style={styles.SubKitNumberbutton} value={data.playerKitNumber} onPress={this.GetSelectedOpponentsPlayerStatsSubBench(data.playerKitNumber)}>
                                                                    <Text style={styles.buttonText}>{data.playerKitNumber}</Text> 
                                                                </TouchableOpacity> 
                                                            </View>
                                                        </View>
                                                    )
                                                })}
        
                                      
        
        
                                </View>
        
        
                              
                            );

                           
                    }

                    if(displayReviewOpponentsIndividualPlayers == true)
                    {

                        
                        if(SportType == 'GAA')
                        {
                    
                            IndividualStatsTable = (
                                
                                <View style={styles.StatsTable}>
                                        
                                    {this.state.SelectedOpponentsPlayerArray.map((data,element) => {
                                        return (
                                        <View  key={element} style={styles.StatsRow}>
                                                <View style={styles.column}>
                                                        <Text style={styles.StatsText}>Player Name: {data.fullName}</Text>
                                                        <Text style={styles.StatsText}>Player Number: {data.playerKitNumber}</Text>
                                                        <Text style={styles.StatsText}>Position: {data.playerPosition}</Text>
                                                    
                                                </View>
                                                <View style={styles.column}>
                                                        <Text style={styles.StatsText}>Goals: {data.Goals}</Text>
                                                        <Text style={styles.StatsText}>Points:</Text>
                                                        <Text style={styles.StatsText}>Passes: {data.Passes}</Text>
                                                        <Text style={styles.StatsText}>Shots:{data.Shots}</Text>
                                                        <Text style={styles.StatsText}>Shots on target:{data.ShotsOnTarget}</Text>
                                                        <Text style={styles.StatsText}>Tackle:</Text>
                                                    
                                                </View>
                                                <View style={styles.column}>
                                                        <Text style={styles.StatsText}>Won the ball:</Text>
                                                        <Text style={styles.StatsText}>Lost the ball:</Text>
                                                        <Text style={styles.StatsText}>Yellow Card:</Text>
                                                        <Text style={styles.StatsText}>Red Card:</Text>
                                                        <Text style={styles.StatsText}>Assist:</Text>
                                                    
                                                    
                                                </View>


                                        </View>

                            
                                                )
                                        })}
                                </View>
                            );

                        }
                        else if (SportType == 'Soccer')
                        {
                            IndividualStatsTable = (
                                
                                <View style={styles.StatsTable}>
                                        
                                    {this.state.SelectedOpponentsPlayerArray.map((data,element) => {
                                        return (
                                        <View  key={element} style={styles.StatsRow}>
                                                <View style={styles.column}>
                                                        <Text style={styles.StatsText}>Player Name: {data.fullName}</Text>
                                                        <Text style={styles.StatsText}>Player Number: {data.playerKitNumber}</Text>
                                                        <Text style={styles.StatsText}>Position: {data.playerPosition}</Text>
                                                    
                                                </View>
                                                <View style={styles.column}>
                                                        <Text style={styles.StatsText}>Goals: {data.Goals}</Text>
                                                        <Text style={styles.StatsText}>Passes: {data.Passes}</Text>
                                                        <Text style={styles.StatsText}>Shots:{data.Shots}</Text>
                                                        <Text style={styles.StatsText}>Shots on target:{data.ShotsOnTarget}</Text>
                                                        <Text style={styles.StatsText}>Tackle:</Text>
                                                    
                                                </View>
                                                <View style={styles.column}>
                                                        <Text style={styles.StatsText}>Won the ball:</Text>
                                                        <Text style={styles.StatsText}>Lost the ball:</Text>
                                                        <Text style={styles.StatsText}>Yellow Card:</Text>
                                                        <Text style={styles.StatsText}>Red Card:</Text>
                                                        <Text style={styles.StatsText}>Assist:</Text>
                                                    
                                                    
                                                </View>


                                        </View>

                            
                                                )
                                        })}
                                </View>
                            );
                        }

                    }
                 

                    if(displayReviewYourTeamIndividualSquadPlayer == true)
                    {

                        if(SportType == 'GAA')
                        {

                     

                           IndividualStatsTable = (
                                
                                <View style={styles.StatsTable}>
                                        
                                    {this.state.SelectedPlayerArray.map((data,element) => {
                                        return (
                                        <View  key={element} style={styles.StatsRow}>
                                                <View style={styles.column}>
                                                        <Text style={styles.StatsText}>Player Name: {data.fullName}</Text>
                                                        <Text style={styles.StatsText}>Player Number: {data.playerKitNumber}</Text>
                                                        <Text style={styles.StatsText}>Position: {data.playerPosition}</Text>
                                                    
                                                </View>
                                                <View style={styles.column}>
                                                        <Text style={styles.StatsText}>Goals: {data.Goals}</Text>
                                                        <Text style={styles.StatsText}>Points:</Text>
                                                        <Text style={styles.StatsText}>Passes: {data.Passes}</Text>
                                                        <Text style={styles.StatsText}>Shots: {data.Shots}</Text>
                                                        <Text style={styles.StatsText}>Shots on target: {data.ShotsOnTarget}</Text>
                                                        <Text style={styles.StatsText}>Tackle:</Text>
                                                    
                                                </View>
                                                <View style={styles.column}>
                                                        <Text style={styles.StatsText}>Won the ball:</Text>
                                                        <Text style={styles.StatsText}>Lost the ball:</Text>
                                                        <Text style={styles.StatsText}>Yellow Card:</Text>
                                                        <Text style={styles.StatsText}>Red Card:</Text>
                                                        <Text style={styles.StatsText}>Assist:</Text>
                                                    
                                                    
                                                </View>


                                        </View>

                              
                                                )
                                        })}
                                </View>
                            );

                        }

                        else if(SportType == 'Soccer')
                        {
                            IndividualStatsTable = (
                                
                                <View style={styles.StatsTable}>
                                        
                                    {this.state.SelectedPlayerArray.map((data,element) => {
                                        return (
                                        <View  key={element} style={styles.StatsRow}>
                                                <View style={styles.column}>
                                                        <Text style={styles.StatsText}>Player Name: {data.fullName}</Text>
                                                        <Text style={styles.StatsText}>Player Number: {data.playerKitNumber}</Text>
                                                        <Text style={styles.StatsText}>Position: {data.playerPosition}</Text>
                                                    
                                                </View>
                                                <View style={styles.column}>
                                                        <Text style={styles.StatsText}>Goals: {data.Goals}</Text>
                                                        <Text style={styles.StatsText}>Passes: {data.Passes}</Text>
                                                        <Text style={styles.StatsText}>Shots: {data.Shots}</Text>
                                                        <Text style={styles.StatsText}>Shots on target: {data.ShotsOnTarget}</Text>
                                                        <Text style={styles.StatsText}>Tackle:</Text>
                                                    
                                                </View>
                                                <View style={styles.column}>
                                                        <Text style={styles.StatsText}>Won the ball:</Text>
                                                        <Text style={styles.StatsText}>Lost the ball:</Text>
                                                        <Text style={styles.StatsText}>Yellow Card:</Text>
                                                        <Text style={styles.StatsText}>Red Card:</Text>
                                                        <Text style={styles.StatsText}>Assist:</Text>
                                                    
                                                    
                                                </View>


                                        </View>

                              
                                                )
                                        })}
                                </View>
                            );
                        }



                        

                    }



                if(displayFieldPositionSelection == true)
                {

                    if(SportType == 'GAA')
                    {

                      

                        if(screenWidth < 600 || screenHeight < 376)
                        {
                            FieldPositionSelectionContainer = (

                                 <TouchableOpacity style = {{ top: '5%',  width: 590, alignItems: "center", justifyContent: 'center'}} onPress={this.ObtainFieldPositionSelected}>
                                    <Image style = {styles.imageGAAMobile} source={require('./GAApitch1.png')}/> 
                                 </TouchableOpacity>
    
                            );
                        }
                        else
                        {
                            FieldPositionSelectionContainer = (

                                <TouchableOpacity style = {{ top: '5%',width: 700, alignItems: "center", justifyContent: 'center' }}  onPress={this.ObtainFieldPositionSelected}>
                                    <Image style = {styles.imagePxGAA} source={require('./GAApitch1.png')}/> 
                                </TouchableOpacity>
                               
                            );
    
                        }




                      
                    }

                    else if(SportType == 'Soccer')
                    {

                        
                        if(screenWidth < 600 || screenHeight < 376)
                        {

                            FieldPositionSelectionContainer = (

                                <TouchableOpacity style = {{ top: '5%', width: 480 ,alignItems: "center",justifyContent: 'center'}} onPress={this.ObtainFieldPositionSelected}>
                                    <Image style = {styles.imageSoccerMobile} source={require('./SoccerField.png')}/> 
                                </TouchableOpacity>

                            );

                        }
                        else
                        {
                            FieldPositionSelectionContainer = (

                                <TouchableOpacity style = {{ top: '5%', width: 700 ,alignItems: "center",justifyContent: 'center'}} onPress={this.ObtainFieldPositionSelected}>
                                    <Image style = {styles.imagePxSoccer} source={require('./SoccerField.png')}/> 
                                </TouchableOpacity>
    
                            );  
                        }
                    }

                 
                }


          
        
        
            //Scoreboard 
            if(ScoreboardContainerToggle == true)
            {

                if(SportType == 'GAA')
                {
              
                
                ScoreboardContainer = (

                        <View style={styles.Wrapper}>
                        
                        <View style={styles.columnView}>
                            <Text style={styles.buttonText}>{this.state.minutes_Counter} : {this.state.seconds_Counter}</Text>
                        </View>

                    
                        <View style={styles.columnView}>
                            <Text style={styles.buttonText}>{this.state.TeamName}: {this.state.UsersTeamGAAGoalCounter} : {this.state.UsersTeamGAAPointCounter} </Text>
                        </View>

        
                        <View style={styles.columnView}>


                            <TouchableOpacity
                                onPress={this.onButtonStart}
                                activeOpacity={0.6}
                                style={[styles.button, { backgroundColor: this.state.startDisable ? '#C30000' : '#0187F7', }]}  

                                disabled={this.state.startDisable} >
                                            
                                <Text style={styles.buttonText}>START</Text>
                                            
                            </TouchableOpacity>
                        </View>

                        <View style={styles.columnView}>

                            <TouchableOpacity
                                onPress={this.onButtonStop}
                                activeOpacity={0.6}
                                style={styles.button}>
                                
                                <Text style={styles.buttonText}>STOP</Text>
                    
                                </TouchableOpacity>

                        </View>    

                    
                            {UndoButton}
                        

                        <View style={styles.columnView}>
                            <TouchableOpacity
                                    onPress={this.onButtonClear}
                                    activeOpacity={0.6}
                                    style={[styles.button, { backgroundColor: this.state.startDisable ? '#C30000' : '#0187F7', }]}  
                                    disabled={this.state.startDisable} >
                                
                            <Text style={styles.buttonText}> CLEAR </Text>
                    
                            </TouchableOpacity>

                        </View>
                        
                        
                        

                        <View style={styles.columnView}>
                            <Text style={styles.buttonText}>{this.state.OpponentName}: {this.state.OpponentsTeamGAAGoalCounter} : {this.state.OpponentsTeamGAAPointCounter} </Text>
                        </View>

                        <View style={styles.columnView}>

                            <TouchableOpacity
                                onPress={this.ReviewGame}
                                activeOpacity={0.6}
                                style={styles.button} 
                                >
                                <Text style={styles.buttonText}>Review Game</Text>
                    
                                </TouchableOpacity>

                        </View>    

                        <View style={styles.columnView}>

                            <TouchableOpacity
                                onPress={this.EndGame}
                                activeOpacity={0.6}
                                style={styles.button} 
                                    >
                                <Text style={styles.buttonText}>End Game</Text>

                            </TouchableOpacity>

                        </View>    



                    </View>

                    );
                }
                else if(SportType == 'Soccer')
                {
                        ScoreboardContainer = (

                            <View style={styles.Wrapper}>
                            
                            <View style={styles.columnView}>
                                <Text style={styles.buttonText}>{this.state.minutes_Counter} : {this.state.seconds_Counter}</Text>
                            </View>

                        
                            <View style={styles.columnView}>
                                <Text style={styles.buttonText}>{this.state.TeamName}: {this.state.UsersTeamSoccerGoalCounter}</Text>
                            </View>

            
                            <View style={styles.columnView}>


                                <TouchableOpacity
                                    onPress={this.onButtonStart}
                                    activeOpacity={0.6}
                                    style={[styles.button, { backgroundColor: this.state.startDisable ? '#C30000' : '#0187F7', }]} 

                                    disabled={this.state.startDisable} >
                                                
                                    <Text style={styles.buttonText}>START</Text>
                                                
                                </TouchableOpacity>
                            </View>

                            <View style={styles.columnView}>

                                <TouchableOpacity
                                    onPress={this.onButtonStop}
                                    activeOpacity={0.6}
                                    style={[styles.button, { backgroundColor:  '#C30000'}]} >
                                    
                                    <Text style={styles.buttonText}>STOP</Text>
                        
                                    </TouchableOpacity>

                            </View>    

                        
                                {UndoButton}
                            

                            <View style={styles.columnView}>
                                <TouchableOpacity
                                        onPress={this.onButtonClear}
                                        activeOpacity={0.6}
                                        style={[styles.button, { backgroundColor: this.state.startDisable ? '#C30000' : '#FF6F00' }]} 
                                        disabled={this.state.startDisable} >
                                    
                                <Text style={styles.buttonText}> CLEAR </Text>
                        
                                </TouchableOpacity>

                            </View>
                            
                            
                            

                            <View style={styles.columnView}>
                                <Text style={styles.buttonText}>{this.state.OpponentName}: {this.state.OpponentsTeamSoccerGoalCounter} </Text>
                            </View>

                            <View style={styles.columnView}>

                                <TouchableOpacity
                                    onPress={this.ReviewGame}
                                    activeOpacity={0.6}
                                    style={styles.button} 
                                    >
                                    <Text style={styles.buttonText}>Review Game</Text>
                        
                                    </TouchableOpacity>

                            </View>    

                            <View style={styles.columnView}>

                                <TouchableOpacity
                                    onPress={this.EndGame}
                                    activeOpacity={0.6}
                                    style={styles.button} 
                                        >
                                    <Text style={styles.buttonText}>End Game</Text>

                                </TouchableOpacity>

                            </View>    


            
                        
                            

                        </View>

                    );
                }
            }

            if(displayEventsContainer == true)
            {
                
                if(SportType == 'GAA')
                {

                        GAAEventContainer = (

                            <View>
                                
                                <View style={styles.EventsContainerRowView}>
                                
                                        <TouchableOpacity style={styles.eventbutton1} value='Goal'  onPress={this.ObtainEventSelected('Goal')}>
                                            <Text style={styles.buttonText}>Goal</Text>
                                        </TouchableOpacity> 

                                        <TouchableOpacity style={styles.eventbutton2} value='Point'   onPress={this.ObtainEventSelected('Point')}>
                                            <Text style={styles.buttonText}>Point</Text>
                                        </TouchableOpacity>

                                        
                                        <TouchableOpacity style={styles.eventbutton3} value='Shot'  onPress={this.ObtainEventSelected('Shot')}>
                                            <Text style={styles.buttonText}>Shot</Text>
                                        </TouchableOpacity>

                                </View>


                            
                                <View style={styles.EventsContainerRowView}>
                                                    
                                                <TouchableOpacity style={styles.eventbutton4} value='Tackle'  onPress={this.ObtainEventSelected('Tackle')}>
                                                        <Text style={styles.buttonText}>Tackle</Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity style={styles.eventbutton5}  value='Pass' onPress={this.ObtainEventSelected('Pass')}>
                                                        <Text style={styles.buttonText}>Pass</Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity style={styles.eventbutton6} value='LostTheBall'  onPress={this.ObtainEventSelected('LostTheBall')}>
                                                        <Text style={styles.buttonText}>Lost the Ball</Text>
                                                </TouchableOpacity>


                                </View>


                                <View style={styles.EventsContainerRowView}>
                                                    
                                    <TouchableOpacity style={styles.eventbutton7} value='Foul'  onPress={this.ObtainEventSelected('Foul')}>
                                    <Text style={styles.buttonText}>Foul</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.eventbutton8} value='WonTheBall'  onPress={this.ObtainEventSelected('WonTheBall')}>
                                        <Text style={styles.buttonText}>Won the Ball</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.eventbutton9} value='Kickout' onPress={this.ObtainEventSelected('Kickout')}>
                                        <Text style={styles.buttonText}>Kickout</Text>
                                    </TouchableOpacity>
            
            
                                </View>

                                <View style={styles.EventsContainerRowView}>
                                        <TouchableOpacity style={styles.eventSubButton10} value='Sub' onPress={this.SubEventSelected()}>
                                            <Text style={styles.buttonText}>Sub</Text>
                                        </TouchableOpacity>
                                </View>


                            </View>

                            



                            );

                    }
                    else if(SportType == 'Soccer')
                    {
                        SoccerEventContainer = (
                   
                            <View>
                                
                                <View style={styles.EventsContainerRowView}>
                                
                                        <TouchableOpacity style={styles.eventbutton1} value='Goal' onPress={this.ObtainEventSelected('Goal')}>
                                            <Text style={styles.buttonText}>Goal</Text>
                                        </TouchableOpacity> 

                                        <TouchableOpacity style={styles.eventbutton2} value='Interception'>
                                            <Text style={styles.buttonText}>Interception</Text>
                                        </TouchableOpacity>

                                        
                                        <TouchableOpacity style={styles.eventbutton3} value='Shot' onPress={this.ObtainEventSelected('Shot')}>
                                            <Text style={styles.buttonText}>Shot</Text>
                                        </TouchableOpacity>
                    
                                
                                </View>


                        
                                <View style={styles.EventsContainerRowView}>
                                                    
                                                <TouchableOpacity style={styles.eventbutton4} value='Tackle' onPress={this.ObtainEventSelected('Tackle')}>
                                                        <Text style={styles.buttonText}>Tackle</Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity style={styles.eventbutton5}  value='Pass' onPress={this.ObtainEventSelected('Pass')}>
                                                        <Text style={styles.buttonText}>Pass</Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity style={styles.eventbutton6} value='LostTheBall' onPress={this.ObtainEventSelected('LostTheBall')}>
                                                        <Text style={styles.buttonText}>Lost the Ball</Text>
                                                </TouchableOpacity>


                                </View>


                                <View style={styles.EventsContainerRowView}>
                                                    
                                    <TouchableOpacity style={styles.eventbutton7} value='Foul' onPress={this.ObtainEventSelected('Foul')}>
                                    <Text style={styles.buttonText}>Foul</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.eventbutton8} value='WonTheBall' onPress={this.ObtainEventSelected('WonTheBall')}>
                                        <Text style={styles.buttonText}>Won the Ball</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.eventbutton9} value='Kickout' onPress={this.ObtainEventSelected('Kickout')}>
                                        <Text style={styles.buttonText}>Kickout</Text>
                                    </TouchableOpacity>


                                </View>

                                <View style={styles.EventsContainerRowView}>
                                        <TouchableOpacity style={styles.eventSubButton10} value='Sub' onPress={this.SubEventSelected()}>
                                            <Text style={styles.buttonText}>Sub</Text>
                                        </TouchableOpacity>
                                </View>


                            </View>

                        );
                    }

                }

                //Display Event History
                if(displayEventHistory == true)
                {
                    HistoryContainer = (
                        

                
                            <View style = {styles.EventHistoryContainer}>
                    
                            {/* Have a event history , Gets the most recent event and the previous 5 events */}
                   
                                <Text style={styles.HistoryCenterStatsText}> Event History</Text>

                                


                                            {this.state.StatsHolder.slice(Math.max(StatsHolder.length - 5,0)).map((data1, element) => {
                                                return (
                                                
                                                    <View key={element} style={styles.viewRow}>

                                            
                                                            <Text style={styles.StatsText}> {data1.fullName} - </Text>
                                                    

                                                
                                                            <Text style={styles.StatsText}> Number: {data1.playerKitNumber} - </Text>
                                            

                                        
                                                            <Text style={styles.StatsText}> {data1.eventType} - </Text>
                                        

                                
                                                            <Text style={styles.StatsText}> {data1.TimestampMinute} : {data1.TimestampSecond} </Text>
                                        


                                                    </View>
                                                )
                
                                            })} 


                        </View> 

            
                    
                    );



                
        
        

                }


                if(ActivateUndoButton == true)
                {
                    UndoButton = (
                    
                        <View >

                            <TouchableOpacity
                                onPress={this.UndoEvent}
                                activeOpacity={0.6}
                                style={[styles.buttonUndo, { backgroundColor:'#FF6F00' }]} 
                            > 
                                <Text style={styles.buttonText}>Undo Event</Text>
                                            
                            </TouchableOpacity>
                        </View>
                    );
                }
                   

              
            
     


                
        
        

    

                if(displayEventPattern == true)
                {
            
                    EventsPatternContainer = (
                        
                        <View style = {styles.EventsPatternContainer}>
                            <Text style={styles.StatsText}>Event Patterns</Text>
                        
                                    <View style={styles.viewRow}>
                                        <Text style={styles.StatsText}>{TeamEventPatternMessage}</Text>
                                    </View>


                                    <View style={styles.viewRow}>
                                        <Text style={styles.StatsText}>{IndividualEventPatternMessage}</Text>
                                    </View>

                             

                        </View>

                

                    );

                }


            return (

                <View style={{flex: 1,backgroundColor: '#252626'}}>


                    <StatusBar hidden />
            
                    <View>
                        {ScoreboardContainer}
                        {ReviewIndividualPlayerStatsContainer}
                        <View>
                            {UndoButton}
                        </View>

                                          
                        {HistoryContainer}
                   
                        {EventsPatternContainer}


                           
                        
                            {ReviewDetailGameAnalysis}
                  

 
                   

                        {FieldPositionSelectionContainer}


                    </View>


                
                {ReviewDetailGameAnalysisOptions}

                  
             
                         
                        <View> 
                            {ReviewDetailGameAnalysisFieldView}
                        </View>



              


                   

                    <View>
                        {GAAEventContainer}
                    </View>
                              
                  
                  <View>

                     {ReviewGameContainer}
     
                  </View>
                       


                    <View>                         
                          {HistoryContainer}
                    </View>    
                     
                    <View>
                         {EventsPatternContainer}
                    </View>

            
                   

                    <View>
                         {EventPositionDisplay}
                    </View>

          

                    <View>
                        {SoccerEventContainer}
                    </View>
    
                 
                         {ReviewTotalTeamStatsContainer}
               

            
                         {ReviewOpponentsTotalTeamStatsContainer}
              
                         
             
           
                         {ReviewIndividualSquadPlayer}
                 
                         {IndividualStatsTable}
                  
                         {ReviewIndividualSubBenchPlayer}
                 
                
                        

                 

                    <View>
                         {StatsTable}
                    </View>

                    <View>
                         {YourTeamMode}
                    
                         {OpponentsMode}
                
                    <View >
                         {PlayerContainer}
                     
                    </View>

                    </View>

              

            
                    <View>
                         {SubPlayerContainer}
                    </View>

                </View>
      

           
   

        )
    }

}

const styles = StyleSheet.create({
 
    FieldContainer: {
        flex: 1,
        flexDirection:"row",
        top:wp('10%'),
        width:wp('90%'),
        paddingLeft: 10, 

    },

    imagePlotContainer: {

    
        flexWrap: 'wrap',
        flexDirection:"column",
        top:wp('5%'),
     
    
  

    },

    fieldcontainer1: {
        // top:wp('5%'),
        flexWrap: 'wrap',
        
       

    },

    fieldcontainer2: {
        top:wp('5%'),
        // flexWrap: 'wrap',
        
       

    },


       
    EventsContainerRowView: {
        height: hp('100%'), // 70% of height device screen
        width: wp('100%') ,  // % of width device screen
 
        flex: 1,
        
        flexDirection: 'row',  
        paddingLeft: 10, 
        top:wp('10%'),
        

    },

    TextBlack: {
        color: "black",
        fontSize:18,
        fontWeight: "bold",
    },

    Text:{
        color: "white",
        fontSize:18,
        fontWeight: "bold",
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

    
    footerContainer: {
        width: wp('100%') ,  // % of width device screen
   
        
        // bottom:'10%',
        // marginTop: 400,
      flexDirection:"row",
      justifyContent:'space-between',

      height: 50,
 
      borderRadius: 5,
      fontSize: hp('1%') ,
      backgroundColor: 'black',
    },


    Wrapper: {

      width: wp('100%') ,  // % of width device screen
      position:'absolute',
      flex:1,
      flexDirection:"row",
      flexWrap: 'wrap',
      justifyContent:'space-between',
      alignItems: 'center',
      height: 50,
      width:'100%',
   
      fontSize: hp('1%') ,
      backgroundColor: 'black',

    },


    ReviewWrapper: {

        width: wp('100%') ,  // % of width device screen
        position:'absolute',
        flex:1,
        flexDirection:"row",
        flexWrap: 'wrap',
        justifyContent:'space-between',
        alignItems: 'center',
        fontSize: hp('1%') ,
        backgroundColor: 'black',
  
      },

     
    input: {
        height: 48,
        width:'100',
        borderRadius: 5,
        // overflow: 'hidden',
        backgroundColor: 'white',
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 30,
        marginRight: 30,
        paddingLeft: 16
    },
    

    DetailedGameAnalysisView: {
        backgroundColor: 'white',
        flex: 1,
        //  height:hp('100%'),
        top:hp('30%'), 


        // width: wp('100%') ,  // % of width device screen
        // padding:4,

    },

    StatsTable: {
  
        flex:1,
        flexDirection:"row",
        flexWrap:'wrap',
        marginTop: hp('20%'),

   
        fontSize: hp('1%') ,
   
        zIndex: 1,

    },
    StatsRow: {
        flex:1,
  
        width: wp('100%'),

        // flexWrap:'wrap',
        justifyContent:'center',
        alignItems: 'center',
        flexDirection: 'row',
   
    },
    StatsText:{
   
        fontSize: hp('2%') ,
        padding:5,
        color: "white",
        // fontWeight: "bold"

    },

    HistoryStatsText:{
        color:'white',
        fontSize: hp('2%') ,

    },


    StatsCenterText:{
   
        fontSize: hp('2%') ,
        padding:5,
        color: "white",
        fontWeight: "bold",
        alignSelf: "center"

    },

    HistoryCenterStatsText:{
        color:'white',
        fontSize: hp('2%') ,
      
        // fontWeight: "bold",
    
    },

    textAnalysis:{
        fontSize: hp('2%') ,
        padding:5,
        color: "white",
        fontWeight: "bold",
        justifyContent:'center',
    },

    StatsTitle:{
        fontSize: hp('2%') ,
        padding:5,
        color: "white",
        fontWeight: "bold"
    },
    column:{
        flex:1,
        justifyContent:'center',
        alignItems: 'center',
        flexDirection: 'column',
        fontSize: hp('1%') 
    },

    ReviewContainer: {

        flexDirection:"row",
        top:wp('5%'),
        bottom:'5%',
        justifyContent:'space-between',
        alignItems: 'center',
        height: 50,
     
   
        fontSize: hp('1%') ,
        backgroundColor: 'black',
  
      },


      
    ReviewContainer2: {

        flexDirection:"row",
        // top:wp('5%'),
        alignItems: 'center',
        justifyContent:'space-between',
  
        // height: 50,
     
   
        fontSize: hp('1%') ,
        backgroundColor: 'black',
  
      },


    myText: {
      fontSize: hp('5%') // End result looks like the provided UI mockup
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
      
        padding: 1,
      
        borderRadius: 5,
        alignItems: "center",
        justifyContent: 'space-around'
    },


    buttonUndo: {
        backgroundColor: '#788eec',
    
        padding: 1,
        width:'20%',
        borderRadius: 5,
        alignItems: "center",
        justifyContent: 'space-around'
    },
    button1: {
        backgroundColor: '#788eec',

        padding: 15,
        
        borderRadius: 5,
        alignItems: "center",
        justifyContent:'space-between'
    },
  
    footerView: {
        flex: 1,
        alignItems: "center",
        marginTop: 20
    },
    footerText: {
        fontSize: 16,
        color: '#2e2e2d'
    },
    footerLink: {
        color: "#788eec",
        fontWeight: "bold",
        fontSize: hp('2%') 
    },
  
    container: {
        flex: 1,

        backgroundColor: '#242424', 
  

    },
    row:{
        flex: 1,  
        flexDirection: 'row'
    },

    rowView: {
        flex: 1,
        padding: 8,
        flexDirection: 'row'
    },

    ReviewSelectionColumnView: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        fontSize: hp('1%'), 
        top:'5%',
        bottom:'5%',
        justifyContent: 'space-around'
    },


  
  

    playerRowText: {
  
        flexDirection: 'row',


   
    },

    ReviewListPlayerRowView1: {
  
        flexDirection: 'row',
         position: 'absolute' , 
  

    },

    ReviewListPlayerRowText1: {
  
        flexDirection: 'row',
         position: 'absolute' , 
     
        left:10,

   
    },

    ReviewListPlayerRowView2: {
  
        flexDirection: 'row',
         position: 'absolute' , 
    
        bottom:'10%'

   
    },

    ReviewListPlayerRowText2: {
  
        flexDirection: 'row',
         position: 'absolute' , 
        // top: 400,
        left:10,
        bottom:'20%'

   
    },


    playerColumnView: {

        
      
        marginLeft: 10,
  

      
        flex:1,
        flexDirection: 'column',

    
        
    },
    testrrr: {

        flex:1,
        flexDirection: 'row',
     
        
    },

 
    

    playerColumnView1: {

        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },

    playerColumnView2: {

        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },


    testrow: { 
        flex:1,
        flexDirection: 'column',
    },

    columnView: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        fontSize: hp('1%') 
    },

    GetOpponentsPlayers:{
        flexDirection: 'row',
        fontSize: hp('1%') ,
        position:'absolute', 
        zIndex: 1,
        marginTop: hp('50%'),
        paddingBottom: 40,
        flexWrap:'wrap',
    },

    GetYourTeamPlayers:{
        flexDirection: 'row',
        fontSize: hp('1%') ,
        position:'absolute', 
        zIndex: 1,
        marginTop: hp('50%'),
        paddingBottom: 40,
        flexWrap:'wrap',
   
    },

    OpponentsModeBtn:{
        height: hp('8%'), // 70% of height device screen
        width: wp('20%') ,  // % of width device screen
        fontSize: hp('1%') ,
        borderRadius:7,
        // marginTop: 395,
        // padding:40,
        backgroundColor: '#C30000',
        justifyContent: 'space-around'
    },

    playerRowView: {
    
        backgroundColor: '#252626', 
        flexDirection: 'row',
        fontSize: hp('1%') ,
        position:'absolute', 
        zIndex: 1,
        marginTop: hp('70%'),
        paddingBottom: 12,
        flexWrap:'wrap',
       

    },

    StartingKitNumberbutton: {
        height: hp('8%'), // 70% of height device screen
        width: wp('7%') ,  // % of width device screen
        fontSize: hp('1%') ,
        borderRadius:7,
        // marginTop: 395,
        padding:4,
        backgroundColor: '#C30000',
        justifyContent: 'space-around'
                // flexWrap:'wrap',
 


      },

      SubKitNumberbutton: {
        height: hp('8%'), // 70% of height device screen
        width: wp('7%') ,  // % of width device screen
        fontSize: hp('1%') ,
        borderRadius:7,
        // marginTop: 395,
        
        backgroundColor: '#0187F7',
         
 


      },

      button3: {
        height: hp('8%'), // 70% of height device screen
        width: wp('10%') ,  // % of width device screen
        fontSize: hp('1%') ,
        borderRadius:7,
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 30,
        marginRight: 30,
        // marginTop: 395,
        // justifyContent:'center',
        // alignContent:'center',
        
        backgroundColor: '#0187F7',
         
 


      },


    EventRowView: {
      
        marginTop: 50,
   
        // alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around'
    }, 
    EventRowView2: {
      
        marginTop: 100,
   
        // alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around'
    }, 

    EventRowView3: {
      
        marginTop:  90,
   
        // alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around'
    }, 

    EventColumnView: {
        height: hp('100%'), // 70% of height device screen
        width: wp('100%') ,  // % of width device screen

        flex: 1,
    
        flexDirection: 'column',  
        paddingLeft: 10, 
        marginTop:50,
        // flex: 1,
        // marginLeft:-800,
        // marginTop: 150,
        // marginRight:550,
        // alignItems: 'center',
        // flexDirection: 'column',
    
    },


    FieldContainerRowView: {
        height: hp('100%'), // 70% of height device screen
        width: wp('100%') ,  // % of width device screen
 
        flex: 1,
        
        flexDirection: 'row',  
        paddingLeft: 10, 
        top:wp('10%'),
    },



      
 


  




         
    EventsContainerSubRowView: {
        height: hp('100%'), // 70% of height device screen
        width: wp('100%') ,  // % of width device screen
 
        flex: 1,
        
        flexDirection: 'row',  
        paddingLeft: 50, 
        top:wp('90%'),
    },



     



    EventsContainer:{
        flex: 1,
        flexDirection: 'row',
        position:"absolute",
     
        
        marginTop: 100,  
        marginLeft:10,
    },

    eventbutton1: {
        backgroundColor: '#C30000',
        height: 60,
        width: 100,
        position:"absolute",
        left: 115,
        marginTop: 5,
        marginLeft:-100,
        padding: 1,
        paddingTop:8,
      
        paddingBottom:8,
        borderRadius: 5,
        alignItems: "center",
        justifyContent:'space-between'
    
    },

    eventbutton2: {
        backgroundColor: '#C30000',
        position:"absolute",
        left: 220,
        height: 60,
        width: 100,
        padding: 1,
        paddingTop:8,
        paddingBottom:8,
        borderRadius: 5,
        marginTop: 5,
        marginLeft:-90,
        alignItems: "center",
        justifyContent:'space-between'
    },
    eventbutton3: {

        backgroundColor: '#C30000',
        position:"absolute",
        left: 335,
        // height: 48,
        // width:60,
        height: 60,
        width: 100,
        padding: 1,
        paddingTop:8,
        paddingBottom:8,
        borderRadius: 5,
        marginTop: 5,
        marginLeft:-90,
        alignItems: "center",
        justifyContent:'space-between'

    },
    eventbutton4: {
        
        backgroundColor: '#C30000',
        position:"absolute",
        left: 115,
        // height: 48,
        // width:60,
        height: 60,
        width: 100,
        padding: 1,
        paddingTop:8,
        paddingBottom:8,
        borderRadius: 5,
        marginTop: 70,
        marginLeft:-100,
        alignItems: "center",
        justifyContent:'space-between'
    },
    eventbutton5: {
        backgroundColor: '#C30000',
        position:"absolute",
        left: 220,
        // height: 48,
        // width:60,
        height: 60,
        width: 100,
        padding: 1,
        paddingTop:8,
        paddingBottom:8,
        borderRadius: 5,
        marginTop: 70,
        marginLeft:-90,
        alignItems: "center",
        justifyContent:'space-between'
    },
    eventbutton6: {
        backgroundColor: '#C30000',
        position:"absolute",
        left: 335,
        // height: 48,
        // width:60,
        height: 60,
        width: 100,
        padding: 1,
        paddingTop:8,
        paddingBottom:8,
        borderRadius: 5,
        marginTop: 70,
        marginLeft:-90,
        alignItems: "center",
        justifyContent:'space-between'
    },
    eventbutton7: {
        backgroundColor: '#C30000',
        position:"absolute",
        left: 115,
        // height: 48,
        // width:60,
        height: 60,
        width: 100,
        padding: 1,
        paddingTop:8,
        paddingBottom:8,
        borderRadius: 5,
        marginTop: 135,
        marginLeft:-100,
        alignItems: "center",
        justifyContent:'space-between'
    },
    eventbutton8: {
        backgroundColor: '#C30000',
        position:"absolute",
        left: 220,
        // height: 48,
        // width:60,
        height: 60,
        width: 100,
        padding: 1,
        paddingTop:8,
        paddingBottom:8,
        borderRadius: 5,
        marginTop: 135,
        marginLeft:-90,
        alignItems: "center",
        justifyContent:'space-between'
    },
    eventbutton9: {
        backgroundColor: '#C30000',
        position:"absolute",
        left: 335,
        // height: 48,
        // width:60,
        height: 60,
        width: 100,
        padding: 1,
        paddingTop:8,
        paddingBottom:8,
        borderRadius: 5,
        marginTop: 135,
        marginLeft:-90,
        alignItems: "center",
        justifyContent:'space-between'
    },

    eventbutton10:{
        backgroundColor: '#C30000',
        position:"absolute",
        left: 115,
        // height: 48,
        // width:60,
        height: 60,
        width: 100,
        padding: 1,
        paddingTop:8,
        paddingBottom:8,
        borderRadius: 5,
        marginTop: 235,
        marginLeft:-100,
        alignItems: "center",
        justifyContent:'space-between'
    },

    eventSubButton10: {
        backgroundColor: '#C30000',
        position:"absolute",
        left: 355,
        // height: 48,
        // width:60,
        height: 60,
        width: 100,
        padding: 1,
        paddingTop:8,
        paddingBottom:8,
        borderRadius: 5,
        marginTop: 200,
        marginLeft:-109,
        
        alignItems: "center",
        justifyContent:'space-between'
    },


   

scoreboardcontainer: {
    flex: 1,
    alignItems: 'center',
    height: 48,


    backgroundColor: 'white',
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 30,
    marginRight: 30,
    paddingLeft: 16,
    zIndex: 1,
},

FieldImage: {


     position:"absolute",
 
      right:200,
     height: hp('90%'), // 70% of height device screen
     width: wp('20%') ,  // % of width device screen

},




EventsPatternContainer:{
    position:'absolute', 

    marginTop: hp('10%'),
    marginLeft: wp('60%'),
    borderWidth: 1,
    borderColor:'#949494',
    borderRadius: 6,
    flex: 1,
 
    flexDirection: 'column',  
 
    fontSize: hp('2%') ,

},

FieldContainerATTtext: {
    position:"absolute",
    right:200,
    marginTop: 100,
},


FieldContainerDeftext: {
    position:"absolute",
    right:200,
    marginTop: 600,
},

      

EventHistoryContainer:{
    position:'absolute', 
    marginTop: hp('10%'),
    marginLeft: wp('1%'),
    borderWidth: 1,
    borderColor:'#949494',
    borderRadius: 6,
    flex: 1,

    flexDirection: 'column',  
 
   
    fontSize: hp('2%') ,



},

ExitButton:{
    width:50,
    height: 48,
},

viewRow:{
    // marginTop: wp('20%'),
    flexDirection: 'row',
    borderWidth: 1,
    borderColor:'#949494',
  
 
},
PlayerSelectionRow: {
      
    flexDirection: 'row',
    justifyContent: 'space-around'

}, 
PlayerSelectionContainer: {
    alignItems: 'center',
    width:770,
    height: 48,
    marginLeft: 10,
    marginRight: 10,
    paddingLeft: 1,
    flexDirection: 'row',
    justifyContent: 'space-around'
},

button133: {
    backgroundColor: '#788eec',
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


footerView: {
    flex: 1,
    alignItems: "center",
    marginTop: 20
},
footerText: {
    fontSize: 16,
    color: '#2e2e2d'
},
footerLink: {
    color: "#788eec",
    fontWeight: "bold",
    fontSize: 16
},
parent: {
    display: "flex",
    flexDirection: "row",
    borderWidth:1,
    borderRadius: 80,
    borderColor: "#FFFFFF",
    backgroundColor: '#FF2D00',
    paddingLeft: "6%",
    paddingRight: "6%",
    paddingTop: ".5%",
    paddingBottom: ".12%",
    height: 100,
    maxWidth: "100%",
    alignSelf: "center",
    justifyContent: "center",
},




counterText:{

    fontSize: 28,
    color: '#000'
},

buttonText: {
    padding:3,
    color: "#FFFFFF",
    fontSize: hp('2%'),
    alignSelf: "center",
    fontWeight: "bold",
},

HeadStyle: { 
    height: 50,
    alignContent: "center",
    backgroundColor: '#ffe0f0'
  },


field:{

    position:'absolute',
    flex:1,
    height: hp('100%'),
    width:  wp('60%'),
    resizeMode: 'contain',

},

test: {
  backgroundColor: '#000000',
  borderWidth: 4,
  borderColor:'#949494',
  borderRadius: 6,
},

imagePxGAA:{
 
    height:376,
    width: 700,
    
 },

 imagePxSoccer:{
    height: 400,
    width: 700,

},

imageSoccerMobile:
{
      //Working 
      height:280,
      width: 480,
},

imageGAAMobile:
{
      //Working 
      height:300,
      width: 590,
},


imageGAA:{
    width: win.width,
    height: 300 * ratioView, //399 is actual height of image
  
 

},
imageSoccer:{
    width: win.width,
    height: 376 * SoccerRatioView , //399 is actual height of image
    

},



});

export default StatsApp;