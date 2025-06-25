import { io } from "socket.io-client";

let handler = async (m, { conn, args, usedPrefix, command }) => {
  
  if (args.length < 2) {
    return m.reply(`*Uso:* ${usedPrefix + command} <url> <token>\n_Ejemplo:_ ${usedPrefix + command} http://localhost:3000 mi_token123`);
  }

  const url = args[0];
  const token = args[1];

  m.reply(`🔄 *Conectando a MayHost...*\n🌐 URL: ${url}\n🔑 Token: ${token}`);

  const socket = io(url, {
    auth: { token },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
    timeout: 10000
  });

  socket.on('connect', () => {
    m.reply(`✅ *Conectado a MayHost!* 🎉\n💡 Responde a este mensaje con comandos.\n💡 Escribe *exit* para cerrar la sesión.`);
  });

  socket.on('disconnect', reason => {
    m.reply(`❌ *Desconectado:* ${reason}`);
  });

  socket.on('connect_error', error => {
    m.reply(`❌ *Error de conexión:* ${error.message}`);
  });

  socket.on('output', data => {
    if (data && data.trim()) {
      m.reply(`📤 *Salida:* \n${data}`);
    }
  });

  socket.on('session', data => {
    m.reply(`📋 *Sesión activa:* ${data.username} (${data.sessionId})`);
  });

  socket.on('reconnect', attempt => {
    m.reply(`✅ *Reconectado después de ${attempt} intentos*`);
  });

  socket.on('reconnect_failed', () => {
    m.reply('❌ *No se pudo reconectar al servidor*');
  });

  const listener = conn.ev.on('messages.upsert', async chat => {
    try {
      const msg = chat.messages[0];
      if (!msg || msg.key.fromMe || msg.message?.extendedTextMessage?.contextInfo?.stanzaId !== m.key.id) return;

      const text = msg.text?.trim() || msg.message?.conversation?.trim();
      if (!text) return;

      if (text.toLowerCase() === 'exit') {
        m.reply('👋 Cerrando sesión MayHost...');
        socket.disconnect();
        conn.ev.off('messages.upsert', listener);
        return;
      }

      m.reply('⏳ Ejecutando comando remoto...');
      socket.emit('command', text);

    } catch (e) {
      console.error(e);
    }
  });
};

handler.help = ['mayhost <url> <token>'];
handler.tags = ['tools'];
handler.command = ['mayhost'];

export default handler;
