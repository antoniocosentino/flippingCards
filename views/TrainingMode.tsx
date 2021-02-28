import React, { useContext } from 'react';
import { Text, Layout, Card } from '@ui-kitten/components';
import { styles } from './../styles/styles';
import { AppContext } from '../App';
import { TransitionPresets } from '@react-navigation/stack';

import { createStackNavigator } from '@react-navigation/stack';

import { Cards } from './Cards';
import { chunk } from 'lodash';
import { DeckAddEdit } from './DeckAddEdit';
import { SvgXml } from 'react-native-svg';
import { editSvgBase, getCustomSvg } from '../utils/customIcons';
import { TouchableOpacity, ActionSheetIOS, GestureResponderEvent } from 'react-native';

type TTrainingModeInstructionsProps = {
    navigation: any; // TODO: I don't know the type of this
    route: any; // TODO: same.
}

const EditButton = () => {
    return (
        <SvgXml
            style={ styles.editButtonSvg }
            width='18'
            height='18'
            xml={ getCustomSvg( editSvgBase, '#FFFFFF' ) }
        />
    );
};

const TrainingModeInstructions = ( props: TTrainingModeInstructionsProps ) => {

    const { navigation } = props;

    const appData = useContext( AppContext );
    const { decksData, removeSingleDeck } = appData;

    const chunkedDecks = chunk( decksData, 3 );

    const editClick = ( deckKey: number, event: GestureResponderEvent ) => {

        event.stopPropagation();

        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: ['Cancel', 'Edit Deck', 'Delete Deck'],
                destructiveButtonIndex: 2,
                cancelButtonIndex: 0
            },
            buttonIndex => {
                if ( buttonIndex === 1 ) {
                    navigation.navigate( 'training-mode_new-deck', { deckKey, editMode: true } );
                }
                if ( buttonIndex === 2 ) {
                    console.log( 'delete logic here, deck:', deckKey );
                    removeSingleDeck( deckKey );
                }
            }
        );
    };

    const cardClick = ( deckKey: number ) => {
        navigation.navigate( 'training-mode_cards', { deckKey } );
    };

    return (
        <Layout style={ styles.instructions }>


            <Text style={ [ styles.text, styles.titleText ] } category='h4'>Training mode</Text>

            <Text style={ styles.verySmallText }>{ '\n' }</Text>

            <Text style={ [ styles.text, styles.boldText, styles.smallerText, styles.leftAlignedText ] }>YOUR DECKS</Text>

            { chunkedDecks.map( ( singleRow, rowKey ) => {

                return (
                    <Layout key={ rowKey } style={ styles.decksWrapper }>
                        { singleRow.map( ( singleDeck, colNumber ) => {

                            // deck key is calculated based on row and column
                            const deckKey = ( rowKey * 3 ) + colNumber;

                            if ( singleDeck.name === '__ADD_PLACEHOLDER__' ) {

                                return (
                                    <Card
                                        onPress={ () => navigation.navigate( 'training-mode_new-deck' ) }
                                        style={ [
                                            styles.singleDeck,
                                            styles.addDeck,
                                            ( colNumber === 0 || colNumber === 2 ) && styles['singleDeck--noMargin']
                                        ] }
                                        key={ -1 }
                                    >
                                        <Text style={ styles.addDeckPlus }>+</Text>
                                    </Card>
                                );
                            }

                            return (
                                <Card
                                    onPress={ () => cardClick( deckKey ) }
                                    style={ [
                                        styles.singleDeck,
                                        ( colNumber === 0 || colNumber === 2 ) && styles['singleDeck--noMargin']
                                    ] }
                                    key={ deckKey }
                                >
                                    <TouchableOpacity
                                        onPress={ ( event ) => editClick( deckKey, event ) }
                                    >
                                        <EditButton />
                                    </TouchableOpacity>
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
