// Codigo de SoyMaycol y no quites creditos  
import fetch from "node-fetch";

const fontHandler = async (m, { conn, text, command }) => {
    if (!text) {
        return m.reply(`╭─❍「 ✦ MaycolPlus ✦ 」
│
├─ Amor~ necesito que me des el link o nombre de la fuente  
├─ Ejemplo:  
│   ⇝ .font https://www.dafont.com/es/super-malibu.font  
│   ⇝ .font super-malibu  
│
├─ Y yo me encargo de todo ♡
╰─✦`);
    }

    try {
        await m.react("🖋️");

        // Normalizamos: si viene un link lo pasamos directo
        let fontUrl = text.startsWith("http") ? text : `https://www.dafont.com/es/${text}.font`;

        const apiUrl = `https://mayapi.giize.com/font?url=${encodeURIComponent(fontUrl)}&apikey=may-2b02ac57e684a1c5ba9281d8dabf019c`;
        const res = await fetch(apiUrl);
        const data = await res.json();

        if (!data || !data.status || !data.url) {
            throw new Error("No encontré esa font bebé~");
        }

        const fontName = data.font || "font";
        const downloadUrl = data.url;

        const waitMsg = `╭─❍「 ✦ MaycolPlus ✦ 」
│
├─ Mmm~ encontré tu fuente:  
│   「❀」${fontName}  
│
├─ Déjame descargarla para ti ♡
╰─✦`;

        await conn.sendMessage(m.chat, { text: waitMsg }, { quoted: m });

        // Descargar el archivo (sigue redirecciones)
        const response = await fetch(downloadUrl);
        if (!response.ok) throw new Error("No pude descargar el archivo bebé");

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const fileExt = downloadUrl.includes(".zip") ? "zip" : "ttf";
        const fileName = `${fontName}.${fileExt}`;

        await conn.sendMessage(m.chat, {
            document: buffer,
            fileName,
            mimetype: "application/zip"
        }, { quoted: m });

        await m.react("✅");

    } catch (error) {
        console.error("Error descargando font:", error);
        await m.reply(`╭─❍「 ✦ MaycolPlus ✦ 」
│
├─ Ay amor... algo falló  
├─ ${error.message}  
├─ Intenta otra vez conmigo ♡
╰─✦`);
        await m.react("💔");
    }
};

fontHandler.command = ["font", "fuente", "dafont"];
fontHandler.tags = ["descargas"];
fontHandler.help = ["font <nombre|url>"];
fontHandler.register = true;

export default fontHandler;
