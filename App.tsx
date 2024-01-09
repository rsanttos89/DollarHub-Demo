import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

import Routes from './src/routes';
import Provider from './src/context/auth';
import ProviderForm from './src/context/form';

export default function App() {
  return (
    <Provider>
      <ProviderForm>
        <SafeAreaView style={{flex: 1, backgroundColor: '#242425'}}>
          <Routes />
          <StatusBar style="light" backgroundColor='#242425' />
      </SafeAreaView>
      </ProviderForm>
    </Provider>
  );
}