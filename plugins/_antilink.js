// 📂 plugins/_antilink.js — versión corregida para FelixCat

const groupLinkRegex = /chat\.whatsapp\.com\/(?:invite\/)?([0-9A-Za-z]{20,24})/i
const channelLinkRegex = /whatsapp\.com\/channel\/([0-9A-Za-z]+)/i
const anyLinkRegex = /https?:\/\/[^\s]+/i

// 🔹 Enlaces permitidos
const allowedLinks = /(tiktok\.com|youtube\.com|youtu\.be|link\.clashroyale\.com)/i
const tagallLink = 'https://miunicolink.local/tagall-FelixCat'
const igLinkRegex = /(https?:\/\/)?(www\.)?instagram\.com\/[^\s]+/i
const clashLinkRegex = /(https?:\/\/)?(link\.clashroyale\.com)\/[^\s]+/i

if (!global.groupInviteCodes) global.groupInviteCodes = {}
const owners = ['59896026646', '59898719147']

let handler = async function (m, { conn, isAdmin, isBotAdmin }) {
  try {
    if (!m?.text) return !0
    if (!m.isGroup) return !0
    if (!isBotAdmin) return !0

    const chat = global.db.data.chats[m.chat]
    if (!chat?.antiLink) return !0

    const text = (m.text || '').trim()
    const who = m.sender
    const number = who.replace(/\D/g, '')

    // 🧠 Ignorar comandos del bot o mensajes del bot
    if (text.startsWith('.') || m.fromMe) return !0

    const isGroupLink = groupLinkRegex.test(text)
    const isChannelLink = channelLinkRegex.test(text)
    const isAnyLink = anyLinkRegex.test(text)
    const isAllowedLink = allowedLinks.test(text)
    const isTagallLink = text.match(/https?:\/\/miunicolink\.local\/tagall-FelixCat/i)
    const isIG = igLinkRegex.test(text)
    const isClash = clashLinkRegex.test(text)

    // 🧨 Bloquear solo si manda EL LINK REAL del tagall, no el comando .tagall
    if (isTagallLink && !text.startsWith('.tagall')) {
      await conn.sendMessage(m.chat, {
        text: `😮‍💨 Qué compartís el link del tagall, inútil @${who.split('@')[0]}...`,
        mentions: [who],
      })
      await conn.sendMessage(m.chat, {
        delete: {
          remoteJid: m.chat,
          fromMe: false,
          id: m.key.id,
          participant: m.key.participant || who,
        },
      })
      return !1
    }

    // 🔸 Excepción: dueños pueden mandar cualquier link (menos el del tagall)
    if (owners.includes(number)) return !0

    // 🔸 Links permitidos
    if (isIG || isChannelLink || isClash || isAllowedLink) return !0

    // 🔸 Link del mismo grupo permitido (cache)
    let currentInvite = global.groupInviteCodes[m.chat]
    if (!currentInvite) {
      try {
        currentInvite = await conn.groupInviteCode(m.chat)
        global.groupInviteCodes[m.chat] = currentInvite
      } catch (e) {
        console.log('⚠️ No se pudo obtener el invite code del grupo:', e.message)
        return !0
      }
    }

    if (isGroupLink && text.includes(currentInvite)) return !0

    // 🔸 Link de otro grupo → expulsar o eliminar
    if (isGroupLink && !text.includes(currentInvite)) {
      if (!isAdmin) {
        await conn.groupParticipantsUpdate(m.chat, [who], 'remove')
        await conn.sendMessage(m.chat, {
          text: `🚫 @${who.split('@')[0]} fue *expulsado* por compartir un link de *otro grupo*.`,
          mentions: [who],
        })
      } else {
        await conn.sendMessage(m.chat, {
          text: `⚠️ @${who.split('@')[0]}, no compartas links de otros grupos.`,
          mentions: [who],
        })
        await conn.sendMessage(m.chat, {
          delete: {
            remoteJid: m.chat,
            fromMe: false,
            id: m.key.id,
            participant: m.key.participant || who,
          },
        })
      }
      return !1
    }

    // 🔸 Cualquier otro link no permitido
    if (isAnyLink) {
      await conn.sendMessage(m.chat, {
        text: `⚠️ @${who.split('@')[0]}, tu link fue eliminado (no permitido).`,
        mentions: [who],
      })
      await conn.sendMessage(m.chat, {
        delete: {
          remoteJid: m.chat,
          fromMe: false,
          id: m.key.id,
          participant: m.key.participant || who,
        },
      })
      return !1
    }

    return !0
  } catch (err) {
    console.error('❌ Error en antilink:', err)
    return !0
  }
}

handler.before = handler
export default handler
