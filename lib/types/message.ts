import Eris from 'eris'

class MessageType {
  client: Eris.Client
  constructor (client: Eris.Client) {
    this.client = client
  }

  parse (value: string, msg: Eris.Message) {
    if (!value || value.length <= 0 || !msg || typeof value !== 'string') return undefined
    return msg.channel.messages.get(value) || undefined
  }
}

export default MessageType
