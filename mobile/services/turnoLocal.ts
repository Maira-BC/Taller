import AsyncStorage from '@react-native-async-storage/async-storage';
import type { RootStackParamList } from '../App';

export type TurnoGuardado = RootStackParamList['MiTurno'];

const CLAVE_TURNO = '@tu_turno:turno_activo';

export async function guardarTurno(turno: TurnoGuardado): Promise<void> {
  await AsyncStorage.setItem(CLAVE_TURNO, JSON.stringify(turno));
}

export async function recuperarTurno(): Promise<TurnoGuardado | null> {
  const datos = await AsyncStorage.getItem(CLAVE_TURNO);
  return datos ? (JSON.parse(datos) as TurnoGuardado) : null;
}

export async function eliminarTurno(): Promise<void> {
  await AsyncStorage.removeItem(CLAVE_TURNO);
}