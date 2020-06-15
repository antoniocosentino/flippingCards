import React from 'react';
import {
  BottomNavigation,
  BottomNavigationTab,
  Icon,
  ApplicationProvider,
  IconRegistry,
  Layout,
  Text,
} from '@ui-kitten/components';

import { StyleSheet } from 'react-native';

import * as eva from '@eva-design/eva';
import { EvaIconsPack } from '@ui-kitten/eva-icons';


const ListIcon = (props) => <Icon {...props} name="list-outline" />;
const CardsIcon = (props) => <Icon {...props} name="grid-outline" />;
const PlusIcon = (props) => <Icon {...props} name="plus-circle-outline" />;
const PlayIcon = (props) => <Icon {...props} name="award-outline" />;
const SettingsIcon = (props) => <Icon {...props} name="settings-2-outline" />;

const styles = StyleSheet.create({
    text: {
      textAlign: 'center',
      color: '#000000'
    },
  });

export default () => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.light}>
        <Layout
          style={{ flex: 11, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={styles.text} category='h1'>FlipCards</Text>
        </Layout>
        <Layout
          style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 20 }}>
          <BottomNavigation
            selectedIndex={selectedIndex}
            onSelect={(index) => setSelectedIndex(index)}>
            <BottomNavigationTab icon={ListIcon} />
            <BottomNavigationTab icon={CardsIcon} />
            <BottomNavigationTab icon={PlusIcon} />
            <BottomNavigationTab icon={PlayIcon} />
            <BottomNavigationTab icon={SettingsIcon} />
          </BottomNavigation>
        </Layout>
      </ApplicationProvider>
    </>
  );
};
