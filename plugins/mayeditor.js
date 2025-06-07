import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs'
import path from 'path'

let handler = async (m, { conn, args, command, usedPrefix, groupMetadata }) => {
  if (!m.isGroup) return m.reply('👻 Este comando solo funciona en grupos, espíritu.')
  
  let type = args[0]?.toLowerCase()
  if (type !== '1') {
    return m.reply(`✧ Usa el comando así:\n\n${usedPrefix + command} 1`)
  }

  // Obtener información del usuario
  const targetUser = m.sender
  const userId = targetUser.split('@')[0]
  
  try {
    m.reply('🎬 Procesando tu video mágico... Esto puede tomar unos momentos...')
    
    // Obtener foto de perfil del usuario
    const pp = await conn.profilePictureUrl(targetUser, 'image').catch(_ =>
      'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745522645448.jpeg')
    
    // Descargar la foto de perfil
    const profileResponse = await fetch(pp)
    const profileBuffer = await profileResponse.buffer()
    
    // Crear directorios temporales si no existen
    const tempDir = './temp'
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true })
    }
    
    // Rutas de archivos
    const profilePath = path.join(tempDir, `profile_${userId}.jpg`)
    const inputVideoPath = './videos/lv_7507655713968164149_20250607160908.mp4'
    const outputVideoPath = path.join(tempDir, `output_${userId}_${Date.now()}.mp4`)
    
    // Verificar que el video de entrada existe
    if (!fs.existsSync(inputVideoPath)) {
      return m.reply('❌ No se encontró el video base. Verifica la ruta del archivo.')
    }
    
    // Guardar foto de perfil temporalmente
    fs.writeFileSync(profilePath, profileBuffer)
    
    // Procesar video con ffmpeg
    await new Promise((resolve, reject) => {
      ffmpeg(inputVideoPath)
        .input(profilePath)
        .complexFilter([
          // Aplicar colorkey para remover el fondo morado (#ba00ff)
          '[0:v]colorkey=0xba00ff:0.3:0.2[ckout]',
          // Escalar la imagen de fondo al tamaño del video
          '[1:v][ckout]scale2ref[bg][fg]',
          // Superponer el video procesado sobre el fondo
          '[bg][fg]overlay=format=auto'
        ])
        .audioCodec('copy') // Mantener audio original
        .videoCodec('libx264') // Codec de video
        .output(outputVideoPath)
        .on('start', (commandLine) => {
          console.log('FFmpeg iniciado con comando:', commandLine)
        })
        .on('progress', (progress) => {
          console.log(`Procesando... ${Math.round(progress.percent || 0)}%`)
        })
        .on('end', () => {
          console.log('Procesamiento completado')
          resolve()
        })
        .on('error', (err) => {
          console.error('Error en FFmpeg:', err)
          reject(err)
        })
        .run()
    })
    
    // Leer el video procesado
    const processedVideo = fs.readFileSync(outputVideoPath)
    
    // Crear mensaje de contexto falso para el estilo
    const fkontak = {
      "key": {
        "participants": "0@s.whatsapp.net",
        "remoteJid": "status@broadcast",
        "fromMe": false,
        "id": "MayEditor-Magic"
      },
      "message": {
        "contactMessage": {
          "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:MayEditor;Magic;;;\nFN:MayEditor Magic\nitem1.TEL;waid=${userId}:${userId}\nitem1.X-ABLabel:Magia\nEND:VCARD`
        }
      },
      "participant": "0@s.whatsapp.net"
    }
    
    // Mensaje personalizado
    const magicMessage = `
✧･ﾟ: *✧･ﾟ:* 𝑀𝒶𝑔𝒾𝒸 𝒱𝒾𝒹𝑒𝑜 *:･ﾟ✧*:･ﾟ✧
𓂃𓈒𓏸 Video mágico creado para @${userId}
✦ Procesado con tecnología sobrenatural
✧ Tu esencia ha sido capturada en este hechizo visual
𓆩𓆪 ━━━━━━━━━━━━━━━━
    `.trim()
    
    // Enviar el video procesado
    await conn.sendMessage(m.chat, {
      video: processedVideo,
      caption: magicMessage,
      mentions: [targetUser]
    }, { quoted: fkontak })
    
    // Limpiar archivos temporales
    setTimeout(() => {
      try {
        if (fs.existsSync(profilePath)) fs.unlinkSync(profilePath)
        if (fs.existsSync(outputVideoPath)) fs.unlinkSync(outputVideoPath)
      } catch (err) {
        console.error('Error limpiando archivos temporales:', err)
      }
    }, 5000) // Esperar 5 segundos antes de limpiar
    
  } catch (error) {
    console.error('Error procesando video:', error)
    m.reply('❌ Ocurrió un error al procesar tu video mágico. Inténtalo de nuevo más tarde.')
    
    // Limpiar archivos en caso de error
    try {
      const profilePath = path.join('./temp', `profile_${userId}.jpg`)
      if (fs.existsSync(profilePath)) fs.unlinkSync(profilePath)
    } catch (cleanupError) {
      console.error('Error en limpieza:', cleanupError)
    }
  }
}

handler.help = ['mayeditor <1>']
handler.tags = ['group', 'fun', 'media']
handler.command = ['mayeditor']

export default handler
