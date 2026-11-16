export function limpiarRut(rut: string): string {
  return rut.replace(/[^0-9kK]/g, '').toUpperCase()
}

// "224566549" -> "22456654-9"
export function formatearRut(rut: string): string {
  const limpio = limpiarRut(rut)
  if (limpio.length < 2) return limpio
  return `${limpio.slice(0, -1)}-${limpio.slice(-1)}`
}

// Solo revisa el formato (7 u 8 dígitos + dígito verificador numérico o K), no si el verificador calza
export function validarRut(rut: string): boolean {
  return /^\d{7,8}[\dK]$/.test(limpiarRut(rut))
}
