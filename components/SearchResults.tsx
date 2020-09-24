import React from 'react';
import { TSearchWords } from '../App';
import { styles } from './../styles/styles';
import { SingleSearchResult } from './SingleSearchResult';
import { SafeAreaView, ScrollView } from 'react-native';

type TSearchResultsProps = {
    results: TSearchWords
};

export const SearchResults = ( props: TSearchResultsProps ) => {
    const { results } = props;

    return (
        <SafeAreaView style={ styles.searchResults }>
            <ScrollView
                keyboardDismissMode={ 'on-drag' }
                keyboardShouldPersistTaps={ 'always' }
            >
                {
                    results.map( ( word, index ) => {
                        return <SingleSearchResult word={ word } key={ index } />;
                    } )
                }
            </ScrollView>
        </SafeAreaView>
    );
};

