import { io } from "socket.io-client";

let activeSocket = null; // Guardamos la conexión global

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (args.length < 2) return m.reply(`*Uso:* ${usedPrefix + command} <url> <token>`);

  const url = args[0];
  const token = args[1];

  if (activeSocket?.connected) {
    return m.reply('⚠️ Ya hay una sesión activa, escribe *exit* para cerrarla o espera.');
  }

  m.reply(`🔄 *Conectando a MayHost...*\n🌐 URL: ${url}\n🔑 Token: ${token}`);

  const socket = io(url, {
    auth: { token },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
    timeout: 10000
  });

  activeSocket = socket;

  socket.on('connect', () => {
    m.reply(`✅ *Conectado a MayHost!* 🎉\nEnvía comandos usando *.mayhostcmd <comando>*\nEscribe *.mayhostcmd exit* para cerrar la sesión.`);
  });

  socket.on('disconnect', reason => {
    m.reply(`❌ *Desconectado:* ${reason}`);
    activeSocket = null;
  });

  socket.on('connect_error', error => {
    m.reply(`❌ *Error de conexión:* ${error.message}`);
    activeSocket = null;
  });

  socket.on('output', data => {
    if (data?.trim()) {
      m.reply(`📤 *Salida:*\n${data}`);
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
    activeSocket = null;
  });
};

handler.help = ['mayhost <url> <token>'];
handler.tags = ['tools'];
handler.command = ['mayhost'];

export default handler;
