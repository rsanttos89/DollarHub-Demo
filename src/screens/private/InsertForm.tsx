import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, TextInput, Alert, Keyboard, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';

import insert from '../../server/insert';
import DataPicker from '../../components/DataPicker';
import { useSelecCategory, userDataPicker, userCount } from '../../context/form';
import ModalCategory from '../../components/ModalCategory';

interface UserProfile {
  email: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  id: string;
}

type FormProps = { params: { title: string, whichTable: string, color: string } };

export default function InsertForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { count, setCount } = userCount();
  
  const inputDescription: React.MutableRefObject<any> = useRef();
  const inputCoin: React.MutableRefObject<any> = useRef();

  const [profile, setProfile] = useState<UserProfile>();
  
  const { dataPicker } = userDataPicker();

  const route = useRoute() as FormProps;
  const { whichTable, color } = route.params;

  const [description, setDescription] = useState('');

  const { select, setSelect } = useSelecCategory();
  const [ others, setOthers ] = useState('');

  // Function to format money
  const [inputMoney, setInputMoney] = useState('');
  const inputMoneyFloat = inputMoney.replace(/\D/g, "").replace(/(\d)(\d{2})$/, "$1.$2");
  const formatMoney = inputMoney.replace(/\D/g, "").replace(/(\d)(\d{2})$/, "$1,$2").replace(/(?=(\d{3})+(\D))\B/g, ".");

  const handleSignInWith = async () => {
    try {
      const userString = await AsyncStorage.getItem("@user");
      
      if (userString) {
        const user = JSON.parse(userString) as UserProfile;
        setProfile(user);
      }
    } catch (error) {
      console.error('Error retrieving user data:', error);
    }
  }

  useEffect(() => {
    handleSignInWith();
  }, []);

  const checking = async () => {
    setIsLoading(true);

    const isOutrosSelected = select === 'Outros';
  
    if (isOutrosSelected && !others) {
      setIsLoading(false);
      Alert.alert('Ops!!!', 'Por favor, atribua um nome à sua categoria.');
      return;
    }
  
    const requiredFields = [
      { value: description, fieldName: 'Descrição' },
      { value: formatMoney, fieldName: 'Valor' },
      { value: dataPicker, fieldName: 'Data' },
      { value: whichTable, fieldName: 'Tipo de Registro' }
    ];
  
    const missingField = requiredFields.find(field => !field.value);
  
    if (missingField) {
      setIsLoading(false);
      Alert.alert('Campo Vazio', `Por favor, preencha o campo ${missingField.fieldName}.`);
      return;
    }
  
    if (!profile?.id) {
      setIsLoading(false);
      console.log('UserProfile or id is undefined');
      return;
    }
  
    const userId = profile.id;
    const categoryToInsert = isOutrosSelected ? others : select;
  
    try {
      const result = await insert({
        id: userId,
        descriptions: description,
        category: categoryToInsert,
        coin: inputMoneyFloat,
        registrationDate: dataPicker.toString(),
        whichTable: whichTable, // ativos, passivos...
      }).insert();
  
      if (result.success) {
        resetFields();
      } else {
        setIsLoading(false);
        Alert.alert('Erro', 'Ocorreu um erro ao salvar os dados. Tente novamente mais tarde.');
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Error during insertion:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao processar a solicitação. Tente novamente mais tarde.');
    }
  };

  const resetFields = () => {
    Keyboard.dismiss();
    setDescription('');
    setSelect('Selecione uma categoria');
    setOthers('');
    setInputMoney('');
    setCount(count + 1);
    setIsLoading(false);
    Alert.alert('Dados salvos!', '')
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboard}
    >
      <ScrollView
        style={{width: '100%'}}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          backgroundColor: '#242425',
          paddingVertical: 16,
        }}
      >
        <Text style={styles.label}>dia do registro</Text>
        <DataPicker color={color} />

        <Text style={styles.label}>uma categoria</Text>
        <ModalCategory category={whichTable} color={color}/>

        {select === 'Outros' ? 
        <TextInput 
          style={[styles.selectItem, { borderColor: color }]} 
          placeholder="digite o nome da sua categoria"
          placeholderTextColor="gray"
          keyboardType="default"
          autoCapitalize="sentences"
          autoCorrect={true}
          value={others}
          onChangeText={(text) => setOthers(text)}
          returnKeyType="next"
          blurOnSubmit={false}
          onSubmitEditing={() => (inputDescription.current && inputDescription.current.focus())}
        />
      :
        <></>
      }

        <Text style={styles.label}>descrição</Text>
        <TextInput 
          ref={inputDescription}
          style={[styles.selectItem, { borderColor: color }]} 
          placeholder="..."
          placeholderTextColor="gray"
          keyboardType="default"
          autoCapitalize="sentences"
          autoCorrect={true}
          value={description}
          onChangeText={(text) => setDescription(text)}
          returnKeyType="next"
          blurOnSubmit={false}
          onSubmitEditing={() => (inputCoin.current && inputCoin.current.focus())}
        />

        <Text style={styles.label}>valor a ser registrado</Text>
        <View style={[styles.selectItem, {borderColor: color, flexDirection: 'row'}]}>
          <Text style={styles.txt}>BRL</Text>
          <TextInput
            style={{width: '100%', paddingHorizontal: 16, color: '#fff'}}
            ref={inputCoin}
            placeholder='0,00'
            placeholderTextColor='gray'
            keyboardType="decimal-pad"
            maxLength={14}
            returnKeyType="send"
            value={formatMoney}
            onChangeText={(text) => setInputMoney(text)}
            onSubmitEditing={() => checking()}
          />
        </View>
      </ScrollView>

      {isLoading ? 
        <View style={[styles.btn, {backgroundColor: color}]}>
          <ActivityIndicator color={'#fff'} />
        </View>
      :
        <TouchableOpacity style={[styles.btn, {backgroundColor: color}]} onPress={() => [checking()]}>
          <Text style={[styles.txt, {fontWeight: 'bold'}]}>registrar</Text>
        </TouchableOpacity>
      }

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboard: {
    flex: 1, 
    backgroundColor: '#242425',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  label: {
    width: 200,
    zIndex: 2,
    paddingLeft: 2,
    textTransform: 'uppercase',
    color: '#ffffffa7',
    fontSize: 10,
  },

  selectItem: {
    height: 60,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#242425',
    color: '#fff',
    marginBottom: 16,
    paddingHorizontal: 16,
    borderWidth: 0.3,
  },
  txt: {
    color: '#fff',
    textTransform: 'uppercase',
    paddingLeft: 16,
  },
  btn: {
    width: '80%',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 60/2,
    marginBottom: 32,
  }
});
