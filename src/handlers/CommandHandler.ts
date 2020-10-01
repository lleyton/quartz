import { readdir, stat } from 'fs-extra'
import { join, sep, resolve } from 'path'
import { Permission }  from 'eris'
import ArgumentHandler from './ArgumentHandler'
import { ClientOptions, CommandContext } from '../typings'
import Command from '../structures/Command'
import { Client } from '..'
import PermissionHandler from './PermissionHandler'
import CooldownHandler from './CooldownHandler'

/** CommandHandler Class */
class CommandHandler {
  readonly #client: Client
  readonly #permissionHandler: PermissionHandler
  readonly #cooldownHandler: CooldownHandler
  directory: string
  debug: boolean
  defaultCooldown: number
  commands: Map<string, Command>
  modules: Map<string, string>
  aliases: Map<string, string>

  /**
   * Create the commandHandler
   * @param {object} client - QuartzClient object
   * @param {object} options - commandHandler options
   */
  constructor (client: Client, options: ClientOptions['commandHandler']) {
    if (!options) {
      options = {
        directory: './commands',
        prefix: '!',
        debug: false,
        defaultCooldown: 1000
      }
    }
    this.#client = client
    this.directory = options.directory || './commands'
    this.debug = options.debug || false
    this.defaultCooldown = options.defaultCooldown || 10000
    this.commands = new Map()
    this.modules = new Map()
    this.aliases = new Map()
    this.#permissionHandler = new PermissionHandler(client)
    this.#cooldownHandler = new CooldownHandler(client)
  }

  /**
   * Get the eris client object
   * @return {object} The eris client object.
   */
  get client (): Client {
    return this.#client
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
    const files = (await readdir(`${this.directory}${sep}${module}`)).filter(f => f.endsWith('.js') || f.endsWith('.ts'))
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
  async loadModules (): Promise<string[]> {
    return (await readdir(this.directory)).filter(async f => (await stat(join(this.directory, f))).isDirectory())
  }

  /**
   * Load the commands from the folder
   */
  async loadCommands (): Promise<void> {
    try {
      const modules = await this.loadModules()
      if (modules.length <= 0) throw new Error(`No category folders found in ${this.directory}`)
      await modules.map(async (module) => {
        const files = (await readdir(`${this.directory}${sep}${module}`)).filter(f => f.endsWith('.js') || f.endsWith('.ts'))
        if (files.length <= 0) throw new Error(`No files found in commands folder ${this.directory}${sep}${module}`)
        await files.map(async file => {
          let Command = await import(resolve(`${this.directory}${sep}${module}${sep}${file}`))
          if (typeof Command !== 'function') Command = Command.default
          const cmd: Command = new Command(this.client)
          if (!cmd || !cmd.name) throw new Error(`Command ${this.directory}${sep}${module}${sep}${file} is missing a name`)
          if (this.commands.get(cmd.name.toLowerCase())) throw new Error(`Command ${cmd.name} already exists`)
          await cmd.aliases.forEach((alias: string) => {
            if (this.aliases.get(alias)) throw new Error(`Alias '${alias}' of '${cmd.name}' already exists`)
          })
          this.commands.set(cmd.name.toLowerCase(), cmd)
          this.modules.set(cmd.name, module)
          if (this.debug) this.#client.logger.info(`Loading command ${cmd.name} from ${module}`)
          if (cmd.aliases && cmd.aliases.length > 0) await cmd.aliases.map((alias: string) => this.aliases.set(alias, cmd.name))
        })
      })
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   * Runs commands
   * @param {object} context - The message object
   */
  async handleCommand (context: CommandContext): Promise<void|any> {
    try {
      if (
        (context.command.ownerOnly && context.message.author.id !== this.#client.owner) ||
        (context.message.channel.type !== 0 && context.message.channel.type !== 1) ||
        (context.command.guildOnly && context.message.channel.type !== 0)
      ) return
      if (process.env.NODE_ENV !== 'development' && context.command.devOnly && context.message.author.id !== this.#client.owner) return context.message.channel.createMessage(`<@${context.message.author.id}>, **Currently Unavailable:** The bot is currently unavailable.`)
      if (context.message.channel.type === 0) {
        const channelPermissions: Permission = context.message.channel.permissionsOf(this.client.user.id)
        if (!channelPermissions.has('sendMessages')) return
        if (!channelPermissions.has('embedLinks')) return await context.message.channel.createMessage(`${context.message.author.mention}, \`Embed Links\` is required for the bot to work!`)
        if (!await this.#permissionHandler.bot(context.message, context.command, channelPermissions)) return
        if (!await this.#permissionHandler.user(context.message, context.command)) return
      }
      if (context.command.cooldown && context.command.cooldown.expires && context.command.cooldown.command && context.message.author.id !== this.#client.owner) this.#cooldownHandler.check(context.message, context.command)
      const argumentHandler = new ArgumentHandler(this.client, context.command, context.arguments)
      const parsedArgs = await argumentHandler.parse(context.message)
      if (!parsedArgs) return
      await context.command.run(context)
      if (this.debug) return this.#client.emit('commandRun', context)
      return
    } catch (error) {
      return this.#client.logger.error(error)
    }
  }
}
export default CommandHandler
