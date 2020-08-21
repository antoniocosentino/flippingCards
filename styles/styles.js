import { StyleSheet } from 'react-native';

const inputGlobalStyles = {
    width: '91%',
    marginLeft: '4.5%',
    marginRight: '4.5%',
    borderRadius: 14
};

const mainColor = '#3466FF';

export const styles = StyleSheet.create( {
    topSearch: {
        flex: 1.5,
        justifyContent: 'flex-end'
    },
    addBar: {
        backgroundColor: mainColor,
        paddingTop: 60
    },
    addWordInput: {
        ...inputGlobalStyles,
        borderRadius: 21,
        marginBottom: 20
    },
    topSpacer: {
        flex: 1.5
    },
    topSearchInput: {
        ...inputGlobalStyles
    },
    mainBlock: {
        flex: 9,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 10,
        overflow: 'scroll'
    },
    mainBlockShorter: {
        flex: 8.5
    },
    mainBlockLonger: {
        flex: 10.5
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
        backgroundColor: mainColor,
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
    },
    deleteAction: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingRight: 10
    },
    searchResults: {
        width: '100%',
        flex: 1
    },
    singleSearchResult: {
        width: '91%',
        marginLeft: '4.5%',
        paddingTop: 10,
        paddingBottom: 10,
        borderBottomColor: '#eee',
        borderBottomWidth: 2,
        display: 'flex',
        flexDirection: 'row'
    },
    singleSearchResultMainWord: {
        fontSize: 18
    },
    singleSearchResultArticle: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    enWord: {
        marginTop: 4
    },
    searchResultWordBlock: {
        flex: 8.5
    },
    searchResultTypeOfWordBlock: {
        flex: 1.5,
        flexDirection: 'column',
        justifyContent: 'center'
    },
    typeOfWord: {
        fontSize: 11,
        color: '#fff',
        textAlign: 'center',
        paddingTop: 3,
        paddingBottom: 3
    },
    'typeOfWord--Noun': {
        backgroundColor: mainColor
    },
    'typeOfWord--Verb': {
        backgroundColor: '#FF4A4A'
    },
    'typeOfWord--Adj': {
        backgroundColor: '#45D3BA'
    },
    sliderWrapper: {
        marginTop: 0,
        height: '100%'
    },
    singleSlide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    slideText: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    singleCardWrapper: {
        height: 400,
        width: 320
    },
    singleCard: {},
    cardFront: {
        backgroundColor: mainColor,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        borderRadius: 10
    },
    cardBack: {
        backgroundColor: mainColor,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        borderRadius: 10
    }
} );
