import { Telegraf } from "telegraf"
import dotenv from "dotenv"
import Logger from "@ptkdev/logger"
import { CACHE_PATH, HELP_MOTD, IMAGES_PATH, loggerConfig } from "./config.js"
import { Advice } from "./src/features/advice/advice.js"
import fs from 'fs'

dotenv.config()

if(!fs.existsSync(IMAGES_PATH))
  fs.mkdirSync(IMAGES_PATH)

if(!fs.existsSync(CACHE_PATH))
  fs.mkdirSync(CACHE_PATH)

const bot = new Telegraf(process.env.BOT_TOKEN)
const logger = new Logger(loggerConfig)
const advice = new Advice(logger)

bot.on('message', advice.adviceCallback).catch((error, ctx) => {
  logger.error(error)
  logger.error(`${ctx.chat.id}/${ctx.message.message_id}`)
})


bot.command('error', (ctx) => {
  logger.error("FAKE ERROR")
  ctx.reply('Умник хуев', { reply_to_message_id: ctx.message.message_id })
})

bot.command('help', (ctx) => {
  ctx.reply(HELP_MOTD)
})

bot.launch(() => logger.debug('MorgenBot started'))