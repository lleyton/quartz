import { Command, Client } from '..'
import { Collection, Message } from 'eris'

class CooldownHandler {
  readonly #client: Client
  cooldowns: Collection<any> = new Collection(undefined, 100)

  constructor (client: Client) {
    this.#client = client
  }

  check (msg: Message, command: Command) {
    const checkCooldown = this.cooldowns.get(msg.author.id)
    if (checkCooldown?.expires) {
      if (new Date(checkCooldown.expires) < new Date()) {
        this.cooldowns.delete(msg.author.id)
        this.cooldowns.set(msg.author.id, {
          expires: Date.now() + command.cooldown.expires,
          notified: false,
          command: 1
        })
      } else if (!checkCooldown.notified && checkCooldown.command >= command.cooldown.command) {
        checkCooldown.notified = true
        this.cooldowns.set(msg.author.id, checkCooldown)
        return this.#client.emit('ratelimited', msg, command, true, checkCooldown.expires)
      } else if (checkCooldown.notified && checkCooldown.command >= command.cooldown.command) return this.#client.emit('ratelimited', msg, command, false, checkCooldown.expires)
      else {
        this.cooldowns.set(msg.author.id, {
          expires: Date.now() + Number(command.cooldown.expires),
          notified: false,
          command: checkCooldown.command
        })
      }
    } else {
      this.cooldowns.set(msg.author.id, {
        expires: Date.now() + Number(command.cooldown.expires),
        notified: false,
        command: 1
      })
    }
  }
}

export default CooldownHandler
