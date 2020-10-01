import { sep, resolve } from 'path'
import { readdir } from 'fs-extra'
import Eris, { Collection, Message } from 'eris'
import { ClientOptions } from '../typings'
import Command from '../structures/Command'
import Client from '../client'
import util from 'util'

const quartzEvents = ['missingPermission', 'commandRun', 'ratelimited']

const getPrefix = (msg: Message, _prefix: Function | string | string[]): string | string[] => {
  if (typeof _prefix === 'function') {
    if (util.types.isAsyncFunction(_prefix)) {
      return _prefix(msg)
        .then((prefix: string | string[]) => prefix || '!')
        .catch((error: Error) => {
          throw new Error(error.message)
        })
    }
    return _prefix(msg)
  } else return _prefix
}

/** EventHandler Class */
class EventHandler {
  readonly #client: Client
  directory: string
  debug: boolean
  events: Collection<any>

  /**
   * Create the eventHandler
   * @param {object} client - QuartzClient object
   * @param {object} options - eventHandler options
   */
  constructor (client: Client, options: ClientOptions['eventHandler'] = {
    directory: './commands',
    debug: false
  }) {
    this.#client = client
    this.directory = options.directory
    this.debug = options.debug
    this.events = new Collection(null)
  }

  /**
   * Get the eris client object
   * @return {object} The eris client object.
   */
  get client (): Client {
    return this.#client
  }

  /**
   * Load the events from the folder
   */
  async loadEvents (): Promise<void> {
    const files = (await readdir(this.directory))
      .filter((f: string) => f.endsWith('.js') || f.endsWith('.ts'))
    if (files.length <= 0) throw new Error(`No files found in events folder '${this.directory}'`)
    files.map(async (file: string) => {
      let Event = await import(resolve(`${this.directory}${sep}${file}`))
      if (typeof Event !== 'function') Event = Event.default
      const evt = new Event(this.client)
      if (!evt) throw new Error(`Event ${this.directory}${sep}${file} file is empty`)
      if (!evt.name) throw new Error(`Event ${this.directory}${sep}${file} is missing a name`)
      if (this.events.get(evt.name)) throw new Error(`Event ${this.directory}${sep}${file} already exists`)
      this.events.set(evt.name, evt)
      if (this.debug) this.#client.logger.info(`Loading event ${evt.name}`)
      if (quartzEvents.includes(evt.name)) this.#client.on(evt.name, evt.run.bind(this))
      else if (evt.name === 'messageCreate') return undefined
      else if (evt.name === 'ready') this.client.once(evt.name, evt.run.bind(this))
      else this.client.on(evt.name, evt.run.bind(this))
    })
  }

  /**
   * Runs event
   * @param {object} msg - The message object
   */
  async _onMessageCreate (msg: Eris.Message): Promise<void> {
    try {
      if (!msg.author || msg.author.bot) return
      const context: {
        message: Eris.Message,
        command?: Command,
        prefix?: string | string[]
        arguments?: string[]
      } = {
        message: msg
      }

      const prefix =  await getPrefix(msg, this.client._options.commandHandler.prefix)
      const content: string = msg.content.toLowerCase()
      const escapeRegex = (str: string): string => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      if (Array.isArray(prefix)) {
        if (prefix.length <= 0) msg.prefix = null
        else {
          prefix.forEach((p: string) => escapeRegex(p))
          const prefixRegex = new RegExp(`^(<@!?${this.client.user.id}>|${prefix.join('|')})\\s*`)
          const matchedPrefix = prefixRegex.test(content) && content.match(prefixRegex) ? content.match(prefixRegex)[0] : undefined
          if (matchedPrefix) context.prefix = matchedPrefix
        }
      } else if (prefix) {
        const prefixRegex = new RegExp(`^(<@!?${this.client.user.id}>|${escapeRegex(prefix.toLowerCase())})\\s*`)
        const matchedPrefix = prefixRegex.test(content) && content.match(prefixRegex) ? content.match(prefixRegex)[0] : undefined
        if (matchedPrefix) context.prefix = matchedPrefix
      }
      if (context.prefix) {
        const args: string[] = msg.content.substring(context.prefix.length).split(' ')
        context.arguments = args
        const label: string = args.shift().toLowerCase()
        const command: Command = await this.#client.commandHandler.getCommand(label)
        if (command) {
          context.command = command
          await this.#client.commandHandler.handleCommand({
            message: context.message,
            command: context.command,
            prefix: context.prefix,
            arguments: context.arguments
          })
        }
      }
      if ((this.#client._options.eventHandler.commands && msg.command) || !msg.command) {
        const event = this.events.get('messageCreate')
        return event.run.call(this, msg)
      }
    } catch (error) {
      console.log(error)
    }
  }
}

export default EventHandler
