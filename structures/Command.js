const QuartzError = require('../util/QuartzError')
const Base = require('./Base')

/** Command Class */
class Command extends Base {
  /**
   * Create the eventHandler
   * @param {object} client - Client object
   * @param {object} options - Options object
   */
  constructor (client, options = {}) {
    super(client, { module: options.module })
    const {
      name = '',
      aliases = [],
      channel = null,
      ownerOnly = false,
      guildOnly = true,
      devOnly = false,
      premium = '',
      description = '',
      cooldown = {
        expires: 5000,
        command: 2
      },
      botPermissions = this.botPermissions,
      userPermissions = this.userPermissions
    } = options

    this.name = name
    this.aliases = aliases
    this.channel = channel
    this.ownerOnly = Boolean(ownerOnly)
    this.guildOnly = Boolean(guildOnly)
    this.devOnly = Boolean(devOnly)
    this.premium = premium
    this.description = description
    this.cooldown = cooldown
    this.botPermissions = typeof botPermissions === 'function' ? botPermissions.bind(this) : botPermissions
    this.userPermissions = typeof userPermissions === 'function' ? userPermissions.bind(this) : userPermissions
    this._client = client
  }

  /**
   * Get the eris client object
   * @return {object} The eris client object.
   */
  get client () {
    return this._client
  }

  /**
   * Run when command called
   */
  run () {
    throw new QuartzError('NOT_IMPLEMENTED', this.constructor.name, 'run')
  }
}
module.exports = Command
