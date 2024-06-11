import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const diasDaSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

type RootStackParamList = {
  TelaPlanejamento: undefined;
  Planejamento: {
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
const TelaPlanejamento = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'TelaPlanejamento'>>();
  const [planejamento, setPlanejamento] = useState<Planejamento[]>([]);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'TelaPlanejamento'>>();

  useEffect(() => {
    const fetchPlanejamento = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await axios.get('http://172.16.11.68:5000/planejamento', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setPlanejamento(response.data);
      } catch (error) {
        console.error(error);
        Alert.alert('Erro', 'Erro ao buscar planejamento');
      }
    };

    fetchPlanejamento();
  }, []);

  const getReceitasPorDia = (diaIndex: number) => {
    const hoje = new Date();
    const diaDaSemanaAtual = hoje.getDay();
    const inicioSemana = new Date(hoje);
    inicioSemana.setDate(inicioSemana.getDate() - diaDaSemanaAtual + diaIndex);
    const dataString = inicioSemana.toISOString().split('T')[0];

    return planejamento.filter(item => item.data === dataString);
  };

  const handleReceitaPress = (receita: Planejamento) => {
    navigation.navigate('TelaReceita', {
      id: receita.id,
      imagem: receita.imagem,
      titulo: receita.titulo,
      tempo: receita.tempo,
      porcoes: receita.porcoes,
      dificuldade: receita.dificuldade,
      ingredientes: receita.ingredientes,
      utensilios: receita.utensilios,
      modoPreparo: receita.modoPreparo,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Planejamento de Refeições</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {diasDaSemana.map((dia, index) => (
          <View key={index} style={styles.diaContainer}>
            <View style={styles.diaHeader}>
              <Ionicons name="calendar-outline" size={24} color="#026101" />
              <Text style={styles.dia}>{dia}</Text>
            </View>
            {getReceitasPorDia(index).map((receita) => (
              <TouchableOpacity key={receita.id} style={styles.receitaContainer} onPress={() => handleReceitaPress(receita)}>
                <Ionicons name="restaurant-outline" size={20} color="#026101" />
                <Text style={styles.receita}>{receita.titulo}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
  },
  titleContainer: {
    backgroundColor: '#E8F5E9',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#C8E6C9',
    zIndex: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#026101',
  },
  scrollViewContent: {
    paddingTop: 10,
  },
  diaContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 15,
    borderColor: '#C8E6C9',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  diaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dia: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#026101',
    marginLeft: 10,
  },
  receitaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  receita: {
    fontSize: 16,
    color: '#026101',
    marginLeft: 10,
  },
});

export default TelaPlanejamento;