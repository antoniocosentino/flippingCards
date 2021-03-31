import { Layout, Text, Button } from '@ui-kitten/components';
import React, { useContext, useEffect, useState } from 'react';
import { AppContext, TCards, TSingleWord } from '../App';
import { styles, mainColor } from '../styles/styles';
import { Dimensions } from 'react-native';
import CharacterInput from 'react-native-character-input';
import { shuffle } from 'lodash';
import { getArticle } from '../utils/utils';

type TChallengeModePlaying = any;

type TProgressBar = {
    totalNumber: number;
    currentNumber: number;
};

const getWordToGuessAsArray = ( word: TSingleWord ): string[] => {

    const fullWord = `${ getArticle( word ) }${word.de}`;

    return fullWord.split( '' );
};

const getWordBinary = ( letterArray: ReadonlyArray<string> ): string => {

    const binaryArr = letterArray.map( ( thisLetter ) => {
        if ( thisLetter !== ' ' ) {
            return '1';
        } else {
            return '0';
        }
    } );

    return binaryArr.join( '' );
};

const getWordPlaceholder = ( letterArray: ReadonlyArray<string> ): string => {

    const placeholderArr = letterArray.map( () => ' ' );

    return placeholderArr.join( '' );
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
    const currentDeckCards = ( currentDeck?.cards || [] );

    const [ currentDeckCardsShuffled, setShuffledCards ] = useState( [] as TCards );

    useEffect( () => {
        setShuffledCards( shuffle( currentDeckCards ) );
    }, [ currentDeckCards ] );

    const [ currentCard, setCurrentCard ] = useState( 0 );

    const nextClick = () => {
        setCurrentCard( currentCard + 1 );
    };

    const [ typedWord, setTypedWord ] = useState( [] as ReadonlyArray<string> );
    const currentWord = currentDeckCardsShuffled[ currentCard ];

    if ( !currentWord ) {
        return null;
    }

    const wordToGuessAsArray = getWordToGuessAsArray( currentWord );
    console.log("🍌: ChallengeModePlaying -> wordToGuessAsArray", wordToGuessAsArray)
    const wordBinary = getWordBinary( wordToGuessAsArray );
    const placeHolder = getWordPlaceholder( wordToGuessAsArray );

    return (
        <Layout style={ styles['centeredElement--mediumHorizontalPadding'] }>

            <ProgressBar
                totalNumber={ currentDeckCards.length || 0 }
                currentNumber={ currentCard }
            />

            <Layout style={ styles.verticalSpacer } />

            <Layout>
                <Text style={ [ styles.text, styles.verySmallText] } >{ currentCard + 1 }/{ currentDeckCardsShuffled.length || 0 }</Text>
                <Text style={ [ styles.text, styles.veryBigText, styles.boldText ] } >{ currentDeckCardsShuffled[ currentCard ].en  }</Text>
                <Text>{ '\n' }</Text>
                <Text style={ [ styles.text, styles.verySmallText, styles.lightText ] } >Type it in German (article included):</Text>

                <CharacterInput
                    placeHolder={ placeHolder }
                    showCharBinary={ wordBinary }
                    handleChange={ ( value: ReadonlyArray<string> ) => setTypedWord( value ) }
                />

                <Layout style={ styles.verticalSpacer } />

                <Button onPress={ nextClick } style={ [ styles.ctaButton, styles[ 'ctaButton--smallWidth' ] ] }>
                        Next
                </Button>
            </Layout>
        </Layout>
    );
};
