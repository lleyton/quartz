![](https://file.coffee/g5x8wAFT4.png)

<h1 align="center"><strong>Quartz</strong></h1>

<h4 align="center">The heart of [Points](https://points.city)</h4>

## Setup

 1. Run `npm i @pointscity/quartz` or `yarn add @pointscity/quartz`
 2. Then run `npm i eris` or `yarn add eris`
 4. Setup client and command handler

## Examples

Client Example:
```ts
import { Client } from 'quartz'
import { resolve } from 'path'

const client = new Client('TOKEN', {
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
```ts
import { Command, CommandContext, Client } from 'quartz'

class Ping extends Command {
  client: Client

  constructor (client: Client) {
    super(client, {
      name: 'ping',
      aliases: ['pong'],
      description: {
        content: 'Returns ping'
      }
    })
  }

  run (context: CommandContext) {
    return context.message.channel.createMessage('Pong!')
  }
}

export default Ping
```

Event Example:
```js
import { Event, Client } from 'quartz'

class Ready extends Event {
  client: Client

  constructor (client: Client) {
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