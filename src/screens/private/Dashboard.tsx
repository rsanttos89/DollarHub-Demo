import React, { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { MaterialIcons, Ionicons, Entypo, FontAwesome5, FontAwesome } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';

import Chart from '../../components/Chart';
import dashboard from '../../server/selectDashboard';
import { userCount } from '../../context/form';

// import { userSessiont } from '../../context/auth';

interface UserProfile {
  email: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  id: string;
}

export default function Home({navigation}) {
  const animation = useRef(null);
  const { count } = userCount();

  const [responseSelectDashboard, setResponseSelectDashboard] = useState({} as any);
  const [profile, setProfile] = useState<UserProfile>();

  const [ monthYear, setMonthYear ] = useState('month');
  const handleButtonClick = (value) => {
    setMonthYear(value);
  };

  const formatCurrency = (value: string) => {
    if (value === null || value === undefined) {
      return 'R$ 0,00';
    }
  
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(parseFloat(value));
  };

  // const { setSession } = userSessiont();

  // const handleGoogleLogout = async () => {
  //   try {
  //     await AsyncStorage.removeItem("@user");
  //     setSession(false);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  const handleSignInWith = async () => {
    try {
      const user = await AsyncStorage.getItem("@user");
      
      if (user) {
        const userString = JSON.parse(user) as UserProfile;
        setProfile(userString);
      }
    } catch (error) {
      console.error('Error retrieving user data:', error);
    }
  }

  useEffect(() => {
    handleSignInWith();
  }, []);

  /** FUNCTION SALUTATION */
  const hours = new Date();
  const salutations = hours.getHours();
  const [salutation, setSalutation] = useState('');

  useEffect(() => {    
    if (salutations >= 0 && salutations <= 11) {
      setSalutation("Bom Dia");
    } else if (salutations >= 12 && salutations <= 18) {
      setSalutation("Boa Tarde");
    } else if (salutations >= 19 && salutations <= 23) {
      setSalutation("Boa Noite");
    } else {
      setSalutation("Hello");
    }
  },[salutation]);

  /** FUNCTIONS ROUTES */
  function active() {
    navigation.navigate('Details', { 
      user_id: profile.id,
      monthYear,
      whichTable: 'active',
      color: '#41C7E0',
      title: 'ATIVOS', 
     });
  }

  function liabilities() {
    navigation.navigate('Details', { 
      user_id: profile.id,
      monthYear,
      whichTable: 'liabilities',
      color: '#E06E41',
      title: 'PASSIVOS', 
     });
  }

  function fixedExpenses() {
    navigation.navigate('Details', { 
      user_id: profile.id,
      monthYear,
      whichTable: 'fixed_expenses',
      color: '#835BF2',
      title: 'DESPESAS FIXA', 
     });
  }

  function patrimony() {
    navigation.navigate('Details', { 
      user_id: profile.id,
      monthYear,
      whichTable: 'patrimony',
      color: '#41e093',
      title: 'PATRIMÔNIO', 
     });
  }

  /** SELECT DASHBOARD */
  const user_id = profile?.id;
  const DashboardInstance = dashboard({ user_id, monthYear });

  const selectDashboard = async () => {
    try {
      const response = await DashboardInstance.select();
      setResponseSelectDashboard(response);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro!", "Ocorreu um erro ao processar a solicitação.");
      setResponseSelectDashboard({ success: false, message: "Erro desconhecido" });
    }
  };

  useEffect(() => {
    if (user_id) {
      selectDashboard();
    }
  }, [user_id, monthYear, count]);
    
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          {profile ? 
            <Image
              style={styles.picture}
              source={{ uri: profile.picture }}
            />
          :
            <View style={styles.picture}>
              <FontAwesome name="user-circle-o" size={24} color="#fff" />
            </View>
          }

          <View>
            <Text style={[styles.title, {opacity: 0.7, fontSize: 12}]}>Olá, {salutation}</Text>
            <Text style={styles.title}>{!profile ? '' : profile.name}</Text>
          </View>
        </View>

        {/**------------------------------------------------------------------------------------ */}

        {profile ? 
          <Chart response={responseSelectDashboard} />
        :
          <LottieView
            autoPlay
            ref={animation}
            style={{
              height: 275,
              backgroundColor: '#242425',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            source={require('../../assets/loading.json')}
          />
        }

        {/**------------------------------------------------------------------------------------ */}
        <View style={styles.boxBtns}>
          <TouchableOpacity 
            style={[styles.btn, {backgroundColor: monthYear === 'month' ? '#242425' : '#191A18'}]}
            onPress={() => handleButtonClick('month')}
          >
            <Text style={styles.txtBtn}>Mês</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.btn, {backgroundColor: monthYear === 'year' ? '#242425' : '#191A18'}]}
            onPress={() => handleButtonClick('year')}
          >
            <Text style={styles.txtBtn}>Ano</Text>
          </TouchableOpacity>
        </View>

        {/**------------------------------------------------------------------------------------ */}
        <ScrollView
          style={{width: '100%'}}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingVertical: 8,
            paddingHorizontal: 16,
            gap: 16,
          }}
        >

          {/**------------------------------------------------------------------------------------ */}
          <TouchableOpacity style={[styles.card, {borderLeftWidth: 1, borderLeftColor: '#41C7E0'}]} onPress={() => active()}>
            <View style={styles.boxIcon}>
              <Entypo name="emoji-happy" size={42} color="#ccc" />
            </View>

            <View style={{flex: 1, paddingHorizontal: 16}}>
              <Text style={[styles.txtInfo,{color:'#fff', fontSize: 10}]}>ativos</Text>
              <Text style={[styles.txtInfo,{color:'#fff', fontSize: 20}]}>{formatCurrency(responseSelectDashboard.total_coin_active)}</Text>
              <Text style={[styles.txtInfo,{color:'#fff', fontSize: 10}]}>tudo que coloca dinheiro no seu bolso</Text>
            </View>

            <MaterialIcons name="keyboard-arrow-right" size={24} color="#41C7E0" />
          </TouchableOpacity>

          {/**------------------------------------------------------------------------------------ */}
          <TouchableOpacity style={[styles.card, {borderLeftWidth: 1, borderLeftColor: '#E06E41'}]} onPress={() => liabilities()}>
            <View style={styles.boxIcon}>
              <Entypo name="emoji-sad" size={42} color="#ccc" />
            </View>

            <View style={{flex: 1, paddingHorizontal: 16}}>
              <Text style={[styles.txtInfo,{color:'#fff', fontSize: 10}]}>passivos</Text>
              <Text style={[styles.txtInfo,{color:'#fff', fontSize: 20}]}>{formatCurrency(responseSelectDashboard.total_coin_liabilities)}</Text>
              <Text style={[styles.txtInfo,{color:'#fff', fontSize: 10}]}>tudo que tira dinheiro no seu bolso</Text>
            </View>

            <MaterialIcons name="keyboard-arrow-right" size={24} color="#E06E41" />
          </TouchableOpacity>

          {/**------------------------------------------------------------------------------------ */}
          <TouchableOpacity style={[styles.card, {borderLeftWidth: 1, borderLeftColor: '#835BF2'}]} onPress={() => fixedExpenses()}>
            <View style={styles.boxIcon}>
              <Entypo name="cycle" size={40} color="#ccc" />
            </View>

            <View style={{flex: 1, paddingHorizontal: 16}}>
              <Text style={[styles.txtInfo,{color:'#fff', fontSize: 10}]}>custo de vida</Text>
              <Text style={[styles.txtInfo,{color:'#fff', fontSize: 20}]}>{formatCurrency(responseSelectDashboard.total_coin_fixed_expenses)}</Text>
              <Text style={[styles.txtInfo,{color:'#fff', fontSize: 10}]}>despesas fixas...</Text>
            </View>

            <MaterialIcons name="keyboard-arrow-right" size={24} color="#835BF2" />
          </TouchableOpacity>

          {/**------------------------------------------------------------------------------------ */}
          <TouchableOpacity style={[styles.card, {borderLeftWidth: 1, borderLeftColor: '#41e093'}]} onPress={() => patrimony()}>
            <View style={styles.boxIcon}>
              <Entypo name="credit" size={38} color="#ccc" />
            </View>

            <View style={{flex: 1, paddingHorizontal: 16}}>
              <Text style={[styles.txtInfo,{color:'#fff', fontSize: 10}]}>Patrimônio</Text>
              <Text style={[styles.txtInfo,{color:'#fff', fontSize: 20}]}>{formatCurrency(responseSelectDashboard.total_coin_patrimony)}</Text>
              <Text style={[styles.txtInfo,{color:'#fff', fontSize: 10}]}>Bens tangíveis, móveis, imóveis...</Text>
            </View>

            <MaterialIcons name="keyboard-arrow-right" size={24} color="#41e093" />
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#242425',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  header: {
    height: 75,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    alignItems: 'center',
  },

  notifications: {
    minHeight: 50,
    maxHeight: 50,
    maxWidth: 50,
    minWidth: 50,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#242425',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },

  picture: {
    minHeight: 50,
    maxHeight: 50,
    maxWidth: 50,
    minWidth: 50,
    borderRadius: 8,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontSize: 16,
    textTransform: 'uppercase',
    color: '#c6c6c6',
  },

  boxBtns: {
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    paddingVertical: 4,
    paddingHorizontal: 4,
    backgroundColor: '#191A18',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 40,
    height: 40,
    width: '50%',
    gap: 8,
  },

  btn: {
    flex: 1,
    height: '100%',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  txtBtn: {
    textTransform: 'uppercase',
    color: '#fff',
  },

  card: {
    height: 90,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#312F3A',
    paddingHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },

  boxIcon: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#242425',
    borderTopLeftRadius: 8,
    borderBottomRightRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 10,
  },
  
  txtInfo: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
    opacity: 0.7,
  },
  headerScrollView: {
    width: '100%',
    paddingRight: 24,
    paddingLeft: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
});