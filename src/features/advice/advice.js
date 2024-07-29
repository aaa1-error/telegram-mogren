import Logger from "@ptkdev/logger";
import { IMAGES_PATH, loggerConfig, MAX_ADVICE_RESOLUTION } from "../../../config.js";
import { Context } from "telegraf";
import { createCanvas, loadImage, registerFont } from "canvas";
import fs from 'fs'
import '../../utils.js'
import { downloadFile } from "../../utils.js";
import { fitText, resizeImage } from "./adviceUtils.js";

export class Advice { 
  /**
   * @type {Logger}
   * @private
   */
  Logger;

  /**
   * @type {string[]}
   * @private
   */
  Images = [];

  /**
   * @param {Logger} logger 
   */
  constructor(logger = new Logger(loggerConfig)) {
    this.Logger = logger

    registerFont('assets/impact.ttf', { family: 'Impact' })

    this.Images = fs.readdirSync(IMAGES_PATH)
  }

  /**
   * @method
   * @private
   * @param {Image} image 
   * @param {string} topText 
   * @param {string} bottomText 
   * @returns {Buffer}
   */
  createMeme = async (image, topText, bottomText) => {
    let width = image.width, height = image.height

    if(Math.max(width, height) > MAX_ADVICE_RESOLUTION) {
      let result = resizeImage(width, height, MAX_ADVICE_RESOLUTION)
      width = result[0]
      width = result[1]
    }
  
    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext('2d')
  
    ctx.drawImage(image, 0, 0, width, height)
  
    ctx.fillStyle = 'white'
    ctx.strokeStyle = 'black'
    ctx.lineJoin = 'round';
    ctx.lineWidth = 5
    ctx.textAlign = 'center'
  
    if (topText) {
      const topFontSize = fitText(ctx, topText, canvas.width - 20, canvas.height * 0.2)
      ctx.font = `${topFontSize}px Impact`
      ctx.strokeText(topText, canvas.width / 2, topFontSize)
      ctx.fillText(topText, canvas.width / 2, topFontSize)
    }
  
    if (bottomText) {
      const bottomFontSize = fitText(ctx, bottomText, canvas.width - 20, canvas.height * 0.2)
      ctx.font = `${bottomFontSize}px Impact`
      ctx.strokeText(bottomText, canvas.width / 2, canvas.height - 10)
      ctx.fillText(bottomText, canvas.width / 2, canvas.height - 10)
    }
    
    const buffer = canvas.toBuffer('image/jpeg')
    return buffer
  }

  /**
   * @method
   * @param {Context} ctx 
   * @param {Promise<void>} next 
   */
  adviceCallback = async (ctx, next) => {
    let text = ctx.message.text || ctx.message.caption
    if (!text) return
  
    let [command, captions_source] = text.splitByFirst(' ')
    if (command.toLowerCase() != 'адвайс')
      return next()
  
    captions_source ??= ctx.message.reply_to_message?.text || ctx.message.reply_to_message?.caption
    if (!captions_source) {
      ctx.reply('Текста нэма')
      return
    }
  
    let [top_text, bottom_text] = captions_source.toCaptions()
  
    let message_photo = ctx.message.photo || ctx.message.reply_to_message?.photo
    let photo_id = message_photo?.pop().file_id || undefined
    let downloaded_image = false
    let photo_path = ''
  
    if (photo_id) {
      try {
        let url = await ctx.telegram.getFileLink(photo_id)
        photo_path = await downloadFile(url)
        downloaded_image = true
      } catch (error) {
        this.Logger.error('An error occured while retrieving image from telegram server.')
        this.Logger.error(error)
      }
    } else {
      photo_path = `${IMAGES_PATH}/${this.Images.random()}`
    }
  
    this.Logger.debug(photo_path)
    let image = await loadImage(photo_path)
    
    let t_start = performance.now()
    let buffer = await this.createMeme(image, top_text?.toUpperCase(), bottom_text?.toUpperCase())
    let t_end = performance.now()

    await ctx.replyWithPhoto({ source: buffer }, { reply_to_message_id: ctx.message.reply_to_message })

    if(downloaded_image) {
      fs.unlinkSync(photo_path)
      this.Logger.debug(`Deleted ${photo_path}`)
    }

    this.Logger.debug(`Done ${Math.floor(buffer.length/1024)}kb in ${(t_end - t_start).toFixed(3)}`)
  }
}