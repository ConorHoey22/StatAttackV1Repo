import { StyleSheet } from 'react-native';


export default StyleSheet.create({
        container: {
            backgroundColor: '#252626', 
            // alignItems: 'center',
        },
        Text: {
            color:'#fffffff',
            fontSize: 20
            
        },
        dataContainer: {
            backgroundColor: '#ffffff', 
            alignItems: 'center',
            
        },
        container2: {
            backgroundColor: '#ffffff', 
            alignItems: 'center',
        },
        headerContainer:{ 

            backgroundColor: '#FF6D01',
            alignItems: "center",
            borderWidth: 4,
            borderColor:'#ffffff',
            
            width: wp('50%') ,  // % of width device screen
      
            padding:4,
      
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
            marginLeft: 30,
            marginRight: 30,
            marginTop: 20,
            height: 48,
            borderRadius: 5,
            alignItems: "center",
            justifyContent: 'center'
        },
        buttonTitle: {
            color: 'white',
            fontSize: 16,
            fontWeight: "bold"
        },



})