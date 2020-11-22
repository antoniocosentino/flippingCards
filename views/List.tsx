import React, { useContext } from 'react';
import { View } from 'react-native';

import { Text, Card, IconProps, Icon } from '@ui-kitten/components';

import { AppContext, TSingleWalletWord } from '../App';
import { styles } from '../styles/styles';

import { SwipeListView } from 'react-native-swipe-list-view';
import { getArticle, getCapitalizedIfNeeded } from '../utils/utils';

export const DeleteIcon = ( props: IconProps ) => <Icon { ...props } fill='#333'  width={ 32 } height={ 32 } name='trash-2-outline' />;

export const List = () => {

    const appData = useContext( AppContext );

    const {
        wordsWallet,
        filteredWordsWallet,
        hasShownAnimation,
        setHasShownAnimation,
        storeData,
        wipeWalletSearch
    } = appData;

    const wordsWalletToShow = filteredWordsWallet.length > 0 ? filteredWordsWallet : wordsWallet;

    const deleteWord = ( word: TSingleWalletWord, rowMap: any, rowKey: string ) => {

        if ( rowMap[rowKey] ) {
            rowMap[rowKey].closeRow();
        }

        const updatedWallet = wordsWallet.filter( ( singleWord ) => {
            return ( !( singleWord.de === word.de && singleWord.en === word.en ) );
        } );

        storeData( updatedWallet );

        wipeWalletSearch();

    };

    const wordsWalletWithKeys = [...wordsWalletToShow].map( ( word, index ) => {
        return {
            ...word,
            key: index.toString()
        };
    } );

    if ( !hasShownAnimation ) {
        setTimeout( ()=> { setHasShownAnimation( true ); }, 3000 );
    }

    return (
        <SwipeListView
            keyboardDismissMode={ 'on-drag' }
            previewRowKey={ hasShownAnimation ? '' : '0' }
            previewOpenValue={ -50 }
            showsVerticalScrollIndicator={ false }
            data={ wordsWalletWithKeys }
            style={ styles.cardsScrollView }
            renderItem={ ( data ) => {

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
                                { getCapitalizedIfNeeded( data.item ) }
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
                        onPress={ () => { deleteWord( data.item, rowMap, data.item.key ); } }
                    />
                </View>
            ) }
            rightOpenValue={ -75 }
            disableRightSwipe={ true }
        />
    );
};
