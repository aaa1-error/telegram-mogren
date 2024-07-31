import Logger from "@ptkdev/logger";
import { Context } from "telegraf";

export class Demotivator {
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
    
  }
}