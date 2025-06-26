import fetch from 'node-fetch'

let handler = async (m, { conn }) => {

  // Respuesta inicial al mensaje de la persona
  conn.reply(m.chat, `
╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <𝟹 ✦ 」    
│    
├─ El hechizo *#mayultra* no existe en los registros del más allá.    
│    
├─ ¿Quisiste decir *#mayletras*?    
│   ⇝ *#help*    
╰─✦    
`, m)

  // Tiempo aleatorio entre 3 a 10 segundos
  let tiempoEspera = Math.floor(Math.random() * 7000) + 3000

  // Eventos random
  let eventos = [
    '🎁 *Te ganaste 100 MayCoins… nah, es broma jsjs*',
    '✨ *Te llegó suerte por 3 horas según los fantasmas~*',
    '🌟 *Alguien pensó en ti justo ahora... ¿Quién será?*',
    '👻 *Hanako te está observando detrás de la puerta… cuidado*',
    '💌 *Recibirás un mensaje inesperado hoy… o mañana, o nunca jsjs*'
  ]

  let eventoAleatorio = eventos[Math.floor(Math.random() * eventos.length)]

  // Espera y manda la segunda parte
  setTimeout(() => {
    conn.reply(m.chat, `¡Espera! ¡Espera! No te vayas (⁠っ⁠˘̩⁠╭⁠╮⁠˘̩⁠)⁠っ  
  
¡Tengo una sorpresa para Ti! (⁠•⁠ ⁠▽⁠ ⁠•⁠;⁠)  
  
${eventoAleatorio}  
> Hecho por SoyMaycol <3

`, m)
  }, tiempoEspera)

}

handler.help = ['mayultra']
handler.tags = ['fun']
handler.command = ['mayultra']

export default handler
