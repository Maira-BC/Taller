export function limpiarRut(rut: string): string {
  return rut.replace(/[^0-9kK]/g, '').toUpperCase()
}

// "224566549" -> "22456654-9"
export function formatearRut(rut: string): string {
  const limpio = limpiarRut(rut)
  if (limpio.length < 2) return limpio
  return `${limpio.slice(0, -1)}-${limpio.slice(-1)}`
}

// Algoritmo módulo 11: multiplica de derecha a izquierda por 2,3,4,5,6,7,2,3...
export function calcularDv(cuerpo: string): string {
  let suma = 0
  let multiplicador = 2
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * multiplicador
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1
  }
  const resto = 11 - (suma % 11)
  if (resto === 11) return '0'
  if (resto === 10) return 'K'
  return String(resto)
}

export function validarRut(rut: string): boolean {
  const limpio = limpiarRut(rut)
  if (!/^\d{7,8}[\dK]$/.test(limpio)) return false
  return calcularDv(limpio.slice(0, -1)) === limpio.slice(-1)
}
