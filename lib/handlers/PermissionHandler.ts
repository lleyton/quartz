import { Client, Command } from '..'
import { Message } from '../typings'
import Eris from 'eris'

class PermissionHandler {
  private readonly _client: Client

  constructor (client: Client) {
    this._client = client
  }

  async bot (msg: Message, command: Command, channelPermissions: Eris.Permission): Promise<boolean> {
    if (!command.botPermissions) return true
    if (typeof command.botPermissions === 'function') {
      const missing = await command.botPermissions(msg)
      if (missing != null) {
        this._client.emit('missingPermission', msg, command, missing, true)
        return false
      }
      return true
    } else if (msg.member?.guild) {
      const botPermissions = msg.member?.guild.members.get(this._client.user.id).permission
      if (command.botPermissions instanceof Array) {
        const hasPermission = command.botPermissions.some((permission) => botPermissions.has(permission) || channelPermissions.has(permission))
        if (!hasPermission) {
          this._client.emit('missingPermission', msg, command, command.botPermissions, true)
          return false
        }
      } else {
        if (!botPermissions.has(command.botPermissions) && !channelPermissions.has(command.botPermissions)) {
          this._client.emit('missingPermission', msg, command, command.botPermissions)
          return false
        }
      }
      return true
    }
  }

  async user (msg: Message, command: Command): Promise<boolean> {
    if (!command.userPermissions) return true
    if (typeof command.userPermissions === 'function') {
      const missing = await command.userPermissions(msg)
      if (missing) {
        if (missing !== 'ignore') this._client.emit('missingPermission', msg, command, missing, false)
        return false
      }
      return true
    } else if (msg.member?.guild) {
      if (Array.isArray(command.userPermissions)) {
        const userPermissions = msg.member?.permission
        const hasPermission = command.userPermissions.some((permission) => userPermissions.has(permission))
        if (!hasPermission) {
          this._client.emit('missingPermission', msg, command, command.userPermissions, false)
          return false
        }
      } else {
        const permission = msg.member.permission.has(command.userPermissions)
        if (!permission) {
          this._client.emit('missingPermission', msg, command, command.userPermissions, false)
          return false
        }
      }
      return true
    }
  }
}

export default PermissionHandler
