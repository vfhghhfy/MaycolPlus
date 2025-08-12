const handler = async (m, { conn, text, usedPrefix, command }) => {
  const lid = text?.trim();
  if (!lid || !/^\d+$/.test(lid)) {
    return m.reply(`📌 Usa: ${usedPrefix + command} 11747138220075`);
  }

  try {
    let data = await conn.onWhatsApp(lid + '@lid');

    if (data?.[0]?.jid) {
      return m.reply(`╭─❍「 ✦ RESULTADO ✦ 」    
│    
├─ 🔐 LID: *${lid}@lid*    
├─ ✅ Número Real: *${data[0].jid.replace(/@.+/, '')}*    
╰─✦`);
    } else {
      return m.reply('❌ No se pudo encontrar el número real de ese LID');
    }
  } catch (e) {
    console.error(e);
    return m.reply('❌ Hubo un error al intentar resolver el LID');
  }
};

handler.command = ['resolverlid'];
handler.help = ['resolverlid <lid>'];
handler.tags = ['tools'];

export default handler;
