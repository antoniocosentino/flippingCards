import React, { useContext } from 'react';
import { ViewPager, Layout, Text } from '@ui-kitten/components';
import { styles } from './../styles/styles';

type TCardsProps = any; // TODO: types


export const Cards = ( props: TCardsProps ) => {

    const [selectedIndex, setSelectedIndex] = React.useState( 0 );


    return (
        <ViewPager
            selectedIndex={ selectedIndex }
            onSelect={ index => setSelectedIndex( index ) }
        >
            <Layout
                style={ styles.singleCard }
            >
                <Text category='h5'>SLIDE A</Text>
            </Layout>

            <Layout
                style={ styles.singleCard }
            >
                <Text category='h5'>SLIDE B</Text>
            </Layout>

            <Layout
                style={ styles.singleCard }
            >
                <Text category='h5'>SLIDE C</Text>
            </Layout>
        </ViewPager>
    );
};
