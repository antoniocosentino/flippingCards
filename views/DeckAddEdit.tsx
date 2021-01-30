import React, { useContext } from 'react';

import { CheckBox, Layout, Text } from '@ui-kitten/components';
import { styles } from '../styles/styles';
import { FlatList } from 'react-native-gesture-handler';
import { AppContext } from '../App';

export const DeckAddEdit = () => {

    const SingleRow = ( props: any ) => {

        const { item } = props;

        return (
            <Layout key={ `${item.de}_${item.en}` }>
                <CheckBox
                    checked={ false }
                    onChange={ undefined }
                >
                    { item.de }
                </CheckBox>
            </Layout>
        );
    };

    const appData = useContext( AppContext );

    const { wordsWallet } = appData;

    return (
        <Layout style={ [ styles.centeredElement, styles['centeredElement--noTopSpace' ], styles['centeredElement--lessHorizontalPadding' ] ] }>
            <Text style={ [ styles.text, styles.titleText ] } category='h4'>Create New Deck</Text>

            <Text style={ styles.text }>
                Select words that will be added to this deck.
            </Text>

            <FlatList
                data={ wordsWallet }
                renderItem={ SingleRow }
                keyExtractor={ item => `${item.de}_${item.en}` }
            />
        </Layout>
    );
};
