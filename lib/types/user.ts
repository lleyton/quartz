const filter = (search: string) => {
  return (member: any) => member.user.username.toLowerCase() === search || (member.nick && member.nick.toLowerCase() === search) || `${member.user.username.toLowerCase()}#${member.user.discriminator}` === search
}

class UserType {
  client: any
  constructor (client: any) {
    this.client = client
  }

  parse (value: string, msg: any) {
    if (!value || !msg) return undefined
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
    if (!msg.channel.guild) return undefined
    const search = value.toLowerCase()
    const members = msg.channel.guild.members.filter(filter(search))
    if (members.length === 0) return undefined
    if (members.length === 1) return members[0].user
    if (members.length > 1) {
      return 'More then one user found. Be more specific.'
    }
  }
}

export default UserType
