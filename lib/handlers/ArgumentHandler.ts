import Eris from 'eris'
import Command from '../structures/Command'
import { Message } from '../QuartzTypes'

interface Argument {
  key?: string
  type?: string
  prompt?: string | ((msg: any) => void)
  default?: string | ((msg: any) => void)
}

/** ArgumentHandler Class */
class ArgumentHandler {
  private client: any
  private command: any
  private args: string[]
  private string: any
  private types: string[]

  /**
   * Create the argumentHandler
   * @param {object} client - Eris Client object
   * @param {object} command - Quartz Command object
   * @param {array} args - An array of strings as args
   */
  constructor (client: Eris.Client, command: Command, args: string[]) {
    this.client = client
    this.command = command
    this.args = args
    this.string = args.join(' ')
    this.types = ['user', 'string', 'channel', 'role', 'message', 'integer', 'float']
  }

  /**
   * Determine if the args is quoted
   * @return {array} Returns an array of strings with quotes removed
   */
  private quoted (): string[] {
    let quoted = this.string.match(/“(?:\.|(\\\“)|[^\“”\n])*”|(?:[^\s"]+|"[^"]*")/g)
    if (quoted && quoted.length > 0) {
      quoted = quoted.map((q: string) => {
        if (q.startsWith('"') && q.endsWith('"') || q.startsWith('“') && q.endsWith('”')) return q.slice(1, -1)
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
  prompt (msg: Message, key: string, prompt: string | Function): Promise<Message> | void {
    if (typeof prompt === 'string') {
      return msg.embed(prompt)
    } else if (typeof prompt === 'function') {
      return prompt(msg)
    } else {
      return msg.embed(`No result for ${key} found.`)
    }
  }

  /**
   * Determine if the arg has a default
   * @param {object} arg - The argument object
   * @param {object} msg - The key of the argument
   * @return {string|void} Returns text
   */
  default (arg: Argument, msg: Message): string | void {
    if (!arg.default) return undefined
    if (typeof arg.default === 'string') {
      return arg.default
    } else if (typeof arg.default === 'function') {
      return arg.default(msg)
    } else {
      return undefined
    }
  }

  /**
   * Run the argument parser
   * @param {object} msg - The key of the argument
   * @return {any} Returns result
   */
  parse (msg: Message): { [key: string]: Argument } | string[]  {
    if (this.command.args && this.command.args.length > 0) {
      const parsed: any = {}
      const args = this.quoted()
      let prompt = false
      this.command.args.forEach((arg: Argument) => {
        if (arg.key && arg.type && this.types.includes(arg.type)) {
          const CustomType = require(`../types/${arg.type}`).default
          const type = new CustomType(this.client)
          const defaultValue = this.default(arg, msg)
          if (!defaultValue && (!args || args.length <= 0 || !args[this.command.args.indexOf(arg)] || this.command.args.indexOf(arg).length <= 0)) {
            prompt = true
            return this.prompt(msg, arg.key, arg.prompt)
          }
          if (!args || args.length <= 0) {
            prompt = true
            return this.prompt(msg, arg.key, arg.prompt)
          }
          if (this.command.args.slice(-1)[0].key === arg.key) {
            args.splice(0, this.command.args.length - 1)
            let result = type.parse(args.join(' ') || '' || defaultValue || '', msg)
            if (!result) {
              if (defaultValue) result = defaultValue
              else {
                prompt = true
                return this.prompt(msg, arg.key, arg.prompt)
              }
            }
            parsed[arg.key] = result
          } else {
            let result = type.parse(args[this.command.args.indexOf(arg)] || defaultValue || '', msg)
            if (!result) {
              if (defaultValue) result = defaultValue
              else {
                prompt = true
                return this.prompt(msg, arg.key, arg.prompt)
              }
            }
            parsed[arg.key] = result
          }
        }
      })
      if (prompt) return undefined
      return parsed || this.args
    } else {
      return this.args
    }
  }
}

export default ArgumentHandler
