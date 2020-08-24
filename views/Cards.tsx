import React, { useRef, useState } from 'react';
import { Text, Card } from '@ui-kitten/components';
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

export const Cards = ( props: TCardsProps ) => {

    const carouselRef = useRef( null );

    const { shuffled } = props;

    const [ showInstructions, setShowInstructions ] = useState( true );


    const onCarouselScroll = () => {
        if ( showInstructions ) {
            setShowInstructions( false );
        }
    };

    const onSnap = ( index: number ) => {
        if ( index === 0 ) {
            setShowInstructions( true );
        }
    };

    return (
        <View
            style={ styles.sliderWrapper }
        >
            { showInstructions &&
                <Card
                    style={ styles.instructions }
                >
                    <Text>
                        Swipe up to scroll through the cards.
                        Tap card to flip it.
                    </Text>
                </Card>
            }

            <Carousel
                ref={ carouselRef }
                data={ shuffled }
                sliderHeight={ 740 }
                itemHeight={ 400 }
                vertical={ true }
                layout={ 'default' }
                loop={ false }
                renderItem={ renderCard }
                onScroll={ onCarouselScroll }
                onSnapToItem={ onSnap }
            />
        </View>
    );
};
