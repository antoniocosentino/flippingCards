import React, { useContext } from 'react';
import { Text } from '@ui-kitten/components';
import { TSingleWord, AppContext, TWords } from '../App';
import { styles } from './../styles/styles';
import { getArticle, getCapitalizedIfNeeded, getTypeOfWord } from '../utils/utils';
import { TouchableOpacity, View } from 'react-native';

type TSingleSearchResultProps = {
    word: TSingleWord;
    isAlreadyThere: boolean;
    setAddSearchResults: ( words: TWords  ) => void;
    setAddSearchKeyword: ( word: string ) => void;
};

export const SingleSearchResult = ( props: TSingleSearchResultProps ) => {
    const { word, isAlreadyThere, setAddSearchResults, setAddSearchKeyword } = props;

    const appData = useContext( AppContext );

    const { addSingleWord } = appData;

    const typeOfWord = getTypeOfWord( word );

    const addSmartHandler = ( passedWord: TSingleWord ) => {
        if ( !isAlreadyThere ) {
            addSingleWord( passedWord );
        }

        setAddSearchResults( [] );
        setAddSearchKeyword( '' );
    };

    return (
        <TouchableOpacity
            onPress={ () => addSmartHandler( word ) }
            style={ styles.singleSearchResult }
            activeOpacity={ 0.9 }
        >
            <View style={ [
                styles.searchResultWordBlock,
                isAlreadyThere && styles['searchResultWordBlock--Disabled']
            ] }>
                <Text>
                    <Text style={ styles.singleSearchResultArticle }>{ getArticle( word ) }</Text>
                    <Text style={ styles.singleSearchResultMainWord }>{ getCapitalizedIfNeeded( word ) }</Text>
                </Text>
                <Text style={ styles.enWord } >{ word.en }</Text>
            </View>
            <View style={ styles.searchResultTypeOfWordBlock }>
                <Text style={ [ styles.typeOfWord, styles[ typeOfWord.class ] ] }>{ typeOfWord.name }</Text>
            </View>
        </TouchableOpacity>
    );
};

