import React, { useContext } from 'react';
import { Text, Button, Layout } from '@ui-kitten/components';
import { AppContext, dbRefresh } from '../App';
import { DEMO_WORDS_DEBUG } from '../utils/demoData.debug';
import { storeDBversion } from '../App';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../styles/styles';

export const DebugMode = () => {

    const appData = useContext( AppContext );
    const { storeData } = appData;

    return (
        <SafeAreaView style={ styles.mainViewWrapper }>
            <Layout style={ styles.centeredElement }>
                <Button
                    onPress={ () => storeData( DEMO_WORDS_DEBUG ) }
                >
                    Fill Wallet with Debug Demo Words
                </Button>

                <Text />

                <Button
                    onPress={ () => storeData( [] ) }
                >
                    Wipe Wallet
                </Button>

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
    );
};
