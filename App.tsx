import React, { useCallback, useEffect } from 'react';
import {
    ApplicationProvider,
    IconRegistry,
    Layout,
    Input,
    Icon,
    Text,
    Button,
    IconProps,
    Divider
} from '@ui-kitten/components';

import { debounce } from 'lodash';
import { TouchableWithoutFeedback, View } from 'react-native';
import * as eva from '@eva-design/eva';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import AsyncStorage from '@react-native-community/async-storage';
import { DEMO_WORDS_DEBUG } from './utils/demoData.debug.js';
import { DEMO_WORDS } from './utils/demoData.js';
import { styles } from './styles/styles';
import { List } from './views/List';
import { BottomMenu } from './views/BottomMenu';
import { SearchResults } from './components/SearchResults';
import { removeArticle, getShuffledCards, TWordsFreshnessValues } from './utils/utils';
import { Cards } from './views/Cards';
import { customTheme } from './utils/customTheme';
import { ChallengeMode } from './views/ChallengeMode';
import { InfoView } from './views/InfoView';

import { NavigationContainer } from '@react-navigation/native';

import SafeArea, { SafeAreaInsets } from 'react-native-safe-area';

import Fuse from 'fuse.js';
import { Image } from 'react-native';

const SQLite = require( 'react-native-sqlite-storage' );

const okCallback = () => {
    console.log( 'connected to DB' );
};

const errorCallback = ( error: any ) => {
    console.log( 'DB connection error', error );
};

export const AddWordIcon = ( props: IconProps ) => (
    <Icon { ...props } name='file-add-outline' />
);

const db = SQLite.openDatabase( { name: 'dictionary.db', createFromLocation: 1 }, okCallback, errorCallback );

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
    filteredWordsWallet: TWordsWallet,
    selectedIndex: number,
    hasShownAnimation: boolean,
    setHasShownAnimation: ( value: boolean ) => void,
    onMenuClick: ( index: number ) => void,
    storeData: ( value: TWordsWallet ) => void,
    addSingleWord: ( word: TSingleWord ) => void,
    setView: ( view: string ) => void,
    wipeWalletSearch: () => void,
    increaseTapsCount: () => void
};

export type TSearchWords = TWords;

export const AppContext = React.createContext( {} as TAppData );


let hasShownAnimation = false;

const setHasShownAnimation = ( value: boolean ) => {
    hasShownAnimation = value;
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
                setView( 'LIST' );
                break;

            case 1:
                setView( 'CARDS' );
                break;

            case 2:
                setView( 'ADD' );
                break;

            case 3:
                setView( 'PLAY' );
                break;

            case 4:
                setView( 'INFO' );
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
        filteredWordsWallet,
        selectedIndex,
        hasShownAnimation,
        setHasShownAnimation,
        onMenuClick,
        storeData,
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

    const query = `select * from words where words MATCH '${ removeArticle( addSearch ) }*' AND rank MATCH 'bm25(10.0, 1.0)' GROUP BY de, en ORDER BY ( de = '${ addSearch }' ) desc, rank LIMIT 10`;

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

    const renderCloseIconForWalletSearch = ( props: IconProps ) => {
        if ( searchValue.length < 1 ) {
            return <></>;
        }

        return (
            <TouchableWithoutFeedback onPress={ wipeWalletSearch }>
                <Icon { ...props } width={ 22 } height={ 22 } fill='#ccc' name={ 'close-circle' } />
            </TouchableWithoutFeedback>
        );
    };

    const renderFilterIcon = ( props: IconProps ) => {
        return (
            <Icon { ...props } width={ 22 } height={ 22 } fill='#ccc' name={ 'search-outline' } />
        );
    };

    const goToMainPage = () => {
        setCardsView( 'instructions' );
    };

    const SettingsIcon = ( settingsIconProps: IconProps ) => (
        <Icon { ...settingsIconProps } width={ 22 } height={ 22 } fill='#333' name='settings-2-outline'/>
    );

    return (
        <NavigationContainer>
            <IconRegistry icons={ EvaIconsPack } />
            <ApplicationProvider { ...eva } theme={ customTheme }>
                <AppContext.Provider value={ appData }>

                    { view !== 'INFO' &&
                        // since INFO is a special page, which uses react navigation,
                        // we can't render the top container here
                        <Layout style={ [
                            styles.topContainer,
                            deviceNotchSize > 0 ? styles['topContainer--withNotch'] : null,
                            view === 'ADD' && styles.coloredTopContainer
                        ] }>

                            { view === 'LIST' && hasFetchedWallet && wordsWallet.length > 0 &&
                                <Layout style={ styles.transparentLayout } >
                                    <Input
                                        style={ styles.topSearchInput }
                                        placeholder='Search your wallet'
                                        value={ searchValue }
                                        onChangeText={ nextValue => setSearchValue( nextValue ) }
                                        size={ 'small' }
                                        accessoryRight={ renderCloseIconForWalletSearch }
                                        accessoryLeft={ renderFilterIcon }
                                    />
                                </Layout>
                            }

                            { view === 'ADD' &&
                                <Layout style={ styles.addBar }>
                                    <Layout style={ styles.addBarLeft }>
                                        <Icon
                                            onPress={ () => onMenuClick( 0 )  }
                                            width={ 30 }
                                            height={ 30 }
                                            fill='#fff'
                                            name={ 'close' }
                                        />
                                    </Layout>
                                    <Layout style={ styles.addBarRight }>
                                        <Input
                                            autoFocus={ true }
                                            autoCorrect={ false }
                                            style={ styles.addWordInput }
                                            placeholder='Type the word you want to add'
                                            value={ addSearch }
                                            onChangeText={ nextValue => setAddSearchWrapper( nextValue ) }
                                            size={ 'medium' }
                                            accessoryRight={ renderCloseIcon }
                                        />
                                    </Layout>
                                </Layout>
                            }

                            { view === 'CARDS' && cardsView === 'cards' &&
                                <Layout
                                    style={ styles.cardsTopNav }>
                                    <Text onPress={ goToMainPage } style={ styles.text } >
                                        <SettingsIcon style={ styles.cardsTopIcon } />
                                        Configure Deck
                                    </Text>
                                </Layout>
                            }
                        </Layout>
                    }

                    <Layout style={ styles.mainBlock }>
                        { view === 'CARDS' &&
                            <Cards
                                deck={ deck }
                                cardsView={ cardsView }
                                setCardsView={ setCardsView }
                                setView={ setView }
                                storeDeckData={ storeDeckData }
                            />
                        }
                        { view === 'LIST' && wordsWallet.length > 0 &&
                            <List />
                        }

                        { view === 'PLAY' &&
                            <ChallengeMode />
                        }

                        { view === 'LIST' && hasFetchedWallet && wordsWallet.length === 0 &&
                            <>
                                <Layout style={ styles.walletInstructionsWrapper }>
                                    <Layout style={ styles.walletInstructions }>
                                        <Text style={ [ styles.text, styles.titleText ] } category='h4'>Hello there! 👋</Text>

                                        <Text style={ [ styles.text, styles.instructionsText ] }>
                                            This is your wallet view. All the words that you add in your wallet will show up here.
                                        </Text>

                                        <View
                                            style={ styles.centeredSimpleView }
                                        >
                                            <Image
                                                source={ require( './img/start-page.jpg' ) }
                                                resizeMode={ 'contain' }
                                                // eslint-disable-next-line react-native/no-inline-styles
                                                style={ {
                                                    width: 250,
                                                    height: 249 // this small hack fixes an issue with an unwanted border on Android
                                                } }
                                            />
                                        </View>
                                    </Layout>

                                    <Layout style={ styles.walletInstructions }>
                                        <Button onPress={ () => storeData( DEMO_WORDS ) } style={ styles.ctaButton } accessoryLeft={ AddWordIcon }>
                                            START WITH DEMO WORDS
                                        </Button>
                                    </Layout>
                                </Layout>

                                <Layout style={ styles.tapInstructions }>
                                    <Image
                                        source={ require( './img/tap-hint.png' ) }
                                        resizeMode={ 'cover' }
                                        // eslint-disable-next-line react-native/no-inline-styles
                                        style={ {
                                            width: 350,
                                            height: 100 // this small hack fixes an issue with an unwanted border on Android
                                        } }
                                    />
                                </Layout>
                            </>
                        }

                        {
                            view === 'ADD' &&
                            <SearchResults results={ addSearchWords } />
                        }

                        { view === 'INFO' &&
                            <InfoView />
                        }

                        { view === 'DEBUG' &&
                            <>
                                <Button
                                    onPress={ () => storeData( DEMO_WORDS_DEBUG ) }
                                >
                                    Fill Wallet with Debug Demo Words
                                </Button>
                                <Divider />
                                <Button
                                    onPress={ () => storeData( [] ) }
                                >
                                    Wipe Wallet
                                </Button>
                                <Divider />
                                <Button
                                    onPress={ () => storeDeckData( [], 0, 'All Words' ) }
                                >
                                    Wipe Deck
                                </Button>
                            </>
                        }
                    </Layout>

                    <Layout
                        style={ [
                            styles.bottomZone,
                            view === 'INFO' && styles['bottomZone--specialCase']
                        ] }
                    >
                        <BottomMenu />
                    </Layout>
                </AppContext.Provider>
            </ApplicationProvider>
        </NavigationContainer>
    );
};
