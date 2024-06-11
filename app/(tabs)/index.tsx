import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, StyleSheet } from 'react-native';

import TelaHome from '@/src/telas/TelaHome';
import TelaReceita from '@/src/telas/TelaReceita';
import TelaPlanejamento from '@/src/telas/TelaPlanejamento';
import TelaLista from '@/src/telas/TelaLista';
import TelaCadastroReceita from '@/src/telas/TelaCadastroReceita';
import TelaLogin from '@/src/telas/TelaLogin';
import TelaCadastro from '@/src/telas/TelaCadastro';

const homeIcon = require('@/assets/images/icon-home.png');
const receitaIcon = require('@/assets/images/recipe.png');
const planejamentoIcon = require('@/assets/images/calendar.png');
const listaIcon = require('@/assets/images/cart.png');

export type RootStackParamList = {
  TelaHome: undefined;
  TelaReceita: {
    imagem: string;
    titulo: string;
    tempo: string;
    porcoes: number;
    dificuldade: string;
    ingredientes: string[];
    utensilios: string[];
    modoPreparo: string;
  };
  TelaPlanejamento: undefined;
  TelaLista: {
    nome:string;
    quantidade:string;
  };
  TelaCadastroReceita: undefined;
  TelaLogin: undefined;
  TelaCadastro: undefined;
  Main: undefined;
  Auth: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="TelaCadastro">
      <Stack.Screen name="TelaLogin" component={TelaLogin} />
      <Stack.Screen name="TelaCadastro" component={TelaCadastro} />
    </Stack.Navigator>
  );
}

function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="TelaHome">
      <Stack.Screen name="TelaHome" component={TelaHome} />
      <Stack.Screen name="TelaReceita" component={TelaReceita} />
      <Stack.Screen name="TelaPlanejamento" component={TelaPlanejamento} />
      <Stack.Screen name="TelaLista" component={TelaLista} />
      <Stack.Screen name="TelaCadastroReceita" component={TelaCadastroReceita} />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarShowLabel: false, tabBarActiveTintColor: "#105c13" }}>
      <Tab.Screen
        name="Home"
        component={MainStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image
              source={homeIcon}
              style={[styles.icon, { tintColor: color, width: size, height: size }]}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Planejamento"
        component={TelaPlanejamento}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image
              source={planejamentoIcon}
              style={[styles.icon, { tintColor: color, width: size, height: size }]}
            />
          ),
        }}
      />
      <Tab.Screen
        name="ListaCompras"
        component={TelaLista}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image
              source={listaIcon}
              style={[styles.icon, { tintColor: color, width: size, height: size }]}
            />
          ),
        }}
      />
      <Tab.Screen
        name="CadastroReceita"
        component={TelaCadastroReceita}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image
              source={receitaIcon}
              style={[styles.icon, { tintColor: color, width: size, height: size }]}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Auth">
        <Stack.Screen name="Auth" component={AuthStack} />
        <Stack.Screen name="Main" component={MainTabs} />
      </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 32,
    height: 32,
  },
});
