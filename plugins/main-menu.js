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
    let menuText = `> Ꮺׄ ㅤდㅤ   *ꪱׁׁׁׅׅׅtׁׅׅ꯱υׁׅƙׁׅꪱׁׁׁׅׅׅ* ㅤ 𖹭𑩙
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
    menuText += `‐ ダ ძᥱsіg᥏ᥱძ ᑲᥡ  :  *ׅׅ꯱hׁׁׅׅ֮֮ꪱׁׁׁׅׅׅꭈׁׅᨵׁׅׅƙׁׅᨵׁׅׅ ժׁׅ݊ꫀׁׁׅܻׅ݊᥎ׁׅׅ꯱* ギ
‐ ダ mᥲძᥱ ᑲᥡ  :  *ᥣׁׅ֪ꫀׁׅܻ݊ᨵׁׅׅ ᥊ׁׅzׁׅ֬zׁׅׅ֬꯱ᨮׁׅ֮* ギ`

    // Reacción emoji
    await conn.sendMessage(m.chat, { react: { text: '🌸', key: m.key } })

    // Imagen del menú
    let menuUrl = 'https://files.catbox.moe/b10cv6.jpg'

    // 🌷 Envío del menú con LISTA interactiva
    const sections = [
      {
        title: '🌸 Enlaces Oficiales',
        rows: [
          {
            title: '🧋 Canal Oficial',
            description: 'Únete a nuestro canal de WhatsApp',
            rowId: '.canal'
          },
          {
            title: '🪷 Donar',
            description: 'Apoya el desarrollo del bot',
            rowId: '.donar'
          },
          {
            title: 'ℹ️ Información',
            description: 'Información sobre el bot',
            rowId: '.info'
          }
        ]
      }
    ]

    await conn.sendMessage(m.chat, {
      image: { url: menuUrl },
      caption: menuText,
      footer: '🌸 𝐈𝐓𝐒𝐔𝐊𝐈 𝐍𝐀𝐊𝐀𝐍𝐎 - 𝐀𝐈 🌸',
      buttonText: '📋 Ver Opciones',
      sections: sections
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    await conn.sendMessage(m.chat, { 
      text: `❌ Error en el menú: ${e.message}` 
    }, { quoted: m })
  }
}

handler.help = ['menu', 'menunakano', 'help', 'menuitsuki']
handler.tags = ['main']
handler.command = ['menu', 'menunakano', 'help', 'menuitsuki']

export default handler