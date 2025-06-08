let handler = async (m, { conn }) => {
  let userId = m.mentionedJid?.[0] || m.sender;
  let name = conn.getName(userId);
  let _uptime = process.uptime() * 1000;
  let uptime = clockString(_uptime);
  let totalreg = Object.keys(global.db.data.users).length;

  let hour = new Intl.DateTimeFormat('es-PE', {
    hour: 'numeric',
    hour12: false,
    timeZone: 'America/Lima'
  }).format(new Date());

  let saludo = hour < 6 ? "🌌 Buenas madrugadas, espíritu insomne... 🌙" :
               hour < 12 ? "🌅 Buenos días, alma luminosa~ ✨" :
               hour < 18 ? "🌄 Buenas tardes, viajero astral~ 🌟" :
               "🌃 Buenas noches, sombra errante~ 🌌";

  // Agrupar comandos por categorías
  let categories = {};
  for (let plugin of Object.values(global.plugins)) {
    if (!plugin.help || !plugin.tags) continue;
    for (let tag of plugin.tags) {
      if (!categories[tag]) categories[tag] = [];
      categories[tag].push(...plugin.help.map(cmd => cmd));
    }
  }

  let decoEmojis = ['✨', '🌸', '👻', '⭐', '🔮', '💫', '☁️', '🦋', '🪄', '🔥', '🌈', '💥', '🎉', '🎊'];
  let emojiRandom = () => decoEmojis[Math.floor(Math.random() * decoEmojis.length)];

  let sections = [];
  for (let [tag, cmds] of Object.entries(categories)) {
    let deco = emojiRandom();
    let title = `${deco} 𝓒𝓪𝓽𝓮𝓰𝓸𝓻𝓲́𝓪: ${tag.toUpperCase().replace(/_/g, ' ')} ${deco}`;
    let rows = cmds.map(cmd => ({
      title: `/${cmd}`,
      rowId: `/${cmd}`,
      description: `🌟 Usa /${cmd} para brillar~`
    }));
    sections.push({ title, rows });
  }

  // Miniatura en base64 o búscala desde una URL
  let thumbnail = await (await fetch('https://files.catbox.moe/x9hw62.png')).buffer(); // Usa tu imagen estilo Hanako~ kawaii aquí

  await conn.sendMessage(m.chat, {
    text: `*✨ MaycolAI — Menú Principal ✨*

👤 𝙷𝚘𝚕𝚊: *${name}*
⏳ 𝙰𝚌𝚝𝚒𝚟𝚘: *${uptime}*
🌎 𝙷𝚘𝚛𝚊 𝚙𝚎𝚛𝚞𝚊𝚗𝚊: *${hour}*
📊 𝙴𝚜𝚙𝚒𝚛𝚒𝚝𝚞𝚜: *${totalreg}*

${saludo}

🪄 Selecciona una categoría para ver sus comandos 👇
`,
    footer: '💫 Made with ♡ by SoyMaycol',
    title: '🌟 Menú de Comandos Interactivo 🌟',
    buttonText: '❤️ Ver categorías ❤️',
    sections,
    jpegThumbnail: thumbnail // Imagen como miniatura decorada
  }, { quoted: m });
};

handler.help = ['menu', 'menú', 'help', 'ayuda'];
handler.tags = ['main'];
handler.command = ['menu', 'menú', 'help', 'ayuda'];
handler.register = true;

export default handler;

function clockString(ms) {
  let h = Math.floor(ms / 3600000);
  let m = Math.floor(ms / 60000) % 60;
  let s = Math.floor(ms / 1000) % 60;
  return `${h}h ${m}m ${s}s`;
}
