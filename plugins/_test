const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let handler = async (m, { conn }) => {
  m.reply('🥚 Activando Huevito con Wirk...');

  for (let i = 0; i < 100; i++) {
    await conn.sendMessage(m.chat, { text: '.lagchat' });
    await delay(500); // puedes ajustar el tiempo aquí si quieres
  }

  m.reply('✅ Huevito completado.');
};

handler.command = ['huevitoconwirk'];
handler.owner = false; // Solo tú puedes usarlo
export default handler;
