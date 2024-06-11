import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CardReceita from '../componentes/CardReceita';

type RootStackParamList = {
  TelaHome: undefined;
  TelaReceita: {
    id: number;
    imagem: string;
    titulo: string;
    tempo: string;
    porcoes: number;
    dificuldade: string;
    ingredientes: {
      id: number;
      nome: string;
      quantidade: string;
    }[];
    utensilios: string[];
    modoPreparo: string;
  };
};

const TelaHome = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'TelaHome'>>();
  const [receitas, setReceitas] = useState<RootStackParamList['TelaReceita'][]>([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const fetchReceitas = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await axios.get('http://172.16.11.68:5000/receitas', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setReceitas(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchReceitas();
  }, []);

  const filteredReceitas = receitas.filter((receita) =>
    receita.titulo.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <ScrollView style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar receitas..."
        value={searchText}
        onChangeText={(text) => setSearchText(text)}
      />
      {filteredReceitas.length > 0 ? (
        filteredReceitas.map((receita) => (
          <TouchableOpacity
            key={receita.id}
            onPress={() => navigation.navigate('TelaReceita', receita)}
          >
            <CardReceita
              imagem={`http://172.16.11.68:5000/imagens/${receita.imagem}`}
              titulo={receita.titulo}
              tempo={receita.tempo}
              porcoes={receita.porcoes}
              dificuldade={receita.dificuldade}
            />
          </TouchableOpacity>
        ))
      ) : (
        <Text>Nenhuma receita encontrada</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 8,
    marginBottom: 16,
  },
});

export default TelaHome;
