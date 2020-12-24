import React from 'react';

import { Layout, Text } from '@ui-kitten/components';
import { Image } from 'react-native';
import { styles } from '../styles/styles';
import { SafeAreaView } from 'react-native-safe-area-context';

export const ChallengeMode = () => {

    return (
        <SafeAreaView style={ styles.searchResults }>
            <Layout style={ styles.centeredElement }>
                <Text style={ [ styles.text, styles.titleText ] } category='h4'>Challenge mode</Text>
                <Image
                    source={ require( './../img/work-in-progress.jpg' ) }
                    resizeMode={ 'contain' }
                    // eslint-disable-next-line react-native/no-inline-styles
                    style={ {
                        width: 250,
                        height: 250
                    } }
                />
                <Text style={ [ styles.text, styles.instructionsText ] }>
                    Challenge mode will allow you to test your vocabulary with word quizzes.
                    { '\n' } { '\n' }
                    This feature is currently under development and will be shipped with the next release of Flipping Cards.
                </Text>
            </Layout>
        </SafeAreaView>
    );
};
