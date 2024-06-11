import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
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
    utensilios: string;
    modoPreparo: string;
  };
};

const iconAddPlan = require('@/assets/images/icon-addplan.png');
const iconDificuldade = require('@/assets/images/icon-dificuldade.png');
const iconPorcao = require('@/assets/images/icon-porcao.png');
const iconClock = require('@/assets/images/clock.png');
const cartButton = require('@/assets/images/cart-button.png');

type TelaReceitaRouteProp = RouteProp<RootStackParamList, 'TelaReceita'>;

const TelaReceita = () => {
  const route = useRoute<TelaReceitaRouteProp>();
  const { id, imagem, titulo, tempo, porcoes, dificuldade, ingredientes, utensilios, modoPreparo } = route.params;
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const AddIngredienteLista = async (ingredienteId: number, ingredienteNome: string) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.post(
        'http://172.16.11.68:5000/adicionar-ingrediente',
        { ingredienteId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 201) {
        Alert.alert('Sucesso', `O ingrediente "${ingredienteNome}" foi adicionado à sua lista de compras!`);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao adicionar ingrediente à lista de compras');
    }
  };

  const AddReceitaPlano = async (receitaId: number, receitaNome: string, date: Date) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const formattedDate = date.toISOString().split('T')[0];
      const response = await axios.post(
        'http://172.16.11.68:5000/adicionar-planejamento',
        { receitaId, data: formattedDate },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 201) {
        Alert.alert('Sucesso', `A receita "${receitaNome}" foi adicionada ao planejamento semanal!`);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao adicionar receita ao planejamento');
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  };

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
      AddReceitaPlano(id, titulo, date);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: `http://172.16.11.68:5000/imagens/${imagem}` }} style={styles.image} />
      <View style={styles.header}>
        <Text style={styles.title}>{titulo}</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <Image source={iconAddPlan} style={styles.addPlanIcon} />
        </TouchableOpacity>
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Image source={iconClock} style={styles.infoIcon} />
          <Text style={styles.info}>{formatTime(tempo)}</Text>
        </View>
        <View style={styles.infoItem}>
          <Image source={iconPorcao} style={styles.infoIcon} />
          <Text style={styles.info}>{porcoes} porções</Text>
        </View>
        <View style={styles.infoItem}>
          <Image source={iconDificuldade} style={styles.infoIcon} />
          <Text style={styles.info}>{dificuldade}</Text>
        </View>
      </View>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Ingredientes:</Text>
        {ingredientes.map((ingrediente) => (
          <View key={ingrediente.id} style={styles.ingredienteContainer}>
            <Text style={styles.text}>{ingrediente.nome} - {ingrediente.quantidade}</Text>
            <TouchableOpacity onPress={() => AddIngredienteLista(ingrediente.id, ingrediente.nome)}>
              <Image source={cartButton} style={styles.cartIcon} />
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Utensílios:</Text>
        <Text style={styles.text}>{utensilios}</Text>
      </View>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Modo de Preparo:</Text>
        <Text style={styles.text}>{modoPreparo}</Text>
      </View>
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate || new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#E8F5E9',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#026101',
  },
  addPlanIcon: {
    width: 30,
    height: 30,
    tintColor: '#026101',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
    tintColor: '#026101',
  },
  info: {
    fontSize: 16,
    color: '#026101',
  },
  sectionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderColor: '#C8E6C9',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#026101',
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    color: '#026101',
    marginBottom: 8,
  },
  ingredienteContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    
  },
  cartIcon: {
    width: 24,
    height: 24,
    tintColor: '#026101',
  },
  planejamentoButton: {
    backgroundColor: '#026101',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  planejamentoButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TelaReceita;