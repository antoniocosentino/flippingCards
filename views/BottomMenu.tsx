import React, { useContext } from 'react';

import { BottomNavigation, BottomNavigationTab, IconProps, Layout } from '@ui-kitten/components';

import { AppContext } from '../App';
import { styles } from '../styles/styles';
import { SvgXml } from 'react-native-svg';
import { plusSvg, challengeSvgBase, walletSvgBase, infoSvgBase, getCustomSvg, cardsSvgBase } from '../utils/customIcons';

const ListIcon = ( props: IconProps ) => {

    return (
        <SvgXml
            width='32'
            height='32'
            xml={ getCustomSvg( walletSvgBase, props.style?.tintColor ) }
        />
    );
};

const CardsIcon = ( props: IconProps ) => {

    return (
        <SvgXml
            width='32'
            height='32'
            xml={ getCustomSvg( cardsSvgBase, props.style?.tintColor ) }
        />
    );
};

const PlusIcon = () => {
    return (
        <SvgXml
            width='44'
            height='44'
            xml={ plusSvg }
            style={ styles.plusIcon }
        />
    );
};

const PlayIcon = ( props: IconProps ) => {
    return (
        <SvgXml
            width='32'
            height='32'
            xml={ getCustomSvg( challengeSvgBase, props.style?.tintColor ) }
        />
    );
};

const InfoIcon = ( props: IconProps ) => {
    return (
        <SvgXml
            width='32'
            height='32'
            xml={ getCustomSvg( infoSvgBase, props.style?.tintColor ) }
        />
    );
};

export const BottomMenu = () => {

    const appData = useContext( AppContext );

    const { onMenuClick, selectedIndex, deviceNotchSize } = appData;

    return (
        <Layout style={ styles.bottomZone }>
            <BottomNavigation
                appearance={ 'noIndicator' }
                style={
                    [
                        styles.bottomWrapper,
                        deviceNotchSize > 0 && styles['bottomWrapper--withNotch']
                    ]
                }
                selectedIndex={ selectedIndex }
                onSelect={ ( index ) => onMenuClick( index ) }>
                <BottomNavigationTab icon={ ListIcon } />
                <BottomNavigationTab icon={ CardsIcon } />
                <BottomNavigationTab icon={ PlusIcon } />
                <BottomNavigationTab icon={ PlayIcon } />
                <BottomNavigationTab icon={ InfoIcon } />
            </BottomNavigation>
        </Layout>
    );
};
