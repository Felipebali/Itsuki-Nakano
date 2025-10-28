// 🔒 Plugin: propietario-ln.js
// 📜 Sistema de lista negra completo, estable y sin fallos.
// Compatible con Itsuki-Nakano / Gaara-Ultra-MD

function normalizeJid(jid = '') {
  if (!jid) return null
  return jid
    .replace(/@c\.us$/, '@s.whatsapp.net')
    .replace(/@s\.whatsapp\.net$/, '@s.whatsapp.net')
}

const handler = async (m, { conn, command, text }) => {
  const db = global.db.data.users || (global.db.data.users = {})
  const reactions = { ln: '✅', unln: '☢️', cln: '👀', verln: '📜', usln: '🧹' }

  // Reacción según comando
  if (reactions[command]) {
    await conn.sendMessage(m.chat, { react: { text: reactions[command], key: m.key } }).catch(() => {})
  }

  // Detectar usuario objetivo
  let userJid = null
  if (m.quoted) userJid = normalizeJid(m.quoted.sender)
  else if (m.mentionedJid?.length) userJid = normalizeJid(m.mentionedJid[0])
  else if (text) {
    const num = text.match(/\d{5,}/)?.[0]
    if (num) userJid = `${num}@s.whatsapp.net`
  }

  // Motivo
  let reason = text ? text.replace(/@/g, '').replace(userJid?.split('@')[0] || '', '').trim() : ''
  if (!reason) reason = 'No especificado'

  if (!userJid && !['verln', 'usln'].includes(command))
    return conn.reply(m.chat, '🚫 Debes responder, mencionar o escribir el número del usuario.', m)

  if (userJid && !db[userJid]) db[userJid] = {}

  // 📥 AGREGAR A LISTA NEGRA
  if (command === 'ln') {
    db[userJid].banned = true
    db[userJid].banReason = reason
    db[userJid].bannedBy = m.sender

    await conn.sendMessage(m.chat, {
      text: `✅ @${userJid.split('@')[0]} fue agregado a la *lista negra*.\n📝 Motivo: ${reason}`,
      mentions: [userJid]
    })

    // Expulsión automática de todos los grupos
    try {
      const groups = Object.keys(await conn.groupFetchAllParticipating())
      for (const jid of groups) {
        await new Promise(r => setTimeout(r, 2500))
        const group = await conn.groupMetadata(jid).catch(() => null)
        if (!group) continue

        const member = group.participants.find(p => normalizeJid(p.id) === normalizeJid(userJid))
        if (!member) continue

        await conn.sendMessage(jid, {
          text: `🚫 @${userJid.split('@')[0]} está en la *lista negra* y será eliminado.\n📝 Motivo: ${reason}`,
          mentions: [userJid]
        })
        await new Promise(r => setTimeout(r, 1500))
        await conn.groupParticipantsUpdate(jid, [member.id], 'remove').catch(() => {})
        console.log(`[AUTO-KICK] ${userJid} expulsado de ${group.subject}`)
      }
    } catch (err) {
      console.log(`⚠️ Error al expulsar: ${err.message}`)
    }
  }

  // 📤 QUITAR DE LA LISTA NEGRA
  else if (command === 'unln') {
    if (!db[userJid]?.banned)
      return conn.sendMessage(m.chat, {
        text: `✅ @${userJid.split('@')[0]} no está en la lista negra.`,
        mentions: [userJid]
      })

    db[userJid].banned = false
    db[userJid].banReason = ''
    db[userJid].bannedBy = null

    await conn.sendMessage(m.chat, {
      text: `☢️ @${userJid.split('@')[0]} fue eliminado de la *lista negra*.`,
      mentions: [userJid]
    })
  }

  // 🔎 CONSULTAR ESTADO DE UN USUARIO
  else if (command === 'cln') {
    if (!db[userJid]?.banned)
      return conn.sendMessage(m.chat, {
        text: `✅ @${userJid.split('@')[0]} no está en la lista negra.`,
        mentions: [userJid]
      })

    await conn.sendMessage(m.chat, {
      text: `🚫 @${userJid.split('@')[0]} está en la *lista negra*.\n📝 Motivo: ${db[userJid].banReason || 'No especificado'}`,
      mentions: [userJid]
    })
  }

  // 📜 VER LISTA COMPLETA
  else if (command === 'verln') {
    const bannedUsers = Object.entries(db).filter(([_, data]) => data?.banned)
    if (!bannedUsers.length)
      return conn.sendMessage(m.chat, { text: '✅ No hay usuarios en la lista negra.' })

    let list = '🚫 *LISTA NEGRA ACTUAL*\n\n'
    const mentions = []

    for (const [jid, data] of bannedUsers) {
      list += `• @${jid.split('@')[0]}\n  Motivo: ${data.banReason || 'No especificado'}\n\n`
      mentions.push(jid)
    }

    await conn.sendMessage(m.chat, { text: list.trim(), mentions })
  }

  // 🧹 VACIAR LISTA NEGRA
  else if (command === 'usln') {
    let count = 0
    for (const jid in db) {
      if (db[jid]?.banned) {
        db[jid].banned = false
        db[jid].banReason = ''
        db[jid].bannedBy = null
        count++
      }
    }
    await conn.sendMessage(m.chat, {
      text: `🧹 Lista negra vaciada.\n${count} usuarios fueron liberados.`
    })
  }

  await global.db.write?.()
}

// 🚫 AUTO-KICK SI HABLA ESTANDO BANEADO
handler.before = async function (m, { conn }) {
  if (!m.isGroup || !m.sender) return
  const db = global.db.data.users || {}
  const sender = normalizeJid(m.sender)
  if (db[sender]?.banned) {
    const reason = db[sender].banReason || 'No especificado'
    await conn.sendMessage(m.chat, {
      text: `🚫 @${sender.split('@')[0]} está en la lista negra y será eliminado.\n📝 Motivo: ${reason}`,
      mentions: [sender]
    })
    await new Promise(r => setTimeout(r, 2000))
    await conn.groupParticipantsUpdate(m.chat, [sender], 'remove').catch(() => {})
    console.log(`[AUTO-KICK] Eliminado ${sender}`)
  }
}

// 🚫 AUTO-KICK AL UNIRSE SI ESTÁ EN LISTA NEGRA
handler.participantsUpdate = async function (event) {
  const conn = this
  const { id, participants, action } = event
  if (!['add', 'invite'].includes(action)) return
  const db = global.db.data.users || {}
  for (const user of participants) {
    const u = normalizeJid(user)
    if (db[u]?.banned) {
      const reason = db[u].banReason || 'No especificado'
      await conn.sendMessage(id, {
        text: `🚫 @${u.split('@')[0]} está en la lista negra y será eliminado automáticamente.\n📝 Motivo: ${reason}`,
        mentions: [u]
      })
      await new Promise(r => setTimeout(r, 2000))
      await conn.groupParticipantsUpdate(id, [u], 'remove').catch(() => {})
      console.log(`[AUTO-KICK JOIN] ${u} eliminado`)
    }
  }
}

handler.help = ['ln', 'unln', 'cln', 'verln', 'usln']
handler.tags = ['owner']
handler.command = ['ln', 'unln', 'cln', 'verln', 'usln']
handler.rowner = true

export default handler
