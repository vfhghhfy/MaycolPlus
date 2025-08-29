let handler = async (m, { text, args, usedPrefix, command }) => {    
  let user = global.db.data.users[m.sender]    
    
  if (user.registered) {    
    return m.reply(`
╔════ஓ๑♡๑ஓ════╗
     ✦ Ya estás registrado/a ✦  
      ${user.name || m.pushName} UwU  
╚════ஓ๑♡๑ஓ════╝`)    
  }    
    
  if (!args[0]) {    
    return m.reply(`
╔═══❀•°:°•❀═══╗
     ✦ Registro ✦  
Usa el comando así:  

${usedPrefix + command} TuNombre.Edad  

Ejemplo: ${usedPrefix + command} Hanako.16  
╚═══❀•°:°•❀═══╝`)    
  }    
    
  let [name, age] = text.split('.')    
  age = parseInt(age)    
    
  if (!name || !age) {    
    return m.reply(`
✦ Formato inválido ✦  
Ejemplo correcto:  
${usedPrefix + command} Hanako.16`)    
  }    
    
  if (age < 5 || age > 100) {    
    return m.reply(`
╔═━━✦༻❁༺✦━━═╗
  La edad debe estar  
    entre 5 y 100 años  
╚═━━✦༻❁༺✦━━═╝`)    
  }    
    
  user.name = name.trim()    
  user.age = age    
  user.regTime = +new Date()    
  user.registered = true    
    
  m.reply(`
╔════ஓ๑♡๑ஓ════╗
   ✦ Registro exitoso ✦  

• Nombre: ${user.name}  
• Edad: ${user.age} años  

¡Bienvenid@ al Reino Hanako! 👻🖤  
╚════ஓ๑♡๑ஓ════╝`)    
}    
    
handler.help = ['reg <nombre.edad>']    
handler.tags = ['info']    
handler.command = ['reg']    
handler.register = false    
    
export default handler