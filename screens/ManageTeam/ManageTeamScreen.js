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
        var PlayerList;
       
       
            PlayerList = (
                    

                <View>
                    
                        <Text style={styles.WhiteTextBold}>Your Team Members</Text>
                
                        <FlatList
                            data={this.state.listPlayers}
                        
                            renderItem={({ item }) => (
                                <View style={styles.textWrapper}>
                                    
                                            <Text style = {styles.PlayerName}>Player Name: {item.fullName}</Text>

                                                    <View style={styles.columnView}>
                                                        <TouchableOpacity style={styles.exitRedButton} onPress={() => this.ViewPlayer(item.key)}>
                                                            <Text style={styles.myText}>View Player</Text>
                                                        </TouchableOpacity>
                                                    </View> 


                                                    <View style={styles.columnView}>    
                                                        <TouchableOpacity style={styles.RedButton} onPress={() => this.RemovePlayer(item.key)}>                           
                                                            {/* <Text style={styles.myText}>Remove Player</Text>  */}
                                                            <Image style={styles.ExitButton} source={require('./exit.png')}/>
                                                        </TouchableOpacity>
                                                    </View> 

                                        

                                </View>
                                
                        
                                
                            )}
                            
                            />

                </View>


            );

    

        return(

         
            <ScrollView contentContainerStyle ={{ flex: 1 ,backgroundColor: '#242424' , alignItems: "center"}}>
                {PlayerList}
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
 

    Text: {
        paddingLeft: 40,
        color: 'white',
        fontWeight: "bold",
    },

    
    ExitButton:{
        width:50,
        height: 48,
    },


    container: {
        backgroundColor: '#242424',
        alignItems: 'center',
   
    },

  
    StatRow: {
        flex:1,
       flexDirection:"column",
       
        marginBottom:10,
        backgroundColor: "#33343F",
        

    },

    StatColumn: {
        flex:1,
        flexDirection:"column",
     
        backgroundColor: "#33343F",
 
    },
    columnView: {
        
        paddingTop:10,
          paddingBottom:10,
          paddingLeft: 10,
          paddingRight: 10,
          alignItems: 'center',

    },

    PlayerName:{

        paddingBottom: 30,
        paddingRight: 50,
        color: 'black',
        alignItems: 'center',
        fontWeight: "bold",
        justifyContent:'center',
    },

    textWrapper: {

      flexDirection:"row",
      justifyContent:'center',

      backgroundColor: 'white',
      alignItems: 'center',
      borderColor:'#C30000',
      width: '100%',
      borderWidth: 4,
      marginTop: 10,
      marginBottom: 10,
    
      
      paddingTop:10,
     paddingLeft: 10,
      borderRadius: 10,

    },

    textcolumn: {

        flexDirection:"column",
        justifyContent:'center',
        width: '100%',
        backgroundColor: 'white',
        alignItems: 'center',
        borderColor:'#C30000',
        borderWidth: 4,
        marginTop: 10,
        marginBottom: 10,
  
 
         paddingTop:10,
         paddingLeft: 10,
        borderRadius: 10,
  
      },
    myText: {

      color: 'white',
      alignItems: 'center',

      paddingTop: 5
  
    },

    dcontainer: {
        backgroundColor: 'white',
        height:'100%',
        alignItems: "center",
        fontSize: 20,
       
    },


    input: {
        height: 60,
        width:190,
        borderWidth: 2,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'white',
        borderColor:'#C30000',
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 30,
        marginRight: 30,
        paddingLeft: 16
    },
    exitRedButton: {
        backgroundColor: '#C30000',
        paddingBottom: 30,
        paddingLeft: 16,
        paddingRight: 16,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: 'space-around'
    },

  
    exitRedButtonTitle: {
        color: 'white',
        fontSize: hp('2%'),
   
    },

    BlackText:{
        color: 'black',
    },
 
  
    BlackTextBold:{
        color: 'black',
        fontWeight: "bold",

    },

    
    WhiteTextBold:{
        color: 'white',
        fontWeight: "bold",
        marginTop: '5%',
     
    },
    
    footerView: {
        marginTop: 30,
        marginBottom: 30,
        alignItems: "center",
  
        
    },
    footerText: {
        color: 'black',
        fontSize: hp('2%'),
        
    },
    footerLink: {
        color: "#788eec",
        fontSize: hp('2%') 
    },
    headerContainer:{ 

        backgroundColor: 'white',
        alignItems: "center",
        borderWidth: 4,
        borderRadius: 20,
        borderColor:'#C30000',
        fontWeight: "bold",

    },

});

export default ManageTeamScreen;