import React from 'react';
import { Text, Layout } from '@ui-kitten/components';
import { TSearchWords } from '../App';
import { styles } from './../styles/styles';

type TSingleSearchResultProps = {
    word: TSearchWords
};
// WIP!!!
export const SingleSearchResult = ( props: TSingleSearchResultProps ) => {
    const { word } = props;

    return (
        <Layout>
            <Text>ciaone</Text>
        </Layout>
    );
};

