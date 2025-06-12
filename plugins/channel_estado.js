let mensajesHoy = 0;
let ultimaEncuesta = 'Ninguna';

const handlerEstado = async (m, { conn }) => {
  let participantes = 0;
  let ownerJid = m.sender;

  try {
    const metadata = await conn.groupMetadata(m.chat);
    participantes = metadata.participants.length;

    const owner = metadata.participants.find(p => p.admin === 'superadmin' || p.admin === 'admin');
    if (owner) ownerJid = owner.id;
  } catch (e) {
    console.error('Error obteniendo metadata del grupo:', e);
  }

  const texto = `
📊 *ESTADO DEL CANAL* 📊

👥 Participantes: ${participantes}
💬 Mensajes enviados (desde que el bot está ON): ${mensajesHoy}
🗳 Última encuesta: ${ultimaEncuesta}

(⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)⁠❤ ¡Sigue participando y pasándola bien!
`;

  try {
    // Si quien escribió es el owner → se lo mandamos a él
    if (m.sender === ownerJid) {
      await conn.sendMessage(ownerJid, { text: texto });
    } else {
      // Si no es el owner → se lo mandamos al usuario que usó el comando
      await conn.sendMessage(m.sender, { text: texto });
    }
  } catch (e) {
    console.warn('No se pudo enviar por privado:', e);
    await conn.reply(m.chat, '❌ No pude enviarte el estado por privado. ¡Abre el chat conmigo primero!', m);
  }
};

// Middleware para contar los mensajes
const contarMensajes = (m) => {
  mensajesHoy++;
  return m;
};

handlerEstado.help = ['estado'];
handlerEstado.tags = ['canal'];
handlerEstado.command = ['estado'];
handlerEstado.register = true;
handlerEstado.channel = true;

export { handlerEstado, contarMensajes };
