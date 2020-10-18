import React, { useContext } from 'react';
import { View } from 'react-native';

import { Text, Card, IconProps, Icon } from '@ui-kitten/components';

import { AppContext } from '../App';
import { styles } from '../styles/styles';

import { SwipeListView } from 'react-native-swipe-list-view';
import { getArticle } from '../utils/utils';

export const DeleteIcon = ( props: IconProps ) => <Icon { ...props } fill='#333'  width={ 32 } height={ 32 } name='trash-2-outline' />;

export const List = () => {

    const appData = useContext( AppContext );

    const { wordsWallet, filteredWordsWallet, storeData } = appData;

    const wordsWalletToShow = filteredWordsWallet.length > 0 ? filteredWordsWallet : wordsWallet;

    const deleteWord = ( word: string, rowMap: any, rowKey: string ) => {

        if ( rowMap[rowKey] ) {
            rowMap[rowKey].closeRow();
        }

        const updatedWallet = wordsWalletToShow.filter( ( singleWord ) => {
            return singleWord.de !== word;
        } );

        storeData( updatedWallet );

    };

    const wordsWalletWithKeys = [...wordsWalletToShow].map( ( word, index ) => {
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
            renderItem={ ( data ) => {

                // const typeOfWord = getTypeOfWord( data.item );

                return (
                    <Card
                        style={ styles.wordCard }
                    >
                        <Text>
                            <Text
                                style={ styles.mainWord }
                            >
                                { getArticle( data.item ) }
                            </Text>
                            <Text
                                style={ styles.mainWord }
                            >
                                { data.item.de }
                            </Text>
                        </Text>
                        <Text
                            style={ styles.translationWord }
                        >
                            { data.item.en }
                        </Text>
                    </Card>
                ); } }
            renderHiddenItem={ ( data, rowMap ) => (
                <View style={ styles.deleteAction } >
                    <DeleteIcon
                        onPress={ () => { deleteWord( data.item.de, rowMap, data.item.key ); } }
                    />
                </View>
            ) }
            rightOpenValue={ -75 }
            disableRightSwipe={ true }
        />
    );
};
