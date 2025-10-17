// * * * Creador del código: BrayanOFC
// * * * Adaptación: Itsuki Nakano AI
// * * * Base: Sunaookami Shiroko (S.D.D) Ltc.

let handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    let help = Object.values(global.plugins)
      .filter(plugin => !plugin.disabled)
      .map(plugin => ({
        help: Array.isArray(plugin.help) ? plugin.help : plugin.help ? [plugin.help] : [],
        tags: Array.isArray(plugin.tags) ? plugin.tags : plugin.tags ? [plugin.tags] : [],
      }))

    // 🌸 Decoración intacta
    let menuText = `> Ꮺׄ ㅤდㅤ   *ꪱׁׁׁׅׅׅtׁׅׅ꯱υׁׅƙׁׅꪱׁׁׁׅׅׅ* ㅤ 𖹭𑩙
> ୨ㅤ   ֵ      *݊ꪀɑׁׅƙׁׅɑׁׅ݊ꪀᨵׁׅׅ* ㅤ ׄㅤ  ✰

`

    let categories = {
      '*PRINCIPAL*': ['main', 'info'],
      '*ASISTENTES*': ['bots', 'ia'],
      '*JUEGOS*': ['game', 'gacha'],
      '*ECONOMÍA*': ['economy', 'rpgnk'],
      '*GRUPOS*': ['group'],
      '*DESCARGAS*': ['downloader'],
      '*MULTIMEDIA*': ['sticker', 'audio', 'anime'],
      '*HERRAMIENTAS*': ['tools', 'search', 'advanced'],
      '*EXTRAS*': ['fun', 'premium', 'social', 'custom']
    }

    for (let catName in categories) {
      let catTags = categories[catName]
      let comandos = help.filter(menu => menu.tags.some(tag => catTags.includes(tag)))

      if (comandos.length) {
        menuText += `꒰⌢ ʚ˚₊‧  ❍  ꒱꒱ :: ${catName} ıllı\n`
        let uniqueCommands = [...new Set(comandos.flatMap(menu => menu.help))]
        uniqueCommands.forEach(cmd => {
          menuText += `> ੭੭ ﹙ ᰔᩚ ᪶ ﹚:: \`\`\`${_p}${cmd}\`\`\`\n`
        })
        menuText += `> 。°。°。°。°。°。°。°。°。°。°。°\n\n`
      }
    }

    // Créditos finales
    menuText += `‐ ダ ძᥱsіg᥏ᥱძ ᑲᥡ  :  *ׅׅ꯱hׁׁׅׅ֮֮ꪱׁׁׁׅׅׅꭈׁׅᨵׁׅׅƙׁׅᨵׁׅׅ ժׁׅ݊ꫀׁׁׅܻׅ݊᥎ׁׅׅ꯱* ギ
‐ ダ mᥲძᥱ ᑲᥡ  :  *ᥣׁׅ֪ꫀׁׅܻ݊ᨵׁׅׅ ᥊ׁׅzׁׅ֬zׁׅׅ֬꯱ᨮׁׅ֮* ギ`

    // Reacción emoji
    await conn.sendMessage(m.chat, { react: { text: '🌸', key: m.key } })

    // Imagen del menú
    let menuUrl = 'https://files.catbox.moe/b10cv6.jpg'

    // 🌷 Envío del menú con botones funcionales
    const messageOptions = {
      image: { url: menuUrl },
      caption: menuText,
      contextInfo: {
        externalAdReply: {
          title: '🌸 ITSUNI NAKANO AI',
          body: 'Menú Principal',
          thumbnailUrl: menuUrl,
          sourceUrl: 'https://whatsapp.com/channel/0029VbBBn9R4NViep4KwCT3Z',
          mediaType: 1
        }
      },
      sections: [
        {
          title: '🔗 ENLACES DIRECTOS',
          rows: [
            {
              title: '🪷 DONAR',
              description: 'Apoya el desarrollo del bot',
              rowId: `${_p}donar`
            },
            {
              title: '🧋 CANAL OFICIAL', 
              description: 'Únete a nuestro canal',
              rowId: `${_p}canal`
            }
          ]
        }
      ]
    }

    await conn.sendMessage(m.chat, messageOptions, { quoted: m })

  } catch (e) {
    console.error(e)
    // Método alternativo simple
    await conn.sendFile(m.chat, menuUrl, 'menu.jpg', menuText, m)
  }
}

// Comandos para los botones
handler.donar = async (m, { conn }) => {
  await conn.sendMessage(m.chat, {
    text: '🪷 *DONAR AL PROYECTO*\n\nPuedes apoyar el desarrollo del bot mediante:\n\n🔗 PayPal: https://paypal.me/Erenxs01\n\n¡Tu apoyo es muy apreciado! 🌸',
    templateButtons: [{
      urlButton: {
        displayText: '💰 DONAR AHORA',
        url: 'https://paypal.me/Erenxs01'
      }
    }]
  }, { quoted: m })
}

handler.canal = async (m, { conn }) => {
  await conn.sendMessage(m.chat, {
    text: '🧋 *CANAL OFICIAL*\n\nÚnete a nuestro canal para recibir actualizaciones y novedades:\n\n🔗 https://whatsapp.com/channel/0029VbBBn9R4NViep4KwCT3Z',
    templateButtons: [{
      urlButton: {
        displayText: '📱 UNIRME AL CANAL',
        url: 'https://whatsapp.com/channel/0029VbBBn9R4NViep4KwCT3Z'
      }
    }]
  }, { quoted: m })
}

handler.help = ['menu', 'menunakano', 'help', 'menuitsuki']
handler.tags = ['main']
handler.command = ['menu', 'menunakano', 'help', 'menuitsuki']

export default handler