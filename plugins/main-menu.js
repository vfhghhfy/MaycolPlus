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

  let saludo = hour < 6 ? "🌌 Buenas madrugadas, espíritu insomne..." :
               hour < 12 ? "🌅 Buenos días, alma luminosa~" :
               hour < 18 ? "🌄 Buenas tardes, viajero astral~" :
               "🌃 Buenas noches, sombra errante~";

  let decoEmojis = ['✨', '🌸', '👻', '⭐', '🔮', '💫', '☁️', '🦋', '🪄'];
  let emojiRandom = () => decoEmojis[Math.floor(Math.random() * decoEmojis.length)];

  // Agrupar comandos por categoría
  let categories = {};
  for (let plugin of Object.values(global.plugins)) {
    if (!plugin.help || !plugin.tags) continue;
    for (let tag of plugin.tags) {
      if (!categories[tag]) categories[tag] = [];
      categories[tag].push(...plugin.help.map(cmd => cmd));
    }
  }

  // Armar secciones para el menú tipo lista
  let sections = [];
  for (let [tag, cmds] of Object.entries(categories)) {
    let section = {
      title: `${emojiRandom()} ${tag.toUpperCase().replace(/_/g, ' ')} ${emojiRandom()}`,
      rows: cmds.map(cmd => ({
        title: `💠 /${cmd}`,
        rowId: `/${cmd}`,
        description: `✨ Usa /${cmd}`
      }))
    };
    sections.push(section);
  }

  // Armar el texto de cabecera con stats
  let header = `｡ﾟ☆: *${name}* :☆ﾟ｡\n\n${saludo}\n\n🧿 *Sistema:* Multi-Device\n👻 *Espíritu:* @${userId.split('@')[0]}\n🕰️ *Tiempo activo:* ${uptime}\n🌍 *Espíritus registrados:* ${totalreg}\n⌚ *Hora actual:* ${hour}`;

  await conn.sendMessage(m.chat, {
    image: { url: 'https://files.catbox.moe/x9hw62.png' }, // imagen decorativa
    caption: header,
    footer: "Hecho con amor por: SoyMaycol (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)⁠❤",
    title: "✧ 𝓜𝓮𝓷𝓾 𝓜𝓪𝓰𝓲𝓬𝓸 ✧",
    buttonText: "✨ Abrir comandos mágicos ✨",
    sections,
    contextInfo: {
      mentionedJid: [m.sender, userId],
      externalAdReply: {
        title: "Hanako-Bot Menu 🌸",
        body: "Invoca poderes ocultos del código",
        thumbnailUrl: 'https://files.catbox.moe/x9hw62.png',
        sourceUrl: 'https://soy-maycol.is-a.dev',
        mediaType: 1,
        renderLargerThumbnail: true,
        showAdAttribution: true,
      }
    }
  }, { quoted: m });
};

handler.help = ['menu', 'menú', 'help', 'ayuda'];
handler.tags = ['main'];
handler.command = ['menu', 'menú', 'help', 'ayuda'];

export default handler;

function clockString(ms) {
  let h = Math.floor(ms / 3600000);
  let m = Math.floor(ms / 60000) % 60;
  let s = Math.floor(ms / 1000) % 60;
  return `${h}h ${m}m ${s}s`;
}
