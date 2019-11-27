class MessageType {
  client: any
  constructor (client: any) {
    this.client = client
  }

  parse (value: string, msg: any) {
    if (!value || !msg) return undefined
    return msg.channel.messages.get(value) || undefined
  }
}

export default MessageType
