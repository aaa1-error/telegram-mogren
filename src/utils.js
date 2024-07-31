import { Context, Telegram } from "telegraf";
import { v6 as uuidv6 } from "uuid";
import fs from "fs"
import { CACHE_PATH, IMAGES_PATH } from "../config.js";
import { Console } from "console";
import { Transform } from "stream";

export const rawArguments = (command, text) => text.replace(`/${command}`, "").trim()

/**
 * @param {string} string
 * @param {string} delimiter
 * @returns {string[]}
*/
String.prototype.splitByFirst = function (delimiter) {
  let index = this.indexOf(delimiter)

  if (index === -1) {
    return [this, undefined]
  }

  let left = this.substring(0, index)
  let right = this.substring(index + delimiter.length)
  return [left, right]
}


String.prototype.toCaptions = function () {
  if(!this) return undefined
  let [top, bottom] = this.splitByFirst('//').map((i) => i?.trim())

  if (bottom == undefined) {
    [top, bottom] = [bottom, top]
  }

  return [top, bottom]
}

/**
 * @param {} message
 */
export const getMessageText = () => {
  return this.text || this.caption
}

/**
 * @param {Telegram} telegram
 * @param {string} file_id 
 */
export const downloadFile = async (url) => {
  let request = await fetch(url)
  let data = await request.arrayBuffer()
  let path = `${CACHE_PATH}/${uuidv6()}.jpg`
  let buffer = Buffer.from(data)
  fs.writeFileSync(path, buffer)
  return path
}

Array.prototype.random = function () {
  return this[Math.floor((Math.random() * this.length))];
}