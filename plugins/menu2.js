import fetch from 'node-fetch'

const botname = global.botname || '🌸 𝐈𝐓𝗦𝗨𝗞𝗜 𝐍𝐀𝐊𝗔𝗡𝗢-𝐀𝗜 🌸'
const creador = '𝗟𝗲𝗼  𝘅𝘇𝘅𝘀𝘆 ⚡'
const version = '3.4.0 𝗕𝗲𝘁𝗮 𝗩𝗲𝗿𝘀𝗶𝗼𝗻'
const web = 'https://xzys-ultra.vercel.app'

let tags = {
  'serbot': '❤️‍🩹 𝗦𝗨𝗕-𝗕𝗢𝗧𝗦',
  'info': '🌸 𝗜𝗡𝗙𝗢𝗦',
  'main': '💋 𝗠𝗘𝗡𝗨',
  'nable': '🔮 𝗠𝗢𝗗𝗢 𝗔𝗩𝗔𝗡𝗭𝗔𝗗𝗢',
  'cmd': '📝 𝗖𝗢𝗠𝗔𝗡𝗗𝗢𝗦',
  'advanced': '🌟 𝗙𝗨𝗡𝗖𝗜𝗢𝗡𝗘𝗦',
  'game': '🎮 𝗝𝗨𝗘𝗚𝗢𝗦',
  'economy': '✨ 𝗘𝗖𝗢𝗡𝗢𝗠𝗜𝗔',
  'gacha': '🧧 𝗚𝗔𝗖𝗛𝗔',
  'rpg': '⚔️ 𝗥𝗣𝗚',
  'group': '📚 𝗚𝗥𝗨𝗣𝗢𝗦',
  'downloader': '👒 𝗗𝗘𝗦𝗖𝗔𝗥𝗚𝗔𝗦',
  'sticker': '🍧 𝗦𝗧𝗜𝗖𝗞𝗘𝗥',
  'audio': '🫧 𝗔𝗨𝗗𝗜𝗢',
  'search': '🔎 𝗕𝗨𝗦𝗤𝗨𝗘𝗗𝗔',
  'tools': '🧰 𝗛𝗘𝗥𝗔𝗠𝗜𝗘𝗡𝗧𝗔𝗦',
  'fun': '💃 𝗗𝗜𝗩𝗘𝗥𝗦𝗜𝗢𝗡',
  'ia': '🤖 𝗜𝗔',
  'anime': '🪭 𝗔𝗡𝗜𝗠𝗘',
  'premium': '💎 𝗣𝗥𝗘𝗠𝗜𝗨𝗠',
  'social': '📸 𝗥𝗘𝗗𝗘𝗦',
  'custom': '📕 𝗣𝗘𝗥𝗦𝗢𝗡𝗔𝗟'
}

let handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    if (!global.db) global.db = {}
    if (!global.db.data) global.db.data = {}
    if (!global.db.data.users) global.db.data.users = {}

    let userId = m.mentionedJid?.[0] || m.sender
    let user = global.db.data.users[userId] || { exp: 0, level: 1, premium: false }

    let totalPremium = Object.values(global.db.data.users).filter(u => u.premium).length

    let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => ({
      help: Array.isArray(plugin.help) ? plugin.help : (plugin.help ? [plugin.help] : []),
      tags: Array.isArray(plugin.tags) ? plugin.tags : (plugin.tags ? [plugin.tags] : []),
      limit: plugin.limit,
      premium: plugin.premium,
    }))

    let uptime = clockString(process.uptime() * 1000)

    const botJid = conn.user.jid
    const officialBotNumber = '50671854223@s.whatsapp.net'
    const isOfficialBot = botJid === officialBotNumber
    const botType = isOfficialBot ? '🎀 Bot Oficial' : '🌱 Sub-Bot'

    // Generar texto de introducción
    let intro = `╭━━━〔 🌸 *ITSUKI NAKANO-AI MENU* 🌸 〕━━━⬣
┃ 👋🏻 *Hola* @${userId.split('@')[0]}
┃ 👑 *Creador*: *${creador}*
┃ ${botType}
┃ ⏳ *Uptime*: ${uptime}
┃ 💎 *Premium*: ${totalPremium}
┃ 🪷 *Versión*: ${version}
┃ 💻 *Web Oficial*: ${web}
╰━━━━━━━━━━━━━━━━━━━━━━⬣`

    // Crear botones de categorías
    let buttons = Object.keys(tags).map(tag => ({
      buttonId: `.menu ${tag}`,
      buttonText: { displayText: tags[tag] },
      type: 1
    })).slice(0, 10) // máximo 10 botones por mensaje

    let vidBuffer = await (await fetch('https://files.catbox.moe/rcum9p.mp4')).buffer()
    
    await conn.sendMessage(m.chat, {
      video: vidBuffer,
      gifPlayback: true,
      caption: intro,
      buttons: buttons,
      headerType: 5, // 5 para video con botones
      contextInfo: { mentionedJid: [userId] }
    }, { quoted: m })

  } catch (e) {
    await conn.sendMessage(m.chat, { text: `❌ Error en el menú:\n${e}` }, { quoted: m })
  }
}

handler.help = ['menu2']
handler.tags = ['main2']
handler.command = ['menu2']
export default handler

function clockString(ms) {
  let d = Math.floor(ms / 86400000) 
  let h = Math.floor(ms / 3600000) % 24
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  let texto = []
  if (d > 0) texto.push(`${d} ${d == 1 ? 'día' : 'días'}`)
  if (h > 0) texto.push(`${h} ${h == 1 ? 'hora' : 'horas'}`)
  if (m > 0) texto.push(`${m} ${m == 1 ? 'minuto' : 'minutos'}`)
  if (s > 0) texto.push(`${s} ${s == 1 ? 'segundo' : 'segundos'}`)
  return texto.length ? texto.join(', ') : '0 segundos'
}
