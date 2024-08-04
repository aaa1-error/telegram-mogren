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
    let margin_y = image.height * 0.02

    if (Math.max(width, height) > MAX_ADVICE_RESOLUTION) {
      let result = resizeImage(width, height, MAX_ADVICE_RESOLUTION)
      width = result[0]
      height = result[1]
    }

    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext('2d')

    ctx.drawImage(image, 0, 0, width, height)

    ctx.fillStyle = 'white'
    ctx.strokeStyle = 'black'
    ctx.lineJoin = 'round'
    ctx.textAlign = 'center'

    let top_text_size = topText ? fitText(ctx, topText, canvas.width - 10, canvas.height * 0.2) : undefined
    let bottom_text_size = bottomText ? fitText(ctx, bottomText, canvas.width - 10, canvas.height * 0.2) : undefined

    if (topText && bottomText) {
      top_text_size = Math.min(top_text_size, bottom_text_size)
      bottom_text_size = top_text_size
    }

    if (topText) {
      ctx.textBaseline = 'bottom'
      ctx.lineWidth = top_text_size * 0.05
      ctx.font = `${top_text_size}px Impact`

      ctx.strokeText(
        topText,
        canvas.width / 2,
        top_text_size + margin_y
      )
      ctx.fillText(
        topText,
        canvas.width / 2,
        top_text_size + margin_y
      )
    }

    if (bottomText) {
      ctx.textBaseline = 'top'
      ctx.lineWidth = bottom_text_size * 0.05
      ctx.font = `${bottom_text_size}px Impact`

      ctx.strokeText(
        bottomText, 
        canvas.width / 2, 
        canvas.height - bottom_text_size - margin_y
      ) 
      ctx.fillText(
        bottomText,
        canvas.width / 2,
        canvas.height - bottom_text_size - margin_y
      )
    }

    const buffer = canvas.toBuffer('image/jpeg')
    return buffer
  }

  /**
   * @method
   * @param {Context} ctx 
   * @param {Promise<void>} next 
   */
  adviceCallback = async (ctx) => {
    let text = ctx.message.text || ctx.message.caption
    if (!text) 
      return false

    let [command, captions_source] = text.splitByFirst(' ')
    if (command.toLowerCase() != 'адвайс')
      return false

    captions_source ??= ctx.message.reply_to_message?.text || ctx.message.reply_to_message?.caption
    if (!captions_source) {
      ctx.reply('Текста нэма')
      return true
    }

    if(captions_source == 'xxx') {
      await (new Promise((resolve, reject) => {
        setTimeout(() => resolve(), 10000)
      }))
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
        this.Logger.error('An error occured while retrieving image from the Telegram server.')
        this.Logger.error(error)

        downloaded_image = false
        photo_path = `${IMAGES_PATH}/${this.Images.random()}`
      }
    } else {
      photo_path = `${IMAGES_PATH}/${this.Images.random()}`
    }

    let image = await loadImage(photo_path)
    let buffer = await this.createMeme(image, top_text?.toUpperCase(), bottom_text?.toUpperCase())

    await ctx.replyWithPhoto({ source: buffer }, { reply_to_message_id: ctx.message.message_id })

    if (downloaded_image)
      fs.unlinkSync(photo_path)
  }
}