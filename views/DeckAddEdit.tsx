import React from 'react';

import { Layout, Text } from '@ui-kitten/components';
import { styles } from '../styles/styles';
import { SafeAreaView } from 'react-native-safe-area-context';

export const DeckAddEdit = () => {

    return (
        <SafeAreaView style={ styles.mainViewWrapper }>
            <Layout style={ [ styles.centeredElement, styles['centeredElement--noTopSpace' ] ] }>
                <Text style={ [ styles.text, styles.titleText ] } category='h4'>Create New Deck</Text>

                <Text style={ [ styles.text, styles.instructionsText ] }>
                    here there will be things
                </Text>
            </Layout>
        </SafeAreaView>
    );
};
