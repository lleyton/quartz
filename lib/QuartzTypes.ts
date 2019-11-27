export interface options {
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

export interface quickEmbed {
  reply: boolean,
  bold: boolean,
  color: any,
  footer: boolean
}

export interface cooldown {
  expires: number,
  command: number
}