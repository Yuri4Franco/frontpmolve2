// TelaLista.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Ingrediente = {
  nome: string;
  quantidade: string;
};

const TelaLista = () => {
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([]);

  useEffect(() => {
    const fetchIngredientes = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await axios.get('http://172.16.11.68:5000/lista', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setIngredientes(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchIngredientes();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de compras:</Text>
      <FlatList
        data={ingredientes}
        renderItem={({ item }) => <Text style={styles.item}>▸ {item.nome} - {item.quantidade}</Text>}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontFamily: 'cursive',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  item: {
    fontSize: 18,
    marginBottom: 5,
    padding: 5,
  },
});

export default TelaLista;
