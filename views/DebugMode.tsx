import React, { useContext } from 'react';
import { Text, Button, Layout } from '@ui-kitten/components';
import { AppContext, dbRefresh, enrichDecksWithPlaceholder } from '../App';
import { DEMO_WORDS_DEBUG } from '../utils/demoData.debug';
import { storeDBversion } from '../App';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../styles/styles';
import { DEMO_DECKS } from '../utils/demoDecks';
import { BottomMenu } from './BottomMenu';

export const DebugMode = () => {

    const appData = useContext( AppContext );
    const { storeData, storeDecksData, setWordsWallet, setDecksData } = appData;

    return (
        <Layout style={ styles.megaWrap } >
            <SafeAreaView style={ styles.mainViewWrapper }>
                <Layout style={ styles.centeredElement }>
                    <Button
                        onPress={ () => {
                            storeData( DEMO_WORDS_DEBUG ).then( () => {
                                setWordsWallet( DEMO_WORDS_DEBUG );
                            } );
                        } }
                    >
                        Fill Wallet with Demo Words
                    </Button>

                    <Text />

                    <Button
                        onPress={ () => {
                            storeData( [] ).then( () => {
                                setWordsWallet( [] );
                            } );
                        } }
                    >
                        Wipe Wallet
                    </Button>

                    <Text />
                    <Text />

                    <Button
                        onPress={ () => {
                            storeDecksData( DEMO_DECKS ).then( () => {
                                setDecksData( enrichDecksWithPlaceholder( DEMO_DECKS ) );
                            } );
                        } }
                    >
                        Fill Decks with Demo Decks
                    </Button>

                    <Text />

                    <Button
                        onPress={ () => {
                            storeDecksData( [] ).then( () => {
                                setDecksData( [] );
                            } );
                        } }
                    >
                        Wipe Decks
                    </Button>

                    <Text />
                    <Text />

                    <Button
                        onPress={ dbRefresh }
                    >
                        Force DB refresh
                    </Button>

                    <Text />

                    <Button
                        onPress={ () => storeDBversion( '' ) }
                    >
                        Clear stored DB version
                    </Button>
                </Layout>
            </SafeAreaView>
            <BottomMenu />
        </Layout>
    );
};
