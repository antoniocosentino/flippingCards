import React from 'react';
import {
    BottomNavigation,
    BottomNavigationTab,
    Icon,
    ApplicationProvider,
    IconRegistry,
    Layout,
    Text,
    IconProps
} from '@ui-kitten/components';

import { StyleSheet } from 'react-native';

import * as eva from '@eva-design/eva';
import { EvaIconsPack } from '@ui-kitten/eva-icons';

type TIconProps = any;


const ListIcon = ( props: IconProps ) => <Icon {...props} name='list-outline' />;
const CardsIcon = ( props: IconProps ) => <Icon {...props} name='grid-outline' />;
const PlusIcon = ( props: IconProps ) => <Icon {...props} name='plus-circle-outline' />;
const PlayIcon = ( props: IconProps ) => <Icon {...props} name='award-outline' />;
const SettingsIcon = ( props: IconProps ) => <Icon {...props} name='settings-2-outline' />;

const styles = StyleSheet.create( {
    mainBlock: {
        flex: 11,
        justifyContent:
        'center',
        alignItems: 'center'
    },
    bottomZone: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 20
    },
    text: {
        textAlign: 'center',
        color: '#000000'
    }
} );

export default () => {
    const [selectedIndex, setSelectedIndex] = React.useState( 0 );

    return (
        <>
            <IconRegistry icons={EvaIconsPack} />
            <ApplicationProvider {...eva} theme={eva.light}>
                <Layout style={ styles.mainBlock }>
                    <Text style={styles.text} category='h1'>FlipCards</Text>
                </Layout>
                <Layout style={ styles.bottomZone }>
                    <BottomNavigation
                        selectedIndex={selectedIndex}
                        onSelect={ ( index ) => setSelectedIndex( index ) }>
                        <BottomNavigationTab icon={ListIcon} />
                        <BottomNavigationTab icon={CardsIcon} />
                        <BottomNavigationTab icon={PlusIcon} />
                        <BottomNavigationTab icon={PlayIcon} />
                        <BottomNavigationTab icon={SettingsIcon} />
                    </BottomNavigation>
                </Layout>
            </ApplicationProvider>
        </>
    );
};
