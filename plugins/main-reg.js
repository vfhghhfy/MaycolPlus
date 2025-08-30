import fetch from "node-fetch";

let handler = async (m, { text, args, usedPrefix, command, conn }) => {
  let user = global.db.data.users[m.sender];

  if (user.registered) {
    return m.reply(`
╔════ஓ๑♡๑ஓ════╗
     ✦ Ya estás registrado/a ✦  
      ${user.name || m.pushName} UwU  
╚════ஓ๑♡๑ஓ════╝`);
  }

  if (!args[0]) {
    return m.reply(`
╔═══❀•°:°•❀═══╗
     ✦ Registro ✦  
Usa el comando así:  

${usedPrefix + command} TuNombre.Edad  

Ejemplo: ${usedPrefix + command} Hanako.16  
╚═══❀•°:°•❀═══╝`);
  }

  let [name, age] = text.split(".");
  age = parseInt(age);

  if (!name || !age) {
    return m.reply(`
✦ Formato inválido ✦  
Ejemplo correcto:  
${usedPrefix + command} Hanako.16`);
  }

  if (age < 5 || age > 100) {
    return m.reply(`
╔═━━✦༻❁༺✦━━═╗
  La edad debe estar  
    entre 5 y 100 años  
╚═━━✦༻❁༺✦━━═╝`);
  }

  user.name = name.trim();
  user.age = age;
  user.regTime = +new Date();
  user.registered = true;

  // ─ ✦ Mensaje privado al usuario ✦ ─
  m.reply(`
╔════ஓ๑♡๑ஓ════╗
   ✦ Registro exitoso ✦  

• Nombre: ${user.name}  
• Edad: ${user.age} años  

¡Bienvenid@ al Reino Hanako! 👻🖤  
╚════ஓ๑♡๑ஓ════╝`);

  // ─ ✦ Aviso al grupo ✦ ─
  let group = "120363400617656861@g.us";
  let hora = new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });
  let aviso = `
━━━━━ ◦ 𝐀𝐯𝐢𝐬𝐨 ◦ ━━━━━
[★] Espiritu: *${user.name}*  
[★] Edad: *${user.age} años*  
[★] Hora registrada: *${hora}*  
> Gracias ${user.name} por Usarme :3`;

  try {
    // Intentar obtener foto de perfil
    let pp;
    try {
      pp = await conn.profilePictureUrl(m.sender, "image");
    } catch {
      pp = null;
    }

    if (pp) {
      await conn.sendMessage(group, {
        image: { url: pp },
        caption: aviso,
      });
    } else {
      await conn.sendMessage(group, { text: aviso });
    }
  } catch (e) {
    console.log("Error enviando aviso al grupo:", e);
  }
};

handler.help = ["reg <nombre.edad>"];
handler.tags = ["info"];
handler.command = ["reg"];
handler.register = false;

export default handler;
