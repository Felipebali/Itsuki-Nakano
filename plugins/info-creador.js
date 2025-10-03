let handler = async (m, { conn }) => {
  try {
    await conn.sendMessage(m.chat, {
      text: '👑 *CREADOR - 𝗟𝗲𝗼  𝘅𝘇𝘅𝘀𝘆 ⚡*\n\𝗦𝗲𝗹𝗲𝗰𝗶𝗼𝗻𝗮 𝗨𝗻 𝗠𝗲𝘁𝗼𝗱𝗼:',
      buttons: [
        { buttonId: '!instagram', buttonText: { displayText: '📸 𝐈𝐍𝐒𝐓𝐀𝐆𝐑𝐀𝐌' }, type: 1 },
        { buttonId: '!tiktok', buttonText: { displayText: ' 💎 𝐓𝐈𝐊𝐓𝐎𝐊' }, type: 1 },
        { buttonId: '!grupo', buttonText: { displayText: '📢 𝐂𝐀𝐍𝐀𝐋 𝐎𝐅𝐈𝐂𝐈𝐀𝐋' }, type: 1 },
        { buttonId: '!contacto', buttonText: { displayText: '👑 𝐂𝐑𝐄𝐀𝐃𝐎𝐑' }, type: 1 }
      ]
    }, { quoted: m })

  } catch (error) {
    console.error('Error:', error)
    // Versión de respaldo simple
    const message = `
👑 *CREADOR - 𝗟𝗲𝗼  𝘅𝘇𝘅𝘀𝘆 ⚡*

📸 𝑰𝑵𝑨𝑻𝑨𝑮𝑹𝑨𝑴: instagram.com/xzzys26
💎 𝑻𝑰𝑲𝑻𝑶𝑲: tiktok.com/@xzzys16  
📢 𝑪𝑨𝑵𝑨𝑳: https://whatsapp.com/channel/0029VbBBn9R4NViep4KwCT3Z
👑 𝑪𝑹𝑬𝑨𝑫𝑶𝑹: wa.me/18493907272
    `.trim()
    await conn.sendMessage(m.chat, { text: message }, { quoted: m })
  }
}

// Handlers para los botones
handler.before = async (m) => {
  if (m.isBaileys || !m.message?.buttonsResponseMessage) return
  
  const selectedButton = m.message.buttonsResponseMessage.selectedDisplayText
  const sender = m.sender
  
  switch(selectedButton) {
    case '📸 𝙄𝙉𝙎𝙏𝘼𝙂𝙍𝘼𝙈':
      await m.reply('📸 *Instagram:* https://www.instagram.com/xzzys26')
      break
    case '💎 𝙏𝙄𝙆𝙏𝙊𝙆':
      await m.reply('💎 *TikTok:* https://www.tiktok.com/@xzzys16')
      break
    case '📢 𝘾𝘼𝙉𝘼𝙇 𝙊𝙁𝙄𝘾𝙄𝘼𝙇':
      await m.reply('💬 *Grupo WhatsApp:* https://whatsapp.com/channel/0029VbBBn9R4NViep4KwCT3Z')
      break
    case '👑 𝘾𝙍𝙀𝘼𝘿𝙊𝙍':
      await m.reply('📲 *Contacto Directo:* https://wa.me/18493907272')
      break
  }
}

handler.help = ['owner', 'creador']
handler.tags = ['info']
handler.command = ['owner', 'creador', 'contacto']

export default handler