const handler = async (m, { conn, args }) => {
  let userId = m.mentionedJid?.[0] || m.sender;
  let user = global.db.data.users[userId];
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

  // Generar las secciones del menú
  let categories = {};
  for (let plugin of Object.values(global.plugins)) {
    if (!plugin.help || !plugin.tags) continue;
    for (let tag of plugin.tags) {
      if (!categories[tag]) categories[tag] = [];
      categories[tag].push(...plugin.help.map(cmd => `.${cmd}`));
    }
  }

  // Crear estructura para lista tipo WhatsApp
  let sections = [];
  for (let [tag, cmds] of Object.entries(categories)) {
    let tagName = tag.toUpperCase().replace(/_/g, ' ');
    let rows = cmds.map(cmd => ({
      title: cmd,
      rowId: cmd,
      description: `${tagName}`
    }));
    sections.push({ title: `✦ ${tagName} ✦`, rows });
  }

  // Mensaje de introducción
  let menuHeader = `｡ﾟ☆: *.${name}.* :☆ﾟ｡\n> *_${saludo}_*\n\n👤 Espíritu: @${userId.split('@')[0]}\n⏰ Activo: ${uptime}\n👥 Espíritus: ${totalreg}`;

  // Miniatura y preview del menú
  await conn.sendMessage(m.chat, {
    video: { url: 'https://files.catbox.moe/i74z9e.mp4', gifPlayback: true },
    caption: '⌜ ⊹ Espera tantito, espíritu curioso... ⊹ ⌟',
    gifPlayback: true,
    contextInfo: {
      externalAdReply: {
        title: '𝓗𝓪𝓷𝓪𝓴𝓸 𝓑𝓸𝓽 ✦ Menú',
        body: 'Un amor que nunca se acaba Jeje <3',
        thumbnailUrl: 'https://files.catbox.moe/x9hw62.png',
        sourceUrl: redes,
        mediaType: 1,
        showAdAttribution: true,
        renderLargerThumbnail: true
      }
    }
  }, { quoted: m });

  // Enviar el menú con lista
  await conn.sendMessage(m.chat, {
    title: '✨ Menú de Comandos ✨',
    text: menuHeader,
    footer: 'By SoyMaycol (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)⁠❤',
    buttonText: '🌟 Ver Comandos',
    sections
  }, { quoted: m });
};

handler.help = ['menu'];
handler.tags = ['main'];
handler.command = ['menu', 'menú', 'help', 'ayuda'];
export default handler;

function clockString(ms) {
  let h = Math.floor(ms / 3600000);
  let m = Math.floor(ms / 60000) % 60;
  let s = Math.floor(ms / 1000) % 60;
  return `${h}h ${m}m ${s}s`;
}
