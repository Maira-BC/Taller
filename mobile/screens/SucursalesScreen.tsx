import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View, } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
import { obtenerSucursales, type Sucursal, } from '../services/sucursales';

type Props = NativeStackScreenProps<RootStackParamList, 'Sucursales'>;

export default function SucursalesScreen({ navigation }: Props) {
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let activo = true;

    const cargarSucursales = async () => {
      try {
        const datos = await obtenerSucursales();

        if (activo) {
          setSucursales(datos);
          setError(false);
        }
      }
      catch (error) {
        console.log('Error al obtener sucursales:', error);

        if (activo) {
          setError(true);
        }
      }
      finally {
        if (activo) {
          setCargando(false);
        }
      }
    };

    cargarSucursales();

    return () => {
      activo = false;
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Selecciona una sucursal</Text>
      <Text style={styles.descripcion}>Elige dónde deseas solicitar tu turno.</Text>
      {cargando ? (
        <ActivityIndicator size="large" color="#397C87" />
      ) : error ? (
        <Text style={styles.mensaje}>No se pudieron cargar las sucursales. Revisa tu conexión.</Text>
      ) : (
        <FlatList
          data={sucursales}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Pressable
              style={styles.tarjeta}
              onPress={() =>
                navigation.navigate('Servicios', {
                  sucursalId: item.id,
                  sucursalNombre: item.nombre,
                })
              }
            >
              <Text style={styles.nombre}>{item.nombre}</Text>
              <Text style={styles.indicacion}>Seleccionar sucursal ›</Text>
            </Pressable>
          )}
          ListEmptyComponent={
            <Text style={styles.mensaje}>No hay sucursales disponibles.</Text>
          }
          contentContainerStyle={styles.lista}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 24,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#17212B',
    marginTop: 24,
    marginBottom: 12,
  },
  descripcion: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
    marginBottom: 24,
  },
  lista: {
    paddingBottom: 24,
  },
  tarjeta: {
    backgroundColor: '#F7FCFC',
    padding: 20,
    borderRadius: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#B9E4E7',
  },
  nombre: {
    fontSize: 18,
    fontWeight: '600',
    color: '#397C87',
    marginBottom: 8,
  },
  indicacion: {
    fontSize: 14,
    color: '#56858B',
  },
  mensaje: {
    fontSize: 16,
    color: '#667085',
    textAlign: 'center',
    marginTop: 24,
  },
});