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

  let sections = [];
  for (let [tag, cmds] of Object.entries(categories)) {
    let deco = emojiRandom();
    let section = {
      title: `${deco} ${tag.toUpperCase().replace(/_/g, ' ')} ${deco}`,
      rows: cmds.map(cmd => ({
        title: `🧩 /${cmd}`,
        rowId: `/${cmd}`,
        description: `✨ Toca para usar /${cmd}`
      }))
    };
    sections.push(section);
  }

  let textIntro = `⌜ ⊹ Espera tantito, espíritu curioso... ⊹ ⌟`;
  await conn.sendMessage(m.chat, { text: textIntro }, { quoted: m });

  // Esperar 2 segundos para más drama jeje
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Enviar imagen épica decorativa
  await conn.sendMessage(m.chat, {
    image: { url: 'https://files.catbox.moe/x9hw62.png' },
    caption: `🌟 Bienvenido, ${name}...\n\nTu viaje espiritual comienza ahora...\n\n🕯️ Prepárate para descubrir los comandos ocultos...`,
    contextInfo: {
      externalAdReply: {
        title: "Menú de Hanako-Bot",
        body: "Invoca poderes y comandos ✨",
        thumbnailUrl: 'https://files.catbox.moe/x9hw62.png',
        sourceUrl: 'https://soy-maycol.is-a.dev',
        mediaType: 1,
        showAdAttribution: true,
        renderLargerThumbnail: true,
      }
    }
  }, { quoted: m });

  // Esperar otro poco pa' que cargue como juego de PS2 jeje
  await new Promise(resolve => setTimeout(resolve, 2500));

  // Ahora sí, menú de secciones
  let menuList = {
    text: `｡ﾟ☆: *.${name}.* :☆ﾟ｡\n\n${saludo}\n\n💻 Sistema: Multi-Device\n👤 Espíritu: @${userId.split('@')[0]}\n⏰ Tiempo activo: ${uptime}\n👥 Espíritus: ${totalreg}\n⌚ Hora: ${hour}`,
    footer: "Hecho con amor por: SoyMaycol (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)⁠❤",
    title: "╭─[ 🌸 𝓜𝓮𝓷𝓾 𝓜𝓪𝓰𝓲𝓬𝓸 🌸 ]─╮",
    buttonText: "✨ Ver comandos disponibles ✨",
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
