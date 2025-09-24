import path from 'path'
let user = a => '@' + a.split('@')[0]

function handler(m, { groupMetadata, command, conn }) {
    // Tomamos todos los participantes
    let participants = [...groupMetadata.participants.map(v => v.id)]
    
    if (participants.length < 5) return conn.reply(m.chat, '❌ No hay suficientes participantes en el grupo.', m)

    // Categorías predeterminadas
    let categorias = [
        { name: 'personas que hicieron el amor', emoji: '❤️' },
        { name: 'personas que se gustan', emoji: '💘' },
        { name: 'personas geys o lesbianas', emoji: '🏳️‍🌈' },
        { name: 'personas que les gusta Maycol', emoji: '😍' },
        { name: 'personas pervertidas', emoji: '😏' },
    ]

    let replyText = ''

    for (let cat of categorias) {
        // Elegimos 5 usuarios al azar sin repetir
        let seleccion = []
        while (seleccion.length < 5) {
            let u = participants[Math.floor(Math.random() * participants.length)]
            if (!seleccion.includes(u)) seleccion.push(u)
        }

        // Creamos el top 5
        replyText += `📊 *Top 5 de ${cat.name.toUpperCase()}* ${cat.emoji}\n`
        replyText += `1. 🥇 ${user(seleccion[0])}\n`
        replyText += `2. 🥈 ${user(seleccion[1])}\n`
        replyText += `3. 🥉 ${user(seleccion[2])}\n`
        replyText += `4. 🎖️ ${user(seleccion[3])}\n`
        replyText += `5. ✨ ${user(seleccion[4])}\n\n`
        
        // Quitamos los usuarios seleccionados de la lista para no repetirlos en otras categorías
        participants = participants.filter(u => !seleccion.includes(u))
        if (participants.length < 5) participants = [...groupMetadata.participants.map(v => v.id)]
    }

    conn.reply(m.chat, replyText, m, { mentions: replyText.match(/@\S+/g) })
}

handler.help = ['top2']
handler.command = ['top2']
handler.tags = ['group']
handler.group = true
handler.register = false

export default handler
