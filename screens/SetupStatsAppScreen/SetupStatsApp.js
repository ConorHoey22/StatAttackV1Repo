import React, { useEffect, useState, Component } from 'react'
import { Image, Text, StatusBar, TextInput,  FlatList, TouchableOpacity, View ,Button ,ScrollView, Alert , StyleSheet, SegmentedControlIOSComponent} from 'react-native'
// import styles from './styles';

import firebase from 'firebase/app'
import 'firebase/auth';
import 'firebase/database';


import { useNavigation } from '@react-navigation/native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import { Picker } from "@react-native-picker/picker";



export default class SetupStatsApp extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            fullName: '',
            UserID:'',
            Verified:'',
            inviteCode:'',
            key:'',
            selectedS11Removal:'',
            AvailablePlayersList: [],
            Starting11List:[],
            addBackTeamsheetArray: [],
            SportType: '', 
            playercounter:0,
            Goals: 0,
            Points: 0,
            Passes:0,
            Shots:0,
            ShotsOnTarget:0,


            gameCounter:0,
            teamGameLimit:0,

            EnterOpponentName:false,
            OpenSelectedStarting11SubBenchSubBench:false,
            OpenAddTeamsheet:false,
            OpenAddSubBench:false,

            OpenAddOpponentTeamsheet:false,


            OpenSelectedOpponentStarting11SubBench:false,


            OpenValidationPlayer:false,
            OpenValidationPosition:false,
            OpenValidationKitNumber:false,

            GameDaySelected: false,
            TrainingSelected: false,

            SetUpMenu:false,

            ViewTeamSheet:false,
            ViewOpponentsTeamsheet:false,

            SelectedStartingTeam: [],
            SelectedSubBench: [], 
            kitNumbersTaken:[],

            SelectedOpponentsStartingTeam:[],
            SelectedOpponentsSubBench:[],
            OpponentKitNumbersTaken:[],

            TeamSheetList: [],
            SubBenchList:[],
       
           
            // selectedPlayer:'',
            selectedPlayer: null,
            selectedPlayerPosition:'',
            selectedPlayerKitNumber:'',

            OpponentsName:'',
            GameDescription: '',

           
            selectedStarting11ToSubPlayer:'',
            selectedStarting11ToPlayerPosition: '',
            selectedStarting11ToKitNumber:'',

            selectedAvailablePlayer: '',
            selectedAvailablePlayerPosition: '',
            selectedAvailablePlayerKitNumber: '',

            selectedSubPlayer:'',
            selectedSubPlayerPosition: '',
            selectedSubPlayerKitNumber: '',

            invalidKitNumber:false,
            teamsheetCounter:0,
            OpponentsTeamsheetCounter:0,

            UserRecordsSelected:[],
      
            invalidPlayerSelection: false,

            
         };


      }


      componentDidMount(){
        this.playerList();
        this.getTeamDetails();


          //Array with all Starting player + Sub bench selected
          var array1 = this.state.SelectedStartingTeam;
          var array2 = this.state.SelectedOpponentsStartingTeam;

        


 
      }


      playerList = () => {

    
        var myUserId = firebase.auth().currentUser.uid;
        var tempArr = [];


        firebase.database().ref('/teams').child(myUserId).child('/players').orderByChild('AvailableStatus').equalTo(1)
            .on('value', snapshot => {
              
                tempArr = this.snapshotToArray(snapshot);
                this.setState({
                    AvailablePlayersList: tempArr
                });

            });

         

    
            firebase.database().ref('/teams').child(myUserId).child('/players').orderByChild('starting11Status').equalTo(1)
            .on('value', snapshot => {
              
                tempArr = this.snapshotToArray(snapshot);
                this.setState({
                    Starting11List: tempArr
                });

            });

    
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

        GoToMainMenu = async() => {
            this.props.navigation.navigate('Home');
        }

        ProceedToSetUpMenu = async() => {

           var OpponentsName = this.state.OpponentsName;


            //Check Opponents Name - Validation 
           if(OpponentsName == "")
           {
                return alert("Please enter the Opponents name");
           }
           else{


         
            this.setState({EnterOpponentName:false});

            this.setState({SetUpMenu:true});

            
            
           }
        

        }

        getTeamDetails = async() => {

            var myUserId = firebase.auth().currentUser.uid;
            firebase.database().ref('/teams').child(myUserId)
            .on('value', snapshot => {

                const userObj = snapshot.val();

                let SportType = userObj.SportType;
                this.setState({SportType:SportType})
                    
                //Get the users Player limit - This is set by a Super User / System Admin(me)
                let playercounter = userObj.playercounter;
                this.setState({playercounter:playercounter})

                let gameLimit = userObj.gamecounter;
                this.setState({gameCounter:gameLimit})
                    
                 
                
            });

            //Get the users current games counter
            firebase.database().ref('/users').child(myUserId)
            .once('value' , snapshot =>  {
            
                const userObj = snapshot.val();

                //Get the users Game limit - This is set by a Super User / System Admin(me)
                let GameLimit = userObj.teamgamelimit;
                this.setState({teamGameLimit:GameLimit});
            });



        }

        SubmitGAATeamSheet = async() => {
            var OpponentsName = this.state.OpponentsName;
            var GameDescription = this.state.GameDescription;
            var Timestamp = this.state.Timestamp;


           //Check Opponents Name - Validation 
           if(OpponentsName == "")
           {
              return alert("Please enter the Opponents name");
           }
           else{



                //Array with all Starting player + Sub bench selected
                var array1 = this.state.SelectedStartingTeam;
                var array2 = this.state.SelectedOpponentsStartingTeam;

                var teamsheetCounter = this.state.teamsheetCounter;
                var OpponentsTeamsheetCounter = this.state.OpponentsTeamsheetCounter;

                for (var i = 0; i < array1.length; i++) {
                        teamsheetCounter++;

                }

                for (var i = 0; i < array2.length; i++) {
                    OpponentsTeamsheetCounter++;

                }



                if(teamsheetCounter <1)
                {
                    return alert("You must select at least 15 players before you can proceed")
                }
                else if(OpponentsTeamsheetCounter <1)
                {
                    return alert("You must select at least 15 players on the opponents teamsheet before you can proceed")
                }
                else
                {


                    var myUserId = firebase.auth().currentUser.uid;
           
                    // Create Game Record ("Your Team")
                    const teamplayersref = firebase.database().ref('/teams').child(myUserId).child('/games').push();
                    
                    const addgame = teamplayersref.child('/YourTeam').child('/players');
                   
             

                    //Create Game Record ("Opponents Team")
                    const opponentsPlayersref = teamplayersref.child('/Opponents').child('/players');



           
                    
                
                        // can we obtain the key of this push and store / send it to the StatsApp page
                        //WILL THIS WORK IF THE USER IS OFFLine?
                        const recordkey = teamplayersref.key;
                        const opponentsrecordKey = opponentsPlayersref.key;
        

                    //Loop around each item in the array and push that item to Firebase and the relevant game record
                    for (var i = 0; i < array1.length; i++) {

                        const playerData = {
        
                            PlayerID:   array1[i].UserID,
                            PlayerName: array1[i].fullName,
                            PlayerPosition: array1[i].playerPosition,
                            PlayerKitNumber: array1[i].playerKitNumber,
                            Status: array1[i].status,

                            //PlayerStats
                            Goals:0,
                            Passes:0,
                            Shots:0,
                            ShotsOnTarget:0,
                            Passes:0

                        }
                    
                        // teamplayersref.push(playerData);
                        addgame.push(playerData);
                   
                    }

                    //Loop around each item in the array and push that item to Firebase and the relevant game record
                    for (var i = 0; i < array2.length; i++) {

                        const playerData = {

                            OpponentsName: this.state.OpponentsName,
                            PlayerID:   array2[i].UserID,
                            PlayerName: array2[i].fullName,
                            PlayerPosition: array2[i].playerPosition,
                            PlayerKitNumber: array2[i].playerKitNumber,
                            Status: array2[i].status,

                            //PlayerStats
                            Goals:0,
                            Points:0,
                            Shots:0,
                            ShotsOnTarget:0,
                            Passes:0

                        }
                    
                        opponentsPlayersref.push(playerData);

                   
                    }

                    //Get User 
                    const usersRef = firebase.database().ref('/users')
                    usersRef.child(myUserId)



                 

                  
                    // Navigate to Stats App and send across game ID/key
                    this.props.navigation.navigate('StatsApp', {
                        data: this.state.SelectedStartingTeam,
                        opponentsData: this.state.SelectedOpponentsStartingTeam,
                        key: recordkey,
                        opponentsKey: opponentsrecordKey,
                        OpponentsName: this.state.OpponentsName,
                    });


                }

            }

        }

        SubmitSoccerTeamSheet = async() => {
            var OpponentsName = this.state.OpponentsName;
            var GameDescription = this.state.GameDescription;
            var Timestamp = this.state.Timestamp;


           //Check Opponents Name - Validation 
           if(OpponentsName == "")
           {
              return alert("Please enter the Opponents name");
           }
           else{



                //Array with all Starting player + Sub bench selected
                var array1 = this.state.SelectedStartingTeam;
                var array2 = this.state.SelectedOpponentsStartingTeam;

                var teamsheetCounter = this.state.teamsheetCounter;
                var OpponentsTeamsheetCounter = this.state.OpponentsTeamsheetCounter;

                for (var i = 0; i < array1.length; i++) {
                        teamsheetCounter++;

                }

                for (var i = 0; i < array2.length; i++) {
                    OpponentsTeamsheetCounter++;

                }



                if(teamsheetCounter <1)
                {
                    return alert("You must select at least 15 players before you can proceed")
                }
                else if(OpponentsTeamsheetCounter <1)
                {
                    return alert("You must select at least 15 players on the opponents teamsheet before you can proceed")
                }
                else
                {


                    var myUserId = firebase.auth().currentUser.uid;
           
                    // Create Game Record ("Your Team")
                    const teamplayersref = firebase.database().ref('/teams').child(myUserId).child('/games').push();
                    
                    const addgame = teamplayersref.child('/YourTeam').child('/players');
                   
             

                    //Create Game Record ("Opponents Team")
                    const opponentsPlayersref = teamplayersref.child('/Opponents').child('/players');



           
                    
                
                        // can we obtain the key of this push and store / send it to the StatsApp page
                        //WILL THIS WORK IF THE USER IS OFFLine?
                        const recordkey = teamplayersref.key;
                        const opponentsrecordKey = opponentsPlayersref.key;
        

                    //Loop around each item in the array and push that item to Firebase and the relevant game record
                    for (var i = 0; i < array1.length; i++) {

                        const playerData = {
        
                            PlayerID:   array1[i].UserID,
                            PlayerName: array1[i].fullName,
                            PlayerPosition: array1[i].playerPosition,
                            PlayerKitNumber: array1[i].playerKitNumber,
                            Status: array1[i].status,

                            //PlayerStats
                            Goals:0,
                            Passes:0,
                            Shots:0,
                            ShotsOnTarget:0,
                            Passes:0

                        }
                    
                        // teamplayersref.push(playerData);
                        addgame.push(playerData);
                   
                    }

                    //Loop around each item in the array and push that item to Firebase and the relevant game record
                    for (var i = 0; i < array2.length; i++) {

                        const playerData = {

                            OpponentsName: this.state.OpponentsName,
                            PlayerID:   array2[i].UserID,
                            PlayerName: array2[i].fullName,
                            PlayerPosition: array2[i].playerPosition,
                            PlayerKitNumber: array2[i].playerKitNumber,
                            Status: array2[i].status,

                            //PlayerStats
                            Goals:0,
                            Points:0,
                            Shots:0,
                            ShotsOnTarget:0,
                            Passes:0

                        }
                    
                        opponentsPlayersref.push(playerData);

                   
                    }

            

                    //Update game counter for the team record 
                    firebase.database().ref('/teams').child(myUserId)
                    .child('games').child('gamecounter')
                    .set(firebase.database.ServerValue.increment(1))

                
                  
                    // Navigate to Stats App and send across game ID/key
                    this.props.navigation.navigate('StatsApp', {
                        data: this.state.SelectedStartingTeam,
                        opponentsData: this.state.SelectedOpponentsStartingTeam,
                        key: recordkey,
                        opponentsKey: opponentsrecordKey,
                        OpponentsName: this.state.OpponentsName,
                        
                    });


                }

            }
        }

    



        AddToOpponentStartingTeam = async( itemKey ) => {
           
         
        var SelectedPlayerData = this.state.selectedPlayer;
        var SelectedPlayerPositionData = this.state.selectedPlayerPosition;
        var SelectedPlayerKitNumberData = this.state.selectedPlayerKitNumber;
        var SelectedOpponentsName = this.state.OpponentsName;

        var SportType = this.state.SportType;

        // //Selected Player Validation
        if(SelectedPlayerData == "")
        {
            return alert("Please select a valid player");
        }
        else
        {

            //Valid Selected Player , We will now check the position

            //Selected Player Position Validation
            if(SelectedPlayerPositionData == "")
            {
                return alert("Please select a valid position");
            }
            else
            {
                //Valid Selected Player & Position , We will now check the kit number

                    if(SelectedPlayerKitNumberData == "")
                    {
                        return alert("Please enter a kit number");
                    }
                    else if(isNaN(SelectedPlayerKitNumberData))
                    {
                        return alert("Please enter a valid kit number. This must be a number!");
                    }
                    else
                    {




                        //All inputs are valid , We will no setState and add into the TeamsheetArray and Remove from AvailablePlayers Array
                        this.setState({ SelectedPlayerData: this.state.selectedPlayer });


                        this.setState({ SelectedPlayerPositionData: this.state.selectedPlayerPosition });


                        this.setState({ SelectedPlayerKitNumberData: this.state.selectedPlayerKitNumber });
                        
                      
                        this.setState({ SelectedOpponentsName:this.state.OpponentsName})

                    }

            }

        }
        

                        var myUserId = firebase.auth().currentUser.uid;


                        var array1 = this.state.SelectedOpponentsStartingTeam;
                        var array2 = this.state.SelectedOpponentsSubBench;

                        var kitNumbers = this.state.OpponentKitNumbersTaken;




                        for (let i = 0; i < kitNumbers.length; i++) {
                            

                            if(kitNumbers[i] == SelectedPlayerKitNumberData)
                            {
                                return alert('This kit number has already been selected.');
                                // return true;
                            }
                          


                        }

                                    var myUserId = firebase.auth().currentUser.uid;




                                    //Set Random unique UserID as these players are created on the day - not per set as "Your Team Teamsheet"

                                    //Generate a random UserID
                                    var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
                                    let UserID = randLetter + Date.now();
                                    
                                    this.setState({ UserID:UserID});
                    
                                    let fullName = this.state.selectedPlayer;
                                    this.setState({ fullName:fullName})
                    
                    
                                        //GAA Logic
                                        if(SportType == 'GAA')
                                        {

                                            var playerData = {
                                                UserID: UserID,
                                                fullName: fullName,
                                                playerPosition: SelectedPlayerPositionData,
                                                playerKitNumber: SelectedPlayerKitNumberData,
                                                status:'StartingTeam',
                                               
                                                //PlayerStats
                                                Goals:0,
                                                Points:0,
                                                Passes:0,
                                                Shots:0,
                                                ShotsOnTarget:0,
                                            };
                        
                                                array1.push(playerData)
                                                kitNumbers.push(playerData.playerKitNumber);
                                              
                                        }
                                        else if(SportType == 'Soccer')
                                        {
                                            //Soccer Logic
                                            var playerData = {
                                                UserID: UserID,
                                                fullName: fullName,
                                                playerPosition: SelectedPlayerPositionData,
                                                playerKitNumber: SelectedPlayerKitNumberData,
                                                status:'StartingTeam',
                                                Goals: 0,
                                                Passes: 0,
                                                Shots:0,
                                                ShotsOnTarget:0,
                                            };

                                                array1.push(playerData)
                                                kitNumbers.push(playerData.playerKitNumber);
                                           

                                        }

                                // });

                                
                            var playerData1 = {
                                UserID: SelectedPlayerData,
                             
                            };
                                       
                  

       //Remove that player from the Available Players list
        var arr = this.state.AvailablePlayersList;
        var delelethis = playerData1.UserID;

        //array which contains the Record which was deleted from AvailablePlayersList so that if we want to return that record from Starting11 to Available we can
        var temparr = this.state.UserRecordsSelected;
                              

        for (var i = 0; i < arr.length; i++) {
            var obj = arr[i];
        
            if (delelethis.indexOf(obj.key) !== -1) {
                temparr.push(arr[i]);

                arr.splice(i, 1);

                
            
            
            }
        }


        //Close Add Teamsheet View
        this.setState({
            OpenAddOpponentTeamsheet: false
                }, () => console.log(this.state.OpenAddOpponentTeamsheet));

        this.setState({selectedPlayer: "" });

       
                           
                
}



AddToStartingTeam = async( itemKey ) => {
           
         
    var SelectedPlayerData = this.state.selectedPlayer;
    var SelectedPlayerPositionData = this.state.selectedPlayerPosition;
    var SelectedPlayerKitNumberData = this.state.selectedPlayerKitNumber;
    var SelectedOpponentsName = this.state.OpponentsName;

    var SportType = this.state.SportType;

    // //Selected Player Validation
    if(this.state.selectedPlayer == "" || this.state.selectedPlayer == null)
    {
        
        return alert("Please select a valid player");

    }
    else
    {

        //Valid Selected Player , We will now check the position

        //Selected Player Position Validation
        if(SelectedPlayerPositionData == "")
        {
            return alert("Please select a valid position");
        }
        else
        {
            //Valid Selected Player & Position , We will now check the kit number

                if(SelectedPlayerKitNumberData == "")
                {
                    return alert("Please enter a kit number");
                }
                else if(isNaN(SelectedPlayerKitNumberData))
                {
                    return alert("Please enter a valid kit number. This must be a number!");
                }
                else
                {




                    //All inputs are valid , We will no setState and add into the TeamsheetArray and Remove from AvailablePlayers Array
                    this.setState({ SelectedPlayerData: this.state.selectedPlayer });


                    this.setState({ SelectedPlayerPositionData: this.state.selectedPlayerPosition });


                    this.setState({ SelectedPlayerKitNumberData: this.state.selectedPlayerKitNumber });
                    
                  
                    this.setState({ SelectedOpponentsName:this.state.OpponentsName})

                }

        }

    }
    

                    var myUserId = firebase.auth().currentUser.uid;


                    var array1 = this.state.SelectedStartingTeam;
                    var array2 = this.state.SelectedSubBench;

                    var kitNumbers = this.state.kitNumbersTaken;




                    for (let i = 0; i < kitNumbers.length; i++) {
                        

                        if(kitNumbers[i] == SelectedPlayerKitNumberData)
                        {
                            return alert('This kit number has already been selected.');
                   
                        }
                      


                    }


                            firebase.database().ref('/teams').child(myUserId).child('/players').child(SelectedPlayerData)
                            .on('value', snapshot => {
                
                                const userObj = snapshot.val();


                                
                                let UserID = userObj.UserID;
                                this.setState({ UserID:UserID});
                
                                let fullName = userObj.fullName;
                                this.setState({ fullName:fullName})
                
                
                //GAA Logic
                if(SportType == 'GAA')
                {

                    var playerData = {
                        UserID: UserID,
                        fullName: fullName,
                        playerPosition: SelectedPlayerPositionData,
                        playerKitNumber: SelectedPlayerKitNumberData,
                        status:'StartingTeam',
                        Goals: 0,
                        Points: 0,
                        Passes:0,
                        Shots:0,
                        ShotsOnTarget:0,
                    };

                        array1.push(playerData)
                        kitNumbers.push(playerData.playerKitNumber);
                    
                }
                else if(SportType == 'Soccer')
                {
                    //Soccer Logic
                    var playerData = {
                        UserID: UserID,
                        fullName: fullName,
                        playerPosition: SelectedPlayerPositionData,
                        playerKitNumber: SelectedPlayerKitNumberData,
                        status:'StartingTeam',
                        Goals: 0,
                        Passes: 0,
                        Shots:0,
                        ShotsOnTarget:0,
                    };

                        array1.push(playerData)
                        kitNumbers.push(playerData.playerKitNumber);
                   

                }


             
                
                
                
             
         
                
                
                            });

                            
                        var playerData1 = {
                            UserID: SelectedPlayerData,
                         
                        };
                                   
              

   //Remove that player from the Available Players list
    var arr = this.state.AvailablePlayersList;
    var delelethis = playerData1.UserID;

    //array which contains the Record which was deleted from AvailablePlayersList so that if we want to return that record from Starting11 to Available we can
    var temparr = this.state.UserRecordsSelected;
                          

    for (var i = 0; i < arr.length; i++) {
        var obj = arr[i];
    
        if (delelethis.indexOf(obj.key) !== -1) {
            temparr.push(arr[i]);

            arr.splice(i, 1);

            
        
        
        }
    }
               
    
  




    this.setState({
        OpenAddTeamsheet: false
            }, () => console.log(this.state.OpenAddTeamsheet));

    this.setState({selectedPlayer: "" });
   

    this.setState({SetUpMenu: true});

                        
}

AddToSubBench = async( itemKey ) => {


           
         
    var SelectedPlayerData = this.state.selectedPlayer;
    var SelectedPlayerPositionData = this.state.selectedPlayerPosition;
    var SelectedPlayerKitNumberData = this.state.selectedPlayerKitNumber;
    var SelectedOpponentsName = this.state.OpponentsName;
    var SportType = this.state.SportType;

    //Selected Player Validation
    if(SelectedPlayerData == "")
    {
       return alert("Please select a valid player");
    }
    else
    {

        //Valid Selected Player , We will now check the position

        //Selected Player Position Validation
        if(SelectedPlayerPositionData == "")
        {
            return alert("Please select a valid position");
        }
        else
        {
            //Valid Selected Player & Position , We will now check the kit number

                if(SelectedPlayerKitNumberData == "")
                {
                    return alert("Please enter a kit number");
                }
                else if(isNaN(SelectedPlayerKitNumberData))
                {
                    return alert("Please enter a valid kit number. This must be a number!");
                }
                else
                {
                    //All inputs are valid , We will no setState and add into the TeamsheetArray and Remove from AvailablePlayers Array
                    this.setState({ SelectedPlayerData: this.state.selectedPlayer });


                    this.setState({ SelectedPlayerPositionData: this.state.selectedPlayerPosition });


                    this.setState({ SelectedPlayerKitNumberData: this.state.selectedPlayerKitNumber });
                    
                  
                    this.setState({ SelectedOpponentsName:this.state.OpponentsName})

                }

        }

    }
    

                    var myUserId = firebase.auth().currentUser.uid;


                    var array1 = this.state.SelectedStartingTeam;
                    var array2 = this.state.SelectedSubBench;

                    var kitNumbers = this.state.kitNumbersTaken;




                    for (let i = 0; i < kitNumbers.length; i++) {
                        

                        if(kitNumbers[i] == SelectedPlayerKitNumberData)
                        {

                            return alert('This kit number has already been selected.');

                        }
                      


                    }


                            firebase.database().ref('/teams').child(myUserId).child('/players').child(SelectedPlayerData)
                            .on('value', snapshot => {
                
                                const userObj = snapshot.val();
                
                                let fullName = userObj.fullName;
                                this.setState({ fullName:fullName});

                                let UserID = userObj.UserID;
                                this.setState({ UserID:UserID});
                
                
                                if(SportType == 'GAA')
                                {
                
                
                                    var playerData = {
                                        UserID: UserID,
                                        fullName: fullName,
                                        playerPosition: SelectedPlayerPositionData,
                                        playerKitNumber: SelectedPlayerKitNumberData,
                                        status:'SubBench',
                                        Goals: 0,
                                        Passes: 0,
                                        Points:0,
                                        Passes:0,
                                        Shots:0,
                                        ShotsOnTarget:0,
                                    };
                
                                        array1.push(playerData)
                                        kitNumbers.push(playerData.playerKitNumber);
                                 

                                }
                                else if(SportType == 'Soccer')
                                {
                               
                                        //Soccer Logic
                                        var playerData = {
                                                UserID: UserID,
                                                fullName: fullName,
                                                playerPosition: SelectedPlayerPositionData,
                                                playerKitNumber: SelectedPlayerKitNumberData,
                                                status:'SubBench',
                                                Goals: 0,
                                                Passes: 0,
                                                Shots:0,
                                                ShotsOnTarget:0,
                                        };
                    
                                            array1.push(playerData)
                                            kitNumbers.push(playerData.playerKitNumber);
                                      
                                    
                                }
                
                

                            });



                            var playerData1 = {
                                UserID: SelectedPlayerData,
                             
                            };
        
                                    
          //Remove that player from the Available Players list
          var arr = this.state.AvailablePlayersList;
          var delelethis = playerData1.UserID;

          
    //array which contains the Record which was deleted from AvailablePlayersList so that if we want to return that record from Starting11 to Available we can
    var temparr = this.state.UserRecordsSelected;
                                

          for (var i = 0; i < arr.length; i++) {
              var obj = arr[i];
          
              if (delelethis.indexOf(obj.key) !== -1) {
                temparr.push(arr[i]);
                  arr.splice(i, 1);
              
              
              }
          }
                
          this.setState({
            OpenAddTeamsheet: false
                }, () => console.log(this.state.OpenAddTeamsheet));
                                          
                this.setState({selectedPlayer: "" });

                
    this.setState({SetUpMenu: true});
                        
}







    AddToOpponentSubBench = async( itemKey ) => {
          
         
        var SelectedPlayerData = this.state.selectedPlayer;
        var SelectedPlayerPositionData = this.state.selectedPlayerPosition;
        var SelectedPlayerKitNumberData = this.state.selectedPlayerKitNumber;
        var SelectedOpponentsName = this.state.OpponentsName;

        var SportType = this.state.SportType;

        // //Selected Player Validation
        if(SelectedPlayerData == "")
        {
            return alert("Please select a valid player");
        }
        else
        {

            //Valid Selected Player , We will now check the position

            //Selected Player Position Validation
            if(SelectedPlayerPositionData == "")
            {
                return alert("Please select a valid position");
            }
            else
            {
                //Valid Selected Player & Position , We will now check the kit number

                    if(SelectedPlayerKitNumberData == "")
                    {
                        return alert("Please enter a kit number");
                    }
                    else if(isNaN(SelectedPlayerKitNumberData))
                    {
                        return alert("Please enter a valid kit number. This must be a number!");
                    }
                    else
                    {

                        //All inputs are valid , We will no setState and add into the TeamsheetArray and Remove from AvailablePlayers Array
                        this.setState({ SelectedPlayerData: this.state.selectedPlayer });


                        this.setState({ SelectedPlayerPositionData: this.state.selectedPlayerPosition });


                        this.setState({ SelectedPlayerKitNumberData: this.state.selectedPlayerKitNumber });
                        
                      
                        this.setState({ SelectedOpponentsName:this.state.OpponentsName})

                    }

            }

        }
        

                        var myUserId = firebase.auth().currentUser.uid;


                        var array1 = this.state.SelectedOpponentsStartingTeam;
                        var array2 = this.state.SelectedOpponentsSubBench;

                        var kitNumbers = this.state.OpponentKitNumbersTaken;




                        for (let i = 0; i < kitNumbers.length; i++) {
                            

                            if(kitNumbers[i] == SelectedPlayerKitNumberData)
                            {
                                return alert('This kit number has already been selected.');
                                // return true;
                            }
                          


                        }

                                    var myUserId = firebase.auth().currentUser.uid;




                                    //Set Random unique UserID as these players are created on the day - not per set as "Your Team Teamsheet"

                                    //Generate a random UserID
                                    var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
                                    let UserID = randLetter + Date.now();
                                    
                                    this.setState({ UserID:UserID});
                    
                                    let fullName = this.state.selectedPlayer;
                                    this.setState({ fullName:fullName})
                    
                    
                                        //GAA Logic
                                        if(SportType == 'GAA')
                                        {

                                            var playerData = {
                                                UserID: UserID,
                                                fullName: fullName,
                                                playerPosition: SelectedPlayerPositionData,
                                                playerKitNumber: SelectedPlayerKitNumberData,
                                                status:'SubBench',
                                                Goals: 0,
                                                Points: 0,
                                                Passes: 0,
                                                Shots:0,
                                                ShotsOnTarget:0,
                                            };
                        
                                                array1.push(playerData)
                                                kitNumbers.push(playerData.playerKitNumber);
                                                console.log(array1);
                                                console.log(kitNumbers);
                                        }
                                        else if(SportType == 'Soccer')
                                        {
                                            //Soccer Logic
                                            var playerData = {
                                                UserID: UserID,
                                                fullName: fullName,
                                                playerPosition: SelectedPlayerPositionData,
                                                playerKitNumber: SelectedPlayerKitNumberData,
                                                status:'SubBench',
                                                Goals: 0,
                                                Passes: 0,
                                                Shots:0,
                                                ShotsOnTarget:0,
                                            };

                                                array1.push(playerData)
                                                kitNumbers.push(playerData.playerKitNumber);
                                                console.log(array1);
                                                console.log(kitNumbers);

                                        }

                                // });

                                
                            var playerData1 = {
                                UserID: SelectedPlayerData,
                             
                            };
                                       
                  

       //Remove that player from the Available Players list
        var arr = this.state.AvailablePlayersList;
        var delelethis = playerData1.UserID;

        //array which contains the Record which was deleted from AvailablePlayersList so that if we want to return that record from Starting11 to Available we can
        var temparr = this.state.UserRecordsSelected;
                              

        for (var i = 0; i < arr.length; i++) {
            var obj = arr[i];
        
            if (delelethis.indexOf(obj.key) !== -1) {
                temparr.push(arr[i]);

                arr.splice(i, 1);

                
            
            
            }
        }
                   
        


      



        //Close Add Teamsheet View
        this.setState({
            OpenAddOpponentTeamsheet: false
                }, () => console.log(this.state.OpenAddOpponentTeamsheet));

        this.setState({selectedPlayer: "" });
                           
    

    }


     
    


        Training = async() => {
            this.setState({
                TrainingSelected: true
                    }, () => console.log(this.state.TrainingSelected));

                         //Navigate to Stats App and send across game ID/key
                         this.props.navigation.navigate('StatsApp');
    
            
        }


        GameDay = async() => {
            
            var myUserId = firebase.auth().currentUser.uid;

            var UserteamgameCounter = this.state.teamGameLimit;
            var gameCounter = this.state.gameCounter;
        

            //Check if the team has reached its max game limit 
            if(gameCounter >= UserteamgameCounter)
            {
                alert("You have reach your max number of games that can be stored - Please delete a game record or Contact us to upgrade your package.");
            }
            else
            {
                this.setState({
                    GameDaySelected: true
                        }, () => console.log(this.state.GameDaySelected));


                this.setState({EnterOpponentName:true});
            }
        

        }

        //View Add to Teamsheet
        OpenAddTeamsheet = async() => {
            this.setState({
                OpenAddTeamsheet: true
                    }, () => console.log(this.state.OpenAddTeamsheet));


            //Disable Setup menu
            this.setState({SetUpMenu :false})

        }

        CloseAddTeamsheet = async() => {
            this.setState({
                OpenAddTeamsheet: false
                    }, () => console.log(this.state.OpenAddTeamsheet));

            this.setState({
                SetUpMenu:true
            })
        }

        //View Add to Opponent Teamsheet
        OpenAddOpponentTeamsheet = async() => {
            this.setState({
                OpenAddOpponentTeamsheet: true
                    }, () => console.log(this.state.OpenAddOpponentTeamsheet));

            this.setState({
                SetUpMenu:true
            })

        }

        CloseAddOpponentTeamsheet = async() => {
            this.setState({
                OpenAddOpponentTeamsheet: false
                    }, () => console.log(this.state.OpenAddOpponentTeamsheet));

        }

        //View All Selected players - "Your  Team"
        OpenSelectedStarting11SubBench = async() => {
            this.setState({
                OpenSelectedStarting11SubBench: true
                    }, () => console.log(this.state.OpenSelectedStarting11SubBench));
        }

        //View All Selected players - "Opponents Team"
        OpenSelectedOpponentStarting11SubBench = async() => {
            this.setState({
                OpenSelectedOpponentStarting11SubBench: true
                    }, () => console.log(this.state.OpenSelectedOpponentStarting11SubBench));
        }

        ExitListView = async() => {
            this.setState({
                OpenSelectedStarting11SubBench: false
                    }, () => console.log(this.state.OpenSelectedStarting11SubBench));
        }

        ExitOpponentListView = async() => {
            this.setState({
                OpenSelectedOpponentStarting11SubBench: false
                    }, () => console.log(this.state.OpenSelectedOpponentStarting11SubBench));
        }

        ExitValidationPlayer = async() => {
            this.setState({
                OpenValidationPlayer: false
                    }, () => console.log(this.state. OpenValidationPlayer));
        }

        ExitValidationPosition = async() => {
            this.setState({
                OpenValidationPosition: false
                    }, () => console.log(this.state. OpenValidationPosition));
        }

        ExitValidationKitNumber = async() => {
            this.setState({
                OpenValidationKitNumber: false
                    }, () => console.log(this.state. OpenValidationKitNumber));
        }

        RemovePlayer= async(  ) => {


               
            
            var myUserId = firebase.auth().currentUser.uid;

                    //Remove that player from the Available Players list
                    // var arr = this.state.AvailablePlayersList;





                 var starting11Selected = this.state.SelectedStartingTeam;
       


                    var selectedS11Removal = this.state.selectedS11Removal;
                 

                    var AvailableList = this.state.AvailablePlayersList;
           
                    //array which contains the Record which was deleted from AvailablePlayersList so that if we want to return that record from Starting11 to Available we can
                    var temparr = this.state.UserRecordsSelected;
                    console.log(temparr);


                    //Array which stores all the USED Kit numbers
                    var kitNumbers = this.state.kitNumbersTaken;
                                        

           
                    //find the kitnumber of the selected player to remove
                    




                    var playerData1 = {
                        UserID: this.state.selectedS11Removal,
                
                     
                    };
                               
          

                    //Remove that player from the Available Players list based on UserID
                    var deletethis = playerData1.UserID;
               
                    // var kitnumberSearch =  playerKitNumber

               

              
// //Find the selected player within Starting11List by the User then we can remove the kitnumber


for (var i = 0; i < starting11Selected.length; i++) {
  
    //loop kitnumbers array to find the matching UserID number
    if(deletethis == starting11Selected[i].UserID)
        {
            //Store the kit number before deleting
            var storekitnumber = starting11Selected[i].playerKitNumber;
            
            starting11Selected.splice(i, 1);
          
                //Loop through the temporary array 
                for (var i = 0; i < temparr.length; i++) {

                    //If match add back to Available Array
                    if(deletethis == temparr[i].UserID)
                    {

                    

                         var AddPlayerData1 = {
                         AvailableStatus: 1,
                         SubStatus:0,
                         UserID:temparr[i].UserID,
                         Verified:temparr[i].Verified,
                         fullName: temparr[i].fullName,
                         inviteCode:temparr[i].inviteCode,
                         key: temparr[i].key,
                         starting11Status: temparr[i].starting11Status
                        
                        };

                          //Add back to Available List
                          AvailableList.push(AddPlayerData1);


                         //Loop the kit numbers selected and delete the number of the player that has been removed
                          for(var i = 0; i < kitNumbers.length; i++){

                            if(kitNumbers[i] == storekitnumber)
                            {
                                                             
                                        kitNumbers.splice(i, 1);
                                        temparr.splice(i, 1);
                                 
                            }

                          }

                    }
                }
          

        }

        else{
           console.log('No Match');
        }



                    }

               this.setState({
                   OpenSelectedStarting11SubBench: false
                       }, () => console.log(this.state.OpenSelectedStarting11SubBench));
       
            }

        
            RemoveOpponentPlayer = async(  ) => {


               
         
                        //Remove that player from the Available Players list
                        // var arr = this.state.AvailablePlayersList;
    
    
    
    
    
                     var starting11Selected = this.state.SelectedOpponentsStartingTeam;
                     console.log(starting11Selected);
    
    
                        var selectedS11Removal = this.state.selectedS11Removal;
                     
    
                        var AvailableList = this.state.AvailablePlayersList;
               
                        //array which contains the Record which was deleted from AvailablePlayersList so that if we want to return that record from Starting11 to Available we can
                        var temparr = this.state.UserRecordsSelected;
                        console.log(temparr);
    
    
                        //Array which stores all the USED Kit numbers
                        var kitNumbers = this.state.kitNumbersTaken;
                                            
    
               
                        //find the kitnumber of the selected player to remove
                        
    
    
    
    
                        var playerData1 = {
                            UserID: this.state.selectedS11Removal,
                    
                         
                        };
                                   
              
    
                        //Remove that player from the Available Players list based on UserID
                        var deletethis = playerData1.UserID;
                   
                        // var kitnumberSearch =  playerKitNumber
    
                   
    
                  
    // //Find the selected player within Starting11List by the User then we can remove the kitnumber
    
    
    for (var i = 0; i < starting11Selected.length; i++) {
      
        //loop kitnumbers array to find the matching UserID number
        if(deletethis == starting11Selected[i].UserID)
            {
                //Store the kit number before deleting
                var storekitnumber = starting11Selected[i].playerKitNumber;
                
                starting11Selected.splice(i, 1);
              
                    //Loop through the temporary array 
                    for (var i = 0; i < temparr.length; i++) {
    
                        //If match add back to Available Array
                        if(deletethis == temparr[i].UserID)
                        {
    
                        
    
                             var AddPlayerData1 = {
                             AvailableStatus: 1,
                             SubStatus:0,
                             UserID:temparr[i].UserID,
                             Verified:temparr[i].Verified,
                             fullName: temparr[i].fullName,
                             inviteCode:temparr[i].inviteCode,
                             key: temparr[i].key,
                             starting11Status: temparr[i].starting11Status
                            
                            };
    
                              //Add back to Available List
                              AvailableList.push(AddPlayerData1);
    
    
                             //Loop the kit numbers selected and delete the number of the player that has been removed
                              for(var i = 0; i < kitNumbers.length; i++){
    
                                if(kitNumbers[i] == storekitnumber)
                                {
                                                                 
                                            kitNumbers.splice(i, 1);
                                            temparr.splice(i, 1);
                                     
                                }
    
                              }
    
                        }
                    }
              
    
            }
    
            else{
               console.log('No Match');
            }
    
    
    
                        }
    
                   this.setState({
                    OpenSelectedOpponentStarting11SubBench: false
                           }, () => console.log(this.state.OpenSelectedOpponentStarting11SubBench));
           
            }

    
    render (){
        
        var GameDaySelected = this.state.GameDaySelected;
        var TrainingSelected = this.state.TrainingSelected;

        var SetUpMenu = this.state.SetUpMenu;
        
        var SportType = this.state.SportType;
        var playercounter = this.state.playercounter;


        var EnterOpponentName = this.state.EnterOpponentName;


        var OpenAddTeamsheet = this.state.OpenAddTeamsheet;

        var OpenAddOpponentTeamsheet = this.state.OpenAddOpponentTeamsheet;
 
        var OpenSelectedStarting11SubBench = this.state.OpenSelectedStarting11SubBench;

        var OpenSelectedOpponentStarting11SubBench = this.state.OpenSelectedOpponentStarting11SubBench;


        var invalidPlayerSelection = this.state.invalidPlayerSelection;



        


        var SetUpView = (
            <View style={{alignItems:'center'}}>
                <View  style={{alignItems:'center'}}>
                    <Text style = {styles.Text}> Please select a Game Mode.</Text>
                </View>

                <View  style={{alignItems:'center'}}>
                    <Text style = {styles.Text}> Please note that within "Training Mode" games stats are not saved to the database.</Text>
                
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonTitle}>Training Mode</Text>
                    </TouchableOpacity> 
                </View>
          

               
                <View  style={{alignItems:'center'}}>
                    <TouchableOpacity style={styles.button} onPress={this.GameDay} >
                        <Text style={styles.buttonTitle}>Game Day Mode</Text>
                    </TouchableOpacity>
                </View>

                <View  style={{alignItems:'center'}}>
                <TouchableOpacity style={styles.button} onPress={this.GoToMainMenu}>
                    <Text style={styles.buttonTitle}> Back to Main Menu </Text>
                </TouchableOpacity>
                </View>
                      


            </View>
        );

        if(GameDaySelected == true)
        {

            
             if(SportType == 'GAA')
             {

                if(playercounter >= 15)
                {

                    if(EnterOpponentName == true)
                    {

                        SetUpView = (

                            <View style={{alignItems:'center'}}>
                                <Text style={styles.Text}>Enter your Opponents Team name:</Text>
                                    <TextInput
                                        style={styles.textInput}
                                        placeholder='Enter here'
                                        placeholderTextColor="#aaaaaa"
                                        onChangeText={(text) => this.setState({OpponentsName:text})}
                                        value={this.state.OpponentsName}
                                        underlineColorAndroid="transparent"
                                        autoCapitalize="none"
                                    />
                            

                                <TouchableOpacity style={styles.button} onPress={this.ProceedToSetUpMenu}>
                                    <Text style={styles.buttonTitle}>Submit</Text>
                                </TouchableOpacity>

                            </View>

                        );

                    }

                    if(SetUpMenu == true)
                    {

                        SetUpView = (
                            <ScrollView >

                                <TouchableOpacity style={styles.button} onPress={this.OpenAddTeamsheet}>
                                    <Text style={styles.buttonTitle}>Add a player to your teams Starting 15 / Sub Bench</Text>
                                </TouchableOpacity>

                                
                                <TouchableOpacity style={styles.button} onPress={this.OpenAddOpponentTeamsheet }>
                                    <Text style={styles.buttonTitle}>Add a player to the Opponents Starting 15 / Sub Bench</Text>
                                </TouchableOpacity>

                                     
                                <TouchableOpacity style={styles.button} onPress={this.OpenSelectedStarting11SubBench}>
                                    <Text style={styles.buttonTitle}>View/Edit your Starting 15 / Sub Bench </Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.button} onPress={this.OpenSelectedOpponentStarting11SubBench}>
                                    <Text style={styles.buttonTitle}>View/Edit Opponents Starting 15 / Sub Bench </Text>
                                </TouchableOpacity>

                                <View>

                                <TouchableOpacity style={styles.button} onPress={this.SubmitGAATeamSheet}>
                                    <Text style={styles.buttonTitle}>Proceed to Stats App </Text>
                                </TouchableOpacity>

                                </View>

                            </ScrollView>
                        );

                        


                    }

                    
                


                    if(OpenSelectedStarting11SubBench == true)
                    {
                        SetUpView = (
                            <ScrollView style={styles.footerText}>
                                    <Text style={styles.Text}>Your Current Starting 15 / Sub Bench</Text>
                                    
                                                    <TouchableOpacity style={styles.button} onPress={this.ExitListView} >
                                                        <Text style={styles.buttonTitle}>Exit</Text>
                                                    </TouchableOpacity>

                                                    <Text style={styles.Text}>Select a player your want to remove from the teamsheet then click the remove button below</Text>

                                                    <Picker
                                                    selectedValue={this.state.selectedS11Removal}
                                                    
                                                    onValueChange={(text) => this.setState({selectedS11Removal:text})}
                                                    itemStyle={{ backgroundColor: "white", color: "black"}}
                                                    >

                                                    <Picker.Item label="Select a Player" value="" />
                                                    {this.state.SelectedStartingTeam.map((item, index) => {
                                                    return (

                                                        <Picker.Item label={item.fullName} value={item.UserID}/>

                                                    )

                                                    })}
                                            
                                                </Picker> 


                                                                            
                                    

                    
                                                <TouchableOpacity style={styles.button} onPress={this.RemovePlayer}>
                                                    <Text style={styles.buttonTitle}>Remove Player</Text>
                                                </TouchableOpacity>



                                            <FlatList
                                                data={this.state.SelectedStartingTeam}
                                                renderItem={({ item }) => (
                                                    <View style={styles.playerContainer}>
                                                    <Text>Player name: {item.fullName}</Text>
                                                    <Text>Position: {item.playerPosition}</Text>
                                                    <Text>Kit number: {item.playerKitNumber}</Text>
                                                    <Text>Status: {item.status}</Text>


                                                    </View>
                                            )}
                                        
                                            />




                            </ScrollView>
                        );
                    }



                    if(OpenSelectedOpponentStarting11SubBench == true)
                    {
                        SetUpView = (
                            <ScrollView style={styles.footerText}>
                                <Text style={styles.TextBlack}>Opponents Current Starting 15 /  Sub Bench</Text>
                                
                                                <TouchableOpacity style={styles.button} onPress={this.ExitOpponentListView} >
                                                    <Text style={styles.buttonTitle}>Exit</Text>
                                                </TouchableOpacity>

                                                <Text style={styles.TextBlack}>Select a player your want to remove from the teamsheet then click the remove button below</Text>

                                                <Picker
                                                selectedValue={this.state.selectedS11Removal}
                                                style={styles.input}
                                                onValueChange={(text) => this.setState({selectedS11Removal:text})}
                                                itemStyle={{ backgroundColor: "white", color: "black"}}
                                                >

                                                <Picker.Item label="Select a Player" value="" />
                                                {this.state.SelectedOpponentsStartingTeam.map((item, index) => {
                                                return (

                                                    <Picker.Item label={item.fullName} value={item.UserID}/>

                                                )

                                                })}

                                                </Picker> 
                        

                                            <TouchableOpacity style={styles.button} onPress={this.RemoveOpponentPlayer}>
                                                 <Text style={styles.buttonTitle}>Remove Player</Text>
                                              </TouchableOpacity>



                                        <FlatList
                                            data={this.state.SelectedOpponentsStartingTeam}
                                            renderItem={({ item }) => (
                                                <View style={styles.playerContainer}>
                                                    <Text>Player name: {item.fullName}</Text>
                                                    <Text>Position: {item.playerPosition}</Text>
                                                    <Text>Kit number: {item.playerKitNumber}</Text>
                                                    <Text>Status: {item.status}</Text>


                                                </View>
                                        )}
                                    
                                        />




                            </ScrollView>
                        );
                    }

                 
                 

                 
                   //Opponent Team Selection
                if(OpenAddOpponentTeamsheet == true)
                {
                    SetUpView = (
                        <ScrollView >
           
             

                                    <View style = {styles.container}>
                                

                                            <Text style={styles.TextBlack}>Select the Opponents Starting 15 team </Text>


                                            <Text style={styles.TextBlack}>Enter the Players name:</Text>
                                                    <TextInput
                                                        style={styles.textInput}
                                                        placeholder='Enter here'
                                                        placeholderTextColor="#aaaaaa"
                                                        onChangeText={(text) => this.setState({selectedPlayer:text})}
                                                        value={this.state.selectedPlayer}
                                                        underlineColorAndroid="transparent"
                                                        autoCapitalize="none"
                                                    />


                                            <Picker
                            
                                                selectedValue={this.state.selectedPlayerPosition}
                                                style={styles.input}
                                                onValueChange={(text) => this.setState({selectedPlayerPosition:text})}
                                                // itemStyle={{ backgroundColor: "white", color: "black"}}
                                            >
                                                <Picker.Item label="Select their position" value="" />
                                                <Picker.Item label="Goalkeeper" value="GK" />
                                                <Picker.Item label="Defender" value="Defender" />
                                                <Picker.Item label="Midfielder" value="Midfielder"  />
                                                <Picker.Item label="Forward" value="Forward"  />
                                            </Picker> 

                                            <Text style={styles.Text}>Enter their kit number:</Text>
                                                    <TextInput
                                                        style={styles.textInput}
                                                        placeholder='Enter here'
                                                        placeholderTextColor="#aaaaaa"
                                                        onChangeText={(text) => this.setState({selectedPlayerKitNumber:text})}
                                                        value={this.state.selectedPlayerKitNumber}
                                                        underlineColorAndroid="transparent"
                                                        autoCapitalize="none"
                                                    />

                                              <TouchableOpacity style={styles.button} onPress={this.AddToOpponentStartingTeam}>
                                                 <Text style={styles.buttonTitle}>Add player to the Starting 15</Text>
                                              </TouchableOpacity>

                                              

                                              <TouchableOpacity style={styles.button} onPress={this.AddToOpponentSubBench}>
                                                 <Text style={styles.buttonTitle}>Add player to the Sub Bench</Text>
                                              </TouchableOpacity>

                                              <TouchableOpacity style={styles.button} onPress={this.CloseAddOpponentTeamsheet}>
                                                 <Text style={styles.buttonTitle}>Go back to Main Menu</Text>
                                              </TouchableOpacity>


                                </View>

                          </ScrollView>
                    );

                }
                    
                



                    
                    if(OpenAddTeamsheet == true)
                    {
                        SetUpView = (
                    

                            <ScrollView style={{backgroundColor:'#ffffff'}}>
           

                            <View style={styles.container}>

                                    <Text style={styles.Text}> Select your Starting 15 and Sub Bench  </Text>
                            </View>

                            
                     

                                    <Picker

                                        selectedValue={this.state.selectedPlayer}
                                        onValueChange={(text) => this.setState({selectedPlayer:text})}
                                    >

                                        <Picker.Item label="Select a Player" value="" />
                                        {this.state.AvailablePlayersList.map((item, index) => {
                                        return (
                                            <Picker.Item label={item.fullName} value={item.key} key={index}/>

                                        )

                                        })}
                                    
                                    </Picker>  
                                

                               


                                
                          

                                <View style={styles.container}>
                                    <Text style={styles.Text}> Select a position </Text>
                                </View>
                                   
                                   
                         
                                   <Picker
                    
                                        selectedValue={this.state.selectedPlayerPosition}
                                       
                                        onValueChange={(text) => this.setState({selectedPlayerPosition:text})}
                                        // itemStyle={{ backgroundColor: "white", color: "black"}}
                                    >
                                        <Picker.Item label="Select a position" value="" />
                                        <Picker.Item label="Goalkeeper" value="GK" />
                                        <Picker.Item label="Defender" value="Defender" />
                                        <Picker.Item label="Midfielder" value="Midfielder"  />
                                        <Picker.Item label="Forward" value="Forward"  />
                                    </Picker>  



                                    <View style={styles.container}>
                                        <Text style={styles.Text}> Enter their kit number:</Text>
                                    </View>
                                            <TextInput
                                                style={styles.textInput}
                                                placeholder='Enter here'
                                                placeholderTextColor="#aaaaaa"
                                                onChangeText={(text) => this.setState({selectedPlayerKitNumber:text})}
                                                value={this.state.selectedPlayerKitNumber}
                                                underlineColorAndroid="transparent"
                                                autoCapitalize="none"
                                            />



                                      <TouchableOpacity style={styles.button} onPress={this.AddToStartingTeam}>
                                         <Text style={styles.buttonTitle}>Add player to the Starting 15</Text>
                                      </TouchableOpacity>

                                      <TouchableOpacity style={styles.button} onPress={this.AddToSubBench}>
                                         <Text style={styles.buttonTitle}>Add player to the Sub Bench</Text>
                                      </TouchableOpacity>

                                      <TouchableOpacity style={styles.button} onPress={this.CloseAddTeamsheet}>
                                            <Text style={styles.buttonTitle}>Go back to Main Menu</Text>
                                      </TouchableOpacity>


                      


                  </ScrollView>
                        );
                    }

    
                }
                else{
        
                    SetUpView = (
                    
                    <View>
                        <Text style={styles.Text}>You must have 15 or more players added to your team to proceed.</Text>
                    </View>

                    );
                }
             }
             else if(SportType == 'Soccer'){
               
                if(playercounter >= 11)
                {

                    if(EnterOpponentName == true)
                    {

                        SetUpView = (

                            <View style={{alignItems:'center'}}>
                                <Text style={styles.Text}>Enter your Opponents Team name:</Text>
                                    <TextInput
                                        style={styles.textInput}
                                        placeholder='Enter here'
                                        placeholderTextColor="#aaaaaa"
                                        onChangeText={(text) => this.setState({OpponentsName:text})}
                                        value={this.state.OpponentsName}
                                        underlineColorAndroid="transparent"
                                        autoCapitalize="none"
                                    />
                            

                                <TouchableOpacity style={styles.button} onPress={this.ProceedToSetUpMenu}>
                                    <Text style={styles.buttonTitle}>Submit</Text>
                                </TouchableOpacity>

                            </View>

                        );

                    }

                    if(SetUpMenu == true)
                    {

                        SetUpView = (
                            <ScrollView>

                                <TouchableOpacity style={styles.button} onPress={this.OpenAddTeamsheet}>
                                        <Text style={styles.buttonTitle}>Add a player to your teams Starting 11 / Sub Bench</Text>
                                </TouchableOpacity>

                                
                                <TouchableOpacity style={styles.button} onPress={this.OpenAddOpponentTeamsheet }>
                                    <Text style={styles.buttonTitle}>Add a player to the Opponents Starting 11 / Sub Bench</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.button} onPress={this.OpenSelectedStarting11SubBench}>
                                    <Text style={styles.buttonTitle}>View/Edit your Starting 11 / Sub Bench </Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.button} onPress={this.OpenSelectedOpponentStarting11SubBench}>
                                    <Text style={styles.buttonTitle}>View/Edit Opponents Starting 11 / Sub Bench </Text>
                                </TouchableOpacity>
                                
                                <View>

                                    <TouchableOpacity style={styles.button} onPress={this.SubmitSoccerTeamSheet}>
                                        <Text style={styles.buttonTitle}>Proceed to Stats App </Text>
                                    </TouchableOpacity>

                                </View>

                            </ScrollView>
                        );

                       

                    }

                    
                


                    if(OpenSelectedStarting11SubBench == true)
                    {
                        SetUpView = (
                            <ScrollView style={styles.footerText}>
                                    <Text style={styles.Text}>Your Current Starting 11 / Sub Bench</Text>
                                    
                                                    <TouchableOpacity style={styles.button} onPress={this.ExitListView} >
                                                        <Text style={styles.buttonTitle}>Exit</Text>
                                                    </TouchableOpacity>

                                                    <Text style={styles.Text}>Select a player your want to remove from the teamsheet then click the remove button below</Text>

                                                    <Picker
                                                    selectedValue={this.state.selectedS11Removal}
                                                    style={styles.input}
                                                    onValueChange={(text) => this.setState({selectedS11Removal:text})}
                                                    itemStyle={{ backgroundColor: "white", color: "black"}}
                                                    >

                                                    <Picker.Item label="Select a Player" value="" />
                                                    {this.state.SelectedStartingTeam.map((item, index) => {
                                                    return (

                                                        <Picker.Item label={item.fullName} value={item.UserID}/>

                                                    )

                                                    })}
                                                
                                                </Picker> 

                    
                                                <TouchableOpacity style={styles.button} onPress={this.RemovePlayer}>
                                                    <Text style={styles.buttonTitle}>Remove Player</Text>
                                                </TouchableOpacity>



                                            <FlatList
                                                data={this.state.SelectedStartingTeam}
                                                renderItem={({ item }) => (
                                                    <View style={styles.playerContainer}>
                                                    <Text>Player name: {item.fullName}</Text>
                                                    <Text>Position: {item.playerPosition}</Text>
                                                    <Text>Kit number: {item.playerKitNumber}</Text>
                                                    <Text>Status: {item.status}</Text>


                                                    </View>
                                            )}
                                        
                                            />




                            </ScrollView>
                        );
                    }



                    if(OpenSelectedOpponentStarting11SubBench == true)
                    {
                        SetUpView = (
                            <ScrollView style={styles.footerText}>
                                <Text style={styles.Text}>Opponents Current Starting 11 /  Sub Bench</Text>
                                
                                                <TouchableOpacity style={styles.button} onPress={this.ExitOpponentListView} >
                                                    <Text style={styles.buttonTitle}>Exit</Text>
                                                </TouchableOpacity>

                                                <Text style={styles.Text}>Select a player your want to remove from the teamsheet then click the remove button below</Text>

                                                <Picker
                                                selectedValue={this.state.selectedS11Removal}
                                                style={styles.input}
                                                onValueChange={(text) => this.setState({selectedS11Removal:text})}
                                                itemStyle={{ backgroundColor: "white", color: "black"}}
                                                >

                                                <Picker.Item label="Select a Player" value="" />
                                                {this.state.SelectedOpponentsStartingTeam.map((item, index) => {
                                                return (

                                                    <Picker.Item label={item.fullName} value={item.UserID}/>

                                                )

                                                })}

                                                </Picker> 
                        

                                            <TouchableOpacity style={styles.button} onPress={this.RemoveOpponentPlayer}>
                                                 <Text style={styles.buttonTitle}>Remove Player</Text>
                                              </TouchableOpacity>



                                        <FlatList
                                            data={this.state.SelectedOpponentsStartingTeam}
                                            renderItem={({ item }) => (
                                                <View style={styles.playerContainer}>
                                                    <Text>Player name: {item.fullName}</Text>
                                                    <Text>Position: {item.playerPosition}</Text>
                                                    <Text>Kit number: {item.playerKitNumber}</Text>
                                                    <Text>Status: {item.status}</Text>


                                                </View>
                                        )}
                                    
                                        />




                            </ScrollView>
                        );
                    }

                 
                 

                 
                   //Opponent Team Selection
                if(OpenAddOpponentTeamsheet == true)
                {
                    SetUpView = (
                        <ScrollView >
           
             

                                    <View style = {styles.container}>
                                

                                            <Text style={styles.Text}>Select the Opponents Starting 11 team </Text>


                                            <Text style={styles.Text}>Enter the Players name:</Text>
                                                    <TextInput
                                                        style={styles.textInput}
                                                        placeholder='Enter here'
                                                        placeholderTextColor="#aaaaaa"
                                                        onChangeText={(text) => this.setState({selectedPlayer:text})}
                                                        value={this.state.selectedPlayer}
                                                        underlineColorAndroid="transparent"
                                                        autoCapitalize="none"
                                                    />


                                            <Picker
                            
                                                selectedValue={this.state.selectedPlayerPosition}
                                                style={styles.input}
                                                onValueChange={(text) => this.setState({selectedPlayerPosition:text})}
                                                itemStyle={{ backgroundColor: "white", color: "black"}}
                                            >
                                                <Picker.Item label="Select their position" value="" />
                                                <Picker.Item label="Goalkeeper" value="GK" />
                                                <Picker.Item label="Defender" value="Defender" />
                                                <Picker.Item label="Midfielder" value="Midfielder"  />
                                                <Picker.Item label="Forward" value="Forward"  />
                                            </Picker> 

                                            <Text style={styles.Text}>Enter their kit number:</Text>
                                                    <TextInput
                                                        style={styles.textInput}
                                                        placeholder='Enter here'
                                                        placeholderTextColor="#aaaaaa"
                                                        onChangeText={(text) => this.setState({selectedPlayerKitNumber:text})}
                                                        value={this.state.selectedPlayerKitNumber}
                                                        underlineColorAndroid="transparent"
                                                        autoCapitalize="none"
                                                    />



                                              <TouchableOpacity style={styles.button} onPress={this.AddToOpponentStartingTeam}>
                                                 <Text style={styles.buttonTitle}>Add player to the Starting 11</Text>
                                              </TouchableOpacity>

                                              

                                              <TouchableOpacity style={styles.button} onPress={this.AddToOpponentSubBench}>
                                                 <Text style={styles.buttonTitle}>Add player to the Sub Bench</Text>
                                              </TouchableOpacity>

                                              <TouchableOpacity style={styles.button} onPress={this.CloseAddOpponentTeamsheet}>
                                                 <Text style={styles.buttonTitle}>Go back to Main Menu</Text>
                                              </TouchableOpacity>


                                </View>

                          </ScrollView>
                    );

                }
                    
                



                    
                    if(OpenAddTeamsheet == true)
                    {
                        SetUpView = (
                    

                            <ScrollView>
           

                            <View style={styles.container}>
                       



                                    <Text style={styles.Text}> Select your Starting 11 and Sub Bench  </Text>


                                    <Picker
                    
                                        selectedValue={this.state.selectedPlayer}
                                        style={styles.input}
                                        onValueChange={(text) => this.setState({selectedPlayer:text})}
                                        itemStyle={{ backgroundColor: "white", color: "black"}}
                                    >

                                        <Picker.Item label="Select a Player" value="" />
                                        {this.state.AvailablePlayersList.map((item, index) => {
                                        return (
                                            <Picker.Item label={item.fullName} value={item.key} key={index}/>

                                        )

                                        })}
                                    
                                    </Picker> 

                                    <Picker
                    
                                        selectedValue={this.state.selectedPlayerPosition}
                                        style={styles.input}
                                        onValueChange={(text) => this.setState({selectedPlayerPosition:text})}
                                        itemStyle={{ backgroundColor: "white", color: "black"}}
                                    >
                                        <Picker.Item label="Select their position" value="" />
                                        <Picker.Item label="Goalkeeper" value="GK" />
                                        <Picker.Item label="Defender" value="Defender" />
                                        <Picker.Item label="Midfielder" value="Midfielder"  />
                                        <Picker.Item label="Forward" value="Forward"  />
                                    </Picker> 

                                            


                                    <Text style={styles.Text}> Enter their kit number:</Text>
                                            <TextInput
                                                style={styles.textInput}
                                                placeholder='Enter here'
                                                placeholderTextColor="#aaaaaa"
                                                onChangeText={(text) => this.setState({selectedPlayerKitNumber:text})}
                                                value={this.state.selectedPlayerKitNumber}
                                                underlineColorAndroid="transparent"
                                                autoCapitalize="none"
                                            />



                                      <TouchableOpacity style={styles.button} onPress={this.AddToStartingTeam}>
                                            <Text style={styles.buttonTitle}>Add player to the Starting 11</Text>
                                      </TouchableOpacity>

                                      

                                      <TouchableOpacity style={styles.button} onPress={this.AddToSubBench}>
                                            <Text style={styles.buttonTitle}>Add player to the Sub Bench</Text>
                                      </TouchableOpacity>

                                      <TouchableOpacity style={styles.button} onPress={this.CloseAddTeamsheet}>
                                            <Text style={styles.buttonTitle}>Go back to Main Menu</Text>
                                      </TouchableOpacity>


                        </View>



                  </ScrollView>
                        );
                    }

                }
                else{
                    SetUpView = (
                        <ScrollView>
           
                          <Text style={styles.Text}>You must have 11 or more players added to your team to proceed.</Text>
                        </ScrollView>
           
            
                        );  
    
                }
            }
           
         }

        
        if(TrainingSelected == true)
        {
            if(SportType == 'GAA')
            {
                if(playercounter >= 15)
                {

                }
                else
                {
                    SetUpView = (
                        
                        <ScrollView>
                          <Text style={styles.Text}>You must have 15 or more players added to your team to proceed.</Text>
                        </ScrollView>
           
            
                    );
                }
            }
            else if(SportType == 'Soccer')
            {
                if(playercounter >= 11)
                {

                }
                else
                {
                    SetUpView = (
                    
                        <ScrollView>
                            <Text style={styles.Text}>You must have 11 or more players added to your team to proceed.</Text>
                        </ScrollView>
           

                    );
                }
            }



          






       
        }

        if(invalidPlayerSelection == true)
        {

            Alert.alert(
                "Invalid Player Selection",
                "Please select a player and check whether you have ran out of players in the list",
                [
                  {
                    text: "Ok",
                    // onPress: () => console.log("Ask me later pressed")
                  },
                  {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                  },
                  { text: "OK", onPress: () => console.log("OK Pressed") }
                ],
                { cancelable: false }
              );

        



        }



        return(
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center'  ,  backgroundColor: '#242424', alignItems: "center", fontSize: 20}}>
         
        

                {SetUpView} 

         
          </ScrollView>
            
         




  



        )
    }

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent:'center',
        // alignItems:'center',
        backgroundColor: '#C30000',
        // marginTop: 100,
        borderColor:'#000000',
        borderWidth: 1,
        height:'100%',
        width:'100%'  
      
    
    },

 



    playerContainer:{
        flex: 1,
        alignItems: 'center',
        height: '5%',
        borderRadius: 5,
   
        backgroundColor: 'white',
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 30,
        marginRight: 30,
        paddingLeft: 16
    },
    Text:{
        color: "white",
        fontSize:18,
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 16,
        marginRight: 30,
        paddingLeft: 16,
       
        justifyContent:'center'
    },

    TextBlack:{
        color: "black",
        fontSize:18,
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 16,
        marginRight: 30,
        paddingLeft: 16,
       
        justifyContent:'center'
    },
    input: {
     
            height: 40,
            margin: 12,
            borderWidth: 1,
            padding: 10,


      
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 30,
        marginRight: 30,
        paddingLeft: 16
    },

    textInput: {
        
            height: 40,
            margin: 12,
            borderWidth: 1,
            padding: 10,


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
        alignItems: "center",
        justifyContent: 'center',
        //width: '100%'
        width:  553,
    },

    buttonTitle: {
        color:'white',
        fontSize:18,
        justifyContent:'center',
        textAlign: 'center',
        fontWeight: "bold",
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
 
});