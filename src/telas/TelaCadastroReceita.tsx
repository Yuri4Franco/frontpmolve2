import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Image, Alert, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Ingrediente = {
  nome: string;
  quantidade: string;
};

const TelaCadastroReceita = () => {
  const [titulo, setTitulo] = useState('Ensopado de batatinhas');
  const [dificuldade, setDificuldade] = useState<'fácil' | 'médio' | 'difícil'>('fácil');
  const [horas, setHoras] = useState('');
  const [minutos, setMinutos] = useState('30');
  const [porcoes, setPorcoes] = useState('10');
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([{ nome: '', quantidade: '' }]);
  const [utensilios, setUtensilios] = useState('');
  const [modoPreparo, setModoPreparo] = useState('Aqueça o azeite; Frite a cebola; Adicione o tomate e refogue; Adicione a carne e o alcatra; Coloque o arroz e o batata e refogue por 3 minutos; Adicione o mostarda e o ketchup e refogue por mais 3 minutos; Sirva.');
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Desculpe, precisamos da permissão da câmera para fazer isso funcionar!');
      }
    })();
  }, []);

  const adicionarIngrediente = () => {
    setIngredientes([...ingredientes, { nome: '', quantidade: '' }]);
  };

  const handleIngredienteChange = (index: number, field: keyof Ingrediente, value: string) => {
    const novosIngredientes = [...ingredientes];
    novosIngredientes[index][field] = value;
    setIngredientes(novosIngredientes);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    const receita = {
      titulo,
      dificuldade,
      tempoPreparo: `${horas}:${minutos}`,
      porcoes,
      ingredientes,
      utensilios,
      modoPreparo,
    };

    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('dificuldade', dificuldade);
    formData.append('tempoPreparo', `${horas}:${minutos}`);
    formData.append('porcoes', porcoes);
    formData.append('utensilios', utensilios);
    formData.append('modoPreparo', modoPreparo);
    formData.append('ingredientes', JSON.stringify(ingredientes));
    if (image) {
      const uriParts = image.split('.');
      const fileType = uriParts[uriParts.length - 1];
      formData.append('imagem', {
        uri: image,
        name: `photo.${fileType}`,
        type: `image/${fileType}`,
      } as any);
    }

    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.post('http://172.16.11.68:5000/cadastrar-receita', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });
      if (response.status === 201) {
        Alert.alert('Sucesso', 'Receita cadastrada com sucesso!');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao cadastrar receita');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Enviar sua receita:</Text>
      <Text style={styles.label}>Título:</Text>
      <TextInput style={styles.input} value={titulo} onChangeText={setTitulo} />

      <Text style={styles.label}>Grau de Dificuldade:</Text>
      <View style={styles.dificuldadeContainer}>
        {['fácil', 'médio', 'difícil'].map((nivel) => (
          <TouchableOpacity
            key={nivel}
            style={[
              styles.dificuldadeButton,
              dificuldade === nivel && styles.dificuldadeButtonSelected
            ]}
            onPress={() => setDificuldade(nivel as 'fácil' | 'médio' | 'difícil')}
          >
            <Text style={styles.dificuldadeButtonText}>{nivel}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Tempo de Preparo:</Text>
      <View style={styles.timeContainer}>
        <TextInput
          style={styles.timeInput}
          value={horas}
          onChangeText={setHoras}
          placeholder="Horas"
          keyboardType="numeric"
        />
        <Text style={styles.timeSeparator}>:</Text>
        <TextInput
          style={styles.timeInput}
          value={minutos}
          onChangeText={setMinutos}
          placeholder="Minutos"
          keyboardType="numeric"
        />
      </View>

      <Text style={styles.label}>Porções:</Text>
      <TextInput
        style={styles.input}
        value={porcoes}
        onChangeText={setPorcoes}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Ingredientes:</Text>
      {ingredientes.map((ingrediente, index) => (
        <View key={index} style={styles.ingredienteContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nome do ingrediente"
            value={ingrediente.nome}
            onChangeText={(value) => handleIngredienteChange(index, 'nome', value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Quantidade"
            value={ingrediente.quantidade}
            onChangeText={(value) => handleIngredienteChange(index, 'quantidade', value)}
          />
        </View>
      ))}
      <TouchableOpacity style={styles.button} onPress={adicionarIngrediente}>
        <Text style={styles.buttonText}>Adicionar Ingrediente</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Utensílios:</Text>
      <TextInput
        style={styles.input}
        value={utensilios}
        onChangeText={setUtensilios}
      />

      <Text style={styles.label}>Modo de Preparo:</Text>
      <TextInput
        style={styles.input}
        value={modoPreparo}
        onChangeText={setModoPreparo}
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Escolher Imagem</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={styles.image} />}

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Cadastrar Receita</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    fontFamily: 'cursive',
  },
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
  },
  dificuldadeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  dificuldadeButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },
  dificuldadeButtonSelected: {
    backgroundColor: '#092C16',
  },
  dificuldadeButtonText: {
    color: '#fff',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  timeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
  },
  timeSeparator: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  ingredienteContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  button: {
    backgroundColor: '#092C16',
    padding: 15,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 16,
    borderRadius: 8,
  },
});

export default TelaCadastroReceita;