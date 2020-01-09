import Eris from 'eris'

class IntegerType {
  client: Eris.Client
  constructor (client: Eris.Client) {
    this.client = client
  }

  parse (value: string, msg: Eris.Message) {
    if (!value || value.length <= 0 || !msg || typeof value !== 'string') return undefined
    const integer = Number.parseInt(value)
    return integer
  }
}

export default IntegerType
