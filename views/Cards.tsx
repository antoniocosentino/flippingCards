import React, { useContext } from 'react';
import { Text } from '@ui-kitten/components';
import { styles } from './../styles/styles';

type TCardsProps = any; // TODO: types

import Swiper from 'react-native-swiper';
import { View } from 'react-native';


export const Cards = ( props: TCardsProps ) => {

    return (
        <Swiper
            showsButtons={ false }
            showsPagination={ false }
        >
            <View style={ styles.singleSlide }>
                <Text style={ styles.slideText }>SLIDE A</Text>
            </View>
            <View style={ styles.singleSlide }>
                <Text style={ styles.slideText }>SLIDE B</Text>
            </View>
            <View style={ styles.singleSlide }>
                <Text style={ styles.slideText }>SLIDE C</Text>
            </View>
        </Swiper>
    );
};
