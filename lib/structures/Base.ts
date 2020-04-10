import Eris from 'eris'
import { Client } from '..'
import LogHandler from '../handlers/LogHandler'

/** Base Class */
class Base {
  /**
   * Create the eventHandler
   * @param {object} quartzClient - QuartzClient object
   */
  private _client: Client

  constructor (client: Client) {
    this._client = client
  }
  /**
   * Get the eris client object
   * @return {object} The eris client object.
   */
  public get client (): Eris.Client {
    return this._client
  }

  /**
   * Get the logger object
   * @return {object} The logger object.
   */
  public get logger (): LogHandler {
    return this._client.logger
  }
}
export default Base
