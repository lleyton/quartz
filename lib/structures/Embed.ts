/** Embed Class */
class Embed {
  /**
   * Create the embed
   * @param {object} data - Data object
   */

  fields: any[]
  url: string
  author: {
    name: string
    icon_url: string
    url: string
  }

  color: number
  description: string
  file: string
  footer: {
    text: string
    icon_url: string
  }

  image: {
    url: string
  }

  date: Date
  title: string
  thumbnail: {
    url: string
  }

  constructor (data = {}) {
    this.fields = []
    Object.assign(this, data)
    return this
  }

  /**
   * Author for the embed
   * @param {string} name - The username displayed in the embed header
   * @param {string} icon - The icon displayed in the embed header
   * @param {string} url - The url displayed in the embed header
   */
  setAuthor (name: string, icon: string, url: string): this {
    this.author = { name, icon_url: icon, url }
    return this
  }

  /**
   * Color for the embed
   * @param {string} color - A color hex that is a string or a number
   */
  setColor (color: string | number): this {
    if (typeof color === 'string') color = parseInt(color.replace('#', ''), 16)
    if (color < 0 || color > 0xFFFFFF) throw new RangeError('Color range is invaild.')
    else if (isNaN(color)) throw new TypeError('Unable to convert color.')
    this.color = color
    return this
  }

  /**
   * Description for the embed
   * @param {string} desc - Set the description field of the embed
   */
  setDescription (desc: string): this {
    this.description = desc.toString().substring(0, 2048)
    return this
  }

  /**
   * Field for the embed
   * @param {string} name - A name
   * @param {string} value - A value
   * @param {boolean} inline - A inline
   */
  addField (name: string, value: string, inline: boolean = false): this {
    if (this.fields.length >= 25) return this
    else if (name === '') throw new TypeError('Missing name field.')
    else if (value === '') throw new TypeError('Missing value field.')
    this.fields.push({ name: name.toString().substring(0, 256), value: value.toString().substring(0, 1024), inline })
    return this
  }

  /**
   * File for the embed
   * @param {string} file - A file
   */
  setFile (file: string): this {
    this.file = file
    return this
  }

  /**
   * Footer for the embed
   * @param {string} text - A text
   * @param {string} icon - A icon
   */
  setFooter (text: string, icon: string): this {
    this.footer = { text: text.toString().substring(0, 2048), icon_url: icon }
    return this
  }

  /**
   * Image for the embed
   * @param {string} url - A url
   */
  setImage (url: string): this {
    this.image = { url }
    return this
  }

  /**
   * Timestamp for the embed
   * @param {date} time - A date
   */
  setTimestamp (time = new Date()): this {
    this.date = time
    return this
  }

  /**
   * Title for the embed
   * @param {string} title - A title
   */
  setTitle (title: string): this {
    this.title = title.toString().substring(0, 256)
    return this
  }

  /**
   * Thumbnail for the embed
   * @param {string} url - A url
   */
  setThumbnail (url: string): this {
    this.thumbnail = { url }
    return this
  }

  /**
   * URL for the embed
   * @param {string} url - A url
   */
  setURL (url: string): this {
    this.url = url
    return this
  }
}

export default Embed
