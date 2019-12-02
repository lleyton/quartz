class StringType {
  client: any
  constructor (client: any) {
    this.client = client
  }

  parse (value: string, msg: any) {
    if (!value || value.length <= 0 || !msg || typeof value !== 'string') return undefined
    return value
  }
}

export default StringType
