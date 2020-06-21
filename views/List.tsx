import React, { useContext } from 'react';
import { ScrollView } from 'react-native';

import { Text, Card } from '@ui-kitten/components';

import { AppContext } from '../App';
import { styles } from '../styles/styles';

export const List = () => {

    const appData = useContext( AppContext );

    const { wordsWallet } = appData;

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.cardsScrollView}
        >
            {
                wordsWallet.map( ( word, wordKey ) => {
                    return (
                        <Card
                            style={styles.wordCard}
                            key={wordKey}
                        >
                            <Text
                                style={styles.mainWord}
                            >
                                {word.de}
                            </Text>
                            <Text
                                style={styles.translationWord}
                            >
                                {word.en}
                            </Text>
                        </Card>
                    );
                } )
            }
        </ScrollView>
    );
};
