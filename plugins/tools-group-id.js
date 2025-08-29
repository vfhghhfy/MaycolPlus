/* Plugin
Toplayroblox
Autor: Ado 🦖
*/
import axios from 'axios';

let handler = async (m, { conn }) => {
    try {
        m.react("🕒");

        const api1 = new URL('https://apis.roblox.com/explore-api/v1/get-sort-content');
        api1.search = new URLSearchParams({
            sessionId: '17996246-1290-440d-b789-d49484115b9a',
            sortId: 'top-playing-now',
            cpuCores: '8',
            maxResolution: '1920x1080',
            maxMemory: '8192',
            networkType: '4g'
        }).toString();

        const { data: json1 } = await axios.get(api1.toString());
        const listaJuegos = json1?.games?.slice(0, 10);
        if (!listaJuegos?.length) throw new Error('La lista de juegos está vacía');

        const payload = listaJuegos.map(v => ({
            type: 'GameIcon',
            targetId: v.universeId,
            format: 'png',
            size: '256x256'
        }));

        const { data: json2 } = await axios.post('https://thumbnails.roblox.com/v1/batch', payload);
        const listaThumbnails = json2.data;
        const listaCombinada = listaJuegos.map((v, i) => ({ ...v, ...listaThumbnails[i] }));

        // Preparar álbum usando URLs directas
        const medias = listaCombinada.map((v, i) => ({
            type: 'image',
            data: { url: v.imageUrl }, // URL directa, nada de buffers
            caption: `${i + 1} | ${v.name}\n👥 Jugadores: ${v.playerCount.toLocaleString('es-ES')}\n👍 Likes: ${(
                (v.totalUpVotes / (v.totalUpVotes + v.totalDownVotes)) * 100
            ).toFixed()}%\n🎮 Jugar ahora: https://www.roblox.com/games/${v.rootPlaceId}`
        }));

        await conn.sendSylphy(m.chat, medias, { caption: '◜ Roblox Top Playing ◞', quoted: m });
        m.react("✅");

    } catch (e) {
        m.reply(`❌ Ocurrió un error: ${e.message}`);
    }
};

handler.help = ['topplayroblox'];
handler.tags = ['tools'];
handler.command = ['topplayroblox', 'topplayrbx'];

export default handler;