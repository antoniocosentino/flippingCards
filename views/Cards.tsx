import React, { useRef, useContext } from 'react';
import { Text } from '@ui-kitten/components';
import { styles } from './../styles/styles';
import Carousel from 'react-native-snap-carousel';
import { AppContext } from '../App';

import { View } from 'react-native';
import FlipCard from 'react-native-flip-card';
import { getTypeOfWord, getArticle } from '../utils/utils';

type TRenderCardProps = {
    item: any,
    index: number
};

const renderCard = ( props: TRenderCardProps ) => {
    const { item } = props;

    const typeOfWord = getTypeOfWord( item );

    return (
        <View style={ styles.singleSlide }>
            <View style={ styles.singleCardWrapper }>
                <FlipCard
                    style={ styles.singleCard }
                    flipHorizontal={ true }
                    flipVertical={ false }
                >
                    <View style={
                        [ styles.cardFrontAndBack, styles[ typeOfWord.class ] ]
                    }>
                        <Text style={ styles.slideText }>{ item.en }</Text>
                    </View>

                    <View style={
                        [ styles.cardFrontAndBack, styles[ typeOfWord.class ] ]
                    }>
                        <Text style={ styles.slideText }>{ getArticle( item ) } { item.de }</Text>
                    </View>
                </FlipCard>
            </View>
        </View>
    );
};

export const Cards = () => {

    const carouselRef = useRef( null );

    const appData = useContext( AppContext );

    const { wordsWallet } = appData;

    const shuffled = wordsWallet
        .map( ( a ) => ( { sort: Math.random(), value: a } ) )
        .sort( ( a, b ) => a.sort - b.sort )
        .map( ( a ) => a.value );


    return (
        <View
            style={ styles.sliderWrapper }
        >
            <Carousel
                ref={ carouselRef }
                data={ shuffled }
                sliderHeight={ 740 }
                itemHeight={ 400 }
                vertical={ true }
                layout={ 'default' }
                loop={ true }
                renderItem={ renderCard }
            />
        </View>
    );
};
