import React, { useCallback, useContext, useEffect } from 'react';
import { styles } from '../styles/styles';
import { SingleSearchResult } from './SingleSearchResult';
import { SafeAreaView, ScrollView } from 'react-native';
import { AppContext, TWords } from '../App';
import { Icon, IconProps, Input, Layout } from '@ui-kitten/components';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { debounce } from 'lodash';
import { removeArticle, uncapitalizeWord } from '../utils/utils';

export type TSearchResults = TWords;


export const AddToWallet = () => {
    const appData = useContext( AppContext );
    const { wordsWallet, db, deviceNotchSize } = appData;

    const [ addSearchKeyword, setAddSearchKeyword ] = React.useState( '' );
    const [ addSearchResults, setAddSearchResults ] = React.useState( [] as TSearchResults );
    const [ shouldQuery, setShouldQuery ] = React.useState( false );

    useEffect( () => {
        if ( addSearchKeyword === '' ) {
            setAddSearchResults( [] );
        }
    }, [ addSearchKeyword ] );

    const wipeSearch = () => {
        setAddSearchKeyword( '' );
    };

    const renderCloseIcon = ( props: IconProps ) => {
        if ( addSearchKeyword.length < 1 ) {
            return <></>;
        }

        return (
            <TouchableWithoutFeedback onPress={ wipeSearch }>
                <Icon { ...props } width={ 22 } height={ 22 } fill='#ccc' name={ 'close-circle' } />
            </TouchableWithoutFeedback>
        );
    };

    const setAddSearchKeywordWrapper = ( word: string ) => {
        setShouldQueryDebounced( true );
        setAddSearchKeyword( word );
    };

    const setShouldQueryDebounced = useCallback( debounce( setShouldQuery, 300 ), [] );

    const query = `select * from words where words MATCH '${ removeArticle( addSearchKeyword ) }*' AND rank MATCH 'bm25(10.0, 1.0)' GROUP BY de, en ORDER BY ( de = '${ removeArticle( uncapitalizeWord( addSearchKeyword ) ) }' ) desc, rank LIMIT 20`;

    if ( shouldQuery && addSearchKeyword !== '' ) {
        setShouldQuery( false );
        db.transaction( ( tx: any ) => {

            tx.executeSql( query, [], ( trans: any, results:any ) => {
                console.log( 'Query executed' );

                const len = results.rows.length;

                const tempAddSearchResults = [];

                for ( let i = 0; i < len; i++ ) {
                    let row = results.rows.item( i );

                    const tempObj = {
                        de: row.de,
                        en: row.en,
                        wordType: row.wordType
                    };

                    tempAddSearchResults.push( tempObj );
                }

                setAddSearchResults( tempAddSearchResults );
            },
            ( error: any ) => {
                console.log( 'Errors with the query', error );
            }
            );
        } );
    }


    return (
        <>
            <Layout style={ [
                styles.topContainer,
                deviceNotchSize > 0 ? styles['topContainer--withNotch'] : styles['topContainer--withoutNotch'],
                styles.coloredTopContainer
            ] }>
                <Layout style={ styles.addBar }>
                    <Layout style={ styles.addBarLeft }>
                        <Icon
                            onPress={ null } // TODO: navigation
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
                            value={ addSearchKeyword }
                            onChangeText={ nextValue => setAddSearchKeywordWrapper( nextValue ) }
                            size={ 'medium' }
                            accessoryRight={ renderCloseIcon }
                        />
                    </Layout>
                </Layout>
            </Layout>


            <SafeAreaView style={ styles.mainViewWrapper }>
                <ScrollView
                    keyboardDismissMode={ 'on-drag' }
                    keyboardShouldPersistTaps={ 'always' }
                >
                    {
                        addSearchResults.map( ( word, index ) => {

                            const isAlreadyThere = wordsWallet.find( ( walletWord ) => walletWord.de === word.de && walletWord.en === word.en );

                            return <SingleSearchResult isAlreadyThere={ Boolean( isAlreadyThere ) } word={ word } key={ index } />;
                        } )
                    }
                </ScrollView>
            </SafeAreaView>
        </>
    );
};

