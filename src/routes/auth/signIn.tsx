import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SignIn from '../../screens/public/SignIn';

function Stack() {
  const { Navigator, Screen } = createNativeStackNavigator();
  return (
    <Navigator>
      <Screen 
        name="SignIn"
        component={SignIn}
        options={{ headerShown: false }}
      />
    </Navigator>
  );
}

export default Stack;