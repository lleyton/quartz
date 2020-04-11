import Eris from 'eris'

export enum Events {
  CallCreate = 'callCreate',
  CallDelete = 'callDelete',
  CallRing = 'callRing',
  CallUpdate = 'callUpdate',
  ChannelCreate = 'channelCreate',
  ChannelDelete = 'channelDelete',
  ChannelPinUpdate = 'channelPinUpdate',
  ChannelRecipientAdd = 'channelRecipientAdd',
  ChannelRecipientRemove = 'channelRecipientRemove',
  ChannelUpdate = 'channelUpdate',
  Connect = 'connect',
  Debug = 'debug',
  Disconnect = 'disconnect',
  Error = 'error',
  FriendSuggestionCreate = 'friendSuggestionCreate',
  FriendSuggestionDelete = 'friendSuggestionDelete',
  GuildAvailable = 'guildAvailable',
  GuildBanAdd = 'guildBanAdd',
  GuildBanRemove = 'guildBanRemove',
  GuildCreate = 'guildCreate',
  GuildDelete = 'guildDelete',
  GuildEmojisUpdate = 'guildEmojisUpdate',
  GuildMemberAdd = 'guildMemberAdd',
  GuildMemberChunk = 'guildMemberChunk',
  GuildMemberRemove = 'guildMemberRemove',
  GuildMemberUpdate = 'guildMemberUpdate',
  GuildRoleCreate = 'guildRoleCreate',
  GuildRoleDelete = 'guildRoleDelete',
  GuildRoleUpdate = 'guildRoleUpdate',
  GuildUnavailable = 'guildUnavailable',
  GuildUpdate = 'guildUpdate',
  Hello = 'hello',
  MessageCreate = 'messageCreate',
  MessageDelete = 'messageDelete',
  MessageDeleteBulk = 'messageDeleteBulk',
  MessageReactionAdd = 'messageReactionAdd',
  MessageReactionRemove = 'messageReactionRemove',
  MessageReactionRemoveAll = 'messageReactionRemoveAll',
  MessageUpdate = 'messageUpdate',
  PresenceUpdate = 'presenceUpdate',
  RawWS = 'rawWS',
  Ready = 'ready',
  RelationshipAdd = 'relationshipAdd',
  RelationshipRemove = 'relationshipRemove',
  RelationshipUpdate = 'relationshipUpdate',
  ShardDisconnect = 'shardDisconnect',
  ShardPreReady = 'shardPreReady',
  ShardReady = 'shardReady',
  ShardResume = 'shardResume',
  TypingStart = 'typingStart',
  UnavailableGuildCreate = 'unavailableGuildCreate',
  Unknown = 'Unknown',
  UserUpdate = 'userUpdate',
  VoiceChannelJoin = 'voiceChannelJoin',
  VoiceChannelLeave = 'voiceChannelLeave',
  VoiceChannelSwitch = 'voiceChannelSwitch',
  VoiceStateUpdate = 'voiceStateUpdate',
  Warn = 'warn',
  WebhooksUpdate = 'webhooksUpdate'
}

export interface ClientOptions {
  eris?: Eris.ClientOptions
  owner: string | null
  eventHandler: {
    directory: string
    debug: boolean
  }
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
  reply: boolean
  bold: boolean
  color: any
  footer: boolean
  text: boolean
}

export interface Cooldown {
  expires: number
  command: number
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

export interface Message extends Eris.Message {
  guild?: Eris.Guild
  embed?(message: string, options?: any): Promise<Message>
  color?(): string
  text?(): string
  logo?(): string
  settings?(): any
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
