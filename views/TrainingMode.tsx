import React, { useContext } from 'react';
import { Text, Icon, Button, IndexPath, Layout, IconProps, Divider, Select, SelectItem, Modal, Card } from '@ui-kitten/components';
import { styles } from './../styles/styles';
import { AppContext, TWords, TWordsWallet } from '../App';
import AsyncStorage from '@react-native-community/async-storage';
import { DECK_SIZE_DATA, getShuffledCards, TWordsFreshnessValues, WORDS_FRESHNESS_DATA } from '../utils/utils';

import { createStackNavigator } from '@react-navigation/stack';

import { AddWordIcon } from '../App';
import { Cards } from './Cards';

type TTrainingModeInstructionsProps = {
    wordsWallet: TWordsWallet;
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

const TrainingModeInstructions = ( props: TTrainingModeInstructionsProps ) => {

    const { wordsWallet, deck, storeDeckData, navigation } = props;
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
                // TODO: navigation
            } else {
                setModalVisible( true );
            }
        } );
    };

    return (
        <Layout style={ styles.instructions }>

            <Text style={ [ styles.text, styles.titleText ] } category='h4'>Training mode</Text>

            <Text style={ [ styles.text, styles.instructionsText ] }>
                Training mode allows you to train your vocabulary by swiping cards and flipping them to check the correct translation.
                { '\n' } { '\n' }
                A card deck is randomly generated with words coming from your words wallet.
            </Text>

            { wordsWallet.length === 0 &&
                <>
                    <Text style={ [ styles.text, styles.instructionsText ] }>
                        To start, you first need to add some words into your wallet.
                    </Text>

                    { /* TODO: implement navigation here */ }
                    <Button onPress={ undefined } style={ styles.ctaButton } accessoryLeft={ AddWordIcon }>
                        ADD YOUR FIRST WORD
                    </Button>
                </>
            }

            { deck.length > 1 &&
                <>
                    { /* TODO: implement navigation here */ }
                    <Button onPress={ () => navigation.navigate( 'training-mode_cards' ) } style={ styles.ctaButton } accessoryLeft={ CardsIcon }>
                        GO TO EXISTING DECK
                    </Button>

                    <Divider style={ styles.commonDivider } />
                </>
            }
            { wordsWallet.length > 0 &&
                <>
                    <Text style={ [ styles.text, styles.sectionLabel ] } category='label'>DECK SETTINGS</Text>

                    <Layout style={ styles.rowContainer } level='1'>

                        <Text style={ styles.labelText }>Max n. of cards:</Text>

                        <Select
                            style={ [ styles.select, styles.smallSelect ] }
                            value={ displayDeckSizeValue }
                            selectedIndex={ selectedDeckSizeIndex }
                            onSelect={ index => setSelectedDeckSizeIndex( index as any ) }
                        >
                            { DECK_SIZE_DATA.map( ( title, k ) => renderSizeOption( title, k ) ) }
                        </Select>

                    </Layout>

                    <Layout style={ styles.rowContainer } level='1'>

                        <Text style={ styles.labelText }>Words Freshness:</Text>

                        <Select
                            style={ [ styles.select, styles.smallSelect ] }
                            value={ displayWordsFreshnessValue }
                            selectedIndex={ selectedWordsFreshnessIndex }
                            onSelect={ index => setSelectedWordsFreshnessIndex( index as any ) }
                        >
                            { WORDS_FRESHNESS_DATA.map( ( title, k ) => renderSizeOption( title, k ) ) }
                        </Select>

                    </Layout>

                    <Modal
                        visible={ modalVisible }
                        style={ styles.standardModal }
                        backdropStyle={ styles.standardModalBackdrop }
                    >
                        <Card disabled={ true }>
                            <Text style={ styles.text }>
                                { '\n' }
                                The card deck can't be created.
                                { '\n' }{ '\n' }
                                Make sure that your wallet contains words in the selected period of time.
                                { '\n' }{ '\n' }
                            </Text>
                            <Button onPress={ () => setModalVisible( false ) }>
                                OK
                            </Button>
                        </Card>
                    </Modal>


                    <Button onPress={ () => generateNewDeck( parseInt( DECK_SIZE_DATA[ selectedDeckSizeIndex.row ], 10 ), WORDS_FRESHNESS_DATA[ selectedWordsFreshnessIndex.row ] ) } style={ styles.ctaButton } accessoryLeft={ ShuffleIcon }>
                        GENERATE NEW DECK
                    </Button>
                </>
            }
        </Layout>
    );
};

const Stack = createStackNavigator();

export const TrainingMode = () => {

    const [ deck, setDeck ] = React.useState( [] as TWords );
    const [ isDeckDataUpdated, setDeckDataUpdated ] = React.useState( false );

    const appData = useContext( AppContext );
    const { wordsWallet } = appData;

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
                                    wordsWallet={ wordsWallet }
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
