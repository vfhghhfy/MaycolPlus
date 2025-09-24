let user = a => '@' + a.split('@')[0]

function handler(m, { groupMetadata, command, conn }) {
    let participants = [...groupMetadata.participants.map(v => v.id)]
    
    if (participants.length < 6) return conn.reply(m.chat, '❌ No hay suficientes participantes en el grupo.', m)

    let categorias = [
        { name: 'personas que hicieron el amor', emoji: '❤️', parejas: true },
        { name: 'personas que se gustan', emoji: '💘', parejas: true },
        { name: 'personas geys o lesbianas', emoji: '🏳️‍🌈', parejas: false },
        { name: 'personas que les gusta Maycol', emoji: '😍', parejas: false },
        { name: 'personas pervertidas', emoji: '😏', parejas: false },
    ]

    let replyText = ''
    let mentions = []

    for (let cat of categorias) {
        if (cat.parejas) {
            // Seleccionamos 6 usuarios distintos para 3 parejas
            let seleccion = []
            while (seleccion.length < 6) {
                let u = participants[Math.floor(Math.random() * participants.length)]
                if (!seleccion.includes(u)) seleccion.push(u)
            }

            replyText += `📊 *Top 3 parejas de ${cat.name.toUpperCase()}* ${cat.emoji}\n`
            replyText += `1. ${user(seleccion[0])} y ${user(seleccion[1])}\n`
            replyText += `2. ${user(seleccion[2])} y ${user(seleccion[3])}\n`
            replyText += `3. ${user(seleccion[4])} y ${user(seleccion[5])}\n\n`

            mentions.push(...seleccion)
            participants = participants.filter(u => !seleccion.includes(u))
            if (participants.length < 6) participants = [...groupMetadata.participants.map(v => v.id)]

        } else {
            // Top 5 normal
            let seleccion = []
            while (seleccion.length < 5) {
                let u = participants[Math.floor(Math.random() * participants.length)]
                if (!seleccion.includes(u)) seleccion.push(u)
            }

            replyText += `📊 *Top 5 de ${cat.name.toUpperCase()}* ${cat.emoji}\n`
            replyText += `1. 🥇 ${user(seleccion[0])}\n`
            replyText += `2. 🥈 ${user(seleccion[1])}\n`
            replyText += `3. 🥉 ${user(seleccion[2])}\n`
            replyText += `4. 🎖️ ${user(seleccion[3])}\n`
            replyText += `5. ✨ ${user(seleccion[4])}\n\n`

            mentions.push(...seleccion)
            participants = participants.filter(u => !seleccion.includes(u))
            if (participants.length < 5) participants = [...groupMetadata.participants.map(v => v.id)]
        }
    }

    conn.reply(m.chat, replyText, m, { mentions })
}

handler.help = ['top2']
handler.command = ['top2']
handler.tags = ['group']
handler.group = true
handler.register = false

export default handler
