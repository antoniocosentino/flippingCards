import React from 'react';
import { Text, Layout } from '@ui-kitten/components';
import { TSingleWord } from '../App';
import { styles } from './../styles/styles';
import { getArticle } from '../utils/utils';

type TSingleSearchResultProps = {
    word: TSingleWord
};

export const SingleSearchResult = ( props: TSingleSearchResultProps ) => {
    const { word } = props;

    return (
        <Layout style={ styles.singleSearchResult }>
            <Text>
                <Text style={ styles.singleSearchResultArticle }>{ getArticle( word ) }</Text>
                <Text style={ styles.singleSearchResultMainWord }>{ word.de }</Text>
            </Text>
            <Text>{ word.en }</Text>
        </Layout>
    );
};

