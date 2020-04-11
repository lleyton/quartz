import Base from './Base'
import { Client } from '..'
import { EventOptions } from '../types'

/** Event Class */
class Event extends Base {
  /**
   * Create the eventHandler
   * @param {object} client - Client object
   * @param {object} options - Options object
   */
  name: string

  constructor (client: Client, options: EventOptions = {}) {
    super(client)
    const {
      name = ''
    }: EventOptions = options

    this.name = name
  }

  /**
   * Run when command called
   */
  public run (): Promise<void> | void {
    throw new Error(`${this.constructor.name}#run has not been implemented`)
  }
}

export default Event
