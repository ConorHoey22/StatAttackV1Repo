import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#252626',
        width:'100%',
        height:'100%',
        justifyContent: "center"

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

    
    RowView: {
        flex: 1,
        
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 10,
        paddingVertical: 4,
        // borderWidth: 3,
        // borderColor: "#20232a",
        // borderRadius: 6,
        // backgroundColor: "#61dafb",
        color: '#20232a',
        textAlign: "center",
        fontSize: 30,
        fontWeight: "bold"
    },
    ColumnView: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',  
        paddingLeft: 50, 
        marginTop:110,
    
    },

    button: {
        backgroundColor: '#FF6D01',
        marginLeft: 30,
        marginRight: 30,
        marginTop: 20,
        height: 48,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: 'center',
        width: '50%'
    },
    buttonTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: "bold"
    },

})