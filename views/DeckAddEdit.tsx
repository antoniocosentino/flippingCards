import React, { useContext, useState } from 'react';

import { CheckBox, Layout, Text } from '@ui-kitten/components';
import { styles } from '../styles/styles';
import { FlatList } from 'react-native-gesture-handler';
import { AppContext } from '../App';

const SingleRow = ( props: any ) => {

    const { data, rowSelector } = props;
    const { item } = data;
    const [ checked, setChecked ] = useState( false );

    const onCheckboxChange = () => {
        setChecked( !checked );
        rowSelector( item.id, !checked );
    };

    return (
        <Layout key={ item.id }>
            <CheckBox
                checked={ checked }
                onChange={ onCheckboxChange }
            >
                { item.de }
            </CheckBox>
        </Layout>
    );
};

export const DeckAddEdit = () => {

    const appData = useContext( AppContext );

    const { wordsWallet } = appData;

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
            </Text>

            <FlatList
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
