import Base from './Base'
import { Cooldown, CommandOptions, Argument, Description, CommandContext } from '../typings'
import { Client } from '..'

/** Command Class */
class Command extends Base {
  /**
   * Create the eventHandler
   * @param {object} client - Client object
   * @param {object} options - Options object
   */
  name: string
  aliases: string[]
  args: Argument[]
  channel: string | null
  ownerOnly: boolean
  guildOnly: boolean
  devOnly: boolean
  description: Description | string
  botPermissions: Function | string | string[]
  userPermissions: Function | string | string[]
  cooldown: Cooldown

  constructor (client: Client, options: CommandOptions = {}) {
    super(client)
    const {
      name = '',
      aliases = [],
      args = [],
      channel = null,
      ownerOnly = false,
      guildOnly = true,
      devOnly = false,
      description = '',
      cooldown = {
        expires: 5000,
        command: 3
      },
      botPermissions = this.botPermissions,
      userPermissions = this.userPermissions
    }: CommandOptions = options

    this.name = name
    this.aliases = aliases
    this.args = args
    this.channel = channel
    this.ownerOnly = Boolean(ownerOnly)
    this.guildOnly = Boolean(guildOnly)
    this.devOnly = Boolean(devOnly)
    this.description = description
    this.cooldown = cooldown
    this.botPermissions = typeof botPermissions === 'function' ? botPermissions.bind(this) : botPermissions
    this.userPermissions = typeof userPermissions === 'function' ? userPermissions.bind(this) : userPermissions
  }

  /**
   * Run when command called
   */
  run (_: CommandContext): Promise<any> | any {
    throw new Error(`${this.constructor.name}#run has not been implemented`)
  }
}

export default Command
