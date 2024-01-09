import React from 'react';
import { StyleSheet, Text } from 'react-native';

type Dates = {
  date: number;
};

const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

const dateNow = new Date();

const WhichDate: React.FC<Dates> = ({ date }) => {
  const dates = new Date(date);
  const day = ("0" + dates.getDate()).slice(-2);
  const month = dates.getMonth();
  const year = dates.getFullYear();

  let dateInfo = '';

  if (isSameDay(dateNow, dates)) {
    dateInfo = 'hoje';
  } else if (isSameDay(getPreviousDay(dateNow), dates)) {
    dateInfo = 'ontem';
  } else if (isSameYear(dateNow, dates)) {
    dateInfo = `${day} ${months[month]}`;
  } else {
    dateInfo = `${day} ${months[month]} ${year}`;
  }

  return (
    <Text style={styles.txt}>{dateInfo}</Text>
  );
}

// Função para verificar se duas datas estão no mesmo ano
function isSameYear(date1: Date, date2: Date): boolean {
  return date1.getFullYear() === date2.getFullYear();
}

// Função para verificar se duas datas são iguais (considerando apenas dia, mês e ano)
function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

// Função para obter o dia anterior
function getPreviousDay(date: Date): Date {
  const previousDay = new Date(date);
  previousDay.setDate(date.getDate() - 1);
  return previousDay;
}

const styles = StyleSheet.create({
  txt: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    opacity: 0.7
  }
})


export default WhichDate;