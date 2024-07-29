import Logger from "@ptkdev/logger"

export const loggerConfig = {
  write: true,
  path: {
    debug_log: "./debug.log",
    error_log: "./error.log",
  },
  rotate: {
    size: "10M"
  }
}

export const IMAGES_PATH = './images'
export const CACHE_PATH = './.cache'
export const MAX_ADVICE_RESOLUTION = 1280
export const HELP_MOTD = 
`
Команды этого чудобота:
адвайс [верхний текст] // [нижний текст] — создаёт top text/bottom text мем.
`