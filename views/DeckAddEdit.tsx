import React, { useContext, useEffect, useState } from 'react';

import { CheckBox, Layout, Text } from '@ui-kitten/components';
import { styles } from '../styles/styles';
import { FlatList } from 'react-native-gesture-handler';
import { AppContext } from '../App';
import { timeAgo } from './../utils/utils';

const SingleRow = ( props: any ) => {

    const { data, rowSelector } = props;
    const { item } = data;
    const [ checked, setChecked ] = useState( false );

    const onCheckboxChange = () => {
        setChecked( !checked );
        rowSelector( item.id, !checked );
    };

    return (
        <Layout style={ styles.deckAddRow } key={ item.id }>
            <Layout style={ styles.deckAddRowLeft }>
                <CheckBox
                    checked={ checked }
                    onChange={ onCheckboxChange }
                >
                    { item.de }
                </CheckBox>
            </Layout>
            <Layout style={ styles.deckAddRowRight }>
                <Text style={ [ styles.verySmallText, styles.rightAlignedText ] } >{ timeAgo( item.dateAdded ) }</Text>
            </Layout>
        </Layout>
    );
};

export const DeckAddEdit = ( props: any ) => { // TODO: types

    const routeName = props.route?.name;
    const appData = useContext( AppContext );
    const { wordsWallet, setBottomBarVisibility } = appData;

    useEffect( () => {
        setBottomBarVisibility( false );

        return () => {
            setBottomBarVisibility( true );
        };
    }, [ routeName, setBottomBarVisibility ] );

    const initialSelectionState = wordsWallet.map( ( word, index ) => {
        return { ...word, checked: false, id: index.toString() };
    } );

    const rowSelector = ( rowId: string, isSelected: boolean ) => {
        console.log( 'selecting', rowId, 'value:', isSelected );
    };

    return (
        <Layout style={ [ styles.centeredElement, styles['centeredElement--noTopSpace' ], styles['centeredElement--lessHorizontalPadding' ] ] }>
            <Text style={ [ styles.text, styles.titleText ] } category='h4'>Create New Deck</Text>

            <Text style={ styles.text }>
                Select words that will be added to this deck.
                { '\n' }
            </Text>

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
        </Layout>
    );
};
