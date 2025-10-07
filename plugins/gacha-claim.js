import { promises as fs } from 'fs';

const charactersFilePath = './src/database/characters[1].json'
const haremFilePath = './src/database/harem.json'

const cooldowns = {};

async function loadCharacters() {
    try {
        const data = await fs.readFile(charactersFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        throw new Error('🧧 No se pudo cargar el archivo characters.json.');
    }
}

async function saveCharacters(characters) {
    try {
        await fs.writeFile(charactersFilePath, JSON.stringify(characters, null, 2), 'utf-8');
    } catch (error) {
        throw new Error('🧧 No se pudo guardar el archivo characters.json.');
    }
}

let handler = async (m, { conn }) => {
    const userId = m.sender;
    const now = Date.now();

    if (cooldowns[userId] && now < cooldowns[userId]) {
        const remainingTime = Math.ceil((cooldowns[userId] - now) / 1000);
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        const errorMsg = await conn.reply(m.chat, `《🌟》Debes esperar *${minutes} minutos y ${seconds} segundos* para usar *#c* de nuevo.`, m);
        // Reacción de error por tiempo de espera
        await conn.sendMessage(m.chat, {
            react: {
                text: '❎️',
                key: errorMsg.key
            }
        });
        return;
    }

    if (m.quoted && m.quoted.sender === conn.user.jid) {
        try {
            const characters = await loadCharacters();
            const characterIdMatch = m.quoted.text.match(/🆔️ ID: \*(.+?)\*/);

            if (!characterIdMatch) {
                const errorMsg = await conn.reply(m.chat, '《🌟》No se pudo encontrar el ID del personaje en el mensaje citado.', m);
                // Reacción de error
                await conn.sendMessage(m.chat, {
                    react: {
                        text: '❎️',
                        key: errorMsg.key
                    }
                });
                return;
            }

            const characterId = characterIdMatch[1];
            const character = characters.find(c => c.id === characterId);

            if (!character) {
                const errorMsg = await conn.reply(m.chat, '《🌟》El mensaje citado no es un personaje válido.', m);
                // Reacción de error
                await conn.sendMessage(m.chat, {
                    react: {
                        text: '❎️',
                        key: errorMsg.key
                    }
                });
                return;
            }

            if (character.user && character.user !== userId) {
                const errorMsg = await conn.reply(m.chat, `《🌟》El personaje ya ha sido reclamado por @${character.user.split('@')[0]}, inténtalo a la próxima :v.`, m, { mentions: [character.user] });
                // Reacción de error - ya reclamado
                await conn.sendMessage(m.chat, {
                    react: {
                        text: '❎️',
                        key: errorMsg.key
                    }
                });
                return;
            }

            character.user = userId;
            character.status = "Reclamado";

            await saveCharacters(characters);

            const successMsg = await conn.reply(m.chat, `✅️ Has reclamado a *${character.name}* con éxito.`, m);
            // Reacción de éxito
            await conn.sendMessage(m.chat, {
                react: {
                    text: '✅️',
                    key: successMsg.key
                }
            });
            
            // Cooldown reducido de 30 minutos a 5 minutos
            cooldowns[userId] = now + 5 * 60 * 1000;

        } catch (error) {
            const errorMsg = await conn.reply(m.chat, `✘ Error al reclamar el personaje: ${error.message}`, m);
            // Reacción de error por excepción
            await conn.sendMessage(m.chat, {
                react: {
                    text: '❎️',
                    key: errorMsg.key
                }
            });
        }

    } else {
        const errorMsg = await conn.reply(m.chat, '《🌟》Debes citar un personaje válido para reclamar.', m);
        // Reacción de error - no citó mensaje
        await conn.sendMessage(m.chat, {
            react: {
                text: '❎️',
                key: errorMsg.key
            }
        });
    }
};

handler.help = ['claim'];
handler.tags = ['gacha'];
handler.command = ['c', 'claim', 'reclamar'];
handler.group = true;

export default handler;