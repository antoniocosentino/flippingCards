import React, { useContext } from 'react';
import { View } from 'react-native';

import { Text, Card, IconProps, Icon, Layout, Input } from '@ui-kitten/components';

import { TouchableWithoutFeedback } from 'react-native';

import { AppContext, TSingleWalletWord } from '../App';
import { styles } from '../styles/styles';

import { SwipeListView } from 'react-native-swipe-list-view';
import { getArticle, getCapitalizedIfNeeded } from '../utils/utils';
import { EmptyList } from './EmptyList';
import { SafeAreaView } from 'react-native-safe-area-context';

export const DeleteIcon = ( props: IconProps ) => <Icon { ...props } fill='#333'  width={ 32 } height={ 32 } name='trash-2-outline' />;

export const List = () => {

    const appData = useContext( AppContext );

    const {
        wordsWallet,
        hasFetchedWallet,
        searchValue,
        filteredWordsWallet,
        hasShownAnimation,
        setHasShownAnimation,
        storeData,
        wipeWalletSearch,
        setSearchValue
    } = appData;

    if ( hasFetchedWallet && wordsWallet.length === 0 ) {
        return <EmptyList />;
    }

    const renderCloseIconForWalletSearch = ( props: IconProps ) => {
        if ( searchValue.length < 1 ) {
            return <></>;
        }

        return (
            <TouchableWithoutFeedback onPress={ wipeWalletSearch }>
                <Icon { ...props } width={ 22 } height={ 22 } fill='#ccc' name={ 'close-circle' } />
            </TouchableWithoutFeedback>
        );
    };

    const renderFilterIcon = ( props: IconProps ) => {
        return (
            <Icon { ...props } width={ 22 } height={ 22 } fill='#ccc' name={ 'search-outline' } />
        );
    };

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
        <SafeAreaView style={ styles.searchResults }>
            <Layout style={ styles.listSearchWrapper } >
                <Input
                    style={ styles.topSearchInput }
                    placeholder='Search your wallet'
                    value={ searchValue }
                    onChangeText={ nextValue => setSearchValue( nextValue ) }
                    size={ 'small' }
                    accessoryRight={ renderCloseIconForWalletSearch }
                    accessoryLeft={ renderFilterIcon }
                />
            </Layout>
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
        </SafeAreaView>
    );
};
