import React, { useEffect, useState } from 'react';
import {
    ApplicationProvider,
    IconRegistry,
    Layout,
    Icon,
    IconProps
} from '@ui-kitten/components';

import * as eva from '@eva-design/eva';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import AsyncStorage from '@react-native-community/async-storage';
import { styles } from './styles/styles';
import { List } from './views/List';
import { AddToWallet } from './components/AddToWallet';
import { TrainingMode } from './views/TrainingMode';
import { customTheme } from './utils/customTheme';
import { ChallengeMode } from './views/ChallengeMode';
import { InfoView } from './views/InfoView';
import SafeArea, { SafeAreaInsets } from 'react-native-safe-area';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { NavigationContainer } from '@react-navigation/native';

import { DebugMode } from './views/DebugMode';

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

export type TSingleCard = TSingleWord & { mastered: boolean };

export type TCards = TSingleCard[]

export type TDeck = {
    id: number,
    name: string,
    createdTimestamp: number,
    updatedTimestamp: number,
    cards: TCards
};

export type TDecks = ReadonlyArray<TDeck>;

export type TEnrichedDecks = TDeck[];

type TAppData = {
    wordsWallet: TWordsWallet;
    decksData: TDecks;
    selectedIndex: number;
    hasShownAnimation: boolean;
    deviceNotchSize: number;
    db: any; // TODO: not sure if we can type here
    customNavigate: ( route: string ) => void;
    setHasShownAnimation: ( value: boolean ) => void;
    onMenuClick: ( index: number ) => void;
    setWordsWallet: ( value: TWordsWallet ) => void;
    setDecksData: ( value: TDecks ) => void;
    storeData: ( value: TWordsWallet ) => Promise<void>;
    storeDecksData: ( value: TDecks ) => Promise<void>;
    addSingleWord: ( word: TSingleWord ) => void;
    addSingleDeck: ( deck: TDeck ) => void;
    updateSingleDeck: ( deck: TDeck, deckKey: number ) => void;
    removeSingleDeck: ( deckKey: number ) => void;
    increaseTapsCount: () => void;
};

export const AppContext = React.createContext( {} as TAppData );

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let rerenderCount = 0;

// here I'm defining all the variables that don't actually need to be in the state
let hasShownAnimation = true;
//let isDecksDataUpdated = false;
let dbVersionWasChecked = false;

export const enrichDecksWithPlaceholder = ( decks: TEnrichedDecks ): TDecks => {

    const DECKS_EXTRA = {
        id: -1,
        name: '__ADD_PLACEHOLDER__',
        createdTimestamp: 1609757292,
        updatedTimestamp: 1609757492,
        cards: []
    };

    decks.push( DECKS_EXTRA );

    return decks;
};

export default () => {
    const [ selectedIndex, setSelectedIndex ] = useState( 0 );

    const currentRouteObj = navigationRef.current?.getCurrentRoute();
    const currentRoute = currentRouteObj?.name;

    const [ tapsCount, setTapsCount ] = React.useState( 0 );

    const increaseTapsCount = () => {
        setTapsCount( tapsCount + 1 );
    };

    useEffect( () => {
        if ( tapsCount >= 10 && currentRoute !== 'debug' ){
            customNavigate( 'debug' );
        }
    }, [ tapsCount, currentRoute ] );

    const WALLET_INITIAL_STATE = [
        {
            de: '__LOADING__WALLET__',
            en: '__LOADING__WALLET__',
            wordType: '__LOADING__WALLET__',
            dateAdded: 0
        }
    ];

    const [ wordsWallet, setWordsWallet ] = React.useState( WALLET_INITIAL_STATE as TWordsWallet );

    const [ decksData, setDecksData ] = React.useState( [] as any );

    useEffect( () => {
        const getDecksData = async () => {
            try {
                const value = await AsyncStorage.getItem( '@decks' );

                if ( value !== null ) {
                    const dataAsArr = JSON.parse( value );

                    setDecksData( enrichDecksWithPlaceholder( dataAsArr ) );
                }
                else {
                    setDecksData( enrichDecksWithPlaceholder( [] ) );
                }
            } catch ( e ) {
                // error reading value
            }
        };

        getDecksData();
    }, [] );

    useEffect( () => {
        const getData = async () => {
            try {
                const value = await AsyncStorage.getItem( '@wordsWallet' );
                const derivedValue = value || JSON.stringify( [] );
                setWordsWallet( JSON.parse( derivedValue ) );
            } catch ( e ) {
                // error reading value
            }
        };

        getData();
    }, [] );

    const [ deviceNotchSize, setDeviceNotchSize ] = React.useState( 0 );

    SafeArea.getSafeAreaInsetsForRootView()
        .then( ( result: any ) => {
            const safeAreaInsets: SafeAreaInsets = result.safeAreaInsets;
            setDeviceNotchSize( safeAreaInsets.bottom );
        } );

    const storeData = async ( value: TWordsWallet ) => {
        try {
            const jsonValue = JSON.stringify( value );
            await AsyncStorage.setItem( '@wordsWallet', jsonValue );
        } catch ( e ) {
            console.error( 'Error:', e );
        }
    };

    const storeDecksData = async ( value: TDecks ) => {
        try {
            const jsonValue = JSON.stringify( value );
            await AsyncStorage.setItem( '@decks', jsonValue );
        } catch ( e ) {
            console.error( 'Error:', e );
        }
    };

    const addSingleWord = ( word: TSingleWord ) => {
        const walletCopy = [...wordsWallet ];

        const wordWithCurrentTimestamp = {
            ...word,
            dateAdded: ( new Date() ).getTime()
        };

        walletCopy.unshift( wordWithCurrentTimestamp );

        setHasShownAnimation( false );

        storeData( walletCopy ).then( () => {
            setWordsWallet( walletCopy );
        } );

        onMenuClick( 0 );
    };

    const addSingleDeck = ( deckData: TDeck ) => {
        const decksClone = decksData.slice();

        // removing the add placeholder row
        decksClone.splice( -1, 1 );

        decksClone.push( deckData );

        storeDecksData( decksClone ).then( () => {
            setDecksData( enrichDecksWithPlaceholder( decksClone ) );
        } );

    };

    const updateSingleDeck = ( deckData: TDeck, deckKey: number ) => {
        const decksClone = decksData.slice();

        // removing the add placeholder row
        decksClone.splice( -1, 1 );

        decksClone[ deckKey ] = deckData;

        storeDecksData( decksClone ).then( () => {
            setDecksData( enrichDecksWithPlaceholder( decksClone ) );
        } );
    };

    const removeSingleDeck = ( deckKey: number ) => {
        const decksClone = decksData.slice();

        // removing the add placeholder row
        decksClone.splice( -1, 1 );

        // removing the specified key
        decksClone.splice( deckKey, 1 );

        storeDecksData( decksClone ).then( () => {
            setDecksData( enrichDecksWithPlaceholder( decksClone ) );
        } );
    };

    const setDbVersionWasChecked = ( newVal: boolean ) => {
        dbVersionWasChecked = newVal;
    };

    const getDBversion = async () => {

        setDbVersionWasChecked( true );

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
        if ( !dbVersionWasChecked ) {
            getDBversion();
        }
    } );

    const onMenuClick = ( index: number ) => {
        switch ( index ) {
            case 0:
            default:
                customNavigate( 'list' );
                break;

            case 1:
                customNavigate( 'training-mode' );
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

    const appData: TAppData = {
        wordsWallet,
        decksData,
        selectedIndex,
        hasShownAnimation,
        db,
        deviceNotchSize,
        customNavigate,
        setHasShownAnimation,
        onMenuClick,
        setWordsWallet,
        setDecksData,
        storeData,
        storeDecksData,
        addSingleDeck,
        updateSingleDeck,
        removeSingleDeck,
        addSingleWord,
        increaseTapsCount
    };

    const Tab = createBottomTabNavigator();

    // uncomment this to debug the number of re-renders
    // rerenderCount++;
    // console.log( 'Re-render count: ', rerenderCount );

    return (
        <NavigationContainer ref={ navigationRef }>
            <IconRegistry icons={ EvaIconsPack } />
            <ApplicationProvider { ...eva } theme={ customTheme }>
                <AppContext.Provider value={ appData }>
                    <Layout style={ styles.stackNavigatorWrapper } >
                        <Tab.Navigator
                            tabBarOptions={ {
                                showLabel: false,
                                style: {
                                    height: 0
                                }
                            } }
                        >
                            <Tab.Screen
                                name='list'
                                component={ List }
                                options={ {
                                    tabBarVisible: false
                                } }
                            />

                            <Tab.Screen
                                name='training-mode'
                                component={ TrainingMode }
                                options={ {
                                    tabBarVisible: false
                                } }
                            />

                            <Tab.Screen
                                name='add'
                                component={ AddToWallet }
                                options={ {
                                    tabBarVisible: false
                                } }
                            />

                            <Tab.Screen
                                name='challenge-mode'
                                component={ ChallengeMode }
                                options={ {
                                    tabBarVisible: false
                                } }
                            />

                            <Tab.Screen
                                name='info'
                                component={ InfoView }
                                options={ {
                                    tabBarVisible: false
                                } }
                            />

                            <Tab.Screen
                                name='debug'
                                component={ DebugMode }
                                options={ {
                                    tabBarVisible: false
                                } }
                            />

                        </Tab.Navigator>

                    </Layout>

                </AppContext.Provider>
            </ApplicationProvider>
        </NavigationContainer>
    );
};
