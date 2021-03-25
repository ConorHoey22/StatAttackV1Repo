import React, { useEffect, useState, Component } from 'react'
import { Dimensions, Text, View ,StyleSheet,ScrollView, TouchableOpacity} from 'react-native'

// import * as firebase from 'firebase/app';
import firebase from 'firebase/app'
import 'firebase/auth';
import 'firebase/database';


  

const screenWidth = Dimensions.get('window').width;

const screenHeight = Dimensions.get('window').height;

class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            UserID: '',
            userType: '',
           teamCreated: 0, 
           listPlayers:[],
           SportType: '',
           testMenu:true,
            
            };
        }
       
        //Need to save these variables values in Local Storage for offline mode
        //Store or Obtain team + player + usertype in local storage


        componentDidMount(){

            const { currentUser } = firebase.auth();
            //Check the user type of the AUTH user
             const uid = currentUser.uid;
            firebase.database().ref('/users/' + uid).on('value', (snapshot) => {
                const userObj = snapshot.val();
    
                let teamCreated = userObj.teamCreated;
                this.setState({teamCreated:teamCreated})

                let userType = userObj.userType;
                this.setState({userType:userType})

                console.log(userType);


                
            //Team is created  = 1
            if(teamCreated == 1){
              
                this.ObtainUserData();
            }
        
        });


         

       
                   
        }
       
      

        ObtainUserData = async () => {

            // -------------- GET/STORE Auth UID
            var myUserId = firebase.auth().currentUser.uid;

            // //  GET/STORE Team Members

            //     var tempArr = [];

            //     firebase.database().ref('/teams').child(myUserId).child('/players')
            //         .on('value', snapshot => {
                      
            //             tempArr = this.snapshotToArray(snapshot);
            //             this.setState({
            //                 listPlayers: tempArr
            //             });

         
            //         })
        
    
            //  GET/STORE Team Player Counter +   GET/STORE Sport Type
            firebase.database().ref('/teams').child(myUserId)
            .on('value', snapshot => {
                const userObj = snapshot.val();

                let SportType = userObj.SportType;
                this.setState({SportType:SportType})

                let playercounter = userObj.playercounter;
                this.setState({playercounter:playercounter})
                
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
        


    getUserType = async () => {
        
            const { currentUser } = firebase.auth();
            //Check the user type of the AUTH user
             const uid = currentUser.uid;
           

            firebase.database().ref('/users/' + uid).on('value', (snapshot) => {
                const userObj = snapshot.val();
    
                let teamCreated = userObj.teamCreated;
                this.setState({teamCreated:teamCreated})

                let userType = userObj.userType;
                this.setState({userType:userType})
              });

    // Check if the Head Team Analyst has a team by checking teamCreated Value
    

    }


    onSetupStatsApp = () => {
        this.props.navigation.navigate('SetupStatsApp');
    }

    
    CreateATeam = () => {
        this.props.navigation.navigate('CreateATeam');
    }

    createHeadAnalystAccount = () => {
        this.props.navigation.navigate('HeadTeamAnalystRegistration');
    }

    createTeamAnalystAccount = () => {
        this.props.navigation.navigate('TeamAnalystRegistration');
    }

    AddPlayers = () => {
        this.props.navigation.navigate('AddPlayers');
    }

    ManageTeam = () => {
        this.props.navigation.navigate('ManageTeam');
    }

    TeamProfile = () => {
        this.props.navigation.navigate('TeamProfile');
    }

    PlayerProfile = () => {
        this.props.navigation.navigate('PlayerProfile');
    }

 


        
        
    

 
render(){



    //This is used to check userType and based on that the user will have a custom navigation
    const checkUserType = this.state.userType;
    const checkTeamCreated = this.state.teamCreated;
    var HomeNavigation;
    const uiddd = this.state.UserID;

    var testMenu = this.state.testMenu;

  
  



    if(checkUserType == 'Player')
    {
        HomeNavigation = (
           
            <View style={stylesHome.container}>
                    
                <View style={stylesHome.RowView}>
                    <TouchableOpacity style={stylesHome.button} onPress={this.PlayerProfile}>
                        <Text style={stylesHome.buttonTitle}>My Profile</Text>
                    </TouchableOpacity>
                </View>

                <View style={stylesHome.RowView}>
                    <TouchableOpacity style={stylesHome.button} onPress={this.TeamProfile}>
                        <Text style={stylesHome.buttonTitle}>My Team</Text>
                    </TouchableOpacity>
                </View>

            </View>
        );
    
    }
    else if(checkUserType == 'HeadTeamAnalyst')
    {

        //Check IF the HeadTeamAnalyst has already create a team
            //IF True then Do not display "CreateATeam" , Replace with "Add Players"
               //IF False then display CreateATeam
        if(checkTeamCreated == 1)
        {



            HomeNavigation = (

                <View style={stylesHome.container}>
                    
                    <View style={stylesHome.RowView}>
                        <TouchableOpacity style={stylesHome.button} onPress={this.ManageTeam}>
                            <Text style={stylesHome.buttonTitle}>Manage your Team</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={stylesHome.RowView}>
                        <Text>{uiddd}</Text>

                        <TouchableOpacity style={stylesHome.button} onPress={this.AddPlayers}>
                            <Text style={stylesHome.buttonTitle}>Add Players to your team</Text>
                        </TouchableOpacity>
                    </View>


                    <View style={stylesHome.RowView}>
                        <TouchableOpacity style={stylesHome.button} onPress={this.onSetupStatsApp}>
                            <Text style={stylesHome.buttonTitle}>Stats App</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={stylesHome.RowView}>
                        <TouchableOpacity style={stylesHome.button} onPress={this.TeamProfile}>
                            <Text style={stylesHome.buttonTitle}>My Team </Text>
                        </TouchableOpacity>
                    </View>


               

                </View>

            );
        }
        else
        {
            HomeNavigation = (
                <View style={stylesHome.container}>
                
                    <View style={stylesHome.RowView}>
                        <TouchableOpacity style={stylesHome.button} onPress={this.CreateATeam}>
                            <Text style={stylesHome.buttonTitle}>Create a Team</Text>
                        </TouchableOpacity>
                    </View>
         
                </View>
            );
        }

     
    }
    else if(checkUserType == 'TeamAnalyst')
    {
        HomeNavigation = (
            <View style={stylesHome.container}>
            
                <View style={stylesHome.RowView}>
                    <TouchableOpacity style={stylesHome.button} onPress={this.onSetupStatsApp}>
                        <Text style={stylesHome.buttonTitle}>Setup Stats App</Text>
                    </TouchableOpacity>
                </View>

                <View style={stylesHome.RowView}>
                    <TouchableOpacity style={stylesHome.button} onPress={this.TeamProfile}>
                        <Text style={stylesHome.buttonTitle}> My Team</Text>
                    </TouchableOpacity>
                </View>

              


                    {/* No Access to create a team or Add players  */}
            </View>
        );
    }
    else if(checkUserType == 'CompanySuperUser')
    {
        HomeNavigation = (
            <View style={stylesHome.container}>


               
                <View style={stylesHome.RowView}>
                    <TouchableOpacity style={stylesHome.button} onPress={this.createHeadAnalystAccount}>
                        <Text style={stylesHome.buttonTitle}>Create a Head Team Analyst</Text>
                    </TouchableOpacity>
                </View>


                
                <View style={stylesHome.RowView}>
                    <TouchableOpacity style={stylesHome.button} onPress={this.createTeamAnalystAccount}>
                        <Text style={stylesHome.buttonTitle}>Create a Team Analyst</Text>
                    </TouchableOpacity>
                </View>
                    {/* No Access to create a team or Add players  */}
            </View>
        );
    }



    return (


     <View style={stylesHome.container}> 
             {/* Navigation UserType Validation */}
             {HomeNavigation}

           
    </View>
               

        )
    }
}

const stylesHome = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#252626',
        width:'100%',
        height:'100%',
        justifyContent: "center"

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

    
    RowView: {
        flex: 1,
        
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 10,
        paddingVertical: 4,

        color: "#20232a",
        textAlign: "center",
        fontSize: 30,
 
    },
    ColumnView: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',  
        paddingLeft: 50, 
        marginTop:110,
    
    },

    button: {
        backgroundColor: '#FF6D01',
        marginLeft: 30,
        marginRight: 30,
        marginTop: 20,
        height: 48,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: 'center',
        width: '50%'
    },
    buttonTitle: {
        color: 'white',
        fontSize: 16,
       
    },

});

export default HomeScreen;