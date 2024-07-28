import { Telegraf } from "telegraf"
import dotenv from "dotenv"
import Logger from "@ptkdev/logger"
import { HELP_MOTD, loggerConfig } from "./config.js"
import { Advice } from "./src/features/advice/advice.js"
import { KZStats } from "./src/features/kzstats/kzstats.js"

dotenv.config()
const bot = new Telegraf(process.env.BOT_TOKEN)
const logger = new Logger(loggerConfig)
const advice = new Advice(logger)
const kzstats = new KZStats(logger)

bot.on('message', advice.adviceCallback).catch((error, ctx) => {
  logger.error(JSON.stringify(error))
  logger.error(`${ctx.chat.id}/${ctx.message.message_id}`)
})

bot.command('error', (ctx) => {
  logger.error("FAKE ERROR")
  ctx.reply('Умник хуев', { reply_to_message_id: ctx.message.message_id })
})

bot.command('kzstats', kzstats.callback)
bot.command('help', (ctx) => {
  ctx.reply(HELP_MOTD)
})

bot.launch(() => logger.debug('MorgenBot started'))