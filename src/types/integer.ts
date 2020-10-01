import { Message } from 'eris'
import { Client } from '..'

class IntegerType {
  client: Client
  constructor (client: Client) {
    this.client = client
  }

  parse (value: string, msg: Message): number {
    if (!value || value.length <= 0 || !msg || typeof value !== 'string') return undefined
    const integer = Number.parseInt(value)
    return integer
  }
}

export default IntegerType
