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
  _options: ClientOptions
  owner: string | null
  logger: LogHandler
  eventHandler: EventHandler
  commandHandler: CommandHandler
  extensions: any
  [name: string]: any
  embed: () => Embed

  constructor (token: string | undefined = process.env.DISCORD_TOKEN, options: ClientOptions = {
    owner: null, eventHandler: null, commandHandler: null
  }, extensions: any = {}) {
    if (token === '') throw new TypeError('Discord Token required!')
    super(token, options.eris)
    this._options = options
    this.owner = options.owner
    this.logger = new LogHandler()
    this.eventHandler = new EventHandler(this, options.eventHandler)
    this.commandHandler = new CommandHandler(this, options.commandHandler)
    this.embed = () => new Embed()
    this.extensions = extensions
  }

  /**
   * Start the bot
   */
  public async start (): Promise<void> {
    // Load events using eventHandler
    await this.eventHandler.loadEvents()
    // Load commands using commandHandler
    await this.commandHandler.loadCommands()

    // Bind messageCreate to commandHandler
    this.on('messageCreate', this.commandHandler._onMessageCreate.bind(this.commandHandler))

    // Connect to discord using eris client
    return await this.connect().catch((error: Error) => {
      throw new Error(`Unable to start: ${error.message}`)
    })
  }
}

export default Client
