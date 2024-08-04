import Logger from "@ptkdev/logger";
import { Context } from "telegraf";

export class JPEG {
   /**
   * @type {Logger}
   * @private
   */
  Logger;

  constructor(logger) {
    this.Logger = logger
  }

  /**
   * @method
   * @param {Context} ctx 
   * @param {Promise<void>} next 
   */
  callback = async (ctx, next) => {
    if(ctx.message.text.toLowerCase() != 'шакал')
      next()

    let message_photo = ctx.message?.photo || ctx.message.reply_to_message?.photo

    if(!message_photo) {
      ctx.reply('Нэма картинки', { reply_to_message_id: ctx.message.message_id })
    }
  }
}