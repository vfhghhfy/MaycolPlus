handler = async (m, { conn, usedPrefix, command, text }) => {
  let lid = text?.trim();
  if (!lid || !/^\d+$/.test(lid)) {
    return conn.reply(m.chat,
      `╭─❍「 ✦ 𝙋𝙇𝙐𝚂: convertirlid ✦ 」\n│\n├─ ❗️ Usa: ${usedPrefix}convertirlid 264944184516817\n╰─✦`, m);
  }
  // Generar JID tipo personal
  let jid_cus = `${lid}@c.us`;
  // Y opcionalmente tipo servidor s.whatsapp.net
  let jid_s = `${lid}@s.whatsapp.net`;

  return conn.reply(m.chat,
    `╭─❍「 ✦ 𝙍𝙀𝙎𝚄𝙇𝚃𝙰𝙙𝙊 ✦ 」\n│\n├─ Original LID: ${lid}@lid\n├─ Como chat estándar: ${jid_cus}\n├─ Como JID interno: ${jid_s}\n╰─✦`, m);
}

handler.help = ['convertirlid']
handler.tags = ['owner']
handler.command = ['convertirlid']
handler.group = true
handler.register = true

export default handler
