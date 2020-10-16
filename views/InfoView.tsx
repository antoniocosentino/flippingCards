import React, { useContext } from 'react';
import { AppContext } from '../App';
import { Layout, Text, Icon, IconProps } from '@ui-kitten/components';
import { styles } from '../styles/styles';
import { Image } from 'react-native';

import 'react-native-gesture-handler';

import { createStackNavigator } from '@react-navigation/stack';

const FlexiIcon = ( settingsIconProps: IconProps ) => (
    <Icon { ...settingsIconProps } width={ 22 } height={ 22 } fill='#333' />
);

const Stack = createStackNavigator();

export const InfoView = () => {
    return (
        <Layout style={ styles.stackNavigatorWrapper } >
            <Stack.Navigator
                screenOptions={ {
                    cardStyle: { backgroundColor: '#fff' }
                } }
            >
                <Stack.Screen
                    name='infoMainView'
                    component={ InfoMainView }
                    options={ {
                        title: '',
                        headerStyle: {
                            shadowColor: 'transparent'
                        }
                    } }
                />
                <Stack.Screen
                    name='infoSecondView'
                    component={ InfoSecondView }
                    options={ {
                        title: 'App Info',
                        headerStyle: {
                            shadowColor: 'transparent'
                        }
                    } }
                />
            </Stack.Navigator>
        </Layout>
    );
};


const InfoSecondView = () => {

    return (
        <Layout>
            <Text style={ styles.text }>some stuff will go here</Text>
        </Layout>
    );
};

const InfoMainView = ( props: any ) => { // TODO: types

    const { navigation } = props;

    const appData = useContext( AppContext );
    const { setView } = appData;

    return (
        <>
            <Layout
                style={ styles.centeredElement }
            >
                <Image
                    source={ require( './../img/icon.png' ) }
                    style={ styles.iconImage }
                />
                <Text style={ [ styles.text, styles.boldText, styles.biggerText, styles.textWithTopMargin ] }>
                    Flipping Cards
                </Text>

                <Text style={ [ styles.text, styles.smallerText ] }>
                    Antonio Cosentino © 2020
                </Text>
            </Layout>

            <Layout
                style={ styles.verticalSpacer }
            />

            <Layout
                style={ styles.infoContainer }
            >
                <Layout style={ styles.infoColOne }>
                    <FlexiIcon name='globe-outline' />
                </Layout>

                <Layout style={ styles.infoColTwo }>
                    <Text style={ [ styles.text, styles.boldText, styles.biggerText ] }>Target Language</Text>
                </Layout>

                <Layout style={ styles.infoColThree }>
                    <Text style={ [ styles.text, styles.lightText, styles.leftAlignedText  ] }>German</Text>
                </Layout>
            </Layout>

            <Layout
                style={ styles.infoContainer }
            >
                <Layout style={ styles.infoColOne }>
                    <FlexiIcon name='globe-outline' />
                </Layout>

                <Layout style={ styles.infoColTwo }>
                    <Text style={ [ styles.text, styles.boldText, styles.biggerText ] }>Translation Language</Text>
                </Layout>

                <Layout style={ styles.infoColThree }>
                    <Text style={ [ styles.text, styles.lightText, styles.leftAlignedText ] }>English</Text>
                </Layout>
            </Layout>

            <Layout style={ styles.versionBox } >
                <Text style={ [ styles.text, styles.leftAlignedText, styles.smallerText ] }>
                    Flipping Cards is currently only available with German dictionary and English translation.
                </Text>
            </Layout>

            <Layout
                style={ styles.backupDivider }
            />

            <Layout
                style={ styles.infoContainer }
            >
                <Layout style={ styles.infoColOne }>
                    <FlexiIcon name='info-outline' />
                </Layout>

                <Layout style={ styles.infoColTwo }>
                    <Text
                        style={ [ styles.text, styles.boldText, styles.biggerText ] }
                        onPress={ () => navigation.navigate( 'infoSecondView' ) }
                    >
                        App info
                    </Text>
                </Layout>

                <Layout style={ styles.infoColThree } />
            </Layout>

            <Layout
                style={ styles.infoContainer }
            >
                <Layout style={ styles.infoColOne }>
                    <FlexiIcon name='external-link-outline' />
                </Layout>

                <Layout style={ styles.infoColTwo }>
                    <Text style={ [ styles.text, styles.boldText, styles.biggerText ] }>App Homepage</Text>
                </Layout>

                <Layout style={ styles.infoColThree } />
            </Layout>

            <Layout
                style={ styles.backupDivider }
            />

            <Layout style={ styles.versionBox } >
                <Text style={ [ styles.text, styles.boldText, styles.leftAlignedText, styles.biggerText ] }>1.0 Beta</Text>
                <Text onPress={ () => setView( 'DEBUG' ) } style={ [ styles.text, styles.leftAlignedText, styles.smallerText ] }>App version</Text>
            </Layout>
        </>
    );
};
