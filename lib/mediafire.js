import axios from 'axios'
import { JSDOM } from 'jsdom'

/**
 * Verifica si el enlace ya es descarga directa.
 */
export async function verificarTipoDeContenido(url, options = {}) {
  const { headers } = await axios.head(url, options)
  if (!headers['content-type']?.includes('text/html')) return headers['content-type']
  return false
}

/**
 * Obtiene el enlace de descarga directa de MediaFire.
 */
export async function obtenerEnlaceDirectoMediafire(url, options = {}) {
  // Regex más permisivo: acepta +, _, -, . etc.
  const re = /^https?:\/\/(?:www\.)?mediafire\.com\/file\/[A-Za-z0-9]+\/?.*$/i
  if (!re.test(url)) throw new Error('Enlace de MediaFire inválido o no soportado.')

  try {
    const tipo = await verificarTipoDeContenido(url, options)
    if (tipo) return url

    const { data } = await axios.get(url, options)
    const dom = new JSDOM(data)

    // Intento #1: botón de descarga
    const btn = dom.window.document.querySelector('#downloadButton')
    if (btn?.href) return btn.href

    // Intento #2: enlaces con palabra "download"
    const enlaces = [...dom.window.document.querySelectorAll('a')]
    for (const e of enlaces) {
      const t = e.textContent?.toLowerCase()
      if (t?.includes('download') && e.href.startsWith('https://download')) {
        return e.href
      }
    }

    // Intento #3: regex en HTML
    const regex = /href="(https:\/\/download[^"]+)"/gi
    const m = regex.exec(data)
    if (m?.[1]) return m[1]

    throw new Error('No se pudo encontrar enlace de descarga directa.')
  } catch (err) {
    if (err.response?.status === 404) {
      throw new Error('El archivo no existe o fue eliminado.')
    }
    throw err
  }
      }
