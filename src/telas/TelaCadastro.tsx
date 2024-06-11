import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '@/app/(tabs)';

const TelaCadastro = () => {
  const [nome, setNome] = useState('teste1234');
  const [senha, setSenha] = useState('teste1234');
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleCadastro = async () => {
    if (!nome || !senha) {
      Alert.alert('Erro', 'Por favor, forneça um nome e uma senha');
      return;
    }

    try {
      const response = await axios.post('http://172.16.11.68:5000/register', { nome, senha });
      if (response.status === 201) {
        Alert.alert('Sucesso', 'Usuário registrado com sucesso');
        navigation.navigate('TelaLogin'); 
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao registrar usuário');
    }
  };

  return (
    <View style={styles.container}>
      <Image 
        source={require('@/assets/images/logo-cheff.png')} 
        style={styles.logo} 
        resizeMode="contain" 
      />
      <Text style={styles.title}>Sign-in</Text>
      <View style={styles.form}>
        <Text style={styles.label}>Nome:</Text>
        <TextInput style={styles.input} value={nome} onChangeText={setNome} />
        <Text style={styles.label}>Senha:</Text>
        <TextInput
          style={styles.input}
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />
        <View style={styles.buttonContainer}>
          <Button title="CADASTRE-SE" color="#092C16" onPress={handleCadastro} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  form: {
    width: '80%',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'left',
  },
  input: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
    marginBottom: 16,
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default TelaCadastro;