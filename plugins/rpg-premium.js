const handler = async (m, { conn, text, usedPrefix, command }) => {
    const ctxErr = (global.rcanalx || {})
    const ctxWarn = (global.rcanalw || {})
    const ctxOk = (global.rcanalr || {})

    let user = global.db.data.users[m.sender];
    text = text ? text.toLowerCase().trim() : '';

    const plans = {
        'dia': { duration: 1, cost: 50000, emoji: '🌅' },
        'semana': { duration: 7, cost: 250000, emoji: '📅' }, // Ahorro del 28%
        'mes': { duration: 30, cost: 750000, emoji: '🗓️' }, // Ahorro del 50%
    };

    if (!text || !plans[text]) {
        let response = 
`╭━━━〔 🎀 𝐏𝐋𝐀𝐍𝐄𝐒 𝐏𝐑𝐄𝐌𝐈𝐔𝐌 🎀 〕━━━⬣
│ 🌸 *Itsuki-Nakano IA - Sistema Premium*
╰━━━━━━━━━━━━━━━━━━━━━━⬣

💎 *Planes Disponibles:*

${Object.entries(plans).map(([plan, data]) => 
    `│ ${data.emoji} *${plan.charAt(0).toUpperCase() + plan.slice(1)}*\n` +
    `│ ⏰ Duración: ${data.duration} día(s)\n` +
    `│ 💰 Costo: ¥${data.cost.toLocaleString()}\n` +
    `│ ────────────────────`
).join('\n')}

📝 *Cómo usar:*
│ ${usedPrefix + command} <plan>
│ 
│ *Ejemplo:*
│ ${usedPrefix + command} semana

🌸 *Itsuki te ofrece beneficios exclusivos...* (◕‿◕✿)`;

        return conn.reply(m.chat, response, m, ctxWarn);
    }

    const selectedPlan = plans[text];

    if (user.coin < selectedPlan.cost) {
        return conn.reply(m.chat, 
`╭━━━〔 🎀 𝐄𝐑𝐑𝐎𝐑 🎀 〕━━━⬣
│ ❌ *Fondos insuficientes*
│ 
│ 💰 *Necesitas:* ¥${selectedPlan.cost.toLocaleString()}
│ 💵 *Tienes:* ¥${user.coin.toLocaleString()}
│ 📉 *Faltan:* ¥${(selectedPlan.cost - user.coin).toLocaleString()}
╰━━━━━━━━━━━━━━━━━━━━━━⬣

🌸 *Itsuki sugiere que consigas más monedas...* (´･ω･\`)`, 
        m, ctxErr);
    }

    user.coin -= selectedPlan.cost;
    user.premium = true;

    const newPremiumTime = (user.premiumTime > 0 ? user.premiumTime : Date.now()) + (selectedPlan.duration * 24 * 60 * 60 * 1000);
    user.premiumTime = newPremiumTime;

    const remainingTime = newPremiumTime - Date.now();
    const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    await conn.reply(m.chat, 
`╭━━━〔 🎀 𝐅𝐄𝐋𝐈𝐂𝐈𝐃𝐀𝐃𝐄𝐒 🎀 〕━━━⬣
│ ✅ *¡Plan Premium Adquirido!*
│ 
│ 💎 *Plan:* ${text.charAt(0).toUpperCase() + text.slice(1)}
│ ⏰ *Duración:* ${selectedPlan.duration} día(s)
│ 💰 *Costo:* ¥${selectedPlan.cost.toLocaleString()}
│ 
│ ⏳ *Tiempo restante:*
│ ${days} días y ${hours} horas
╰━━━━━━━━━━━━━━━━━━━━━━⬣

🌟 *Beneficios Premium:*
• Acceso a comandos exclusivos
• Prioridad en respuestas
• Funciones especiales desbloqueadas
• Sin límites de uso

🌸 *¡Itsuki te da la bienvenida al club premium!* (◕‿◕✿)
🎀 *Disfruta de tus nuevos beneficios* 💫`, 
    m, ctxOk);

    // Reacción de éxito
    await m.react('💎');
};

handler.help = ['comprarpremium [plan]'];
handler.tags = ['premium'];
handler.command = ['comprarpremium', 'premium', 'vip', 'comprarvip'];
handler.register = true;

export default handler;