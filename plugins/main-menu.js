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

  // Crear secciones con los comandos decoradísimos
  let sections = [];
  for (let [tag, cmds] of Object.entries(categories)) {
    let deco = emojiRandom();
    let title = `${deco} 𝓒𝓪𝓽𝓮𝓰𝓸𝓻𝓲́𝓪: ${tag.toUpperCase().replace(/_/g, ' ')} ${deco}`;
    let rows = cmds.map(cmd => ({
      title: `✨ /${cmd} ✨`,
      rowId: `/${cmd}`,
      description: `🌟 Usa el comando /${cmd} para brillar en el chat!`
    }));
    sections.push({ title, rows });
  }

  let menuList = {
    text: `✨╔═══ ✪ MaycolAI ✪═══╗✨
  
🌟 𝓗𝓸𝓵𝓪, *${name}* (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)⁠❤  
⏰ 𝓣𝓲𝓮𝓶𝓹𝓸 𝓪𝓬𝓽𝓲𝓿𝓸: *${uptime}*  
👥 𝓔𝓼𝓹𝓲𝓻𝓲𝓽𝓾𝓼: *${totalreg}*  
⌚ 𝓗𝓸𝓻𝓪 𝓵𝓸𝓬𝓪𝓵: *${hour}*  
${saludo}

╔══════════════╗
║ 💥 *_COMANDOS_* 💥
╚══════════════╝

🔥 𝗗𝗶𝘃𝗶𝗲́𝗿𝘁𝗲𝘁𝗲 𝘆 𝗲𝘅𝗽𝗹𝗼𝗿𝗮 𝗹𝗼𝘀 𝗰𝗼𝗺𝗮𝗻𝗱𝗼𝘀 🔥  
🌈 𝓢𝓮𝓵𝓮𝓬𝓬𝓲𝓸𝗻𝗮 𝘂𝗻𝗮 𝗰𝗮𝘁𝗲𝗴𝗼𝗿𝗶́𝗮 𝗽𝗮𝗿𝗮 𝗰𝗼𝗻𝘀𝘂𝗹𝘁𝗮𝗿 𝗹𝗼𝘀 𝗰𝗼𝗺𝗮𝗻𝗱𝗼𝘀!

> Sigueme <3: https://whatsapp.com/channel/0029VayXJte65yD6LQGiRB0R

_(◍•ᴗ•◍)❤ ¡Gracias por usar *SoyMaycol*!_`,
    footer: '💫 Made with ♡ by SoyMaycol v2.0 💫',
    title: '✨ 🧸 𝓜𝓮𝓷𝓾 𝓲𝓷𝓽𝓮𝓻𝓪𝓬𝓽𝓲𝓿𝓸 𝓲𝓷𝓬𝓻𝓮𝓲́𝓫𝓵𝓮 🧸 ✨',
    buttonText: '👉 ¡Ver categorías! 👈',
    sections
  };

  await conn.sendMessage(m.chat, menuList, { quoted: m });
};

handler.help = ['menu', 'menú', 'help', 'ayuda'];
handler.tags = ['main'];
handler.command = ['menu', 'menú', 'help', 'ayuda'];
handler.register = true;
handler.channel = true;

export default handler;

function clockString(ms) {
  let h = Math.floor(ms / 3600000);
  let m = Math.floor(ms / 60000) % 60;
  let s = Math.floor(ms / 1000) % 60;
  return `${h}h ${m}m ${s}s`;
}
