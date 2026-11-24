import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import SucursalesScreen from './screens/SucursalesScreen';
import ServiciosScreen from './screens/ServiciosScreen';
import ConfirmacionScreen from './screens/ConfirmacionScreen';
import MiTurnoScreen from './screens/MiTurnoScreen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { recuperarTurno } from './services/turnoLocal';

export type RootStackParamList = {
  Inicio: undefined;
  Sucursales: undefined;
  Servicios: {
    sucursalId: number;
    sucursalNombre: string;
  };
  Confirmacion: {
    sucursalId: number;
    sucursalNombre: string;
    servicioTipo: string;
    servicioNombre: string;
  };
  MiTurno: {
    turnoId: number;
    numero: string;
    sucursalId: number;
    sucursalNombre: string;
    servicioNombre: string;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function InicioScreen({ navigation }: { navigation: any }) {
  const [turnoGuardado, setTurnoGuardado] = useState<RootStackParamList['MiTurno'] | null>(null);

  useFocusEffect(
    useCallback(() => {
      let activo = true;
      const cargarTurno = async () => {
        try {
          const datos = await recuperarTurno();

          if (activo) {
            setTurnoGuardado(datos);
          }
        }
        catch (error) {
          console.log('No se pudo recuperar el turno:', error);
        }
      };

      cargarTurno();

      return () => {
        activo = false;
      };
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.iconoContenedor}>
        <MaterialCommunityIcons name="ticket-confirmation-outline" size={38} color="#397C87"/>
      </View>
      <Text style={styles.bienvenida}>¡Bienvenido!</Text>
      <Text style={styles.titulo}>Tu Turno</Text>
      <Text style={styles.descripcion}>Solicita tu turno y consulta el estado de tu atención desde tu celular.</Text>
      <Pressable style={[styles.boton, turnoGuardado && { opacity: 0.5 }]} disabled={turnoGuardado !== null} onPress={() => navigation.navigate('Sucursales')}>
        <Text style={styles.textoBoton}>Comenzar  →</Text>
      </Pressable>
      {turnoGuardado && (
        <Pressable
          style={styles.botonMiTurno}
          onPress={() => navigation.navigate('MiTurno', turnoGuardado)}
        >
          <Text style={styles.textoBotonMiTurno}>Ver mi turno</Text>
        </Pressable>
      )}
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#9BD7DB' },
          headerTintColor: '#17212B',
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="Inicio" component={InicioScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Sucursales" component={SucursalesScreen} options={{ title: 'Sucursales' }}/>
        <Stack.Screen name="Servicios" component={ServiciosScreen} options={{ title: 'Servicios' }}/>
        <Stack.Screen name="Confirmacion" component={ConfirmacionScreen} options={{ title: 'Confirmar turno' }}/>
        <Stack.Screen name="MiTurno" component={MiTurnoScreen} options={{ title: 'Mi turno' }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  iconoContenedor: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#E2F5F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  icono: {
    fontSize: 36,
  },
  bienvenida: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#17212B',
    marginBottom: 8,
  },
  titulo: {
    fontSize: 25,
    fontWeight: '600',
    color: '#397C87',
    marginBottom: 20,
  },
  descripcion: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    lineHeight: 25,
    marginBottom: 36,
  },
  boton: {
    backgroundColor: '#9BD7DB',
    paddingVertical: 16,
    paddingHorizontal: 42,
    borderRadius: 14,
  },
  textoBoton: {
    color: '#17212B',
    fontSize: 16,
    fontWeight: 'bold',
  },
  botonMiTurno: {
    marginTop: 16,
    paddingVertical: 16,
    paddingHorizontal: 42,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#9BD7DB',
    backgroundColor: '#F7FCFC',
  },
  textoBotonMiTurno: {
    color: '#397C87',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});