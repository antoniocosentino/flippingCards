import React, { useContext, useState } from 'react';

import { Button, CheckBox, Layout, Text, Input, Icon } from '@ui-kitten/components';
import { styles } from '../styles/styles';
import { FlatList } from 'react-native-gesture-handler';
import { AppContext, TCards, TDeck, TSingleCard } from '../App';
import { timeAgo } from './../utils/utils';

const SingleRow = ( props: any ) => {

    const { data, rowSelector } = props;

    const { item } = data;
    const [ checked, setChecked ] = useState( item.checked );

    const onCheckboxChange = () => {
        setChecked( !checked );
        rowSelector( item.id, !checked );
    };

    // TODO: i'm using ts-ignore because according to the type definition I can't pass
    // a layout as a children of checkbox. However this works perfectly fine.

    return (
        <Layout style={ styles.deckAddRow } key={ item.id }>
            <Layout style={ styles.deckAddRowLeft }>
                <CheckBox
                    checked={ checked }
                    onChange={ onCheckboxChange }
                >
                    { /* @ts-ignore */ }
                    <Layout>
                        <Text style={ styles.boldText } >{ item.de }</Text>
                        <Text style={ [styles.text, styles.smallerText, styles.leftAlignedText ] }>{ item.en }</Text>
                    </Layout>

                </CheckBox>
            </Layout>
            <Layout style={ styles.deckAddRowRight }>
                <Text style={ [ styles.verySmallText, styles.rightAlignedText ] } >{ timeAgo( item.dateAdded ) }</Text>
            </Layout>
        </Layout>
    );
};

export const DeckAddEdit = ( props: any ) => { // TODO: types

    const { navigation } = props;
    const params = props.route?.params || {};

    const editMode = params?.editMode || false;
    const deckKey = params?.deckKey !== null ? params.deckKey : null;

    const appData = useContext( AppContext );
    const { wordsWallet, decksData, addSingleDeck, updateSingleDeck } = appData;
    const thisDeck = editMode ? decksData[ deckKey ] : null;

    const newDeckCards: TCards = [];

    // TODO: this is slightly buggy (there's a flickering on the list)
    // check if I can make this smoother
    // useEffect( () => {
    //     setBottomBarVisibility( false );

    //     return () => {
    //         setBottomBarVisibility( true );
    //     };
    // }, [ routeName, setBottomBarVisibility ] );

    const rowSelector = ( rowId: string, isSelected: boolean ) => {
        if ( isSelected ) {
            const cardToAdd: TSingleCard = {
                en: wordsWallet[ parseInt( rowId, 10 ) ].en,
                de: wordsWallet[ parseInt( rowId, 10 ) ].de,
                wordType: wordsWallet[ parseInt( rowId, 10 ) ].wordType,
                mastered: false
            };
            newDeckCards.push( cardToAdd );
        }
        else {
            const cardToDelete = newDeckCards.findIndex( ( singleCard ) =>
                singleCard.en === wordsWallet[ parseInt( rowId, 10 ) ].en  &&
                singleCard.de === wordsWallet[ parseInt( rowId, 10 ) ].de );

            newDeckCards.splice( cardToDelete, 1 );
        }
    };

    const initialSelectionState = wordsWallet.map( ( word, index ) => {

        let checkedValue = false;

        if ( editMode && thisDeck ) {
            const thisWordInOriginalDeck = thisDeck.cards.find( ( deckWord: TSingleCard ) => deckWord.de === word.de && deckWord.en === word.en );

            if ( thisWordInOriginalDeck ) {
                rowSelector( index.toString(), true );
                checkedValue = true;
            }

        }


        return { ...word, checked: checkedValue, id: index.toString() };
    } );

    const constructNewDeckData = ( name?: string ): TDeck => {
        return {
            id: ( new Date() ).getTime(),
            name: name ? name : ( new Date() ).toLocaleString( 'de-DE' ),
            createdTimestamp: ( new Date() ).getTime(),
            updatedTimestamp: ( new Date() ).getTime(),
            cards: newDeckCards
        };
    };

    const onCreateDeck = () => {
        addSingleDeck( constructNewDeckData() );
        navigation.goBack();
    };

    const onUpdateDeck = () => {
        const updatedData = constructNewDeckData( inputContent );
        updateSingleDeck( updatedData, deckKey );

        navigation.goBack();
    };

    const [ inputContent, setInputContent ] = useState( thisDeck?.name );

    const subHeaderContent =
        editMode ?
            <Input
                style={ styles.smallInput }
                size='small'
                value={ inputContent }
                placeholder='Name of your deck'
                onChangeText={ nextValue => setInputContent( nextValue  ) }
            />
            :
            <Text style={ styles.text }>
                Select words that will be added to this deck.
                { '\n' }
            </Text>;

    return (
        <Layout style={ [ styles.centeredElement, styles['centeredElement--noTopSpace' ], styles['centeredElement--lessHorizontalPadding' ] ] }>

            <Layout style={ styles.createDeckCloseBtn  }>
                <Icon
                    onPress={ () => navigation.goBack() }
                    width={ 30 }
                    height={ 30 }
                    fill='#000'
                    name={ 'close' }
                />
            </Layout>

            <Text style={ [ styles.text, styles.titleText ] } category='h4'>
                { editMode ? 'Edit Deck' : 'Create new Deck' }
            </Text>

            { subHeaderContent }

            <FlatList
                style={ styles.createDeckList }
                data={ initialSelectionState }
                renderItem={ ( data ) => {
                    return (
                        <SingleRow
                            data={ data }
                            rowSelector={ rowSelector }
                        />
                    );
                } }
                keyExtractor={ item => item.id }
            />

            <Layout style={ styles.createDeckCta }>
                <Button onPress={ editMode ? onUpdateDeck : onCreateDeck } style={ styles.ctaButton }>
                    { editMode ? 'Save Changes' : 'Create Deck' }
                </Button>
            </Layout>
        </Layout>
    );
};
