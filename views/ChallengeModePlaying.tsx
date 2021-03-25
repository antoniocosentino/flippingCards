import { Layout, Text, Button } from '@ui-kitten/components';
import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import { styles, mainColor } from '../styles/styles';
import { Dimensions } from 'react-native';

type TChallengeModePlaying = any;

type TProgressBar = {
    totalNumber: number;
    currentNumber: number;
};

const ProgressBar = ( props: TProgressBar ) => {

    const { totalNumber, currentNumber  } = props;

    const fullBarWidth = Dimensions.get( 'window' ).width * 0.92;

    const singleBarWidth = ( fullBarWidth / totalNumber ) - 3;

    return (
        <Layout style={ styles.progressBarWrapper } >
            { [...Array( totalNumber )].map( ( element, index ) => {

                return (
                    <Layout
                        key={ index }
                        style={
                            // eslint-disable-next-line react-native/no-inline-styles
                            {
                                width: singleBarWidth,
                                height: 3,
                                backgroundColor: index > currentNumber ? '#ddd' : mainColor,
                                borderRadius: 6
                            }
                        }
                    />
                );
            } ) }
        </Layout>
    );
};


export const ChallengeModePlaying = ( props: TChallengeModePlaying ) => {

    const { deckKey } = props.route?.params;

    const appData = useContext( AppContext );
    const { decksData } = appData;

    const currentDeck = decksData.find( ( deck ) => deck.id === deckKey );

    const [ currentCard, setCurrentCard ] = useState( 0 );

    const nextClick = () => {
        setCurrentCard( currentCard + 1 );
    };

    return (
        <Layout style={ styles['centeredElement--mediumHorizontalPadding'] }>

            <ProgressBar
                totalNumber={ currentDeck?.cards.length || 0 }
                currentNumber={ currentCard }
            />

            <Layout style={ styles.verticalSpacer } />

            <Layout>
                <Text style={ [ styles.text, styles.verySmallText] } >{ currentCard + 1 }/{ currentDeck?.cards.length || 0 }</Text>
                <Text style={ [ styles.text, styles.veryBigText, styles.boldText ] } >{ currentDeck?.cards?.[ currentCard ].en  }</Text>
                <Text>{ '\n' }</Text>
                <Text style={ [ styles.text, styles.verySmallText, styles.lightText ] } >Type it in German:</Text>
                <Text style={ [ styles.text, styles.centeredText, styles.veryBigText ] }>_ _ _ _ _ _</Text>

                <Layout style={ styles.verticalSpacer } />

                <Button onPress={ nextClick } style={ [ styles.ctaButton, styles[ 'ctaButton--smallWidth' ] ] }>
                        Next
                </Button>
            </Layout>
        </Layout>
    );
};
