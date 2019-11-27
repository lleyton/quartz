import Base from './Base'

/** Event Class */
class Event extends Base {
  /**
   * Create the eventHandler
   * @param {object} client - Client object
   * @param {object} options - Options object
   */
  private _client: any
  name: string

  constructor (client: any, options = {}) {
    super(client)
    const {
      name = ''
    }: any = options

    this.name = name
    this._client = client
  }

  /**
   * Get the eris client object
   * @return {object} The eris client object.
   */
  public get client () {
    return this._client
  }

  /**
   * Run when command called
   */
  public run () {
    throw new Error(`${this.constructor.name}#run has not been implemented`)
  }
}
export default Event
