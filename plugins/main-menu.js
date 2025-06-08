let handler = async (m, { conn }) => {
  let userId = m.mentionedJid?.[0] || m.sender;
  let name = await conn.getName(userId);
  let uptime = clockString(process.uptime() * 1000);
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

  let menuText = `
╭───❖ 𝓗𝓪𝓷𝓪𝓴𝓸 𝓑𝓸𝓽 ❖───╮

 ｡ﾟ☆: *.${name}.* :☆ﾟ｡  
> *_${saludo}_*

╰─────❖ 𝓜𝓮𝓷𝓾 ❖─────╯

💻 Sistema: Multi-Device
👤 Espíritu: @${userId.split('@')[0]}
⏰ Tiempo activo: ${uptime}
👥 Espíritus: ${totalreg} Espíritus
⌚ Hora: ${hour}

> Hecho con amor por: *_SoyMaycol_* (◍•ᴗ•◍)❤
`.trim();

  const buttons = [
    { buttonId: '.staff', buttonText: { displayText: '🌐 GitHub & Info' }, type: 1 },
    { buttonId: '.canal', buttonText: { displayText: '📣 Canal de WhatsApp' }, type: 1 }
  ];

  try {
    await conn.sendMessage(m.chat, {
      image: { url: 'https://files.catbox.moe/x9hw62.png' },
      caption: menuText,
      footer: 'El menú más cute que verás hoy (｡･ω･｡)ﾉ♡',
      buttons: buttons,
      headerType: 4,
      contextInfo: { mentionedJid: [userId] },
    }, { quoted: m });
  } catch (e) {
    console.error('Error enviando menú con botones e imagen:', e);
    // Si falla, envía un fallback simple
    await conn.reply(m.chat, menuText, m);
  }
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
