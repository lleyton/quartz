class StringType {
  client: any
  constructor (client: any) {
    this.client = client
  }

  parse (value: string, msg: any) {
    if (!value || !msg) return undefined
    return value
  }
}

export default StringType
