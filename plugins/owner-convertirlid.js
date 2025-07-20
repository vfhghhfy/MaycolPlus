const handler = async (m, { conn, usedPrefix, command, text }) => {
  let lid = text?.trim();
  if (!lid || !/^\d+$/.test(lid)) {
    return conn.reply(m.chat,
      `╭─❍「 ✦ 𝘾𝙊𝙈𝘼𝙉𝘿𝙊: *convertirlid* ✦ 」\n│\n├─ 📌 Usa: ${usedPrefix}convertirlid 264944184516817\n╰─✦`, m);
  }

  let jidCus = `${lid}@c.us`;
  let jidS = `${lid}@s.whatsapp.net`;

  return conn.reply(m.chat,
    `╭─❍「 ✦ 𝙍𝙀𝙎𝙐𝙇𝙏𝘼𝘿𝙊 ✦ 」\n│\n├─ 🔐 LID Original: *${lid}@lid*\n├─ 📲 Chat estándar: *${jidCus}*\n├─ 🛠️ JID interno: *${jidS}*\n╰─✦`, m);
};

// CONFIGURACIÓN
handler.help = ['convertirlid'];
handler.tags = ['tools'];
handler.command = ['convertirlid']
handler.register = true;

export default handler;
