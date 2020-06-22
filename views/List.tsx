import React, { useContext } from 'react';
import { View } from 'react-native';

import { Text, Card, IconProps, Icon } from '@ui-kitten/components';

import { AppContext } from '../App';
import { styles } from '../styles/styles';

import { SwipeListView } from 'react-native-swipe-list-view';


export const DeleteIcon = ( props: IconProps ) => <Icon { ...props } fill='crimson'  width={ 32 } height={ 32 } name='trash-2-outline' />;

export const List = () => {

    const appData = useContext( AppContext );

    const { wordsWallet } = appData;

    const wordsWalletWithKeys = [...wordsWallet].map( ( word, index ) => {
        return {
            ...word,
            key: index.toString()
        };
    } );


    console.log( '🍌: List -> wordsWalletWithKeys', wordsWalletWithKeys );

    return (
        <SwipeListView
            showsVerticalScrollIndicator={ false }
            data={ wordsWalletWithKeys }
            style={ styles.cardsScrollView }
            renderItem={ ( data ) => (
                <Card
                    style={ styles.wordCard }
                >
                    <Text
                        style={ styles.mainWord }
                    >
                        { data.item.de }
                    </Text>
                    <Text
                        style={ styles.translationWord }
                    >
                        { data.item.en }
                    </Text>
                </Card>
            ) }
            renderHiddenItem={ () => (
                <View style={ styles.deleteAction } >
                    <Text><DeleteIcon/></Text>
                </View>
            ) }
            rightOpenValue={ -75 }
            disableRightSwipe={ true }
        />
    );
};
