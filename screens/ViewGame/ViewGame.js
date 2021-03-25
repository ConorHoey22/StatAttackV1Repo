import React, { useEffect, useState , Component  } from 'react'
import {ImageBackground, Dimensions,StatusBar,FlatList, Keyboard,  StyleSheet, Image, Text, View , ScrollView, TouchableOpacity,TextInput ,Picker, Button , Alert} from 'react-native'







import firebase from 'firebase/app'
import 'firebase/auth';
import 'firebase/database';
import { ThemeColors } from 'react-navigation';

import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';



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
            SportType: '',
            inviteCode:'',
            hasATeam: false,
            userType: [],
            GameList:[],
            GameViewList:[],


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
       
       

            totalTeamGoals: 0,
            totalTeamPoints:0,
            totalTeamPasses: 0,
            totalTeamShots:0,
            totalTeamShotsOnTarget:0,
                     
            totalOpponentsTeamGoals:0,
            totalOpponentsTeamPoints:0,
            totalOpponentsTeamShots: 0,
            totalOpponentsTeamShotsOnTarget:0,
            totalOpponentsTeamPasses: 0,

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

            //Individual Player Stats
            PlayerKitNumber: 0,
            PlayerName:'',
            PlayerPosition:'',
            Goals:0,
            Points:0,
            Passes:0,
            Shots:0,
            ShotsOnTarget:0,

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
        

    //GET Game records and put them all into an array 
    var query = firebase.database().ref('/teams').child(myUserId).child('games').child(params.GameRecordKey).child('YourTeamStats').child(params.StatsRecordKey)
    .on('value', snapshot => {
   

        const gameObj = snapshot.val();


        let screenWidth = gameObj.screenWidth;
        this.setState({StatsStoredUsingScreenWidth: screenWidth});

        let screenHeight = gameObj.screenHeight;
        this.setState({StatsStoredUsingScreenHeight: screenHeight});


        let totalTeamGoals = gameObj.totalTeamGoals;
        this.setState({totalTeamGoals: totalTeamGoals});

        // let totalTeamPasses = gameObj.totalTeamPasses;
        // this.setState({totalTeamPasses:totalTeamPasses});

        let totalTeamShots = gameObj.totalTeamShots;
        this.setState({totalTeamShots:totalTeamShots});

        let totalTeamShotsOnTarget = gameObj.totalTeamShotsOnTarget;
        this.setState({totalTeamShotsOnTarget:totalTeamShotsOnTarget});



        let totalOpponentsTeamGoals = gameObj.totalOpponentsTeamGoals;
        this.setState({totalOpponentsTeamGoals: totalOpponentsTeamGoals});

        // let totalOpponentsTeamPasses = gameObj.totalOpponentsTeamPasses;
        // this.setState({totalOpponentsTeamPasses:totalOpponentsTeamPasses});

        let totalOpponentsTeamShots = gameObj.totalOpponentsTeamShots;
        this.setState({totalOpponentsTeamShots:totalOpponentsTeamShots});

        let totalOpponentsTeamShotsOnTarget = gameObj.totalOpponentsTeamShotsOnTarget;
        this.setState({totalOpponentsTeamShotsOnTarget:totalOpponentsTeamShotsOnTarget});



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

        console.log(this.state.OpponentsPlayerData);



    }


       
     


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

        console.log(this.state.OpponentsPlayerData);



    }

    //GET a specifc YOUR TEAM player
    ReviewPlayerStats = ( itemKey ) => {
        
        var selectedTeamPlayer = this.state.selectedTeamPlayer;
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
            

            //WE ARE HERE - finish orderby ID 
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



    //Toggles frontend - View overall game stats
    ReviewGameStats = async() => { 

        this.setState({displayReviewSelection:false});

        this.setState({ displayReviewGameStats: true});
    }

    //Toggles frontend - Event Selection will appear
    TeamSpecificStat = async() => {
    
        this.setState({ SelectAnEvent_ReviewGameStats_YourTeam:true });

        this.setState({ displayReviewSelection: false});

        
        this.setState({ displayReviewGameStats: false});



    }

    //Toggles frontend - Event Selection will appear
    OpponentsSpecificStat = async() => {
        
        this.setState({ SelectAnEvent_ReviewGameStats_Opponents:true});

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

          var SportType = this.state.SportType;
          
  
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

                console.log(snapshot.val());
              
                tempArr = this.snapshotToArray(snapshot);


                // console.log(this.snapshotToArray(snapshot));
                this.setState({
                    OpponentsPlayerData: tempArr
                });

        });


    }

    // //This will trigger a selection on the frontend , where the user selects to review their Team players or the Opponents Players
    // SelectPlayerSelection = async() => {

    //     this.setState({displayReviewGameStats: false});
    //     this.setState({displayReviewSelection:false});
    //     this.setState({displayTeamOption:true});
    // }

    // PlayerEventSelection = async() => {

    //     this.setState({displayEventSelection:true});
    //     this.setState({displaySelectedPlayerStats:false});

    // }   

    // OpponentsEventSelection = async() => {

    //     this.setState({displayOpponentsEventSelection:true});
    //     this.setState({displayOpponentsSelectedPlayerStats:false});
    // }


    // ExecutePlayerEventAnaylsis = async() => {

    //     //Users Player selection
    //     var selectedTeamPlayer = this.state.selectedTeamPlayer;

    //     //Users Event selection
    //     var YourTeamEventSelection = this.state.YourTeamEventSelection;

    //     //Array to store event Locations
    //     var EventFieldLocations = this.state.EventFieldLocations;

    //     var myUserId = firebase.auth().currentUser.uid;
    //     var tempEventFieldLocations = this.state.tempEventFieldLocations;
        

    //      const { state, setParams, navigate } = this.props.navigation;
    //      const params = state.params || {};

    //     //GET Screen width and height that was used when taking stats (From Db)
    //     var StatsStoredUsingScreenHeight = this.state.StatsStoredUsingScreenHeight;
    //     var StatsStoredUsingScreenWidth = this.state.StatsStoredUsingScreenWidth;



    //     //Check if the current user has the same device size (Screenwidth & Screenheight) 
    //     // if(StatsStoredUsingScreenHeight == screenHeight)
    //     // {
    //     //     if(StatsStoredUsingScreenWidth == screenWidth)
    //     //     {
            

    //             //Display within App 
           
           
    //           // //empty tempEventFieldLocations as this is only a temp array
    //             tempEventFieldLocations.splice(0,tempEventFieldLocations.length);

    //             //filter array to get the specific player and event locations
    //             for (var i = 0; i < EventFieldLocations.length; i++) 
    //             {
        
    //                 if(EventFieldLocations[i].UserID == selectedTeamPlayer && EventFieldLocations[i].EventType == YourTeamEventSelection)
    //                 {
        
    //                     var data = {
    //                         x:EventFieldLocations[i].x, 
    //                         y:EventFieldLocations[i].y 
    //                     };
        
        
    //                     //Push to new temp EventFieldLocations
    //                     this.state.tempEventFieldLocations.push(data);
        
    //                 }
    //             }

    //             console.log('TESTT');

    //             //Make Field Image appear
    //             this.setState({YourTeamFieldEventsView:true});

    //             this.setState({displayReviewYourTeamPlayer:false});

    //             this.setState({displaySelectedPlayerStats:false});
 
 
           
    //         }
          
    //  }
        // else{
        //     alert("EXPORT PDF - Please check the exported PDF ");

            


        //     //Logic to generate PDF with image and plots for this event
        //             //Send Data to another PAGE/Component

    
     






                        
            
        // }


       
        // //empty tempEventFieldLocations as this is only a temp array
        // tempEventFieldLocations.splice(0,tempEventFieldLocations.length);

        // //filter array to get the specific player and event locations
        // for (var i = 0; i < EventFieldLocations.length; i++) 
        // {

        //     if(EventFieldLocations[i].UserID == selectedTeamPlayer && EventFieldLocations[i].EventType == YourTeamEventSelection)
        //     {

        //         var data = {
        //             x:EventFieldLocations[i].x, 
        //             y:EventFieldLocations[i].y 
        //         };


        //         //Push to new temp EventFieldLocations
        //         this.state.tempEventFieldLocations.push(data);

        //     }
        // }


  

        // //Test to see if correct data
        // console.log(EventFieldLocations);
 
        // //Make Field Image appear
        // this.setState({YourTeamFieldEventsView:true});

        // this.setState({displayReviewYourTeamPlayer:false});

        // this.setState({displaySelectedPlayerStats:false});




   // }

    // ExecuteOpponentsPlayerEventAnaylsis = async() => {
        
    //     var myUserId = firebase.auth().currentUser.uid;

    //     //Users Player selection
    //     var selectedOpponentsPlayer = this.state.selectedOpponentsPlayer;

    //     //Users Event selection
    //     var OpponentsEventSelection = this.state.OpponentsEventSelection;

    //     //Array to store event Locations
    //     var OpponentsEventFieldLocations = this.state.OpponentsEventFieldLocations;


    //     //Get data from DB 
    //     firebase.database().ref('/teams').child(myUserId).child('/games').child(params.GameRecordKey).child('OpponentsEventFieldPositions').orderByChild("UserID").equalTo(selectedOpponentsPlayer)
    //     .on('value', snapshot => {

    //         tempArr = this.snapshotToArray(snapshot);

    //         this.setState({
    //             OpponentsEventFieldLocations: tempArr
    //         });
    //     });

    //       //Test to see if correct data
    //       console.log(OpponentsEventFieldLocations);
 
    //       //Make Field Image appear
    //       this.setState({OpponentsFieldEventsView:true});
        
    // }

    // // ---------- TEAM STATS SELECTION AND FIELD PLOTTING ---------------
    
    // TeamSpecificStat  = async() => {

    //     this.setState({displayTeamSpecificEventSelection:true});

    //     this.setState({displayReviewSelection:false});
    //     this.setState({displayReviewGameStats:false});

    // }

    // OpponentsSpecificStat = async() => {
        
    //     this.setState({displayOpponentsSpecificEventSelection:true});
    
    
    //     this.setState({displayReviewSelection:false});
    //     this.setState({displayReviewGameStats:false});
    
    // }
    
    // // ----------------------------------------------------------------------

    // ExecuteTeamSpecificEventSelection = async() => {

    //       //Users Event selection
    //       var YourTeamEventSelection = this.state.YourTeamEventSelection;
  
    //       //Array to store event Locations
    //       var EventFieldLocations = this.state.EventFieldLocations;
  
    //       var myUserId = firebase.auth().currentUser.uid;
    //       var tempEventFieldLocations = this.state.tempEventFieldLocations;

    //       var SportType = this.state.SportType;
          
  
    //        const { state, setParams, navigate } = this.props.navigation;
    //        const params = state.params || {};
         
    //       //empty tempEventFieldLocations as this is only a temp array
    //       tempEventFieldLocations.splice(0,tempEventFieldLocations.length);
  
    //       //filter array to get the specific player and event locations
    //       for (var i = 0; i < EventFieldLocations.length; i++) 
    //       {
  
    //           if(EventFieldLocations[i].EventType == YourTeamEventSelection)
    //           {
  
    //               var data = {
    //                   x:EventFieldLocations[i].x, 
    //                   y:EventFieldLocations[i].y 
    //               };
  
  
    //               //Push to new temp EventFieldLocations
    //               this.state.tempEventFieldLocations.push(data);
  
    //           }
    //       }
  
  
    
  
    //       //Test to see if correct data
    //       console.log(EventFieldLocations);
          

    //       console.log('test 2');

    //       this.setState({displayTeamSpecificEventSelection:false});

    //       if(SportType == 'GAA')
    //       {
    //             //Make Field Image appear
    //             this.setState({YourTeamSpecificStatFieldEvents:true});
    //       }
    //       else if (SportType == 'Soccer')
    //       {
    //             //Make Field Image appear
    //             this.setState({YourTeamSpecificStatFieldEventsSoccerView:true});
    //       }
   
   

       
  

    // }

    // ExecuteOpponentsSpecificEventSelection = async() => {


    //     //Users Event selection
    //     var OpponentsEventSelection = this.state.OpponentsEventSelection;



    //       //Test to see if correct data
    //       console.log(OpponentsEventFieldLocations);

    //        //Array to store event Locations
    //        var OpponentsEventFieldLocations = this.state.OpponentsEventFieldLocations;
   
    //        var myUserId = firebase.auth().currentUser.uid;
    //        var tempEventFieldLocations = this.state.tempEventFieldLocations;
           
    //        var SportType = this.state.SportType;
           
    //         const { state, setParams, navigate } = this.props.navigation;
    //         const params = state.params || {};
          
    //        //empty tempEventFieldLocations as this is only a temp array
    //        tempEventFieldLocations.splice(0,tempEventFieldLocations.length);
   
    //        //filter array to get the specific player and event locations
    //        for (var i = 0; i < OpponentsEventFieldLocations.length; i++) 
    //        {
   
    //            if(OpponentsEventFieldLocations[i].EventType == OpponentsEventSelection)
    //            {
   
    //                var data = {
    //                    x:OpponentsEventFieldLocations[i].x, 
    //                    y:OpponentsEventFieldLocations[i].y 
    //                };
   
   
    //                //Push to new temp EventFieldLocations
    //                this.state.tempEventFieldLocations.push(data);
   
    //            }
    //        }


    //        if(SportType == 'GAA')
    //        {
    //              //Make Field Image appear
    //              this.setState({OpponentsSpecificStatFieldEventsSoccerView:true});
    //        }
    //        else if (SportType == 'Soccer')
    //        {
    //              //Make Field Image appear
    //              this.setState({OpponentsSpecificStatFieldEventsSoccerView:true});
    //        }
 
    //       //Make Field Image appear
    //       this.setState({OpponentsFieldEventsView:true});

    //       this.setState({displayReviewGameStats:false});

    //       this.setState({displayOpponentsSpecificEventSelection:false});

    // }




        render(){
            
            var ReviewGameStats;
            var ReviewPlayerStats;
            var ReviewSelection;
            var TeamOption;
            var PlayerStats;
            
            var FieldWithPlots;
        
            var SportType = this.state.SportType;
            // var displayReviewGameStats = this.state.displayReviewGameStats;
            // var displayReviewYourTeamPlayer = this.state.displayReviewYourTeamPlayer;
            // var displayReviewOpponentsPlayer = this.state.displayReviewOpponentsPlayer;

            // var displaySelectedPlayerStats = this.state.displaySelectedPlayerStats;
            // var displaySelectedOpponentsPlayerStats = this.state.displaySelectedOpponentsPlayerStats; 

            // var displayOpponentsSelectedPlayerStats = this.state.displayOpponentsSelectedPlayerStats;
            // var displayReviewSelection = this.state.displayReviewSelection;

            // var YourTeamFieldEventsView = this.state.YourTeamFieldEventsView;
            // var OpponentsFieldEventsView = this.state.OpponentsFieldEventsView;

            // var displayEventSelection = this.state.displayEventSelection;
            // var displayOpponentsEventSelection = this.state.displayOpponentsEventSelection;

            // var displayTeamOption = this.state.displayTeamOption;

            // var displayTeamSpecificEventSelection = this.state.displayTeamSpecificEventSelection;
            // var displayOpponentsSpecificEventSelection = this.state.displayOpponentsSpecificEventSelection; 


            // var YourTeamSpecificStatFieldEvents = this.state.YourTeamSpecificStatFieldEvents;
            // var OpponentsSpecificStatFieldEvents = this.state.OpponentsSpecificStatFieldEvents;


            // var YourTeamSpecificStatFieldEventsSoccerView  = this.state.YourTeamSpecificStatFieldEventsSoccerView;
            // var OpponentsSpecificStatFieldEventsSoccerView = this.state.OpponentsSpecificStatFieldEventsSoccerView;


            var displayReviewSelection = this.state.displayReviewSelection;
            var displayReviewGameStats = this.state.displayReviewGameStats;


            //Event Selection - Overall Team/Opponent Team Events
            var SelectAnEvent_ReviewGameStats_YourTeam  = this.state.SelectAnEvent_ReviewGameStats_YourTeam;
            var SelectAnEvent_ReviewGameStats_Opponents = this.state.SelectAnEvent_ReviewGameStats_Opponents;

            //Event Selection - Player Specific Event Selection  
            var SelectAnEvent_ReviewGameStats_YourTeamPlayer = this.state.SelectAnEvent_ReviewGameStats_YourTeamPlayer;
            var SelectAnEvent_ReviewGameStats_Opponents_TeamPlayer = this.state.SelectAnEvent_ReviewGameStats_Opponents_TeamPlayer;

            //Field Location views - Overall Team/Opponent Team Events (GAA + Soccer)
            var YourTeamSpecificStatFieldEvents = this.state.YourTeamSpecificStatFieldEvents;
            var OpponentsSpecificStatFieldEvents = this.state.OpponentsSpecificStatFieldEvents;

            var YourTeamSpecificStatFieldEventsSoccerView = this.state.YourTeamSpecificStatFieldEventsSoccerView;
            var OpponentsSpecificStatFieldEventsSoccerView = this.state.OpponentsSpecificStatFieldEventsSoccerView;
            
            
            
   

            

 
          
        

                    if(displayReviewSelection == true)
                    {
                        ReviewSelection = (
                            <ScrollView style={stylesViewGame.container}>
        
                                <TouchableOpacity style={stylesViewGame.button} onPress = {this.ReviewGameStats}>
                                    <Text style={stylesViewGame.buttonTitle}>Review Games Stats</Text>
                                </TouchableOpacity>
                                
                                <TouchableOpacity style={stylesViewGame.button} onPress = {this.SelectPlayerSelection}>
                                    <Text style={stylesViewGame.buttonTitle}>View a specific player stats</Text>
                                </TouchableOpacity>
                            
                            </ScrollView>
                            
                            
                        );
        
                    }



                    if(displayReviewGameStats == true)
                    {

                        if(SportType == 'GAA')
                        {

                            ReviewGameStats= (

                                <ScrollView style={stylesViewGame.container}>
                                    <View style={stylesViewGame.headerContainer}>
                                        <Text style={stylesViewGame.buttonTitle}>{this.state.TeamName}</Text>
                                    </View>

                                    <View style={stylesViewGame.StatRow}>
                                        <Text style={stylesViewGame.buttonTitle}> Goals: {this.state.totalTeamGoals}</Text>
                                        <Text style={stylesViewGame.buttonTitle}> Points: {this.state.totalTeamPoints}</Text>
                                        <Text style={stylesViewGame.buttonTitle}> Shots: {this.state.totalTeamShots}</Text>
                                        <Text style={stylesViewGame.buttonTitle}> Shots on target: {this.state.totalTeamShotsOnTarget}</Text>
                                    </View>

                                    <TouchableOpacity style={stylesViewGame.button} onPress = {this.TeamSpecificStat}>
                                        <Text style={stylesViewGame.buttonTitle}>Review a specific stat from {this.state.TeamName} </Text>
                                    </TouchableOpacity>


                                    <View style={stylesViewGame.headerContainer}>
                                        <Text style={stylesViewGame.buttonTitle}> Opponents</Text>
                                    </View>

                                    <View style={stylesViewGame.StatRow}>
                                        <Text style={stylesViewGame.buttonTitle}> Goals: {this.state.totalOpponentsTeamGoals}</Text>
                                        <Text style={stylesViewGame.buttonTitle}> Points: {this.state.totalOpponentsTeamPoints}</Text>
                                        <Text style={stylesViewGame.buttonTitle}> Shots: {this.state.totalOpponentsTeamShots}</Text>
                                        <Text style={stylesViewGame.buttonTitle}> Shots on target: {this.state.totalOpponentsTeamShotsOnTarget}</Text>
                                    </View>

                                    <TouchableOpacity style={stylesViewGame.button} onPress = {this.OpponentsSpecificStat}>
                                        <Text style={stylesViewGame.buttonTitle}>Review a specific stat from the Opponents records</Text>
                                    </TouchableOpacity>


                                </ScrollView>
                            );

                        }
                        else if(SportType == 'Soccer')
                        {

                            ReviewGameStats= (

                                <ScrollView style={stylesViewGame.container}>
                                    <View style={stylesViewGame.headerContainer}>
                                        <Text style={stylesViewGame.buttonTitle}>{this.state.TeamName}</Text>
                                    </View>

                                    <View style={stylesViewGame.StatRow}>
                                        <Text style={stylesViewGame.buttonTitle}> Goals: {this.state.totalTeamGoals}</Text>
                                        <Text style={stylesViewGame.buttonTitle}> Shots: {this.state.totalTeamShots}</Text>
                                        <Text style={stylesViewGame.buttonTitle}> Shots on target: {this.state.totalTeamShotsOnTarget}</Text>
                                    </View>

                                    <TouchableOpacity style={stylesViewGame.button} onPress = {this.TeamSpecificStat}>
                                        <Text style={stylesViewGame.buttonTitle}>Review a specific stat from {this.state.TeamName} </Text>
                                    </TouchableOpacity>


                                    <View style={stylesViewGame.headerContainer}>
                                        <Text style={stylesViewGame.buttonTitle}> Opponents</Text>
                                    </View>

                                    <View style={stylesViewGame.StatRow}>
                                        <Text style={stylesViewGame.buttonTitle}> Goals: {this.state.totalOpponentsTeamGoals}</Text>
                                        <Text style={stylesViewGame.buttonTitle}> Shots: {this.state.totalOpponentsTeamShots}</Text>
                                        <Text style={stylesViewGame.buttonTitle}> Shots on target: {this.state.totalOpponentsTeamShotsOnTarget}</Text>
                                    </View>

                                    <TouchableOpacity style={stylesViewGame.button} onPress = {this.OpponentsSpecificStat}>
                                        <Text style={stylesViewGame.buttonTitle}>Review a specific stat from the Opponents records</Text>
                                    </TouchableOpacity>


                                </ScrollView>
                            );  
                        }

                    }


                    if(SelectAnEvent_ReviewGameStats_YourTeam)
                    {

                        if(SportType == 'GAA')
                        {

                            ReviewPlayerStats = (
                                
                                <ScrollView style={stylesViewGame.container}>
            
                                        <Text style={stylesViewGame.buttonTitle}>Select a stat</Text>
            
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
                                            <Text style={stylesViewGame.buttonTitle}>Review this players games stats</Text>
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
                                            selectedValue={this.state.YourTeamEventSelection}
                                            style={stylesViewGame.input}
                                            onValueChange={(text) => this.setState({YourTeamEventSelection:text})}
                                        >
                                            
                                            <Picker.Item label="Select a event" value="" />
                                            <Picker.Item label="Goal" value="Goal" />
                                            <Picker.Item label="Pass" value="Pass"/>
                        
                        
                                        </Picker>
            
                                        <TouchableOpacity style={stylesViewGame.button} onPress = {this.ExecuteYourTeamEventAnaylsis}>
                                            <Text style={stylesViewGame.buttonTitle}>Review this players games stats</Text>
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
                
                                    <Text style={stylesViewGame.buttonTitle}>Select a stat</Text>
                
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
                
                                </ScrollView>
                            );
                        }
                    }


                 //YOUR_TEAM SPECIFIC PLAYER  + OPPONENTS SPECIFIC PLAYER REVIEW
                
                 if(SelectAnEvent_ReviewGameStats_YourTeamPlayer == true)
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

                                <TouchableOpacity style={stylesViewGame.button} onPress = {this.ReviewPlayerStats}>
                                    <Text style={stylesViewGame.buttonTitle}>Review this players games stats</Text>
                                </TouchableOpacity>   

                            </ScrollView>

                        );

                    
                 }

                 if(SelectAnEvent_ReviewGameStats_Opponents_TeamPlayer == true)
                 {

                     ReviewPlayerStats = (

                         <ScrollView style={stylesViewGame.container}>

                             <Text style={stylesViewGame.buttonTitle}>Select an Opponents player</Text>

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

                             <TouchableOpacity style={stylesViewGame.button} onPress = {this.ReviewOpponentsPlayerStats}>
                                 <Text style={stylesViewGame.buttonTitle}>Review this players games stats</Text>
                             </TouchableOpacity>   

                         </ScrollView>

                     );
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
                                        //<Image style ={{width: this.state.StatsStoredUsingScreenWidth, height: this.state.StatsStoredUsingScreenHeight}}   

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
                                                                borderRadius: 50
                                                                }}>
                                                            </View> 
                                                    
                                                        )
                                                    })} 
                    

                                            </ScrollView>

                                 

                                        </ScrollView>
                
            
            
                                    );



                                } 
                                else 
                                {
                          
                                    FieldWithPlots = (

                
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

                        else
                        {



                            if(screenWidth < 600 || screenHeight < 376)
                            {
    
                                alert('Warning - This device is too small to display the full image. Please scroll across the image to navigate or use a larger device screen size.');
                                
                                FieldWithPlots = (

                    
                        
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
                                                        borderRadius: 50
                                                        }}>
                                                    </View> 
                                            
                                                )
                                            })} 
                                        </ScrollView>
                                    </ScrollView>
                
                                );
                            }

                            FieldWithPlots = (

                    
                        
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
                                                                borderRadius: 50
                                                                }}>
                                                            </View> 
                                                
                                                            )
                                                            })}        
                                                </ScrollView>

                                        </ScrollView>
                                    );

                                }
                                else
                                {



                                    FieldWithPlots = (

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
                            else
                            {

                                if(screenWidth < 600 || screenHeight < 376)
                                {
                                    alert('Warning - This device is too small to display the full image. Please scroll across the image to navigate or use a larger device screen size.');

                            
                                    FieldWithPlots = (
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
                                                                borderRadius: 50
                                                                }}>
                                                            </View> 
                                                
                                                            )
                                                            })}        
                                               

                                             </ScrollView>
                                        </ScrollView>
                                    );

                                }

                            
                                FieldWithPlots = (

                    
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
                  
                }

                if(OpponentsSpecificStatFieldEvents == true)
                {


                   // OpponentsEventFieldLocations

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
                                                    //<Image style ={{width: this.state.StatsStoredUsingScreenWidth, height: this.state.StatsStoredUsingScreenHeight}}   
            
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
                                                                            borderRadius: 50
                                                                            }}>
                                                                        </View> 
                                                                
                                                                    )
                                                                })} 
                                
            
                                                        </ScrollView>
            
                                             
            
                                                    </ScrollView>
                            
                        
                        
                                                );
            
            
            
                                            } 
                                            else 
                                            {
                                      
                                                FieldWithPlots = (
            
                            
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
            
                                    else
                                    {
            
            
            
                                        if(screenWidth < 600 || screenHeight < 376)
                                        {
                
                                            alert('Warning - This device is too small to display the full image. Please scroll across the image to navigate or use a larger device screen size.');
                                            
                                            FieldWithPlots = (
            
                                
                                    
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
                                                                    borderRadius: 50
                                                                    }}>
                                                                </View> 
                                                        
                                                            )
                                                        })} 
                                                    </ScrollView>
                                                </ScrollView>
                            
                                            );
                                        }
            
                                        FieldWithPlots = (
            
                                
                                    
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
                                                                            borderRadius: 50
                                                                            }}>
                                                                        </View> 
                                                            
                                                                        )
                                                                        })}        
                                                            </ScrollView>
            
                                                    </ScrollView>
                                                );
            
                                            }
                                            else
                                            {
            
            
            
                                                FieldWithPlots = (
            
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
                                        else
                                        {
            
                                            if(screenWidth < 600 || screenHeight < 376)
                                            {
                                                alert('Warnin1g - This device is too small to display the full image. Please scroll across the image to navigate or use a larger device screen size.');
            
                                        
                                                FieldWithPlots = (
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
                                                                            borderRadius: 50
                                                                            }}>
                                                                        </View> 
                                                            
                                                                        )
                                                                        })}        
                                                           
            
                                                         </ScrollView>
                                                    </ScrollView>
                                                );
            
                                            }
            
                                        
                                            FieldWithPlots = (
            
                                
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
                }



                


               
            
                    
                    




                    // if(displayTeamOption == true)
                    // {
                    
                    //     TeamOption = (
                    //         <ScrollView style={stylesViewGame.container}>
                                
                    //             <Text style={stylesViewGame.buttonTitle}>Select which team players you want to review</Text>

                    //             <TouchableOpacity style={stylesViewGame.button} onPress = {this.YourTeamSelected}>
                    //                 <Text style={stylesViewGame.buttonTitle}>{this.state.TeamName}</Text>
                    //             </TouchableOpacity>
                                
                    //             <TouchableOpacity style={stylesViewGame.button} onPress = {this.OpponentsSelected}>
                    //                 <Text style={stylesViewGame.buttonTitle}>Opponents</Text>
                    //             </TouchableOpacity>

                    //         </ScrollView>
                    //     );
                        
                        
                    // }


                //     if(displayReviewYourTeamPlayer == true)
                //     {

                //         ReviewPlayerStats = (

                //             <ScrollView style={stylesViewGame.container}>

                //                 <Text style={stylesViewGame.buttonTitle}>Select a player</Text>

                //                 <Picker
                //                     selectedValue={this.state.selectedTeamPlayer}
                //                     style={stylesViewGame.input}
                //                     onValueChange={(text) => this.setState({selectedTeamPlayer:text})}
                //                 >

                //                 <Picker.Item label="Select a Player" value="" />
                //                     {this.state.PlayerData.map((item, index) => {
                //                         return (

                //                                 <Picker.Item label={item.PlayerName} value={item.PlayerID}/>
                                            
                //                                 )

                //                     })} 

                //                 </Picker> 

                //                 <TouchableOpacity style={stylesViewGame.button} onPress = {this.ReviewPlayerStats}>
                //                     <Text style={stylesViewGame.buttonTitle}>Review this players games stats</Text>
                //                 </TouchableOpacity>   

                //             </ScrollView>

                //         );
                //     }

                //     if(displayReviewOpponentsPlayer == true)
                //     {

                //         ReviewPlayerStats = (

                //             <ScrollView style={stylesViewGame.container}>

                //                 <Text style={stylesViewGame.buttonTitle}>Select an Opponents player</Text>

                //                 <Picker
                //                     selectedValue={this.state.selectedOpponentsPlayer}
                //                     style={stylesViewGame.input}
                //                     onValueChange={(text) => this.setState({selectedOpponentsPlayer:text})}
                //                 >

                //                 <Picker.Item label="Select a Player" value="" />
                //                     {this.state.OpponentsPlayerData.map((item, index) => {
                //                         return (

                //                                 <Picker.Item label={item.PlayerName} value={item.PlayerID}/>

                //                                 )

                //                     })}

                //                 </Picker> 

                //                 <TouchableOpacity style={stylesViewGame.button} onPress = {this.ReviewOpponentsPlayerStats}>
                //                     <Text style={stylesViewGame.buttonTitle}>Review this players games stats</Text>
                //                 </TouchableOpacity>   

                //             </ScrollView>

                //         );
                //     }


                //     if(displayEventSelection == true)
                //     {
                    
                //             ReviewPlayerStats = (
                            
                //                 <ScrollView style={stylesViewGame.container}>
        
                //                     <Text style={stylesViewGame.buttonTitle}>Select a stat</Text>
        
                //                     <Picker
                //                         selectedValue={this.state.YourTeamEventSelection}
                //                         style={stylesViewGame.input}
                //                         onValueChange={(text) => this.setState({YourTeamEventSelection:text})}
                //                     >
                                        
                //                         <Picker.Item label="Select a event" value="" />
                //                         <Picker.Item label="Goal" value="Goal" />
                //                         <Picker.Item label="Point" value="Point"/>
                //                         <Picker.Item label="Pass" value="Pass"/>
                    
                    
                //                     </Picker>
        
                //                     <TouchableOpacity style={stylesViewGame.button} onPress = {this.ExecutePlayerEventAnaylsis}>
                //                         <Text style={stylesViewGame.buttonTitle}>Review this players games stats</Text>
                //                     </TouchableOpacity>   
        
                //                 </ScrollView>
                //             );
                        
                    
                    
                //     }

                //     if(displayOpponentsEventSelection == true)
                //     {

                //             ReviewPlayerStats = (

                //                 <ScrollView style={stylesViewGame.container}>

                //                     <Text style={stylesViewGame.buttonTitle}>Select a stat</Text>

                //                     <Picker
                //                         selectedValue={this.state.OpponentsEventSelection}
                //                         style={stylesViewGame.input}
                //                         onValueChange={(text) => this.setState({OpponentsEventSelection:text})}
                //                     >
                                        
                //                         <Picker.Item label="Select a event" value="" />
                //                         <Picker.Item label="Goal" value="Goal" />
                //                         <Picker.Item label="Point" value="Point"/>
                //                         <Picker.Item label="Pass" value="Pass"/>
                    
                    
                //                     </Picker>

                //                     <TouchableOpacity style={stylesViewGame.button} onPress = {this.ExecuteOpponentsPlayerEventAnaylsis}>
                //                         <Text style={stylesViewGame.buttonTitle}>Submit</Text>
                //                     </TouchableOpacity>   

                //                 </ScrollView>
                //             );
                        
                //     }

                //     if(displaySelectedPlayerStats == true)
                //     {
                //         PlayerStats = (
                            
                //             <ScrollView style={stylesViewGame.container}>
                //                 <View style={stylesViewGame.headerContainer}>
                //                     <Text style={stylesViewGame.buttonTitle}>Player Name: {this.state.PlayerName}</Text>
                //                 </View>
                //                 <View style={stylesViewGame.StatRow}>
                //                     <Text style={stylesViewGame.buttonTitle}>Player Kit Number: {this.state.PlayerKitNumber}</Text>
                //                     <Text style={stylesViewGame.buttonTitle}>Position: {this.state.PlayerPosition}</Text>
                //                     <Text style={stylesViewGame.buttonTitle}>Goals: {this.state.Goals}</Text>
                //                     <Text style={stylesViewGame.buttonTitle}>Points: {this.state.Points}</Text>
                //                     <Text style={stylesViewGame.buttonTitle}>Shots: {this.state.Shots}</Text>
                //                     <Text style={stylesViewGame.buttonTitle}>Shots on target: {this.state.ShotsOnTarget}</Text>
                //                 </View>

                //                 <TouchableOpacity style={stylesViewGame.button} onPress= {this.ExecutePlayerEventAnaylsis}>
                //                     <Text style={stylesViewGame.buttonTitle}>Review a specific event and location on the field</Text>
                //                 </TouchableOpacity>  

                //             </ScrollView>
                //         );
                //     }

                //     if(displaySelectedOpponentsPlayerStats == true)
                //     {
                //         PlayerStats = (
                //             <ScrollView style={stylesViewGame.container}>
                //                 <View style={stylesViewGame.headerContainer}>
                //                     <Text style={stylesViewGame.buttonTitle}>Player Name: {this.state.PlayerName}</Text>
                //                 </View>
                //                 <View style={stylesViewGame.StatRow}>
                //                     <Text style={stylesViewGame.buttonTitle}>Player Kit Number: {this.state.PlayerKitNumber}</Text>
                //                     <Text style={stylesViewGame.buttonTitle}>Position: {this.state.PlayerPosition}</Text>
                //                     <Text style={stylesViewGame.buttonTitle}>Goals: {this.state.Goals}</Text>
                //                     <Text style={stylesViewGame.buttonTitle}>Points: {this.state.Points}</Text>
                //                     <Text style={stylesViewGame.buttonTitle}>Shots: {this.state.Shots}</Text>
                //                     <Text style={stylesViewGame.buttonTitle}>Shots on target: {this.state.ShotsOnTarget}</Text>
                //                 </View>

                //                 <TouchableOpacity style={stylesViewGame.button} onPress= {this.ExecuteOpponentsPlayerEventAnaylsis}>
                //                     <Text style={stylesViewGame.buttonTitle}>Review a specific event and location on the field</Text>
                //                 </TouchableOpacity>  

                //             </ScrollView>
                //         );
                //     }


                //     if(YourTeamFieldEventsView == true)
                //     {
                        
                //             //disable all other Front in in the way
                //             FieldWithPlots = (
                            
                //                 // <View style={stylesViewGame.imagePlotContainer}>
                           
                                    
                                    
                //                 //         <Image style = {{   
                //                 //             width:wp('60%'),
                //                 //             height:hp('100%'),
                //                 //             resizeMode: 'cover'}}  source={require('./GAApitch.png')}/>
                //                 //             {this.state.EventFieldLocations.map((data) => {
                //                 //                 return (
                //                 //                 <View 
                //                 //                     style={{
                                                
                //                 //                     position: 'absolute',
                //                 //                     left: data.x + '%',
                //                 //                     top: data.y + '%',
                //                 //                     backgroundColor:'#242424',
                //                 //                     width: 10,
                //                 //                     height: 10,
                //                 //                     borderRadius: 50
                //                 //                     }}>
                //                 //                 </View> 
                                    
                //                 //                 )
                //                 //             })}        
                //                 // </View>


                //                 <View style={stylesViewGame.imagePlotContainer}>
                           
                                    
                                    
                //                 <Image style = {{   
                //                     width: wp('100%'),
                //                     height:hp('100%'),
                //                     resizeMode: 'contain'}} 
                //                     source={require('./GAApitch.png')}/>
                //                     {this.state.EventFieldLocations.map((data) => {
                //                         return (
                //                         <View 
                //                             style={{
                                        
                //                             position: 'absolute',
                //                             left: data.x + '%',
                //                             top: data.y + '%',
                //                             backgroundColor:'#242424',
                //                             width: 10,
                //                             height: 10,
                //                             borderRadius: 50
                //                             }}>
                //                         </View> 
                            
                //                         )
                //                     })}        
                //         </View>
                //         );
                //     }

                //     if(OpponentsFieldEventsView == true)
                //     {
                        
                //             //disable all other Front in in the way
                //             FieldWithPlots = (
                            
                //                 <View style={stylesViewGame.imagePlotContainer}>

                //                 <Image style = {{   
                //                     width: wp('100%'),
                //                     height:hp('100%'),
                //                     resizeMode:'contain'}} source={require('./GAApitch.png')}/>
                //                             {this.state.OpponentsEventFieldLocations.map((data) => {
                //                                 return (
                //                                 <View 
                //                                     style={{
                                                
                //                                     position: 'absolute',
                //                                     left: data.x,
                //                                     top: data.y,
                //                                     backgroundColor:'#242424',
                //                                     width: 10,
                //                                     height: 10,
                //                                     borderRadius: 50
                //                                     }}>
                //                                 </View> 
                                    
                //                                 )
                //                             })}        
                //                 </View>
                //         );
                //     }


                //         // ---------- TEAM STATS SELECTION AND FIELD PLOTTING ---------------

                // if(displayTeamSpecificEventSelection == true)
                // {
                //     ReviewPlayerStats = (
                        
                //         <ScrollView style={stylesViewGame.container}>

                //             <Text style={stylesViewGame.buttonTitle}>Select a Stat</Text>

                //             <Picker
                //                 selectedValue={this.state.YourTeamEventSelection}
                //                 style={stylesViewGame.input}
                //                 onValueChange={(text) => this.setState({YourTeamEventSelection:text})}
                //             >
                                
                //                 <Picker.Item label="Select a event" value="" />
                //                 <Picker.Item label="Goal" value="Goal" />
                //                 <Picker.Item label="Point" value="Point"/>
                //                 <Picker.Item label="Pass" value="Pass"/>
            
            
                //             </Picker>

                //             <TouchableOpacity style={stylesViewGame.button} onPress = {this.ExecuteTeamSpecificEventSelection}>
                //                 <Text style={stylesViewGame.buttonTitle}>Submit</Text>
                //             </TouchableOpacity>   

                //     </ScrollView>

                
                //     );
                            
                // }

                // if(displayOpponentsSpecificEventSelection == true)
                // {
                //     ReviewPlayerStats = (
                        
                //         <ScrollView style={stylesViewGame.container}>

                //             <Text style={stylesViewGame.buttonTitle}>Select a Stat</Text>

                //             <Picker
                //                 selectedValue={this.state.OpponentsEventSelection}
                //                 style={stylesViewGame.input}
                //                 onValueChange={(text) => this.setState({OpponentsEventSelection:text})}
                //             >
                                
                //                 <Picker.Item label="Select a event" value="" />
                //                 <Picker.Item label="Goal" value="Goal" />
                //                 <Picker.Item label="Point" value="Point"/>
                //                 <Picker.Item label="Pass" value="Pass"/>


                //             </Picker>

                //             <TouchableOpacity style={stylesViewGame.button} onPress = {this.ExecuteOpponentsSpecificEventSelection}>
                //                 <Text style={stylesViewGame.buttonTitle}>Submit</Text>
                //             </TouchableOpacity>   

                //         </ScrollView>

                //     );
                // }

                // if(YourTeamSpecificStatFieldEvents == true)
                // {
                //     FieldWithPlots = (
                    

                //         // <View style={stylesViewGame.imagePlotContainer}>
                //         //         <Image style = {{   
                //         //         width:wp('60%'),
                //         //         height:hp('100%'),
                //         //         alignItems:'center',
                //         //         resizeMode: 'contain'}}  source={require('./GAApitch.png')}/>
                //         //         {this.state.EventFieldLocations.map((data) => {
                //         //             return (
                //         //                     <View 
                //         //                         style={{
                                                    
                //         //                         position: 'absolute',
                //         //                         left: data.x,
                //         //                         top: data.y,
                //         //                         backgroundColor:'#242424',
                //         //                         width: 10,
                //         //                         height: 10,
                //         //                         borderRadius: 50
                //         //                         }}>
                //         //                     </View> 
                                    
                //         //                         )
                //         //                     })}           
                    
                                
                //         //         </View>

                //         <View style={stylesViewGame.imagePlotContainer}>
                           
                                    
                                    
                //                 <Image style = {{   
                //                     width: wp('100%'),
                //                     height:hp('100%'),
                //                     resizeMode: 'contain'}} 
                //                     source={require('./GAApitch.png')}/>
                //                     {this.state.EventFieldLocations.map((data) => {
                //                         return (
                //                         <View 
                //                             style={{
                                        
                //                             position: 'absolute',
                //                             left: data.x,
                //                             top: data.y,
                //                             backgroundColor:'#242424',
                //                             width: 10,
                //                             height: 10,
                //                             borderRadius: 50
                //                             }}>
                //                         </View> 
                             
                //                          )
                //                     })}         
                //         </View>


                //     );

                // }
                

                // if(OpponentsSpecificStatFieldEvents == true)
                // {
                //     FieldWithPlots = (
                //         <View style={stylesViewGame.imagePlotContainer}>
                //                 <Image style = {{   
                //                 width: wp('100%'),
                //                 height: hp('100%'),
                //                 resizeMode: 'contain'}} 
                //                 source={require('./GAApitch.png')}/>
                //                 {this.state.OpponentsEventFieldLocations.map((data) => {
                //                     return (
                //                     <View 
                //                         style={{
                                    
                //                         position: 'absolute',
                //                         left: data.x,
                //                         top: data.y,
                //                         backgroundColor:'#242424',
                //                         width: 10,
                //                         height: 10,
                //                         borderRadius: 50
                //                         }}>
                //                     </View> 
                        
                //                     )
                //                     })}        
                //         </View>
                //     );

                // }
            

           // }


            //-- SOCCER MODE 


            // else if(SportType == 'Soccer')
            // {

            //     if(displayReviewSelection == true)
            //     {
            //         ReviewSelection = (
            //             <ScrollView style={stylesViewGame.container}>
    
            //                 <TouchableOpacity style={stylesViewGame.button} onPress = {this.ReviewGameStats}>
            //                     <Text style={stylesViewGame.buttonTitle}>Review Games Stats</Text>
            //                 </TouchableOpacity>
                            
            //                 <TouchableOpacity style={stylesViewGame.button} onPress = {this.SelectPlayerSelection}>
            //                     <Text style={stylesViewGame.buttonTitle}>View a specific player stats</Text>
            //                 </TouchableOpacity>
                        
            //             </ScrollView>
                        
                        
            //         );
    
            //     }



            //     if(displayReviewGameStats == true)
            //     {

            //         ReviewGameStats= (

            //             <ScrollView style={stylesViewGame.container}>
            //                 <View style={stylesViewGame.headerContainer}>
            //                     <Text style={stylesViewGame.buttonTitle}>{this.state.TeamName}</Text>
            //                 </View>

            //                 <View style={stylesViewGame.StatRow}>
            //                     <Text style={stylesViewGame.buttonTitle}> Goals: {this.state.totalTeamGoals}</Text>
            //                     <Text style={stylesViewGame.buttonTitle}> Shots: {this.state.totalTeamShots}</Text>
            //                     <Text style={stylesViewGame.buttonTitle}> Shots on target: {this.state.totalTeamShotsOnTarget}</Text>
            //                 </View>

            //                 <TouchableOpacity style={stylesViewGame.button} onPress = {this.TeamSpecificStat}>
            //                     <Text style={stylesViewGame.buttonTitle}>Review a specific stat from {this.state.TeamName} </Text>
            //                 </TouchableOpacity>


            //                 <View style={stylesViewGame.headerContainer}>
            //                     <Text style={stylesViewGame.buttonTitle}> Opponents</Text>
            //                 </View>

            //                 <View style={stylesViewGame.StatRow}>
            //                     <Text style={stylesViewGame.buttonTitle}> Goals: {this.state.totalOpponentsTeamGoals}</Text>
            //                     <Text style={stylesViewGame.buttonTitle}> Shots: {this.state.totalOpponentsTeamShots}</Text>
            //                     <Text style={stylesViewGame.buttonTitle}> Shots on target: {this.state.totalOpponentsTeamShotsOnTarget}</Text>
            //                 </View>

            //                 <TouchableOpacity style={stylesViewGame.button} onPress = {this.OpponentsSpecificStat}>
            //                     <Text style={stylesViewGame.buttonTitle}>Review a specific stat from the Opponents records</Text>
            //                 </TouchableOpacity>


            //             </ScrollView>
            //         );

            //     }


            //     if(SelectAnEvent_ReviewGameStats_YourTeam)
            //     {

            //         ReviewPlayerStats = (
                        
            //             <ScrollView style={stylesViewGame.container}>
    
            //                     <Text style={stylesViewGame.buttonTitle}>Select a stat</Text>
    
            //                     <Picker
            //                         selectedValue={this.state.YourTeamEventSelection}
            //                         style={stylesViewGame.input}
            //                         onValueChange={(text) => this.setState({YourTeamEventSelection:text})}
            //                     >
                                    
            //                         <Picker.Item label="Select a event" value="" />
            //                         <Picker.Item label="Goal" value="Goal" />
            //                         <Picker.Item label="Pass" value="Pass"/>
                
                
            //                     </Picker>
    
            //                     <TouchableOpacity style={stylesViewGame.button} onPress = {this.ExecuteYourTeamEventAnaylsis}>
            //                         <Text style={stylesViewGame.buttonTitle}>Review this players games stats</Text>
            //                     </TouchableOpacity>   
    
            //             </ScrollView>
            //          );
            //     }

            //     if(SelectAnEvent_ReviewGameStats_Opponents)
            //     {
                    
            //         ReviewPlayerStats = (

            //             <ScrollView style={stylesViewGame.container}>
        
            //                 <Text style={stylesViewGame.buttonTitle}>Select a stat</Text>
        
            //                     <Picker
            //                         selectedValue={this.state.OpponentsEventSelection}
            //                         style={stylesViewGame.input}
            //                         onValueChange={(text) => this.setState({OpponentsEventSelection:text})}
            //                     >
                                                
            //                         <Picker.Item label="Select a event" value="" />
            //                         <Picker.Item label="Goal" value="Goal" />
            //                         <Picker.Item label="Pass" value="Pass"/>
                            
                            
            //                         </Picker>
        
            //                         <TouchableOpacity style={stylesViewGame.button} onPress = {this.ExecuteOpponentsPlayerEventAnaylsis}>
            //                             <Text style={stylesViewGame.buttonTitle}>Submit</Text>
            //                         </TouchableOpacity>   
        
            //             </ScrollView>
            //         );
            //     }


            //     if(YourTeamSpecificStatFieldEvents == true)
            //     {


            //        //Condition to check if the Device is smaller than the image so for mobile view we check the StatsStoredUsingScreenWidth  
            //             //if screenwidth < StatsStoredUsingScreenWidth || screenHeight < StatsStoredUsingScreenHeight
            //                 //Then alert the user that this maybe be inaccurate . please try a larger device screen size e.g web version
            //                     //ScrollView possibly for mobile

            //         if(screenWidth != this.state.StatsStoredUsingScreenWidth && screenHeight != this.state.StatsStoredUsingScreenHeight)
            //         {
                        
            //                 if(screenWidth < 359 || screenHeight < 240)
            //                 {
            //                     alert('Warning - This device is too small to display the full image. Please scroll across the image to navigate or use a larger device screen size.');

            //                     FieldWithPlots = (

            //                         <ScrollView horizontal={true} style={stylesViewGame.imagePlotContainer}>
            //                             <ScrollView>
                                            
            //                                 <Image style ={{width: this.state.StatsStoredUsingScreenWidth, height: this.state.StatsStoredUsingScreenHeight}}                              
            //                                      source={require('./SoccerField.png')}/>
            //                                     {this.state.EventFieldLocations.map((data) => {
            //                                         return (
            //                                         <View 
            //                                             style={{
            //                                             position: 'absolute',
            //                                             left: data.x,
            //                                             top: data.y,
            //                                             backgroundColor:'#242424',
            //                                             width: 10,
            //                                             height: 10,
            //                                             borderRadius: 50
            //                                             }}>
            //                                         </View> 
                                            
            //                                     )
            //                                 })} 
                
            //                             </ScrollView>

            //                         </ScrollView>
            
        
        
            //                     );



            //                 }
            //                 else
            //                 {

            //                     FieldWithPlots = (

            //                         <View style={stylesViewGame.imagePlotContainer}>
                                            
            //                             <Image style ={{width: this.state.StatsStoredUsingScreenWidth, height: this.state.StatsStoredUsingScreenHeight}}                              
            //                                  source={require('./SoccerField.png')}/>
            //                                 {this.state.EventFieldLocations.map((data) => {
            //                                     return (
            //                                     <View 
            //                                         style={{
            //                                         position: 'absolute',
            //                                         left: data.x,
            //                                         top: data.y,
            //                                         backgroundColor:'#242424',
            //                                         width: 10,
            //                                         height: 10,
            //                                         borderRadius: 50
            //                                         }}>
            //                                     </View> 
                                        
            //                                 )
            //                             })} 
            
            //                         </View>
            
        
        
            //                     );
            //                 }


        


            //         }   

            //         else
            //         {
 
            //             FieldWithPlots = (

               
            //               <View style={stylesViewGame.imagePlotContainer}>
                                           
            //                         <Image style ={stylesViewGame.imageSoccer}                              
            //                             source={require('./SoccerField.png')}/>
            //                             {this.state.EventFieldLocations.map((data) => {
            //                                 return (
            //                                 <View 
            //                                      style={{
            //                                       position: 'absolute',
            //                                       left: data.x,
            //                                       top: data.y,
            //                                       backgroundColor:'#242424',
            //                                       width: 10,
            //                                       height: 10,
            //                                       borderRadius: 50
            //                                     }}>
            //                                 </View> 
                                    
            //                             )
            //                         })} 
        
            //                   </View>
        
            //             );
            //         }



            //     }

            //     if(OpponentsSpecificStatFieldEvents == true)
            //     {

                    
            //        //Condition to check if the Device is smaller than the image so for mobile view we check the StatsStoredUsingScreenWidth  
            //             //if screenwidth < StatsStoredUsingScreenWidth || screenHeight < StatsStoredUsingScreenHeight
            //                 //Then alert the user that this maybe be inaccurate . please try a larger device screen size e.g web version
            //                     //ScrollView possibly for mobile


            //         if(screenWidth != this.state.StatsStoredUsingScreenWidth && screenHeight != this.state.StatsStoredUsingScreenHeight)
            //         {

            //             if(screenWidth < 359 || screenHeight < 240)
            //             {
            //                 alert('Warning - This device is too small to display the full image. Please scroll across the image to navigate or use a larger device screen size.');

                    
            //                 FieldWithPlots = (
            //                     <ScrollView horizontal={true} style={stylesViewGame.imagePlotContainer}>
            //                             <ScrollView>
                                        
            //                                 <Image style ={{width: this.state.StatsStoredUsingScreenWidth, height: this.state.StatsStoredUsingScreenHeight}}                              
            //                                     source={require('./SoccerField.png')}/>
            //                                     {this.state.OpponentsEventFieldLocations.map((data) => {
            //                                         return (
            //                                         <View 
            //                                             style={{
                                                    
            //                                             position: 'absolute',
            //                                             left: data.x,
            //                                             top: data.y,
            //                                             backgroundColor:'#242424',
            //                                             width: 10,
            //                                             height: 10,
            //                                             borderRadius: 50
            //                                             }}>
            //                                         </View> 
                                        
            //                                         )
            //                                         })}        
            //                             </ScrollView>

            //                     </ScrollView>
            //                 );

            //             }
            //             else
            //             {
            //                 FieldWithPlots = (

            //                     <View style={stylesViewGame.imagePlotContainer}>
                                        
            //                         <Image style ={{width: this.state.StatsStoredUsingScreenWidth, height: this.state.StatsStoredUsingScreenHeight}}                              
            //                              source={require('./SoccerField.png')}/>
            //                             {this.state.OpponentsEventFieldLocations.map((data) => {
            //                                 return (
            //                                 <View 
            //                                     style={{
            //                                     position: 'absolute',
            //                                     left: data.x,
            //                                     top: data.y,
            //                                     backgroundColor:'#242424',
            //                                     width: 10,
            //                                     height: 10,
            //                                     borderRadius: 50
            //                                     }}>
            //                                 </View> 
                                    
            //                             )
            //                         })} 
        
            //                     </View>
    
            //                 );
            //             }

                

            //         }
            //         else
            //         {
 
            //             FieldWithPlots = (

               
            //               <View style={stylesViewGame.imagePlotContainer}>
                                           
            //                         <Image style ={stylesViewGame.imageSoccer}                              
            //                              source={require('./SoccerField.png')}/>
            //                             {this.state.OpponentsEventFieldLocations.map((data) => {
            //                                 return (
            //                                 <View 
            //                                      style={{
            //                                       position: 'absolute',
            //                                       left: data.x,
            //                                       top: data.y,
            //                                       backgroundColor:'#242424',
            //                                       width: 10,
            //                                       height: 10,
            //                                       borderRadius: 50
            //                                     }}>
            //                                 </View> 
                                    
            //                             )
            //                         })} 
        
            //                   </View>
        
            //             );
            //         }



            //     }


               
            

























            //     if(displayReviewSelection == true)
            //     {
            //         ReviewSelection = (
            //             <ScrollView style={stylesViewGame.container}>
    
            //                 <TouchableOpacity style={stylesViewGame.button} onPress = {this.ReviewGameStats}>
            //                     <Text style={stylesViewGame.buttonTitle}>Review Games Stats</Text>
            //                 </TouchableOpacity>
                            
            //                 <TouchableOpacity style={stylesViewGame.button} onPress = {this.SelectPlayerSelection}>
            //                     <Text style={stylesViewGame.buttonTitle}>View a specific player stats</Text>
            //                 </TouchableOpacity>
                        
            //             </ScrollView>
                        
                        
            //         );
    
            //     }


            //     if(displayEventSelection == true)
            //     {
                 
            //             ReviewPlayerStats = (
                        
            //                 <ScrollView style={stylesViewGame.container}>
    
            //                     <Text style={stylesViewGame.buttonTitle}>Select a Stat</Text>
    
            //                     <Picker
            //                         selectedValue={this.state.YourTeamEventSelection}
            //                         style={stylesViewGame.input}
            //                         onValueChange={(text) => this.setState({YourTeamEventSelection:text})}
            //                     >
                                    
            //                         <Picker.Item label="Select a event" value="" />
            //                         <Picker.Item label="Goal" value="Goal" />
            //                         <Picker.Item label="Shots" value="Shot"/>
            //                         <Picker.Item label="Pass" value="Pass"/>
                
                
            //                     </Picker>
    
            //                     <TouchableOpacity style={stylesViewGame.button} onPress = {this.ExecutePlayerEventAnaylsis}>
            //                         <Text style={stylesViewGame.buttonTitle}>Review this players games stats</Text>
            //                     </TouchableOpacity>   
    
            //                 </ScrollView>
            //             );
                    
                   
            //     }

            //     if(displayOpponentsEventSelection == true)
            //     {

            //             ReviewPlayerStats = (

            //                 <ScrollView style={stylesViewGame.container}>

            //                     <Text style={stylesViewGame.buttonTitle}>Select a Stat</Text>

            //                     <Picker
            //                         selectedValue={this.state.OpponentsEventSelection}
            //                         style={stylesViewGame.input}
            //                         onValueChange={(text) => this.setState({OpponentsEventSelection:text})}
            //                     >
                                    
            //                         <Picker.Item label="Select a event" value="" />
            //                         <Picker.Item label="Goal" value="Goal" />
            //                         <Picker.Item label="Pass" value="Pass"/>
                
                
            //                     </Picker>

            //                     <TouchableOpacity style={stylesViewGame.button} onPress = {this.ExecuteOpponentsPlayerEventAnaylsis}>
            //                         <Text style={stylesViewGame.buttonTitle}>Submit</Text>
            //                     </TouchableOpacity>   

            //                 </ScrollView>
            //             );
            //         }
            





            //     if(displayReviewGameStats == true)
            //     {

            //         ReviewGameStats= (
            //             <ScrollView style={stylesViewGame.container}>
            //                 <View style={stylesViewGame.headerContainer}>
            //                     <Text style={stylesViewGame.buttonTitle}>{this.state.TeamName}</Text>
            //                 </View>

            //                 <View style={stylesViewGame.StatRow}>
            //                     <Text style={stylesViewGame.buttonTitle}> Goals: {this.state.totalTeamGoals}</Text>
                            
            //                     <Text style={stylesViewGame.buttonTitle}> Shots: {this.state.totalTeamShots}</Text>
            //                     <Text style={stylesViewGame.buttonTitle}> Shots on target: {this.state.totalTeamShotsOnTarget}</Text>
            //                 </View>

            //                 <View style={stylesViewGame.headerContainer}>
            //                     <Text style={stylesViewGame.buttonTitle}> Opponents</Text>
            //                 </View>

            //                 <View style={stylesViewGame.StatRow}>
            //                     <Text style={stylesViewGame.buttonTitle}> Goals: {this.state.totalOpponentsTeamGoals}</Text>
            //                     <Text style={stylesViewGame.buttonTitle}> Shots: {this.state.totalOpponentsTeamShots}</Text>
            //                     <Text style={stylesViewGame.buttonTitle}> Shots on target: {this.state.totalOpponentsTeamShotsOnTarget}</Text>

            //                 </View>


            //             </ScrollView>
            //         );

            //     }


            //     if(displayTeamOption == true)
            //     {
                
            //         TeamOption = (
            //             <ScrollView style={stylesViewGame.container}>
                            
            //                 <Text style={stylesViewGame.buttonTitle}>Select which team players you want to review</Text>

            //                 <TouchableOpacity style={stylesViewGame.button} onPress = {this.YourTeamSelected}>
            //                     <Text style={stylesViewGame.buttonTitle}>{this.state.TeamName}</Text>
            //                 </TouchableOpacity>
                            
            //                 <TouchableOpacity style={stylesViewGame.button} onPress = {this.OpponentsSelected}>
            //                     <Text style={stylesViewGame.buttonTitle}>Opponents</Text>
            //                 </TouchableOpacity>

            //             </ScrollView>
            //         );
                    
                    
            //     }
            //     if(displayReviewYourTeamPlayer == true)
            //     {

            //          PlayerStats = (

            //             <ScrollView style={stylesViewGame.container}>

            //                 <Text style={stylesViewGame.buttonTitle}> Select a player</Text>

            //                 <Picker
            //                     selectedValue={this.state.selectedTeamPlayer}
            //                     style={stylesViewGame.input}
            //                     onValueChange={(text) => this.setState({selectedTeamPlayer:text})}
            //                 >

            //                 <Picker.Item label="Select a Player" value="" />
            //                 {this.state.PlayerData.map((item, index) => {
            //                     return (

            //                             <Picker.Item label={item.PlayerName} value={item.PlayerID}/>
                                     
            //                             )

            //                 })} 

            //                 </Picker> 

            //                 <TouchableOpacity style={stylesViewGame.button} onPress = {this.ReviewPlayerStats}>
            //                     <Text style={stylesViewGame.buttonTitle}>Review this players games stats</Text>
            //                 </TouchableOpacity>   

            //             </ScrollView>

            //         );
            //     }

            //     if(displayReviewOpponentsPlayer == true)
            //     {

            //          ReviewPlayerStats = (

            //             <ScrollView style={stylesViewGame.container}>

            //                 <Text style={stylesViewGame.buttonTitle}> Select an Opponents player</Text>

            //                 <Picker
            //                     selectedValue={this.state.selectedOpponentsPlayer}
            //                     style={stylesViewGame.input}
            //                     onValueChange={(text) => this.setState({selectedOpponentsPlayer:text})}
            //                 >

            //                 <Picker.Item label="Select a Player" value="" />
            //                 {this.state.OpponentsPlayerData.map((item, index) => {
            //                     return (

            //                             <Picker.Item label={item.PlayerName} value={item.PlayerID}/>

            //                             )

            //                 })}

            //                 </Picker> 

            //                 <TouchableOpacity style={stylesViewGame.button} onPress = {this.ReviewOpponentsPlayerStats}>
            //                     <Text style={stylesViewGame.buttonTitle}>Review this players games stats</Text>
            //                 </TouchableOpacity>   

            //             </ScrollView>

            //         );
            //     }


            //     if(displayOpponentsSelectedPlayerStats == true)
            //     {
            //         ReviewPlayerStats = (
        
                        
            //             <ScrollView style={stylesViewGame.container}>
            //                 <View style={stylesViewGame.headerContainer}>
            //                     <Text style={stylesViewGame.buttonTitle}>Player Name: {this.state.PlayerName}</Text>
            //                 </View>
            //                 <View style={stylesViewGame.StatRow}>
            //                     <Text style={stylesViewGame.buttonTitle}>Player Kit Number: {this.state.PlayerKitNumber}</Text>
            //                     <Text style={stylesViewGame.buttonTitle}>Position: {this.state.PlayerPosition}</Text>
            //                     <Text style={stylesViewGame.buttonTitle}>Goals: {this.state.Goals}</Text>
            //                     <Text style={stylesViewGame.buttonTitle}>Shots: {this.state.Shots}</Text>
            //                     <Text style={stylesViewGame.buttonTitle}>Shots on target: {this.state.ShotsOnTarget}</Text>
            //                 </View>

            //                 <TouchableOpacity style={stylesViewGame.button} onPress = {this.ReviewOpponentsPlayerStats}>
            //                     <Text style={stylesViewGame.buttonTitle}>Review a specifc event and location on the field</Text>
            //                 </TouchableOpacity>  



            //            </ScrollView>
            //         );
            //     }


            //     if(YourTeamFieldEventsView == true)
            //     {
                    
            //                //disable all other Front in in the way
            //                FieldWithPlots = (
                         
            //                 <View style={stylesViewGame.imagePlotContainer}>

                            


            //                                 <Image style = {{   
            //                                 width:wp('100%'),
            //                                 height:hp('100%'),
            //                                 resizeMode: 'contain'}} source={require('./SoccerField.png')}/>
            //                                 {this.state.EventFieldLocations.map((data) => {
            //                                     return (
                    
            //                                     <View 
            //                                         style={{
                                                
            //                                         position: 'relative',
            //                                         left: data.x,
            //                                         top: data.y,
            //                                         backgroundColor:'#242424',
            //                                         width: 10,
            //                                         height: 10,
            //                                         borderRadius: 50
            //                                         }}>
            //                                     </View> 
                                    
            //                                     )
            //                                 })}      

            //                 </View>  
                      
            //            );
            //     }

            //     if(OpponentsFieldEventsView == true)
            //     {
                    
            //                //disable all other Front in in the way
            //                FieldWithPlots = (
                         
            //                 <View style={stylesViewGame.imagePlotContainer}>
                  

                                   
            //       <Image style = {{   
            //                 width:wp('60%'),
            //                 height:hp('100%'),
            //                 alignItems:'center',
            //                 resizeMode: 'contain'}} source={require('./SoccerField.png')}/>  
            //                             {this.state.OpponentsEventFieldLocations.map((data) => {
            //                                 return (
            //                                 <View 
            //                                     style={{
                                            
            //                                     position: 'absolute',
            //                                     left: data.x,
            //                                     top: data.y,
            //                                     backgroundColor:'#242424',
            //                                     width: 10,
            //                                     height: 10,
            //                                     borderRadius: 50
            //                                     }}>
            //                                 </View> 
                                
            //                                 )
            //                             })}        
            //                 </View>
            //            );
            //     }

            // }


            //  // ---------- TEAM STATS SELECTION AND FIELD PLOTTING ---------------

            // if(YourTeamSpecificStatFieldEventsSoccerView == true)
            // {
            //     ReviewPlayerStats = (
                    
            //         <ScrollView style={stylesViewGame.container}>

            //             <Text style={stylesViewGame.buttonTitle}>Select a stat</Text>

            //             <Picker
            //                 selectedValue={this.state.YourTeamEventSelection}
            //                 style={stylesViewGame.input}
            //                 onValueChange={(text) => this.setState({YourTeamEventSelection:text})}
            //             >
                            
            //                 <Picker.Item label="Select a event" value="" />
            //                 <Picker.Item label="Goal" value="Goal" />
            //                 <Picker.Item label="Pass" value="Pass"/>
        
        
            //             </Picker>

            //             <TouchableOpacity style={stylesViewGame.button} onPress = {this.ExecuteTeamSpecificEventSelection}>
            //                 <Text style={stylesViewGame.buttonTitle}>Submit</Text>
            //             </TouchableOpacity>   

            //     </ScrollView>

            
            //     );
                         
            // }

            // if(displayOpponentsSpecificEventSelection == true)
            // {
            //     ReviewPlayerStats = (
                    
            //         <ScrollView style={stylesViewGame.container}>

            //             <Text style={stylesViewGame.buttonTitle}>Select a stat</Text>

            //             <Picker
            //                 selectedValue={this.state.OpponentsEventSelection}
            //                 style={stylesViewGame.input}
            //                 onValueChange={(text) => this.setState({OpponentsEventSelection:text})}
            //             >
                            
            //                 <Picker.Item label="Select a event" value="" />
            //                 <Picker.Item label="Goal" value="Goal" />
            //                 <Picker.Item label="Pass" value="Pass"/>


            //             </Picker>

            //             <TouchableOpacity style={stylesViewGame.button} onPress = {this.ExecuteOpponentsSpecificEventSelection}>
            //                 <Text style={stylesViewGame.buttonTitle}>Submit</Text>
            //             </TouchableOpacity>   

            //         </ScrollView>

            //     );
            // }

            // if(YourTeamSpecificStatFieldEventsSoccerView == true)
            // {
            //     FieldWithPlots = (
            //         <View style={stylesViewGame.imagePlotContainer}>
                      
            //              <Image style = {{   
            //                 width:wp('60%'),
            //                 height:hp('100%'),
            //                 alignItems:'center',
            //                 resizeMode: 'contain'}} source={require('./SoccerField.png')}/>  
            //             {this.state.EventFieldLocations.map((data) => {
            //                     return (
            //                             <View 
            //                                 style={{
                                                
            //                                 position: 'absolute',
            //                                 left: data.x,
            //                                 top: data.y,
            //                                 backgroundColor:'#242424',
            //                                 width: 10,
            //                                 height: 10,
            //                                 borderRadius: 50
            //                                 }}>
            //                             </View> 
                                
            //                                 )
            //                             })}        
            //         </View>
            //     );

            // }
            

            // if(OpponentsSpecificStatFieldEventsSoccerView == true)
            // {
            //     FieldWithPlots = (
            //         <View style={stylesViewGame.imagePlotContainer}>
            //             <Image style = {{   
            //                 width:wp('60%'),
            //                 height:hp('100%'),
            //                 alignItems:'center',
            //                 resizeMode: 'contain'}} source={require('./SoccerField.png')}/>  
            //                 {this.state.OpponentsEventFieldLocations.map((data) => {
            //                     return (
            //                     <View 
            //                         style={{
                                
            //                         position: 'absolute',
            //                         left: data.x,
            //                         top: data.y,
            //                         backgroundColor:'#242424',
            //                         width: 10,
            //                         height: 10,
            //                         borderRadius: 50
            //                         }}>
            //                     </View> 
                    
            //                     )
            //                     })}        
            //          </View>
            //     );

            // }
            


            return (
 
                <View style={{flex: 1, backgroundColor: '#252626'}}>
                      

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
                     
                     
                      
                </View>


            )

        }
}


const stylesViewGame= StyleSheet.create({
    container: {
        backgroundColor: '#242424', 
        // alignItems: 'center',
    },
    Text: {
        color:'#ffffff',
        fontSize: 20
        
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
    StatRow: {
        flex:1,
        // flexDirection:"row",
        alignItems: "center",
        marginBottom:10,
        borderWidth: 4,
        borderColor:'#ffffff',
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
    button: {
        backgroundColor: '#FF6D01',
        marginLeft: 30,
        marginRight: 30,
        marginTop: 20,
        height: 48,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: 'center'
    },
    buttonTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: "bold"
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
      //Working 
         //Working 
         height:280,
         width: 480,
},
   
  

    imagePlotContainer: {

        
  
        //  flexWrap: 'wrap',
        // // flexDirection:"row",
        // position: 'relative',

        
    
        
    
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