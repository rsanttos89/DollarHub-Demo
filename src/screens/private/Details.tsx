import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Pressable, FlatList, Alert, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons, AntDesign, Entypo } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';

import WhichDate from '../../components/WhichDate';
import details from '../../server/selectDetails';
import { userCount } from '../../context/form';

type FormProps = { params: { 
  user_id: string, 
  monthYear: string, 
  whichTable: string,  
  color: string, 
  title: string, 
 } };

 type ResponseDetails = {
  total_coin: string;
  results: any[];
};

export default function Active({date, navigation}) {
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();

  const { count, setCount } = userCount();

  const route = useRoute() as FormProps;
  const { user_id, monthYear, whichTable, color, title, } = route.params;

  const formatCurrency = (value: string) => {
    if (value === null || value === undefined) {
      return 'R$ 0,00';
    }
  
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(parseFloat(value));
  };

  /** FUNCTIONS ROUTES */
  function insertForm() {
    navigation.navigate('InsertForm', { title, whichTable, color });
  }
  
  const confirmDeletion = async (id: string, user_id: string, whichTable: string) => {
    try {
      const response = await fetch(`https://rsanttos.tech/apps/dollarhub/delete/details.php`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          id,
          user_id,
          whichTable,
        }),
      });
  
      const responseJson = await response.json();
  
      if (responseJson.success) {
        setCount(count + 1);
      } else {
        Alert.alert("Erro!", responseJson.message);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erro!", "Ocorreu um erro ao processar a solicitação.");
    }
  };
  
  const deleteDetails = (id: string, user_id: string, whichTable: string) => {
    Alert.alert(
      'Confirmação',
      'Tem certeza que deseja deletar?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Deletar',
          onPress: () => {
            confirmDeletion(id, user_id, whichTable);
          },
        },
      ],
      { cancelable: false }
    );
  };
  
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [responseSelectDetails, setResponseSelectDetails] = useState<ResponseDetails>({
    total_coin: "0",
    results: [],
  });

  const DetailsInstance = details({
    user_id: user_id,
    monthYear: monthYear,
    whichTable: whichTable,
    page: page,
  });
  
  const selectDetails = async () => {
    setIsLoading(true);
  
    try {
      // Se a página for 1, substitua os dados existentes pelo novo resultado
      // Caso contrário, adicione os novos resultados aos existentes
      const response = await DetailsInstance.select();

      if (page === 1) {
        setResponseSelectDetails({
          total_coin: response.total_coin,
          results: response.results,
        });
      } else {
        setResponseSelectDetails((prevDetails) => ({
          ...prevDetails,
          total_coin: response.total_coin,
          results: [...prevDetails.results, ...response.results],
        }));
      }
  
    } catch (error) {
      console.error(error);
      Alert.alert("Erro!", "Ocorreu um erro ao processar a solicitação");
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderFooter = () => {
    return isLoading ? (
      <ActivityIndicator size="large" color={color} />
    ) : null;
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.scroll} onLongPress={() => deleteDetails(item.id, item.user_id, whichTable)}>
        <View style={styles.boxTxtIcon}>
          <View style={styles.boxTxt}>
            <Text style={[styles.txtProduct, { fontSize: 16, opacity: 0.7 }]}>
              {formatCurrency(item.coin)}
            </Text>
            <Text style={[styles.txtProduct, { fontSize: 12 }]} numberOfLines={1} ellipsizeMode="tail">
              {item.descriptions}
            </Text>
          </View>
  
          <View style={[styles.boxTxt, { alignItems: 'flex-start', flex: 1/2 }]}>
            <Text style={[styles.txtProduct, { fontSize: 12, opacity: 0.5, textTransform: 'uppercase' }]} numberOfLines={1} ellipsizeMode="tail">
              {item.category}
            </Text>
          </View>
  
          <View style={[styles.boxTxt, { alignItems: 'flex-end', flex: 1/2 }]}>
            <Text style={[styles.txtProduct, { fontSize: 12, opacity: 0.5 }]}>
              <WhichDate date={parseInt(item.registrationDate)} />
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    if (user_id) {
      selectDetails();
    }
  }, [user_id, monthYear, whichTable, count]);

  return (
    <View style={styles.container}>
      <View style={styles.cardInfor}>
        <View style={[styles.boxSell, {borderLeftColor: color}]}>
          <Text style={styles.txtMoney}>{formatCurrency(responseSelectDetails.total_coin)}</Text>
          <Text style={styles.label}>
            {monthYear === 'month' ? `total de ${currentMonth}` : `total de ${currentYear}`}
          </Text>
        </View>
      </View>

      <View style={styles.tabBarTitle}>
        <Text style={[styles.txtCart, {flex: 1}]}>Histórico</Text>
        <Text style={[styles.txtCart, {textAlign: 'left', flex: 1/2}]}>categoria</Text>
        <Text style={[styles.txtCart, {textAlign: 'right', flex: 1/2}]}>dia</Text>
      </View>
      <View style={styles.line} />

      <FlatList
        data={responseSelectDetails.results}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        style={{
          width: '100%',
          marginBottom: 32
        }}
        ListFooterComponent={renderFooter}
        onEndReachedThreshold={0.1}
        onEndReached={({ distanceFromEnd }) => {
          if (distanceFromEnd > 0 && !isLoading) {
            selectDetails();
            setPage(page + 1)
          }
        }}
      />

      <TouchableOpacity style={[styles.btnPlus, {backgroundColor: color}]} onPress={() => insertForm()}>
        <MaterialCommunityIcons name="plus-box-multiple-outline" size={24} color="#fff" />
      </TouchableOpacity>
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
  cardInfor: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 24,
    width: '100%',
  },
  boxSell: {
    borderLeftWidth: 6,
    paddingHorizontal: 16,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  txtMoney: {
    fontSize: 35,
    color: '#fff',
    fontWeight: 'bold',
  },
  label: {
    color: '#ffffff',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    opacity: 0.8,
    fontSize: 13,
  },
  btnPlus: {
    minHeight: 50,
    maxHeight: 50,
    minWidth: 50,
    maxWidth: 50,
    borderRadius: 50/2,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    marginRight: 32,
    marginBottom: 32,
  },

  /**-------------------------------------------- */
  tabBarTitle: {
    width: '100%',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  txtCart: {
    color: '#fff',
    fontSize: 13,
    textTransform: 'uppercase',
    marginBottom: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  line: {
    width: '100%',
    borderBottomWidth: 1,
    borderBlockColor: '#cccccc3e',
  },

  /** ---------------------------------------------------------------- */
  scroll: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxTxtIcon: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#36363678',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 16,
  },
  boxTxt: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    flex: 1,
  },
  txtProduct: {
    color: '#fff',
    fontWeight: 'bold',
  }
});