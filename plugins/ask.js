const handler = async (msg, { conn, args, usedPrefix, command }) => {
  const chatId = msg.key.remoteJid;
  const text = args.join(' ');

  // Detecta si el comando es el especial con .xex para responder con el modo
  if (command === 'xex' && text.startsWith('xex ') || text.startsWith('china ')) {
    // Esto es por si alguien manda directamente:
    // xex china | mensaje  o  xex xex | mensaje
    const [modePart, ...msgParts] = text.split('|').map(v => v.trim());
    const mode = modePart.toLowerCase().split(' ')[0]; // xex o china
    const message = msgParts.join('|').trim();

    if (!message) return conn.reply(chatId, '❌ Faltó el mensaje después del "|"', msg);

    const prefixText = `Comportate como ${mode}: ${message}`;
    return conn.reply(chatId, prefixText, msg);
  }

  // Si no se manda texto, pide que ingrese
  if (!text) {
    return conn.sendMessage(chatId, {
      text: `✳️ Ingresa tu pregunta\nEjemplo: *${usedPrefix + command}* hola`
    }, { quoted: msg });
  }

  // Aquí enviamos la lista interactiva para elegir modo Xex o China
  const sections = [
    {
      title: "Elige con quién quieres hablar:",
      rows: [
        {
          title: "Hablar como Xex",
          rowId: `.xex xex | ${text}`,
          description: "El bot responderá como Xex"
        },
        {
          title: "Hablar como China",
          rowId: `.xex china | ${text}`,
          description: "El bot responderá como China"
        }
      ]
    }
  ];

  const listMessage = {
    text: '¿Con quién quieres que hable el bot? (⺣◡⺣)♡*',
    footer: 'By MaycolAIUltraMD',
    title: '💬 Elección de modo AI',
    buttonText: 'Elegir modo',
    sections
  };

  await conn.sendMessage(chatId, listMessage, { quoted: msg });
};

handler.help = ['xex <mensaje>'];
handler.command = ['xex'];
handler.tags = ['ai'];
handler.register = true;


export default handler;
