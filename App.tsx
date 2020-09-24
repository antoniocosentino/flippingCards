import React, { useCallback, useEffect } from 'react';
import {
    ApplicationProvider,
    IconRegistry,
    Layout,
    Input,
    Icon
} from '@ui-kitten/components';

import { debounce } from 'lodash';
import { Button, TouchableWithoutFeedback } from 'react-native';
import * as eva from '@eva-design/eva';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import AsyncStorage from '@react-native-community/async-storage';
import { DEMO_WORDS } from './utils/demoData';
import { styles } from './styles/styles';
import { List } from './views/List';
import { BottomMenu } from './views/BottomMenu';
import { SearchResults } from './components/SearchResults';
import { removeArticle, getShuffledCards } from './utils/utils';
import { Cards } from './views/Cards';
import { customTheme } from './utils/customTheme';

const SQLite = require( 'react-native-sqlite-storage' );

const okCallback = () => {
    console.log( 'connected to DB' );
};

const errorCallback = ( error: any ) => {
    console.log( 'DB connection error', error );
};

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
    selectedIndex: number,
    onMenuClick: ( index: number ) => void,
    storeData: ( value: TWordsWallet ) => void
    addSingleWord: ( word: TSingleWord ) => void
};

export type TSearchWords = TWords;

export const AppContext = React.createContext( {} as TAppData );

export default () => {
    const [ selectedIndex, setSelectedIndex ] = React.useState( 0 );

    // DEFAULT VIEW IS DEFINED HERE
    const [ view, setView ] = React.useState( 'LIST' );
    const [ cardsView, setCardsView ] = React.useState( 'instructions' );

    useEffect( () => {
        setAddSearchWords( [] );
        setAddSearch( '' );
    }, [ view ] );

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

    const storeDeckData = async ( value: TWords, nOfCards: number ) => {
        const shuffledCards = getShuffledCards( value, nOfCards );
        setDeckDataUpdated( false );
        try {
            const jsonValue = JSON.stringify( shuffledCards );
            await AsyncStorage.setItem( '@deck', jsonValue );
        } catch ( e ) {
            console.error( 'Error:', e );
        }
    };

    const addSingleWord = ( word: TSingleWord ) => {
        // TODO: tackle duplicates
        const walletCopy = [...wordsWallet ];

        const wordWithCurrentTimestamp = {
            ...word,
            dateAdded: ( new Date() ).getTime()
        };

        walletCopy.unshift( wordWithCurrentTimestamp );

        storeData( walletCopy );
        onMenuClick( 0 );
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

    const [ wordsWallet, setWordsWallet ] = React.useState( [] as TWordsWallet );

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
                setView( 'SETTINGS' );
                break;
        }

        setSelectedIndex( index );
    };

    const [ searchValue, setSearchValue ] = React.useState( '' );

    const appData = {
        wordsWallet,
        selectedIndex,
        onMenuClick,
        storeData,
        addSingleWord
    };

    const showTopSpacer = view !== 'LIST' && view !== 'ADD' && view !== 'CARDS';

    // database stuff

    const [ addSearch, setAddSearch ] = React.useState( '' );

    useEffect( () => {
        if ( addSearch === '' ) {
            setAddSearchWords( [] );
        }
    }, [ addSearch ] );

    const [ shouldQuery, setShouldQuery ] = React.useState( false );

    const setAddSearchWrapper = ( word: string ) => {
        setShouldQueryDebounced( true );
        setAddSearch( word );
    };

    const setShouldQueryDebounced = useCallback( debounce( setShouldQuery, 300 ), [] );

    const [ addSearchWords, setAddSearchWords ] = React.useState( [] as TSearchWords );

    const query = `select * from words where words MATCH '${ removeArticle( addSearch ) }*' AND rank MATCH 'bm25(10.0, 1.0)' ORDER BY ( de = '${ addSearch }' ) desc, rank LIMIT 10`;

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

    const wipeSearch = () => {
        setAddSearch( '' );
    };

    const renderCloseIcon = ( props: any ) => { // TODO: types
        if ( addSearch.length < 1 ) {
            return <></>;
        }

        return (
            <TouchableWithoutFeedback onPress={ wipeSearch }>
                <Icon { ...props } width={ 22 } height={ 22 } fill='#ccc' name={ 'close-circle' } />
            </TouchableWithoutFeedback>
        );
    };

    return (
        <>
            <IconRegistry icons={ EvaIconsPack } />
            <ApplicationProvider { ...eva } theme={ customTheme }>
                <AppContext.Provider value={ appData }>
                    { view === 'LIST' &&
                        <Layout style={ styles.topSearch }>
                            <Input
                                style={ styles.topSearchInput }
                                placeholder='Search'
                                value={ searchValue }
                                onChangeText={ nextValue => setSearchValue( nextValue ) }
                                size={ 'small' }
                            />
                        </Layout>
                    }
                    { view === 'ADD' &&
                        <Layout style={ styles.addBar }>
                            <Layout style={ styles.addBarLeft }>
                                <Icon
                                    onPress={ () => setView( 'LIST' )  }
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
                                    placeholder='Type the word you want to enter'
                                    value={ addSearch }
                                    onChangeText={ nextValue => setAddSearchWrapper( nextValue ) }
                                    size={ 'large' }
                                    accessoryRight={ renderCloseIcon }
                                />
                            </Layout>
                        </Layout>
                    }
                    { showTopSpacer &&
                        <Layout style={ styles.topSpacer } />
                    }
                    <Layout style={
                        [
                            styles.mainBlock,
                            view === 'ADD' && styles.mainBlockShorter,
                            view === 'CARDS' && styles.mainBlockLonger
                        ]
                    }>
                        { view === 'CARDS' &&
                            <Cards
                                deck={ deck }
                                cardsView={ cardsView }
                                setCardsView={ setCardsView }
                                storeDeckData={ storeDeckData }
                            />
                        }
                        { view === 'LIST' &&
                            <List />
                        }
                        {
                            view === 'ADD' &&
                            <SearchResults results={ addSearchWords } />
                        }
                        { view === 'SETTINGS' &&
                            <>
                                <Button
                                    title='Fill Wallet with Demo Words'
                                    onPress={ () => storeData( DEMO_WORDS ) }
                                />
                                <Button
                                    title='Wipe Everything'
                                    onPress={ () => storeData( [] ) }
                                />
                                <Button
                                    title='Wipe Deck'
                                    onPress={ () => storeDeckData( [], 0 ) }
                                />
                            </>
                        }
                    </Layout>
                    <Layout style={ styles.bottomZone }>
                        <BottomMenu />
                    </Layout>
                </AppContext.Provider>
            </ApplicationProvider>
        </>
    );
};
