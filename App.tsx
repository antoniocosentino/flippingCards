import React, { useCallback, useEffect } from 'react';
import {
    ApplicationProvider,
    IconRegistry,
    Layout,
    Input
} from '@ui-kitten/components';

import { debounce } from 'lodash';
import { Button } from 'react-native';
import * as eva from '@eva-design/eva';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import AsyncStorage from '@react-native-community/async-storage';
import { DEMO_WORDS } from './utils/demoData';
import { styles } from './styles/styles';
import { List } from './views/List';
import { BottomMenu } from './views/BottomMenu';
import { SearchResults } from './components/SearchResults';

const SQLite = require( 'react-native-sqlite-storage' );

const okCallback = () => {
    console.log( 'connected to DB' );
};

const errorCallback = () => {
    console.log( 'DB connection error' );
};

const db = SQLite.openDatabase( { name: 'dictionary.db', createFromLocation: 1 }, okCallback, errorCallback );

export type TSingleWord = {
    de: string,
    en: string,
    wordType: string // TODO: we can be more specific here with types
}

export type TWordsWallet = ReadonlyArray<TSingleWord>

type TAppData = {
    wordsWallet: TWordsWallet,
    selectedIndex: number,
    onMenuClick: ( index: number ) => void,
    storeData: ( value: TWordsWallet ) => void
    addSingleWord: ( word: TSingleWord ) => void
};

export type TSearchWords = ReadonlyArray<TSingleWord>;

export const AppContext = React.createContext( {} as TAppData );

export default () => {
    const [ selectedIndex, setSelectedIndex ] = React.useState( 0 );

    const [ view, setView ] = React.useState( 'ADD' ); // LIST

    useEffect( () => {
        setAddSearchWords( [] );
        setAddSearch( '' );
    }, [ view ] );

    const [ isDataUpdated, setDataUpdated ] = React.useState( false );

    const storeData = async ( value: TWordsWallet ) => {
        setDataUpdated( false );
        try {
            const jsonValue = JSON.stringify( value );
            await AsyncStorage.setItem( '@wordsWallet', jsonValue );
        } catch ( e ) {
            console.error( 'Error:', e );
        }
    };

    const addSingleWord = ( word: TSingleWord ) => {
        console.log( 'I will add the word ' + word.de +  'to the list bro' );
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

    if ( !isDataUpdated ){
        getData();
        setDataUpdated( true );
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

    const showTopSpacer = view !== 'LIST' && view !== 'ADD';

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

    const query = `select * from dictionary where de LIKE '${ addSearch }%' LIMIT 7`;

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


    return (
        <>
            <IconRegistry icons={ EvaIconsPack } />
            <ApplicationProvider { ...eva } theme={ eva.light }>
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
                            <Input
                                autoFocus={ true }
                                autoCorrect={ false }
                                style={ styles.addWordInput }
                                placeholder='Type the word you want to enter'
                                value={ addSearch }
                                onChangeText={ nextValue => setAddSearchWrapper( nextValue ) }
                                size={ 'large' }
                            />
                        </Layout>
                    }
                    { showTopSpacer &&
                        <Layout style={ styles.topSpacer } />
                    }
                    <Layout style={
                        [
                            styles.mainBlock,
                            view === 'ADD' && styles.mainBlockShorter
                        ]
                    }>
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
