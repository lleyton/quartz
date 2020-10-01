import { Message } from 'eris'
import { Client } from '..'

class MessageType {
  client: Client

  constructor (client: Client) {
    this.client = client
  }

  parse (value: string, msg: Message): Message {
    if (!value || value.length <= 0 || !msg || typeof value !== 'string') return undefined
    return msg.channel.messages.get(value) || undefined
  }
}

export default MessageType
