import React, { useRef } from 'react';
import { Text, Card, Button, Layout } from '@ui-kitten/components';
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

    return (
        <View
            style={ styles.sliderWrapper }
        >
            <Card
                style={ styles.instructions }
            >
                <Layout style={ styles.ctaContainer } level='1'>

                    <Button style={ styles.ctaButton }>
                        SHUFFLE
                    </Button>

                    <Button style={ styles.ctaButton }>
                        GENERATE NEW DECK
                    </Button>

                </Layout>
            </Card>

            <Carousel
                ref={ carouselRef }
                data={ shuffled }
                sliderHeight={ 740 }
                itemHeight={ 400 }
                vertical={ true }
                layout={ 'default' }
                loop={ false }
                renderItem={ renderCard }
            />
        </View>
    );
};
