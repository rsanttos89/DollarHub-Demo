import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

/** PAGES */
import Dashboard from '../../screens/private/Dashboard';
import Details from '../../screens/private/Details';
import InsertForm from '../../screens/private/InsertForm';

function Stack() {
  function getTitleFromRoute(route) {
    const { params } = route;
    if (params && params.title) {
      return params.title;
    }
    return 'Formulário';
  }

  /** RETURN STACK NAVIGATION */
  const { Navigator, Screen } = createNativeStackNavigator();
  return (
    <Navigator>
      <Screen 
        name="Dashboard"
        component={Dashboard}
        options={{ headerShown: false }}
      />

      <Screen 
        name="Details"
        component={Details}
          options={({ route }) => ({ 
            headerTintColor: '#fff',
            headerTitle: getTitleFromRoute(route),
            headerStyle: {backgroundColor: '#242425'},
          })}
      />

      <Screen 
        name="InsertForm"
        component={InsertForm}
          options={({ route }) => ({ 
            headerTintColor: '#fff',
            headerTitle: getTitleFromRoute(route),
            headerStyle: {backgroundColor: '#242425'},
          })}
      />
    </Navigator>
  );
}

export default Stack;