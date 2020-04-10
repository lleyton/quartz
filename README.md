![](https://file.coffee/g5x8wAFT4.png)

<h1 align="center"><strong>Quartz</strong></h1>

<h4 align="center">The heart of [Points](https://points.city)</h4>

## Setup

 1. Run `npm i https://github.com/pointscity/quartz.git` or `yarn add https://github.com/pointscity/quartz.git`
 2. Then run `npm i eris` or `yarn add eris`
 4. Setup client and command handler

## Examples

Client Example:
```js
import { Client } from 'quartz'
import { resolve } from 'path'

const client = new QuartzClient('TOKEN', {
  owner: 'ownerID',
  eventHandler: {
    directory: resolve('./events')
  },
  commandHandler: {
    directory: resolve('./commands'),
    prefix: '!'
  }
})

client.start()
```

Command Example:
```js
import { Command } from 'quartz'

class Ping extends Command {
  constructor (client) {
    super(client, {
      name: 'ping',
      aliases: ['pong'],
      description: {
        content: 'Returns ping'
      }
    })
  }

  run (msg, args) {
    return msg.channel.createMessage('Pong!')
  }
}

export default Ping
```

Event Example:
```js
import { Event } from 'quartz'

class Ready extends Event {
  constructor (client) {
    super(client, {
      name: 'ready'
    })
  }

  run () {
    return console.log('Bot Ready!')
  }
}
export default Ready
```