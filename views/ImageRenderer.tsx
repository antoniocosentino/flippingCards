import React from 'react';

import { Layout } from '@ui-kitten/components';
import { styles } from '../styles/styles';
import { Image } from 'react-native';

type TImageRenderer = {
    image: 'start';
};

export const ImageRenderer = ( props: TImageRenderer ) => {

    const { image } = props;

    return (
        <Layout>
            { image === 'start' &&
                <Image
                    source={ require( './../img/start-page.jpg' ) }
                    resizeMode={ 'contain' }
                    style={ styles.imageRenderer }
                />
            }
        </Layout>
    );
};
