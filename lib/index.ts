import 'source-map-support/register'

import Client from './client'
import Base from './structures/Base'
import Command from './structures/Command'
import Event from './structures/Event'
import Embed from './structures/Embed'
import Message from './structures/Message'

if (Number(process.version.slice(1).split('.')[0]) < 10) throw new Error('Node 10 or higher is required.')

export {
  Client,
  Base,
  Command,
  Event,
  Embed,
  Message
}
