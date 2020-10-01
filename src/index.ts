import 'source-map-support/register'

import Client from './client'
import Command from './structures/Command'
import Event from './structures/Event'
import Embed from './structures/Embed'
import { CommandContext, CommandOptions } from './typings'

if (Number(process.version.slice(1).split('.')[0]) < 10) throw new Error('Node 10 or higher is required.')

export {
  Client,
  Command,
  Event,
  Embed,
  CommandContext,
  CommandOptions
}
