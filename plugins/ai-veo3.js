import axios from 'axios';

const delay = (ms) => new Promise(res => setTimeout(res, ms));

async function aimusic(prompt, { tags = 'pop, romantic, cumbia, reggaeton' } = {}) {
    try {
        if (!prompt) throw new Error('Prompt is required');
        
        const { data: lyricApiRes } = await axios.get('https://8pe3nv3qha.execute-api.us-east-1.amazonaws.com/default/llm_chat', {
            params: {
                query: JSON.stringify([
                    {
                        role: 'system',
                        content: 'Eres una IA letrista profesional entrenada para escribir letras de canciones poéticas y rítmicas en español. Responde únicamente con letras, usando las etiquetas [verse], [chorus], [bridge] e [instrumental] para estructurar la canción. Usa solo la etiqueta (por ejemplo, [verse]) sin números ni texto adicional. No agregues explicaciones ni comentarios. Responde en texto limpio, exactamente como si fuera una hoja de letras de canción.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ]),
                link: 'writecream.com'
            },
            headers: {
                'User-Agent': 'Mozilla/5.0',
                'Referer': 'https://writecream.com/'
            }
        });

        const generatedLyrics = lyricApiRes.response_content;
        if (!generatedLyrics) throw new Error('Error al generar letras de la canción');

        const session_hash = Math.random().toString(36).substring(2);
        await axios.post(`https://ace-step-ace-step.hf.space/gradio_api/queue/join?`, {
            data: [
                240,
                tags,
                generatedLyrics,
                60, 15, 'euler', 'apg', 10, '', 
                0.5, 0, 3, true, false, true, '', 0, 0, 
                false, 0.5, null, 'none'
            ],
            event_data: null,
            fn_index: 11,
            trigger_id: 45,
            session_hash
        });

        let resultMusicUrl;
        let pollingAttempts = 0;
        const maxPollingAttempts = 120;
        const pollingInterval = 1000;

        while (!resultMusicUrl && pollingAttempts < maxPollingAttempts) {
            const { data } = await axios.get(`https://ace-step-ace-step.hf.space/gradio_api/queue/data?session_hash=${session_hash}`);
            const lines = data.split('\n\n');
            for (const line of lines) {
                if (line.startsWith('data:')) {
                    const d = JSON.parse(line.substring(6));
                    if (d.msg === 'process_completed' && d.output?.data?.[0]?.url) {
                        resultMusicUrl = d.output.data[0].url;
                        break;
                    } else if (d.msg === 'queue_full' || d.msg === 'process_failed') {
                        throw new Error(`Error en HF Space: ${d.msg}`);
                    }
                }
            }
            if (!resultMusicUrl) {
                pollingAttempts++;
                await delay(pollingInterval);
            }
        }

        if (!resultMusicUrl) throw new Error('Timeout: No se generó música AI.');
        return resultMusicUrl;

    } catch (error) {
        console.error('Error en aimusic generator:', error.message);
        throw new Error(`Fallo al crear música AI: ${error.message}`);
    }
}

const handler = async (m, { conn, text, usedPrefix, command }) => {
    const fkontak = {
        key: { participants: "0@s.whatsapp.net", remoteJid: "status@broadcast", fromMe: false, id: "Halo" },
        message: { contactMessage: { vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` } },
        participant: "0@s.whatsapp.net"
    };

    if (!text) {
        return conn.reply(m.chat, 
            `🎶 ¿Quieres que te genere un rolón con AI?  
            
Formato: *${usedPrefix + command}* <prompt>|[géneros]  

📌 Ejemplos:  
*${usedPrefix + command}* una rola triste de desamor|reggaeton  
*${usedPrefix + command}* una canción alegre de fiesta|cumbia, salsa  
*${usedPrefix + command}* una canción oscura|trap, corridos tumbados  

Si no pones género, por default usa: pop, romantic`, fkontak);
    }

    const args = text.split('|').map(s => s.trim());
    const prompt = args[0];
    const tags = args[1] || 'pop, romantic';

    if (!prompt) {
        return conn.reply(m.chat, '❌ El prompt no puede ir vacío', fkontak);
    }

    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });
    try {
        const musicUrl = await aimusic(prompt, { tags });
        await conn.sendMessage(m.chat, {
            audio: { url: musicUrl },
            mimetype: 'audio/mpeg',
            fileName: `aimusic_${Date.now()}.mp3`,
            caption: `🎶 *Música AI generada* 🎶\n\n*Prompt:* ${prompt}\n*Géneros:* ${tags}\n\n_Servicio: HuggingFace Space_`
        }, { quoted: fkontak });
        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
    } catch (e) {
        console.error('Error en plugin AI Music:', e);
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        conn.reply(m.chat, `❌ Error al generar música AI: ${e.message}`, fkontak);
    }
};

handler.help = ['aimusic'];
handler.tags = ['ia'];
handler.command = ['aimusic'];

export default handler;