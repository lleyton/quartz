import { Message, Client } from '..'

class FloatType {
  client: Client
  constructor (client: Client) {
    this.client = client
  }

  parse (value: string, msg: Message) {
    if (!value || value.length <= 0 || !msg || typeof value !== 'string') return undefined
    const float = Number.parseFloat(value)
    return float
  }
}

export default FloatType
