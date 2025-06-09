// CODIGO HECHO POR SOYMAYCOL
// DEJAR CREDITOS AL CREADOR UWU
// github: SoySapo6

import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs'
import path from 'path'

let handler = async (m, { conn, args, command, usedPrefix }) => {
  if (!m.isGroup) return m.reply('👻 Este comando solo funciona en grupos, espíritu.')

  // Aquí leemos el número que ponen después de mayeditor
  let type = args[0]?.toLowerCase()
  if (!type || !['1','2','3','4','5'].includes(type)) {
    return m.reply(`✧ Usa el comando así:\n\n${usedPrefix + command} 1\nO prueba con 2, 3, 4, 5.`)
  }

  // Map de videos según el número que pongan
  const videosMap = {
    '1': './videos/lv_7507655713968164149_20250607160908.mp4',
    '2': './videos/lv_7463895997605743933_20250607164555.mp4',
    '3': './videos/lv_7404392617884028176_20250607165541.mp4',
    '4': './videos/lv_7403812168765852946_20250607173804.mp4',
    '5': './videos/video5.mp4' // Agregado video 5
  }

  // Elegimos la ruta del video según el número
  const inputVideoPath = videosMap[type]

  // Rate limiting: 10 veces al día por usuario
  const userId = m.sender
  const today = new Date().toDateString()

  if (!global.db.data.users[userId]) {
    global.db.data.users[userId] = {}
  }

  if (!global.db.data.users[userId].mayeditor) {
    global.db.data.users[userId].mayeditor = { count: 0, date: today }
  }

  const userLimit = global.db.data.users[userId].mayeditor

  if (userLimit.date !== today) {
    userLimit.count = 0
    userLimit.date = today
  }

  if (userLimit.count >= 10) {
    return m.reply('✧ Ya has usado tu magia 10 veces hoy, espíritu.\n✧ Vuelve mañana para más hechizos visuales... 🌙')
  }

  userLimit.count++

  const targetUserId = userId.split('@')[0]

  try {
    m.reply(`🎬 Procesando tu video mágico tipo ${type}... (${userLimit.count}/10 usos hoy)\n✧ Esto tomará unos momentos...\n\n> Hecho por SoyMaycol`)

    // Obtener foto de perfil
    const pp = await conn.profilePictureUrl(userId, 'image').catch(_ =>    
      'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745522645448.jpeg')    
        
    const profileResponse = await fetch(pp)    
    const profileBuffer = await profileResponse.buffer()    
        
    const tempDir = './temp'    
    if (!fs.existsSync(tempDir)) {    
      fs.mkdirSync(tempDir, { recursive: true })    
    }    
        
    const profilePath = path.join(tempDir, `profile_${targetUserId}.jpg`)    
    const outputVideoPath = path.join(tempDir, `output_${targetUserId}_${Date.now()}.mp4`)    
        
    if (!fs.existsSync(inputVideoPath)) {    
      return m.reply('❌ No se encontró el video base. Verifica la ruta del archivo.')    
    }    
        
    fs.writeFileSync(profilePath, profileBuffer)    

    // Obtener información del video para adaptar la resolución
    const videoInfo = await new Promise((resolve, reject) => {
      ffmpeg.ffprobe(inputVideoPath, (err, metadata) => {
        if (err) reject(err)
        else resolve(metadata)
      })
    })

    const videoStream = videoInfo.streams.find(stream => stream.codec_type === 'video')
    const videoWidth = videoStream.width
    const videoHeight = videoStream.height
    const videoAspectRatio = videoWidth / videoHeight

    console.log(`Video original: ${videoWidth}x${videoHeight} (ratio: ${videoAspectRatio})`)
        
    await new Promise((resolve, reject) => {    
      ffmpeg(inputVideoPath)    
        .input(profilePath)    
        .complexFilter([
          // Paso 1: Aplicar chroma key al video original
          '[0:v]colorkey=0x00ff00:0.3:0.1[keyed]', // Verde más preciso
          // Paso 2: Redimensionar la imagen de perfil para que coincida con el video
          `[1:v]scale=${videoWidth}:${videoHeight}:force_original_aspect_ratio=decrease,pad=${videoWidth}:${videoHeight}:(ow-iw)/2:(oh-ih)/2:black[scaled_profile]`,
          // Paso 3: Superponer la imagen redimensionada sobre las áreas con chroma key
          '[scaled_profile][keyed]overlay=0:0[final]'
        ])    
        .outputOptions([    
          '-map', '[final]',    
          '-map', '0:a?', // Preservar audio si existe
          '-c:v', 'libx264',    
          '-b:v', '2000k', // Mejor calidad de video
          '-c:a', 'aac',    
          '-b:a', '128k',    
          '-ar', '44100',    
          '-pix_fmt', 'yuv420p',    
          '-movflags', '+faststart',    
          '-preset', 'medium', // Mejor balance calidad/velocidad
          '-crf', '20', // Mejor calidad
          '-maxrate', '3000k',    
          '-bufsize', '4000k',    
          '-r', '30',    
          '-f', 'mp4'    
        ])    
        .output(outputVideoPath)    
        .on('start', (cmd) => console.log('FFmpeg iniciado:', cmd))    
        .on('progress', (progress) => {    
          if (progress.percent && Math.round(progress.percent) % 20 === 0) {    
            console.log(`Procesando... ${Math.round(progress.percent)}%`)    
          }    
        })    
        .on('end', () => {    
          console.log('✅ Procesamiento terminado')    
          resolve()    
        })    
        .on('error', (err) => {    
          console.error('❌ Error de FFmpeg:', err)    
          reject(err)    
        })    
        .run()    
    })    

    // Verificar que el archivo de salida existe y tiene contenido
    if (!fs.existsSync(outputVideoPath)) {
      throw new Error('El archivo de video procesado no fue creado')
    }

    const fileStats = fs.statSync(outputVideoPath)
    if (fileStats.size === 0) {
      throw new Error('El archivo de video procesado está vacío')
    }
        
    const processedVideo = fs.readFileSync(outputVideoPath)    
        
    const fkontak = {    
      key: {    
        participants: '0@s.whatsapp.net',    
        remoteJid: 'status@broadcast',    
        fromMe: false,    
        id: 'MayEditor-Magic'    
      },    
      message: {    
        contactMessage: {    
          vcard: `BEGIN:VCARD\nVERSION:3.0\nN:MayEditor;Magic;;;\nFN:MayEditor Magic\nitem1.TEL;waid=${targetUserId}:${targetUserId}\nitem1.X-ABLabel:Magia\nEND:VCARD`    
        }    
      },    
      participant: '0@s.whatsapp.net'    
    }    
        
    const magicMessage = `
✧･ﾟ: ✧･ﾟ: 𝑀𝒶𝑔𝒾𝒸 𝒱𝒾𝒹𝑒𝑜 :･ﾟ✧:･ﾟ✧
𓂃𓈒𓏸 Video mágico tipo ${type} creado para @${targetUserId}
✦ Procesado con tecnología sobrenatural
✧ Tu esencia ha sido capturada en este hechizo visual
✧ Resolución adaptada: ${videoWidth}x${videoHeight}
✧ Usos restantes hoy: ${10 - userLimit.count}/10
𓆩𓆪 ━━━━━━━━━━━━━━━━
    `.trim()

    await conn.sendMessage(m.chat, {    
      video: processedVideo,    
      caption: magicMessage,    
      mentions: [userId],    
      mimetype: 'video/mp4'    
    }, { quoted: fkontak })    

    // Limpiar archivos temporales después de un tiempo
    setTimeout(() => {    
      try {    
        if (fs.existsSync(profilePath)) fs.unlinkSync(profilePath)    
        if (fs.existsSync(outputVideoPath)) fs.unlinkSync(outputVideoPath)    
        console.log('🧹 Archivos temporales limpiados')
      } catch (e) {    
        console.error('Error limpiando archivos temporales:', e)    
      }    
    }, 15000) // Aumentado a 15 segundos para mejor estabilidad

  } catch (error) {
    console.error('Error procesando video:', error)
    // Revertir el contador si hay error
    userLimit.count = Math.max(0, userLimit.count - 1)
    
    // Mensaje de error más específico
    let errorMessage = '❌ Ocurrió un error al procesar tu video mágico.'
    
    if (error.message.includes('No such file')) {
      errorMessage += '\n🔍 Verifica que el video base existe en la ruta especificada.'
    } else if (error.message.includes('ffmpeg')) {
      errorMessage += '\n⚙️ Error en el procesamiento de video. Inténtalo de nuevo.'
    } else if (error.message.includes('network') || error.message.includes('fetch')) {
      errorMessage += '\n🌐 Error de conexión al obtener tu foto de perfil.'
    }
    
    errorMessage += '\n\n💡 Inténtalo de nuevo en unos momentos.'
    
    m.reply(errorMessage)

    // Limpiar archivos temporales en caso de error
    try {    
      const profilePath = path.join('./temp', `profile_${targetUserId}.jpg`)
      const outputVideoPath = path.join('./temp', `output_${targetUserId}_*.mp4`)
      
      if (fs.existsSync(profilePath)) {    
        fs.unlinkSync(profilePath)    
      }
      
      // Limpiar posibles archivos de salida
      const tempFiles = fs.readdirSync('./temp').filter(file => 
        file.startsWith(`output_${targetUserId}_`) && file.endsWith('.mp4')
      )
      
      tempFiles.forEach(file => {
        const filePath = path.join('./temp', file)
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath)
        }
      })
      
    } catch (cleanupError) {    
      console.error('Error en limpieza de archivos:', cleanupError)    
    }
  }
}

handler.help = ['mayeditor <1|2|3|4|5>']
handler.tags = ['group', 'fun', 'media']
handler.command = ['mayeditor']
handler.group = true
handler.limit = true

export default handler
