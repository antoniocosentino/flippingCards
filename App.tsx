import React, { useCallback, useEffect } from 'react';
import {
    ApplicationProvider,
    IconRegistry,
    Layout,
    Input,
    Icon,
    Text,
    IconProps
} from '@ui-kitten/components';

import { debounce } from 'lodash';
import { TouchableWithoutFeedback } from 'react-native';
import * as eva from '@eva-design/eva';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import AsyncStorage from '@react-native-community/async-storage';
import { styles } from './styles/styles';
import { List } from './views/List';
import { BottomMenu } from './views/BottomMenu';
import { SearchResults } from './components/SearchResults';
import { removeArticle, getShuffledCards, TWordsFreshnessValues, uncapitalizeWord } from './utils/utils';
import { Cards } from './views/Cards';
import { customTheme } from './utils/customTheme';
import { ChallengeMode } from './views/ChallengeMode';
import { InfoView } from './views/InfoView';

import { NavigationContainer } from '@react-navigation/native';

import SafeArea, { SafeAreaInsets } from 'react-native-safe-area';

import Fuse from 'fuse.js';
import { EmptyList } from './views/EmptyList';
import { DebugMode } from './views/DebugMode';

import { createStackNavigator } from '@react-navigation/stack';

// this needs to be updated everytime a change in the words database is released
const DB_VERSION = '5';

const SQLite = require( 'react-native-sqlite-storage' );

const okCallback = () => {
    console.log( 'connected to DB' );
};

const errorCallback = ( error: any ) => {
    console.log( 'DB connection error', error );
};

const db = SQLite.openDatabase( { name: 'dictionary.db', createFromLocation: 1 }, okCallback, errorCallback );

const okDeletionCallback = () => {
    console.log( 'I deleted the database' );
    SQLite.openDatabase( { name: 'dictionary.db', createFromLocation: 1 }, okCallback, errorCallback );
};

const errorDeletionCallback = ( error: any ) => {
    console.log( 'Error while deleting DB', error );
};

export const AddWordIcon = ( props: IconProps ) => (
    <Icon { ...props } name='plus-outline' />
);

export const dbRefresh = () => {
    SQLite.deleteDatabase( { name: 'dictionary.db', createFromLocation: 1 }, okDeletionCallback, errorDeletionCallback );
};

export type TSingleWord = {
    de: string,
    en: string,
    wordType: string // TODO: we can be more specific here with types
}

export type TSingleWalletWord = TSingleWord & { dateAdded: number }

export type TWords = ReadonlyArray<TSingleWord>

export type TWordsWallet = ReadonlyArray<TSingleWalletWord>

type TAppData = {
    wordsWallet: TWordsWallet,
    hasFetchedWallet: boolean,
    searchValue: string,
    filteredWordsWallet: TWordsWallet,
    selectedIndex: number,
    hasShownAnimation: boolean,
    setHasShownAnimation: ( value: boolean ) => void,
    onMenuClick: ( index: number ) => void,
    storeData: ( value: TWordsWallet ) => void,
    storeDeckData: ( value: TWordsWallet, nOfCards: number, wordsFreshness: TWordsFreshnessValues  ) => Promise<number>,
    addSingleWord: ( word: TSingleWord ) => void,
    setView: ( view: string ) => void,
    wipeWalletSearch: () => void,
    increaseTapsCount: () => void,
    setSearchValue: ( param: string ) => void
};

export type TSearchWords = TWords;

export const AppContext = React.createContext( {} as TAppData );

let hasShownAnimation = false;

const setHasShownAnimation = ( value: boolean ) => {
    hasShownAnimation = value;
};

export const storeDBversion = async ( version: string ) => {
    try {
        await AsyncStorage.setItem( '@dbVersion', version );
    } catch ( e ) {
        console.error( 'Error:', e );
    }
};

export const navigationRef = React.createRef() as any; // TODO: type

const customNavigate = ( route: string ) => {
    navigationRef.current?.navigate( route );
};

export default () => {
    const [ selectedIndex, setSelectedIndex ] = React.useState( 0 );



    // DEFAULT VIEW IS DEFINED HERE
    const [ view, setView ] = React.useState( 'LIST' );
    const [ cardsView, setCardsView ] = React.useState( 'instructions' );

    // dev feature to enable debug mode
    const [ tapsCount, setTapsCount ] = React.useState( 0 );

    const increaseTapsCount = () => {
        setTapsCount( tapsCount + 1 );
    };

    if ( tapsCount >= 10 && view !== 'DEBUG' ){
        setView( 'DEBUG' );
    }

    const [ wordsWallet, setWordsWallet ] = React.useState( [] as TWordsWallet );

    const [ filteredWordsWallet, setFilteredWordsWallet ] = React.useState( [] as TWordsWallet );

    const walletFuseInstance = new Fuse( wordsWallet, {
        keys: ['de', 'en'],
        threshold: 0.2
    } );

    const [ hasFetchedWallet, setHasFetchedWallet ] = React.useState( false );

    const [ deviceNotchSize, setDeviceNotchSize ] = React.useState( 0 );

    useEffect( () => {
        setAddSearchWords( [] );
        setAddSearch( '' );
    }, [ view ] );

    SafeArea.getSafeAreaInsetsForRootView()
        .then( ( result: any ) => {
            const safeAreaInsets: SafeAreaInsets = result.safeAreaInsets;
            setDeviceNotchSize( safeAreaInsets.bottom );
        } );

    const [ isDataUpdated, setDataUpdated ] = React.useState( false );
    const [ isDeckDataUpdated, setDeckDataUpdated ] = React.useState( false );

    const storeData = async ( value: TWordsWallet ) => {

        setDataUpdated( false );
        try {
            const jsonValue = JSON.stringify( value );
            await AsyncStorage.setItem( '@wordsWallet', jsonValue );
        } catch ( e ) {
            console.error( 'Error:', e );
        }
    };

    const storeDeckData = async ( value: TWordsWallet, nOfCards: number, wordsFreshness: TWordsFreshnessValues ): Promise<number> => {
        const shuffledCards = getShuffledCards( value, nOfCards, wordsFreshness );
        setDeckDataUpdated( false );
        try {
            const jsonValue = JSON.stringify( shuffledCards );
            await AsyncStorage.setItem( '@deck', jsonValue );
        } catch ( e ) {
            console.error( 'Error:', e );
        }

        return shuffledCards.length;
    };

    const addSingleWord = ( word: TSingleWord ) => {
        // TODO: tackle duplicates
        const walletCopy = [...wordsWallet ];

        const wordWithCurrentTimestamp = {
            ...word,
            dateAdded: ( new Date() ).getTime()
        };

        walletCopy.unshift( wordWithCurrentTimestamp );

        setHasShownAnimation( false );
        setHasFetchedWallet( false ); // this is to avoid flickering on the welcome screen

        storeData( walletCopy );
        onMenuClick( 0 );
    };

    const getData = async () => {
        try {
            const value = await AsyncStorage.getItem( '@wordsWallet' );

            if ( value !== null ) {
                setWordsWallet( JSON.parse( value ) );
            }

            // this needs to be executed anyway
            // otherwise you will have an empty screen on first load
            setHasFetchedWallet( true );

        } catch ( e ) {
            // error reading value
        }
    };

    const getDBversion = async () => {
        try {
            const version = await AsyncStorage.getItem( '@dbVersion' );

            if ( version !== DB_VERSION ) {
                dbRefresh();
                storeDBversion( DB_VERSION );
            }

        } catch ( e ) {
            // error reading value
        }
    };

    useEffect( () => {
        getDBversion();
    } );

    const getDeckData = async () => {
        try {
            const value = await AsyncStorage.getItem( '@deck' );

            if ( value !== null ) {
                setDeck( JSON.parse( value ) );
            }
        } catch ( e ) {
            // error reading value
        }
    };

    const [ deck, setDeck ] = React.useState( [] as TWords );

    if ( !isDataUpdated ){
        getData();
        setDataUpdated( true );
    }

    if ( !isDeckDataUpdated ){
        getDeckData();
        setDeckDataUpdated( true );
    }

    const onMenuClick = ( index: number ) => {
        switch ( index ) {
            case 0:
            default:
                customNavigate( 'list' );
                break;

            case 1:
                customNavigate( 'cards' );
                break;

            case 2:
                customNavigate( 'add' );
                break;

            case 3:
                customNavigate( 'challenge-mode' );
                break;

            case 4:
                customNavigate( 'info' );
                break;
        }

        setSelectedIndex( index );

        setTapsCount( 0 );
    };

    const [ searchValue, setSearchValue ] = React.useState( '' );

    const wipeSearch = () => {
        setAddSearch( '' );
    };

    const wipeWalletSearch = () => {
        setSearchValue( '' );
    };

    const appData: TAppData = {
        wordsWallet,
        hasFetchedWallet,
        searchValue,
        filteredWordsWallet,
        selectedIndex,
        hasShownAnimation,
        setHasShownAnimation,
        onMenuClick,
        storeData,
        setSearchValue,
        storeDeckData,
        addSingleWord,
        setView,
        wipeWalletSearch,
        increaseTapsCount
    };

    // database stuff

    const [ addSearch, setAddSearch ] = React.useState( '' );

    useEffect( () => {
        if ( addSearch === '' ) {
            setAddSearchWords( [] );
        }
    }, [ addSearch ] );

    useEffect( () => {
        updateWalletFilter();

        if ( searchValue === '' ) {
            setFilteredWordsWallet( [] );
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ searchValue ] );

    const updateWalletFilter = () => {
        const fuseResult = walletFuseInstance.search( searchValue );
        setFilteredWordsWallet( fuseResult.map( ( result ) => result.item ) );
    };

    const [ shouldQuery, setShouldQuery ] = React.useState( false );

    const setAddSearchWrapper = ( word: string ) => {
        setShouldQueryDebounced( true );
        setAddSearch( word );
    };

    const setShouldQueryDebounced = useCallback( debounce( setShouldQuery, 300 ), [] );

    const [ addSearchWords, setAddSearchWords ] = React.useState( [] as TSearchWords );

    const query = `select * from words where words MATCH '${ removeArticle( addSearch ) }*' AND rank MATCH 'bm25(10.0, 1.0)' GROUP BY de, en ORDER BY ( de = '${ removeArticle( uncapitalizeWord( addSearch ) ) }' ) desc, rank LIMIT 20`;

    if ( shouldQuery && addSearch !== '' ) {
        setShouldQuery( false );
        db.transaction( ( tx: any ) => {

            tx.executeSql( query, [], ( trans: any, results:any ) => {
                console.log( 'Query executed' );

                const len = results.rows.length;

                const tempAddSearchWords = [];

                for ( let i = 0; i < len; i++ ) {
                    let row = results.rows.item( i );

                    const tempObj = {
                        de: row.de,
                        en: row.en,
                        wordType: row.wordType
                    };

                    tempAddSearchWords.push( tempObj );
                }

                setAddSearchWords( tempAddSearchWords );
            },
            ( error: any ) => {
                console.log( 'Errors with the query', error );
            }
            );
        } );
    }

    const renderCloseIcon = ( props: IconProps ) => {
        if ( addSearch.length < 1 ) {
            return <></>;
        }

        return (
            <TouchableWithoutFeedback onPress={ wipeSearch }>
                <Icon { ...props } width={ 22 } height={ 22 } fill='#ccc' name={ 'close-circle' } />
            </TouchableWithoutFeedback>
        );
    };

    const goToMainPage = () => {
        setCardsView( 'instructions' );
    };

    const SettingsIcon = ( settingsIconProps: IconProps ) => (
        <Icon { ...settingsIconProps } width={ 22 } height={ 22 } fill='#333' name='settings-2-outline'/>
    );

    const Stack = createStackNavigator();

    return (
        <NavigationContainer ref={ navigationRef }>
            <IconRegistry icons={ EvaIconsPack } />
            <ApplicationProvider { ...eva } theme={ customTheme }>
                <AppContext.Provider value={ appData }>

                    
                    <Layout style={ styles.stackNavigatorWrapper } >

                       <Stack.Navigator
                            screenOptions={ {
                                cardStyle: { backgroundColor: '#fff' }
                            } }
                        >
                            <Stack.Screen
                                name='list'
                                component={ List }
                                options={ {
                                    title: '',
                                    headerStyle: {
                                        height: 50,
                                        shadowColor: 'transparent',
                                        elevation: 0
                                    }
                                } }
                            />

                            <Stack.Screen
                                name='cards'
                                options={ {
                                    title: '',
                                    animationEnabled: false,
                                    headerLeft: () => null,
                                    headerStyle: {
                                        shadowColor: 'transparent',
                                        elevation: 0
                                    }
                                } }
                            >
                                {
                                    () => {
                                        return (
                                            <Cards
                                                deck={ deck }
                                                cardsView={ cardsView }
                                                setCardsView={ setCardsView }
                                                setView={ setView }
                                                storeDeckData={ storeDeckData }
                                            />
                                        );
                                    }
                                }
                            </Stack.Screen>

                            <Stack.Screen
                                name='add'
                                options={ {
                                    title: '',
                                    animationEnabled: false,
                                    headerLeft: () => null,
                                    headerStyle: {
                                        shadowColor: 'transparent',
                                        elevation: 0
                                    }
                                } }
                            >
                                {
                                    () => {
                                        return (
                                            <SearchResults results={ addSearchWords } />
                                        );
                                    }
                                }
                            </Stack.Screen>

                            <Stack.Screen
                                name='challenge-mode'
                                component={ ChallengeMode }
                                options={ {
                                    title: '',
                                    animationEnabled: false,
                                    headerLeft: () => null,
                                    headerStyle: {
                                        shadowColor: 'transparent',
                                        elevation: 0
                                    }
                                } }
                            />

                            <Stack.Screen
                                name='info'
                                component={ InfoView }
                                options={ {
                                    title: '',
                                    animationEnabled: false,
                                    headerLeft: () => null,
                                    headerStyle: {
                                        shadowColor: 'transparent',
                                        elevation: 0
                                    }
                                } }
                            />

                            <Stack.Screen
                                name='debug'
                                component={ DebugMode }
                                options={ {
                                    title: '',
                                    animationEnabled: false,
                                    headerLeft: () => null,
                                    headerStyle: {
                                        shadowColor: 'transparent',
                                        elevation: 0
                                    }
                                } }
                            />

                        </Stack.Navigator>

                    </Layout>

                    <Layout style={ styles.bottomZone }>
                        <BottomMenu />
                    </Layout>

                </AppContext.Provider>
            </ApplicationProvider>
        </NavigationContainer>
    );
};
