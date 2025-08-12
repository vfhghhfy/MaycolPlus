const handler = async (m, { conn, text, usedPrefix, command }) => {
  const lid = text?.trim();
  if (!lid || !/^\d+$/.test(lid)) {
    return m.reply(`📌 Usa: ${usedPrefix + command} <LID>\nEjemplo: ${usedPrefix + command} 180650938249287`);
  }

  try {
    // Consulta a WhatsApp con el LID para obtener el JID real
    const data = await conn.onWhatsApp(lid + '@lid');
    console.log(data);

    if (data?.[0]?.jid) {
      const numeroReal = data[0].jid.replace(/@.+/, '');
      return m.reply(`╭─❍「 ✦ RESULTADO ✦ 」    
│    
├─ 🔐 LID: *${lid}@lid*    
├─ ✅ Número Real: *${numeroReal}*    
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
