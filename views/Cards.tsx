import React, { useRef, Dispatch, SetStateAction, useContext, useState } from 'react';
import { Text, Icon, Button, IndexPath, Layout, IconProps, TopNavigation, TopNavigationAction, Divider, Select, SelectItem } from '@ui-kitten/components';
import { styles } from './../styles/styles';
import Carousel from 'react-native-snap-carousel';
import { AppContext, TWords, TWordsWallet } from '../App';

import { View } from 'react-native';
import FlipCard from 'react-native-flip-card';
import { DECK_SIZE_DATA, getArticle, TWordsFreshnessValues, WORDS_FRESHNESS_DATA } from '../utils/utils';

import { AddWordIcon } from '../App';

type TRenderCardProps = {
    item: any,
    index: number
};

type TCardsProps = {
    deck: TWords;
    cardsView: string,
    setView: Dispatch<SetStateAction<string>>
    setCardsView: Dispatch<SetStateAction<string>>
    storeDeckData: ( value: TWordsWallet, nOfCards: number, wordsFreshness: TWordsFreshnessValues ) => void;
}

const renderCard = ( props: TRenderCardProps ) => {
    const { item } = props;

    // const typeOfWord = getTypeOfWord( item );

    if ( item.de  === '___firstItem___' ) {
        return (
            <View style={ styles.cardFrontAndBack }>
                <Text style={ styles.whiteText } category='s1'>START</Text>
                <Text style={ [ styles.slideText, styles.firstSlideText ] }>This is the beginning of your deck.</Text>
                <Text style={ [ styles.slideText, styles.firstSlideText ] }>Scroll through the cards and tap to flip them.</Text>
                <View style={ styles.centeredView }>
                    <Icon
                        fill='#fff'
                        name='arrow-downward-outline'
                        style={ styles.icon }
                    />
                </View>
            </View>
        );
    }


    return (
        <View style={ styles.singleSlide }>
            <View style={ styles.singleCardWrapper }>
                <FlipCard
                    style={ styles.singleCard }
                    flipHorizontal={ true }
                    flipVertical={ false }
                >
                    <View style={ styles.cardFrontAndBack }>
                        <Text style={ styles.slideText }>{ item.en }</Text>
                    </View>

                    <View style={ [ styles.cardFrontAndBack, styles.cardBack ] }>
                        <Text style={ styles.slideText }>{ getArticle( item ) } { item.de }</Text>
                    </View>
                </FlipCard>
            </View>
        </View>
    );
};

const CardsIcon = ( props: IconProps ) => (
    <Icon { ...props } name='grid-outline' />
);

const ShuffleIcon = ( props: IconProps ) => (
    <Icon { ...props } name='shuffle-2-outline' />
);

export const Cards = ( props: TCardsProps ) => {

    const carouselRef = useRef( null );

    const { deck, cardsView, setView, setCardsView, storeDeckData } = props;

    const goToDeck = () => {
        setCardsView( 'cards' );
    };

    const goToMainPage = () => {
        setCardsView( 'instructions' );
    };

    const BackIcon = ( backIconProps: IconProps ) => (
        <Icon { ...backIconProps } name='arrow-back'/>
    );

    const BackAction = () => (
        <TopNavigationAction onPress={ goToMainPage } icon={ BackIcon } />
    );

    const appData = useContext( AppContext );
    const { wordsWallet } = appData;

    const generateNewDeck = ( nOfCards: number, wordsFreshness: TWordsFreshnessValues ) => {
        storeDeckData( wordsWallet, nOfCards, wordsFreshness );
        setCardsView( 'cards' );
    };

    const [selectedDeckSizeIndex, setSelectedDeckSizeIndex] = React.useState( new IndexPath( 1 ) );
    const displayDeckSizeValue = DECK_SIZE_DATA[selectedDeckSizeIndex.row];

    const [selectedWordsFreshnessIndex, setSelectedWordsFreshnessIndex] = React.useState( new IndexPath( 0 ) );
    const displayWordsFreshnessValue = WORDS_FRESHNESS_DATA[selectedWordsFreshnessIndex.row];

    const renderSizeOption = ( title: string, index: number ) => (
        <SelectItem key={ index } title={ title }/>
    );


    const [ cardWrapperDimensions, setCardWrapperDimensions ] = useState( { width: 0, height: 0 } );

    if ( cardsView === 'instructions' ) {
        return (
            <Layout level='1' style={ styles.instructions }>

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

                        <Button onPress={ () => setView( 'ADD' ) } style={ styles.ctaButton } accessoryLeft={ AddWordIcon }>
                            ADD YOUR FIRST WORD
                        </Button>
                    </>
                }

                { deck.length > 1 &&
                    <>
                        <Button onPress={ goToDeck } style={ styles.ctaButton } accessoryLeft={ CardsIcon }>
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


                        <Button onPress={ () => generateNewDeck( parseInt( DECK_SIZE_DATA[ selectedDeckSizeIndex.row ], 10 ), WORDS_FRESHNESS_DATA[ selectedWordsFreshnessIndex.row ] ) } style={ styles.ctaButton } accessoryLeft={ ShuffleIcon }>
                            GENERATE NEW DECK
                        </Button>
                    </>
                }
            </Layout>
        );
    }

    return (
        <>
            <TopNavigation
                style={ styles.cardsTopNav }
                accessoryLeft={ BackAction }
                title='Deck Info'
            />
            <View
                style={ styles.sliderWrapper }
                onLayout={ ( event ) => {
                    const { height, width } = event.nativeEvent.layout;
                    setCardWrapperDimensions( { width, height } );
                } }
            >
                { cardWrapperDimensions.height > 0 &&
                    <Carousel
                        ref={ carouselRef }
                        data={ deck }
                        sliderHeight={ cardWrapperDimensions.height }
                        itemHeight={ cardWrapperDimensions.height * ( 1 - 0.35 ) }
                        vertical={ true }
                        layout={ 'default' }
                        loop={ false }
                        renderItem={ renderCard }
                        firstItem={ 1 }
                    />
                }
            </View>
        </>
    );
};
