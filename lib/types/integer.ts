class IntegerType {
  client: any
  constructor (client: any) {
    this.client = client
  }

  parse (value: string, msg: any) {
    if (!value || !msg) return undefined
    const integer = Number.parseInt(value)
    return integer
  }
}

export default IntegerType
