import React, { useContext } from 'react';

import { Card, Icon, IconProps, Layout, Text } from '@ui-kitten/components';
import { styles } from '../styles/styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomMenu } from './BottomMenu';
import { AppContext, TDeck } from '../App';
import { FlatList } from 'react-native-gesture-handler';
import Pie from 'react-native-pie';
import { ListRenderItemInfo } from 'react-native';

type TWrappedDeck = ListRenderItemInfo<TDeck>

export const PlayIcon = ( props: IconProps ) => (
    <Icon { ...props } width={ 24 } height={ 24 } fill='#fff' name={ 'chevron-right-outline' } />
);

const getDeckPercentage = ( deck: TDeck ): number => {
    const masteredWords = deck.cards.filter( ( card ) => card.mastered === true );
    return Math.round( ( masteredWords.length * 100 ) / deck.cards.length );
};

export const ChallengeMode = () => {

    const appData = useContext( AppContext );
    const { decksData } = appData;

    return (
        <Layout style={ styles.megaWrap } >
            <SafeAreaView style={ styles.mainViewWrapper }>
                <Layout style={ styles['centeredElement--lessHorizontalPadding'] }>
                    <Text>{ '\n' }</Text>
                    <Text style={ [ styles.text, styles.titleText ] } category='h4'>Challenge mode</Text>
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
                </Layout>
            </SafeAreaView>
            <BottomMenu />
        </Layout>
    );
};
