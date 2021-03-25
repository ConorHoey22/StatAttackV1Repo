import React, { useEffect, useState } from 'react'
import { Image, Text, TextInput, TouchableOpacity, ScrollView , View , StyleSheet} from 'react-native';
import styles from './styles';
// import * as firebase from 'firebase/app';
import firebase from 'firebase/app'
import 'firebase/auth';
import 'firebase/database';




export default function TeamAnalystRegistrationScreen({navigation}){

    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [InviteCode, setInviteCode] = useState('')

    
    const onSignUpPress = () => {
        //  Full name Validation
        if(fullName == "")
        {
            alert("Please enter your full name.")
            return
        }

        //  Email Validation
        if(email == "")
        {
            alert("Please enter your email.")
            return
        }

        //  Password confirmation Check
        if (password !== confirmPassword) {
            alert("Passwords don't match.")
            return
        }
        //Set UserType to TA
        if (password !== confirmPassword) {
            alert("Passwords don't match.")
            return
        }
        firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then((response) => {
                const uid = response.user.uid
                const userType = "TeamAnalyst"
                const data = {
                    id: uid,
                    email,
                    fullName,
                };
                const usersRef = firebase.firestore().collection('users')
                usersRef
                    .doc(uid)
                    .set(data)
                    .then(() => {
                        navigation.navigate('Welcome', {user: data})
                    })
                    .catch((error) => {
                        alert(error)
                    });
            })
            .catch((error) => {
                alert(error)
        });


        navigation.navigate('Login')
    }

    return (
        <ScrollView>
                <Text style={styles.footerText}> Please enter your full name:</Text>
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#aaaaaa"
                    placeholder='Please enter your full name'
                    onChangeText={(text) => setFullName(text)}
                    value={fullName}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />

                <Text style={styles.footerText}> Please enter your email:</Text>
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#aaaaaa"
                    placeholder='Please enter your email'
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />

                <Text style={styles.footerText}> Please enter your password:</Text>
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#aaaaaa"
                    secureTextEntry
                    placeholder='Password'
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                 <Text style={styles.footerText}> Please confirm your password:</Text>
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#aaaaaa"
                    secureTextEntry
                    placeholder='Confirm Password'
                    onChangeText={(text) => setConfirmPassword(text)}
                    value={confirmPassword}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />

                <Text style={styles.footerText}>Please enter you invite code.This can be obtained by your Team Analyst:</Text>
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#aaaaaa"
                    placeholder='Please enter your invite code'
                    onChangeText={(text) => setInviteCode(text)}
                    value={InviteCode}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />

                <View style={styles.footerView}>
                    <TouchableOpacity style={styles.button} onPress={() => onSignUpPress()}>
                    <Text style={styles.buttonTitle}>Sign up!</Text>
                    </TouchableOpacity>
                </View>

        </ScrollView>
    )
}