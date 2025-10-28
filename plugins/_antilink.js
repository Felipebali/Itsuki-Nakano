// 📂 plugins/antilink.js

const groupLinkRegex = /chat\.whatsapp\.com\/(?:invite\/)?([0-9A-Za-z]{20,24})/i
const channelLinkRegex = /whatsapp\.com\/channel\/([0-9A-Za-z]+)/i
const anyLinkRegex = /https?:\/\/[^\s]+/i

// 🔹 Enlaces permitidos
const allowedLinks = /(tiktok\.com|youtube\.com|youtu\.be|link\.clashroyale\.com)/i
const tagallLink = 'https://miunicolink.local/tagall-FelixCat'
const igLinkRegex = /(https?:\/\/)?(www\.)?instagram\.com\/[^\s]+/i
const clashLinkRegex = /(https?:\/\/)?(link\.clashroyale\.com)\/[^\s]+/i

// 🔹 Cache de códigos de invitación por grupo
if (!global.groupInviteCodes) global.groupInviteCodes = {}

// 🔹 Números dueños exentos
const owners = ['59896026646', '59898719147']

export async function before(m, { conn, isAdmin, isBotAdmin }) {
  try {
    if (!m?.text) return true
    if (!m.isGroup) return true
    if (!isBotAdmin) return true

    const chat = global.db.data.chats[m.chat]
    if (!chat?.antiLink) return true

    const text = m.text
    const who = m.sender
    const number = who.replace(/\D/g, '')

    const isGroupLink = groupLinkRegex.test(text)
    const isChannelLink = channelLinkRegex.test(text)
    const isAnyLink = anyLinkRegex.test(text)
    const isAllowedLink = allowedLinks.test(text)
    const isTagall = text.includes(tagallLink)
    const isIG = igLinkRegex.test(text)
    const isClash = clashLinkRegex.test(text)

    // 🔸 Si manda un tagall
    if (isTagall) {
      await conn.sendMessage(m.chat, {
        text: `😮‍💨 Qué compartís el tagall inútil @${who.split('@')[0]}...`,
        mentions: [who],
      })
      await conn.sendMessage(m.chat, { delete: m.key })
      return false
    }

    // 🔸 Excepción: los dueños pueden mandar cualquier link (menos tagall)
    if (owners.includes(number)) return true

    // 🔸 Links permitidos: IG, canales, Clash o allowedLinks
    if (isIG || isChannelLink || isClash || isAllowedLink) return true

    // 🔸 Link del mismo grupo permitido (con cache)
    let currentInvite = global.groupInviteCodes[m.chat]
    if (!currentInvite) {
      try {
        currentInvite = await conn.groupInviteCode(m.chat)
        global.groupInviteCodes[m.chat] = currentInvite
      } catch (e) {
        console.log('⚠️ No se pudo obtener el invite code del grupo:', e.message)
        return true
      }
    }

    // Si el link es del mismo grupo, se permite
    if (isGroupLink && text.includes(currentInvite)) return true

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
        await conn.sendMessage(m.chat, { delete: m.key })
      }
      return false
    }

    // 🔸 Otros links no permitidos → eliminar + aviso
    if (isAnyLink) {
      await conn.sendMessage(m.chat, {
        text: `⚠️ @${who.split('@')[0]}, tu link fue eliminado (no permitido).`,
        mentions: [who],
      })
      await conn.sendMessage(m.chat, { delete: m.key })
      return false
    }

    return true
  } catch (err) {
    console.error('❌ Error en antilink:', err)
    return true
  }
}
