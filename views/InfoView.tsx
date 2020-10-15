import React, { Dispatch, SetStateAction } from 'react';

import { Layout, Text, Icon, IconProps } from '@ui-kitten/components';
import { styles } from '../styles/styles';
import { Image } from 'react-native';

const FlexiIcon = ( settingsIconProps: IconProps ) => (
    <Icon { ...settingsIconProps } width={ 22 } height={ 22 } fill='#333' />
);

type TInfoViewProps = {
    setView: Dispatch<SetStateAction<string>>
}

export const InfoView = ( props: TInfoViewProps ) => {

    const { setView } = props;

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
                    <Text style={ [ styles.text, styles.boldText, styles.biggerText ] }>App info</Text>
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
