import { Layout, Text, Button } from '@ui-kitten/components';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { AppContext, TCards, TSingleWord } from '../App';
import { styles, mainColor } from '../styles/styles';
import { Dimensions } from 'react-native';
import * as Animatable from 'react-native-animatable';

import { shuffle } from 'lodash';
import { getArticle, getCapitalizedIfNeeded } from '../utils/utils';
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
    currentView: TViewTypes;
    nextClick: ( wordToGuess: string, typedWord: string ) => void
    continueClick: () => void
}

type TInputContent = {
    wordArray: ReadonlyArray<string | false>,
    wordString: string
};

type TViewTypes = 'WORDGUESS' | 'CORRECT' | 'WRONG';

const getFullWordString = ( word: TSingleWord ): string => {
    return `${ getArticle( word ) }${ getCapitalizedIfNeeded( word ) }`;
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
    const { currentWord, currentView, nextClick, continueClick } = props;

    const wordToGuessAsArray = getWordToGuessAsArray( currentWord );

    const wordStructure = getWordStructure( wordToGuessAsArray );

    const [ typedWord, setTypedWord ] = useState( {} as TInputContent );

    const isButtonEnabled = getFullWordString( currentWord ).length === typedWord?.wordString?.length;

    return (
        <>
            <Text
                style={ [
                    styles.text,
                    styles.veryBigText,styles.boldText
                ] }
            >
                { currentWord.en  }
            </Text>

            { currentView === 'WORDGUESS' &&
                <>
                    <Text>{ '\n' }</Text>
                    <Text style={ [ styles.text, styles.verySmallText, styles.lightText ] }>Type it in German (article included):</Text>
                    <Text style={ [ styles.verySmallText ] }>{ '\n' }</Text>

                    <IndividualCharsInput
                        wordStructure={ wordStructure }
                        key={ currentWord.de }
                        maxBoxesPerLine={ 13 }
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
                        Send
                    </Button>

                    <Text onPress={ continueClick } style={ [ styles.text, styles.smallerText, styles.linkText ] }>
                        Skip
                    </Text>
                </>
            }
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

    const [ lastUserTypedWord, setLastUserTypedWord ] = useState( '' );

    const emojiRef = useRef( null ) as any;

    useEffect( () => {
        setShuffledCards( shuffle( currentDeckCards ) );
    }, [ currentDeckCards ] );

    useEffect( () => {
        if ( currentView === 'CORRECT' ) {
            emojiRef?.current?.tada( 1200 );
        }
        if ( currentView === 'WRONG' ) {
            emojiRef?.current?.shake( 1200 );
        }
    }, [ currentView, emojiRef ] );

    const [ currentCard, setCurrentCard ] = useState( 0 );

    const nextClick = ( wordToGuess: string, typedWord: string ) => {

        if ( wordToGuess.toUpperCase() === typedWord.toUpperCase() ) {
            setCurrentView( 'CORRECT' );
        }
        else {
            setCurrentView( 'WRONG' );
            setLastUserTypedWord( typedWord );
        }
    };

    const continueClick = () => {
        setCurrentView( 'WORDGUESS' );
        setCurrentCard( currentCard + 1 );
    };

    const currentWord = currentDeckCardsShuffled[ currentCard ];

    if ( !currentWord ) {
        return null;
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
                    continueClick={ continueClick }
                    currentView={ currentView }
                />

                { currentView !== 'WORDGUESS' &&
                    <>
                        <Text>{ '\n' }</Text>
                        <Animatable.Text ref={ emojiRef } style={ styles.bigEmoji }>{ currentView === 'CORRECT' ? '🎉' : '❌' }</Animatable.Text>
                        <Text>{ '\n' }</Text>

                        { currentView === 'WRONG' &&
                            <Text
                                style={ [
                                    styles.text,
                                    styles.smallerText,
                                    styles.strikedText
                                ] }
                            >
                                { lastUserTypedWord.toLowerCase() }
                            </Text>
                        }

                        <Text
                            style={ [
                                styles.text,
                                styles.veryBigText,
                                styles.greenText
                            ] }
                        >
                            { getFullWordString( currentWord ) }
                        </Text>

                        <Text>{ '\n' }</Text>
                        <Button
                            onPress={ continueClick }
                            style={ [
                                styles.ctaButton,
                                styles[ 'ctaButton--smallWidth']
                            ] }>
                            Continue
                        </Button>
                    </>
                }

            </Layout>
        </Layout>
    );
};
