import Eris from 'eris'

class FloatType {
  client: Eris.Client
  constructor (client: Eris.Client) {
    this.client = client
  }

  parse (value: string, msg: Eris.Message) {
    if (!value || value.length <= 0 || !msg || typeof value !== 'string') return undefined
    const float = Number.parseFloat(value)
    return float
  }
}

export default FloatType
