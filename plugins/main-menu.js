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
      title: `🔮 /${cmd}`,
      rowId: `/${cmd}`,
      description: `✨ ¡Explora el comando /${cmd} y brilla como una estrella!`
    }));
    sections.push({ title, rows });
  }

  let menuList = {
    title: ``,
    text: `
╭─╼[ *❤️ Menu ❤️* ]╾─╮

✨ ¡Hola, *${name}*! Bienvenido/a a tu zona segura ✨  
📌 *Tiempo activo:* ${uptime}  
👥 *Usuarios registrados:* ${totalreg}  
⌚ *Hora actual:* ${hour}  
💬 *Saludo:* ${saludo}

📣 *SÍGUEME EN MI CANAL!*  
👉 https://whatsapp.com/channel/0029VayXJte65yD6LQGiRB0R

╰─╼[ ✧ ᴱˡⁱʲᵉ ᵘⁿ ᶜᵒᵐᵃⁿᵈᵒ ✧ ]╾─╯
`,
    footer: `🧸 Con cariño por *_SoyMaycol_*`,
    buttonText: '♥ Comandos ♥',
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
