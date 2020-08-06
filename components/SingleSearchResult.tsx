import React, { useContext } from 'react';
import { Text } from '@ui-kitten/components';
import { TSingleWord, AppContext } from '../App';
import { styles } from './../styles/styles';
import { getArticle } from '../utils/utils';
import { TouchableOpacity } from 'react-native';

type TSingleSearchResultProps = {
    word: TSingleWord
};

export const SingleSearchResult = ( props: TSingleSearchResultProps ) => {
    const { word } = props;

    const appData = useContext( AppContext );

    const { addSingleWord } = appData;

    return (
        <TouchableOpacity
            onPress={ () => addSingleWord( word ) }
            style={ styles.singleSearchResult }
            activeOpacity={ 0.9 }
        >
            <Text>
                <Text style={ styles.singleSearchResultArticle }>{ getArticle( word ) }</Text>
                <Text style={ styles.singleSearchResultMainWord }>{ word.de }</Text>
            </Text>
            <Text style={ styles.enWord } >{ word.en }</Text>
        </TouchableOpacity>
    );
};

