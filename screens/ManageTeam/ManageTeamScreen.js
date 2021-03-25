import React, { useEffect, useState, Component } from 'react'
import { Image, Text, TextInput, FlatList, TouchableOpacity, View ,Button ,ScrollView, Alert , StyleSheet} from 'react-native'

// import * as firebase from 'firebase/app';
import firebase from 'firebase/app'
import 'firebase/auth';
import 'firebase/database';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { BorderlessButton } from 'react-native-gesture-handler';


 class ManageTeamScreen extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            fullName: '',
            listPlayers: []
         };


      }


      componentDidMount(){
        this.playerList();
      }


      playerList = () => {

    
        var myUserId = firebase.auth().currentUser.uid;
        var tempArr = [];

        firebase.database().ref('/teams').child(myUserId).child('/players')
            .on('value', snapshot => {
              
                tempArr = this.snapshotToArray(snapshot);


                console.log(this.state.tempArr);
                this.setState({
                    listPlayers: tempArr
                });

            })


           


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

        ViewPlayer = async() => {

        }

        RemovePlayer = ( itemKey ) => {


            
            var myUserId = firebase.auth().currentUser.uid;
            //Obtain the selected player (UserID) from the list of data 
            //const 

            firebase.database().ref('/teams').child(myUserId).child('/players')
            .once('value' , snapshot =>  {
                if (snapshot.exists())
                {


                        //Remove record from team players record
                        firebase.database().ref('/teams').child(myUserId).child('/players').child(itemKey).remove();


                        //Reduce player counter by 1
                        firebase.database().ref('/teams').child(myUserId)
                        .child('playercounter')
                        .set(firebase.database.ServerValue.increment(-1))

                }
                else{
                    alert('Player does not exist')
                }
            
            });
        

        }

    

    render (){
 
        return(
  
            <ScrollView style={styles.container}>
                   <FlatList
                       data={this.state.listPlayers}
                       style={styles.container}
                       renderItem={({ item }) => (
                           <View style={styles.textWrapper}>
                                <Text>Player Name: {item.fullName}</Text>

                                            <View style={styles.columnView}>
                                                <TouchableOpacity style={styles.button} onPress={() => this.ViewPlayer(item.key)}>
                                                    <Text style={styles.buttonTitle}>View Player</Text>
                                                </TouchableOpacity>
                                            </View>


                                            <View style={styles.columnView}>    
                                                <TouchableOpacity style={styles.button} onPress={() => this.RemovePlayer(item.key)}>                           
                                                    <Text style={styles.buttonTitle}>Remove Player</Text>
                                                </TouchableOpacity>
                                            </View>

                           </View>
                          
                   
                          
                       )}
                     
                       />

            </ScrollView>
           
            
         
        )
    }

}

const styles = StyleSheet.create({

    Text: {
       
        color:'white',
        fontSize:18,
        fontWeight: "bold",

    },

    container: { 
        flex: 1,  
        backgroundColor: '#252626'
 
    },

    textWrapper: {
      height: hp('100%'), // 70% of height device screen
      width: wp('50%') ,  // 80% of width device screen
      flexDirection:"row",
      justifyContent:'space-between',
      alignItems: 'center',
      height: 50,
      borderRadius: 5,
 
      backgroundColor: 'white',
      marginTop: 30,
      marginBottom: 10,
      marginLeft: 60,
      marginRight: 10,
    
      paddingLeft: 6,

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
        backgroundColor: '#FF6D01',
        padding: 15,
        
        borderRadius: 5,
        alignItems: "center",
        justifyContent:'space-between'
    },
    button1: {
        backgroundColor: '#788eec',

        padding: 15,
        
        borderRadius: 5,
        alignItems: "center",
        justifyContent:'space-between'
    },
    buttonTitle: {
        color: 'white',
        fontSize: hp('2%'),

    },
    footerView: {
        flex: 1,
        alignItems: "center",
        marginTop: 20
    },
    footerText: {
     
        fontSize: hp('2%') ,
        color: '#2e2e2d'
    },
    footerLink: {
        color: "#788eec",
    
        fontSize: hp('2%') 
    },
    RowView:{
        flexDirection:"row",
        backgroundColor: 'black',
    },
    columnView:{
        flexDirection: 'column',  
    }

});

export default ManageTeamScreen;