import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create( {
    topSearch: {
        flex: 1.5,
        justifyContent: 'flex-end'
    },
    topSpacer: {
        flex: 1.5
    },
    topSearchInput: {
        width: '91%',
        marginLeft: '4.5%',
        marginRight: '4.5%',
        borderRadius: 14
    },
    mainBlock: {
        flex: 9,
        justifyContent:
        'flex-start',
        alignItems: 'center',
        marginTop: 10,
        overflow: 'scroll'
    },
    bottomZone: {
        flex: 1.5,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    bottomWrapper: {
        paddingTop: 16
    },
    text: {
        textAlign: 'center',
        color: '#000000'
    },
    plusIcon: {
        marginLeft: -1
    },
    cardsScrollView: {
        width: '91%',
        marginLeft: '4.5%',
        marginRight: '4.5%'
    },
    wordCard: {
        marginBottom: 10,
        backgroundColor: '#3466FF',
        paddingTop: 10,
        paddingBottom: 10,
        borderRadius: 10
    },
    mainWord: {
        color: '#fff',
        fontSize: 22
    },
    translationWord: {
        color: '#fff',
        fontSize: 16,
        marginTop: 8
    }
} );
