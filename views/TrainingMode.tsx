import React, { useContext } from 'react';
import { Text, Icon, Button, IndexPath, Layout, IconProps, Divider, Select, SelectItem, Modal, Card } from '@ui-kitten/components';
import { styles } from './../styles/styles';
import { AppContext, TWords, TWordsWallet } from '../App';
import AsyncStorage from '@react-native-community/async-storage';
import { DECK_SIZE_DATA, getShuffledCards, TWordsFreshnessValues, WORDS_FRESHNESS_DATA } from '../utils/utils';

import { createStackNavigator } from '@react-navigation/stack';

import { AddWordIcon } from '../App';
import { Cards } from './Cards';
import { demoDeck } from '../utils/demoDeck';
import { chunk } from 'lodash';

type TTrainingModeInstructionsProps = {
    deck: TWords;
    storeDeckData: ( value: TWordsWallet, nOfCards: number, wordsFreshness: TWordsFreshnessValues ) => Promise<number>;
    navigation: any; // TODO: I don't know the type of this
}

const CardsIcon = ( props: IconProps ) => (
    <Icon { ...props } name='grid-outline' />
);

const ShuffleIcon = ( props: IconProps ) => (
    <Icon { ...props } name='shuffle-2-outline' />
);

demoDeck.decks.push( {
    id: -1,
    name: '__ADD_PLACEHOLDER__',
    createdTimestamp: 1609757292,
    updatedTimestamp: 1609757492,
    cards: []
} );

const TrainingModeInstructions = ( props: TTrainingModeInstructionsProps ) => {

    const { deck, storeDeckData, navigation } = props;

    const appData = useContext( AppContext );
    const { wordsWallet, customNavigate } = appData;

    const [modalVisible, setModalVisible] = React.useState( false );

    const [selectedDeckSizeIndex, setSelectedDeckSizeIndex] = React.useState( new IndexPath( 1 ) );
    const displayDeckSizeValue = DECK_SIZE_DATA[selectedDeckSizeIndex.row];

    const [selectedWordsFreshnessIndex, setSelectedWordsFreshnessIndex] = React.useState( new IndexPath( 0 ) );
    const displayWordsFreshnessValue = WORDS_FRESHNESS_DATA[selectedWordsFreshnessIndex.row];

    const renderSizeOption = ( title: string, index: number ) => (
        <SelectItem key={ index } title={ title }/>
    );

    const generateNewDeck = ( nOfCards: number, wordsFreshness: TWordsFreshnessValues ) => {
        const deckSizePromise = storeDeckData( wordsWallet, nOfCards, wordsFreshness );

        Promise.resolve( deckSizePromise ).then( ( result: number ) => {
            if ( result > 1 ){
                navigation.navigate( 'training-mode_cards' );
            } else {
                setModalVisible( true );
            }
        } );
    };

    const chunkedDecks = chunk( demoDeck.decks, 3 );

    return (
        <Layout style={ styles.instructions }>

            <Text style={ [ styles.text, styles.titleText ] } category='h4'>Training mode</Text>

            <Text style={ styles.verySmallText }>{ '\n' }</Text>

            <Text style={ [ styles.text, styles.boldText, styles.smallerText, styles.leftAlignedText ] }>YOUR DECKS</Text>

            { chunkedDecks.map( ( singleRow, rowKey ) => {

                return (
                    <Layout key={ rowKey } style={ styles.decksWrapper }>
                        { singleRow.map( ( singleDeck, deckKey ) => {
                            if ( singleDeck.name === '__ADD_PLACEHOLDER__' ) {
                                return (
                                    <Card
                                        onPress={ () => navigation.navigate( 'training-mode_cards' ) } 
                                        style={ [
                                            styles.singleDeck,
                                            styles.addDeck,
                                            ( deckKey === 0 || deckKey === 2 ) && styles['singleDeck--noMargin']
                                        ] }
                                        key={ deckKey }
                                    >
                                        <Text style={ styles.addDeckPlus }>+</Text>
                                    </Card>
                                );
                            }

                            return (
                                <Card
                                    onPress={ () => navigation.navigate( 'training-mode_cards' ) }
                                    style={ [
                                        styles.singleDeck,
                                        ( deckKey === 0 || deckKey === 2 ) && styles['singleDeck--noMargin']
                                    ] }
                                    key={ deckKey }
                                >
                                    <Text style={ [ styles.whiteText, styles.verySmallText ] }>{ singleDeck.name }</Text>
                                </Card>
                            );
                        } ) }
                    </Layout>
                );

            } ) }
        </Layout>
    );
};

const Stack = createStackNavigator();

export const TrainingMode = () => {

    const [ deck, setDeck ] = React.useState( [] as TWords );
    const [ isDeckDataUpdated, setDeckDataUpdated ] = React.useState( false );

    const getDeckData = async () => {
        try {
            const value = await AsyncStorage.getItem( '@deck' );

            if ( value !== null ) {
                setDeck( JSON.parse( value ) );
            }
        } catch ( e ) {
            // error reading value
        }
    };

    const storeDeckData = async ( value: TWordsWallet, nOfCards: number, wordsFreshness: TWordsFreshnessValues ): Promise<number> => {
        const shuffledCards = getShuffledCards( value, nOfCards, wordsFreshness );
        setDeckDataUpdated( false );
        try {
            const jsonValue = JSON.stringify( shuffledCards );
            await AsyncStorage.setItem( '@deck', jsonValue );
        } catch ( e ) {
            console.error( 'Error:', e );
        }

        return shuffledCards.length;
    };

    if ( !isDeckDataUpdated ){
        getDeckData();
        setDeckDataUpdated( true );
    }

    return (
        <Layout style={ styles.stackNavigatorWrapper } >
            <Stack.Navigator
                screenOptions={ {
                    cardStyle: { backgroundColor: '#fff' }
                } }
            >
                <Stack.Screen
                    name='training-mode_instructions'
                    options={ {
                        title: '',
                        animationEnabled: false,
                        headerLeft: () => null,
                        headerStyle: {
                            shadowColor: 'transparent',
                            elevation: 0
                        }
                    } }
                >
                    {
                        ( props ) => {
                            return (
                                <TrainingModeInstructions
                                    { ...props }
                                    deck={ deck }
                                    storeDeckData={ storeDeckData }
                                />
                            );
                        }
                    }
                </Stack.Screen>

                <Stack.Screen
                    name='training-mode_cards'
                    options={ {
                        headerShown: true,
                        title: '',
                        animationEnabled: true,
                        headerStyle: {
                            shadowColor: 'transparent',
                            elevation: 0
                        }
                    } }
                >
                    {
                        ( props ) => {
                            return (
                                <Cards
                                    { ...props }
                                    deck={ deck }
                                />
                            );
                        }
                    }
                </Stack.Screen>

            </Stack.Navigator>
        </Layout>
    );
};
