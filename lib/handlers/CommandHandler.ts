import Embed from '../structures/Embed'
import { readdirSync, statSync } from 'fs'
import { join, sep, resolve } from 'path'
import { Collection } from 'eris'

import { options, quickEmbed } from '../QuartzTypes'

const types = ['user', 'string', 'channel', 'role', 'message', 'integer', 'float']

/** CommandHandler Class */
class CommandHandler {
  /**
   * Create the commandHandler
   * @param {object} quartz - QuartzClient object
   * @param {object} options - commandHandler options
   */
  private _quartz: any
  private _prefix: any
  private _settings: any
  private _text: any
  private _logo: any
  private _color : any
  directory: string
  debug: boolean
  defaultCooldown: number
  commands: any
  modules: any
  aliases: any
  cooldowns: any

  constructor (quartz: any, options: options['commandHandler']) {
    if (!options) options = { directory: './commands', prefix: '!', debug: false, defaultCooldown: 1000, settings: null, text: 'Quartz', logo: '', color: 0xFFFFFF }
    this._quartz = quartz
    this.directory = options.directory || './commands'
    this.debug = options.debug || false
    this._prefix = options.prefix || '!'
    this.defaultCooldown = options.defaultCooldown || 10000
    this.commands = new Collection(null)
    this.modules = new Collection(null)
    this.aliases = new Collection(null)
    this.cooldowns = new Collection(null)
    this._settings = options.settings || undefined
    this._text = options.text || 'Quartz'
    this._logo = options.logo || ''
    this._color = options.color || 0xFFFFFF
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
   * Get command by name
   * @param {string} commandName - The command name.
   * @return {object} The commands object 
   */
  getCommand (commandName: string) {
    if (!commandName) return undefined
    let cmd = this.commands.get(commandName)
    if (!cmd) {
      const alias = this.aliases.get(commandName)
      if (!alias) return null
      cmd = this.commands.get(alias)
    }
    return cmd
  }

  /**
   * Get the commands from module
   * @param {string} module - The module folder.
   * @return {array} The commands in module.
   */
  async getCommands (module: string) {
    const files = await readdirSync(`${this.directory}${sep}${module}`).filter(f => f.endsWith('.js'))
    if (files.length <= 0) throw new Error(`No files found in commands folder '${this.directory}'`)
    return files.map(file => {
      const commandName = file.replace(/\.[^/.]+$/, '')
      return this.getCommand(commandName)
    })
  }

  /**
   * Get the modules from the command folder
   * @return {array} The modules in the command folder
   */
  async loadModules () {
    const rd = await readdirSync(this.directory).filter(f => statSync(join(this.directory, f)).isDirectory())
    return rd
  }

  /**
   * Load the commands from the folder
   */
  async loadCommands () {
    const modules = await this.loadModules()
    if (modules.length <= 0) throw new Error(`No category folders found in ${this.directory}`)
    await modules.forEach(async module => {
      const files = await readdirSync(`${this.directory}${sep}${module}`).filter(f => f.endsWith('.js'))
      if (files.length <= 0) throw new Error(`No files found in commands folder ${this.directory}${sep}${module}`)
      await files.forEach(async file => {
        const Command = require(resolve(`${this.directory}${sep}${module}${sep}${file}`))
        const cmd = new Command(this.client)
        if (!cmd.name) throw new Error(`Command ${this.directory}${sep}${module}${sep}${file} is missing a name`)
        if (this.commands.get(cmd.name.toLowerCase())) throw new Error(`Command ${cmd.name} already exists`)
        await cmd.aliases.forEach((alias: string) => {
          if (this.aliases.get(alias)) throw new Error(`Alias '${alias}' of '${cmd.name}' already exists`)
        })
        this.commands.set(cmd.name.toLowerCase(), cmd)
        this.modules.set(cmd.name, module)
        if (this.debug) this.quartz.logger.info(`Loading command ${cmd.name} from ${module}`)
        if (cmd.aliases && cmd.aliases.length > 0) await cmd.aliases.forEach((alias: string) => this.aliases.set(alias, cmd.name))
      })
    })
  }

  /**
   * Get server settings
   * @param {object} msg - The message object
   * @return {object} The settings object 
   */
  settings (msg: any) {
    if (typeof this._settings !== 'function') return this._settings
    else return this._settings(msg)
  }

  /**
   * Get footer text
   * @param {object} msg - The message object
   * @return {string} The footer text 
   */
  text (msg: any) {
    if (typeof this._text !== 'function') return this._text
    else return this._text(msg)
  }

  /**
   * Get footer logo
   * @param {object} msg - The message object
   * @return {string} The footer logo 
   */
  logo (msg: any) {
    if (typeof this._logo !== 'function') return this._logo
    else return this._logo(msg)
  }

  /**
   * Get footer color
   * @param {object} msg - The message object
   * @return {string} The footer color 
   */
  color (msg: any) {
    if (typeof this._color !== 'function') return this._color
    else return this._color(msg)
  }

  /**
   * Get prefix
   * @param {object} msg - The message object
   * @return {string} The prefix
   */
  prefix (msg: any) {
    if (typeof this._prefix !== 'function') return this._prefix
    else return this._prefix(msg)
  }

  /**
   * Return a embed
   * @param {string} message - The embed content
   * @param {object} options - The embed options
   * @return {object} The embed
   */
  async embed (msg: any, message: string, options: quickEmbed) {
    const generateEmbed = new Embed()
    if (!options) options = { reply: false, bold: false, color: null, footer: false }
    if (options.reply && !options.bold) generateEmbed.setDescription(`<@${msg.author.id}>, ${message}`)
    else if (options.bold && !options.reply) generateEmbed.setDescription(`**${message}**`)
    else if (options.bold && options.reply) generateEmbed.setDescription(`**<@${msg.author.id}>, ${message}**`)
    else generateEmbed.setDescription(message)
    if (options.color) generateEmbed.setColor(options.color)
    else generateEmbed.setColor(+await msg.color())
    if (options.footer) generateEmbed.setFooter(await msg.text(), await msg.logo())
    return msg.channel.createMessage({ embed: generateEmbed })
  }

  /**
   * Runs commands
   * @param {object} msg - The message object
   */
  async _onMessageCreate (msg: any) {
    if (!msg.author || msg.author.bot || !msg.channel.guild) return
    const prefix = await this.prefix(msg)
    const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const content = msg.content.toLowerCase()
    if (Array.isArray(prefix)) {
      prefix.forEach(p => escapeRegex(p))
      const prefixRegex = new RegExp(`^(<@!?${this.client.user.id}>|${prefix.join('|')})\\s*`)
      if (!prefixRegex.test(content)) return undefined
      const matchedPrefix = content.match(prefixRegex) ? content.match(prefixRegex)[0] : undefined
      if (!matchedPrefix) return undefined
      msg.prefix = matchedPrefix
    } else {
      const prefixRegex = new RegExp(`^(<@!?${this.client.user.id}>|${escapeRegex(prefix.toLowerCase())})\\s*`)
      if (!prefixRegex.test(content)) return
      const matchedPrefix = content.match(prefixRegex) ? content.match(prefixRegex)[0] : undefined
      if (!matchedPrefix) return
      msg.prefix = matchedPrefix
    }
    if (!msg.prefix) return
    msg.content = msg.content.replace(/<@!/g, '<@')
    const args = msg.content.slice(msg.prefix.length).trim().split(/ +/)
    const label = args.shift().toLowerCase()
    const command = this.getCommand(label)
    if (!command) return
    msg.command = command
    msg.color = this.color.bind(this, msg)
    msg.logo = this.logo.bind(this, msg)
    msg.text = this.text.bind(this, msg)
    msg.embed = this.embed.bind(this, msg)
    msg.settings = this.settings.bind(this, msg)
    let parsedArgs: any = null
    if (command.args && command.args.length > 0) {
      parsedArgs = {}
      let text = args.join(' ')
      let quoted = text.match(/“(?:\.|(\\\“)|[^\“”\n])*”|(?:[^\s"]+|"[^"]*")/g)
      if (quoted && quoted.length > 0) {
        quoted = quoted.map((q: string) => {
          if (q.startsWith('"') && q.endsWith('"') || q.startsWith('“') && q.endsWith('”')) return q.slice(1, -1)
          else return q
        })
      }
      let num = 0
      for (const a in command.args) {
        num++
        if (command.args[a].key && command.args[a].type && types.includes(command.args[a].type)) { 
          const CustomType = require(`../types/${command.args[a].type}`).default
          const type = new CustomType(this.client)
          const def = command.args[a].default || undefined
          let result = null
          if (num === command.args.length) {
            quoted.splice(0, command.args.length - 1)
            result = type.parse(quoted.join(' ') || def, msg)
          } else result = type.parse(quoted[a] || def, msg)
          if (!result && command.args[a].prompt) return msg.embed(command.args[a].prompt)
          parsedArgs[command.args[a].key] = result || undefined
        }
      }
    }
    const botPermissions = msg.channel.permissionsOf(this.client.user.id)
    if (!botPermissions.has('sendMessages') || !botPermissions.has('embedLinks')) return
    if (command.botPermissions) {
      if (typeof command.botPermissions === 'function') {
        const missing = await command.botPermissions(msg)
        if (missing != null) {
          this.quartz.emit('missingPermission', msg, command, missing)
          return
        }
      } else if (msg.channel.guild) {
        if (command.botPermissions instanceof Array) {
          for (const p of command.botPermissions) {
            if (!botPermissions.has(p)) return msg.embed(`**Missing Permissions:** The bot needs the \`${p}\` permission to run the \`${command.name}\` command.`)
          }
        } else {
          if (!botPermissions.has(command.botPermissions)) {
            this.quartz.emit('missingPermission', msg, command, command.botPermissions)
            return
          }
        }
      }
    }
    if (command.cooldown && command.cooldown.expires && command.cooldown.command) {
      const checkCooldown = this.cooldowns.get(msg.author.id)
      if (checkCooldown && checkCooldown.expires) {
        if (new Date(checkCooldown.expires) < new Date()) {
          this.cooldowns.delete(msg.author.id)
          this.cooldowns.set(msg.author.id, { expires: Date.now() + command.cooldown.expires, notified: false, command: 1 })
        } else if (!checkCooldown.notified && checkCooldown.command >= msg.command.cooldown.command) {
          checkCooldown.notified = true
          this.cooldowns.set(msg.author.id, checkCooldown)
          return this.quartz.emit('ratelimited', msg, command, true, checkCooldown.expires)
        } else if (checkCooldown.notified && checkCooldown.command >= command.cooldown.command) {
          return this.quartz.emit('ratelimited', msg, command, false, checkCooldown.expires)
        } else {
          this.cooldowns.set(msg.author.id, { expires: Date.now() + msg.command.cooldown.expires, notified: false, command: ++checkCooldown.command })
        }
      } else {
        this.cooldowns.set(msg.author.id, { expires: Date.now() + msg.command.cooldown.expires, notified: false, command: 1 })
      }
    }
    if (command.guildOnly && !msg.channel.guild) return
    if (msg.channel.guild) msg.guild = msg.channel.guild
    if (command.ownerOnly && msg.author.id !== this.quartz.owner) return
    if (process.env.NODE_ENV !== 'development' && command.devOnly && msg.author.id !== this.quartz.owner) return this.client.embeds.embed(msg, `<@${msg.author.id}>, **Currently Unavailable:** The bot is currently unavailable.`)
    if (command.userPermissions) {
      if (typeof command.userPermissions === 'function') {
        const missing = await command.userPermissions(msg)
        if (missing != null) {
          this.quartz.emit('missingPermission', msg, command, missing)
          return
        }
      } else if (msg.channel.guild) {
        const perm = msg.member.permission.has(command.userPermissions)
        if (!perm) {
          this.quartz.emit('missingPermission', msg, command, command.userPermissions)
          return
        }
      }
    }
    await command.run(msg, parsedArgs || args)
      .then(() => {
        return this.quartz.emit('commandRun', msg, command)
      })
      .catch((error: any) => {
        return this.quartz.logger.error(error)
      })
  }
}
export default CommandHandler
