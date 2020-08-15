import React, { useRef, useState } from 'react';
import { Text } from '@ui-kitten/components';
import { styles } from './../styles/styles';
import Carousel from 'react-native-snap-carousel';

type TCardsProps = any; // TODO: types

import { View } from 'react-native';
import FlipCard from 'react-native-flip-card';

const carouselItems = [
    {
        de: 'das Deutsche wort - A',
        en: 'the English Word - A '
    },
    {
        de: 'das Deutsche wort - B',
        en: 'the English Word - B '
    },
    {
        de: 'das Deutsche wort - C',
        en: 'the English Word - C'
    }
];

type TRenderCardProps = {
    item: any,
    index: number
};

const renderCard = ( props: TRenderCardProps ) => {
    const { item, index } = props;

    return (
        <View style={ styles.singleSlide }>
            <View style={ styles.singleCardWrapper }>
                <FlipCard
                    style={ styles.singleCard }
                    flipHorizontal={ true }
                    flipVertical={ false }
                >
                    <View style={ styles.cardFront }>
                        <Text style={ styles.slideText }>{ item.en }</Text>
                    </View>

                    <View style={ styles.cardBack }>
                        <Text style={ styles.slideText }>{ item.de }</Text>
                    </View>
                </FlipCard>
            </View>
        </View>
    );
};

export const Cards = ( props: TCardsProps ) => {

    const carouselRef = useRef( null );

    const [ activeIndex, setActiveIndex ] = useState( 0 );

    return (
        <View
            style={ styles.sliderWrapper }
        >
            <Carousel
                ref={ carouselRef }
                data={ carouselItems }
                sliderHeight={ 500 }
                itemHeight={ 420 }
                vertical={ true }
                layout={ 'default' }
                loop={ true }
                renderItem={ renderCard }
                onSnapToItem = { index => setActiveIndex( index ) }
            />
        </View>
    );
};
