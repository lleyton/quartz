import Eris from 'eris'
import CooldownHandler from './src/handlers/CooldownHandler'
import PermissionHandler from './src/handlers/PermissionHandler'

declare module '@points.city/quartz' {
  export interface CommandContext {
    message: Eris.Message,
    command: Command,
    prefix: string | string[]
    arguments: string[]
  }

  export interface ClientOptions {
    eris?: Eris.ClientOptions
    owner?: string | null
    logger?: {
      name?: string
      color?: string
    }
    eventHandler?: {
      directory?: string
      debug?: boolean
    }
    commandHandler: {
      prefix?: any
      directory?: string
      defaultCooldown?: number
      debug?: boolean
      settings?: Function | any
      text?: any
      logo?: any
      color?: any
    }
  }

  export interface Cooldown {
    expires?: number
    command?: number
  }

  export class Client extends Eris.Client {
    owner: string | null
    logger: LogHandler
    eventHandler: EventHandler
    commandHandler: CommandHandler
    constructor(token?: string, options?: ClientOptions)
    start(): Promise<void> | void
    [name: string]: any
  }

  export class CommandHandler {
    directory: string
    debug: boolean
    defaultCooldown: number
    commands: Eris.Collection<any>
    modules: Eris.Collection<any>
    aliases: Eris.Collection<any>
    cooldownHandler: CooldownHandler
    permissionHandler: PermissionHandler
    constructor (client: Client, options: ClientOptions['commandHandler'])
    client(): Client
    getCommand(commandName: string): Command
    getCommands(module: string): Command[]
    loadModules(): string[]
    loadCommands(): void
  }

  export class EventHandler {
    directory: string
    debug: boolean
    events: Eris.Collection<unknown>
    constructor (client: Client, options: ClientOptions['eventHandler'])
    client(): Client
    loadEvents(): void
  }

  export class LogHandler {
    warn(...message: any[]): void
    error(...message: any[]): void
    info(...message: any[]): void
    console(...message: any[]): void
  }

  export class Base {
    constructor(client: Client)
    client(): Client
    logger(): LogHandler
  }

  interface Description {
    content?: string
    usage?: string
    examples?: string[]
  }

  interface Argument {
    key?: string
    type?: 'user' | 'string' | 'channel' | 'role' | 'message' | 'integer' | 'float' | 'member'
    prompt?: string | ((msg: any) => void)
    default?: string | ((msg: any) => void)
  }

  export interface CommandOptions {
    name: string
    aliases?: string[]
    args?: Argument[]
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
    client: Client
    constructor (client: Client, options: CommandOptions)
    userPermissions?(...args: any): Promise<any> | null
    run(...args: any): Promise<any> | any
  }

  export class Embed {
    fields: {
      name: string
      value: string
      inline?: boolean
    }[]
    url: string
    author: {
      name: string
      icon_url: string
      url: string
    }

    color: number
    description: string
    file: string
    footer: {
      text: string
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

    constructor(data?: any)
    setAuthor(name: string, icon?: string, url?: string): Embed
    setColor(color: string | number): Embed
    setDescription(desc: string): Embed
    addField(name: string, value: string, inline?: boolean): Embed
    setFile(file: string): Embed
    setFooter(text: string, icon?: string): Embed
    setImage(url: string): Embed
    setTimestamp (time?: any): Embed
    setTitle(title: string): Embed
    setThumbnail(url: string): Embed
    setURL(url: string): Embed
  }

  interface EventOptions {
    name: string
  }

  export class Event extends Base {
    client: any
    constructor(client: any, options: EventOptions)
    run(...args: any): Promise<any>
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
