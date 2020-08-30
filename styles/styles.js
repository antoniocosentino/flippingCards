import { StyleSheet } from 'react-native';

const inputGlobalStyles = {
    width: '91%',
    marginLeft: '4.5%',
    marginRight: '4.5%',
    borderRadius: 14
};

export const mainColor = '#B83B5E';
export const secondColor = '#F08A5D';
export const thirdColor = '#6A2C70';
export const fourthColor = '#EEECDA';

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
        color: '#333'
    },
    whiteText: {
        textAlign: 'center',
        color: '#fff'
    },
    titleText: {
        color: mainColor
    },
    centeredView: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20
    },
    plusIcon: {
        marginLeft: -1
    },
    icon: {
        width: 32,
        height: 32,
        textAlign: 'center'
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
        backgroundColor: secondColor
    },
    'typeOfWord--Adj': {
        backgroundColor: thirdColor
    },
    sliderWrapper: {},
    singleSlide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    slideText: {
        color: '#fff',
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    singleCardWrapper: {
        height: 400,
        width: 320
    },
    singleCard: {},
    cardFrontAndBack: {
        backgroundColor: mainColor,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        borderRadius: 10,
        padding: 20
    },
    cardBack: {
        backgroundColor: secondColor
    },
    instructions: {
        marginTop: 60,
        paddingLeft: 30,
        paddingRight: 30
    },
    instructionsText: {
        marginTop: 20,
        marginBottom: 20,
        textAlign: 'left'
    },
    ctaButton: {
        margin: 10,
        backgroundColor: mainColor,
        borderColor: mainColor
    },
    cardsTopNav: {
        marginTop: 40
    },
    firstSlideText: {
        fontSize: 16,
        fontWeight: 'normal',
        maxWidth: '90%',
        marginLeft: '5%'
    }
} );
