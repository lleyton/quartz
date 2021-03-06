const QuartzError = require('../util/QuartzError')
const Embed = require('../structures/Embed')
const { readdirSync, statSync } = require('fs')
const { join, sep, resolve } = require('path')
const { Collection } = require('eris')

/** CommandHandler Class */
class CommandHandler {
  /**
   * Create the commandHandler
   * @param {object} quartz - QuartzClient object
   * @param {object} options - commandHandler options
   */
  constructor (quartz, options = {}) {
    this._quartz = quartz
    this.directory = options.directory || './commands'
    this.debug = options.debug || false
    this._prefix = options.prefix || '!'
    this.defaultCooldown = options.defaultCooldown || 10000
    this.commands = new Collection()
    this.modules = new Collection()
    this.aliases = new Collection()
    this.cooldowns = new Collection()
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
   * Get the commands from module
   * @param {string} module - The module folder.
   * @return {array} The commands in module.
   */
  async getCommands (module) {
    const files = await readdirSync(`${this.directory}${sep}${module}`).filter(f => f.endsWith('.js'))
    if (files.length <= 0) throw new QuartzError('NO_FILES_IN_FOLDER', `${this.directory}${sep}${module}`)
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
    if (modules.length <= 0) throw new QuartzError('FOLDER_NOT_FOUND', this.directory)
    await modules.forEach(async module => {
      const files = await readdirSync(`${this.directory}${sep}${module}`).filter(f => f.endsWith('.js'))
      if (files.length <= 0) throw new QuartzError('NO_FILES_IN_FOLDER', `${this.directory}${sep}${module}`)
      await files.forEach(async file => {
        const Command = require(resolve(`${this.directory}${sep}${module}${sep}${file}`))
        const cmd = new Command(this.client)
        if (!cmd.name) throw new QuartzError('CMD_MISSING_NAME', `${this.directory}${sep}${module}${sep}${file}`)
        if (this.commands.get(cmd.name.toLowerCase())) throw new QuartzError('CMD_ALREADY_EXISTS', cmd.name)
        await cmd.aliases.forEach(alias => {
          if (this.aliases.get(alias)) throw new QuartzError('ALIAS_CONFLICT', alias, cmd.name)
        })
        this.commands.set(cmd.name.toLowerCase(), cmd)
        this.modules.set(cmd.name, module)
        if (this.debug) this.quartz.logger.info(`Loading command ${cmd.name} from ${module}`)
        if (cmd.aliases && cmd.aliases.length > 0) await cmd.aliases.forEach(alias => this.aliases.set(alias, cmd.name))
      })
    })
  }

  /**
   * Reload command
   * @param {string} commandName - The command name.
   */
  async reloadCommand (commandName) {
    const cmd = this.commands.get(commandName.toLowerCase())
    if (!cmd) return undefined
    const module = this.modules.get(commandName)
    delete require.cache[require.resolve(`${this.directory}${sep}${module}${sep}${commandName}.js`)]
    cmd.aliases.forEach(alias => this.aliases.delete(alias))
    this.modules.delete(commandName)
    this.commands.delete(commandName.toLowerCase())
    const Command = require(resolve(`${this.directory}${sep}${module}${sep}${commandName}`))
    const newCmd = new Command(this.client)
    if (!newCmd) throw new QuartzError('CMD_FILE_EMPTY', `${this.directory}${sep}${module}${sep}${commandName}`)
    if (!newCmd.name) throw new QuartzError('CMD_MISSING_NAME', `${this.directory}${sep}${module}${sep}${commandName}`)
    if (this.commands.get(cmd.name.toLowerCase())) throw new QuartzError('CMD_ALREADY_EXISTS', cmd.name)
    await cmd.aliases.forEach(alias => {
      if (this.aliases.get(alias)) throw new QuartzError('ALIAS_CONFLICT', alias, cmd.name)
    })
    this.commands.set(cmd.name.toLowerCase(), cmd)
    this.modules.set(cmd.name, module)
    if (this.debug) this.quartz.logger.info(`Loading command ${cmd.name} from ${module}`)
    if (cmd.aliases && cmd.aliases.length > 0) await cmd.aliases.forEach(alias => this.aliases.set(alias, cmd.name))
  }

  /**
   * Get command by name
   * @param {string} commandName - The command name.
   * @return {object} The commands object 
   */
  getCommand (commandName) {
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
   * Get server settings
   * @param {object} msg - The message object
   * @return {object} The settings object 
   */
  async settings (msg) {
    if (typeof this._settings !== 'function') return this._settings
    else return this._settings(msg)
  }

  /**
   * Get footer text
   * @param {object} msg - The message object
   * @return {string} The footer text 
   */
  async text (msg) {
    if (typeof this._text !== 'function') return this._text
    else return this._text(msg)
  }

  /**
   * Get footer logo
   * @param {object} msg - The message object
   * @return {string} The footer logo 
   */
  async logo (msg) {
    if (typeof this._logo !== 'function') return this._logo
    else return this._logo(msg)
  }

  /**
   * Get footer color
   * @param {object} msg - The message object
   * @return {string} The footer color 
   */
  async color (msg) {
    if (typeof this._color !== 'function') return this._color
    else return this._color(msg)
  }

  /**
   * Get prefix
   * @param {object} msg - The message object
   * @return {string} The prefix
   */
  async prefix (msg) {
    if (typeof this._prefix !== 'function') return this._prefix
    else return this._prefix(msg)
  }

  /**
   * Return a embed
   * @param {object} message - The message object
   * @param {object} options - The embed options
   * @return {object} The embed
   */
  async embed (message, options = {}) {
    const embed = new Embed()
    if (options.reply && !options.bold) embed.description(`<@${this.author.id}>, ${message}`)
    else if (options.bold && !options.reply) embed.description(`**${message}**`)
    else if (options.bold && options.reply) embed.description(`**<@${this.author.id}>, ${message}**`)
    else embed.description(message)
    if (options.premium) embed.color(this.client.config.embed.premium.color)
    else if (options.color) embed.color(options.color)
    else embed.color(+await this.color())
    if (options.footer) embed.footer(await this.text(), await this.logo())
    return this.channel.createMessage({ embed: embed })
  }

  /**
   * Runs commands
   * @param {object} message - The message object
   */
  async _onMessageCreate (msg) {
    if (!msg.author || msg.author.bot || !msg.channel.guild) return
    const prefix = await this.prefix(msg)
    const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
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
    const command = await this.getCommand(label)
    if (!command) return
    msg.command = command
    msg.embed = this.embed.bind(msg)
    msg.settings = this.settings.bind(this, msg)
    msg.color = this.color.bind(this, msg)
    msg.logo = this.logo.bind(this, msg)
    msg.text = this.text.bind(this, msg)
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
        if (new Date(checkCooldown.expires) < Date.now()) {
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
    await command.run(msg, args)
      .then(() => {
        this.quartz.emit('commandRun', msg, command)
      })
      .catch(error => {
        this.quartz.logger.error(error)
      })
  }
}
module.exports = CommandHandler
