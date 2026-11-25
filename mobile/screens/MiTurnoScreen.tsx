import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
import { useEffect, useState } from 'react';
import type { Turno } from '../services/turnos';
import { obtenerTurnos } from '../services/turnos';
import { eliminarTurno } from '../services/turnoLocal';

type Props = NativeStackScreenProps<RootStackParamList, 'MiTurno'>;

export default function MiTurnoScreen({ route, navigation }: Props) {
  const { turnoId, numero, sucursalId, sucursalNombre, servicioNombre, } = route.params;
  const [turno, setTurno] = useState<Turno | null>(null);
  const [consultando, setConsultando] = useState(true);
  const [errorConsulta, setErrorConsulta] = useState(false);
  const [turnoNoEncontrado, setTurnoNoEncontrado] = useState(false);
  const [personasDelante, setPersonasDelante] = useState<number | null>(null);

  useEffect(() => {
    let activo = true;
    let consultandoServidor = false;

    const actualizarTurno = async () => {
        if (consultandoServidor) return;
        consultandoServidor = true;

        try {
            const turnos = await obtenerTurnos(sucursalId);
            const turnoActual = turnos.find((item) => item.id === turnoId);

            if (activo && !turnoActual) {
                setConsultando(false);
                setErrorConsulta(false);
                setTurnoNoEncontrado(true);
                return;
            }

            if (activo && turnoActual) {
                setTurno(turnoActual);

                if (turnoActual.estado === 'finalizado') {
                    finalizado = true;
                }

                setConsultando(false);
                setErrorConsulta(false);
                setTurnoNoEncontrado(false);

                if (turnoActual.estado === 'espera') {
                    const delante = turnos.filter((item) => item.estado === 'espera' && item.tipo === turnoActual.tipo && item.id < turnoActual.id).length;
                    setPersonasDelante(delante);
                }
                else {
                    setPersonasDelante(null);
                }
            }
        }
        catch (error) {
            console.log('No se pudo actualizar el turno:', error);
            if (activo) {
                setConsultando(false);
                setErrorConsulta(true);
            }
        }
        finally {
            consultandoServidor = false;
        }
    };

    actualizarTurno();
    let finalizado = false;
    const intervalo = setInterval(() => {
        if (!finalizado) {
            actualizarTurno();
        }
  }, 2000);

    return () => {
        activo = false;
        clearInterval(intervalo);
    };
    }, [turnoId, sucursalId]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contenido}>
      <Text style={styles.titulo}>Mi turno</Text>
      <Text style={styles.descripcion}>Consulta aquí el estado de tu atención.</Text>
      <View style={styles.tarjeta}>
        <Text style={styles.etiqueta}>Tu número de atención</Text>
        <Text style={styles.numero}>{numero}</Text>
        <View style={[styles.estado, turno?.estado === 'atendiendo' && styles.estadoAtendiendo, turno?.estado === 'finalizado' && styles.estadoFinalizado, errorConsulta && styles.estadoError, ]}>
          <Text style={[styles.textoEstado, turno?.estado === 'atendiendo' && styles.textoAtendiendo, turno?.estado === 'finalizado' && styles.textoFinalizado, errorConsulta && styles.textoError, ]}>{consultando ? 'Consultando estado...': errorConsulta ? 'Sin conexión': turnoNoEncontrado ? 'Turno no encontrado': turno?.estado === 'atendiendo' ? 'En atención': turno?.estado === 'finalizado' ? 'Finalizado': 'En espera'}</Text>
        </View>
      </View>
      {turno?.estado === 'espera' && (
        <View style={styles.fila}>
            <Text style={styles.etiqueta}>Personas delante de ti</Text>
            <Text style={styles.numeroFila}>{personasDelante ?? '—'}</Text>
        </View>
      )}
      {turno?.estado === 'atendiendo' && (
        <View style={styles.avisoTurno}>
            <Text style={styles.tituloAviso}>¡Es tu turno!</Text>
            <Text style={styles.descripcionAviso}>Dirígete al</Text>
            <Text style={styles.modulo}>{turno.modulo != null ? `Módulo ${turno.modulo}`: 'módulo de atención'}</Text>
        </View>
      )}
      {turno?.estado === 'finalizado' && (
        <View style={styles.avisoFinalizado}>
            <Text style={styles.tituloFinalizado}>Atención finalizada</Text>
            <Text style={styles.descripcionFinalizado}>Tu turno ha sido completado. ¡Gracias por utilizar Tu Turno!</Text>
        </View>
      )}
      {turno?.estado === 'finalizado' && (
        <Pressable
          style={styles.botonInicio}
          onPress={async () => {
            try {
              await eliminarTurno();
              navigation.popToTop();
            }
            catch (error) {
              console.log('No se pudo eliminar el turno guardado:', error);
            }
          }}
        >
          <Text style={styles.textoBotonInicio}>Volver al inicio</Text>
        </Pressable>
      )}
      <View style={styles.detalles}>
        <Text style={styles.etiqueta}>Sucursal</Text>
        <Text style={styles.valor}>{sucursalNombre}</Text>
        <View style={styles.separador} />
        <Text style={styles.etiqueta}>Servicio</Text>
        <Text style={styles.valor}>{servicioNombre}</Text>
      </View>
      <Text style={styles.nota}>Puedes volver a consultar el estado de tu turno cuando quieras.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contenido: {
    padding: 24,
    paddingBottom: 48,
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
    padding: 28,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#B9E4E7',
    alignItems: 'center',
    marginBottom: 20,
  },
  etiqueta: {
    fontSize: 14,
    color: '#667085',
    marginBottom: 8,
  },
  numero: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#397C87',
    marginVertical: 16,
  },
  estado: {
    backgroundColor: '#FFF3CD',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  textoEstado: {
    color: '#856404',
    fontSize: 14,
    fontWeight: '600',
  },
  detalles: {
    backgroundColor: '#F7FCFC',
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#B9E4E7',
  },
  valor: {
    fontSize: 18,
    fontWeight: '600',
    color: '#397C87',
  },
  separador: {
    height: 1,
    backgroundColor: '#B9E4E7',
    marginVertical: 20,
  },
  nota: {
    fontSize: 13,
    color: '#667085',
    textAlign: 'center',
    marginTop: 24,
    lineHeight: 20,
  },
  fila: {
    backgroundColor: '#F7FCFC',
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#B9E4E7',
    alignItems: 'center',
    marginBottom: 20,
  },
  numeroFila: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#397C87',
    marginTop: 8,
  },
  avisoTurno: {
    backgroundColor: '#E8F5E9',
    padding: 28,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#A5D6A7',
    alignItems: 'center',
    marginBottom: 20,
  },
  tituloAviso: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 12,
  },
  descripcionAviso: {
    fontSize: 16,
    color: '#3D6640',
    marginBottom: 8,
  },
  modulo: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
  },
  avisoFinalizado: {
    backgroundColor: '#E2F5F6',
    padding: 28,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#B9E4E7',
    alignItems: 'center',
    marginBottom: 20,
  },
  tituloFinalizado: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#397C87',
    marginBottom: 12,
    textAlign: 'center',
  },
  descripcionFinalizado: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
    textAlign: 'center',
  },
  estadoAtendiendo: {
    backgroundColor: '#E8F5E9',
  },
  estadoFinalizado: {
    backgroundColor: '#E2F5F6',
  },
  estadoError: {
    backgroundColor: '#FDECEC',
  },
  textoAtendiendo: {
    color: '#2E7D32',
  },
  textoFinalizado: {
    color: '#397C87',
  },
  textoError: {
    color: '#B42318',
  },
  botonInicio: {
    backgroundColor: '#9BD7DB',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  textoBotonInicio: {
    color: '#17212B',
    fontSize: 16,
    fontWeight: 'bold',
  },
});