import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    Text: {
        paddingLeft: 40
    },

    container: { 
        flex: 1,  
        backgroundColor: '#242424', 
    },

    textWrapper: {
      height: hp('100%'), // 70% of height device screen
      width: wp('80%') ,  // 80% of width device screen
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
        fontWeight: "bold"
    },
    footerView: {
        flex: 1,
        alignItems: "center",
        marginTop: 20
    },
    footerText: {
        fontSize: 16,
        color: '#2e2e2d'
    },
    footerLink: {
        color: "#788eec",
        fontWeight: "bold",
        fontSize: hp('2%') 
    }
})