import LogHandler from './handlers/LogHandler'
import EventHandler from './handlers/EventHandler'
import CommandHandler from './handlers/CommandHandler'
import Embed from './structures/Embed'
import Eris from 'eris'

import { ClientOptions } from './types'

/** QuartzClient Class */
class Client extends Eris.Client {
  /**
   * Create the QuartzClient
   * @param {object} options - QuartzClient options
   * @param {object} eris - Eris options
   */
  owner: string | null
  logger: LogHandler
  eventHandler: EventHandler
  commandHandler: CommandHandler
  extensions: any
  [name: string]: any
  embed: () => Embed

  constructor (token: string, options: ClientOptions, extensions: any) {
    if (!token && !process.env.DISCORD_TOKEN) throw new TypeError('Discord Token required!')
    super(token || process.env.DISCORD_TOKEN, options.eris)
    if (!options) options = { owner: null, eventHandler: null, commandHandler: null }
    this.owner = options.owner
    this.logger = new LogHandler()
    this.eventHandler = new EventHandler(this, options.eventHandler)
    this.commandHandler = new CommandHandler(this, options.commandHandler)
    this.embed = () => new Embed()
    this.commandHandler = this.commandHandler
    this.eventHandler = this.eventHandler
    this.logger = this.logger
    this.extensions = extensions || {}
  }

  /**
   * Start the bot
   */
  public async start () {
    // Load events using eventHandler
    await this.eventHandler.loadEvents()
    // Load commands using commandHandler
    await this.commandHandler.loadCommands()

    // Bind messageCreate to commandHandler
    this.on('messageCreate', this.commandHandler._onMessageCreate.bind(this.commandHandler))
  
    // Connect to discord using eris client
    return this.connect().catch((error: any) => {
      throw new Error(`Unable to start: ${error}`)
    }) 
  }
}
export default Client
