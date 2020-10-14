import React, { useContext } from 'react';

import { Layout, Text } from '@ui-kitten/components';
import { Image } from 'react-native';

export const ChallengeMode = () => {
    return (
        <Layout>
            <Text>this now finally works on iOS</Text>
            <Image
                source={ require( './../img/coming-soon.png' ) }
                resizeMode={ 'contain' }
                style={ {
                    width: 200,
                    height: 200
                } }
            />
        </Layout>
    );
};
