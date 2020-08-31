import { TSingleWord, TSearchWords } from '../App';
import { Platform } from 'react-native';

type TTypeOfWord = {
    name: string,
    class: 'typeOfWord--Noun' | 'typeOfWord--Verb' | 'typeOfWord--Adj'
}

export const isAndroid = Platform.OS === 'android';

export const getArticle = ( word: TSingleWord ) => {

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

        case 'vi':
        case 'vt':
            return {
                class: 'typeOfWord--Verb',
                name: 'VERB'
            };

        case 'adj':
            return {
                class: 'typeOfWord--Adj',
                name: 'ADJ'
            };
    }
};

export const getShuffledCards = ( words: TSearchWords ) => {
    const allShuffled = words
        .map( ( a ) => ( { sort: Math.random(), value: a } ) )
        .sort( ( a, b ) => a.sort - b.sort )
        .map( ( a ) => a.value );


    const tenShuffled = allShuffled.slice( 0, 10 );

    tenShuffled.unshift( {
        de: '___firstItem___',
        en: '___firstItem___',
        wordType: '___firstItem___'
    } );

    return tenShuffled;
};
