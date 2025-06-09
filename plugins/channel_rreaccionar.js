const handler = async (m, { conn, args }) => {
  if (!args[0]) return conn.reply(m.chat, '⛔ Usa así: .reaccionar <texto>\nEj: .reaccionar hola', m);

  const textoBuscado = args.join(' ').toLowerCase();

  try {
    // Buscar los últimos 50 mensajes en el chat
    const mensajes = await conn.fetchMessages(m.chat, { limit: 50 });

    // Buscar el primer mensaje que incluya el texto
    const mensajeObjetivo = mensajes.find(msg =>
      msg?.message?.conversation?.toLowerCase().includes(textoBuscado) ||
      msg?.message?.extendedTextMessage?.text?.toLowerCase().includes(textoBuscado)
    );

    if (!mensajeObjetivo) {
      return conn.reply(m.chat, `❌ No encontré un mensaje que diga: "${textoBuscado}"`, m);
    }

    // Reaccionar al mensaje encontrado con un emoji aleatorio o fijo
    const emoji = '❤️'; // puedes poner emojis random si quieres
    await conn.sendMessage(m.chat, {
      react: {
        text: emoji,
        key: mensajeObjetivo.key,
      }
    });
    return conn.reply(m.chat, `✅ Reaccioné al mensaje que decía: *${textoBuscado}* ${emoji}`, m);

  } catch (e) {
    console.error(e);
    return conn.reply(m.chat, '⚠️ Hubo un error al intentar reaccionar al mensaje.', m);
  }
};

handler.help = ['reaccionar <texto>'];
handler.tags = ['tools', 'fun'];
handler.command = ['reaccionar'];
handler.register = true;
handler.channel = true;

export default handler;
