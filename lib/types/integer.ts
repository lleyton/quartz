class IntegerType {
  client: any
  constructor (client: any) {
    this.client = client
  }

  parse (value: string, msg: any) {
    if (!value || value.length <= 0 || !msg || typeof value !== 'string') return undefined
    const integer = Number.parseInt(value)
    return integer
  }
}

export default IntegerType
