import { Message } from 'eris'
import Command from '../structures/Command'
import { Argument } from '../typings'
import path from 'path'
import { Client } from '..'

/** ArgumentHandler Class */
class ArgumentHandler {
  private readonly client: Client
  private readonly command: Command
  private readonly args: string[]
  private readonly string: any
  private readonly types: string[]

  /**
   * Create the argumentHandler
   * @param {object} client - Eris Client object
   * @param {object} command - Quartz Command object
   * @param {array} args - An array of strings as args
   */
  constructor (client: Client, command: Command, args: string[]) {
    this.client = client
    this.command = command
    this.args = args
    this.string = args.join(' ')
    this.types = ['user', 'string', 'channel', 'role', 'message', 'integer', 'float', 'member']
  }

  /**
   * Determine if the args is quoted
   * @return {array} Returns an array of strings with quotes removed
   */
  private quoted (): string[] {
    let quoted = this.string.match(/“(?:\.|(\\“)|[^“”\n])*”|(?:[^\s"]+|"[^"]*")/g)
    if (quoted && quoted.length > 0) {
      quoted = quoted.map((q: string) => {
        if ((q.startsWith('"') && q.endsWith('"')) || (q.startsWith('“') && q.endsWith('”'))) return q.slice(1, -1)
        else return q
      })
    }
    return quoted || undefined
  }

  /**
   * Determine if the args has prompts
   * @param {object} msg - The eris message object
   * @param {string} key - The key of the argument
   * @param {string|function} prompt - String or function of the prompt
   * @return {void} runs the prompt
   */
  async prompt (msg: Message, key: string, prompt: string | Function): Promise<void> {
    if (typeof prompt === 'string') await msg.channel.createMessage(prompt)
    else if (typeof prompt === 'function') await prompt(msg)
    else await msg.channel.createMessage(`No result for ${key} found.`)
  }

  /**
   * Determine if the arg has a default
   * @param {object} arg - The argument object
   * @param {object} msg - The key of the argument
   * @return {string|void} Returns text
   */
  default (arg: Argument, msg: Message): string | void {
    if (!arg.default) return undefined
    if (typeof arg.default === 'string') arg.default
    else if (typeof arg.default === 'function') arg.default(msg)
    else return undefined
  }

  /**
   * Run the argument parser
   * @param {object} msg - The key of the argument
   * @return {any} Returns result
   */
  async parse (msg: Message): Promise<any[]> {
    try {
      if (this.command.args && this.command.args.length > 0) {
        const args = this.quoted()
        let prompt = false
        const parsed = this.command.args.map(async (arg) => {
          if (arg.key && arg.type && this.types.includes(arg.type)) {
            let CustomType: any = await import(path.join('..', 'types', arg.type))
            if (typeof CustomType !== 'function') CustomType = CustomType.default
            const type = new CustomType(this.client)
            const defaultValue = this.default(arg, msg)
            if (defaultValue === 'undefined' && (!args || args.length <= 0 || !args[this.command.args.indexOf(arg)] || this.command.args.indexOf(arg) <= 0)) {
              prompt = true
              await this.prompt(msg, arg.key, arg.prompt)
              return
            }
            if (!args || args.length <= 0) {
              prompt = true
              await this.prompt(msg, arg.key, arg.prompt)
              return
            }
            if (this.command.args.slice(-1)[0].key === arg.key) {
              args.splice(0, this.command.args.length - 1)
              let result = type.parse(args.join(' ') || '' || defaultValue || '', msg)
              if (!result) {
                if (defaultValue) result = defaultValue
                else {
                  prompt = true
                  await this.prompt(msg, arg.key, arg.prompt)
                  return
                }
              }
              return result
            } else {
              let result = type.parse(args[this.command.args.indexOf(arg)] || defaultValue || '', msg)
              if (!result) {
                if (defaultValue) result = defaultValue
                else {
                  prompt = true
                  await this.prompt(msg, arg.key, arg.prompt)
                  return
                }
              }
              return result
            }
          }
        })
        if (prompt) return undefined
        return parsed || this.args
      } else return this.args
    } catch (error) {
      return undefined
    }
  }
}

export default ArgumentHandler
