import LogHandler from './handlers/LogHandler'
import EventEmitter from 'eventemitter3'
import EventHandler from './handlers/EventHandler'
import CommandHandler from './handlers/CommandHandler'
import Embed from './structures/Embed'

import { options } from './QuartzTypes'

/** QuartzClient Class */
class QuartzClient extends EventEmitter {
  /**
   * Create the QuartzClient
   * @param {object} options - QuartzClient options
   * @param {object} eris - Eris options
   */
  private _client: any
  owner: string | null
  logger: any
  eventHandler: any
  commandHandler: any

  constructor (options: options, eris: any) {
    super()
    if (!options) options = { owner: null, eventHandler: null, commandHandler: null }
    this._client = eris
    this.owner = options.owner
    this.logger = new LogHandler()
    this.eventHandler = new EventHandler(this, options.eventHandler)
    this.commandHandler = new CommandHandler(this, options.commandHandler)
    this._client.embed = () => new Embed()
    this._client.commandHandler = this.commandHandler
    this._client.eventHandler = this.eventHandler
    this._client.logger = this.logger
  }

  /**
   * Get the eris client object
   * @return {object} The eris client object.
   */
  public get client () {
    return this._client
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
    this._client.on('messageCreate', this.commandHandler._onMessageCreate.bind(this.commandHandler))
  
    // Connect to discord using eris client
    return this._client.connect().catch((error: any) => {
      throw new Error(`Unable to start: ${error}`)
    }) 
  }
}
export default QuartzClient
