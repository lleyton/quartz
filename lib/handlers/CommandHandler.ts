import { readdirSync, statSync } from 'fs'
import { join, sep, resolve } from 'path'
import Eris, { Collection } from 'eris'
import ArgumentHandler from './ArgumentHandler'
import { ClientOptions, Message as MessageTyping } from '../typings'
import Command from '../structures/Command'
import { Client } from '..'
import Message from '../structures/Message'
/** CommandHandler Class */
class CommandHandler {
  private readonly _client: Client
  directory: string
  debug: boolean
  defaultCooldown: number
  commands: Collection<any>
  modules: Collection<any>
  aliases: Collection<any>
  cooldowns: Collection<any>

  /**
   * Create the commandHandler
   * @param {object} client - QuartzClient object
   * @param {object} options - commandHandler options
   */
  constructor (client: Client, options: ClientOptions['commandHandler']) {
    if (!options) options = { directory: './commands', prefix: '!', debug: false, defaultCooldown: 1000, settings: null, text: 'Quartz', logo: '', color: 0xFFFFFF }
    this._client = client
    this.directory = options.directory || './commands'
    this.debug = options.debug || false
    this.defaultCooldown = options.defaultCooldown || 10000
    this.commands = new Collection(undefined)
    this.modules = new Collection(undefined)
    this.aliases = new Collection(undefined)
    this.cooldowns = new Collection(undefined)
  }

  /**
   * Get the eris client object
   * @return {object} The eris client object.
   */
  get client (): Client {
    return this._client
  }

  /**
   * Get command by name
   * @param {string} commandName - The command name.
   * @return {object} The commands object
   */
  getCommand (commandName: string): Command {
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
  async getCommands (module: string): Promise<Command[]> {
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
  loadModules (): string[] {
    return readdirSync(this.directory).filter(f => statSync(join(this.directory, f)).isDirectory())
  }

  /**
   * Load the commands from the folder
   */
  async loadCommands (): Promise<void> {
    try {
      const modules = this.loadModules()
      if (modules.length <= 0) throw new Error(`No category folders found in ${this.directory}`)
      await modules.forEach(async (module) => {
        const files = await readdirSync(`${this.directory}${sep}${module}`).filter(f => f.endsWith('.js') || f.endsWith('.ts'))
        if (files.length <= 0) throw new Error(`No files found in commands folder ${this.directory}${sep}${module}`)
        await files.forEach(async file => {
          let Command = await import(resolve(`${this.directory}${sep}${module}${sep}${file}`))
          if (typeof Command !== 'function') Command = Command.default
          const cmd = new Command(this.client)
          if (!cmd || !cmd.name) throw new Error(`Command ${this.directory}${sep}${module}${sep}${file} is missing a name`)
          if (this.commands.get(cmd.name.toLowerCase())) throw new Error(`Command ${cmd.name} already exists`)
          await cmd.aliases.forEach((alias: string) => {
            if (this.aliases.get(alias)) throw new Error(`Alias '${alias}' of '${cmd.name}' already exists`)
          })
          this.commands.set(cmd.name.toLowerCase(), cmd)
          this.modules.set(cmd.name, module)
          if (this.debug) this._client.logger.info(`Loading command ${cmd.name} from ${module}`)
          if (cmd.aliases && cmd.aliases.length > 0) await cmd.aliases.forEach((alias: string) => this.aliases.set(alias, cmd.name))
        })
      })
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   * Runs commands
   * @param {object} msg - The message object
   */
  async _onMessageCreate (_msg: Eris.Message): Promise<void|any> {
    try {
      if (!_msg.author || _msg.author.bot || !_msg.member?.guild) return
      const msg: MessageTyping = new Message(_msg, this.client) as unknown as MessageTyping
      await msg._configure()
      const content = msg.content.toLowerCase()
      if (Array.isArray(msg?.prefix)) {
        if (msg.prefix.length <= 0) msg.prefix = null
        else {
          const prefixRegex = new RegExp(`^(<@!?${this.client.user.id}>|${msg?.prefix?.join('|') || '!'})\\s*`)
          if (!prefixRegex.test(content)) return undefined
          const matchedPrefix = content.match(prefixRegex) ? content.match(prefixRegex)[0] : undefined
          if (!matchedPrefix) return undefined
          msg.prefix = matchedPrefix
        }
      } else if (msg.prefix) {
        const prefixRegex = new RegExp(`^(<@!?${this.client.user.id}>|${msg?.prefix?.toLowerCase() || '!'})\\s*`)
        if (!prefixRegex.test(content)) return
        const matchedPrefix = content.match(prefixRegex) ? content.match(prefixRegex)[0] : undefined
        if (!matchedPrefix) return
        msg.prefix = matchedPrefix
      }
      if (!msg.prefix) return
      const args = msg?.cleanContent?.slice(msg.prefix.length).trim().split(/ +/) || msg?.content?.slice(msg.prefix.length).trim().split(/ +/)
      const label = args.shift().toLowerCase()
      const command = this.getCommand(label)
      if (!command) return
      // @ts-ignore
      msg.command = command
      const argumentHandler = new ArgumentHandler(this.client, command, args)
      const parsedArgs = await argumentHandler.parse(msg)
      if (!parsedArgs) return
      // @ts-ignore
      const channelPermissions: Eris.Permission = msg.channel.permissionsOf(this.client.user.id)
      if (!channelPermissions.has('sendMessages') || !channelPermissions.has('embedLinks')) return
      if (command.botPermissions) {
        if (typeof command.botPermissions === 'function') {
          const missing = await command.botPermissions(msg)
          if (missing != null) return this._client.emit('missingPermission', msg, command, missing)
        } else if (msg.member?.guild) {
          const botPermissions = msg.member?.guild.members.get(this.client.user.id).permission
          if (command.botPermissions instanceof Array) {
            for (const p of command.botPermissions) {
              if (!botPermissions.has(p)) return this._client.emit('missingPermission', msg, command, p)
            }
          } else {
            if (!botPermissions.has(command.botPermissions)) return this._client.emit('missingPermission', msg, command, command.botPermissions)
          }
        }
      }
      if (command.cooldown && command.cooldown.expires && command.cooldown.command && msg.author.id !== this._client.owner) {
        const checkCooldown = this.cooldowns.get(msg.author.id)
        if (checkCooldown?.expires) {
          if (new Date(checkCooldown.expires) < new Date()) {
            this.cooldowns.delete(msg.author.id)
            this.cooldowns.set(msg.author.id, { expires: Date.now() + command.cooldown.expires, notified: false, command: 1 })
          } else if (!checkCooldown.notified && checkCooldown.command >= command.cooldown.command) {
            checkCooldown.notified = true
            this.cooldowns.set(msg.author.id, checkCooldown)
            return this._client.emit('ratelimited', msg, command, true, checkCooldown.expires)
          } else if (checkCooldown.notified && checkCooldown.command >= command.cooldown.command) {
            return this._client.emit('ratelimited', msg, command, false, checkCooldown.expires)
          } else {
            this.cooldowns.set(msg.author.id, { expires: Date.now() + Number(command.cooldown.expires), notified: false, command: ++checkCooldown.command })
          }
        } else {
          this.cooldowns.set(msg.author.id, { expires: Date.now() + Number(command.cooldown.expires), notified: false, command: 1 })
        }
      }
      if (command.guildOnly && !msg.member?.guild) return
      if (msg.member?.guild) msg.guild = msg.member?.guild
      if (command.ownerOnly && msg.author.id !== this._client.owner) return
      if (process.env.NODE_ENV !== 'development' && command.devOnly && msg.author.id !== this._client.owner) return this.client.embeds.embed(msg, `<@${msg.author.id}>, **Currently Unavailable:** The bot is currently unavailable.`)
      if (command.userPermissions) {
        if (typeof command.userPermissions === 'function') {
          const missing = await command.userPermissions(msg)
          if (missing != null) {
            this._client.emit('missingPermission', msg, command, missing)
            return
          }
        } else if (msg.member?.guild) {
          if (Array.isArray(command.userPermissions)) {
            command.userPermissions.forEach((userPermission) => {
              const permission = msg.member.permission.has(userPermission)
              if (!permission) return this._client.emit('missingPermission', msg, command, userPermission)
            })
          } else {
            const permission = msg.member.permission.has(command.userPermissions)
            if (!permission) return this._client.emit('missingPermission', msg, command, command.userPermissions)
          }
        }
      }
      // @ts-ignore
      await command.run(msg, parsedArgs || args)
        .then(() => {
          return this._client.emit('commandRun', msg, command)
        })
        .catch((error: any) => {
          return this._client.logger.error(error)
        })
    } catch (error) {

    }
  }
}
export default CommandHandler
