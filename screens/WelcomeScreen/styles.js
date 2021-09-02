import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#252626',
   
    },
   
    Text:{
        color: "white",
        fontSize:15,
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 16,
        marginRight: 30,
        paddingLeft: 16,
        fontWeight: "bold",
        justifyContent:'center'
    },
    logo: {
        flex: 1,
        height: 120,
        width: 90,
        alignSelf: "center",
        margin: 30
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
        backgroundColor: '#C30000',
        marginLeft: 30,
        marginRight: 30,
        marginTop: 20,
        height: 48,
        borderRadius: 5,
        borderWidth: 2,
        borderColor:'#000000',
        alignItems: "center",
        // justifyContent: 'center'
    },
    buttonTitle: {
         color: 'white',
        fontSize: 16,
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
        fontSize: 16
    }
})