export interface ClientOptions {
  owner: string | null,
  eventHandler: {
    directory: string,
    debug: boolean
  },
  commandHandler: {
    prefix: any,
    directory: string,
    defaultCooldown: number,
    debug: boolean,
    settings: any,
    text: any,
    logo: any,
    color: any
  }
}

export interface EmbedOptions {
  reply: boolean,
  bold: boolean,
  color: any,
  footer: boolean,
  text: boolean
}

export interface Cooldown {
  expires: number,
  command: number
}