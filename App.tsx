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
    useTheme,
    Card
} from '@ui-kitten/components';

import { StyleSheet, ScrollView } from 'react-native';

import * as eva from '@eva-design/eva';
import { EvaIconsPack } from '@ui-kitten/eva-icons';

const DEMO_WORDS = [
    {
        de: 'zeigen',
        en: 'to show'
    },
    {
        de: 'die Unterhaltung',
        en: 'entertainment'
    },
    {
        de: 'der Lebensabschnittpartner',
        en: 'part-time lover'
    },
    {
        de: 'liegen',
        en: 'to lie, to be located'
    },
    {
        de: 'nennen',
        en: 'to name, to call'
    },
    {
        de: 'nennen',
        en: 'to name, to call'
    },
    {
        de: 'nennen',
        en: 'to name, to call'
    }
];

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
        'flex-start',
        alignItems: 'center',
        marginTop: 70,
        overflow: 'scroll'
    },
    bottomZone: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 26
    },
    text: {
        textAlign: 'center',
        color: '#000000'
    },
    plusContainer: {
        borderRadius: 27,
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
    },
    cardsScrollView: {
        width: '91%',
        marginLeft: '4.5%',
        marginRight: '4.5%'
    },
    wordCard: {
        marginTop: 10,
        backgroundColor: '#3466FF',
        paddingTop: 10,
        paddingBottom: 10,
        borderRadius: 10
    },
    mainWord: {
        color: '#fff',
        fontSize: 22
    },
    translationWord: {
        color: '#fff',
        fontSize: 16,
        marginTop: 8
    }
} );

export default () => {
    const [selectedIndex, setSelectedIndex] = React.useState( 0 );

    const [ view, setView ] = React.useState( 'LIST' );

    const onMenuClick = ( index: number ) => {
        if ( index === 2 ) {
            // TODO: insert here logic for opening the plus stuff
            setView( 'ADD' );
            return;
        }
        setSelectedIndex( index );
        setView( 'LIST' );
    };

    return (
        <>
            <IconRegistry icons={EvaIconsPack} />
            <ApplicationProvider {...eva} theme={eva.light}>
                <Layout style={ styles.mainBlock }>
                    <ScrollView
                        style={ styles.cardsScrollView }
                    >
                        {
                            view === 'LIST' && DEMO_WORDS.map( ( word, wordKey ) => {
                                return (
                                    <Card
                                        style={ styles.wordCard }
                                        key={ wordKey }
                                    >
                                        <Text
                                            style={ styles.mainWord }
                                        >
                                            { word.de }
                                        </Text>
                                        <Text
                                            style={ styles.translationWord }
                                        >
                                            { word.en }
                                        </Text>
                                    </Card>
                                );
                            } )
                        }
                    </ScrollView>
                    {
                        view === 'ADD' &&
                        <Text style={styles.text} category='h1'>Add new word</Text>
                    }
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
