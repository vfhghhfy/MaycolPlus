// ♥ 𝙼𝚎𝚗𝚞 𝚍𝚎 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 ♥
// ᵁˢᵃ ᵉˢᵗᵉ ᶜᵒᵈⁱᵍᵒ ˢⁱᵉᵐᵖʳᵉ ᶜᵒⁿ ᶜʳᵉᵈⁱᵗᵒˢ

let handler = async (m, { conn, args }) => {
  let userId = m.mentionedJid?.[0] || m.sender
  let user = global.db.data.users[userId]
  let name = conn.getName(userId)
  let _uptime = process.uptime() * 1000
  let uptime = clockString(_uptime)
  let totalreg = Object.keys(global.db.data.users).length

  // Saludo decorado con animaciones
  let hour = new Intl.DateTimeFormat('es-PE', {
    hour: 'numeric',
    hour12: false,
    timeZone: 'America/Lima'
  }).format(new Date())
  
  // Arrays de variaciones para animaciones de texto
  let saludoVariations = {
    madrugada: [
      "🌌 Buenas madrugadas, espíritu insomne...",
      "🌙 Madrugada mística, alma nocturna~",
      "⭐ Noche eterna, sombra despierta..."
    ],
    mañana: [
      "🌅 Buenos días, alma luminosa~",
      "☀️ Aurora dorada, espíritu radiante~",
      "🌈 Mañana celestial, corazón brillante~"
    ],
    tarde: [
      "🌄 Buenas tardes, viajero astral~",
      "🌺 Tarde encantada, alma errante~",
      "🦋 Atardecer mágico, espíritu libre~"
    ],
    noche: [
      "🌃 Buenas noches, sombra errante~",
      "🌟 Noche estrellada, alma misteriosa~",
      "🔮 Oscuridad mágica, espíritu etéreo~"
    ]
  }

  // Función para seleccionar saludo aleatorio
  let getSaludo = () => {
    if (hour < 6) return saludoVariations.madrugada[Math.floor(Math.random() * 3)]
    if (hour < 12) return saludoVariations.mañana[Math.floor(Math.random() * 3)]
    if (hour < 18) return saludoVariations.tarde[Math.floor(Math.random() * 3)]
    return saludoVariations.noche[Math.floor(Math.random() * 3)]
  }

  // Agrupar comandos por categorías
  let categories = {}
  for (let plugin of Object.values(global.plugins)) {
    if (!plugin.help || !plugin.tags) continue
    for (let tag of plugin.tags) {
      if (!categories[tag]) categories[tag] = []
      categories[tag].push(...plugin.help.map(cmd => `#${cmd}`))
    }
  }

  // Emojis y decoraciones animadas
  let decoEmojis = ['✨', '🌸', '👻', '⭐', '🔮', '💫', '☁️', '🦋', '🪄', '🌙', '💎', '🌺']
  let sparkleEmojis = ['✧', '⋆', '✦', '❋', '✪', '✫', '⟡', '✭']
  let frameStyles = [
    { top: '╭───❖', bottom: '╰─────❖', side: '❖' },
    { top: '┌━━━⟡', bottom: '└─────⟡', side: '⟡' },
    { top: '╔═══✧', bottom: '╚═════✧', side: '✧' },
    { top: '┏━━━⋆', bottom: '┗─────⋆', side: '⋆' }
  ]
  
  let emojiRandom = () => decoEmojis[Math.floor(Math.random() * decoEmojis.length)]
  let sparkleRandom = () => sparkleEmojis[Math.floor(Math.random() * sparkleEmojis.length)]
  let frameRandom = () => frameStyles[Math.floor(Math.random() * frameStyles.length)]

  // Títulos animados para el bot
  let botTitles = [
    "𝓗𝓪𝓷𝓪𝓴𝓸 𝓑𝓸𝓽",
    "ℋ𝒶𝓃𝒶𝓀𝑜 ℬ𝑜𝓉",
    "𝐇𝐚𝐧𝐚𝐤𝐨 𝐁𝐨𝐭",
    "ᴴᵃⁿᵃᵏᵒ ᴮᵒᵗ"
  ]

  // Estilos de separadores
  let separators = [
    "≪──── ⋆𓆩✧𓆪⋆ ────≫",
    "◆━━━━━━━━━━━━━━━━━━━━━━━◆",
    "⟡ ─────────────────── ⟡",
    "✧･ﾟ: *✧･ﾟ:*　　*:･ﾟ✧*:･ﾟ✧"
  ]

  // Función principal de animación del menú
  let createAnimatedMenu = (iteration = 0) => {
    let currentFrame = frameRandom()
    let currentTitle = botTitles[iteration % botTitles.length]
    let currentSeparator = separators[iteration % separators.length]
    let currentSaludo = getSaludo()
    
    // MENÚ HANAKO-KUN STYLE ANIMADO
    let menuText = `
${currentFrame.top} ${currentTitle} ${currentFrame.side}───╮

 ${sparkleRandom()}ﾟ☆: *.${name}.* :☆ﾟ${sparkleRandom()}  
> *_${currentSaludo}_*

${currentFrame.bottom} 𝓜𝓮𝓷𝓾 ${currentFrame.side}─────╯

${sparkleRandom()} 𝙸𝙽𝙵𝙾 𝙳𝙴 𝚂𝚄𝙼𝙾𝙽 ${sparkleRandom()}

💻 Sistema: Multi-Device
👤 Espíritu: @${userId.split('@')[0]}
⏰ Tiempo activo: ${uptime}
👥 Espíritus: ${totalreg} Espiritus
⌚ Hora: ${hour}

> Hecho con amor por: *_SoyMaycol_* (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)⁠❤

${currentSeparator}
`.trim()

    // Decoraciones animadas para categorías
    let categoryDecorations = [
      { start: '╭─━━━', end: '━━━╮', mid: '│', close: '╰─━━━━━━━━━━━━━━━━╯' },
      { start: '┌─⟡⟡⟡', end: '⟡⟡⟡┐', mid: '│', close: '└─⟡⟡⟡⟡⟡⟡⟡⟡⟡⟡⟡⟡⟡┘' },
      { start: '╔═✧✧✧', end: '✧✧✧╗', mid: '║', close: '╚═✧✧✧✧✧✧✧✧✧✧✧✧✧╝' },
      { start: '┏━⋆⋆⋆', end: '⋆⋆⋆━┓', mid: '┃', close: '┗━⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆━┛' }
    ]

    for (let [tag, cmds] of Object.entries(categories)) {
      let tagName = tag.toUpperCase().replace(/_/g, ' ')
      let deco = emojiRandom()
      let catDeco = categoryDecorations[iteration % categoryDecorations.length]
      
      menuText += `

${catDeco.start} ${deco} ${tagName} ${deco} ${catDeco.end}
${cmds.map(cmd => `${catDeco.mid} ➯ ${cmd}`).join('\n')}
${catDeco.close}`
    }

    return menuText
  }

  // Mensajes de carga animados
  let loadingMessages = [
    '⌜ ⊹ Espera tantito, espíritu curioso... ⊹ ⌟',
    '⌜ ✧ Invocando la magia del menú... ✧ ⌟',
    '⌜ ⋆ Preparando hechizos y comandos... ⋆ ⌟',
    '⌜ 🔮 Consultando los misterios... 🔮 ⌟'
  ]

  let randomLoadingMsg = loadingMessages[Math.floor(Math.random() * loadingMessages.length)]

  // Mensaje previo cute
  await conn.reply(m.chat, randomLoadingMsg, m, {
    contextInfo: {
      externalAdReply: {
        title: botname,
        body: "Un amor que nunca se acaba Jeje <3",
        thumbnailUrl: 'https://files.catbox.moe/x9hw62.png',
        sourceUrl: redes,
        mediaType: 1,
        showAdAttribution: true,
        renderLargerThumbnail: true,
      }
    }
  })

  // Sistema de animación de menú (2 minutos = 120 segundos)
  let animationDuration = 120000 // 2 minutos en ms
  let intervalTime = 8000 // Cambio cada 8 segundos
  let iterations = animationDuration / intervalTime // 15 iteraciones
  let currentIteration = 0

  // Enviar menú inicial
  let sentMessage = await conn.sendMessage(m.chat, {
    video: { url: 'https://files.catbox.moe/i74z9e.mp4', gifPlayback: true },
    caption: createAnimatedMenu(0),
    gifPlayback: true,
    contextInfo: {
      mentionedJid: [m.sender, userId],
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363372883715167@newsletter',
        newsletterName: 'SoyMaycol <3',
        serverMessageId: -1,
      },
      forwardingScore: 999,
      externalAdReply: {
        title: botname,
        body: "Un amor que nunca se acaba Jeje <3",
        thumbnailUrl: banner,
        sourceUrl: redes,
        mediaType: 1,
        showAdAttribution: true,
        renderLargerThumbnail: true,
      },
    }
  }, { quoted: m })

  // Animación del menú - SOLO EDITA, NO ENVÍA NUEVOS MENSAJES
  let animationInterval = setInterval(async () => {
    currentIteration++
    
    if (currentIteration >= iterations) {
      clearInterval(animationInterval)
      return
    }

    try {
      // EDITAR el mensaje existente en lugar de enviar uno nuevo
      await conn.sendMessage(m.chat, {
        text: createAnimatedMenu(currentIteration),
        edit: sentMessage.key
      })
    } catch (error) {
      console.log('Error en animación del menú:', error)
      clearInterval(animationInterval)
    }
  }, intervalTime)
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu', 'menú', 'help', 'ayuda']

export default handler

function clockString(ms) {
  let h = Math.floor(ms / 3600000)
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  return `${h}h ${m}m ${s}s`
  }
