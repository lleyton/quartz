import Eris from 'eris'

declare module 'eris' {
  interface Message extends Eris.Message {
    guild: Eris.Guild
    embed(message: string, options?: any): Promise<Eris.Message>
    color(): string
    text(): string
    logo(): string
    settings(): any
  }
}