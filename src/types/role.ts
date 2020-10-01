import { Role, Message } from 'eris'
import { Client } from '..'

const filter = (search: string) => {
  return (role: any) => role.name.toLowerCase() === search
}

class RoleType {
  client: Client

  constructor (client: Client) {
    this.client = client
  }

  parse (value: string, msg: Message): Role | string {
    if (!value || value.length <= 0 || !msg || !msg.member?.guild || typeof value !== 'string') return undefined
    const match = value.match(/^(?:<@&)?([0-9]+)>?$/)
    if (match) {
      try {
        const user = msg.member?.guild.roles.get(match[1])
        if (!user) return undefined
        return user
      } catch (error) {
        return undefined
      }
    }
    const search = value.toLowerCase()
    const roles = msg.member?.guild.roles.filter(filter(search))
    if (roles.length === 0) return undefined
    if (roles.length === 1) return roles[0]
    if (roles.length > 1) {
      return 'More then one user found. Be more specific.'
    }
  }
}

export default RoleType
