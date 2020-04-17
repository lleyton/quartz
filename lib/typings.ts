import Eris from 'eris'
import Command from './structures/Command'

export interface ClientOptions {
  eris?: Eris.ClientOptions
  owner: string | null
  logger?: {
    name?: string
    color?: string
  }
  eventHandler?: {
    directory?: string
    debug?: boolean
    commands?: boolean
  }
  commandHandler?: {
    prefix?: Function | string | string[]
    directory?: string
    defaultCooldown?: number
    debug?: boolean
    settings?: any
    text?: Function | string
    logo?: Function | string
    color?: Function | string | number
  }
}

export interface EmbedOptions {
  reply?: boolean
  bold?: boolean
  color?: string | number
  footer?: boolean
  text?: boolean
}

export interface Cooldown {
  expires?: number
  command?: number
}

export interface Description {
  content?: string
  usage?: string
  examples?: string[]
}

export interface Argument {
  key?: string
  type?: 'user' | 'string' | 'channel' | 'role' | 'message' | 'integer' | 'float' | 'member'
  prompt?: string | ((msg: any) => void)
  default?: string | ((msg: any) => void)
}

export interface CommandOptions {
  name?: string
  aliases?: string[]
  args?: Argument[]
  channel?: string
  ownerOnly?: boolean
  guildOnly?: boolean
  devOnly?: boolean
  description?: Description | string
  botPermissions?: any
  userPermissions?: any
  cooldown?: Cooldown
}

export interface EventOptions {
  name?: string
}

// @ts-ignore
export interface Message extends Eris.Message {
  guild?: Eris.Guild
  color?: string | number
  text?: string
  logo?: string
  command?: Command
  _configure(): Promise<void>
  embed?(message: string, options?: EmbedOptions): Promise<Message>
  settings?(): any
}
