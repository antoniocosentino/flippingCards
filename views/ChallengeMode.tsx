import React, { useContext } from 'react';

import { Button, Card, Icon, IconProps, Layout, Text } from '@ui-kitten/components';
import { mainColor, styles } from '../styles/styles';
import { BottomMenu } from './BottomMenu';
import { AppContext, TDeck } from '../App';
import { FlatList } from 'react-native-gesture-handler';
import Pie from 'react-native-pie';
import { ListRenderItemInfo } from 'react-native';
import { createStackNavigator, HeaderBackButton } from '@react-navigation/stack';
import { ChallengeModePlaying } from './ChallengeModePlaying';

type TWrappedDeck = ListRenderItemInfo<TDeck>

export const PlayIcon = ( props: IconProps ) => (
    <Icon { ...props } width={ 24 } height={ 24 } fill='#fff' name={ 'chevron-right-outline' } />
);

const renderCloseIcon = () => {
    return (
        <Icon
            style={ styles.challengeModeCloseButton }
            width={ 22 }
            height={ 22 }
            fill={ mainColor }
            name={ 'close-circle' }
        />
    );
};

export const getDeckPercentage = ( deck: TDeck ): number => {
    const masteredWords = deck.cards.filter( ( card ) => card.mastered === true );
    return Math.round( ( masteredWords.length * 100 ) / deck.cards.length );
};


type TChallengeModeMainScreen = {
    navigation: any; // TODO: I don't know the type of this
    route: any; // TODO: same.
}

export const ChallengeModeMainScreen = ( props: TChallengeModeMainScreen ) => {

    const appData = useContext( AppContext );
    const { decksData, onMenuClick } = appData;
    const { navigation } = props;

    const playClick = ( deckKey: number ) => {
        navigation.navigate( 'challenge-mode_playing', { deckKey } );
    };

    return (
        <Layout style={ styles.megaWrap } >
            <Layout style={ styles['centeredElement--lessHorizontalPadding'] }>
                <Text style={ [ styles.text, styles.titleText ] } category='h4'>Challenge mode</Text>
                { decksData.length <= 1 &&
                    <Layout style={ styles.centeredElement }>
                        <Text style={ [ styles.text, styles.smallerText, styles.lightText ] } >
                            In this area you will be able to test your knowledge on words coming from your decks.
                            Start by creating a deck in the Training Mode view and then come back 🙂
                        </Text>
                        <Layout style={ styles.walletInstructions }>
                            <Button onPress={ () => { onMenuClick( 1 ); } } style={ styles.ctaButton }>
                                GO TO TRANING MODE
                            </Button>
                        </Layout>
                    </Layout>
                }

                { decksData.length > 1 &&
                    <>
                        <Text style={ [ styles.text, styles.smallerText ] }>Select a deck and start the challenge</Text>
                        <FlatList
                            keyboardDismissMode={ 'on-drag' }
                            showsVerticalScrollIndicator={ false }
                            data={ decksData }
                            style={ [ styles.cardsScrollView, styles.inputExtraTopSpacing ] }
                            keyExtractor={ deck => deck.id.toString() }
                            renderItem={ ( data: TWrappedDeck ) => {

                                const { item: deck } = data;

                                if ( deck.name === '__ADD_PLACEHOLDER__' ) {
                                    return null;
                                }

                                return (
                                    <Card
                                        style={ styles.wordCard }
                                        onPress={ () => playClick( deck.id ) }
                                    >
                                        <Layout
                                            style={ styles.challengeModeCardWrapper }
                                        >
                                            <Layout
                                                style={ styles.challengeModeCardLeftZone }
                                            >
                                                <Layout
                                                    style={ styles.challengeModeCardLeftZoneTop  }
                                                >
                                                    <Text style={ [styles.text, styles.whiteText, styles.leftAlignedText ] }>
                                                        { deck.name  }
                                                    </Text>
                                                </Layout>

                                                <Layout
                                                    style={ styles.challengeModeCardLeftZoneBottom }
                                                >
                                                    <Text style={ [styles.text, styles.whiteText, styles.leftAlignedText, styles.smallerText ] }>
                                                        { `${ deck.cards.length } card${ deck.cards.length > 1 ? 's' : '' }` }
                                                    </Text>
                                                </Layout>
                                            </Layout>

                                            <Layout
                                                style={ styles.challengeModeCardCenterZone }
                                            >
                                                <Pie
                                                    radius={ 24 }
                                                    innerRadius={ 18 }
                                                    sections={ [
                                                        {
                                                            percentage: getDeckPercentage( deck ),
                                                            color: '#FFF'
                                                        }
                                                    ] }
                                                    backgroundColor='#DC9CAE'
                                                />

                                                <Text style={ [styles.text, styles.whiteText, styles.verySmallText, styles.challengeModeCardPercentageText ] }>
                                                    { `${getDeckPercentage( deck )}%` }
                                                </Text>

                                            </Layout>

                                            <Layout
                                                style={ styles.challengeModeCardRightZone }
                                            >
                                                <PlayIcon />
                                            </Layout>
                                        </Layout>
                                    </Card>
                                ); } }
                        />
                    </>
                }
            </Layout>
            <BottomMenu />
        </Layout>
    );
};

const Stack = createStackNavigator();

type TNavigationOptionsProps = {
    navigation: any; // TODO: better type?
}

const navigationOptions = ( props: TNavigationOptionsProps  ) => {

    const { navigation } = props;

    return {
        title: '',
        animationEnabled: true,
        headerLeft: () => (
            <></> // this is just a workaround to show nothing
        ),
        headerRight: () => {

            return (
                <HeaderBackButton
                    labelVisible={ false }
                    backImage={ renderCloseIcon }
                    onPress={ () => navigation.goBack() }
                />
            );
        },
        headerBackTitleVisible: false,
        headerStyle: {
            shadowColor: 'transparent',
            elevation: 0
        }
    };
};

export const ChallengeMode = () => {

    return (
        <Layout style={ styles.stackNavigatorWrapper } >
            <Stack.Navigator
                screenOptions={ {
                    cardStyle: { backgroundColor: '#fff' }
                } }
            >
                <Stack.Screen
                    name='challenge-mode_mainScreen'
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
                                <ChallengeModeMainScreen
                                    { ...props }
                                />
                            );
                        }
                    }
                </Stack.Screen>

                <Stack.Screen
                    name='challenge-mode_playing'
                    options={ navigationOptions }
                >
                    {
                        ( props ) => {
                            return (
                                <ChallengeModePlaying
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

