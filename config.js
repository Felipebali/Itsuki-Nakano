import { watchFile, unwatchFile } from 'fs'
import chalk from 'chalk'
import { fileURLToPath, pathToFileURL } from 'url'
import fs from 'fs'
import * as cheerio from 'cheerio'
import fetch from 'node-fetch'
import axios from 'axios'
import moment from 'moment-timezone'
import { dirname } from 'path' 

global.__dirname = (url) => dirname(fileURLToPath(url));

//================ DATOS DEL BOT =================//

global.botNumber = '' //Número del bot opcional
global.owner = [
  ['59898719147', 'Feli', true], // tu número como dueño
  ['59896026646', 'G', true], 
  ['59892682421', 'Bot', true], 
  ['119069730668723', 'FeliLID', true], // tu LID
  ['262573496758272', 'GerLID', true], 
  ['170777177522428', 'BotLID', true] 
];

global.mods = []
global.suittag = ['59898719147']
global.prems = []

// Información del bot 
global.libreria = 'Baileys'
global.baileys = 'V 6.7.9'
global.languaje = 'Español'
global.vs = '4.3.1'
global.vsJB = '5.0'
global.nameqr = 'Itsukiqr'
global.namebot = 'Itsuki-IA'
global.sessions = 'Itsuki-sessions'
global.jadi = 'jadibts'
global.ItsukiJadibts = true
global.Choso = true
global.prefix = ['.', '!', '/' , '#', '%']
global.apikey = 'ItsukiNakanoIA'
global.botNumber = '59892682421'// Números y settings globales para varios códigos
global.packname = 'La Mejor Bot De WhatsApp'
global.botname = '𝐈𝐭𝐬𝐮𝐤𝐢 𝐍𝐚𝐤𝐚𝐧𝐨-𝐈𝐀 𝐖𝐚𝐛𝐨𝐭 👑✨'
global.wm = '© 𝐋𝐞𝐨  𝐗𝐬𝐳𝐲'
global.wm3 = '⫹⫺  multi-device'
global.author = 'made by @Leo Xzsy'
global.dev = '© powered by Leo Xzsy'
global.textbot = 'Itsuki|IA- Leo Xzsy'
global.etiqueta = '@Leo Xzsy'
global.gt = '© creado Por Leo Xzsy'
global.me = '𝐈𝐭𝐬𝐮𝐤𝐢-𝐖𝐀𝐁𝐎𝐓'
global.listo = '*Aqui tiene*'
global.moneda = 'Yenes'
global.multiplier = 69
global.maxwarn = 3
global.cheerio = cheerio
global.fs = fs
global.fetch = fetch
global.axios = axios
global.moment = moment

// Enlaces oficiales del bot
global.gp1 = 'https://chat.whatsapp.com/EteP5pnrAZC14y9wReGF1V'
global.comunidad1 = 'https://chat.whatsapp.com/DeJvBuS7QgB3Ybp1BZulWL'
global.channel = 'https://whatsapp.com/channel/0029Vb4cQJu2f3EB7BS7o11M'
global.channel2 = 'https://whatsapp.com/channel/0029ValMlRS6buMFL9d0iQ0S'
global.md = 'https://github.com/xzzys26/Itsuki-Nakano'
global.correo = 'xzzysultra@gmail.com'

// Apis para las descargas y más
global.APIs = {
  ryzen: 'https://api.ryzendesu.vip',
  xteam: 'https://api.xteam.xyz',
  lol: 'https://api.lolhuman.xyz',
  delirius: 'https://delirius-apiofc.vercel.app',
  siputzx: 'https://api.siputzx.my.id', // usado como fallback para sugerencias IA
  mayapi: 'https://mayapi.ooguy.com'
}

global.APIKeys = {
  'https://api.xteam.xyz': 'YOUR_XTEAM_KEY',
  'https://api.lolhuman.xyz': 'API_KEY',
  'https://api.betabotz.eu.org': 'API_KEY',
  'https://mayapi.ooguy.com': 'may-f53d1d49'
}

// Endpoints de IA
global.SIPUTZX_AI = {
  base: global.APIs?.siputzx || 'https://api.siputzx.my.id',
  bardPath: '/api/ai/bard',
  queryParam: 'query',
  headers: { accept: '*/*' }
}


global.chatDefaults = {
  isBanned: false,
  sAutoresponder: '',
  welcome: true,
  autolevelup: false,
  autoAceptar: false,
  autosticker: false,
  autoRechazar: false,
  autoresponder: false,
  detect: true,
  antiBot: false,
  antiBot2: false,
  modoadmin: false,
  antiLink: true,
  antiImg: false,
  reaction: false,
  nsfw: false,
  antifake: false,
  delete: false,
  expired: 0,
  antiLag: false,
  per: [],
  antitoxic: false
}

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  try { import(pathToFileURL(file).href + `?update=${Date.now()}`) } catch {}
})

// Configuraciones finales
export default {
  prefix: global.prefix,
  owner: global.owner,
  sessionDirName: global.sessions,
  sessionName: global.sessions,
  botNumber: global.botNumber,
  chatDefaults: global.chatDefaults
}
