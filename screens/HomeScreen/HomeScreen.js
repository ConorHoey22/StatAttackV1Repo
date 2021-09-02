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
            fullName:'',
            teamID:'',
            teamAdminInvite:'',
            hasTACreated:0,
            teamCreated: 0, 
            listPlayers:[],
            SportType: '',
       
            
            };
        }
       
    
        componentDidMount(){

            const { currentUser } = firebase.auth();
            
            //Check the user type of the AUTH user
            const uid = currentUser.uid;
           
            firebase.database().ref('/users/' + uid).on('value', (snapshot) => {
                const userObj = snapshot.val();
    
                let userType = userObj.userType;
                this.setState({userType:userType});

                let fullName = userObj.fullName;
                this.setState({fullName:fullName});

                let teamAdminInvite = userObj.teamAdminInvite;
                this.setState({teamAdminInvite:teamAdminInvite});

                let teamID = userObj.teamID;
                this.setState({teamID:teamID});

                let teamCreated = userObj.teamCreated;
                this.setState({teamCreated:teamCreated});

                let hasTACreated = userObj.hasTACreated;
                this.setState({hasTACreated:hasTACreated});


                 //Obtain Team user data
                if(teamCreated == 1){
        
                    this.ObtainUserData();
                }
                    
                // //Obtain user data
                // if(teamCreated == 1 || hasTACreated == 1){
                    
                //     this.ObtainUserData();
                // }
                // else if(hasTACreated == 0)
                // {
                    
                //     var myUserId = firebase.auth().currentUser.uid;

                //     //Add the team Analyst to the Team Record
                //     const addTeamAdmin = firebase.database().ref('teams').child(teamID).child('teamAdmins')
                
                //         var adminData = {

                //             id: myUserId,
                //             fullName: this.state.fullName,
                //             teamID: teamID

                //         };

                //         addTeamAdmin.push(adminData);

                //         //Update user id to make it change hasTACreated to = 1
                //         const usersRef = firebase.database().ref('/users')
                //         usersRef.child(myUserId).update({'hasTACreated': 1})
    
                // }
            




            });


  







        
          
              
        
        
            // if(userTypeState == 'TeamAnalyst') 
            // {
            //     firebase.database().ref('/users/' + uid).on('value', (snapshot) => {
            //         const userObj = snapshot.val();
        
            //         let userType = userObj.userType;
            //         this.setState({userType:userType});
    
            //         let teamAdminInvite = userObj.teamAdminInvite;
            //         this.setState({teamAdminInvite:teamAdminInvite});
    
            //         let teamID = userObj.teamID;
            //         this.setState({teamID:teamID});
            //     });


            //     if(hasTACreated == 0)
            //     {

            //         var myUserId = firebase.auth().currentUser.uid;

            //         //Add the team Analyst to the Team Record
            //         const addTeamAdmin = firebase.database().ref('teams').child(teamID).child('teamAdmins')
            
            //             var adminData = {

            //                 id: myUserId,
            //                 fullName: this.state.fullName,
            //                 teamID: teamID

            //             };

            //         addTeamAdmin.push(adminData);



            //         //Update user id to make it change hasTACreated to = 1
            //         const usersRef = firebase.database().ref('/users')
            //         usersRef.child(myUserId).update({'hasTACreated': 1})
  

                    
            //     }
               

            // }

                   
        }


        ObtainUserData = async () => {
            const { currentUser } = firebase.auth();
            
            //Check the user type of the AUTH user
            const uid = currentUser.uid;

            // -------------- GET/STORE Auth UID
            var myUserId = firebase.auth().currentUser.uid;

            var teamID = this.state.teamID;
            var userType = this.state.userType;


                   firebase.database().ref('/users/' + uid).on('value', (snapshot) => {
                    const userObj = snapshot.val();
        
                    let userType = userObj.userType;
                    this.setState({userType:userType});
    
                    let teamAdminInvite = userObj.teamAdminInvite;
                    this.setState({teamAdminInvite:teamAdminInvite});
    
                    let teamID = userObj.teamID;
                    this.setState({teamID:teamID});
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
        

    ActivateAccount = () => {
        this.props.navigation.navigate('ActivateAccount');
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

    JoinATeam = () => {
        this.props.navigation.navigate('JoinATeam');
    }


render(){


    //This is used to check userType and based on that the user will have a custom navigation
    const checkUserType = this.state.userType;
    const checkTeamCreated = this.state.teamCreated;
    const checkTACreated = this.state.hasTACreated;
    var HomeNavigation;
    const uiddd = this.state.UserID;


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
        backgroundColor: '#C30000',
        marginLeft: 30,
        marginRight: 30,
        marginTop: 20,
        height: 48,
        borderRadius: 5,
        borderWidth: 2,
        borderColor:'#000000',
        alignItems: "center",
        justifyContent: 'center',
        // width: '50%'
    },
    buttonTitle: {
        color: 'white',
        fontSize:15,
        fontWeight: "bold",
     
    },

});

export default HomeScreen;