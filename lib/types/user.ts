import Eris from 'eris'

const filter = (search: string) => {
  return (member: any) => member.user.username.toLowerCase() === search || (member.nick && member.nick.toLowerCase() === search) || `${member.user.username.toLowerCase()}#${member.user.discriminator}` === search
}

class UserType {
  client: Eris.Client
  constructor (client: Eris.Client) {
    this.client = client
  }

  parse (value: string, msg: Eris.Message) {
    if (!value || value.length <= 0 || !msg || typeof value !== 'string') return undefined
    const match = value.match(/^(?:<@!?)?([0-9]+)>?$/)
    if (match) {
      try {
        const user = this.client.users.get(match[1])
        if (!user) return undefined
        return user
      } catch (error) {
        return undefined
      }
    }
    if (!msg.member.guild) return undefined
    const search = value.toLowerCase()
    const members = msg.member.guild.members.filter(filter(search))
    if (members.length === 0) return undefined
    if (members.length === 1) return members[0].user
    if (members.length > 1) {
      return 'More then one user found. Be more specific.'
    }
  }
}

export default UserType
