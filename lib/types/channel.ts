import Eris from 'eris'
import { Client, Message } from '..'

const filter = (search: string) => {
  return (channel: Eris.TextChannel) => channel.name.toLowerCase() === search
}

class ChannelType {
  client: Client
  constructor (client: Client) {
    this.client = client
  }

  parse (value: string, msg: Message) {
    if (!value || value.length <= 0 || !msg || !msg.member?.guild || typeof value !== 'string') return undefined
    const match = value.match(/^(?:<#)?([0-9]+)>?$/)
    if (match) {
      try {
        const channel = msg.member?.guild.channels.get(match[1])
        if (!channel) return undefined
        return channel
      } catch (error) {
        return undefined
      }
    }
    const search = value.toLowerCase()
    const channels = msg.member?.guild.channels.filter(filter(search))
    if (channels.length === 0) return undefined
    if (channels.length === 1) return channels[0]
    if (channels.length > 1) {
      return 'More then one channel found. Be more specific.'
    }
  }
}

export default ChannelType