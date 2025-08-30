import fetch from 'node-fetch'
import https from 'https'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

const API_KEY = '88ae7828893847a080f52fee2c48bf39'
const SPEAKER_ID = '67aee909-5d4b-11ee-a861-00163e2ac61b' // Hatsune Miku 💙

const ttsDir = path.join(process.cwd(), 'tts')
if (!fs.existsSync(ttsDir)) {
  fs.mkdirSync(ttsDir, { recursive: true })
}

async function generateMikuTTS(text) {
  return new Promise((resolve, reject) => {
    const fileId = crypto.randomBytes(8).toString('hex')
    const outputPath = path.join(ttsDir, `${fileId}.wav`)

    const postData = JSON.stringify({
      text: text,
      speaker: SPEAKER_ID,
      emotion: 'Happy'
    })

    const options = {
      hostname: 'api.topmediai.com',
      path: '/v1/text2speech',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'Content-Length': Buffer.byteLength(postData)
      }
    }

    const req = https.request(options, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try {
          const json = JSON.parse(data)
          const audioUrl = json?.data?.oss_url

          if (!audioUrl) return reject(new Error('No audio URL in response'))

          // Descargar audio
          const file = fs.createWriteStream(outputPath)
          https.get(audioUrl, (audioRes) => {
            audioRes.pipe(file)
            file.on('finish', () => {
              file.close()
              resolve(outputPath)
            })
          }).on('error', err => reject(err))

        } catch (err) {
          reject(err)
        }
      })
    })

    req.on('error', reject)
    req.write(postData)
    req.end()
  })
}

let handler = async (m, { conn, args }) => {
  const text = args.join(' ')
  if (!text) return m.reply('✐ Debes escribir el texto para convertir en audio.')

  try {
    const audioPath = await generateMikuTTS(text)

    await conn.sendMessage(m.chat, {
      audio: fs.readFileSync(audioPath),
      mimetype: 'audio/mpeg',
      ptt: true
    }, { quoted: m })

    fs.unlink(audioPath, (err) => {
      if (err) console.error(`Error eliminando archivo: ${err.message}`)
    })

  } catch (e) {
    console.error(e)
    m.reply('✐ Ocurrió un error al generar el audio con Miku.')
  }
}

handler.command = /^tts$/i
handler.register = true
export default handler
