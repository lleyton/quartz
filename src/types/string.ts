import { Message } from 'eris'
import { Client } from '..'

class StringType {
  client: Client

  constructor (client: Client) {
    this.client = client
  }

  parse (value: string, msg: Message): string {
    if (!value || value.length <= 0 || !msg || typeof value !== 'string') return undefined
    return value
  }
}

export default StringType
