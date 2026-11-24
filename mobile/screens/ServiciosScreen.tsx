import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Servicios'>;

const servicios = [
  { id: 'Matrícula', nombre: 'Matrícula', descripcion: 'Consultas y trámites de matrícula' },
  { id: 'Finanzas', nombre: 'Finanzas', descripcion: 'Consultas y trámites financieros' },
  { id: 'Becas', nombre: 'Becas', descripcion: 'Información y consultas sobre becas' },
  { id: 'Asesoría', nombre: 'Asesoría', descripcion: 'Orientación y asesoramiento' },
];

export default function ServiciosScreen({ route, navigation }: Props) {
  const { sucursalId, sucursalNombre } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.sucursal}>Sucursal: {sucursalNombre}</Text>
      <Text style={styles.titulo}>¿Qué atención necesitas?</Text>
      <Text style={styles.descripcion}>Selecciona el tipo de servicio para solicitar tu turno.</Text>
      <FlatList
        data={servicios}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => (
          <Pressable style={styles.tarjeta} onPress={() =>
            navigation.navigate('Confirmacion', { sucursalId, sucursalNombre, servicioTipo: item.id, servicioNombre: item.nombre,
            })
          }>
            <Text style={styles.nombre}>{item.nombre}</Text>
            <Text style={styles.detalle}>{item.descripcion}</Text>
            <Text style={styles.indicacion}>Seleccionar servicio ›</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 24,
  },
  sucursal: {
    fontSize: 14,
    color: '#56858B',
    marginTop: 20,
    marginBottom: 16,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#17212B',
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
  detalle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 12,
  },
  indicacion: {
    fontSize: 14,
    color: '#56858B',
  },
});