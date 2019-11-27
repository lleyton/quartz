
/** Base Class */
class Base {
  /**
   * Create the eventHandler
   * @param {object} quartzClient - QuartzClient object
   */
  private _quartz: any

  constructor (quartzClient: any) {
    this._quartz = quartzClient
  }

  /**
   * Get the quartz client object
   * @return {object} The quartz client object.
   */
  public get quartz () {
    return this._quartz
  }

  /**
   * Get the eris client object
   * @return {object} The eris client object.
   */
  public get client () {
    return this._quartz.client
  }

  /**
   * Get the logger object
   * @return {object} The logger object.
   */
  public get logger () {
    return this._quartz.logger
  }
}
export default Base
