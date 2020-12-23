import React, { useContext } from 'react';
import { Layout, Text, Icon, IconProps } from '@ui-kitten/components';
import { styles } from '../styles/styles';
import { Image, Linking } from 'react-native';
import { AppContext } from '../App';

import 'react-native-gesture-handler';

import { createStackNavigator } from '@react-navigation/stack';

import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

export const FlexiIcon = ( settingsIconProps: IconProps ) => (
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
                        headerLeft: () => null,
                        headerStyle: {
                            shadowColor: 'transparent',
                            elevation: 0
                        }
                    } }
                />
                <Stack.Screen
                    name='infoSecondView'
                    component={ InfoSecondView }
                    options={ {
                        headerShown: true,
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
        <>
            <Layout style={ styles.versionBox }>
                <Text>{ '\n' }</Text>
                <Text style={ [ styles.text, styles.titleTextSmall ] } category='h1'>About Flipping Cards</Text>
                <Text style={ [ styles.text, styles.leftAlignedText, styles.smallerText ] }>
                    { '\n' }
                    Flipping Cards is an iOS/Android app that allows you to learn German words faster by creating flash cards with your own selection of words.
                    { '\n\n' }
                    <Text style={ [ styles.boldText ] }>App Development, UI/UX, Icon Design:</Text>
                    { '\n' }
                    Antonio Cosentino © 2020
                    { '\n' }
                    <Text
                        style={ [ styles.text, styles.leftAlignedText, styles.smallerText, styles.linkText ] }
                        onPress={ () => Linking.openURL( 'https://antoniocosentino.com' ) }
                    >
                        antoniocosentino.com
                    </Text>
                    { '\n\n' }
                    <Text style={ [ styles.boldText ] }>Illustrations:</Text>
                    { '\n' }
                    <Text
                        style={ [ styles.text, styles.leftAlignedText, styles.smallerText, styles.linkText ] }
                        onPress={ () => Linking.openURL( 'https://www.manypixels.co' ) }
                    >
                        manypixels.co
                    </Text>
                    { '\n\n' }
                    <Text style={ [ styles.boldText ] }>Mobile Application Framework:</Text>
                    { '\n' }
                    React Native
                    { '\n' }
                    <Text
                        style={ [ styles.text, styles.leftAlignedText, styles.smallerText, styles.linkText ] }
                        onPress={ () => Linking.openURL( 'https://reactnative.dev' ) }
                    >
                        reactnative.dev
                    </Text>
                    { '\n\n' }
                    <Text style={ [ styles.boldText ] }>UI Framework:</Text>
                    { '\n' }
                    UI Kitten
                    { '\n' }
                    <Text
                        style={ [ styles.text, styles.leftAlignedText, styles.smallerText, styles.linkText ] }
                        onPress={ () => Linking.openURL( 'https://akveo.github.io/react-native-ui-kitten' ) }
                    >
                        akveo.github.io/react-native-ui-kitten
                    </Text>
                </Text>
            </Layout>
        </>
    );
};

const InfoMainView = ( props: any ) => { // TODO: types

    const appData = useContext( AppContext );

    const { increaseTapsCount } = appData;

    const { navigation } = props;

    return (
        <>
            <Layout
                style={ styles.centeredElement }
            >
                <TouchableWithoutFeedback onPress={ increaseTapsCount }>
                    <Image
                        source={ require( './../img/icon.png' ) }
                        style={ styles.iconImage }
                    />
                </TouchableWithoutFeedback>

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
                    <FlexiIcon name='star-outline' />
                </Layout>

                <Layout style={ styles.infoColTwo }>
                    <Text style={ [ styles.text, styles.boldText, styles.biggerText ] }>Your Language</Text>
                </Layout>

                <Layout style={ styles.infoColThree }>
                    <Text style={ [ styles.text, styles.lightText, styles.leftAlignedText ] }>English</Text>
                </Layout>
            </Layout>

            <Layout style={ styles.versionBox } >
                <Text style={ [ styles.text, styles.leftAlignedText, styles.smallerText ] }>
                    Currently only German dictionary and English translations are available. More languages are coming soon.
                </Text>
            </Layout>

            <Layout
                style={ styles.backupDivider }
            />

            <Layout
                style={ styles.infoContainer }
            >
                <Layout style={ styles.infoColOne }>
                    <FlexiIcon name='info-outline' onPress={ () => navigation.navigate( 'infoSecondView' ) } />
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
                    <FlexiIcon
                        name='external-link-outline'
                        onPress={ () => Linking.openURL( 'https://github.com/antoniocosentino/flipCards' ) }
                    />
                </Layout>

                <Layout style={ styles.infoColTwo }>
                    <Text
                        style={ [ styles.text, styles.boldText, styles.biggerText ] }
                        onPress={ () => Linking.openURL( 'https://github.com/antoniocosentino/flipCards' ) }
                    >
                        App Homepage
                    </Text>
                </Layout>

                <Layout style={ styles.infoColThree } />
            </Layout>

            <Layout
                style={ styles.backupDivider }
            />

            <Layout style={ styles.versionBox } >
                <Text style={ [ styles.text, styles.boldText, styles.leftAlignedText, styles.biggerText ] }>1.0</Text>
                <Text
                    style={ [ styles.text, styles.leftAlignedText, styles.smallerText ] }>
                        App version
                </Text>
            </Layout>
        </>
    );
};
