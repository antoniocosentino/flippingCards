import React, { useContext } from 'react';

import { BottomNavigation, BottomNavigationTab, IconProps, Icon } from '@ui-kitten/components';

import { AppContext } from '../App';
import { styles } from '../styles/styles';
import { SvgXml } from 'react-native-svg';
import { plusSvg } from '../utils/customIcons';

const ListIcon = ( props: IconProps ) => <Icon { ...props } name='list-outline' />;
const CardsIcon = ( props: IconProps ) => <Icon { ...props } name='grid-outline' />;
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
const PlayIcon = ( props: IconProps ) => <Icon { ...props } name='award-outline' />;
const SettingsIcon = ( props: IconProps ) => <Icon { ...props } name='settings-2-outline' />;

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
            <BottomNavigationTab icon={ SettingsIcon } />
        </BottomNavigation>
    );
};
