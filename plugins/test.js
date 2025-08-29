async function isAdminOrOwner(m, conn) {
  try {
    const groupMetadata = await conn.groupMetadata(m.chat)
    const participant = groupMetadata.participants.find(p => p.id === m.sender)
    return participant?.admin || m.fromMe
  } catch {
    return false
  }
}

const handler = async (m, { conn, command }) => {
  if (!m.isGroup) return m.reply('🔒 Este comando solo funciona en grupos.')

  const admin = await isAdminOrOwner(m, conn)
  if (!admin) return m.reply('❌ Solo admins (o el bot) pueden usar este comando.')

  if (command === 'abrir') {
    await conn.groupSettingUpdate(m.chat, 'not_announcement') // abre el grupo
    await conn.sendMessage(m.chat, { text: '✅ El grupo ha sido abierto, todos pueden escribir.' }, { quoted: m })
  } else if (command === 'cerrar') {
    await conn.groupSettingUpdate(m.chat, 'announcement') // cierra el grupo
    await conn.sendMessage(m.chat, { text: '🔒 El grupo ha sido cerrado, solo admins pueden escribir.' }, { quoted: m })
  }
}

handler.command = ['abrir', 'cerrar']
handler.group = true
handler.tags = ['group']
handler.help = ['abrir', 'cerrar']

export default handler