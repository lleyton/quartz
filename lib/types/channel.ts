const filter = (search: string) => {
  return (channel: any) => channel.name.toLowerCase() === search
}

class ChannelType {
  client: any
  constructor (client: any) {
    this.client = client
  }

  parse (value: string, msg: any) {
    if (!value || !msg || !msg.channel.guild) return undefined
    const match = value.match(/^(?:<#)?([0-9]+)>?$/)
    if (match) {
      try {
        const channel = msg.channel.guild.channels.get(match[1])
        if (!channel) return undefined
        return channel
      } catch (error) {
        return undefined
      }
    }
    const search = value.toLowerCase()
    const channels = msg.channel.guild.channels.filter(filter(search))
    if (channels.length === 0) return undefined
    if (channels.length === 1) return channels[0]
    if (channels.length > 1) {
      return 'More then one channel found. Be more specific.'
    }
  }
}

export default ChannelType