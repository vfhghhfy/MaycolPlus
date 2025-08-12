const lidMap = new Map(); 
conn.ev.on('messages.upsert', async ({ messages }) => {
  for (const msg of messages) {
    const sender = msg.key.participant || msg.key.remoteJid;
    if (sender?.endsWith('@lid')) {
      console.log('LID detectado:', sender);
    }
  }
});

const handler = async (m, { text, usedPrefix, command }) => {
  const lid = text?.trim();
  if (!lid || !lid.endsWith('@lid')) {
    return m.reply(`📌 Usa: ${usedPrefix + command} <LID completo>\nEjemplo: ${usedPrefix + command} 33814713790490@lid`);
  }
  const numero = lidMap.get(lid);
  if (numero) {
    return m.reply(`Número real para ${lid} es: ${numero}`);
  } else {
    return m.reply('❌ No tengo registrado ese LID en la base local.');
  }
};

handler.command = ['resolverlid'];
handler.help = ['resolverlid <LID>'];
handler.tags = ['tools'];

export default handler;
