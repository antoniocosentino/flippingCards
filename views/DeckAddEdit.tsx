import React from 'react';

import { Layout, Text } from '@ui-kitten/components';
import { styles } from '../styles/styles';

export const DeckAddEdit = () => {

    return (
        <Layout style={ [ styles.centeredElement, styles['centeredElement--noTopSpace' ], styles['centeredElement--lessHorizontalPadding' ] ] }>
            <Text style={ [ styles.text, styles.titleText ] } category='h4'>Create New Deck</Text>

            <Text style={ styles.text }>
                Select words that will be added to this deck.
            </Text>
        </Layout>
    );
};
