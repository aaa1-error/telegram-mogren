import { createCanvas, loadImage, registerFont } from "canvas";
import '../../utils.js'
import Logger from "@ptkdev/logger";
import { loggerConfig } from "../../../config.js";
const logger = new Logger(loggerConfig)

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
 * @returns {[number, TextMetrics]} 
 */
export function fitText(ctx, text, maxWidth, baseFontSize) {
  let fontSize = baseFontSize
  let initialFont = ctx.font

  do {
    ctx.font = `${fontSize}px Impact`
    var measurement = ctx.measureText(text)

    if(measurement.width <= maxWidth)
      break

    fontSize -= 2
  } while(fontSize > 3)

  ctx.font = initialFont
  return fontSize
}

export function drawText(ctx, text, y) {

}