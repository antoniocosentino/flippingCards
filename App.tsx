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
    Card,
    Input
} from '@ui-kitten/components';

import { StyleSheet, ScrollView } from 'react-native';

import * as eva from '@eva-design/eva';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { SvgXml } from 'react-native-svg';


const plusSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">
<g fill="none" fill-rule="evenodd">
  <circle cx="14" cy="14" r="14" fill="#3466FF"/>
  <g fill-rule="nonzero" transform="translate(2 2)">
    <rect width="24" height="24" fill="#000" opacity="0" transform="rotate(180 12 12)"/>
    <path fill="#FFF" d="M19,11 L13,11 L13,5 C13,4.44771525 12.5522847,4 12,4 C11.4477153,4 11,4.44771525 11,5 L11,11 L5,11 C4.44771525,11 4,11.4477153 4,12 C4,12.5522847 4.44771525,13 5,13 L11,13 L11,19 C11,19.5522847 11.4477153,20 12,20 C12.5522847,20 13,19.5522847 13,19 L13,13 L19,13 C19.5522847,13 20,12.5522847 20,12 C20,11.4477153 19.5522847,11 19,11 Z"/>
  </g>
</g>
</svg>`;

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
    },
    {
        de: 'nennen',
        en: 'to name, to call'
    }
];

const ListIcon = ( props: IconProps ) => <Icon {...props} name='list-outline' />;
const CardsIcon = ( props: IconProps ) => <Icon {...props} name='grid-outline' />;
const PlusIcon = () => {
    return (
        <SvgXml
            width='44'
            height='44'
            xml={ plusSvg }
            style={ styles.plusIcon }
        />
    );
};
const PlayIcon = ( props: IconProps ) => <Icon {...props} name='award-outline' />;
const SettingsIcon = ( props: IconProps ) => <Icon {...props} name='settings-2-outline' />;

const styles = StyleSheet.create( {
    topSearch: {
        flex: 1.5,
        justifyContent: 'flex-end'
    },
    topSearchInput: {
        width: '91%',
        marginLeft: '4.5%',
        marginRight: '4.5%',
        borderRadius: 18
    },
    mainBlock: {
        flex: 8.5,
        justifyContent:
        'flex-start',
        alignItems: 'center',
        marginTop: 10,
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
    plusIcon: {
        marginLeft: -1
    },
    cardsScrollView: {
        width: '91%',
        marginLeft: '4.5%',
        marginRight: '4.5%'
    },
    wordCard: {
        marginBottom: 10,
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

    const [ searchValue, setSearchValue ] = React.useState( '' );

    return (
        <>
            <IconRegistry icons={EvaIconsPack} />
            <ApplicationProvider {...eva} theme={eva.light}>
                <Layout style={ styles.topSearch }>
                    <Input
                        style={ styles.topSearchInput }
                        placeholder='Search'
                        value={searchValue}
                        onChangeText={nextValue => setSearchValue( nextValue )}
                    />
                </Layout>
                <Layout style={ styles.mainBlock }>
                    { view === 'LIST' &&
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            style={ styles.cardsScrollView }
                        >
                            {
                                DEMO_WORDS.map( ( word, wordKey ) => {
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
                    }
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
