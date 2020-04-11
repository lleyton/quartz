import Eris from 'eris'
import { Client, Embed } from '..'
import { EmbedOptions } from '../types'
import util from 'util'

const prefix = (msg: Eris.Message, _prefix: Function | string): string => {
  if (typeof _prefix !== 'function') return _prefix
  else return _prefix(msg)
}

const color = (msg: Eris.Message, _color: Function | string): string => {
  if (typeof _color !== 'function') return _color
  else return _color(msg)
}

const text = (msg: Eris.Message, _text: Function | string): string => {
  if (typeof _text !== 'function') return _text
  else return _text(msg)
}

const logo = (msg: Eris.Message, _logo: Function | string): string => {
  if (typeof _logo !== 'function') return _logo
  else return _logo(msg)
}

class Message extends Eris.Message {
  private readonly _prefix: Function | string
  private readonly _settings: Function | any
  private readonly _text: Function | string
  private readonly _logo: Function | string
  private readonly _color: Function | string

  readonly client: Client
  readonly color?: string
  readonly text?: string
  readonly logo?: string

  guild?: Eris.Guild

  constructor (msg: Eris.Message, client: Client) {
    super({
      id: msg.id
    }, client)
    const _prefix = prefix(msg, this._prefix)
    this.client = client
    this.guild = msg.member?.guild || null
    this.prefix = _prefix
    this.color = color(msg, this._color)
    this.text = text(msg, this._text)
    this.logo = logo(msg, this._logo)
    this.content = msg.content.replace(/<@!/g, '<@')
  }

  /**
   * Return a embed
   * @param {string} message - The embed content
   * @param {object} options - The embed options
   * @return {object} The embed
   */
  async embed (message: string, options?: EmbedOptions): Promise<Message> {
    return await new Promise((resolve, reject) => {
      const generateEmbed = new Embed()
      if (!options) options = { reply: false, bold: false, color: null, footer: false, text: false }
      if (options.reply && !options.bold) message = `<@${this.author.id}>, ${message}`
      else if (options.bold && !options.reply) message = `**${message}**`
      else if (options.bold && options.reply) message = `**<@${this.author.id}>, ${message}**`
      if (options.text) {
        this.channel.createMessage(message)
          .then((erisMsg) => resolve(new Message(erisMsg, this.client)))
          .catch((error) => reject(error))
        return
      }
      generateEmbed.setDescription(message)
      if (options.color) generateEmbed.setColor(options.color)
      else generateEmbed.setColor(this.color)
      if (options.footer) generateEmbed.setFooter(this.text, this.logo)
      this.channel.createMessage({ embed: generateEmbed })
        .then((erisMsg) => resolve((new Message(erisMsg, this.client))))
        .catch((error) => reject(error))
    })
  }

  /**
   * Get server settings
   * @param {object} msg - The message object
   * @return {object} The settings object
   */
  settings (msg: Eris.Message): any {
    if (typeof this._settings !== 'function') {
      if (util.types.isAsyncFunction(this._settings)) {
        return this._settings
          .then((settings: any) => settings)
          .catch((error: Error) => {
            throw new Error(error.message)
          })
      }
      return this._settings
    } else return this._settings(msg)
  }
}

export default Message
