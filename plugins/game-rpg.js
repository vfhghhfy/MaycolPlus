import { canLevelUp, xpRange } from '../lib/levelling.js'

let handler = async (m, { conn, usedPrefix, command, args, isPrems }) => {
    let user = global.db.data.users[m.sender]
    let chat = global.db.data.chats[m.chat]
    
    // Verificar si está registrado
    if (!user.registered) {
        return m.reply(`╭─「 ❮✦❯ REGISTRO REQUERIDO 」─╮
│ ⊱ Para acceder al mundo místico
│ ⊱ necesitas registrarte primero~
│
│ ◦ Usa: ${usedPrefix}reg <nombre>.<edad>
╰─────────────────────────╯`)
    }

    // Comandos disponibles
    let rpgCommands = ['perfil', 'inventario', 'aventura', 'tienda', 'trabajar', 'pelear', 'dungeon', 'heal', 'subir', 'stats']
    let subCommand = args[0]?.toLowerCase() || 'menu'

    switch(subCommand) {
        case 'menu':
        case 'help':
            let menuText = `╭──❮✦ RPG HANAKO-KUN ✦❯──╮
│ ⊱ ¡Bienvenido al mundo espiritual!
│ ⊱ Usuario: ${user.name}
│ ⊱ Nivel: ${user.level}
│ ⊱ Rol: ${user.role}
╰─────────────────────────╯

╔══❮ COMANDOS DISPONIBLES ❯══╗
║
║ ◦ ${usedPrefix}rpg perfil
║   └ Ver tu perfil completo
║
║ ◦ ${usedPrefix}rpg inventario  
║   └ Revisar tus pertenencias
║
║ ◦ ${usedPrefix}rpg aventura
║   └ Explorar lugares misteriosos
║
║ ◦ ${usedPrefix}rpg tienda
║   └ Comprar objetos mágicos
║
║ ◦ ${usedPrefix}rpg trabajar
║   └ Ganar monedas y experiencia
║
║ ◦ ${usedPrefix}rpg pelear [usuario]
║   └ Desafía a otros usuarios
║
║ ◦ ${usedPrefix}rpg dungeon
║   └ Explorar calabozos peligrosos
║
║ ◦ ${usedPrefix}rpg heal
║   └ Restaurar tu salud
║
║ ◦ ${usedPrefix}rpg subir
║   └ Subir de nivel manualmente
║
║ ◦ ${usedPrefix}rpg stats
║   └ Ver estadísticas del servidor
║
╚═════════════════════════════╝

╭─「 ⚠️ NOTA IMPORTANTE 」─╮
│ ⊱ Cada acción consume tiempo
│ ⊱ ¡Se estratégico con tus movimientos!
╰─────────────────────────╯`
            
            return m.reply(menuText)

        case 'perfil':
        case 'profile':
            // Calcular nivel y experiencia
            let { min, xp, max } = xpRange(user.level, global.multiplier)
            let name = user.name || m.pushName
            let math = Math.min(99, Math.max(Math.floor((user.exp - min) / (max - min) * 100), 0))
            
            // Determinar rango/rol basado en nivel
            let roles = {
                0: "👻 Espíritu Novato",
                5: "🌙 Guardián Lunar", 
                10: "⚡ Exorcista Aprendiz",
                15: "🔮 Medium Espiritual",
                20: "👑 Maestro Místico",
                25: "🌟 Leyenda Sobrenatural",
                30: "💀 Señor de las Sombras",
                40: "🏮 Emperador Hanako",
                50: "✨ Deidad del Más Allá"
            }
            
            let roleKeys = Object.keys(roles).map(Number).sort((a, b) => b - a)
            let currentRole = roles[roleKeys.find(level => user.level >= level)] || roles[0]
            
            // Estado de salud
            let healthBar = '█'.repeat(Math.floor(user.health / 10)) + '░'.repeat(10 - Math.floor(user.health / 10))
            let healthStatus = user.health > 80 ? '💚 Excelente' : 
                             user.health > 60 ? '💛 Buena' : 
                             user.health > 40 ? '🧡 Regular' : 
                             user.health > 20 ? '❤️ Crítica' : '💀 Agonizante'

            let profile = `╭──❮✦ PERFIL ESPIRITUAL ✦❯──╮
│
│ 👤 Nombre: ${name}
│ 🎭 Rol: ${currentRole}  
│ ⭐ Nivel: ${user.level}
│ ✨ EXP: ${user.exp - min}/${max - min}
│ 📊 Progreso: ${math}% [${('█'.repeat(Math.floor(math/10)) + '░'.repeat(10 - Math.floor(math/10))).slice(0,10)}]
│
╰─────────────────────────╯

╭──❮ ESTADÍSTICAS ❯──╮
│
│ 💰 Monedas: ${user.coin.toLocaleString()}
│ 💎 Diamantes: ${user.diamond}
│ 🏦 Banco: ${user.bank.toLocaleString()}
│ ❤️ Salud: ${user.health}/100
│ 🩸 Estado: ${healthStatus}
│ 📈 [${healthBar}] ${user.health}%
│
╰─────────────────────────╯

╭──❮ INFORMACIÓN ADICIONAL ❯──╮
│
│ 🎂 Edad: ${user.age > 0 ? user.age + ' años' : 'No registrada'}
│ 💍 Estado: ${user.marry ? '💕 Comprometido/a' : '💔 Soltero/a'}
│ 🏆 Victorias: ${user.wins || 0}
│ ⚰️ Derrotas: ${user.defeats || 0}
│ 📅 Registro: ${user.regTime > 0 ? new Date(user.regTime).toLocaleDateString('es-ES') : 'Desconocido'}
│ 🕐 Última aventura: ${user.lastadventure > 0 ? ((Date.now() - user.lastadventure) / 60000).toFixed(0) + 'min' : 'Nunca'}
│
╰─────────────────────────╯`

            return m.reply(profile)

        case 'inventario':
        case 'inv':
            // Inicializar inventario si no existe
            if (!user.inventory) {
                user.inventory = {
                    potion: 0,
                    sword: 0,
                    shield: 0,
                    armor: 0,
                    key: 0,
                    scroll: 0,
                    talisman: 0,
                    crystal: 0,
                    herb: 0,
                    gem: 0
                }
            }

            let inventory = user.inventory
            let totalItems = Object.values(inventory).reduce((a, b) => a + b, 0)

            let invText = `╭──❮✦ INVENTARIO MÍSTICO ✦❯──╮
│
│ 👤 Propietario: ${user.name}
│ 📦 Total de objetos: ${totalItems}
│
╰─────────────────────────╯

╔══❮ OBJETOS DE BATALLA ❯══╗
║
║ ⚔️ Espadas mágicas: ${inventory.sword}
║ 🛡️ Escudos protectores: ${inventory.shield} 
║ 🥋 Armaduras místicas: ${inventory.armor}
║
╠══❮ CONSUMIBLES ❯══╣
║
║ 🧪 Pociones de salud: ${inventory.potion}
║ 🌿 Hierbas medicinales: ${inventory.herb}
║ 📜 Pergaminos mágicos: ${inventory.scroll}
║
╠══❮ OBJETOS ESPECIALES ❯══╣
║
║ 🔮 Cristales de poder: ${inventory.crystal}
║ 🗝️ Llaves misteriosas: ${inventory.key}
║ 🪬 Talismanes protectores: ${inventory.talisman}
║ 💎 Gemas preciosas: ${inventory.gem}
║
╚═════════════════════════════╝

╭─「 💡 TIP HANAKO-KUN 」─╮
│ ⊱ Usa objetos sabiamente en aventuras
│ ⊱ Algunos son raros de conseguir~
╰─────────────────────────╯`

            return m.reply(invText)

        case 'aventura':
        case 'adventure':
            let cooldownAdv = 600000 // 10 minutos
            let timeLeft = (user.lastadventure + cooldownAdv) - Date.now()
            
            if (timeLeft > 0) {
                let minutes = Math.floor(timeLeft / 60000)
                let seconds = Math.floor((timeLeft % 60000) / 1000)
                return m.reply(`╭─「 ⏰ COOLDOWN ACTIVO 」─╮
│ ⊱ Debes esperar ${minutes}m ${seconds}s
│ ⊱ para la próxima aventura
│ ⊱ ¡Hanako dice que descanses! uwu
╰─────────────────────────╯`)
            }

            if (user.health < 20) {
                return m.reply(`╭─「 💀 SALUD CRÍTICA 」─╮
│ ⊱ Tu salud está muy baja
│ ⊱ Usa ${usedPrefix}rpg heal primero
│ ⊱ ¡No quiero que te desvanezcas!
╰─────────────────────────╯`)
            }

            // Aventuras disponibles
            let adventures = [
                {
                    name: "🏫 Escuela Kamome",
                    danger: 1,
                    rewards: { coin: [100, 300], exp: [50, 100], item: ['potion', 'scroll'] },
                    events: [
                        "Encontraste un aula vacía con monedas olvidadas",
                        "Hanako-kun te regaló algunas monedas",
                        "Descubriste un pergamino mágico en el baño",
                        "Los rumores te dieron algo de experiencia"
                    ]
                },
                {
                    name: "🌙 Mundo de los Espejos",
                    danger: 3,
                    rewards: { coin: [200, 500], exp: [80, 150], item: ['crystal', 'talisman'] },
                    events: [
                        "Te reflejaste en un espejo mágico y ganaste poder",
                        "Un fragmento de cristal te siguió al mundo real",
                        "El otro lado del espejo te recompensó",
                        "Tsukasa te dejó un regalo... inquietante"
                    ]
                },
                {
                    name: "🏮 Misterio No.7",
                    danger: 5,
                    rewards: { coin: [300, 700], exp: [100, 200], item: ['key', 'gem'] },
                    events: [
                        "Resolviste uno de los misterios de la escuela",
                        "Hanako te confió una llave especial",
                        "El límite se debilitó y encontraste tesoros",
                        "Los otros misterios te recompensaron"
                    ]
                },
                {
                    name: "⚰️ Reino de los Muertos",
                    danger: 8,
                    rewards: { coin: [500, 1000], exp: [150, 300], item: ['sword', 'armor'] },
                    events: [
                        "Sobreviviste al juicio de las almas perdidas",
                        "Un guerrero caído te entregó su espada",
                        "Las sombras te respetaron y te dieron tesoros",
                        "El señor de la muerte apreció tu valentía"
                    ]
                }
            ]

            // Seleccionar aventura aleatoria basada en nivel
            let availableAdv = adventures.filter(adv => adv.danger <= user.level / 5 + 1)
            if (availableAdv.length === 0) availableAdv = [adventures[0]]
            
            let selectedAdv = availableAdv[Math.floor(Math.random() * availableAdv.length)]
            let success = Math.random() > (selectedAdv.danger * 0.1)

            user.lastadventure = Date.now()

            if (!user.inventory) user.inventory = {}

            if (success) {
                // Aventura exitosa
                let coinReward = Math.floor(Math.random() * (selectedAdv.rewards.coin[1] - selectedAdv.rewards.coin[0]) + selectedAdv.rewards.coin[0])
                let expReward = Math.floor(Math.random() * (selectedAdv.rewards.exp[1] - selectedAdv.rewards.exp[0]) + selectedAdv.rewards.exp[0])
                let itemReward = selectedAdv.rewards.item[Math.floor(Math.random() * selectedAdv.rewards.item.length)]
                let event = selectedAdv.events[Math.floor(Math.random() * selectedAdv.events.length)]

                user.coin += coinReward
                user.exp += expReward
                user.inventory[itemReward] = (user.inventory[itemReward] || 0) + 1
                
                // Pequeña pérdida de salud por el esfuerzo
                user.health = Math.max(0, user.health - Math.floor(Math.random() * 10))

                return m.reply(`╭──❮✦ AVENTURA EXITOSA ✦❯──╮
│
│ 🎯 Lugar: ${selectedAdv.name}
│ 📖 Evento: ${event}
│
╰─────────────────────────╯

╔══❮ RECOMPENSAS ❯══╗
║
║ 💰 Monedas: +${coinReward}
║ ⭐ Experiencia: +${expReward}
║ 🎁 Objeto: ${itemReward} x1
║ ❤️ Salud: -${10 - (user.health + 10 - Math.max(0, user.health))}
║
╚═════════════════════╝

╭─「 🌸 HANAKO DICE 」─╮
│ ⊱ "¡Bien hecho! Eres más fuerte
│ ⊱ de lo que pensaba~ uwu"
╰─────────────────────────╯`)
            } else {
                // Aventura fallida
                let lostHealth = Math.floor(Math.random() * 30) + 10
                let lostCoins = Math.floor(user.coin * 0.1)
                
                user.health = Math.max(0, user.health - lostHealth)
                user.coin = Math.max(0, user.coin - lostCoins)

                return m.reply(`╭──❮⚠️ AVENTURA FALLIDA ⚠️❯──╮
│
│ 💀 Lugar: ${selectedAdv.name}
│ 🩸 El peligro era demasiado...
│
╰─────────────────────────╯

╔══❮ PÉRDIDAS ❯══╗
║
║ 💔 Salud: -${lostHealth}
║ 💸 Monedas: -${lostCoins}
║
╚═══════════════╝

╭─「 😈 TSUKASA SE RÍE 」─╮
│ ⊱ "Jajaja~ No eres tan fuerte
│ ⊱ como creías ¿verdad?"
╰─────────────────────────╯`)
            }

        case 'tienda':
        case 'shop':
            let shopText = `╭──❮✦ TIENDA HANAKO-KUN ✦❯──╮
│
│ 🏮 Bienvenido a mi tienda secreta~
│ 💰 Tus monedas: ${user.coin.toLocaleString()}
│
╰─────────────────────────╯

╔══❮ OBJETOS EN VENTA ❯══╗
║
║ 🧪 Poción de salud - 150 monedas
║   └ ${usedPrefix}rpg comprar pocion
║
║ ⚔️ Espada mágica - 500 monedas  
║   └ ${usedPrefix}rpg comprar espada
║
║ 🛡️ Escudo protector - 400 monedas
║   └ ${usedPrefix}rpg comprar escudo
║
║ 🥋 Armadura mística - 800 monedas
║   └ ${usedPrefix}rpg comprar armadura
║
║ 🔮 Cristal de poder - 300 monedas
║   └ ${usedPrefix}rpg comprar cristal
║
║ 📜 Pergamino mágico - 200 monedas
║   └ ${usedPrefix}rpg comprar pergamino
║
║ 🪬 Talismán protector - 600 monedas
║   └ ${usedPrefix}rpg comprar talisman
║
║ 💎 Gema preciosa - 1000 monedas
║   └ ${usedPrefix}rpg comprar gema
║
╚═════════════════════════════╝

╭─「 💡 HANAKO SUSURRA 」─╮
│ ⊱ "Los objetos raros aparecen
│ ⊱ solo para almas especiales~ ufufu"
╰─────────────────────────╯`

            return m.reply(shopText)

        case 'comprar':
        case 'buy':
            let item = args[1]?.toLowerCase()
            if (!item) {
                return m.reply(`╭─「 ❌ ERROR 」─╮
│ ⊱ Especifica qué quieres comprar
│ ⊱ Ej: ${usedPrefix}rpg comprar pocion
╰─────────────────────────╯`)
            }

            let shopItems = {
                'pocion': { price: 150, name: '🧪 Poción de salud', key: 'potion' },
                'espada': { price: 500, name: '⚔️ Espada mágica', key: 'sword' },
                'escudo': { price: 400, name: '🛡️ Escudo protector', key: 'shield' },
                'armadura': { price: 800, name: '🥋 Armadura mística', key: 'armor' },
                'cristal': { price: 300, name: '🔮 Cristal de poder', key: 'crystal' },
                'pergamino': { price: 200, name: '📜 Pergamino mágico', key: 'scroll' },
                'talisman': { price: 600, name: '🪬 Talismán protector', key: 'talisman' },
                'gema': { price: 1000, name: '💎 Gema preciosa', key: 'gem' }
            }

            let buyItem = shopItems[item]
            if (!buyItem) {
                return m.reply(`╭─「 ❌ OBJETO NO ENCONTRADO 」─╮
│ ⊱ No tengo ese objeto en mi tienda
│ ⊱ Usa: ${usedPrefix}rpg tienda
╰─────────────────────────╯`)
            }

            if (user.coin < buyItem.price) {
                return m.reply(`╭─「 💸 FONDOS INSUFICIENTES 」─╮
│ ⊱ Necesitas: ${buyItem.price.toLocaleString()} monedas
│ ⊱ Tienes: ${user.coin.toLocaleString()} monedas
│ ⊱ Te faltan: ${(buyItem.price - user.coin).toLocaleString()}
╰─────────────────────────╯`)
            }

            if (!user.inventory) user.inventory = {}
            
            user.coin -= buyItem.price
            user.inventory[buyItem.key] = (user.inventory[buyItem.key] || 0) + 1

            return m.reply(`╭──❮✦ COMPRA EXITOSA ✦❯──╮
│
│ 🛒 Compraste: ${buyItem.name}
│ 💰 Pagaste: ${buyItem.price.toLocaleString()} monedas
│ 💰 Monedas restantes: ${user.coin.toLocaleString()}
│
╰─────────────────────────╯

╭─「 😊 HANAKO DICE 」─╮
│ ⊱ "¡Gracias por tu compra!
│ ⊱ Úsalo sabiamente~ uwu"
╰─────────────────────────╯`)

        case 'trabajar':
        case 'work':
            let cooldownWork = 300000 // 5 minutos
            let timeLeftWork = (user.lastwork || 0) + cooldownWork - Date.now()
            
            if (timeLeftWork > 0) {
                let minutes = Math.floor(timeLeftWork / 60000)
                let seconds = Math.floor((timeLeftWork % 60000) / 1000)
                return m.reply(`╭─「 ⏰ COOLDOWN TRABAJO 」─╮
│ ⊱ Debes esperar ${minutes}m ${seconds}s
│ ⊱ ¡Hanako dice que no te agotes!
╰─────────────────────────╯`)
            }

            if (user.health < 30) {
                return m.reply(`╭─「 💀 SALUD INSUFICIENTE 」─╮
│ ⊱ Necesitas al menos 30 de salud
│ ⊱ para trabajar. ¡Descansa un poco!
╰─────────────────────────╯`)
            }

            let jobs = [
                { name: "🧹 Limpiar los baños", coin: [50, 100], exp: [20, 40], health: 5 },
                { name: "📚 Organizar libros malditos", coin: [80, 150], exp: [30, 50], health: 10 },
                { name: "🕯️ Encender velas rituales", coin: [100, 200], exp: [40, 70], health: 15 },
                { name: "👻 Guiar almas perdidas", coin: [150, 300], exp: [60, 100], health: 20 },
                { name: "🔮 Leer el futuro", coin: [200, 400], exp: [80, 120], health: 25 }
            ]

            let selectedJob = jobs[Math.floor(Math.random() * jobs.length)]
            let coinEarned = Math.floor(Math.random() * (selectedJob.coin[1] - selectedJob.coin[0]) + selectedJob.coin[0])
            let expEarned = Math.floor(Math.random() * (selectedJob.exp[1] - selectedJob.exp[0]) + selectedJob.exp[0])

            user.coin += coinEarned
            user.exp += expEarned
            user.health = Math.max(0, user.health - selectedJob.health)
            user.lastwork = Date.now()

            return m.reply(`╭──❮✦ TRABAJO COMPLETADO ✦❯──╮
│
│ 💼 Trabajo: ${selectedJob.name}
│ 💰 Ganaste: ${coinEarned} monedas
│ ⭐ Experiencia: +${expEarned} exp
│ ❤️ Salud: -${selectedJob.health}
│
╰─────────────────────────╯

╭─「 😌 HANAKO DICE 」─╮
│ ⊱ "Buen trabajo! Aunque me
│ ⊱ hubiera gustado ayudarte~ uwu"
╰─────────────────────────╯`)

        case 'pelear':
        case 'fight':
            let target = m.mentionedJid[0]
            if (!target) {
                return m.reply(`╭─「 ⚔️ DESAFÍO 」─╮
│ ⊱ Menciona a quien quieres desafiar
│ ⊱ Ej: ${usedPrefix}rpg pelear @usuario
╰─────────────────────────╯`)
            }

            if (target === m.sender) {
                return m.reply(`╭─「 🤦 ERROR 」─╮
│ ⊱ No puedes pelear contigo mismo
│ ⊱ ¡Eso sería muy triste!
╰─────────────────────────╯`)
            }

            let targetUser = global.db.data.users[target]
            if (!targetUser || !targetUser.registered) {
                return m.reply(`╭─「 👻 USUARIO FANTASMA 」─╮
│ ⊱ El usuario no está registrado
│ ⊱ en el mundo espiritual
╰─────────────────────────╯`)
            }

            if (user.health < 50) {
                return m.reply(`╭─「 💀 SALUD INSUFICIENTE 」─╮
│ ⊱ Necesitas al menos 50 de salud
│ ⊱ para pelear. ¡Cúrate primero!
╰─────────────────────────╯`)
            }

            if (targetUser.health < 50) {
                return m.reply(`╭─「 😵 OPONENTE DÉBIL 」─╮
│ ⊱ Tu oponente está muy débil
│ ⊱ ¡No sería justo atacarlo ahora!
╰─────────────────────────╯`)
            }

            // Calcular poder de batalla
            let userPower = user.level * 10 + (user.inventory?.sword || 0) * 50 + (user.inventory?.armor || 0) * 30
            let targetPower = targetUser.level * 10 + (targetUser.inventory?.sword || 0) * 50 + (targetUser.inventory?.armor || 0) * 30
            
            let winChance = userPower / (userPower + targetPower)
            let victory = Math.random() < winChance

            let damage = Math.floor(Math.random() * 30) + 20
            let coinsStolen = Math.floor(Math.random() * 200) + 50
            let expGained = Math.floor(Math.random() * 50) + 30

            if (victory) {
                user.health -= Math.floor(damage * 0.5)
                targetUser.health -= damage
                user.coin += Math.min(coinsStolen, targetUser.coin)
                targetUser.coin = Math.max(0, targetUser.coin - coinsStolen)
                user.exp += expGained
                user.wins = (user.wins || 0) + 1
                targetUser.defeats = (targetUser.defeats || 0) + 1

                return m.reply(`╭──❮⚔️ VICTORIA ÉPICA ⚔️❯──╮
│
│ 🏆 Ganador: ${user.name}
│ 💀 Perdedor: ${targetUser.name}
│ 
╰─────────────────────────╯

╔══❮ RESULTADOS ❯══╗
║
║ 💰 Monedas robadas: ${Math.min(coinsStolen, targetUser.coin)}
║ ⭐ Experiencia: +${expGained}
║ ❤️ Tu salud: -${Math.floor(damage * 0.5)}
║ 💔 Salud enemiga: -${damage}
║
╚═════════════════════╝

╭─「 😈 HANAKO RÍE 」─╮
│ ⊱ "¡Jajaja! Eso estuvo
│ ⊱ bastante entretenido~ uwu"
╰─────────────────────────╯`)
            } else {
                user.health -= damage
                targetUser.health -= Math.floor(damage * 0.5)
                user.coin = Math.max(0, user.coin - coinsStolen)
                targetUser.coin += Math.min(coinsStolen, user.coin + coinsStolen)
                targetUser.exp += expGained
                user.defeats = (user.defeats || 0) + 1
                targetUser.wins = (targetUser.wins || 0) + 1

                return m.reply(`╭──❮💀 DERROTA AMARGA 💀❯──╮
│
│ 💔 Perdedor: ${user.name}
│ 🏆 Ganador: ${targetUser.name}
│
╰─────────────────────────╯

╔══❮ RESULTADOS ❯══╗
║
║ 💸 Monedas perdidas: ${Math.min(coinsStolen, user.coin)}
║ ❤️ Tu salud: -${damage}
║ 💚 Salud enemiga: -${Math.floor(damage * 0.5)}
║
╚═════════════════════╝

╭─「 😔 HANAKO CONSUELA 」─╮
│ ⊱ "No te preocupes, ganarás
│ ⊱ la próxima vez~ uwu"
╰─────────────────────────╯`)
            }

        case 'dungeon':
        case 'calabozo':
            let cooldownDungeon = 1800000 // 30 minutos
            let timeLeftDungeon = (user.lastdungeon || 0) + cooldownDungeon - Date.now()
            
            if (timeLeftDungeon > 0) {
                let minutes = Math.floor(timeLeftDungeon / 60000)
                let seconds = Math.floor((timeLeftDungeon % 60000) / 1000)
                return m.reply(`╭─「 ⏰ CALABOZO CERRADO 」─╮
│ ⊱ Debes esperar ${minutes}m ${seconds}s
│ ⊱ Los calabozos necesitan tiempo
│ ⊱ para regenerar sus tesoros
╰─────────────────────────╯`)
            }

            if (user.health < 60) {
                return m.reply(`╭─「 💀 PELIGRO MORTAL 」─╮
│ ⊱ Necesitas al menos 60 de salud
│ ⊱ Los calabozos son muy peligrosos
│ ⊱ ¡Cúrate antes de entrar!
╰─────────────────────────╯`)
            }

            if (user.level < 5) {
                return m.reply(`╭─「 🚫 NIVEL INSUFICIENTE 」─╮
│ ⊱ Necesitas ser nivel 5 mínimo
│ ⊱ Los calabozos no son para novatos
│ ⊱ ¡Entrena más primero!
╰─────────────────────────╯`)
            }

            let dungeons = [
                {
                    name: "🕳️ Cripta Olvidada",
                    difficulty: 5,
                    rewards: { coin: [300, 600], exp: [100, 200], items: ['sword', 'shield', 'potion'] },
                    boss: "💀 Esqueleto Guardián",
                    description: "Un lugar donde duermen los huesos de antiguos guerreros"
                },
                {
                    name: "🌊 Abismo Acuático", 
                    difficulty: 10,
                    rewards: { coin: [500, 900], exp: [150, 300], items: ['crystal', 'talisman', 'gem'] },
                    boss: "🐙 Kraken Espectral",
                    description: "Las profundidades donde habitan los ahogados"
                },
                {
                    name: "🔥 Infierno Carmesí",
                    difficulty: 15,
                    rewards: { coin: [700, 1200], exp: [200, 400], items: ['armor', 'sword', 'scroll'] },
                    boss: "😈 Demonio de las Llamas",
                    description: "El reino ardiente de las almas condenadas"
                },
                {
                    name: "🌌 Vacío Cósmico",
                    difficulty: 20,
                    rewards: { coin: [1000, 2000], exp: [300, 500], items: ['gem', 'crystal', 'talisman'] },
                    boss: "👁️ Ojo del Abismo",
                    description: "Donde la realidad se desvanece en la nada"
                }
            ]

            // Filtrar calabozos disponibles por nivel
            let availableDungeons = dungeons.filter(d => user.level >= d.difficulty)
            if (availableDungeons.length === 0) availableDungeons = [dungeons[0]]

            let selectedDungeon = availableDungeons[Math.floor(Math.random() * availableDungeons.length)]
            
            // Calcular posibilidades de éxito
            let successRate = Math.min(0.8, 0.3 + (user.level - selectedDungeon.difficulty) * 0.05)
            let victory = Math.random() < successRate

            user.lastdungeon = Date.now()

            if (!user.inventory) user.inventory = {}

            if (victory) {
                let coinReward = Math.floor(Math.random() * (selectedDungeon.rewards.coin[1] - selectedDungeon.rewards.coin[0]) + selectedDungeon.rewards.coin[0])
                let expReward = Math.floor(Math.random() * (selectedDungeon.rewards.exp[1] - selectedDungeon.rewards.exp[0]) + selectedDungeon.rewards.exp[0])
                let itemReward = selectedDungeon.rewards.items[Math.floor(Math.random() * selectedDungeon.rewards.items.length)]
                let itemsFound = Math.floor(Math.random() * 3) + 1

                user.coin += coinReward
                user.exp += expReward
                user.inventory[itemReward] = (user.inventory[itemReward] || 0) + itemsFound
                user.health = Math.max(0, user.health - Math.floor(Math.random() * 20) - 10)

                return m.reply(`╭──❮🏆 CALABOZO CONQUISTADO 🏆❯──╮
│
│ 🗡️ Calabozo: ${selectedDungeon.name}
│ 👹 Jefe derrotado: ${selectedDungeon.boss}
│ 📜 ${selectedDungeon.description}
│
╰─────────────────────────╯

╔══❮ TESOROS OBTENIDOS ❯══╗
║
║ 💰 Monedas: +${coinReward.toLocaleString()}
║ ⭐ Experiencia: +${expReward}
║ 🎁 ${itemReward} x${itemsFound}
║ 💔 Salud perdida: -${30 - (user.health + 30 - Math.max(0, user.health))}
║
╚═════════════════════════════╝

╭─「 🎉 HANAKO APLAUDE 」─╮
│ ⊱ "¡Increíble! Eres más fuerte
│ ⊱ de lo que imaginaba~ uwu"
╰─────────────────────────╯`)
            } else {
                let healthLost = Math.floor(Math.random() * 40) + 30
                let coinsLost = Math.floor(user.coin * 0.2)

                user.health = Math.max(0, user.health - healthLost)
                user.coin = Math.max(0, user.coin - coinsLost)

                return m.reply(`╭──❮💀 CALABOZO MALDITO 💀❯──╮
│
│ ⚰️ Calabozo: ${selectedDungeon.name}
│ 👹 Derrotado por: ${selectedDungeon.boss}
│ 🩸 ${selectedDungeon.description}
│
╰─────────────────────────╯

╔══❮ PÉRDIDAS SUFRIDAS ❯══╗
║
║ 💔 Salud perdida: -${healthLost}
║ 💸 Monedas perdidas: -${coinsLost}
║ 😵 Estado: Gravemente herido
║
╚═════════════════════════════╝

╭─「 😰 HANAKO SE PREOCUPA 」─╮
│ ⊱ "¡Oh no! Mejor regresemos
│ ⊱ antes de que sea peor..."
╰─────────────────────────╯`)
            }

        case 'heal':
        case 'curar':
            if (user.health >= 100) {
                return m.reply(`╭─「 💚 SALUD PERFECTA 」─╮
│ ⊱ Tu salud ya está al máximo
│ ⊱ No necesitas curarte ahora
╰─────────────────────────╯`)
            }

            let cooldownHeal = 180000 // 3 minutos
            let timeLeftHeal = (user.lastheal || 0) + cooldownHeal - Date.now()
            
            if (timeLeftHeal > 0) {
                let minutes = Math.floor(timeLeftHeal / 60000)
                let seconds = Math.floor((timeLeftHeal % 60000) / 1000)
                return m.reply(`╭─「 ⏰ COOLDOWN CURACIÓN 」─╮
│ ⊱ Debes esperar ${minutes}m ${seconds}s
│ ⊱ La magia necesita tiempo
╰─────────────────────────╯`)
            }

            let healOptions = [
                { name: "🧪 Usar poción", cost: 0, heal: [30, 50], requires: 'potion' },
                { name: "🌿 Usar hierbas", cost: 0, heal: [20, 40], requires: 'herb' },
                { name: "💰 Comprar curación", cost: 100, heal: [40, 60], requires: null },
                { name: "🙏 Oración gratuita", cost: 0, heal: [10, 25], requires: null }
            ]

            let selectedHeal = null

            // Priorizar usar objetos si los tiene
            if (user.inventory?.potion > 0) {
                selectedHeal = healOptions[0]
            } else if (user.inventory?.herb > 0) {
                selectedHeal = healOptions[1]
            } else if (user.coin >= 100) {
                selectedHeal = healOptions[2]
            } else {
                selectedHeal = healOptions[3]
            }

            let healAmount = Math.floor(Math.random() * (selectedHeal.heal[1] - selectedHeal.heal[0]) + selectedHeal.heal[0])
            let oldHealth = user.health
            user.health = Math.min(100, user.health + healAmount)
            user.lastheal = Date.now()

            if (selectedHeal.requires && user.inventory[selectedHeal.requires]) {
                user.inventory[selectedHeal.requires]--
            }
            if (selectedHeal.cost > 0) {
                user.coin -= selectedHeal.cost
            }

            return m.reply(`╭──❮💚 CURACIÓN EXITOSA 💚❯──╮
│
│ 🩺 Método: ${selectedHeal.name}
│ ❤️ Salud anterior: ${oldHealth}/100
│ 💚 Salud actual: ${user.health}/100
│ ✨ Sanaste: +${healAmount} puntos
│
╰─────────────────────────╯

╭─「 😊 HANAKO SONRÍE 」─╮
│ ⊱ "¡Mucho mejor! Ahora puedes
│ ⊱ continuar con tus aventuras~ uwu"
╰─────────────────────────╯`)

        case 'subir':
        case 'levelup':
            let { min, xp, max } = xpRange(user.level, global.multiplier)
            
            if (user.exp < max) {
                return m.reply(`╭─「 ⭐ EXPERIENCIA INSUFICIENTE 」─╮
│ ⊱ Nivel actual: ${user.level}
│ ⊱ EXP actual: ${user.exp - min}/${max - min}
│ ⊱ EXP necesaria: ${max - user.exp}
╰─────────────────────────╯`)
            }

            let before = user.level
            while (canLevelUp(user.level, user.exp, global.multiplier)) user.level++

            if (before !== user.level) {
                // Recompensas por subir de nivel
                let coinReward = user.level * 50
                let diamondReward = Math.floor(user.level / 5)
                
                user.coin += coinReward
                user.diamond += diamondReward
                user.health = 100 // Restaurar salud al subir

                return m.reply(`╭──❮🌟 ¡NIVEL AUMENTADO! 🌟❯──╮
│
│ 🎊 ¡Felicidades ${user.name}!
│ ⬆️ Nivel anterior: ${before}
│ 🆙 Nivel actual: ${user.level}
│ ❤️ Salud restaurada: 100/100
│
╰─────────────────────────╯

╔══❮ RECOMPENSAS ❯══╗
║
║ 💰 Monedas: +${coinReward}
║ 💎 Diamantes: +${diamondReward}
║ 🎁 Salud completa restaurada
║
╚═════════════════════╝

╭─「 🎉 HANAKO CELEBRA 」─╮
│ ⊱ "¡Wooow! Cada día eres más
│ ⊱ fuerte. Me impresionas~ uwu"
╰─────────────────────────╯`)
            }

        case 'stats':
        case 'estadisticas':
            let totalUsers = Object.keys(global.db.data.users).filter(u => global.db.data.users[u].registered).length
            let totalCoins = Object.values(global.db.data.users).reduce((a, b) => a + (b.coin || 0), 0)
            let avgLevel = Math.floor(Object.values(global.db.data.users).reduce((a, b) => a + (b.level || 0), 0) / totalUsers)
            
            // Top 3 usuarios por nivel
            let topUsers = Object.entries(global.db.data.users)
                .filter(([jid, user]) => user.registered)
                .sort(([,a], [,b]) => b.level - a.level)
                .slice(0, 3)

            let statsText = `╭──❮📊 ESTADÍSTICAS RPG 📊❯──╮
│
│ 👥 Total usuarios: ${totalUsers.toLocaleString()}
│ 💰 Monedas totales: ${totalCoins.toLocaleString()}
│ 📈 Nivel promedio: ${avgLevel}
│
╰─────────────────────────╯

╔══❮ TOP 3 USUARIOS ❯══╗
║`

            topUsers.forEach(([jid, userData], index) => {
                let medals = ['🥇', '🥈', '🥉']
                let name = userData.name || 'Anónimo'
                statsText += `\n║ ${medals[index]} ${name} - Nv.${userData.level}`
            })

            statsText += `║
╚═════════════════════════╝

╭──❮ TU POSICIÓN ❯──╮
│ 📊 Nivel: ${user.level}
│ 🏆 Victorias: ${user.wins || 0}
│ ⚰️ Derrotas: ${user.defeats || 0}
│ 💰 Monedas: ${user.coin.toLocaleString()}
│ 💎 Diamantes: ${user.diamond}
╰─────────────────────────╯

╭─「 📈 HANAKO ANALIZA 」─╮
│ ⊱ "Interesantes números...
│ ⊱ ¿Puedes llegar al top? uwu"
╰─────────────────────────╯`

            return m.reply(statsText)

        default:
            return m.reply(`╭─「 ❌ COMANDO DESCONOCIDO 」─╮
│ ⊱ Usa: ${usedPrefix}rpg menu
│ ⊱ Para ver todos los comandos
╰─────────────────────────╯`)
    }
}

handler.help = ['rpg']
handler.tags = ['rpg']
handler.command = ['rpg', 'rol', 'roleplay']
handler.register = true

export default handler
