import Logger from "@ptkdev/logger";

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
  callback = (ctx, next) => {
    
  }
}