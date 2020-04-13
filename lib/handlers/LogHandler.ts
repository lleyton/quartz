import COLOR from 'chalk'

/** LogHandler Class */
class LogHandler {
  name: string
  color: string

  constructor (name: string, color: string) {
    this.name = name
    this.color = color
  }

  /**
   * Send warning to console
   * @param {string} message - The warning message
   */
  public warn (...message: string[]): void {
    console.log(COLOR.yellow('[WARNING]'))
    console.warn(...message)
  }

  /**
   * Send error to console
   * @param {string} message - The error message
   */
  public error (...message: string[]): void {
    console.log(COLOR.red('[ERROR]'))
    console.log(...message)
    console.trace()
  }

  /**
   * Send info to console
   * @param {string} message - The info message
   */
  public info (...message: string[]): void {
    console.log(COLOR.hex(this.color || '#ffffff')(`[${this.name.toUpperCase()}]: `) + COLOR.yellow(...message))
  }

  /**
   * Send console to console
   * @param {string} message - The console message
   */
  public console (...message: string[]): void {
    console.log(...message)
  }
}

export default LogHandler
