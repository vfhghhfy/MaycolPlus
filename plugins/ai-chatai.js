/**
 * Creado por Ado-rgb
 * Repo: github.com/Ado-rgb
 * No quitar créditos
 */

import axios from 'axios'

const MODELOS = {
  'ChatGPT-4o': 'chatgpt-4o',
  'ChatGPT-4o Mini': 'chatgpt-4o-mini',
  'Claude 3 Opus': 'claude-3-opus',
  'Claude 3.5 Sonnet': 'claude-3-sonnet',
  'Llama 3': 'llama-3',
  'Llama 3.1 (Pro)': 'llama-3-pro',
  'Perplexity AI': 'perplexity-ai',
  'Mistral Large': 'mistral-large',
  'Gemini 1.5 Pro': 'gemini-1.5-pro'
}

async function consultarIA(pregunta, modeloElegido) {
  const modelo = MODELOS[modeloElegido]
  if (!modelo) return `❌ El modelo "${modeloElegido}" no está disponible.`

  try {
    const { data } = await axios.post(
      'https://whatsthebigdata.com/api/ask-ai/',
      {
        message: pregunta,
        model: modelo,
        history: []
      },
      {
        headers: {
          'content-type': 'application/json',
          'origin': 'https://whatsthebigdata.com',
          'referer': 'https://whatsthebigdata.com/ai-chat/',
          'user-agent': 'Mozilla/5.0'
        }
      }
    )

    if (data?.text) {
      return `🔰 Modelo: ${modeloElegido}\n🎋 Pregunta: ${pregunta}\n\n${data.text}`
    }

    return '⚠️ No se obtuvo respuesta de la IA.'
  } catch (e) {
    return `⚠️ Error: ${
      e.response?.status === 400
        ? 'El texto fue rechazado por el modelo.'
        : e.message
    }`
  }
}

let handler = async (m, { args, text }) => {
  if (!text) {
    return m.reply(
`Uso: .chatai [modelo opcional] [pregunta]

Ejemplo 1:
.chatai ¿Qué es la inteligencia artificial?

Ejemplo 2:
.chatai ChatGPT-4o Explica la teoría de cuerdas

Modelos disponibles:
${Object.keys(MODELOS).join(', ')}`
    )
  }

  let modeloElegido = 'Claude 3.5 Sonnet'
  let pregunta = text

  const primeraPalabra = args[0]
  if (MODELOS[primeraPalabra]) {
    modeloElegido = primeraPalabra
    pregunta = args.slice(1).join(' ')
    if (!pregunta) return m.reply('⚠️ Debes escribir una pregunta después del modelo.')
  }

  const respuesta = await consultarIA(pregunta, modeloElegido)
  m.reply(respuesta)
}

handler.help = ['chatai']
handler.tags = ['ia']
handler.command = ['chatai']

export default handler