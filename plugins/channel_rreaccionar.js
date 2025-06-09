const estilos = [
  txt => txt.normalize("NFD").replace(/[\u0300-\u036f]/g, ''), // Normal
  txt => [...txt].map(c => `ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ`[`abcdefghijklmnopqrstuvwxyz`.indexOf(c.toLowerCase())] || c).join(''),
  txt => [...txt].map(c => `🅐🅑🅒🅓🅔🅕🅖🅗🅘🅙🅚🅛🅜🅝🅞🅟🅠🅡🅢🅣🅤🅥🅦🅧🅨🅩`[`abcdefghijklmnopqrstuvwxyz`.indexOf(c.toLowerCase())] || c).join(''),
];

const handler = async (m, { conn, args }) => {
  if (!args[0]) return conn.reply(m.chat, '🔡 Usa así: `.reaccionar <texto>`\nEj: `.reaccionar hola`', m);

  const textoBuscado = args.join(' ').toLowerCase();
  const variantes = estilos.map(fn => fn(textoBuscado));

  try {
    const mensajes = await conn.fetchMessages(m.chat, { limit: 50 });
    let mensajeObjetivo = null;

    for (const msg of mensajes) {
      const mensajeTexto =
        msg.message?.conversation ||
        msg.message?.extendedTextMessage?.text ||
        msg.message?.imageMessage?.caption ||
        msg.message?.videoMessage?.caption ||
        '';

      const mensajeTextoMin = mensajeTexto.toLowerCase();

      if (
        mensajeTextoMin.includes(textoBuscado) ||
        variantes.some(estilo => mensajeTextoMin.includes(estilo.toLowerCase()))
      ) {
        mensajeObjetivo = msg;
        break;
      }
    }

    if (!mensajeObjetivo) {
      return conn.reply(m.chat, `😿 No encontré mensaje que diga algo como: "${textoBuscado}"`, m);
    }

    await conn.sendMessage(m.chat, {
      react: {
        text: '🔥',
        key: mensajeObjetivo.key,
      }
    });

    return conn.reply(m.chat, `✅ Le tiré reacción a un mensaje con: *${textoBuscado}* 🔥`, m);

  } catch (err) {
    console.error('[ERROR REACCIONANDO]', err);
    return conn.reply(m.chat, '⚠️ Error técnico... capaz WhatsApp se enojó 😔', m);
  }
};

handler.help = ['reaccionar <texto>'];
handler.tags = ['tools', 'fun'];
handler.command = ['reaccionar'];
handler.register = true;
handler.channel = true;

export default handler;
