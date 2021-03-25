import React, { useState } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import styles from './styles';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

export default function RegisterTeamAdminInfo({navigation}) {


    const onFooterLinkPress = () => {
        navigation.navigate('Login')
    }

    

    return (
        <View style={styles.container}>          
           <Text style={styles.buttonTitle}>To get your team on Stat attack , Contact us by email and someone from our team will contact you</Text>        
        </View>
    )
}