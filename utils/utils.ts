import { TSingleWord } from '../App';

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

