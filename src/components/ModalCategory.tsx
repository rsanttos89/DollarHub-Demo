import React, { useEffect, useState, useMemo } from 'react';
import { FlatList, Modal, TouchableOpacity, Text, View, StyleSheet, TextInput } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

import { useSelecCategory } from '../context/form';

const ModalCategory = ({ category, color }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [listCategory, setListCategory] = useState([]);

  const { select, setSelect } = useSelecCategory();

  const memoizedFetch = useMemo(() => {
    return async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`https://r-santtos.github.io/DevLinks/category/${category}.json`);
        const json = await response.json();
        setListCategory(json);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
  }, [category]);

  useEffect(() => {
    memoizedFetch();
  }, [memoizedFetch]);

  function ModalSelect(value: string) {
    setSelect(value);
    setModalVisible(false);
  }

  return (
    <>
      <View style={[styles.container, {borderColor: color}]}>
        <Modal
          animationType="fade"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <FlatList
            style={{ backgroundColor: '#242425' }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 16 }}
            data={listCategory}
            keyExtractor={({ id }) => id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => ModalSelect(item.id)}
                style={[styles.selectItem, { borderColor: color }]}
              >
                <Text style={styles.txt}>{item.id}</Text>
              </TouchableOpacity>
            )}
          />
        </Modal>

        <TouchableOpacity
          style={styles.input}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.txt}>{select}</Text>
          <AntDesign name="caretdown" style={{ marginRight: 8 }} color="#D5D5D5" />
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#242425',
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 0.3,
  },
  txt: {
    fontSize: 13,
    textTransform: 'uppercase',
    color: '#fff',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectItem: {
    height: 60,
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: '#242425',
    color: '#fff',
    marginBottom: 16,
    paddingHorizontal: 16,
    borderWidth: 0.3,
  }
});

export default ModalCategory;