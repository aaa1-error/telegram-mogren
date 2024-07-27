import { Context } from "telegraf"
import Logger from "@ptkdev/logger";
import { CLIMB_IP, GOOD_HL_SERVER_IP, loggerConfig } from "../../../config.js";
import pkg from '@fabricio-191/valve-server-query'
import not_a_log from 'not-a-log'
const { Server, RCON, MasterServer } = pkg

const sortByScore = (a, b) => {
  return b.score - a.score
}

export class KZStats {
  /**
   * @type {Logger}
   * @private
   */
  Logger;

  /**
   * @type {Server[]}
   * @private
   */
  Servers;
  

  constructor(logger = new Logger(loggerConfig)) {
    this.Logger = logger
    this.init()
  }

  init = async () => {
    
  }

  /**
   * 
   * @param {Context} ctx 
   * @param {Promise<void>} next 
   */
  callback = async (ctx, next) => {
    let server = await Server({
      ip: CLIMB_IP[0],
      port: CLIMB_IP[1]
    })

    let info = await server.getInfo()
    let envelope = (await server.getPlayers())
    .map((player) => ({
      name: player.name,
      score: player.score
    })).sort(sortByScore)

    let message = 
    "```" +
    not_a_log.table(envelope) +
    `Map: ${info.map}` +
    "```"

    ctx.replyWithMarkdownV2(message)
    server.disconnect()
  }
}