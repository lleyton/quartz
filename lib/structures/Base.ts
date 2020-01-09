import Eris from 'eris'
import QuartzClient from '../QuartzClient'
import LogHandler from '../handlers/LogHandler'

/** Base Class */
class Base {
  /**
   * Create the eventHandler
   * @param {object} quartzClient - QuartzClient object
   */
  private _quartz: QuartzClient

  constructor (quartzClient: QuartzClient) {
    this._quartz = quartzClient
  }

  /**
   * Get the quartz client object
   * @return {object} The quartz client object.
   */
  public get quartz (): QuartzClient {
    return this._quartz
  }

  /**
   * Get the eris client object
   * @return {object} The eris client object.
   */
  public get client (): Eris.Client {
    return this._quartz.client
  }

  /**
   * Get the logger object
   * @return {object} The logger object.
   */
  public get logger (): LogHandler {
    return this._quartz.logger
  }
}
export default Base
