import React from 'react';
import {
    ApplicationProvider,
    IconRegistry,
    Layout,
    Text,
    Input
} from '@ui-kitten/components';

import { Button } from 'react-native';
import * as eva from '@eva-design/eva';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import AsyncStorage from '@react-native-community/async-storage';
import { DEMO_WORDS } from './utils/demoData';
import { styles } from './styles/styles';
import { List } from './views/List';
import { BottomMenu } from './views/BottomMenu';

type TSingleWord = {
    de: string,
    en: string
}

type TWordsWallet = ReadonlyArray<TSingleWord>

type TAppData = {
    wordsWallet: TWordsWallet,
    selectedIndex: number,
    onMenuClick: ( index: number ) => void
};

export const AppContext = React.createContext( {} as TAppData );

export default () => {
    const [ selectedIndex, setSelectedIndex ] = React.useState( 0 );

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

    const appData = { wordsWallet,
        selectedIndex,
        onMenuClick
    };

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
                    { view !== 'LIST' &&
                        <Layout style={ styles.topSpacer } />
                    }
                    <Layout style={ styles.mainBlock }>
                        { view === 'LIST' &&
                            <List />
                        }
                        {
                            view === 'ADD' &&
                            <>
                                <Text style={ styles.text } category='h1'>Add new word</Text>
                                <Button
                                    title='boh'
                                    onPress={ () => storeData( DEMO_WORDS ) }
                                >
                                    store data
                                </Button>
                                <Button
                                    title='boh2'
                                    onPress={ () => getData() }
                                >
                                    get data
                                </Button>

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
