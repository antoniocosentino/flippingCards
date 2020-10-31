import React, { useContext } from 'react';
import { TSearchWords } from '../App';
import { styles } from './../styles/styles';
import { SingleSearchResult } from './SingleSearchResult';
import { SafeAreaView, ScrollView } from 'react-native';
import { AppContext } from '../App';

type TSearchResultsProps = {
    results: TSearchWords
};

export const SearchResults = ( props: TSearchResultsProps ) => {
    const { results } = props;

    const appData = useContext( AppContext );
    const { wordsWallet } = appData;


    return (
        <SafeAreaView style={ styles.searchResults }>
            <ScrollView
                keyboardDismissMode={ 'on-drag' }
                keyboardShouldPersistTaps={ 'always' }
            >
                {
                    results.map( ( word, index ) => {

                        const isAlreadyThere = wordsWallet.find( ( walletWord ) => walletWord.de === word.de && walletWord.en === word.en );

                        return <SingleSearchResult isAlreadyThere={ Boolean( isAlreadyThere ) } word={ word } key={ index } />;
                    } )
                }
            </ScrollView>
        </SafeAreaView>
    );
};

