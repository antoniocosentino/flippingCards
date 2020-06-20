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

import { ScrollView, Button } from 'react-native';

import * as eva from '@eva-design/eva';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { SvgXml } from 'react-native-svg';

import AsyncStorage from '@react-native-community/async-storage';
import { plusSvg } from './utils/customIcons';
import { DEMO_WORDS } from './utils/demoData';
import { styles } from './styles/styles';

type TSingleWord = {
    de: string,
    en: string
}

type TWordsWallet = ReadonlyArray<TSingleWord>

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

export default () => {
    const [selectedIndex, setSelectedIndex] = React.useState( 0 );

    const [ view, setView ] = React.useState( 'LIST' );

    const storeData = async ( value: TWordsWallet ) => {
        try {
            const jsonValue = JSON.stringify( value );
            await AsyncStorage.setItem( '@wordsWallet', jsonValue );
        } catch ( e ) {
            console.error( 'Error:', e );
        }
    };

    const getData = async () => {
        try {
            const value = await AsyncStorage.getItem( '@wordsWallet' );

            if ( value !== null ) {
                setWordsWallet( JSON.parse( value ) );
            }
        } catch ( e ) {
            // error reading value
        }
    };

    const [ wordsWallet, setWordsWallet ] = React.useState( [] as TWordsWallet );

    if ( wordsWallet.length === 0 ) {
        getData();
    }

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
                { view === 'LIST' &&
                    <Layout style={ styles.topSearch }>
                        <Input
                            style={ styles.topSearchInput }
                            placeholder='Search'
                            value={searchValue}
                            onChangeText={nextValue => setSearchValue( nextValue )}
                            size={ 'small' }
                        />
                    </Layout>
                }
                { view !== 'LIST' &&
                    <Layout style={ styles.topSpacer } />
                }
                <Layout style={ styles.mainBlock }>
                    { view === 'LIST' &&
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            style={ styles.cardsScrollView }
                        >
                            {
                                wordsWallet.map( ( word, wordKey ) => {
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
                        <>
                            <Text style={styles.text} category='h1'>Add new word</Text>
                            <Button
                                title='boh'
                                onPress={() => storeData( DEMO_WORDS )}
                            >
                                store data
                            </Button>
                            <Button
                                title='boh2'
                                onPress={() => getData()}
                            >
                                get data
                            </Button>

                        </>

                    }
                </Layout>
                <Layout style={ styles.bottomZone }>
                    <BottomNavigation
                        appearance={ 'noIndicator' }
                        style={ styles.bottomWrapper }
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
