import Eris from 'eris'

declare module 'quartz' {
  export interface Message extends Eris.Message {
    guild?: Eris.Guild,
    settings?(): any,
    color?(): any,
    text?(): any,
    logo?(): any
  }

  export interface ClientOptions {
    eris?: Eris.ClientOptions
    owner?: string | null
    eventHandler?: {
      directory: string
      debug?: boolean
    },
    commandHandler: {
      prefix?: any
      directory: string
      defaultCooldown?: number
      debug?: boolean
      settings?: any
      text?: any
      logo?: any
      color?: any
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

  export class Client {
    owner: string | null
    logger: any
    eventHandler: any
    commandHandler: CommandHandler
    constructor(token?: string, options?: ClientOptions, extensions?: any)
    client(): any
    start(): void
    [name: string]: any
  }

  export class CommandHandler {
    directory: string
    debug: boolean
    defaultCooldown: number
    commands: any
    modules: any
    aliases: any
    cooldowns: any
    constructor (quartz: any, options: ClientOptions['commandHandler'])  
    quartz(): Client
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

  export class EventHandler {
    directory: string
    debug: boolean
    events: any
    constructor (quartz: any, options: ClientOptions['eventHandler'])  
    quartz(): Client
    client(): any
    loadEvents(): void
  }

  export class LogHandler {
    warn(...message: any[]): void
    error(...message: any[]): void
    info(...message: any[]): void
    console(...message: any[]): void
  }

  export class Base {
    constructor(quartzClient: Client)
    quartz(): Client
    client(): any
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

  export class Command extends Base {
    client: any
    constructor (client: any, options: CommandOptions)
    userPermissions?(...args: any): Promise<any> | null
    run(...args: any): Promise<any>
  }

  export class Embed {
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
    constructor(data: any)
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

  export class Event extends Base {
    client: any
    constructor(client: any, options: EventOptions)
    run(...args: any): Promise<any>
  }

  export interface Message extends Eris.Message {
    guild: Eris.Guild
    embed(message: string, options?: any): Promise<Eris.Message>
    color(): string
    text(): string
    logo(): string
    settings(): any
  }
  export class ChannelType {
    client: any
    parse(value: string, msg: any): any
  }

  export class MessageType {
    client: any
    parse(value: string, msg: any): any
  }

  export class RoleType {
    client: any
    parse(value: string, msg: any): any
  }

  export class StringType {
    client: any
    parse(value: string, msg: any): any
  }

  export class IntegerType {
    client: any
    parse(value: string, msg: any): any
  }

  export class FloatType {
    client: any
    parse(value: string, msg: any): any
  }

  export class UserType {
    client: any
    parse(value: string, msg: any): any
  }
}
