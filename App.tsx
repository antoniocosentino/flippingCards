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
import { styles, mainColor } from './styles/styles';
import { List } from './views/List';
import { BottomMenu } from './views/BottomMenu';
import { SearchResults } from './components/SearchResults';
import { removeArticle } from './utils/utils';
import { Cards } from './views/Cards';

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

    // DEFAULT VIEW IS DEFINED HERE
    const [ view, setView ] = React.useState( 'CARDS' );

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
        // TODO: tackle duplicates

        const walletCopy = [...wordsWallet ];
        walletCopy.unshift( word );

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

    const query = `select * from dictionary where de LIKE '${ removeArticle( addSearch ) }%' LIMIT 10`;

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

    const colorOverrides = {
        'color-basic-100': '#FFFFFF',
        'color-basic-1000': '#151A30',
        'color-basic-1100': '#101426',
        'color-basic-200': '#F7F9FC',
        'color-basic-300': '#EDF1F7',
        'color-basic-400': '#E4E9F2',
        'color-basic-500': '#C5CEE0',
        'color-basic-600': '#8F9BB3',
        'color-basic-700': '#2E3A59',
        'color-basic-800': '#222B45',
        'color-basic-900': '#1A2138',
        'color-danger-100': '#FFF2F2',
        'color-danger-200': '#FFD6D9',
        'color-danger-300': '#FFA8B4',
        'color-danger-400': '#FF708D',
        'color-danger-500': '#FF3D71',
        'color-danger-600': '#DB2C66',
        'color-danger-700': '#B81D5B',
        'color-danger-800': '#94124E',
        'color-danger-900': '#700940',
        'color-info-100': '#F2F8FF',
        'color-info-200': '#C7E2FF',
        'color-info-300': '#94CBFF',
        'color-info-400': '#42AAFF',
        'color-info-500': '#0095FF',
        'color-info-600': '#006FD6',
        'color-info-700': '#0057C2',
        'color-info-800': '#0041A8',
        'color-info-900': '#002885',
        'color-primary-100': '#F2F6FF',
        'color-primary-200': '#D9E4FF',
        'color-primary-300': '#A6C1FF',
        'color-primary-400': '#598BFF',
        'color-primary-500': mainColor,
        'color-primary-600': mainColor, // this is the onPress color. Can be customized
        'color-primary-700': '#1A34B8',
        'color-primary-800': '#102694',
        'color-primary-900': '#091C7A',
        'color-success-100': '#EDFFF3',
        'color-success-200': '#B3FFD6',
        'color-success-300': '#8CFAC7',
        'color-success-400': '#51F0B0',
        'color-success-500': '#00E096',
        'color-success-600': '#00B383',
        'color-success-700': '#008F72',
        'color-success-800': '#007566',
        'color-success-900': '#00524C',
        'color-warning-100': '#FFFDF2',
        'color-warning-200': '#FFF1C2',
        'color-warning-300': '#FFE59E',
        'color-warning-400': '#FFC94D',
        'color-warning-500': '#FFAA00',
        'color-warning-600': '#DB8B00',
        'color-warning-700': '#B86E00',
        'color-warning-800': '#945400',
        'color-warning-900': '#703C00'
    };

    const customTheme = {
        ...eva.light,
        ...colorOverrides
    };

    const allShuffled = wordsWallet
        .map( ( a ) => ( { sort: Math.random(), value: a } ) )
        .sort( ( a, b ) => a.sort - b.sort )
        .map( ( a ) => a.value );


    const tenShuffled = allShuffled.slice( 0, 10 );

    tenShuffled.unshift( {
        de: '___firstItem___',
        en: '___firstItem___',
        wordType: '___firstItem___'
    } );

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
                            <Cards shuffled={ tenShuffled } />
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
