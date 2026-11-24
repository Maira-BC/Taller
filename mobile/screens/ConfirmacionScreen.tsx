import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
import { useState } from 'react';
import { solicitarTurno } from '../services/turnos';
import { guardarTurno } from '../services/turnoLocal';

type Props = NativeStackScreenProps<RootStackParamList, 'Confirmacion'>;

export default function ConfirmacionScreen({ route, navigation }: Props) {
  const { sucursalId, sucursalNombre, servicioTipo, servicioNombre, } = route.params;
  const [cargando, setCargando] = useState(false);

  const confirmarTurno = async () => {
    if (cargando) return;
    try {
      setCargando(true);
      const turno = await solicitarTurno(servicioTipo, sucursalId);
      const datosTurno = {
        turnoId: turno.id,
        numero: turno.numero,
        sucursalId,
        sucursalNombre,
        servicioNombre,
      };
      await guardarTurno(datosTurno);
      navigation.reset({
        index: 1,
        routes: [
          { name: 'Inicio' },
          { name: 'MiTurno', params: datosTurno },
        ],
      })
    }
    catch (error) {
      console.log('Error al solicitar turno:', error);

      Alert.alert(
        'No se pudo solicitar el turno',
        'No fue posible conectar con el servidor. Inténtalo nuevamente.'
      );
    }
    finally {
      setCargando(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Confirma tu solicitud</Text>
      <Text style={styles.descripcion}>Revisa los datos antes de solicitar tu turno.</Text>
      <View style={styles.tarjeta}>
        <Text style={styles.etiqueta}>Sucursal seleccionada</Text>
        <Text style={styles.valor}>{sucursalNombre}</Text>
        <View style={styles.separador} />
        <Text style={styles.etiqueta}>Tipo de atención</Text>
        <Text style={styles.valor}>{servicioNombre}</Text>
      </View>
      <Pressable
        style={[styles.boton, cargando && { opacity: 0.6 }]}
        onPress={confirmarTurno}
        disabled={cargando}>
        <Text style={styles.textoBoton}>{cargando ? 'Solicitando turno...' : 'Confirmar y solicitar turno'}</Text>
      </Pressable>
      <Text style={styles.nota}>Tu turno se generará después de confirmar la solicitud.</Text>
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
    marginBottom: 28,
  },
  tarjeta: {
    backgroundColor: '#F7FCFC',
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#B9E4E7',
    marginBottom: 28,
  },
  etiqueta: {
    fontSize: 14,
    color: '#56858B',
    marginBottom: 8,
  },
  valor: {
    fontSize: 20,
    fontWeight: '600',
    color: '#397C87',
  },
  separador: {
    height: 1,
    backgroundColor: '#B9E4E7',
    marginVertical: 24,
  },
  boton: {
    backgroundColor: '#9BD7DB',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  textoBoton: {
    color: '#17212B',
    fontSize: 16,
    fontWeight: 'bold',
  },
  nota: {
    fontSize: 13,
    color: '#667085',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 20,
  },
});