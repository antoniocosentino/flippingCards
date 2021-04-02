import { Layout, Text, Button } from '@ui-kitten/components';
import React, { useContext, useEffect, useState } from 'react';
import { AppContext, TCards, TSingleWord } from '../App';
import { styles, mainColor } from '../styles/styles';
import { Dimensions } from 'react-native';
import { shuffle } from 'lodash';
import { getArticle } from '../utils/utils';
import { IndividualCharsInput } from './../components/IndividualCharsInput';

type TChallengeModePlaying = {
    route: any; // TODO: can this be better typed?
}

type TProgressBar = {
    totalNumber: number;
    currentNumber: number;
};

type TWordRenderer = {
    currentWord: TSingleWord;
    nextClick: ( wordToGuess: string, typedWord: string ) => void
}

type TInputContent = {
    wordArray: ReadonlyArray<string | false>,
    wordString: string
};

type TViewTypes = 'WORDGUESS' | 'CORRECT' | 'WRONG';

const getFullWordString = ( word: TSingleWord ): string => {
    return `${ getArticle( word ) }${word.de}`;
};

const getWordToGuessAsArray = ( word: TSingleWord ): string[] => {
    const fullWord = getFullWordString( word );
    return fullWord.split( '' );
};

const getWordStructure = ( letterArray: ReadonlyArray<string> ): ReadonlyArray<boolean> => {

    const binaryArr = letterArray.map( ( thisLetter ) => {
        if ( thisLetter !== ' ' ) {
            return true;
        } else {
            return false;
        }
    } );

    return binaryArr;
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

const WordRenderer = ( props: TWordRenderer  ) => {
    const { currentWord, nextClick  } = props;

    const wordToGuessAsArray = getWordToGuessAsArray( currentWord );

    const wordStructure = getWordStructure( wordToGuessAsArray );

    const [ typedWord, setTypedWord ] = useState( {} as TInputContent );

    const isButtonEnabled = getFullWordString( currentWord ).length === typedWord?.wordString?.length;

    return (
        <>
            <Text style={ [ styles.text, styles.veryBigText, styles.boldText ] } >{ currentWord.en  }</Text>
            <Text>{ '\n' }</Text>
            <Text style={ [ styles.text, styles.verySmallText, styles.lightText ] }>Type it in German (article included):</Text>
            <Text style={ [ styles.verySmallText ] }>{ '\n' }</Text>

            <IndividualCharsInput
                wordStructure={ wordStructure }
                key={ currentWord.de }
                maxBoxesPerLine={ 16 }
                onChange={ setTypedWord }
            />

            <Layout style={ styles.verticalSpacer } />

            <Button
                onPress={ isButtonEnabled ? () => nextClick( getFullWordString( currentWord ), typedWord.wordString ) : undefined }
                style={ [
                    styles.ctaButton,
                    styles[ 'ctaButton--smallWidth'],
                    !isButtonEnabled && styles['createDeckCtaButton--Disabled']
                ] }>
                Next
            </Button>
        </>
    );
};


export const ChallengeModePlaying = ( props: TChallengeModePlaying ) => {

    const { deckKey } = props.route?.params;

    const appData = useContext( AppContext );
    const { decksData } = appData;

    const currentDeck = decksData.find( ( deck ) => deck.id === deckKey );
    const currentDeckCards = ( currentDeck?.cards || [] );

    const [ currentDeckCardsShuffled, setShuffledCards ] = useState( [] as TCards );

    const [ currentView, setCurrentView ] = useState( 'WORDGUESS' as TViewTypes );

    useEffect( () => {
        setShuffledCards( shuffle( currentDeckCards ) );
    }, [ currentDeckCards ] );

    useEffect( () => {
        if ( currentView !== 'WORDGUESS' ) {
            setTimeout( () => {
                setCurrentView( 'WORDGUESS' );
            }, 1000 );
        }
    }, [ currentView ] );

    const [ currentCard, setCurrentCard ] = useState( 0 );

    const nextClick = ( wordToGuess: string, typedWord: string ) => {

        if ( wordToGuess.toUpperCase() === typedWord.toUpperCase() ) {
            setCurrentView( 'CORRECT' );
        }
        else {
            setCurrentView( 'WRONG' );
        }

        setCurrentCard( currentCard + 1 );
    };

    const currentWord = currentDeckCardsShuffled[ currentCard ];

    if ( !currentWord ) {
        return null;
    }

    if ( currentView !== 'WORDGUESS' ) {
        return (
            <Layout style={ styles['centeredElement--mediumHorizontalPadding'] }>
                <Layout
                    style={
                        {
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: 600
                        }
                    }
                >
                    <Text style={ [ styles.text, styles.veryBigText, styles.boldText ] } >{ currentView === 'CORRECT' ? 'Correct' : 'Wrong' }!</Text>
                    <Text style={ {
                        fontSize: 200
                    } }>
                        { currentView === 'CORRECT' ? '🎉' : '❌' }
                    </Text>
                </Layout>
            </Layout>
        );
    }

    return (
        <Layout style={ styles['centeredElement--mediumHorizontalPadding'] }>

            <ProgressBar
                totalNumber={ currentDeckCards.length || 0 }
                currentNumber={ currentCard }
            />

            <Layout style={ styles.verticalSpacer } />

            <Layout>
                <Text style={ [ styles.text, styles.verySmallText] } >{ currentCard + 1 }/{ currentDeckCardsShuffled.length || 0 }</Text>

                <WordRenderer
                    currentWord={ currentWord }
                    nextClick={ nextClick }
                />

            </Layout>
        </Layout>
    );
};