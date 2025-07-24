import axios from 'axios'
import { JSDOM } from 'jsdom'

// Verifica si el Content-Type del link es algo distinto a text/html
export async function checkLinkResponseType(url, axiosOptions = {}) {
  const { headers } = await axios.head(url, axiosOptions)

  if (!headers?.['content-type']?.includes('text/html')) {
    return headers['content-type'] // ya es link directo
  }

  return false // es HTML, necesita parsing
}

// Extrae el link directo desde un link de MediaFire
export async function getMediafireDirectLink(url, axiosOptions = {}) {
  const validLink = /^https?:\/\/(?:www\.)?mediafire\.com\/file\/[a-zA-Z0-9]+(\/[^/]*)?\/?$/;

  if (!validLink.test(url)) throw new Error('Unknown or invalid MediaFire link')

  try {
    const type = await checkLinkResponseType(url, axiosOptions)

    if (type) return url // es un link de descarga directa

    const { data } = await axios.get(url, axiosOptions)
    const dom = new JSDOM(data)
    const downloadButton = dom.window.document.querySelector('#downloadButton')

    if (!downloadButton) throw new Error('Could not find download button')

    return downloadButton.href
  } catch (err) {
    if (err.response) {
      if (err.response.status === 404) {
        throw new Error('The key you provided for file access was invalid')
      }
      throw new Error(`MediaFire returned status ${err.response.status}`)
    }

    throw err
  }
}
