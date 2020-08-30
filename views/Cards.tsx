import React, { useRef, useState } from 'react';
import { Text, Icon, Button, Layout, IconProps, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import { styles } from './../styles/styles';
import Carousel from 'react-native-snap-carousel';
import { TWordsWallet } from '../App';

import { View } from 'react-native';
import FlipCard from 'react-native-flip-card';
import { getArticle } from '../utils/utils';

type TRenderCardProps = {
    item: any,
    index: number
};

type TCardsProps = {
    shuffled: TWordsWallet;
}

const renderCard = ( props: TRenderCardProps ) => {
    const { item } = props;

    // const typeOfWord = getTypeOfWord( item );

    if ( item.de  === '___firstItem___' ) {
        return (
            <View style={ styles.cardFrontAndBack }>
                <Text style={ styles.slideText }>· Start ·</Text>
                <Text style={ [ styles.slideText, styles.firstSlideText ] }>This is the beginning of your deck.</Text>
                <Text style={ [ styles.slideText, styles.firstSlideText ] }>Scroll through the cards and tap to flip them.</Text>
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

                    <View style={ styles.cardFrontAndBack }>
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

    const [ viewMode, setMode ] = useState( 'instructions' );

    const { shuffled } = props;

    const goToDeck = () => {
        setMode( 'cards' );
    };

    const goToMainPage = () => {
        setMode( 'instructions' );
    };

    const BackIcon = ( backIconProps: IconProps ) => (
        <Icon { ...backIconProps } name='arrow-back'/>
    );

    const BackAction = () => (
        <TopNavigationAction onPress={ goToMainPage } icon={ BackIcon } />
    );

    if ( viewMode === 'instructions' ) {
        return (
            <Layout level='1' style={ styles.instructions }>

                <Text style={ [ styles.text, styles.titleText ] } category='h4'>Cards view</Text>

                <Text style={ [ styles.text, styles.instructionsText ] }>
                    Cards view allows you to train your vocabulary. Just scroll through the cards, and tap a card to flip it and see the translation.
                </Text>

                <Text style={ [ styles.text, styles.instructionsText ] }>
                    A deck is randomly generated with words coming from your words wallet. You can customize the size of the deck in the Settings page.
                </Text>

                <Button onPress={ goToDeck } style={ styles.ctaButton } accessoryLeft={ CardsIcon }>
                    GO TO DECK
                </Button>

                <Button style={ styles.ctaButton } accessoryLeft={ ShuffleIcon }>
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
                title='Back to deck configuration'
            />
            <View
                style={ styles.sliderWrapper }
            >
                <Carousel
                    ref={ carouselRef }
                    data={ shuffled }
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
