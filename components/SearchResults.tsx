import React from 'react';
import { Layout } from '@ui-kitten/components';
import { TSearchWords } from '../App';
import { styles } from './../styles/styles';
import { SingleSearchResult } from './SingleSearchResult';

type TSearchResultsProps = {
    results: TSearchWords
};

export const SearchResults = ( props: TSearchResultsProps ) => {
    const { results } = props;

    return (
        <Layout style={ styles.searchResults }>
            {
                results.map( ( word, index ) => {
                    return <SingleSearchResult word={ word } key={ index } />;
                } )
            }
        </Layout>
    );
};

