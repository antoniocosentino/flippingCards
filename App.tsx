import React from 'react';
import {
    BottomNavigation,
    BottomNavigationTab,
    Icon,
    ApplicationProvider,
    IconRegistry,
    Layout,
    Text,
    IconProps,
    useTheme
} from '@ui-kitten/components';

import { StyleSheet } from 'react-native';

import * as eva from '@eva-design/eva';
import { EvaIconsPack } from '@ui-kitten/eva-icons';


const ListIcon = ( props: IconProps ) => <Icon {...props} name='list-outline' />;
const CardsIcon = ( props: IconProps ) => <Icon {...props} name='grid-outline' />;
const PlusIcon = ( props: IconProps ) => {

    const theme = useTheme();

    return (
        <Text
            style={ [ styles.plusContainer, { backgroundColor: theme['color-primary-default']  } ] }
        >
            <Icon
                {...props}
                fill='#fff'
                name='plus-outline'
                style={ styles.plusIcon }
            />
        </Text>
    );
};
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
    },
    plusContainer: {
        borderRadius: 28,
        overflow: 'hidden'
    },
    plusIcon: {
        marginTop: 15,
        marginLeft: 12,
        marginRight: 12,
        marginBottom: 9,
        width: 30,
        height: 30,
        color: 'white'
    }
} );

export default () => {
    const [selectedIndex, setSelectedIndex] = React.useState( 0 );

    const [ mainText, setMainText ] = React.useState( 'FlipCards' );

    const onMenuClick = ( index: number ) => {
        if ( index === 2 ) {
            // TODO: insert here logic for opening the plus stuff
            setMainText( 'Porc Dieu' );
            return;
        }
        setSelectedIndex( index );
        setMainText( 'FlipCards' );
    };

    return (
        <>
            <IconRegistry icons={EvaIconsPack} />
            <ApplicationProvider {...eva} theme={eva.light}>
                <Layout style={ styles.mainBlock }>
                    <Text style={styles.text} category='h1'>{ mainText }</Text>
                </Layout>
                <Layout style={ styles.bottomZone }>
                    <BottomNavigation
                        selectedIndex={selectedIndex}
                        onSelect={ ( index ) => onMenuClick( index ) }>
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
