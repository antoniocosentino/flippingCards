import React from 'react';
import { Text } from '@ui-kitten/components';
import { styles } from './../styles/styles';

type TCardsProps = any; // TODO: types

import Swiper from 'react-native-swiper';
import { View } from 'react-native';
import FlipCard from 'react-native-flip-card';

export const Cards = ( props: TCardsProps ) => {

    return (
        <Swiper
            showsButtons={ false }
            showsPagination={ false }
            horizontal={ false }
        >
            <View style={ styles.singleSlide }>
                <View style={ styles.singleCardWrapper }>
                    <FlipCard
                        style={ styles.singleCard }
                        flipHorizontal={ true }
                        flipVertical={ false }
                    >
                        <View style={ styles.cardFront }>
                            <Text style={ styles.slideText }>the English word - 1</Text>
                        </View>

                        <View style={ styles.cardBack }>
                            <Text style={ styles.slideText }>das Deutsche Wort - 1</Text>
                        </View>
                    </FlipCard>
                </View>
            </View>

            <View style={ styles.singleSlide }>
                <View style={ styles.singleCardWrapper }>
                    <FlipCard
                        style={ styles.singleCard }
                        flipHorizontal={ true }
                        flipVertical={ false }
                    >
                        <View style={ styles.cardFront }>
                            <Text style={ styles.slideText }>the English word - 2</Text>
                        </View>

                        <View style={ styles.cardBack }>
                            <Text style={ styles.slideText }>das Deutsche Wort - 2</Text>
                        </View>
                    </FlipCard>
                </View>
            </View>

            <View style={ styles.singleSlide }>
                <View style={ styles.singleCardWrapper }>
                    <FlipCard
                        style={ styles.singleCard }
                        flipHorizontal={ true }
                        flipVertical={ false }
                    >
                        <View style={ styles.cardFront }>
                            <Text style={ styles.slideText }>the English word - 3</Text>
                        </View>

                        <View style={ styles.cardBack }>
                            <Text style={ styles.slideText }>das Deutsche Wort - 3</Text>
                        </View>
                    </FlipCard>
                </View>
            </View>

        </Swiper>
    );
};
