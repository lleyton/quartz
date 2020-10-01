import Eris, { Message } from 'eris'
import Command from './structures/Command'

export interface CommandContext {
  message: Eris.Message,
  command: Command,
  prefix: string | string[]
  arguments: string[]
}

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
  prompt?: string | ((msg: Message) => void)
  default?: string | ((msg: Message) => void)
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
