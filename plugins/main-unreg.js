let handler = async (m, { usedPrefix, command }) => {
  let user = global.db.data.users[m.sender]

  if (!user.registered) {
    return m.reply(`
╔══✦•⚫•✦══╗
   No estás registrado/a  
 Usa: ${usedPrefix}reg TuNombre.Edad  
╚══✦•⚫•✦══╝`)
  }

  user.registered = false
  user.name = null
  user.age = null
  user.regTime = null

  m.reply(`
╔════ஓ๑♡๑ஓ════╗
   ✦ Registro borrado ✦  

 Has eliminado tu cuenta  
    con éxito 👻🖤  

 ¡Hasta pronto...  
   espíritu errante! 🌙  
╚════ஓ๑♡๑ஓ════╝`)
}

handler.help = ['unreg']
handler.tags = ['info']
handler.command = ['unreg']

export default handler