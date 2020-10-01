import { Client } from '..'
import LogHandler from '../handlers/LogHandler'

/** Base Class */
class Base {
  private readonly _client: Client

  /**
   * Create the eventHandler
   * @param {object} client - QuartzClient object
   */
  constructor (client: Client) {
    this._client = client
  }

  /**
   * Get the eris client object
   * @return {object} The eris client object.
   */
  public get client (): Client {
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
