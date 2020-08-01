import React from 'react';
import { Text, Layout } from '@ui-kitten/components';
import { TSearchWords } from '../App';
import { styles } from './../styles/styles';

type TSearchResultsProps = {
    results: TSearchWords
};

export const SearchResults = ( props: TSearchResultsProps ) => {
    const { results } = props;

    return (
        <Layout style={ styles.searchResults }>
            {
                results.map( ( word, index ) => {
                    return <Text key={ index }>{ word.de } - { word.en }</Text>;
                } )
            }
        </Layout>
    );
};

