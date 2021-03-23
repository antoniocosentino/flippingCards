import React, { useContext } from 'react';

import { Card, Icon, IconProps, Layout, Text } from '@ui-kitten/components';
import { mainColor, styles } from '../styles/styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomMenu } from './BottomMenu';
import { AppContext, TDeck } from '../App';
import { FlatList } from 'react-native-gesture-handler';

type TWrappedDeck = {
    index: number;
    item: TDeck;
}

export const PlayIcon = ( props: IconProps ) => (
    <Icon { ...props } width={ 24 } height={ 24 } fill='#fff' name={ 'play-circle-outline' } />
);

export const ChallengeMode = () => {

    const appData = useContext( AppContext );
    const { decksData } = appData;

    return (
        <Layout style={ styles.megaWrap } >
            <SafeAreaView style={ styles.mainViewWrapper }>
                <Layout style={ styles['centeredElement--lessHorizontalPadding'] }>
                    <Text>{ '\n' }</Text>
                    <Text style={ [ styles.text, styles.titleText ] } category='h4'>Challenge mode</Text>
                    <Text style={ [ styles.text ] }>Select a deck and start the challenge</Text>
                    <FlatList
                        keyboardDismissMode={ 'on-drag' }
                        showsVerticalScrollIndicator={ false }
                        data={ decksData }
                        style={ [ styles.cardsScrollView, styles.inputExtraTopSpacing ] }
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
                                        style={ {
                                            display: 'flex',
                                            flexDirection: 'row'
                                        } }
                                    >
                                        <Layout
                                            style={ {
                                                flexBasis: '50%'
                                            } }
                                        >
                                            <Layout
                                                style={ {
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    backgroundColor: mainColor
                                                } }
                                            >
                                                <Text style={ [styles.text, styles.whiteText, styles.leftAlignedText ] }>
                                                    { deck.name  }
                                                </Text>
                                            </Layout>

                                            <Layout
                                                style={ {
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    backgroundColor: mainColor
                                                } }
                                            >
                                                <Text style={ [styles.text, styles.whiteText, styles.leftAlignedText, styles.smallerText ] }>
                                                    { `${ deck.cards.length } card${ deck.cards.length > 1 ? 's' : '' }` }
                                                </Text>
                                            </Layout>
                                        </Layout>

                                        <Layout
                                            style={ {
                                                flexBasis: '40%',
                                                backgroundColor: mainColor,
                                                justifyContent: 'center'
                                            } }
                                        >
                                            <Text style={ [styles.text, styles.whiteText, styles.leftAlignedText ] }>
                                                50%
                                            </Text>
                                        </Layout>

                                        <Layout
                                            style={ {
                                                flexBasis: '10%',
                                                backgroundColor: mainColor,
                                                justifyContent: 'center'
                                            } }
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
