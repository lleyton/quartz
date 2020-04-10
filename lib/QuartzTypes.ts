import Eris from 'eris'

export interface ClientOptions {
  eris?: Eris.ClientOptions
  owner: string | null
  eventHandler: {
    directory: string
    debug: boolean
  },
  commandHandler: {
    prefix: any
    directory: string
    defaultCooldown: number
    debug: boolean
    settings: any
    text: any
    logo: any
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

export interface QuartzClient {
  owner: string | null
  logger: any
  eventHandler: any
  commandHandler: CommandHandler
  constructor(options: ClientOptions, eris: Eris.Client): void
  client(): any
  start(): void
}

export interface CommandHandler {
  directory: string
  debug: boolean
  defaultCooldown: number
  commands: any
  modules: any
  aliases: any
  cooldowns: any
  constructor (quartz: QuartzClient, options: ClientOptions['commandHandler'], extensions: any[]): void
  quartz(): QuartzClient
  client(): any
  getCommand(commandName: string): Command
  getCommands(module: string): Command[]
  loadModules(): string[]
  loadCommands(): void
  settings(msg: any): any
  text(msg: any): any
  logo(msg: any): any
  color(msg: any): any
  prefix(msg: any): any
  embed(msg: any, message: string, options: EmbedOptions): any
}

export interface EventHandler {
  directory: string
  debug: boolean
  events: any
  constructor (quartz: QuartzClient, options: ClientOptions['eventHandler']): void
  quartz(): QuartzClient
  client(): Eris.Client
  loadEvents(): void
}

export interface LogHandler {
  warn(...message: any[]): void
  error(...message: any[]): void
  info(...message: any[]): void
  console(...message: any[]): void
}

export interface Base {
  constructor(quartzClient: QuartzClient, options: CommandOptions | EventOptions): void
  quartz(): QuartzClient
  client(): Eris.Client
  logger(): LogHandler
}

interface Description {
  content?: string
  usage?: string
  examples?: string[]
}

interface Args {
  key?: string
  type?: string
  prompt?: string | ((msg: any) => void)
  default?: string | ((msg: any) => void)
}

interface CommandOptions {
  name: string
  aliases?: string[]
  args?: Args[]
  channel?: string
  ownerOnly?: boolean
  guildOnly?: boolean
  devOnly?: boolean
  description?: Description
  botPermissions?: any
  userPermissions?: any
  cooldown?: Cooldown
}

export interface Command extends Base {
  client: any
  constructor (client: QuartzClient, options: CommandOptions): void
  userPermissions?(...args: any): Promise<any> | null
  run(...args: any): Promise<any>
}

export interface Embed {
  fields: any[]
  url: string
  author: {
    name: string,
    icon_url: string,
    url: string
  }
  color: string
  description: string
  file: string
  footer: {
    text: string,
    icon_url: string
  }
  image: {
    url: string
  }
  date: any
  title: string
  thumbnail: {
    url: string
  }
  constructor(data: any): void
  setAuthor(name: string, icon: string, url: string): void
  setColor(color: any): void
  setDescription(desc: string): void
  addField(name: string, value: string, inline: boolean): void
  setFile(file: string): void
  setFooter(text: string, icon: string): void
  setImage(url: string): void
  setTimestamp (time: any): void
  setTitle(title: string): void
  setThumbnail(url: string): void
  setURL(url: string): void
}

interface EventOptions {
  name: string
}

export interface Event extends Base {
  client: any
  constructor(client: any, options: EventOptions): void
  run(...args: any): Promise<any>
}

export interface Message extends Eris.Message {
  guild: Eris.Guild
  embed(message: string, options?: any): Promise<Message>
  color(): string
  text(): string
  logo(): string
  settings(): any
}
export interface ChannelType {
  client: any
  parse(value: string, msg: any): any
}

export interface MessageType {
  client: any
  parse(value: string, msg: any): any
}

export interface RoleType {
  client: any
  parse(value: string, msg: any): any
}

export interface StringType {
  client: any
  parse(value: string, msg: any): any
}

export interface IntegerType {
  client: any
  parse(value: string, msg: any): any
}

export interface FloatType {
  client: any
  parse(value: string, msg: any): any
}

export interface UserType {
  client: any
  parse(value: string, msg: any): any
}