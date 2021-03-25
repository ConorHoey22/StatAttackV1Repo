import React, { useEffect, useState } from 'react'
import { Dimensions, Text, View ,ScrollView, TouchableOpacity, } from 'react-native'
import styles from './styles';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';




  
const screenWidth = Dimensions.get('window').width;

const screenHeight = Dimensions.get('window').height;


export default function WelcomeScreen({navigation}){
    
    const Login = () => {
        navigation.navigate('Login')
    }

    const TeamAnalystRegistration = () => {
        navigation.navigate('RegisterTeamAdminInfo')
    }

    
    const PlayerRegistration = () => {
        navigation.navigate('PlayerRegistration')
    }


    return (
     <ScrollView style={styles.container} >
            
            <TouchableOpacity style={styles.button} onPress={() => Login()}>
                <Text style={styles.buttonTitle}>Login</Text>
            </TouchableOpacity>
     
            <TouchableOpacity style={styles.button} onPress={() => TeamAnalystRegistration()}>
                <Text style={styles.buttonTitle}>Register your Team</Text>
            </TouchableOpacity>


            <TouchableOpacity style={styles.button} onPress={() => PlayerRegistration()}>
                <Text style={styles.buttonTitle}>Register as a Player</Text>
            </TouchableOpacity> 

        </ScrollView>

    )
}