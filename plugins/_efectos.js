import { unlinkSync, readFileSync } from 'fs';
import { join } from 'path';
import { exec } from 'child_process';

let handler = async (m, { conn, __dirname, usedPrefix, command }) => {
    try {
        let q = m.quoted || m;
        let mime = (m.quoted ? m.quoted : m.msg).mimetype || '';
        let efecto;

        const efectos = {
            bass: '-af equalizer=f=94:width_type=o:width=2:g=30',
            blown: '-af acrusher=.1:1:64:0:log',
            deep: '-af atempo=4/4,asetrate=44500*2/3',
            earrape: '-af volume=12',
            fast: '-filter:a "atempo=1.63,asetrate=44100"',
            fat: '-filter:a "atempo=1.6,asetrate=22100"',
            nightcore: '-filter:a atempo=1.06,asetrate=44100*1.25',
            reverse: '-filter_complex "areverse"',
            robot: '-filter_complex "afftfilt=real=\'hypot(re,im)*sin(0)\':imag=\'hypot(re,im)*cos(0)\':win_size=512:overlap=0.75"',
            slow: '-filter:a "atempo=0.7,asetrate=44100"',
            smooth: '-filter:v "minterpolate=\'mi_mode=mci:mc_mode=aobmc:vsbmc=1:fps=120\'"',
            tupai: '-filter:a "atempo=0.5,asetrate=65100"',
            reverb: '-filter:a "aecho=0.8:0.9:1000:0.3"',
            chorus: '-filter:a "chorus=0.7:0.9:55:0.4:0.25:2"',
            flanger: '-filter:a "flanger=delay=20:depth=0.2"',
            distortion: '-filter:a "aecho=0.8:0.9:1000:0.3,firequalizer=gain_entry=\'entry(0,15);entry(250,0);entry(4000,15)\'"',
            pitch: '-filter:a "asetrate=44100*1.25,atempo=1.25"',
            highpass: '-filter:a "highpass=f=500"',
            lowpass: '-filter:a "lowpass=f=500"',
            underwater: '-af "asetrate=44100*0.5,atempo=2,lowpass=f=300"',
            echo: '-map 0 -c:v "copy" -af "aecho=0.6:0.3:1000:0.5"',
            tremolo: '-filter:a "tremolo=0.5:1000"',
            pitchshift: '-filter:a "asetrate=44100*0.8,atempo=0.8"',
            echo2: '-af "aecho=0.9:0.9:1000:0.5"',
            chipmunk: '-filter:a "asetrate=44100*1.5,atempo=1.5"',
            echo3: '-af "aecho=0.9:0.8:1000:0.5"',
            pitchshift2: '-filter:a "asetrate=44100*0.75,atempo=0.75"',
        };

        
        if (command.toLowerCase().includes('listeffect')) {
            let mensaje = '*Lista de efectos de audio disponibles*\n\n';
            for (let ef in efectos) {
                mensaje += `*${ef}* > Uso: ${usedPrefix}${ef} [audio o nota de voz]\n`;
            }
            m.reply(mensaje);
            return;
        }

        efecto = efectos[command.toLowerCase()];

        if (!/audio/.test(mime)) {
            m.reply(`*Nota* > Responde con un audio o nota de voz para aplicar el efecto usando: ${usedPrefix + command}`);
            return;
        }

        let nombreArchivo = generarNombreRandom('.mp3');
        let rutaArchivo = join(__dirname, '../tmp/' + nombreArchivo);
        let media = await q.download(true);

        exec(`ffmpeg -i ${media} ${efecto} ${rutaArchivo}`, async (err, stdout, stderr) => {
            unlinkSync(media);
            if (err) {
                m.reply(`*Error* > No se pudo procesar el audio.`);
                console.error(stderr);
                return;
            }
            let buffer = readFileSync(rutaArchivo);
            conn.sendFile(m.chat, buffer, nombreArchivo, null, m, true, { type: 'audioMessage', ptt: true });
            unlinkSync(rutaArchivo);
        });

    } catch (e) {
        console.error(e);
        m.reply('*Error* > Ha ocurrido un error inesperado.');
    }
};

handler.help = ['bass','blown','deep','earrape','fast','fat','nightcore','reverse','robot','slow','smooth','tupai','reverb','chorus','flanger','distortion','pitch','highpass','lowpass','underwater','echo','tremolo','pitchshift','echo2','chipmunk','echo3','pitchshift2','listeffectaudio'];
handler.tags = ['efectos'];
handler.command = /^(bass|blown|deep|earrape|fast|fat|nightcore|reverse|robot|slow|smooth|tupai|reverb|chorus|flanger|distortion|pitch|highpass|lowpass|underwater|echo|tremolo|pitchshift|echo2|chipmunk|echo3|pitchshift2|listeffectaudio|listeffectvn|listefekvn|listefekaudio)$/i;

export default handler;

const generarNombreRandom = (ext) => `${Math.floor(Math.random() * 10000)}${ext}`;