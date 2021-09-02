import { StyleSheet } from 'react-native';
import { color } from 'react-native-reanimated';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#252626',
    },
       
    Text:{
        color: "white",
        fontSize:18,
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 16,
        marginRight: 30,
        paddingLeft: 16,
       
        justifyContent:'center'
    },
    logo: {
        flex: 1,
        height: 120,
        width: 90,
        alignSelf: "center",
        margin: 30
    },
    // input: {
    //     height: 48,
    //     borderRadius: 5,
    //     overflow: 'hidden', 

    //     marginTop: 10,
    //     marginBottom: 10,
    //     marginLeft: 30,
    //     marginRight: 30,
    //     paddingLeft: 16
    // },
    button: {
        backgroundColor: '#FF6D01',
        marginLeft: 30,
        marginRight: 30,
        marginTop: 20,
        height: 48,
        width:90,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: 'center'
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
        fontSize:18,
        height: 30,
        marginTop: 15,
        marginBottom: 5,
        marginLeft: 20,
        marginRight: 30,
        paddingLeft: 10,
        color: 'white',
        fontWeight: "bold",
    },
    footerLink: {
        color: "#788eec",
        fontWeight: "bold",
        fontSize: 16
    },
    field:{
        backgroundColor: '#FFFFFF',
        borderWidth: 4,
        borderColor:'#949494',
        borderRadius: 6,
    }
})