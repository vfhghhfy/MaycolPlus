const categorias = [
  {
    titulo: "¿Cuál eliges? 🔥💧🌱⚡",
    opciones: ["🔥 Fuego", "💧 Agua", "🌱 Planta", "⚡ Rayo"]
  },
  {
    titulo: "¿Qué marca de celular prefieres? 📱",
    opciones: ["Apple 🍎", "Samsung 📱", "Xiaomi 🧧", "Huawei 🛰️"]
  },
  {
    titulo: "¿Comida favorita? 🍔🍕🍣",
    opciones: ["🍔 Hamburguesa", "🍕 Pizza", "🍣 Sushi", "🌮 Tacos"]
  },
  {
    titulo: "¿Tu YouTuber fav? 🎥",
    opciones: ["MrBeast 💸", "Luisito Comunica 🌎", "AuronPlay 😂", "Tu Mismo 🔥"]
  },
  {
    titulo: "¿Qué superhéroe parte más madres? 🦸‍♂️",
    opciones: ["Batman 🦇", "Iron Man 🤖", "Spider-Man 🕷️", "Goku 💥"]
  },
  {
    titulo: "¿Qué prefieres? 😴🍕",
    opciones: ["Dormir 😴", "Comer 🍕", "Amor 💘", "Programar 💻"]
  },
  {
    titulo: "¿Cuál eliges como novia ficticia? 😳",
    opciones: ["Zero Two 💗", "Hinata 💞", "Megumin 💥", "Tu crush imposible 😩"]
  }
];

const handler = async (m, { conn }) => {
  const juego = categorias[Math.floor(Math.random() * categorias.length)];

  try {
    // Enviamos el poll al privado del usuario (el dueño del canal)
    const poll = await conn.sendPoll(m.sender, `🎮 *MINIJUEGO:* ${juego.titulo}`, juego.opciones);

    // Esperamos 20 segundos y luego enviamos el resultado, también en privado
    setTimeout(async () => {
      const ganador = juego.opciones[Math.floor(Math.random() * juego.opciones.length)];
      await conn.sendMessage(m.sender, {
        text: `🏆 *¡Y el ganador aleatorio es:* ${ganador}!*`,
        mentions: [m.sender]
      });
    }, 20000);

  } catch (e) {
    await conn.reply(m.chat, '❌ No pude mandarte el minijuego por privado. ¿Tienes el chat abierto conmigo? 😢', m);
  }
};

handler.help = ['minijuego'];
handler.tags = ['canal'];
handler.command = ['minijuego', 'jueguito'];
handler.channel = true;

export default handler;
