import { sep, resolve } from 'path'
import { readdirSync } from 'fs'
import { Collection } from 'eris'
import { options } from '../QuartzTypes'

const quartzEvents = ['missingPermission', 'commandRun', 'ratelimited']

/** EventHandler Class */
class EventHandler {
  /**
   * Create the eventHandler
   * @param {object} quartz - QuartzClient object
   * @param {object} options - eventHandler options
   */
  private _quartz: any
  directory: string
  debug: boolean
  events: any

  constructor (quartz: any, options: options['eventHandler']) {
    if (!options) options = { directory: './commands', debug: false }
    this._quartz = quartz
    this.directory = options.directory
    this.debug = options.debug
    this.events = new Collection(null)
  }

  /**
   * Get the quartz client object
   * @return {object} The quartz client object.
   */
  get quartz () {
    return this._quartz
  }

  /**
   * Get the eris client object
   * @return {object} The eris client object.
   */
  get client () {
    return this._quartz.client
  }

  /**
   * Load the events from the folder
   */
  async loadEvents () {
    const files = await readdirSync(this.directory).filter((f: string) => f.endsWith('.js') || f.endsWith('.ts'))
    if (files.length <= 0) throw new Error(`No files found in events folder '${this.directory}'`)
    await files.forEach(async (file: string) => {
      let Event = await import(resolve(`${this.directory}${sep}${file}`))
      if (typeof Event !== 'function') Event = Event.default
      const evt = new Event(this.client)
      if (!evt) throw new Error(`Event ${this.directory}${sep}${file} file is empty`)
      if (!evt.name) throw new Error(`Event ${this.directory}${sep}${file} is missing a name`)
      if (this.events.get(evt.name)) throw new Error(`Event ${this.directory}${sep}${file} already exists`)
      this.events.set(evt.name, evt)
      if (this.debug) this.quartz.logger.info(`Loading event ${evt.name}`)
      if (quartzEvents.includes(evt.name)) this.quartz.on(evt.name, evt.run.bind(this))
      else if (evt.name === 'messageCreate') this.client.on(evt.name, this._onMessageCreate.bind(this))
      else this.client.on(evt.name, evt.run.bind(this))
    })
  }

  /**
   * Runs event
   * @param {object} msg - The message object
   */
  async _onMessageCreate (msg: any) {
    if (!msg.author || msg.author.bot) return
    msg.command = false
    const prefix = await this.client.commandHandler.prefix(msg)
    const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const content = msg.content.toLowerCase()
    if (Array.isArray(prefix)) {
      prefix.forEach(p => escapeRegex(p))
      const prefixRegex = new RegExp(`^(<@!?${this.client.user.id}>|${prefix.join('|')})\\s*`)
      const matchedPrefix = prefixRegex.test(content) && content.match(prefixRegex) ? content.match(prefixRegex)[0] : undefined
      if (matchedPrefix) msg.prefix = matchedPrefix
    } else {
      const content = msg.content.toLowerCase()
      const prefixRegex = new RegExp(`^(<@!?${this.client.user.id}>|${escapeRegex(prefix.toLowerCase())})\\s*`)
      const matchedPrefix = prefixRegex.test(content) && content.match(prefixRegex) ? content.match(prefixRegex)[0] : undefined
      if (matchedPrefix) msg.prefix = matchedPrefix
    }
    msg.content = msg.content.replace(/<@!/g, '<@')
    if (msg.prefix) {
      const args = msg.content.substring(msg.prefix.length).split(' ')
      const label = args.shift().toLowerCase()
      const command = await this.client.commandHandler.getCommand(label)
      if (command) msg.command = command
    }
    const event = this.events.get('messageCreate')
    return event.run.call(this, msg)
  }
}
export default EventHandler
