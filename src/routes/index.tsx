import React, { useEffect, useRef, useState } from 'react';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View, Text } from 'react-native';
import LottieView from 'lottie-react-native';

import SignIn from './auth/signIn';
import PrivateStack from './privateStack';
import { userProfile, userSessiont } from '../context/auth';

export default function Routes() {
  const { profile } = userProfile()
  const [ isLoading, setIsLoading] = useState(true);
  const { session, setSession } = userSessiont();
  const animation = useRef(null);

  const handleSignInWith = async () => {
    try {
      const user = await AsyncStorage.getItem("@user");
      if (!user) {
        setSession(false);
      }
    } catch (error) {
      console.error(error);
      // Trate o erro de forma apropriada aqui
    } finally {
      setIsLoading(false);
    }
  }

  const userSession = () => {
    if(profile) {
      setSession(true);
    }
  }

  useEffect(() => {
    handleSignInWith();
    userSession();
  }, [profile]);

  if(isLoading) {
    return (
      <View style={{
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'column',
        backgroundColor: '#242425',
        paddingVertical: 75,
        paddingHorizontal: 16,
      }}>
        <LottieView
          autoPlay
          ref={animation}
          style={{
            height: 275,
            backgroundColor: '#242425',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          source={require('../assets/chart.json')}
        />

        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{
            fontWeight: 'bold',
            color: '#ffffffc7',
            textTransform: 'none',
            textAlign: 'center',
            fontSize: 32,
            marginBottom: 16,
          }}>DollarHub{'\n'}Financeiro Pessoal</Text>

          <Text style={{
            fontWeight: 'bold',
            color: '#ffffffc7',
            textAlign: 'center',
            fontSize: 20,
          }}> Equilibre seu orçamento, economize{'\n'}e conquiste seus objetivos{'\n'}financeiros. </Text>
        </View>

        <View style={{
          width: '80%',
          backgroundColor: '#242425',
          height: 60,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 60/2,
        }}>
          <ActivityIndicator size="large" color="#b55bff" />
        </View> 
      </View>
    )
  }

  if(!session) {
    return (
      <NavigationContainer>
        <SignIn />
      </NavigationContainer>
    )
  }

  return (
    <NavigationContainer>
      <PrivateStack /> 
    </NavigationContainer>
  );
}