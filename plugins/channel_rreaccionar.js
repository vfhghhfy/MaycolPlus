const handler = async (m, { conn, args }) => {
  if (!args[0]) return conn.reply(m.chat, '💬 Usa: `.reaccionar <texto>`\nEj: `.reaccionar hola`', m);

  const textoBuscado = args.join(' ').toLowerCase();

  try {
    // Obtener los últimos 30 mensajes (no más para evitar lag)
    const mensajes = await conn.fetchMessages(m.chat, { limit: 30 });

    let mensajeObjetivo = null;

    for (const msg of mensajes) {
      const mensajeTexto =
        msg.message?.conversation ||
        msg.message?.extendedTextMessage?.text ||
        msg.message?.imageMessage?.caption ||
        msg.message?.videoMessage?.caption ||
        '';

      if (mensajeTexto.toLowerCase().includes(textoBuscado)) {
        mensajeObjetivo = msg;
        break;
      }
    }

    if (!mensajeObjetivo) {
      return conn.reply(m.chat, `😿 No encontré un mensaje que contenga: "${textoBuscado}"`, m);
    }

    // Emoji de reacción fijo o aleatorio
    const emoji = '😂'; // o usa: ['❤️', '😂', '🔥', '😎'][Math.floor(Math.random()*4)]

    await conn.sendMessage(m.chat, {
      react: {
        text: emoji,
        key: mensajeObjetivo.key,
      }
    });

    return conn.reply(m.chat, `✅ Reaccioné al mensaje que decía algo con: *${textoBuscado}* ${emoji}`, m);

  } catch (err) {
    console.error('[ERROR AL REACCIONAR]', err);
    return conn.reply(m.chat, '⚠️ Ocurrió un error técnico al intentar reaccionar. Prueba de nuevo.', m);
  }
};

handler.help = ['reaccionar <texto>'];
handler.tags = ['tools', 'fun'];
handler.command = ['reaccionar'];
handler.register = true;
handler.channel = true;

export default handler;
