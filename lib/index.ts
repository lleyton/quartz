if (Number(process.version.slice(1).split('.')[0]) < 10) throw new Error('Node 10 or higher is required.')

import 'source-map-support/register'

import Client from './client'
import { Message } from './types'
import Base from './structures/Base'
import Command from './structures/Command'
import Event from './structures/Event'
import Embed from './structures/Embed'

export {
  Client,
  Base,
  Command,
  Event,
  Embed,
  Message
}
