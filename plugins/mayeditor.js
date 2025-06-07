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
    return m.reply(`✧ Usa el comando así:\n\n${usedPrefix + command} 1\nO prueba con 2, 3.`)
  }

  // Map de videos según el número que pongan
  const videosMap = {
    '1': './videos/lv_7507655713968164149_20250607160908.mp4',
    '2': './videos/lv_7463895997605743933_20250607164555.mp4',
    '3': './videos/lv_7404392617884028176_20250607165541.mp4',
    '4': './videos/lv_7403812168765852946_20250607173804.mp4'
  }

  // Elegimos la ruta del video según el número
  const inputVideoPath = videosMap[type]

  // Rate limiting: 3 veces al día por usuario
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
    
    await new Promise((resolve, reject) => {
      ffmpeg(inputVideoPath)
        .input(profilePath)
        .complexFilter([
          '[0:v]colorkey=0xba00ff:0.3:0.2[ckout]',
          '[1:v][ckout]scale2ref=720:1280[bg][fg]',
          '[bg][fg]overlay=format=auto[final]'
        ])
        .outputOptions([
          '-map', '[final]',
          '-map', '0:a?',
          '-c:v', 'libx264',
          '-b:v', '1000k',
          '-c:a', 'aac',
          '-b:a', '128k',
          '-ar', '44100',
          '-pix_fmt', 'yuv420p',
          '-movflags', '+faststart',
          '-preset', 'ultrafast',
          '-crf', '23',
          '-maxrate', '1500k',
          '-bufsize', '2000k',
          '-r', '30',
          '-f', 'mp4'
        ])
        .output(outputVideoPath)
        .on('start', (cmd) => console.log('FFmpeg started:', cmd))
        .on('progress', (progress) => {
          if (progress.percent && Math.round(progress.percent) % 25 === 0) {
            console.log(`Processing... ${Math.round(progress.percent)}%`)
          }
        })
        .on('end', () => {
          console.log('✅ Processing finished')
          resolve()
        })
        .on('error', (err) => {
          console.error('❌ FFmpeg error:', err)
          reject(err)
        })
        .run()
    })
    
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
✧･ﾟ: *✧･ﾟ:* 𝑀𝒶𝑔𝒾𝒸 𝒱𝒾𝒹𝑒𝑜 *:･ﾟ✧*:･ﾟ✧
𓂃𓈒𓏸 Video mágico tipo ${type} creado para @${targetUserId}
✦ Procesado con tecnología sobrenatural
✧ Tu esencia ha sido capturada en este hechizo visual
✧ Usos restantes hoy: ${3 - userLimit.count}/10
𓆩𓆪 ━━━━━━━━━━━━━━━━
    `.trim()
    
    await conn.sendMessage(m.chat, {
      video: processedVideo,
      caption: magicMessage,
      mentions: [userId],
      mimetype: 'video/mp4'
    }, { quoted: fkontak })
    
    setTimeout(() => {
      try {
        if (fs.existsSync(profilePath)) fs.unlinkSync(profilePath)
        if (fs.existsSync(outputVideoPath)) fs.unlinkSync(outputVideoPath)
      } catch (e) {
        console.error('Error limpiando archivos temporales:', e)
      }
    }, 10000)
    
  } catch (error) {
    console.error('Error procesando video:', error)
    userLimit.count--
    m.reply('❌ Ocurrió un error al procesar tu video mágico. Inténtalo de nuevo más tarde.')
    
    try {
      if (fs.existsSync(path.join('./temp', `profile_${targetUserId}.jpg`))) {
        fs.unlinkSync(path.join('./temp', `profile_${targetUserId}.jpg`))
      }
    } catch (e) {
      console.error('Error en limpieza:', e)
    }
  }
}

handler.help = ['mayeditor <1|2|3|4|5>']
handler.tags = ['group', 'fun', 'media']
handler.command = ['mayeditor']
handler.group = true
handler.limit = true

export default handler
