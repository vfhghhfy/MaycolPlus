let handler = async (m, { conn, args }) => {
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

  // Agrupar comandos por tags
  let categories = {};
  for (let plugin of Object.values(global.plugins)) {
    if (!plugin.help || !plugin.tags) continue;
    for (let tag of plugin.tags) {
      if (!categories[tag]) categories[tag] = [];
      categories[tag].push(...plugin.help.map(cmd => cmd));
    }
  }

  let decoEmojis = ['✨', '🌸', '👻', '⭐', '🔮', '💫', '☁️', '🦋', '🪄'];
  let emojiRandom = () => decoEmojis[Math.floor(Math.random() * decoEmojis.length)];

  // Crear secciones con los comandos
  let sections = [];
  for (let [tag, cmds] of Object.entries(categories)) {
    let deco = emojiRandom();
    let section = {
      title: `${deco} ${tag.toUpperCase().replace(/_/g, ' ')} ${deco}`,
      rows: cmds.map(cmd => ({
        title: `/${cmd}`,
        rowId: `/${cmd}`,
        description: `Usar el comando /${cmd}`
      }))
    };
    sections.push(section);
  }

  // Texto del menú interactivo
  let menuList = {
    text: `｡ﾟ☆: *.${name}.* :☆ﾟ｡\n\n${saludo}\n\n💻 Sistema: Multi-Device\n👤 Espíritu: @${userId.split('@')[0]}\n⏰ Tiempo activo: ${uptime}\n👥 Espíritus: ${totalreg}\n⌚ Hora: ${hour}`,
    footer: "Hecho con amor por: SoyMaycol (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)⁠❤",
    title: "✨ 𝓜𝓮𝓷𝓾 𝓲𝓷𝓽𝓮𝓻𝓪𝓬𝓽𝓲𝓿𝓸 𝓭𝓮 𝓗𝓪𝓷𝓪𝓴𝓸 ✨",
    buttonText: "📜 Ver categorías",
    sections
  };

  await conn.sendMessage(m.chat, menuList, { quoted: m });
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
