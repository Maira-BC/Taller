import { Schema, model } from 'mongoose'

const EventoSchema = new Schema({
  turnoId: Number,
  sucursalId: Number,
  numero: String,
  tipo: String,
  accion: { type: String, enum: ['creado', 'llamado', 'finalizado'] },
  modulo: { type: Number, default: null },
  fecha: { type: Date, default: Date.now },
})
export const Evento = model('Evento', EventoSchema)
