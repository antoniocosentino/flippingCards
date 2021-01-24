import React, { useContext } from 'react';

import { BottomNavigation, BottomNavigationTab, IconProps, Icon } from '@ui-kitten/components';

import { AppContext } from '../App';
import { styles } from '../styles/styles';
import { SvgXml } from 'react-native-svg';
import { plusSvg, challengeSvgBase, walletSvgBase, getCustomSvg } from '../utils/customIcons';

const ListIcon = ( props: IconProps ) => {

    return (
        <SvgXml
            width='32'
            height='32'
            xml={ getCustomSvg( walletSvgBase, props.style?.tintColor ) }
        />
    );
};

const CardsIcon = ( props: IconProps ) =>  <Icon { ...props } name='grid-outline' />;

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

const InfoIcon = ( props: IconProps ) => <Icon { ...props } name='info-outline' />;

export const BottomMenu = () => {

    const appData = useContext( AppContext );

    const { onMenuClick, selectedIndex } = appData;

    return (
        <BottomNavigation
            appearance={ 'noIndicator' }
            style={ styles.bottomWrapper }
            selectedIndex={ selectedIndex }
            onSelect={ ( index ) => onMenuClick( index ) }>
            <BottomNavigationTab icon={ ListIcon } />
            <BottomNavigationTab icon={ CardsIcon } />
            <BottomNavigationTab icon={ PlusIcon } />
            <BottomNavigationTab icon={ PlayIcon } />
            <BottomNavigationTab icon={ InfoIcon } />
        </BottomNavigation>
    );
};
