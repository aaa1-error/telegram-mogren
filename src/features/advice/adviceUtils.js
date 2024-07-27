import { createCanvas, loadImage, registerFont } from "canvas";
import '../../utils.js'
import Logger from "@ptkdev/logger";
import { loggerConfig } from "../../../config.js";
const logger = new Logger(loggerConfig)

registerFont('assets/impact.ttf', { family: 'Impact' })

/**
 * 
 * @param {number} width 
 * @param {number} height 
 * @returns {number[]}
 */
export function resizeImage(width, height, maxResolution) {
  if(Math.max(width, height) < maxResolution) return [width, height]

  let ratio = width / height

  if (width > height) {
    return [maxResolution, maxResolution / ratio]
  } else {
    return [maxResolution * ratio, maxResolution]
  }
}

/**
 * @param {CanvasRenderingContext2D} ctx 
 * @param {string} text 
 * @param {number} maxWidth 
 * @param {number} baseFontSize 
 * @returns {number}
 */
export function fitText(ctx, text, maxWidth, baseFontSize) {
  let fontSize = baseFontSize

  do {
    ctx.font = `${fontSize}px Impact`
    if (ctx.measureText(text).width <= maxWidth) {
      break
    }
    fontSize -= 3
  } while (fontSize > 10)

  return fontSize
}


export const TELEGRAM_API_MAX_IMAGE_RATIO = 20

/**
 * @param {number} width 
 * @param {number} height 
 */
export const checkImageRatio = (width, height) => {
  let ratio = width / height
  return ratio >= TELEGRAM_API_MAX_IMAGE_RATIO || ratio >= 1/TELEGRAM_API_MAX_IMAGE_RATIO
}


const TELEGRAM_API_MAX_IMAGE_DIMENSION_SUM = 10000

/**
 * @param {number} width 
 * @param {number} height 
 */
export const checkImageResolution = (width, height) => {
  return width + height >= TELEGRAM_API_MAX_IMAGE_DIMENSION_SUM
}