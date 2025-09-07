import fs from 'fs'
import path from 'path'
import axios from 'axios'

const handler = async (m, { conn, command }) => {
  const q = m.quoted || m
  const mime = (q.msg || q).mimetype || q.mediaType || ''
  if (!mime) {
    return conn.sendMessage(m.chat, {
      text: `⚠️ Envía una imagen o responde a una con el comando *.${command}*`
    }, { quoted: m })
  }

  // Descargar la imagen original
  const media = await q.download()
  const tempDir = './temp'
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir)
  const ext = mime.split('/')[1] || 'jpg'
  const inputPath = path.join(tempDir, `input_${Date.now()}.${ext}`)
  fs.writeFileSync(inputPath, media)

  // Reacción de carga
  await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

  try {
    // Enviar imagen a la API de remover fondo
    const apiKey = 'may-2b02ac57e684a1c5ba9281d8dabf019c'
    const resp = await axios.get('https://mayapi.giize.com/nobg', {
      params: {
        image: `data:${mime};base64,${media.toString('base64')}`,
        apikey: apiKey
      }
    })

    if (!resp.data?.status) throw new Error('No se pudo remover el fondo')

    const imageUrl = resp.data.result

    // Descargar la imagen resultante
    const resultResp = await axios.get(imageUrl, { responseType: 'arraybuffer' })
    const outputPath = path.join(tempDir, `nobg_${Date.now()}.png`)
    fs.writeFileSync(outputPath, Buffer.from(resultResp.data))

    // Enviar como documento
    await conn.sendMessage(m.chat, {
      document: fs.readFileSync(outputPath),
      fileName: `nobg_${Date.now()}.png`,
      mimetype: 'image/png'
    }, { quoted: m })

    // Reacción de éxito
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

    // Limpiar archivos temporales
    fs.unlinkSync(inputPath)
    fs.unlinkSync(outputPath)
  } catch (err) {
    console.error(err)
    await conn.sendMessage(m.chat, { text: '❌ Error al remover el fondo' }, { quoted: m })
    if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath)
  }
}

handler.help = ['removebg']
handler.tags = ['tools']
handler.command = /^(removebg|nobg)$/i

export default handler
