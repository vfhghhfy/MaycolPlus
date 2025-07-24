import axios from 'axios'
import { JSDOM } from 'jsdom'

/**
 * Verifica si el enlace de MediaFire ya es una descarga directa (no HTML).
 * @param {string} url - El enlace a verificar.
 * @param {object} axiosOptions - Opciones para Axios.
 * @returns {string|false} - El tipo de contenido o `false` si es HTML.
 */
export async function verificarTipoDeContenido(url, axiosOptions = {}) {
  const { headers } = await axios.head(url, axiosOptions)

  // Si no es HTML, ya es un enlace directo (ej: application/zip)
  if (!headers?.['content-type']?.includes('text/html')) {
    return headers['content-type']
  }

  return false // Es HTML, necesita parsear con JSDOM
}

/**
 * Extrae el enlace de descarga directa desde una URL de MediaFire.
 * @param {string} url - El enlace original de MediaFire.
 * @param {object} axiosOptions - Opciones para Axios.
 * @returns {string} - Enlace directo de descarga.
 */
export async function obtenerEnlaceDirectoMediafire(url, axiosOptions = {}) {
  const enlaceValido = /^https?:\/\/(?:www\.)?mediafire\.com\/file\/[a-zA-Z0-9]+(\/[^/]*)?\/?$/i

  if (!enlaceValido.test(url)) {
    throw new Error('❌ Enlace de MediaFire inválido o no soportado.')
  }

  try {
    const tipo = await verificarTipoDeContenido(url, axiosOptions)

    // Si ya es directo (no es HTML), lo devolvemos tal cual
    if (tipo) return url

    const { data } = await axios.get(url, axiosOptions)
    const dom = new JSDOM(data)

    // 1. Intenta con el botón de descarga principal
    const botonDescarga = dom.window.document.querySelector('#downloadButton')
    if (botonDescarga?.href) return botonDescarga.href

    // 2. Intenta encontrar un enlace con pattern de descarga
    const enlaces = [...dom.window.document.querySelectorAll('a')]
    for (const enlace of enlaces) {
      const texto = enlace.textContent?.toLowerCase()
      if (texto?.includes('download') && enlace.href?.startsWith('https://download')) {
        return enlace.href
      }
    }

    // 3. Fallback: busca manualmente en el HTML con regex
    const regex = /href="(https:\/\/download[^"]+)"/gi
    const coincidencia = regex.exec(data)
    if (coincidencia?.[1]) return coincidencia[1]

    throw new Error('❌ No se pudo encontrar el botón de descarga ni el enlace directo.')

  } catch (err) {
    if (err.response) {
      if (err.response.status === 404) {
        throw new Error('🔑 La clave de acceso al archivo es inválida o fue eliminado.')
      }
      throw new Error(`⚠️ MediaFire respondió con estado ${err.response.status}`)
    }

    throw new Error(`💥 Error desconocido al procesar MediaFire: ${err.message}`)
  }
}
