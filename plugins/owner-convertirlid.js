const handler = async (m, { conn, text, usedPrefix, command }) => {
    const lid = text?.trim();
    if (!lid || !/^\d+$/.test(lid)) {
        return m.reply(`📌 Usa: ${usedPrefix + command} 11747138220075`);
    }

    m.reply('🔍 Intentando resolver LID... Esto puede tomar unos segundos...');

    try {
        // Método 1: Intentar con diferentes formatos de LID
        const lidFormats = [
            `${lid}@lid`,
            `${lid}@s.whatsapp.net`,
            `${lid}@c.us`,
            lid,
            `+${lid}`,
            `${lid}@whatsapp.net`
        ];

        let result = null;
        let foundFormat = null;

        // Probar cada formato
        for (const format of lidFormats) {
            try {
                console.log(`Probando formato: ${format}`);
                
                // Método principal
                let data = await conn.onWhatsApp(format);
                if (data?.[0]?.jid && data[0].jid !== format) {
                    result = data[0];
                    foundFormat = format;
                    break;
                }

                // Método alternativo 1: Usar getBio si está disponible
                if (conn.getBio) {
                    try {
                        await conn.getBio(format);
                        result = { jid: format, exists: true };
                        foundFormat = format;
                        break;
                    } catch (e) {
                        // No existe o no se puede acceder
                    }
                }

                // Método alternativo 2: Usar getStatus si está disponible  
                if (conn.getStatus) {
                    try {
                        await conn.getStatus(format);
                        result = { jid: format, exists: true };
                        foundFormat = format;
                        break;
                    } catch (e) {
                        // No existe o no se puede acceder
                    }
                }

            } catch (error) {
                console.log(`Error con formato ${format}:`, error);
                continue;
            }
        }

        // Método 2: Intentar buscar en contactos existentes
        if (!result && conn.contacts) {
            try {
                const contacts = Object.values(conn.contacts);
                const found = contacts.find(contact => 
                    contact.id?.includes(lid) || 
                    contact.jid?.includes(lid) ||
                    contact.name?.includes(lid)
                );
                
                if (found) {
                    result = found;
                    foundFormat = "contactos";
                }
            } catch (e) {
                console.log('Error buscando en contactos:', e);
            }
        }

        // Método 3: Intentar con variaciones del número
        if (!result) {
            const variations = [
                lid.slice(0, -1), // Quitar último dígito
                lid.slice(1),     // Quitar primer dígito  
                '1' + lid,        // Agregar 1 al inicio
                '521' + lid,      // Código de México
                '54' + lid,       // Código de Argentina
                '55' + lid,       // Código de Brasil
                '57' + lid,       // Código de Colombia
                '51' + lid,       // Código de Perú
            ];

            for (const variation of variations) {
                try {
                    const testJid = `${variation}@s.whatsapp.net`;
                    let data = await conn.onWhatsApp(testJid);
                    if (data?.[0]?.jid) {
                        result = data[0];
                        foundFormat = `variación: ${variation}`;
                        break;
                    }
                } catch (e) {
                    continue;
                }
            }
        }

        // Método 4: Fuerza bruta con prefijos comunes
        if (!result) {
            const commonPrefixes = ['1', '52', '54', '55', '56', '57', '58', '51', '34', '44', '49', '33'];
            
            for (const prefix of commonPrefixes) {
                for (let i = 0; i < 3; i++) {
                    try {
                        const testNumber = prefix + lid.slice(i);
                        const testJid = `${testNumber}@s.whatsapp.net`;
                        
                        let data = await conn.onWhatsApp(testJid);
                        if (data?.[0]?.jid) {
                            result = data[0];
                            foundFormat = `fuerza bruta: +${prefix}`;
                            break;
                        }
                    } catch (e) {
                        continue;
                    }
                }
                if (result) break;
            }
        }

        // Método 5: Intentar como grupo
        if (!result) {
            try {
                const groupJid = `${lid}@g.us`;
                const groupData = await conn.groupMetadata(groupJid);
                if (groupData) {
                    return m.reply(`╭─❍「 ✦ RESULTADO ✦ 」
│
├─ 🔐 LID: ${lid}
├─ 📱 Tipo: Grupo de WhatsApp
├─ 👥 Nombre: ${groupData.subject || 'Desconocido'}
├─ 👤 Participantes: ${groupData.participants?.length || 0}
╰─✦`);
                }
            } catch (e) {
                console.log('No es un grupo:', e);
            }
        }

        if (result && result.jid) {
            const realNumber = result.jid.replace(/@.+/, '');
            const cleanNumber = realNumber.replace(/[^\d]/g, '');
            
            return m.reply(`╭─❍「 ✦ RESULTADO ✦ 」
│
├─ 🔐 LID Original: ${lid}
├─ ✅ Número Real: ${cleanNumber}
├─ 📱 JID Completo: ${result.jid}
├─ 🔄 Método usado: ${foundFormat}
├─ ✨ Estado: ${result.exists !== false ? 'Activo' : 'Inactivo'}
╰─✦`);
        } else {
            // Último intento: mostrar información de debug
            return m.reply(`╭─❍「 ❌ NO RESUELTO ❌ 」
│
├─ 🔐 LID: ${lid}
├─ ❌ No se pudo resolver con ningún método
├─ 🔍 Formatos probados: ${lidFormats.length}
├─ 💡 Sugerencia: Verifica que el LID sea válido
├─ 📝 Nota: Algunos LIDs no se pueden resolver públicamente
╰─✦

💡 **Posibles causas:**
• El LID no corresponde a un número activo
• El número está configurado como privado  
• El LID es de una versión antigua de WhatsApp
• Restricciones de la API de WhatsApp`);
        }

    } catch (error) {
        console.error('Error general:', error);
        return m.reply(`╭─❍「 ❌ ERROR ❌ 」
│
├─ 🔐 LID: ${lid}
├─ ❌ Error: ${error.message}
├─ 🔧 Código: ${error.code || 'Desconocido'}
╰─✦

🛠️ **Información técnica:**
Error completo: ${error.toString()}`);
    }
};

handler.command = ['resolverlid', 'lid', 'resolvernum'];
handler.help = ['resolverlid <lid>', 'lid <lid>'];  
handler.tags = ['tools'];
handler.premium = false;
handler.group = false;
handler.private = false;

export default handler;
