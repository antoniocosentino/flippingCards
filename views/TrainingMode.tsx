import React, { useContext } from 'react';
import { Text, Layout, Card } from '@ui-kitten/components';
import { styles } from './../styles/styles';
import { AppContext, TWords, TWordsWallet } from '../App';
import AsyncStorage from '@react-native-community/async-storage';
import { getShuffledCards, TWordsFreshnessValues } from '../utils/utils';
import { TransitionPresets } from '@react-navigation/stack';

import { createStackNavigator } from '@react-navigation/stack';

import { Cards } from './Cards';
import { chunk } from 'lodash';
import { DeckAddEdit } from './DeckAddEdit';

type TTrainingModeInstructionsProps = {
    navigation: any; // TODO: I don't know the type of this
    route: any; // TODO: same.
}

const TrainingModeInstructions = ( props: TTrainingModeInstructionsProps ) => {

    const { navigation } = props;

    const appData = useContext( AppContext );
    const { decksData } = appData;

    const chunkedDecks = chunk( decksData, 3 );

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
                                        onPress={ () => navigation.navigate( 'training-mode_new-deck' ) }
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
                                />
                            );
                        }
                    }
                </Stack.Screen>

                <Stack.Screen
                    name='training-mode_new-deck'
                    options={ {
                        headerShown: true,
                        title: '',
                        animationEnabled: true,
                        headerStyle: {
                            shadowColor: 'transparent',
                            elevation: 0
                        },
                        ...TransitionPresets.ModalSlideFromBottomIOS
                    } }
                >
                    {
                        ( props ) => {
                            return (
                                <DeckAddEdit
                                    { ...props }
                                />
                            );
                        }
                    }
                </Stack.Screen>

            </Stack.Navigator>
        </Layout>
    );
};
