import React, { useEffect, useState , Component  } from 'react'
import {FlatList, Keyboard, Text, View , ScrollView, TouchableOpacity,TextInput , Button , Alert} from 'react-native'
import styles from './styles';

import {Picker} from '@react-native-community/picker';
// import * as firebase from 'firebase/app';
import firebase from 'firebase/app'
import 'firebase/auth';
import 'firebase/database';
import { ThemeColors } from 'react-navigation';



import { useNavigation } from '@react-navigation/native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';


class CreateATeam extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            TeamName: '',
            SportType: '',
            inviteCode:'',
            hasATeam: false,
            userType: []
            };
        }

        //On Load need to check if the usertype is headteamanalyst
            //check if they have created a team already or not
                //if they have created a team , tell them to delete it first
                //They shouldnt be able to access this page if they have a value for teamcreated
     




        //Check if user has created an account or has an existing account 
        CheckCreatedTeam = () => {

            this.props.navigation.navigate('Home')
        }

        CreateTeam = () => {


            const { TeamName, SportType } = this.state

  
            if (TeamName.length > 0) {
                  
                if (SportType.length > 0) {
                    
                    var myUserId = firebase.auth().currentUser.uid;

                    const data = {
                        TeamName:this.state.TeamName,
                        SportType:this.state.SportType,
                        CreatedByUserID: myUserId,
                        playercounter:0,
                        gamecounter:0,
         

                    };

                    const teamsRef = firebase.database().ref('/teams').child(myUserId)
                    teamsRef.
                        set(data).then(function() {
                
                            //update user teamcreated
                            const usersRef = firebase.database().ref('/users')
                            usersRef.child(myUserId).update({'teamCreated': 1})
        
 
                            .catch(function(error) {
                                console.error("Error writing document: ", error);
                            });
        
                         this.props.navigation.navigate('Home')
                            alert("Team Created");
                                                            
                    })
        
                
                    .catch(function(error) {
                        console.error("Error writing document: ", error);
                    });
                      
                        
                }
                else if(SportType == "")
                {
                    alert("Please select your sport.")
                }
                     
            }
            else
            {
                alert("Please enter your Team Name.")
            }

          

            
           


         
            this.props.navigation.navigate('Home')
        }




           


        render(){



            return (
            <ScrollView style={styles.container}>
                    <Text style={styles.text}>Enter your team name: </Text>
                        <TextInput
                            style={styles.input}
                            placeholder='Team Name'
                            placeholderTextColor="#aaaaaa"
                            onChangeText={(text) => this.setState({TeamName:text})}
                            value={this.state.TeamName}
                            underlineColorAndroid="transparent"
                            autoCapitalize="none"
                        />
                        <Text style={styles.text}>Select your sport from the list below: </Text>
                        <Picker
                                selectedValue={this.state.SportType}
                                style={styles.picker}
                                onValueChange={(text) => this.setState({SportType:text})}
                            >
                                 
                                <Picker.Item label="Select a sport" value="" />
                                <Picker.Item label="Soccer" value="Soccer" />
                                <Picker.Item label="GAA" value="GAA" />
                        </Picker>
                        
                  
                            <View style={styles.footerView}>
                                <TouchableOpacity style={styles.button} onPress={this.CreateTeam}>
                                        <Text style={styles.text}>Submit</Text>
                                </TouchableOpacity>
                            </View>
            
        
                </ScrollView>

        )
    }

}

export default CreateATeam;