class FloatType {
  client: any
  constructor (client: any) {
    this.client = client
  }

  parse (value: string, msg: any) {
    if (!value || !msg) return undefined
    const float = Number.parseFloat(value)
    return float
  }
}

export default FloatType
