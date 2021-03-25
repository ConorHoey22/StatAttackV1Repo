import React, { useEffect, useState , Component  } from 'react'
import {FlatList, StyleSheet, Keyboard, Text, View , ScrollView, TouchableOpacity,TextInput ,Picker, Button , Alert} from 'react-native'

// import * as firebase from 'firebase/app';
import firebase from 'firebase/app'
import 'firebase/auth';
import 'firebase/database';
import { ThemeColors } from 'react-navigation';



import { useNavigation } from '@react-navigation/native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';


 class PlayerProfile extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            fullName:'',
            TeamName: '',
            SportType: '',
            inviteCode:'',
            hasATeam: false,
            userType: [],
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
    
    }

    getPlayerDetails = async() => {
        var myUserId = firebase.auth().currentUser.uid;

        firebase.database().ref('/users').child(myUserId).child('')
        .on('value', snapshot => {
            const userObj = snapshot.val();

            let fullName = userObj.fullName;
            this.setState({fullName:fullName});

            let userType = userObj.userType;
            this.setState({userType:userType});
        
            let totalGoals = userObj.totalGoals;
            this.setState({totalGoals:totalGoals});

            let totalPoints = userObj.totalPoints;
            this.setState({totalPoints:totalPoints});

            let totalPasses = userObj.totalPasses;
            this.setState({totalPasses:totalPasses});

            let totalShots = userObj.totalShots;
            this.setState({totalShots:totalShots});

            let totalShotsOnTarget = userObj.totalShotsOnTarget;
            this.setState({totalShotsOnTarget:totalShotsOnTarget});
            
            let totalTackles = userObj.totalTackles;
            this.setState({totalTackles:totalTackles});

            let totalWonTheBall = userObj.totalWonTheBall;
            this.setState({totalWonTheBall:totalWonTheBall});

            let totalLostTheBall = userObj.totalLostTheBall;
            this.setState({totalLostTheBall:totalLostTheBall});

            let totalYellowCards = userObj.totalYellowCards;
            this.setState({totalYellowCards:totalYellowCards});

            let totalRedCards = userObj.totalRedCards;
            this.setState({totalRedCards:totalRedCards});

            let totalAssists = userObj.totalAssists;
            this.setState({totalAssists:totalAssists});

        });

    }

        

        render(){


            var PlayerProfile;

            if(SportType == 'GAA')
            {
                PlayerProfile = (
                    <View style={stylePlayerProfile.container}>
                   
                        <Text style={stylePlayerProfile.Text}>{this.state.fullName}</Text>
                        <Text style={stylePlayerProfile.Text}>{this.state.userType}</Text>
    
                        <Text style={stylePlayerProfile.Text}>Total Stats</Text>
                        <Text style={stylePlayerProfile.Text}>Goals: {this.state.totalGoals}</Text>
                        <Text style={stylePlayerProfile.Text}>Points: {this.state.totalPoints}</Text>
                        <Text style={stylePlayerProfile.Text}>Shots: {this.state.totalShots}</Text>
                        <Text style={stylePlayerProfile.Text}>Shots on target: {this.state.totalShotsOnTarget}</Text>
                        <Text style={stylePlayerProfile.Text}>Assists: {this.state.totalAssists }</Text>
                        <Text style={stylePlayerProfile.Text}>Tackles: {this.state.totalTackles }</Text>
                        <Text style={stylePlayerProfile.Text}>Won the Ball: {this.state.totalWonTheBall }</Text>
                        <Text style={stylePlayerProfile.Text}>Lost the Ball: {this.state.totalWonTheBall }</Text>
                        <Text style={stylePlayerProfile.Text}>Yellow Cards: {this.state.totalYellowCards }</Text>
                        <Text style={stylePlayerProfile.Text}>Red Cards: {this.state.totalRedCards }</Text>
 
 
                    </View>
                );

            }
            else if (SportType == 'Soccer')
            {
                PlayerProfile = (
                    <View style={stylePlayerProfile.container}>
                   
                        <Text style={stylePlayerProfile.Text}>{this.state.fullName}</Text>
                        <Text style={stylePlayerProfile.Text}>{this.state.userType}</Text>
    
                        <Text style={stylePlayerProfile.Text}>Total Stats</Text>
                        <Text style={stylePlayerProfile.Text}>Goals: {this.state.totalGoals}</Text>
                        <Text style={stylePlayerProfile.Text}>Shots: {this.state.totalShots}</Text>
                        <Text style={stylePlayerProfile.Text}>Shots on target: {this.state.totalShotsOnTarget}</Text>
                        <Text style={stylePlayerProfile.Text}>Assists: {this.state.totalAssists }</Text>
                        <Text style={stylePlayerProfile.Text}>Tackles: {this.state.totalTackles }</Text>
                        <Text style={stylePlayerProfile.Text}>Won the Ball: {this.state.totalWonTheBall }</Text>
                        <Text style={stylePlayerProfile.Text}>Lost the Ball: {this.state.totalWonTheBall }</Text>
                        <Text style={stylePlayerProfile.Text}>Yellow Cards: {this.state.totalYellowCards }</Text>
                        <Text style={stylePlayerProfile.Text}>Red Cards: {this.state.totalRedCards }</Text>
 
 
                    </View>
                );
            }


            return (
                <ScrollView style={stylePlayerProfile.container}>
                   

                    {PlayerProfile}


                </ScrollView>
            )

        }
}



const styleProfile = StyleSheet.create({
    container: {
        backgroundColor: '#252626'
    },
    Text: {
        color:'#ffffff',
        fontSize: 20
        
    }

});


export default PlayerProfile;