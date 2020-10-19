import React, { useState }  from 'react';

import { Layout } from '@ui-kitten/components';
import { Image } from 'react-native';

type TImageRenderer = {
    image: 'start';
};

export const ImageRenderer = ( props: TImageRenderer ) => {

    const { image } = props;

    const [ layoutWidth, setWidth ] = useState( 300 );

    return (
        <Layout
            onLayout={ ( event ) => {
                const { width } = event.nativeEvent.layout;
                setWidth( width );
            } }
        >
            { image === 'start' &&
                <Image
                    source={ require( './../img/start-page.jpg' ) }
                    resizeMode={ 'contain' }
                    style={ {
                        width: layoutWidth,
                        height: layoutWidth
                    } }
                />
            }
        </Layout>
    );
};
