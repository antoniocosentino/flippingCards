import { StyleSheet } from 'react-native';
//import { isAndroid } from '../utils/utils';

const inputGlobalStyles = {
    width: '91%',
    marginLeft: '4.5%',
    marginRight: '4.5%',
    borderRadius: 14,
    fontFamily: customFontRegular
};

export const mainColor = '#B83B5E';
export const secondColor = '#F08A5D';
export const thirdColor = '#6A2C70';
export const fourthColor = '#EEECDA';


const customFontRegular = 'Nunito-Regular';
const customFontBold = 'Nunito-SemiBold';

export const styles = StyleSheet.create( {
    topContainer: {
        flex: 1,
        paddingTop: 20, //TODO: this should be device specific,
        paddingBottom: 10,
        justifyContent: 'flex-end'
    },
    coloredTopContainer: {
        backgroundColor: mainColor
    },
    transparentLayout: {
        backgroundColor: 'transparent'
    },
    select: {
        flex: 1,
        margin: 2
    },
    labelText: {
        flex: 1,
        fontFamily: customFontRegular
    },
    smallSelect: {
        flex: 1,
        margin: 2
    },
    sectionLabel: {
        marginTop: 10,
        marginBottom: 10
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    commonDivider: {
        marginTop: 10,
        marginBottom: 10
    },
    addBar: {
        display: 'flex',
        flexDirection: 'row',
        top: 7
    },
    addBarLeft: {
        backgroundColor: mainColor,
        flex: 1.5,
        justifyContent: 'center',
        paddingLeft: 10

    },
    addBarRight: {
        backgroundColor: mainColor,
        flex: 18
    },
    addWordInput: {
        ...inputGlobalStyles,
        borderRadius: 17
    },
    topSearchInput: {
        ...inputGlobalStyles
    },
    mainBlock: {
        flex: 10.5,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 0,
        overflow: 'scroll'
    },
    walletInstructions: {
        paddingLeft: 30,
        paddingRight: 30
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
        color: '#333',
        fontFamily: customFontRegular,
        fontSize: 16.5
    },
    whiteText: {
        textAlign: 'center',
        color: '#fff',
        fontFamily: customFontRegular
    },
    titleText: {
        color: mainColor,
        fontFamily: customFontBold,
        fontSize: 30
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
        fontSize: 22,
        fontFamily: customFontBold
    },
    translationWord: {
        color: '#fff',
        fontSize: 16,
        marginTop: 8,
        fontFamily: customFontRegular
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
        fontSize: 18,
        fontFamily: customFontRegular
    },
    singleSearchResultArticle: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: customFontBold
    },
    enWord: {
        marginTop: 4,
        fontFamily: customFontRegular
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
        paddingBottom: 3,
        fontFamily: customFontRegular
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
    sliderWrapper: {
        flex: 2
    },
    singleSlide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    slideText: {
        color: '#fff',
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        fontFamily: customFontRegular
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
        paddingLeft: 30,
        paddingRight: 30
    },
    instructionsText: {
        marginTop: 20,
        marginBottom: 20,
        textAlign: 'left'
    },
    instructionsTextExtraBlock: {
        marginTop: 0
    },
    ctaButton: {
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: mainColor,
        borderColor: mainColor,
        fontFamily: customFontRegular
    },
    cardsTopNav: {
        marginTop: 40,
        fontFamily: customFontRegular
    },
    firstSlideText: {
        fontSize: 16,
        fontWeight: 'normal',
        maxWidth: '90%',
        marginLeft: '5%'
    }
} );
