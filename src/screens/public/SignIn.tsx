import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';

import insert from '../../server/insertUser';

import { userProfile } from '../../context/auth';

WebBrowser.maybeCompleteAuthSession();

export default function SignIn() {
  const animation = useRef(null);
  const { setProfile } = userProfile()

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: '...'
  });

  const handleGoogleSignIn = () => {
    promptAsync();
  }

  const handleSignInWith = async () => {
    try {
      if (response && response.type === "success") {
        await getUserInfo(response.authentication.accessToken);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const getUserInfo = async (token: string) => {
    if (!token) {
      console.error("Token inválido.");
      return;
    }

    try {
      const response = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        console.error(`Erro na solicitação: ${response.status}`);
        return;
      }

      const user = await response.json();

      if (!user || !user.id || !user.email || !user.name) {
        console.error("Dados de usuário inválidos recebidos:", user);
        return;
      }

      const insertResponse = await insert({
        id: user.id,
        email: user.email,
        name: user.name,
        given_name: user.given_name,
        family_name: user.family_name,
        picture: user.picture,
      }).insertUser();

      if (insertResponse.success) {
        await AsyncStorage.setItem("@user", JSON.stringify(user));

        setTimeout(() => {
          setProfile(user);
        }, 1000);
      } else {
        console.error(`Erro ao inserir dados: ${insertResponse.message}`);
      }
    } catch (error) {
      console.error("Erro durante a execução da solicitação ou inserção de dados:", error);
    }
  };

  useEffect(() => {
    handleSignInWith();
  }, [response]);

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
        source={require('../../assets/chart.json')}
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

      {!response ? 
        <>
          <TouchableOpacity style={{
            width: '80%',
            backgroundColor: '#835BF2',
            height: 60,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 60/2,
          }} onPress={handleGoogleSignIn}>
            <Text style={{
              color: '#fff',
              textTransform: 'uppercase',
              fontWeight: 'bold',
              fontSize: 16,
            }}>Google</Text>
          </TouchableOpacity> 
        </>
      : 
        <>
          <View style={{
            width: '80%',
            backgroundColor: '#242425',
            height: 60,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 60/2,
          }}>
            <ActivityIndicator size="large" color="#835BF2" />
          </View> 
        </>
      }
    </View>
  );
}