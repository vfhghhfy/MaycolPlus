const handler = async (m, { conn }) => {
  const texto = `✨ *TEST DE BOTONES FLOTANTES* ✨

¡Hola, soy MaycolBot! ⊂(｡•́‿•̀｡)つ

Aquí te dejo unos botones para jugar:`;

  const botones = [
    {
      buttonId: '.menu',
      buttonText: { displayText: '📜 Menú Principal' },
      type: 1
    },
    {
      buttonId: '.minijuego',
      buttonText: { displayText: '🎮 Jugar Minijuego' },
      type: 1
    },
    {
      buttonId: '.info',
      buttonText: { displayText: 'ℹ️ Info del Bot' },
      type: 1
    }
  ];

  const mensaje = {
    text: texto,
    footer: 'By MaycolAI 🤖❤️',
    buttons: botones,
    headerType: 1
  };

  await conn.sendMessage(m.chat, mensaje, { quoted: m });
};

handler.help = ['testboton'];
handler.tags = ['test', 'fun'];
handler.command = ['testboton'];
handler.register = true;

export default handler;
