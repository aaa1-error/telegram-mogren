import Logger from "@ptkdev/logger";
import { Context } from "telegraf";
import { loggerConfig } from "../../config";

export class Feature {
  /**
   * @type {Logger}
   * @private
   */
  Logger;

  /**
   * @param {Logger} logger
   */
  constructor(logger = new Logger(loggerConfig)) {
    this.Logger = logger  
  }

  /**
   * 
   * @param {Context} ctx 
   * @param {Promise<void>} next 
   */
  callback = (ctx, next) => {

  }
}