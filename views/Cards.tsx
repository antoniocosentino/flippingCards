import React, { useRef, Dispatch, SetStateAction, useContext } from 'react';
import { Text, Icon, Button, Layout, IconProps, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import { styles } from './../styles/styles';
import Carousel from 'react-native-snap-carousel';
import { TWordsWallet, AppContext } from '../App';

import { View } from 'react-native';
import FlipCard from 'react-native-flip-card';
import { getArticle } from '../utils/utils';

type TRenderCardProps = {
    item: any,
    index: number
};

type TCardsProps = {
    deck: TWordsWallet;
    cardsView: string,
    setCardsView: Dispatch<SetStateAction<string>>
    storeDeckData: ( value: TWordsWallet ) => void;
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

    const { deck, cardsView, setCardsView, storeDeckData } = props;

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

    const generateNewDeck = () => {
        storeDeckData( wordsWallet );
        setCardsView( 'cards' );
    };

    const deckButtonExtraProp = deck.length === 0;

    if ( cardsView === 'instructions' ) {
        return (
            <Layout level='1' style={ styles.instructions }>

                <Text style={ [ styles.text, styles.titleText ] } category='h4'>Cards view</Text>

                <Text style={ [ styles.text, styles.instructionsText ] }>
                    Cards view allows you to train your vocabulary. Just scroll through the cards, and tap a card to flip it and see the translation.
                </Text>

                <Text style={ [ styles.text, styles.instructionsText ] }>
                    A deck is randomly generated with words coming from your words wallet. You can customize the size of the deck in the Settings page.
                </Text>

                <Button disabled={ deckButtonExtraProp } onPress={ goToDeck } style={ styles.ctaButton } accessoryLeft={ CardsIcon }>
                    GO TO DECK
                </Button>

                <Button onPress={ generateNewDeck } style={ styles.ctaButton } accessoryLeft={ ShuffleIcon }>
                    GENERATE NEW DECK
                </Button>
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
            >
                <Carousel
                    ref={ carouselRef }
                    data={ deck }
                    sliderHeight={ 600 } // TODO: this needs to be dynamic
                    itemHeight={ 400 } // TODO: this needs to be dynamic
                    vertical={ true }
                    layout={ 'default' }
                    loop={ false }
                    renderItem={ renderCard }
                    firstItem={ 1 }
                />
            </View>
        </>
    );
};
