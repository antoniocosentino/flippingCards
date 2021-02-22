import React, { useContext, useRef, useState } from 'react';
import { Text, Icon } from '@ui-kitten/components';
import { styles } from '../styles/styles';
import Carousel from 'react-native-snap-carousel';
import { View } from 'react-native';

import FlipCard from 'react-native-flip-card';
import { getArticle } from '../utils/utils';
import { AppContext } from '../App';

type TCards = any; //TODO: types!

type TRenderCardProps = {
    item: any;
    index: number;
};

export const Cards = ( props: TCards ) => {

    const [ cardWrapperDimensions, setCardWrapperDimensions ] = useState( { width: 0, height: 0 } );
    const carouselRef = useRef( null );
    const appData = useContext( AppContext );
    const { decksData } = appData;

    const deckKey = props.route?.params?.deckKey ?? 0;

    const deck = decksData[deckKey].cards.slice();

    deck.unshift( {
        de: '___firstItem___',
        en: '___firstItem___',
        wordType: '___firstItem___',
        mastered: false
    } );

    return (
        <>
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
                        itemHeight={ 400 }
                        vertical={ true }
                        layout={ 'default' }
                        loop={ false }
                        renderItem={ renderCard }
                        firstItem={ 0 }
                    />
                }
            </View>
        </>
    );
};


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
