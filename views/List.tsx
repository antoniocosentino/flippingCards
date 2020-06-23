import React, { useContext } from 'react';
import { View } from 'react-native';

import { Text, Card, IconProps, Icon } from '@ui-kitten/components';

import { AppContext } from '../App';
import { styles } from '../styles/styles';

import { SwipeListView } from 'react-native-swipe-list-view';


export const DeleteIcon = ( props: IconProps ) => <Icon { ...props } fill='crimson'  width={ 32 } height={ 32 } name='trash-2-outline' />;

export const List = () => {

    const appData = useContext( AppContext );

    const { wordsWallet, storeData } = appData;

    const deleteWord = ( word: string ) => {

        const updatedWallet = wordsWallet.filter( ( singleWord ) => {
            return singleWord.de !== word;
        } );

        storeData( updatedWallet );

    };

    const wordsWalletWithKeys = [...wordsWallet].map( ( word, index ) => {
        return {
            ...word,
            key: index.toString()
        };
    } );


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
            renderHiddenItem={ ( data, rowMap ) => (
                <View style={ styles.deleteAction } >
                    <Text>
                        <DeleteIcon
                            onPress={ () => { deleteWord( data.item.de ); rowMap[data.item.key].closeRow(); } }
                        />
                    </Text>
                </View>
            ) }
            rightOpenValue={ -75 }
            disableRightSwipe={ true }
        />
    );
};
