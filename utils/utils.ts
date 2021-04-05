import { TSingleWord, TWords, TWordsWallet } from '../App';
import { Platform } from 'react-native';

type TTypeOfWord = {
    name: string,
    class: 'typeOfWord--Noun' | 'typeOfWord--Verb' | 'typeOfWord--Adj' | 'typeOfWord--Adv'
}

export const DECK_SIZE_DATA = [
    '5',
    '10',
    '20',
    '30'
];

export type TWordsFreshnessValues = typeof WORDS_FRESHNESS_DATA[ number ];

export const WORDS_FRESHNESS_DATA = [
    'All Words',
    'Last Day',
    'Last 3 Days',
    'Last Week',
    'Last Month'
];

const capitalizeWord = ( word: string ) => {
    return word.charAt( 0 ).toUpperCase() + word.slice( 1 );
};

export const getFullWordString = ( word: TSingleWord ): string => {
    return `${ getArticle( word ) }${ getCapitalizedIfNeeded( word ).trim() }`;
};

export const uncapitalizeWord = ( word: string ) => {
    return word.charAt( 0 ).toLowerCase() + word.slice( 1 );
};

export const isAndroid = Platform.OS === 'android';


export const getCapitalizedIfNeeded = ( word: TSingleWord ): string => {

    const { wordType } = word;

    switch ( wordType ) {
        case 'm':
        case 'n':
        case 'f':
            return capitalizeWord( word.de );

        default:
            return word.de;
    }
};

export const getArticle = ( word: TSingleWord ): string => {

    const { wordType } = word;

    switch ( wordType ) {
        case 'm':
            return 'der ';

        case 'n':
            return 'das ';

        case 'f':
            return 'die ';

        default:
            return '';
    }
};

export const removeArticle = ( searchString: string ) => {

    const searchRegex = /^(das|der|die) /i;

    return searchString.replace( searchRegex, '' );
};

export const getTypeOfWord = ( word: TSingleWord ): TTypeOfWord => {

    const { wordType } = word;

    switch ( wordType ) {
        case 'm':
        case 'n':
        case 'f':
        default:
            return {
                class: 'typeOfWord--Noun',
                name: 'NOUN'
            };

        case 'verb':
            return {
                class: 'typeOfWord--Verb',
                name: 'VERB'
            };

        case 'adj':
            return {
                class: 'typeOfWord--Adj',
                name: 'ADJ'
            };

        case 'adv':
            return {
                class: 'typeOfWord--Adv',
                name: 'ADV'
            };
    }
};

export const getShuffledCards = ( words: TWordsWallet, nOfCards: number, wordsFreshness: TWordsFreshnessValues ): TWords => {

    const allShuffled = getWalletWordsInGivenPeriod( words, wordsFreshness )
        .map( ( a ) => ( { sort: Math.random(), value: a } ) )
        .sort( ( a, b ) => a.sort - b.sort )
        .map( ( a ) => a.value );


    const tenShuffled = allShuffled.slice( 0, nOfCards );

    tenShuffled.unshift( {
        de: '___firstItem___',
        en: '___firstItem___',
        wordType: '___firstItem___'
    } );

    return tenShuffled;
};

const getWalletWordsInGivenPeriod = ( words: TWordsWallet, wordsFreshness: TWordsFreshnessValues ): TWords => {
    if ( wordsFreshness === WORDS_FRESHNESS_DATA[ 0 ] ) {
        return words;
    }

    const startDate = new Date();

    switch ( wordsFreshness ) {
        case 'Last Day':
            startDate.setDate( startDate.getDate() - 1 );
            break;

        case 'Last 3 Days':
            startDate.setDate( startDate.getDate() - 3 );
            break;

        case 'Last Week':
            startDate.setDate( startDate.getDate() - 7 );
            break;

        case 'Last Month':
            startDate.setDate( startDate.getDate() - 31 );
            break;

    }

    const wordsResult = words.filter( ( singleWord ) => {
        const jsonDate = new Date( singleWord.dateAdded );

        if ( jsonDate >= startDate ){
            return true;
        }
        return false;

    } ).map( ( singleWord ) => singleWord );

    return wordsResult;

};

export const timeAgo = ( date: any ) =>  {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = Date.now() - date;

    if ( elapsed < msPerMinute ) {
        return Math.round( elapsed / 1000 ) + ' seconds ago';
    }

    else if ( elapsed < msPerHour ) {
        return Math.round( elapsed / msPerMinute ) + ' minutes ago';
    }

    else if ( elapsed < msPerDay ) {
        return Math.round( elapsed / msPerHour ) + ' hours ago';
    }

    else if ( elapsed < msPerMonth ) {
        return Math.round( elapsed / msPerDay ) + ' days ago';
    }

    else if ( elapsed < msPerYear ) {
        return Math.round( elapsed / msPerMonth ) + ' months ago';
    }

    else {
        return Math.round( elapsed / msPerYear ) + ' years ago';
    }
};
