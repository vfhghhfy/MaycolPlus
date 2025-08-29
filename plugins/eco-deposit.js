import db from '../lib/database.js'

let handler = async (m, { args, conn }) => {
  let user = global.db.data.users[m.sender]

  if (!args[0]) 
    return conn.reply(m.chat, `⚠️ Ingresa la cantidad de *${moneda}* que deseas depositar.`, m, { ...global.rcanal })

  if (args[0] === 'all') {
    let count = parseInt(user.coin)
    if (!count || count < 1) 
      return conn.reply(m.chat, `❌ No tienes nada para depositar.`, m, { ...global.rcanal })

    user.coin -= count
    user.bank += count

    return conn.reply(m.chat, `✅ Depositaste *${count} ${moneda}* en el banco.\n💼 Ya no te lo pueden robar.`, m, { ...global.rcanal })
  }

  if (isNaN(args[0])) 
    return conn.reply(m.chat, `⚠️ Ingresa una cantidad válida.\nEjemplo: *#deposit 5000*`, m, { ...global.rcanal })

  let count = parseInt(args[0])
  if (!user.coin || user.coin < 1) 
    return conn.reply(m.chat, `❌ No tienes dinero en la cartera.`, m, { ...global.rcanal })

  if (user.coin < count) 
    return conn.reply(m.chat, `⚠️ Solo tienes *${user.coin} ${moneda}* en la cartera.`, m, { ...global.rcanal })

  user.coin -= count
  user.bank += count

  await conn.reply(m.chat, `✅ Depositaste *${count} ${moneda}* en el banco.`, m, { ...global.rcanal })
}

handler.help = ['depositar']
handler.tags = ['eco']
handler.command = ['deposit', 'depositar', 'dep', 'aguardar']
handler.group = false
handler.register = false

export default handler