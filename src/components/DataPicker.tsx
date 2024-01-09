import React, { useEffect, useState } from 'react';
import { View, Text, Platform, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { userDataPicker } from '../context/form';

const DataPicker = ({ color }: { color: string }) => {
  const { setDataPicker } = userDataPicker();

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('') as any;
  const [show, setShow] = useState(false);

  useEffect(() => {
    const offset = -3; // GMT-0300 (horário de Brasília)
    const dataUtc = new Date(date.getTime() + offset * 60 * 60 * 1000);
    const formattedDate = dataUtc.toISOString().replace('T', ' ').slice(0, -5);
    const data = new Date(formattedDate);

    setDataPicker(data.getTime());
  }, [date]);

  /**ADICIONE ZERO À ESQUERDA NA DATA ANTES DE EXIBIR NA TELA */
  const day = ("0" + date.getDate()).slice(-2);
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const showView = `${day}/${month}/${date.getFullYear()}`;

  const onChange = (event: any, selectedDate: Date) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showMode = (currentMode: React.SetStateAction<string>) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  return (
    <View style={[styles.container, { borderColor: color }]}>
      <TouchableOpacity onPress={showDatepicker} style={styles.boxDataPicker}>
        <Text style={styles.txt}>{showView}</Text>
        <AntDesign style={{ marginRight: 8 }} name="caretdown" size={11} color="#f7f6f9" />
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChange}
          maximumDate={new Date()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 60,
    backgroundColor: "#242425",
    borderWidth: 0.3,
    alignContent: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  boxDataPicker: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  txt: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    textTransform: 'uppercase'
  }
});

export default DataPicker;