import React, { useState } from 'react';

import { Layout, Text } from '@ui-kitten/components';
import { Image } from 'react-native';
import { styles } from '../styles/styles';

export const ChallengeMode = () => {

    const [ layoutWidth, setWidth ] = useState( 0 );

    return (
        <Layout
            style={ styles.centeredElement }
            onLayout={ ( event ) => {
                const { width } = event.nativeEvent.layout;
                setWidth( width );
            } }
        >
            <Text style={ [ styles.text, styles.titleText ] } category='h4'>Challenge mode</Text>
            <Image
                source={ require( './../img/coming-soon.png' ) }
                resizeMode={ 'contain' }
                style={ {
                    width: layoutWidth,
                    height: layoutWidth / 1.165
                } }
            />
            <Text style={ [ styles.text, styles.instructionsText ] }>
                Challenge mode will allow you to test your vocabulary with word quizzes.
                { '\n' } { '\n' }
                This feature is currently on development and will come with the next release of Flipping Cards.
            </Text>
        </Layout>
    );
};
