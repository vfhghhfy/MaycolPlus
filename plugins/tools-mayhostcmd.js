let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!global.activeSocket?.connected) return m.reply('❌ No hay una sesión activa, conecta con *.mayhost <url> <token>* primero.');
  if (!args.length) return m.reply(`*Uso:* ${usedPrefix + command} <comando>`);

  const cmd = args.join(' ');

  if (cmd.toLowerCase() === 'exit') {
    global.activeSocket.disconnect();
    global.activeSocket = null;
    return m.reply('👋 Sesión cerrada.');
  }

  m.reply('⏳ Ejecutando comando remoto...');
  global.activeSocket.emit('command', cmd);
};

handler.help = ['mayhostcmd <comando>'];
handler.tags = ['tools'];
handler.command = ['mayhostcmd'];

export default handler;
